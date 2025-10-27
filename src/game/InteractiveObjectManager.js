import { PressurePlate } from './components/PressurePlate.js';
import { GLTFPlatform } from './components/GLTFPlatform.js';

export class InteractiveObjectManager {
  constructor(scene, physicsWorld, player) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.player = player;
    
    this.objects = new Map(); // id -> object instance
    this.triggers = []; // Array of trigger connections
  }
  
  async loadInteractiveObjects(levelData) {
    console.log('Loading interactive objects...');
    
    if (!levelData.interactiveObjects) {
      console.log('No interactive objects in level data');
      return;
    }
    
    // Load each object
    for (const objData of levelData.interactiveObjects) {
      try {
        const obj = await this._createObject(objData);
        if (obj) {
          this.objects.set(objData.id, obj);
          console.log(`Loaded interactive object: ${objData.id} (${objData.objectType})`);
        }
      } catch (error) {
        console.error(`Failed to load interactive object ${objData.id}:`, error);
      }
    }
    
    // Setup triggers after all objects are loaded
    if (levelData.triggers) {
      this._setupTriggers(levelData.triggers);
    }
    
    console.log(`Loaded ${this.objects.size} interactive objects`);
  }
  
  async _createObject(objData) {
    switch (objData.objectType) {
      case 'pressurePlate':
        return this._createPressurePlate(objData);
      
      case 'gltfPlatform':
        return this._createGLTFPlatform(objData);
      
      // Future object types can be added here:
      // case 'door':
      //   return this._createDoor(objData);
      // case 'button':
      //   return this._createButton(objData);
      // case 'lever':
      //   return this._createLever(objData);
      
      default:
        console.warn(`Unknown interactive object type: ${objData.objectType}`);
        return null;
    }
  }
  
  async _createPressurePlate(objData) {
    const pressurePlate = new PressurePlate(objData, this.scene, this.physicsWorld);
    await pressurePlate.create();
    return pressurePlate;
  }
  
  async _createGLTFPlatform(objData) {
    const platform = new GLTFPlatform(objData, this.scene, this.physicsWorld);
    await platform.create();
    return platform;
  }
  
  _setupTriggers(triggers) {
    console.log(`Setting up ${triggers.length} trigger connections...`);
    
    for (const trigger of triggers) {
      const source = this.objects.get(trigger.sourceId);
      const target = this.objects.get(trigger.targetId);
      
      if (!source) {
        console.warn(`Trigger source not found: ${trigger.sourceId}`);
        continue;
      }
      if (!target) {
        console.warn(`Trigger target not found: ${trigger.targetId}`);
        continue;
      }
      
      // Setup callbacks based on trigger type
      switch (trigger.type) {
        case 'activate':
          // Source activates when triggered, target activates
          source.onActivate = () => {
            console.log(`Trigger: ${trigger.sourceId} -> ${trigger.targetId} (activate)`);
            target.activate();
          };
          break;
        
        case 'deactivate':
          // Source activates, target deactivates
          source.onActivate = () => {
            console.log(`Trigger: ${trigger.sourceId} -> ${trigger.targetId} (deactivate)`);
            target.deactivate();
          };
          break;
        
        case 'toggle':
          // Source activates, target toggles
          source.onActivate = () => {
            console.log(`Trigger: ${trigger.sourceId} -> ${trigger.targetId} (toggle)`);
            if (target.state === 'idle') {
              target.activate();
            } else {
              target.deactivate();
            }
          };
          break;
        
        case 'custom':
          // Custom logic defined by trigger.customLogic function string
          if (trigger.customLogic) {
            try {
              // eslint-disable-next-line no-new-func
              const customFunc = new Function('source', 'target', 'manager', trigger.customLogic);
              source.onActivate = () => {
                console.log(`Trigger: ${trigger.sourceId} -> ${trigger.targetId} (custom)`);
                customFunc(source, target, this);
              };
            } catch (error) {
              console.error(`Failed to setup custom trigger logic for ${trigger.sourceId}:`, error);
            }
          }
          break;
        
        default:
          console.warn(`Unknown trigger type: ${trigger.type}`);
      }
      
      this.triggers.push({ source, target, config: trigger });
      console.log(`Connected trigger: ${trigger.sourceId} -> ${trigger.targetId} (${trigger.type})`);
    }
  }
  
  update(delta) {
    // Update all interactive objects
    for (const obj of this.objects.values()) {
      if (obj.update) {
        obj.update(delta);
      }
    }
  }
  
  getObjectById(id) {
    return this.objects.get(id);
  }
  
  getAllObjects() {
    return Array.from(this.objects.values());
  }
  
  getObjectsByType(objectType) {
    return Array.from(this.objects.values()).filter(obj => obj.data.objectType === objectType);
  }
  
  // Add object dynamically (for editor or runtime spawning)
  async addObject(objData) {
    if (this.objects.has(objData.id)) {
      console.warn(`Object with id ${objData.id} already exists`);
      return null;
    }
    
    try {
      const obj = await this._createObject(objData);
      if (obj) {
        this.objects.set(objData.id, obj);
        console.log(`Added interactive object: ${objData.id}`);
        return obj;
      }
    } catch (error) {
      console.error(`Failed to add object ${objData.id}:`, error);
    }
    
    return null;
  }
  
  // Remove object dynamically
  removeObject(id) {
    const obj = this.objects.get(id);
    if (!obj) {
      console.warn(`Object ${id} not found`);
      return false;
    }
    
    // Remove associated triggers
    this.triggers = this.triggers.filter(t => 
      t.source !== obj && t.target !== obj
    );
    
    // Destroy the object
    if (obj.destroy) {
      obj.destroy();
    }
    
    this.objects.delete(id);
    console.log(`Removed interactive object: ${id}`);
    return true;
  }
  
  // Add trigger connection dynamically
  addTrigger(triggerData) {
    const source = this.objects.get(triggerData.sourceId);
    const target = this.objects.get(triggerData.targetId);
    
    if (!source || !target) {
      console.warn('Cannot add trigger: source or target not found');
      return false;
    }
    
    this._setupTriggers([triggerData]);
    return true;
  }
  
  // Get all triggers for a specific object
  getTriggersForObject(objectId) {
    return this.triggers.filter(t => 
      t.source.data.id === objectId || t.target.data.id === objectId
    );
  }
  
  // Clean up all objects
  dispose() {
    console.log('Disposing interactive objects...');
    
    for (const obj of this.objects.values()) {
      if (obj.destroy) {
        obj.destroy();
      }
    }
    
    this.objects.clear();
    this.triggers = [];
  }
  
  // Debug method to print object states
  debugPrintStates() {
    console.log('=== Interactive Objects States ===');
    for (const [id, obj] of this.objects.entries()) {
      console.log(`${id}: ${obj.state} (${obj.data.objectType})`);
    }
  }
}
