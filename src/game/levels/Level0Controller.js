// src/game/levels/Level0Controller.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Level0Controller {
  constructor(game, level) {
    this.game = game;
    this.level = level;
    this.richard = null;  // yellow_bot
    this.steve = null;  // other_bot
    this.isInitialized = false;
    this.cutsceneActive = false;
    this.pacingActive = false;
    this.enterKeyListener = null;
    this._enterPressed = false;
    this.pacingInterval = null;
    this.exclamationGroup = null;
    this._pulseAnimationId = null;
    this.interactionDialogueShown = false;
    this.richardInteractionHandler = null;
    this.cloudIndicatorGroup = null;
    this.steveExclamationGroup = null;
    this._steveTrackingEnabled = false;
    
    // Get references to NPCs once
    this._initializeNpcs();
    
    // Set up interaction system after initialization
    this._setupRichardInteraction();
  }

  /**
   * Initialize NPC references and make them non-interactable
   */
  _initializeNpcs() {
    this.richard = this._findNpc('yellow_bot');
    this.steve = this._findNpc('other_bot');
    
    if (!this.richard || !this.steve) {
      console.warn('⚠️ [Level0Controller] NPCs not found! richard:', !!this.richard, 'steve:', !!this.steve);
      return;
    }
    
    // Make NPCs non-interactable (kinematic)
    this._makeNpcNonInteractable(this.richard);
    this._makeNpcNonInteractable(this.steve);
    
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
    this.cutsceneActive = true;

    try {
      // === PHASE 1: Initial Cutscene (Richard Pacing) ===
      console.log('🎬 Phase 1: Richard pacing sequence');
      
      // Hide player at start
      if (this.game.player && this.game.player.mesh) {
        this.game.player.mesh.visible = false;
      }
      
      // Take camera control first
      director.takeControl();
      
      // Position Richard at first pacing point
      const startPos = new THREE.Vector3(22.40, 10.66, -15.98);
      this.richard.mesh.position.copy(startPos);
      if (this.richard.body) {
        this.richard.body.position.set(startPos.x, startPos.y, startPos.z);
      }
      
      // Position Steve at specified coordinates (Y raised by 2 units to prevent ground clipping)
      const stevePos = new THREE.Vector3(28.91, 12.66, -1.21); // Y: 10.66 + 2 = 12.66
      this.steve.mesh.position.copy(stevePos);
      if (this.steve.body) {
        this.steve.body.position.set(stevePos.x, stevePos.y, stevePos.z);
      }
      // Make Steve face Richard initially
      this._makeNpcFaceTarget(this.steve, this.richard.mesh.position);
      
      // Phase 1 Camera Setup
      const phase1CameraPos = [13.995355025604136, 24.462215106591177, -24.03644489247951];
      const phase1LookAt = [24.508108581913948, 15.547428649192854, -9.544771590776822];
      
      console.log('📷 Phase 1 Camera position:', phase1CameraPos);
      console.log('👀 Looking at:', phase1LookAt);
      
      // Set camera position
      director.cutTo({
        position: phase1CameraPos,
        lookAt: phase1LookAt,
        fov: 60
      });
      
      // Sync freeCam yaw/pitch to prevent override
      const lookAtVec = new THREE.Vector3(...phase1LookAt);
      const cam = director.cam;
      const dir = lookAtVec.clone().sub(cam.position).normalize();
      director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
      director.freeCam.yaw = Math.atan2(dir.x, dir.z);
      
      // Ensure fade element is completely transparent (scene fully visible)
      if (director._fadeEl) {
        director._fadeEl.style.transition = 'none';
        director._fadeEl.style.opacity = '0';
        // Force immediate update
        director._fadeEl.offsetHeight; // Force reflow
      }
      
      // Wait to ensure everything is set up
      await this._wait(200);
      
      // Debug: Log camera and fade state
      console.log('📷 Camera position:', cam.position.toArray());
      console.log('👀 Camera lookAt target:', phase1LookAt);
      console.log('🎭 Fade element opacity:', director._fadeEl?.style.opacity);
      
      // Show dialogue and start pacing
      await this._showCaption('Oh no oh no oh no what are we gonna do', 3000);
      
      // Start pacing loop
      this._startPacingLoop(director);
      
      // Setup Enter key listener to trigger Phase 2
      this._setupEnterKeyListener(director);
      
      // Wait for Enter key
      await this._waitForEnter();
      
      // === PHASE 2: Transition and Dialogue ===
      console.log('🎬 Phase 2: Transition and dialogue');
      
      // Fade out (2 seconds)
      await director.fadeOut({ ms: 2000 });
      
      // Stop Richard pacing
      this._stopPacingLoop();
      
      // Phase 2 Camera Setup
      const phase2CameraPos = [-10.031263625425378, 10.511819667016473, -23.602814899439007];
      const phase2LookAt = [3.231483961981864, 19.5338645513998, -11.657010927462245];
      
      console.log('📷 Phase 2 Camera position:', phase2CameraPos);
      console.log('👀 Looking at:', phase2LookAt);
      
      // Start with zoomed in FOV (will zoom out later)
      director.cutTo({
        position: phase2CameraPos,
        lookAt: phase2LookAt,
        fov: 45
      });
      
      // Sync freeCam yaw/pitch for Phase 2
      const lookAtVec2 = new THREE.Vector3(...phase2LookAt);
      const dir2 = lookAtVec2.clone().sub(cam.position).normalize();
      director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir2.y, -1, 1));
      director.freeCam.yaw = Math.atan2(dir2.x, dir2.z);
      
      // Fade in
      await director.fadeIn({ ms: 600 });
      await this._wait(500);
      
      // Make Richard face Steve
      await this._faceNpcTo(this.richard, this.steve.mesh.position);
      
      // Add rumble and zoom out effect (right after Richard faces Steve)
      director.shake({ seconds: 1.0, magnitude: 0.15 });
      const zoomOut = director.zoomTo({ fov: 75, duration: 1500, ease: 'quadOut' });
      
      // Setup Enter key listener for Phase 2 dialogues
      this._setupEnterKeyListener(director);
      
      // Richard dialogue - wait for Enter to continue
      await this._showCaption('IF WE DO NOT GET THE NODES WE ARE SCREWD', 0); // No auto-hide
      await this._waitForEnter();
      
      // Clear caption and wait a moment
      const cm = this.level.cinematicsManager;
      if (cm && cm.dialogueUI) {
        cm._hideCaption(true);
      }
      await this._wait(300);
      
      // Re-setup Enter key listener for next dialogue
      this._setupEnterKeyListener(director);
      
      // Steve responds (but gets interrupted)
      await this._showCaption('Calm down Richard', 0); // No auto-hide
      
      // Wait a bit for the dialogue to show, then player spawns
      await this._wait(800);
      
      // Player spawns in (interrupts Steve)
      if (this.game.player && this.game.player.mesh) {
        this.game.player.mesh.visible = true;
        // Ensure player is at proper position
        const playerStart = this.level.data.startPosition;
        if (playerStart) {
          this.game.player.setPosition(new THREE.Vector3(...playerStart));
        }
      }
      
      // Wait for Enter to continue (player has spawned)
      await this._waitForEnter();
      
      // Clear caption
      if (cm && cm.dialogueUI) {
        cm._hideCaption(true);
      }
      
      // Wait for zoom to complete
      await zoomOut;
      
      // Wait a moment then end cutscene
      await this._wait(300);
      
      // Release camera control back to player
      await director.release();
      
      // Switch to third-person camera
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
        if (this.game.input) {
          this.game.input.alwaysTrackMouse = true;
          // Request pointer lock for third-person controls
          if (typeof document !== 'undefined' && !document.pointerLockElement) {
            document.body.requestPointerLock();
          }
        }
        // Ensure player is visible in third-person
        if (this.game.player && this.game.player.mesh) {
          this.game.player.mesh.visible = true;
        }
      }
      
      // Add exclamation mark above Richard's head to indicate interaction is available
      this._showExclamationMark();
      
      // Enable Richard interaction and disable other interactions
      this._enableRichardInteractionMode();
      
      this.cutsceneActive = false;
      console.log('✅ [Level0Controller] Cutscene complete!');
      
    } catch (error) {
      console.error('❌ [Level0Controller] Error during cutscene:', error);
      await director.release();
      this.cutsceneActive = false;
    }
  }
  
  /**
   * Setup Enter key listener to continue cutscene/dialogue
   */
  _setupEnterKeyListener(director) {
    // Remove existing listener if any
    if (this.enterKeyListener) {
      window.removeEventListener('keydown', this.enterKeyListener);
    }
    
    // Reset enter pressed flag
    this._enterPressed = false;
    
    this.enterKeyListener = (e) => {
      if (e.code === 'Enter' && this.cutsceneActive) {
        console.log('🎬 Enter pressed - continuing');
        this._enterPressed = true;
      }
    };
    window.addEventListener('keydown', this.enterKeyListener);
  }
  
  /**
   * Wait for Enter key to be pressed
   */
  async _waitForEnter() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this._enterPressed) {
          clearInterval(checkInterval);
          this._enterPressed = false;
          resolve();
        }
      }, 100);
    });
  }
  
  /**
   * Start Richard pacing between two points
   * @param {Object} director - Camera director for tracking
   */
  _startPacingLoop(director) {
    this.pacingActive = true;
    const point1 = new THREE.Vector3(22.40, 10.66, -15.98);
    const point2 = new THREE.Vector3(22.40, 10.66, -1.53);
    
    // Position Richard at first point
    this.richard.mesh.position.copy(point1);
    if (this.richard.body) {
      this.richard.body.position.set(point1.x, point1.y, point1.z);
    }
    
    let movingToPoint2 = true;
    
    const pacingInterval = setInterval(() => {
      if (!this.pacingActive) {
        clearInterval(pacingInterval);
        return;
      }
      
      const currentPos = this.richard.mesh.position;
      const targetPos = movingToPoint2 ? point2 : point1;
      const distance = currentPos.distanceTo(targetPos);
      
      if (distance < 0.5) {
        // Reached target - rotate and switch direction
        movingToPoint2 = !movingToPoint2;
        const nextTarget = movingToPoint2 ? point2 : point1;
        
        // Calculate rotation to face next target
        const direction = new THREE.Vector3()
          .subVectors(nextTarget, currentPos);
        direction.y = 0;
        direction.normalize();
        const targetRotation = Math.atan2(direction.x, direction.z);
        this.richard.mesh.rotation.y = targetRotation;
        
        // Show dialogue again (non-blocking so pacing continues)
        this._showCaption('Oh no oh no oh no what are we gonna do', 3000).catch(() => {});
      } else {
        // Move towards target
        const direction = new THREE.Vector3()
          .subVectors(targetPos, currentPos);
        direction.y = 0;
        direction.normalize();
        
        // Update rotation to face movement direction
        const targetRotation = Math.atan2(direction.x, direction.z);
        const currentRot = this.richard.mesh.rotation.y;
        let diff = targetRotation - currentRot;
        // Normalize to -PI to PI
        diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
        this.richard.mesh.rotation.y += diff * 0.15; // Smooth rotation
        
        // Move NPC (kinematic body)
        const speed = 0.25;
        if (this.richard.body) {
          this.richard.body.position.x += direction.x * speed;
          this.richard.body.position.z += direction.z * speed;
          this.richard.mesh.position.copy(this.richard.body.position);
        } else {
          this.richard.mesh.position.x += direction.x * speed;
          this.richard.mesh.position.z += direction.z * speed;
        }
      }
      
      // Make Steve continuously track/look at Richard
      if (this.steve && this.steve.mesh) {
        this._makeNpcFaceTarget(this.steve, this.richard.mesh.position);
      }
    }, 16); // ~60fps
    
    // Store interval ID for cleanup
    this.pacingInterval = pacingInterval;
  }
  
  /**
   * Make NPC face a target position (non-blocking, immediate)
   * @param {Object} npc - The NPC to rotate
   * @param {THREE.Vector3} targetPos - Position to face
   */
  _makeNpcFaceTarget(npc, targetPos) {
    if (!npc || !npc.mesh) return;
    
    const targetRotation = Math.atan2(
      targetPos.x - npc.mesh.position.x,
      targetPos.z - npc.mesh.position.z
    );
    
    const currentRot = npc.mesh.rotation.y;
    let diff = targetRotation - currentRot;
    // Normalize to -PI to PI
    diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    
    // Smooth rotation towards target
    npc.mesh.rotation.y += diff * 0.2; // Faster rotation for tracking
    
    // Sync body rotation if it exists (for kinematic bodies)
    if (npc.body && npc.body.type === CANNON.Body.KINEMATIC) {
      // Cannon.js uses quaternions for rotation, but we can sync Y rotation
      // For simple Y-axis rotation, we can create a quaternion
      const euler = new CANNON.Vec3(0, npc.mesh.rotation.y, 0);
      npc.body.quaternion.setFromEuler(euler.x, euler.y, euler.z);
    }
  }
  
  /**
   * Stop pacing loop
   */
  _stopPacingLoop() {
    this.pacingActive = false;
    if (this.pacingInterval) {
      clearInterval(this.pacingInterval);
      this.pacingInterval = null;
    }
    if (this.richard) {
      this._stopNpc(this.richard);
    }
    if (this.enterKeyListener) {
      window.removeEventListener('keydown', this.enterKeyListener);
      this.enterKeyListener = null;
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
    
    // Sync body position with mesh position before converting to kinematic
    // This prevents falling through ground
    if (npc.mesh && npc.mesh.position) {
      npc.body.position.set(
        npc.mesh.position.x,
        npc.mesh.position.y,
        npc.mesh.position.z
      );
      npc.body.velocity.set(0, 0, 0);
      npc.body.angularVelocity.set(0, 0, 0);
    }
    
    // Convert to kinematic body (not affected by forces from other objects)
    npc.body.type = CANNON.Body.KINEMATIC;
    npc.body.mass = 0;
    npc.body.updateMassProperties();
    
    console.log(`🤖 Made ${npc.npcType} non-interactable (kinematic) at position [${npc.mesh.position.x?.toFixed(2)}, ${npc.mesh.position.y?.toFixed(2)}, ${npc.mesh.position.z?.toFixed(2)}]`);
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
   * @param {number} ms - Duration in milliseconds (0 = no auto-hide, waits for manual hide)
   * @returns {Promise} Resolves when caption is shown (not when it hides)
   */
  _showCaption(text, ms, characterName = 'Pravesh') {
    return new Promise((resolve) => {
      const cm = this.level.cinematicsManager;
      if (!cm) {
        console.warn('⚠️ CinematicsManager not available for caption');
        resolve();
        return;
      }
      
      // Set character name in caption UI
      if (cm.dialogueUI) {
        const nameEl = cm.dialogueUI.querySelector('.caption-name');
        if (nameEl) {
          nameEl.textContent = characterName;
        }
      }
      
      // If ms is 0, show caption indefinitely (will be hidden manually)
      if (ms === 0) {
        cm._showCaption(text, 999999).then(() => resolve()); // Long timeout, will be hidden manually
      } else {
        cm._showCaption(text, ms).then(resolve);
      }
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
   * Set up Richard interaction handler
   */
  _setupRichardInteraction() {
    // This will be called from game loop to check proximity
    // We'll check in the update method instead
  }

  /**
   * Enable interaction mode where only Richard can be interacted with
   */
  _enableRichardInteractionMode() {
    // Store original interact handlers
    if (!this._originalDoorInteract) {
      this._originalDoorInteract = this.game.doorManager?.interactWithClosestDoor;
    }
    
    // Override door interactions to check for Richard first
    if (this.game.doorManager) {
      this.game.doorManager.interactWithClosestDoor = (playerPos) => {
        // Check if player is near Richard first
        if (this._isPlayerNearRichard()) {
          this._handleRichardInteraction();
          return true; // Consumed the interaction
        }
        // Completely disable doors during this phase if not near Richard
        console.log('🚪 Doors are disabled - interact with Richard first');
        return false;
      };
    }
    
    // Disable collectible interactions during this phase
    if (!this._originalCollectibleInteract) {
      this._originalCollectibleInteract = this.game.collectiblesManager?.handleInteraction;
    }
    
    if (this.game.collectiblesManager) {
      this.game.collectiblesManager.handleInteraction = () => {
        // Check if player is near Richard first
        if (this._isPlayerNearRichard()) {
          this._handleRichardInteraction();
          return true; // Consumed the interaction
        }
        // Consume interaction even when not near Richard to block doors
        // Player needs to go to Richard first
        return true; // Consume to prevent doors from being checked
      };
    }
    
    console.log('🎬 [Level0Controller] Richard interaction mode enabled - doors and collectibles disabled');
  }

  /**
   * Check if player is near Richard
   */
  _isPlayerNearRichard(radius = 3.0) {
    if (!this.richard || !this.richard.mesh || !this.game.player) return false;
    
    const playerPos = this.game.player.getPosition();
    const richardPos = this.richard.mesh.position;
    
    const distance = playerPos.distanceTo(richardPos);
    return distance <= radius;
  }

  /**
   * Handle Richard interaction when player presses E
   */
  async _handleRichardInteraction() {
    if (this.interactionDialogueShown) {
      return; // Already shown
    }
    
    this.interactionDialogueShown = true;
    console.log('🎬 [Level0Controller] Starting Richard interaction dialogue');
    
    // Hide exclamation mark
    if (this.exclamationGroup) {
      this.exclamationGroup.visible = false;
    }
    
    // Play the interaction dialogue sequence
    await this._playRichardInteractionDialogue();
  }

  /**
   * Play Richard interaction dialogue sequence
   */
  async _playRichardInteractionDialogue() {
    const cm = this.level.cinematicsManager;
    if (!cm) {
      console.error('❌ [Level0Controller] CinematicsManager not found for interaction dialogue');
      return;
    }

    const director = cm.director;
    
    // Set cutscene active flag so Enter key listener works
    this.cutsceneActive = true;
    
    try {
      // Make both NPCs face the player before dialogue starts
      if (this.game.player && this.game.player.mesh) {
        const playerPos = this.game.player.mesh.position;
        await this._faceNpcTo(this.richard, playerPos);
        await this._faceNpcTo(this.steve, playerPos);
      }
      
      // Take camera control
      director.takeControl();
      
      // Move camera to Phase 1 position (with player now visible)
      const phase1CameraPos = [13.995355025604136, 24.462215106591177, -24.03644489247951];
      const phase1LookAt = [24.508108581913948, 15.547428649192854, -9.544771590776822];
      
      // Smooth transition instead of cut
      await director.fadeOut({ ms: 400 });
      director.cutTo({
        position: phase1CameraPos,
        lookAt: phase1LookAt,
        fov: 60
      });
      
      // Sync freeCam yaw/pitch to prevent override (same as Phase 1)
      const lookAtVec = new THREE.Vector3(...phase1LookAt);
      const cam = director.cam;
      const dir = lookAtVec.clone().sub(cam.position).normalize();
      director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
      director.freeCam.yaw = Math.atan2(dir.x, dir.z);
      
      await director.fadeIn({ ms: 400 });
      
      // Setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Dialogue 1: Richard - "Whoa! Where did you come from? Didn't you see the alarms?!"
      await this._showCaption('Whoa! Where did you come from? Didn\'t you see the alarms?!', 0, 'Richard');
      await this._waitForEnter();
      
      // Clear caption
      const cm2 = this.level.cinematicsManager;
      if (cm2 && cm2.dialogueUI) {
        cm2._hideCaption(true);
      }
      await this._wait(300);
      
      // Re-setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Dialogue 2: Richard - "It's the nodes! The primary nodes from the Data Tree! They're gone!"
      await this._showCaption('It\'s the nodes! The primary nodes from the Data Tree! They\'re gone!', 0, 'Richard');
      await this._waitForEnter();
      
      // Clear caption
      if (cm2 && cm2.dialogueUI) {
        cm2._hideCaption(true);
      }
      await this._wait(300);
      
      // Re-setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Dialogue 3: Richard - "The... the crawlers! They took them! Into the Left and Right Branches! We're doomed!"
      await this._showCaption('The... the crawlers! They took them! Into the Left and Right Branches! We\'re doomed!', 0, 'Richard');
      await this._waitForEnter();
      
      // Clear caption
      if (cm2 && cm2.dialogueUI) {
        cm2._hideCaption(true);
      }
      await this._wait(300);
      
      // Make Steve turn to player
      if (this.game.player && this.game.player.mesh) {
        await this._faceNpcTo(this.steve, this.game.player.mesh.position);
      }
      
      // Re-setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Dialogue 4: Steve - "Calm down. This one looks... capable. More capable than us, at least."
      await this._showCaption('Calm down. This one looks... capable. More capable than us, at least.', 0, 'Steve');
      await this._waitForEnter();
      
      // Clear caption
      if (cm2 && cm2.dialogueUI) {
        cm2._hideCaption(true);
      }
      await this._wait(300);
      
      // Re-setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Dialogue 5: Steve - "Listen, we're just system monitors. But you... you can move. Can you help us? Can you go into the branches and get those nodes back?"
      await this._showCaption('Listen, we\'re just system monitors. But you... you can move. Can you help us? Can you go into the branches and get those nodes back?', 0, 'Steve');
      await this._waitForEnter();
      
      // Clear caption
      if (cm2 && cm2.dialogueUI) {
        cm2._hideCaption(true);
      }
      await this._wait(300);
      
      // Re-setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Dialogue 6: Richard - "Yes, please! The doors are unlocked! Hurry!"
      await this._showCaption('Yes, please! The doors are unlocked! Hurry!', 0, 'Richard');
      await this._waitForEnter();
      
      // Clear caption
      if (cm2 && cm2.dialogueUI) {
        cm2._hideCaption(true);
      }
      
      // Setup post-dialogue NPC positioning and indicators
      await this._setupPostDialogueNPCs(director);
      
      // Release camera control
      await director.release();
      
      // Switch back to third-person camera
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
        if (this.game.input) {
          this.game.input.alwaysTrackMouse = true;
          if (typeof document !== 'undefined' && !document.pointerLockElement) {
            document.body.requestPointerLock();
          }
        }
      }
      
      // Re-enable doors and other interactions
      this._disableRichardInteractionMode();
      
      // Clear cutscene active flag
      this.cutsceneActive = false;
      
      console.log('✅ [Level0Controller] Richard interaction dialogue complete!');
      
    } catch (error) {
      console.error('❌ [Level0Controller] Error during interaction dialogue:', error);
      await director.release();
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      this._disableRichardInteractionMode();
      this.cutsceneActive = false;
    }
  }

  /**
   * Disable Richard-only interaction mode (restore normal interactions)
   */
  _disableRichardInteractionMode() {
    // Restore door interactions
    if (this.game.doorManager && this._originalDoorInteract) {
      this.game.doorManager.interactWithClosestDoor = this._originalDoorInteract;
    }
    
    // Restore collectible interactions
    if (this.game.collectiblesManager && this._originalCollectibleInteract) {
      this.game.collectiblesManager.handleInteraction = this._originalCollectibleInteract;
    }
    
    console.log('🎬 [Level0Controller] Richard interaction mode disabled - normal interactions restored');
  }

  /**
   * Show exclamation mark above Richard's head
   */
  _showExclamationMark() {
    if (!this.richard || !this.richard.mesh) {
      console.warn('⚠️ [Level0Controller] Cannot show exclamation mark - Richard not found');
      return;
    }

    // Create canvas texture for exclamation mark
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw exclamation mark
    ctx.fillStyle = '#FF0000'; // Gold color
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', canvas.width / 2, canvas.height / 2);
    
    // Add glow effect
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 30;
    ctx.fillText('!', canvas.width / 2, canvas.height / 2);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false
    });
    
    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.5, 1.5, 1); // Size of the exclamation mark
    
    // Create a group to hold the sprite and position it above Richard's head
    this.exclamationGroup = new THREE.Group();
    
    // Position above head (adjust Y offset based on NPC height)
    const npcHeight = this.richard.size?.[1] || 0.8;
    this.exclamationGroup.position.y = npcHeight + 6; // Position above head (slightly higher)
    
    this.exclamationGroup.add(sprite);
    
    // Add pulsing animation
    let pulsePhase = 0;
    const pulseUpdate = () => {
      if (!this.exclamationGroup || !this.exclamationGroup.parent) {
        if (this._pulseAnimationId) {
          cancelAnimationFrame(this._pulseAnimationId);
          this._pulseAnimationId = null;
        }
        return;
      }
      
      pulsePhase += 0.05;
      const scale = 1 + Math.sin(pulsePhase) * 0.15; // Pulse between 0.85 and 1.15
      this.exclamationGroup.scale.setScalar(scale);
      
      // Sprites automatically face the camera, so no need for lookAt
      
      this._pulseAnimationId = requestAnimationFrame(pulseUpdate);
    };
    this._pulseAnimationId = requestAnimationFrame(pulseUpdate);
    
    // Add to Richard's mesh so it moves with him
    this.richard.mesh.add(this.exclamationGroup);
    
    console.log('⚠️ [Level0Controller] Exclamation mark added above Richard');
  }

  /**
   * Setup NPCs after dialogue completion: fade, teleport, add indicators
   */
  async _setupPostDialogueNPCs(director) {
    console.log('🎬 [Level0Controller] Setting up post-dialogue NPC positions');
    
    // Start fade out (don't await yet)
    const fadePromise = director.fadeOut({ ms: 800 });
    
    // During fade out, teleport NPCs to new positions instantly
    // Steve position: (2.10, 12.66, -38.45) - Y raised by 2 units to prevent ground clipping
    const stevePos = new THREE.Vector3(2.10, 12.66, -38.45);
    if (this.steve && this.steve.mesh) {
      this.steve.mesh.position.copy(stevePos);
      if (this.steve.body) {
        this.steve.body.position.set(stevePos.x, stevePos.y, stevePos.z);
        // Ensure kinematic
        this.steve.body.type = CANNON.Body.KINEMATIC;
        this.steve.body.velocity.set(0, 0, 0);
        this.steve.body.angularVelocity.set(0, 0, 0);
      }
    }
    
    // Richard position: (30.14, 10.66, -7.76)
    const richardPos = new THREE.Vector3(30.14, 10.66, -7.76);
    if (this.richard && this.richard.mesh) {
      this.richard.mesh.position.copy(richardPos);
      // Face positive X direction (Math.PI / 2)
      this.richard.mesh.rotation.y = Math.PI / 2;
      if (this.richard.body) {
        this.richard.body.position.set(richardPos.x, richardPos.y, richardPos.z);
        // Ensure kinematic
        this.richard.body.type = CANNON.Body.KINEMATIC;
        this.richard.body.velocity.set(0, 0, 0);
        this.richard.body.angularVelocity.set(0, 0, 0);
      }
    }
    
    // Wait for fade out to complete, then fade in
    await fadePromise;
    await director.fadeIn({ ms: 800 });
    
    // Setup visual indicators
    this._showCloudIndicator(); // Cloud above Richard
    this._showExclamationMarkForSteve(); // Exclamation above Steve
    
    // Enable Steve player tracking
    this._steveTrackingEnabled = true;
    
    console.log('✅ [Level0Controller] Post-dialogue NPC setup complete');
  }

  /**
   * Show cloud indicator above Richard's head
   */
  _showCloudIndicator() {
    if (!this.richard || !this.richard.mesh) {
      console.warn('⚠️ [Level0Controller] Cannot show cloud indicator - Richard not found');
      return;
    }

    // Create canvas texture for cloud
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cloud shape (mangled/distorted cloud)
    ctx.fillStyle = '#888888'; // Gray cloud color
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 3;
    
    // Draw multiple overlapping circles to create cloud shape
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Main cloud body (distorted/mangled look)
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY, 25, 0, Math.PI * 2);
    ctx.arc(centerX, centerY - 15, 30, 0, Math.PI * 2);
    ctx.arc(centerX + 35, centerY, 28, 0, Math.PI * 2);
    ctx.arc(centerX + 10, centerY + 20, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add some darker patches for "mangled" effect
    ctx.fillStyle = '#555555';
    ctx.beginPath();
    ctx.arc(centerX - 25, centerY + 10, 15, 0, Math.PI * 2);
    ctx.arc(centerX + 25, centerY - 5, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect
    ctx.shadowColor = '#888888';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#999999';
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY, 25, 0, Math.PI * 2);
    ctx.arc(centerX, centerY - 15, 30, 0, Math.PI * 2);
    ctx.arc(centerX + 35, centerY, 28, 0, Math.PI * 2);
    ctx.arc(centerX + 10, centerY + 20, 22, 0, Math.PI * 2);
    ctx.fill();
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
      depthWrite: false
    });
    
    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2.0, 2.0, 1); // Slightly larger than exclamation
    
    // Create a group to hold the sprite and position it above Richard's head
    this.cloudIndicatorGroup = new THREE.Group();
    
    // Position above head
    const npcHeight = this.richard.size?.[1] || 0.8;
    this.cloudIndicatorGroup.position.y = npcHeight + 6;
    
    this.cloudIndicatorGroup.add(sprite);
    
    // Add subtle floating animation
    let floatPhase = 0;
    const floatUpdate = () => {
      if (!this.cloudIndicatorGroup || !this.cloudIndicatorGroup.parent) return;
      
      floatPhase += 0.03;
      const offset = Math.sin(floatPhase) * 0.1; // Gentle vertical float
      this.cloudIndicatorGroup.position.y = npcHeight + 6 + offset;
      
      // Sprites automatically face the camera
      
      requestAnimationFrame(floatUpdate);
    };
    floatUpdate();
    
    // Add to Richard's mesh so it moves with him
    this.richard.mesh.add(this.cloudIndicatorGroup);
    
    console.log('☁️ [Level0Controller] Cloud indicator added above Richard');
  }

  /**
   * Show exclamation mark above Steve's head
   */
  _showExclamationMarkForSteve() {
    if (!this.steve || !this.steve.mesh) {
      console.warn('⚠️ [Level0Controller] Cannot show exclamation mark - Steve not found');
      return;
    }

    // Create canvas texture for exclamation mark
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw exclamation mark
    ctx.fillStyle = '#ffd700'; // Gold color
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', canvas.width / 2, canvas.height / 2);
    
    // Add glow effect
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 30;
    ctx.fillText('!', canvas.width / 2, canvas.height / 2);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false
    });
    
    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.5, 1.5, 1); // Size of the exclamation mark
    
    // Create a group to hold the sprite and position it above Steve's head
    this.steveExclamationGroup = new THREE.Group();
    
    // Position above head (using same offset as Richard's exclamation mark)
    const npcHeight = this.steve.size?.[1] || 0.8;
    this.steveExclamationGroup.position.y = npcHeight + 1; // Same as Richard's original offset
    
    this.steveExclamationGroup.add(sprite);
    
    // Add pulsing animation
    let pulsePhase = 0;
    const pulseUpdate = () => {
      if (!this.steveExclamationGroup || !this.steveExclamationGroup.parent) return;
      
      pulsePhase += 0.05;
      const scale = 1 + Math.sin(pulsePhase) * 0.15; // Pulse between 0.85 and 1.15
      this.steveExclamationGroup.scale.setScalar(scale);
      
      // Sprites automatically face the camera
      
      requestAnimationFrame(pulseUpdate);
    };
    pulseUpdate();
    
    // Add to Steve's mesh so it moves with him
    this.steve.mesh.add(this.steveExclamationGroup);
    
    console.log('⚠️ [Level0Controller] Exclamation mark added above Steve');
  }

  /**
   * Update method - should be called from game loop to track player with Steve
   */
  update(delta) {
    // Update Steve's rotation to track player
    if (this._steveTrackingEnabled && this.steve && this.steve.mesh && this.game && this.game.player && this.game.player.mesh) {
      const playerPos = this.game.player.mesh.position;
      const stevePos = this.steve.mesh.position;
      
      // Calculate direction to player
      const targetRotation = Math.atan2(
        playerPos.x - stevePos.x,
        playerPos.z - stevePos.z
      );
      
      // Smoothly rotate toward player
      const currentRot = this.steve.mesh.rotation.y;
      const diff = targetRotation - currentRot;
      
      // Normalize to -PI to PI
      let normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
      
      // Smooth rotation
      this.steve.mesh.rotation.y += normalizedDiff * 0.1; // Adjust speed as needed
    }
  }

  /**
   * Dispose and cleanup
   */
  dispose() {
    console.log('🧹 [Level0Controller] Disposing...');
    
    // Stop pacing and remove listeners
    this._stopPacingLoop();
    
    // Stop pulsing animation
    if (this._pulseAnimationId) {
      cancelAnimationFrame(this._pulseAnimationId);
      this._pulseAnimationId = null;
    }
    
    // Remove exclamation mark if it exists
    if (this.exclamationGroup && this.richard && this.richard.mesh) {
      this.richard.mesh.remove(this.exclamationGroup);
      // Clean up resources
      this.exclamationGroup.traverse((child) => {
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
        if (child.geometry) child.geometry.dispose();
      });
      this.exclamationGroup = null;
    }
    
    // Remove cloud indicator if it exists
    if (this.cloudIndicatorGroup && this.richard && this.richard.mesh) {
      this.richard.mesh.remove(this.cloudIndicatorGroup);
      // Clean up resources
      this.cloudIndicatorGroup.traverse((child) => {
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
        if (child.geometry) child.geometry.dispose();
      });
      this.cloudIndicatorGroup = null;
    }
    
    // Remove Steve exclamation mark if it exists
    if (this.steveExclamationGroup && this.steve && this.steve.mesh) {
      this.steve.mesh.remove(this.steveExclamationGroup);
      // Clean up resources
      this.steveExclamationGroup.traverse((child) => {
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
        if (child.geometry) child.geometry.dispose();
      });
      this.steveExclamationGroup = null;
    }
    
    // Clean up any timers or pending operations
    this.richard = null;
    this.steve = null;
    this.isInitialized = false;
    this.cutsceneActive = false;
  }
}


