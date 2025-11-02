import * as THREE from 'three';
import * as CANNON from 'cannon-es';

/**
 * TriggerManager
 * Manages proximity-based triggers for level loading and other interactions
 * Triggers are defined in levelData and can display prompts when player is nearby
 */
export class TriggerManager {
  constructor(scene, physicsWorld, game) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.game = game;
    this.triggers = [];
    this.activeTrigger = null; // Currently highlighted trigger
    this.triggerBodies = []; // Physics bodies for debug visualization
  }

  /**
   * Load triggers from level data
   * @param {Array|Object} triggersData - Triggers as flat array or nested object with categories
   */
  loadTriggers(triggersData = null) {
    // Clear existing triggers
    this.disposeTriggers();

    if (!triggersData) {
      console.log('ℹ️ No triggers in level data');
      return;
    }

    console.log(`📍 Loading triggers from level data`);

    let triggerCount = 0;
    
    // Handle flat array format (new style)
    if (Array.isArray(triggersData)) {
      for (const trigData of triggersData) {
        try {
          this._createTrigger(trigData);
          triggerCount++;
        } catch (error) {
          console.error(`❌ Failed to create trigger:`, error);
        }
      }
    } 
    // Handle nested object format (old style with categories like levelLoaders, custom, etc)
    else if (typeof triggersData === 'object') {
      for (const triggerType in triggersData) {
        const triggersArray = triggersData[triggerType];
        
        if (Array.isArray(triggersArray)) {
          for (const trigData of triggersArray) {
            try {
              this._createTrigger(trigData);
              triggerCount++;
            } catch (error) {
              console.error(`❌ Failed to create trigger:`, error);
            }
          }
        }
      }
    }

    console.log(`✅ Loaded ${triggerCount} triggers`);
  }

  /**
   * Create a single trigger from data
   * @private
   */
  _createTrigger(trigData) {
    // Infer type from presence of targetLevel (levelLoader) or other fields
    let type = 'levelLoader';
    if (trigData.customAction || trigData.eventType) {
      type = 'custom';
    }

    const trigger = {
      id: trigData.id || `trigger_${Math.random()}`,
      type: trigData.type || type,
      position: new THREE.Vector3(...trigData.position),
      radius: trigData.radius || 5,
      poiText: trigData.poiText || 'Interact',
      targetLevel: trigData.targetLevel || null, // For levelLoader type
      active: false,
      cooldown: 0
    };

    // Validate level exists if type is levelLoader
    if (trigger.type === 'levelLoader' && trigger.targetLevel) {
      const levelExists = this.game.levelManager.levels.find(
        (l) => l.id === trigger.targetLevel
      );
      if (!levelExists) {
        console.warn(
          `⚠️ Trigger "${trigger.id}" references non-existent level: ${trigger.targetLevel}`
        );
      }
    }

    this.triggers.push(trigger);

    // Create physics body for collision detection (only for debug, not for actual physics)
    const shape = new CANNON.Box(new CANNON.Vec3(trigger.radius, trigger.radius, trigger.radius));
    const body = new CANNON.Body({ mass: 0, shape });
    body.position.set(trigger.position.x, trigger.position.y, trigger.position.z);
    body.collisionResponse = 0; // No collision response (sensor)
    this.physicsWorld.addBody(body);
    this.triggerBodies.push(body);

    console.log(
      `  ✓ Trigger "${trigger.id}" (${trigger.type}) at [${trigger.position.x.toFixed(2)}, ${trigger.position.y.toFixed(2)}, ${trigger.position.z.toFixed(2)}] - radius ${trigger.radius}`
    );
  }

  /**
   * Update triggers each frame
   * @param {THREE.Vector3} playerPos - Player's world position
   * @param {InputManager} input - Input manager for key detection
   */
  update(playerPos, input) {
    let closestTrigger = null;
    let closestDist = Infinity;

    // Find closest trigger within range
    for (const trigger of this.triggers) {
      const dist = playerPos.distanceTo(trigger.position);

      if (dist < trigger.radius && dist < closestDist) {
        closestTrigger = trigger;
        closestDist = dist;
      }
    }

    // Update active trigger
    if (closestTrigger !== this.activeTrigger) {
      this.activeTrigger = closestTrigger;

      if (closestTrigger) {
        console.log(`✨ Entered trigger: "${closestTrigger.id}"`);
      } else {
        console.log('✨ Left all triggers');
      }

      // Notify UI of change
      if (this.game && this.game.ui) {
        this.game.ui.updateTriggerPrompt(closestTrigger);
      } else {
        console.warn('⚠️ TriggerManager: game.ui not available', {
          hasGame: !!this.game,
          hasUI: !!this.game?.ui
        });
      }
    }

    // Handle interaction if E key pressed and trigger is active
    if (this.activeTrigger && input && input.keys && input.keys['KeyE']) {
      if (!input._triggerConsummed) {
        // Prevent repeated firing while key is held
        input._triggerConsummed = true;
        this._handleTriggerInteraction(this.activeTrigger);
      }
    } else if (input) {
      input._triggerConsummed = false;
    }
  }

  /**
   * Handle trigger interaction
   * @private
   */
  _handleTriggerInteraction(trigger) {
    console.log(`🎯 Trigger activated: "${trigger.id}"`);

    switch (trigger.type) {
      case 'levelLoader':
        this._handleLevelLoad(trigger);
        break;

      case 'custom':
        if (trigger.onInteract) {
          trigger.onInteract();
        }
        break;

      default:
        console.warn(`⚠️ Unknown trigger type: ${trigger.type}`);
    }
  }

  /**
   * Handle level loading trigger
   * @private
   */
  _handleLevelLoad(trigger) {
    if (!trigger.targetLevel) {
      console.warn(`⚠️ Level loader trigger "${trigger.id}" has no targetLevel`);
      return;
    }

    console.log(`🚀 Loading level: ${trigger.targetLevel}`);

    // Load the level through game's level loading system
    if (this.game && this.game.loadLevelByName) {
      this.game.loadLevelByName(trigger.targetLevel).catch((error) => {
        console.error(`❌ Failed to load level ${trigger.targetLevel}:`, error);
      });
    } else {
      console.error(`❌ Game or loadLevelByName method not available`);
    }
  }

  /**
   * Dispose all triggers
   */
  disposeTriggers() {
    // Remove physics bodies
    for (const body of this.triggerBodies) {
      this.physicsWorld.removeBody(body);
    }
    this.triggerBodies = [];

    this.triggers = [];
    this.activeTrigger = null;

    console.log('🗑️ Disposed all triggers');
  }

  /**
   * Get currently active trigger
   */
  getActiveTrigger() {
    return this.activeTrigger;
  }

  /**
   * Debug: visualize all trigger boxes
   */
  debugVisualizeTriggers() {
    for (const trigger of this.triggers) {
      const geometry = new THREE.BoxGeometry(trigger.radius * 2, trigger.radius * 2, trigger.radius * 2);
      const material = new THREE.MeshBasicMaterial({
        color: trigger.type === 'levelLoader' ? 0x00ff00 : 0xffff00,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(trigger.position);
      this.scene.add(mesh);
    }
  }
}
