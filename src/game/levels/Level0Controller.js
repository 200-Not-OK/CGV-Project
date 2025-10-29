// src/game/levels/Level0Controller.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Level0Controller {
  constructor(game, level) {
    this.game = game;
    this.level = level;
    this.guan = null;  // yellow_bot
    this.mike = null;  // other_bot
    this.isInitialized = false;
    
    // Get references to NPCs once
    this._initializeNpcs();
  }

  /**
   * Initialize NPC references and make them non-interactable
   */
  _initializeNpcs() {
    this.guan = this._findNpc('yellow_bot');
    this.mike = this._findNpc('other_bot');
    
    if (!this.guan || !this.mike) {
      console.warn('⚠️ [Level0Controller] NPCs not found! guan:', !!this.guan, 'mike:', !!this.mike);
      return;
    }
    
    // Make NPCs non-interactable (kinematic)
    this._makeNpcNonInteractable(this.guan);
    this._makeNpcNonInteractable(this.mike);
    
    this.isInitialized = true;
    console.log('🎬 [Level0Controller] Initialized with NPCs');
  }

  /**
   * Main entry point - start the cutscene sequence
   */
  async startSequence() {
    if (!this.isInitialized) {
      console.error('❌ [Level0Controller] Not initialized, cannot start sequence');
      return;
    }

    console.log('🎬 [Level0Controller] Starting cutscene sequence...');
    
    // Wait a moment for everything to settle
    await this._wait(500);
    
    // Play the main cutscene
    await this._playCutsceneSequence();
  }

  /**
   * Main cutscene sequence - orchestrate the entire scene
   */
  async _playCutsceneSequence() {
    const cm = this.level.cinematicsManager;
    if (!cm) {
      console.error('❌ [Level0Controller] CinematicsManager not found');
      return;
    }

    const director = cm.director;

    try {
      // === ACT 1: Opening Shot ===
      console.log('🎬 Act 1: Opening shot');
      director.takeControl();
      await cm.director.fadeOut({ ms: 400 });
      
      // Position camera looking at Guan's starting position
      director.cutTo({
        position: [-5, 12, -15],
        lookAt: [6.35, 9.44, -25.95],
        fov: 50
      });
      
      await cm.director.fadeIn({ ms: 600 });
      await this._wait(1000); // Hold shot
      
      // === ACT 2: Guan Walks and Speaks ===
      console.log('🎬 Act 2: Guan approaches');
      const guanPos1 = new THREE.Vector3(10, 9.44, -25);
      
      const npcMovement = this._moveNpcTo(this.guan, guanPos1);
      const cameraMove = director.moveTo({
        position: [5, 12, -12],
        lookAt: guanPos1.toArray(),
        duration: 2500
      });
      const dialogue = this._showCaption('Come with me... there\'s something important to see.', 2500);
      
      await Promise.all([npcMovement, cameraMove, dialogue]);
      
      // === ACT 3: Reveal Mike ===
      console.log('🎬 Act 3: Reveal Mike');
      await this._wait(500);
      
      const guanPos2 = new THREE.Vector3(13, 9.44, -30);
      
      const npcMove2 = this._moveNpcTo(this.guan, guanPos2);
      const cameraReveal = director.moveTo({
        position: [0, 15, -20],
        lookAt: [13, 9.44, -35],
        fov: 60,
        duration: 3000
      });
      const dialogue2 = this._showCaption('This is Mike. He will help you with your training.', 3000);
      
      await Promise.all([npcMove2, cameraReveal, dialogue2]);
      
      // === ACT 4: Characters Interact ===
      console.log('🎬 Act 4: Character interaction');
      this._stopNpc(this.guan);
      await this._faceNpcTo(this.guan, this.mike.mesh.position);
      
      // Camera orbits around both characters
      await director.orbitAround({
        center: [13, 9.44, -32],
        radius: 10,
        startDeg: 0,
        endDeg: 180,
        height: 8,
        duration: 4000
      });
      
      // === ACT 5: Mike Close-up ===
      console.log('🎬 Act 5: Mike introduction');
      await director.zoomTo({ fov: 35, duration: 1200 });
      
      const mikeCloseUp = director.moveTo({
        position: [13.5, 10, -32],
        lookAt: this.mike.mesh.position.toArray(),
        duration: 2000
      });
      const mikeDialogue = this._showCaption('Hello! I\'m Mike. Welcome to the training grounds.', 2000);
      
      await Promise.all([mikeCloseUp, mikeDialogue]);
      
      // === ACT 6: Wide Shot and Release ===
      console.log('🎬 Act 6: Return to player');
      await director.zoomTo({ fov: 75, duration: 1500 });
      await this._wait(1000);
      
      await director.fadeOut({ ms: 600 });
      
      // Return camera control to player
      await director.release();
      await director.fadeIn({ ms: 600 });
      
      console.log('✅ [Level0Controller] Cutscene complete!');
      
    } catch (error) {
      console.error('❌ [Level0Controller] Error during cutscene:', error);
      // Ensure camera is returned even on error
      await director.release();
    }
  }

  /**
   * Find NPC by type string
   */
  _findNpc(type) {
    if (!this.level?.npcManager) return null;
    
    for (const npc of this.level.npcManager.npcs) {
      if (npc.npcType === type) {
        return npc;
      }
    }
    return null;
  }

  /**
   * Make NPC non-interactable by converting to kinematic body
   */
  _makeNpcNonInteractable(npc) {
    if (!npc || !npc.body) {
      console.warn('⚠️ [Level0Controller] Cannot make NPC non-interactable - body not found');
      return;
    }
    
    // Convert to kinematic body (not affected by forces from other objects)
    npc.body.type = CANNON.Body.KINEMATIC;
    npc.body.mass = 0;
    npc.body.updateMassProperties();
    
    console.log(`🤖 Made ${npc.npcType} non-interactable (kinematic)`);
  }

  /**
   * Move NPC to target position smoothly
   * @param {Object} npc - The NPC to move
   * @param {THREE.Vector3} targetPos - Target position
   * @returns {Promise} Resolves when NPC reaches target
   */
  async _moveNpcTo(npc, targetPos) {
    const arrivalDistance = 0.5; // Stop when within this distance
    
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const currentPos = npc.mesh.position;
        const distance = currentPos.distanceTo(targetPos);
        
        if (distance < arrivalDistance) {
          // Reached destination
          clearInterval(checkInterval);
          this._stopNpc(npc);
          resolve();
        } else {
          // Calculate direction to target (only X and Z, keep Y)
          const direction = new THREE.Vector3()
            .subVectors(targetPos, currentPos);
          direction.y = 0; // Don't move vertically
          direction.normalize();
          
          // For kinematic bodies, directly set position
          const speed = 0.3; // Move speed in units per frame
          npc.body.position.x += direction.x * speed;
          npc.body.position.z += direction.z * speed;
          
          // Sync mesh with body
          npc.mesh.position.copy(npc.body.position);
        }
      }, 16); // Check every frame (~60fps)
    });
  }

  /**
   * Stop NPC movement
   */
  _stopNpc(npc) {
    if (!npc) return;
    
    // Stop any desired movement
    npc.setDesiredMovement(new THREE.Vector3(0, 0, 0));
    
    // For kinematic bodies, also zero velocity
    if (npc.body) {
      npc.body.velocity.set(0, 0, 0);
    }
  }

  /**
   * Make NPC face a specific position
   * @param {Object} npc - The NPC to rotate
   * @param {THREE.Vector3} targetPos - Position to face
   * @returns {Promise} Resolves when rotation is complete
   */
  async _faceNpcTo(npc, targetPos) {
    return new Promise((resolve) => {
      const lerpSpeed = 0.1;
      const targetRotation = Math.atan2(
        targetPos.x - npc.mesh.position.x,
        targetPos.z - npc.mesh.position.z
      );
      
      const checkRotation = () => {
        const currentRot = npc.mesh.rotation.y;
        const diff = targetRotation - currentRot;
        
        // Normalize to -PI to PI
        let normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
        
        if (Math.abs(normalizedDiff) < 0.05) {
          npc.mesh.rotation.y = targetRotation;
          resolve();
        } else {
          npc.mesh.rotation.y += normalizedDiff * lerpSpeed;
          requestAnimationFrame(checkRotation);
        }
      };
      
      checkRotation();
    });
  }

  /**
   * Show caption text on screen
   * @param {string} text - Text to display
   * @param {number} ms - Duration in milliseconds
   * @returns {Promise} Resolves when caption is shown
   */
  _showCaption(text, ms) {
    return new Promise((resolve) => {
      const cm = this.level.cinematicsManager;
      if (!cm) {
        console.warn('⚠️ CinematicsManager not available for caption');
        resolve();
        return;
      }
      
      cm._showCaption(text, ms).then(resolve);
    });
  }

  /**
   * Wait for a specified duration
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise}
   */
  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Dispose and cleanup
   */
  dispose() {
    console.log('🧹 [Level0Controller] Disposing...');
    
    // Clean up any timers or pending operations
    this.guan = null;
    this.mike = null;
    this.isInitialized = false;
  }
}


