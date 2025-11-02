// src/game/levels/Level0Controller.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { setupBossFight } from './BossFightIntegrationHelper.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
  this._lookAtSteveRaf = null; // RAF id for camera lookAt tracking during Steve scene
  this._lookAtPlayerRaf = null; // RAF id for camera lookAt tracking during Player focus
  
  // Enter prompt UI for dialogue
  this.enterPromptEl = null;
  this.enterPromptPulseId = null;

    // Richard voiceover audio file mapping
    this.richardVoiceoverMap = {
      'oh_no_no': 'rich_oh_no',
      'whoa': 'rich_whoa_whered_you_come',
      'nodes': 'rich_its_the_nodes',
      'crawlers': 'rich_the_crawlers',
      'yes_please': 'rich_yes_please_hurry',
      'there_is_node': 'rich_there_is_a_node',
      'press_e': 'rich_press_e',
      'theres_node': 'rich_theres_the_node',
      'nevermind': 'rich_nevermin',
      'two_ways': 'rich_you_have_two_wayd',
      'oh_no': 'rich_oh_no_stacktool',
      'nice_got_them': 'rich_nice_u_got_them',
      'this_is_bad': 'rich_this_is_bad',
      'one_infiltrated': 'rich_one_infiltrated',
      'but_please': 'rich_but_please',
      'connection_mainland': 'rich_connection_to_mainland',
      'when_decide': 'rich_when_you_decide',
      'good_job': 'rich_good_job'
    };

    // Steve voiceover audio file mapping
    this.steveVoiceoverMap = {
      'before_you_go': 'steve_before_you_go',
      'but_beware': 'steve_but_beware',
      'calm_down': 'steve_calm_down_richard',
      'how_did_they': 'steve_how_did_they',
      'it_should': 'steve_it_should',
      'listen_were': 'steve_listen_were',
      'press_x': 'steve_press_x',
      'richard_still_red': 'steve_richard_its_still_red',
      'that_should': 'steve_that_should',
      'thats_bugger': 'steve_thats_the_bugger',
      'this_one': 'steve_this_one',
      'those_crawlers': 'steve_those_crawlers',
      'wait': 'steve_wait',
      'you_can_use': 'steve_you_can_use'
    };

    // Boss fight system
    this.bossFightSystem = null; // Store boss fight instance for updates
    
    // Store initial spawn position for respawning
    this.initialSpawnPosition = level?.data?.startPosition 
      ? new THREE.Vector3(...level.data.startPosition) 
      : new THREE.Vector3(0, 12, 0);
    
    // Player death tracking
    this.lastPlayerHealth = null;
    this.playerDeathHandler = null;
    this._customRespawnHandler = null; // Custom respawn handler for boss fights
    
    // Hook into the death menu's respawn callback
    this._overrideDeathMenuRespawn();
    
    // Door trigger tutorial flags
    this._doorTriggersEnabled = false;
    this._doorTriggersConsumed = false;
    this._doorTriggerBoxes = [
      { center: new THREE.Vector3(-36.67, 10.66, -29.51), halfSize: new THREE.Vector3(15, 15, 15) }, // 30x30x30 units - huge trigger area
      { center: new THREE.Vector3( 36.67, 10.66, -29.51), halfSize: new THREE.Vector3(15, 15, 15) }  // 30x30x30 units - huge trigger area
    ];
    
    // Early door triggers (before Richard interaction)
    this._earlyDoorTriggersEnabled = false;
    this._lastEarlyDoorMessageTime = 0;
    
    // Lift area trigger flags
    this._liftTriggerEnabled = false;
    this._liftTriggerConsumed = false;
    this._liftTriggerBox = {
      center: new THREE.Vector3(-233.48, 24.44, 88.47),
      halfSize: new THREE.Vector3(15, 15, 15) // 30x30x30 units - huge trigger area
    };
    
    // Right-side approach trigger flags (huge)
    this._rightPathTriggerEnabled = true; // enabled immediately; adjust if needed
    this._rightPathTriggerConsumed = false;
    this._rightPathTriggerBox = {
      center: new THREE.Vector3(277.64, 10.91, -33.92),
      halfSize: new THREE.Vector3(15, 15, 15) // 30x30x30 units
    };
    
    // Stack tool boost hint trigger
    this._boostHintTriggerEnabled = false; // Enabled after stack tool is granted
    this._boostHintTriggerConsumed = false;
    this._boostHintTriggerBox = {
      center: new THREE.Vector3(-205.07, 11.33, -34.84),
      halfSize: new THREE.Vector3(8, 8, 8) // 16x16x16 units trigger area
    };
    
    // Node interaction tracking
    this.nodeMeshes = []; // Array of node meshes found in scene
    this.collectedNodes = new Set(); // Track collected node names
    this.currentInteractableNode = null; // Currently nearby node
    this.nodeInteractionRange = 5.0; // Interaction range in units
    this.eKeyPressed = false;
    this.lastEKeyPress = 0;
    this.nodeInteractionCooldown = 500; // ms

  // DEBUG: force second-node flow for quick testing (set to false to restore normal behavior)
  this._debugSecondNodeAlways = false;
    
    // DEBUG: enable final interaction immediately for quick boss fight testing (set to false to restore normal behavior)
    this._debugFinalInteractionAlways = false; // Set to true to skip to boss fight immediately
    
    // Richard final interaction tracking
    this.richardInteractionRange = 5.0; // Interaction range in units
    this.richardInteractionCooldown = 500; // ms
    this.lastRichardInteractionPress = 0;
    this.richardInteractionActive = false; // Track if interaction is currently happening
    this._finalBinaryChoiceEnabled = false; // Gate for Yes/No choice post-second-node
    this._disableOpeningCutscene = false; // Enable opening cutscene
    
    // Preview flag disabled
    this._forceSecondNodePreview = false;

    // Load Richard's voiceover audio files
    this._loadRichardVoiceovers();

    // Load Steve's voiceover audio files
    this._loadSteveVoiceovers();

    // Get references to NPCs once
    this._initializeNpcs();

    // Set up interaction system after initialization
    this._setupRichardInteraction();

    // Find and store node meshes
    this._findNodeMeshes();

    // Set up E key listener for node interaction
    this._setupNodeInteractionListener();

    // Ensure node HUD is hidden until after Richard's first interaction
    try {
      const hud = this.game?.ui?.get('hud');
      if (hud && hud.showNodeCounter) hud.showNodeCounter(false);
    } catch (_) {}
    
    // DEBUG: Enable final interaction immediately if flag is set
    if (this._debugFinalInteractionAlways) {
      console.log('🔧 [Level0Controller] DEBUG: Final interaction enabled immediately for testing');
      this._finalBinaryChoiceEnabled = true;
      // Show exclamation mark after a brief delay to ensure Richard is initialized
      setTimeout(() => {
        if (this.richard && this.richard.mesh) {
          this._showExclamationMark();
        }
      }, 1000);
    }
    
    // Listen for level complete event (when boss is defeated)
    this._levelCompleteHandler = (event) => {
      const levelId = event?.detail?.levelId || event?.levelId;
      if (levelId === 'level1') {
        console.log('🏁 [Level0Controller] Level complete event received for level1');
        // The game.js _onLevelComplete handler should handle showing the dialogue
        // This is just to verify the event is being received
      }
    };
    window.addEventListener('level:complete', this._levelCompleteHandler);
    
    // Expose debug function to skip directly to boss fight
    if (typeof window !== 'undefined') {
      window.skipToBossFight = () => {
        console.log('🚀 [DEBUG] Skipping to boss fight...');
        this._finalBinaryChoiceEnabled = true;
        if (this.richard && this.richard.mesh) {
          this._showExclamationMark();
        }
        // Directly trigger boss fight after a short delay to ensure everything is ready
        setTimeout(() => {
          this._teleportToBossRoom();
        }, 500);
      };
      console.log('💡 [DEBUG] Call skipToBossFight() in console to skip to boss fight');
    }
  }

  /**
   * Override death menu respawn to use custom handler during boss fights
   */
  _overrideDeathMenuRespawn() {
    // Store original respawnPlayer function
    if (this.game && this.game.respawnPlayer) {
      const originalRespawn = this.game.respawnPlayer.bind(this.game);
      
      // Replace with our interceptor
      this.game.respawnPlayer = async () => {
        // Check if we have a custom respawn handler (set during boss fight death)
        if (this._customRespawnHandler) {
          console.log('🎮 [Level0Controller] Using custom respawn handler for boss fight');
          const handler = this._customRespawnHandler;
          this._customRespawnHandler = null; // Clear it
          
          // Hide death menu
          const deathMenu = this.game.ui?.get('deathMenu');
          if (deathMenu && deathMenu.hide) {
            deathMenu.hide();
          }
          
          // Clear death state
          this.game.playerDead = false;
          if (this.game.player) this.game.player.alive = true;
          this.game.clearDeathVisualsAndState?.();
          
          // Unpause the game
          this.game.setPaused(false);
          
          // Re-enable input
          if (this.game.input && this.game.input.setEnabled) {
            this.game.input.setEnabled(true);
          }
          
          // Re-lock pointer
          if ((this.game.activeCamera === this.game.thirdCameraObject || this.game.activeCamera === this.game.firstCameraObject)
            && !document.pointerLockElement) {
            try {
              document.body.requestPointerLock();
            } catch (err) {
              console.warn('requestPointerLock on respawn failed:', err);
            }
          }
          
          // Execute custom respawn logic
          handler();
        } else {
          // Use original respawn (reload level)
          console.log('🎮 [Level0Controller] Using default respawn (reload level)');
          await originalRespawn();
        }
      };
    }
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
   * Find node meshes in the level scene
   */
  _findNodeMeshes() {
    if (!this.level || !this.level.gltfScene) {
      console.warn('⚠️ [Level0Controller] Level or gltfScene not available for node search');
      // Try again after a delay
      setTimeout(() => this._findNodeMeshes(), 1000);
      return;
    }

    const nodeNames = ['TreeNode1', 'TreeNode2'];
    this.nodeMeshes = [];

    this.level.gltfScene.traverse((obj) => {
      if (obj.isMesh && nodeNames.includes(obj.name)) {
        if (!this.collectedNodes.has(obj.name)) {
          this.nodeMeshes.push(obj);
          console.log(`🌳 [Level0Controller] Found node: ${obj.name}`);
        }
      }
    });

    if (this.nodeMeshes.length === 0) {
      console.warn('⚠️ [Level0Controller] No node meshes found. Retrying...');
      setTimeout(() => this._findNodeMeshes(), 1000);
    } else {
      console.log(`✅ [Level0Controller] Found ${this.nodeMeshes.length} node(s)`);
    }
  }

  /**
   * Set up E key listener for node interaction
   */
  _setupNodeInteractionListener() {
    if (!this.game || !this.game.input) return;

    // Check for E key in update loop instead of adding event listener
    // This avoids conflicts with existing input handling
  }

  /**
   * Check Richard final interaction proximity and handle E key press
   */
  _checkRichardFinalInteraction() {
    if (!this.game || !this.game.player || !this.game.player.mesh) return;
    if (!this.richard || !this.richard.mesh) return;
    // Skip exclamation mark check if debug flag is enabled
    if (!this._debugFinalInteractionAlways && (!this.exclamationGroup || !this.exclamationGroup.parent)) return; // Exclamation mark must be present
    if (!this._finalBinaryChoiceEnabled) return; // Only allow after second-node scene

    const playerPos = this.game.player.mesh.position;
    const richardPos = this.richard.mesh.position;
    const distance = playerPos.distanceTo(richardPos);

    // Check if player is within interaction range
    if (distance < this.richardInteractionRange) {
      // Check if E key is pressed
      const currentTime = Date.now();
      if (this.game.input && this.game.input.isKey('KeyE')) {
        if (currentTime - this.lastRichardInteractionPress > this.richardInteractionCooldown) {
          this.lastRichardInteractionPress = currentTime;
          this._handleRichardFinalInteraction();
        }
      }
    }
  }

  /**
   * Handle Richard final interaction: show dialogue menu with Yes/No options
   */
  async _handleRichardFinalInteraction() {
    if (!this.game || !this.game.player) return;
    if (this.richardInteractionActive) return; // Already in interaction

    this.richardInteractionActive = true;

    // Lock player movement
    this.game.player.lockMovement('RichardFinalInteraction');

    // Make Richard face player
    const playerPos = this.game.player.mesh.position;
    await this._faceNpcTo(this.richard, playerPos);

    // Show dialogue menu

    
    const choice = await this._showDialogueMenu('Are you ready for the binary tree?');

    // Handle choice
    if (choice === 'yes') {
      // Teleport to boss room (placeholder)
      await this._teleportToBossRoom();
    } else if (choice === 'no') {
      // Unlock movement, keep exclamation mark
      this.game.player.unlockMovement();
      // Exclamation mark stays visible - do nothing
    }

    this.richardInteractionActive = false;
  }

  /**
   * Show dialogue menu with question and Yes/No options
   * Returns 'yes' or 'no' based on player selection
   */
  async _showDialogueMenu(questionText) {
    return new Promise((resolve) => {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: "Arial", sans-serif;
      `;

      // Create menu container
      const menuContainer = document.createElement('div');
      menuContainer.style.cssText = `
        background: linear-gradient(145deg, #1a1a2e, #16213e);
        border: 3px solid #60a5fa;
        border-radius: 20px;
        padding: 30px 40px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        min-width: 400px;
        max-width: 600px;
        text-align: center;
      `;

      // Create question text
      const questionEl = document.createElement('div');
      questionEl.textContent = questionText;
      questionEl.style.cssText = `
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 30px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      `;

      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 20px;
        justify-content: center;
      `;

      // Create Yes button
      const yesButton = document.createElement('button');
      yesButton.textContent = 'Yes';
      yesButton.style.cssText = `
        background: linear-gradient(145deg, #4caf50, #388e3c);
        border: 2px solid #66bb6a;
        border-radius: 10px;
        padding: 15px 40px;
        color: #ffffff;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      `;

      yesButton.onmouseenter = () => {
        yesButton.style.transform = 'scale(1.05)';
        yesButton.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.5)';
      };
      yesButton.onmouseleave = () => {
        yesButton.style.transform = 'scale(1)';
        yesButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
      };

      // Create No button
      const noButton = document.createElement('button');
      noButton.textContent = 'No';
      noButton.style.cssText = `
        background: linear-gradient(145deg, #f44336, #d32f2f);
        border: 2px solid #ef5350;
        border-radius: 10px;
        padding: 15px 40px;
        color: #ffffff;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      `;

      noButton.onmouseenter = () => {
        noButton.style.transform = 'scale(1.05)';
        noButton.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.5)';
      };
      noButton.onmouseleave = () => {
        noButton.style.transform = 'scale(1)';
        noButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
      };

      // Button click handlers
      const cleanup = () => {
        document.body.removeChild(overlay);
      };

      yesButton.onclick = () => {
        cleanup();
        resolve('yes');
      };

      noButton.onclick = () => {
        cleanup();
        resolve('no');
      };

      // Keyboard support
      const handleKeyPress = (e) => {
        if (e.key === 'y' || e.key === 'Y' || (e.key === 'Enter' && document.activeElement === yesButton)) {
          yesButton.click();
        } else if (e.key === 'n' || e.key === 'N' || (e.key === 'Enter' && document.activeElement === noButton)) {
          noButton.click();
        } else if (e.key === 'Escape') {
          noButton.click(); // Treat Escape as No
        }
      };

      // Focus management - arrow keys
      let selectedButton = yesButton;
      yesButton.style.borderWidth = '3px';
      
      const handleArrowKeys = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          selectedButton.style.borderWidth = '2px';
          selectedButton = selectedButton === yesButton ? noButton : yesButton;
          selectedButton.style.borderWidth = '3px';
          selectedButton.focus();
          e.preventDefault();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      window.addEventListener('keydown', handleArrowKeys);

      // Cleanup event listeners when menu closes
      const originalYesClick = yesButton.onclick;
      const originalNoClick = noButton.onclick;
      
      yesButton.onclick = () => {
        window.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('keydown', handleArrowKeys);
        originalYesClick();
      };
      
      noButton.onclick = () => {
        window.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('keydown', handleArrowKeys);
        originalNoClick();
      };

      // Assemble menu
      buttonContainer.appendChild(yesButton);
      buttonContainer.appendChild(noButton);
      menuContainer.appendChild(questionEl);
      menuContainer.appendChild(buttonContainer);
      overlay.appendChild(menuContainer);
      document.body.appendChild(overlay);

      // Focus first button for keyboard navigation
      yesButton.focus();
    });
  }

  /**
   * Teleport to boss room and start boss fight cutscene
   */
  async _teleportToBossRoom() {
    if (!this.level?.cinematicsManager || !this.game?.player) return;
    const cm = this.level.cinematicsManager;
    const director = cm.director;

    console.log('🚪 [Level0Controller] Teleporting to boss room');
    
    try {
      this.cutsceneActive = true;
      
      // Lock player movement
      this.game.player.lockMovement('BossRoomTeleport');
      
      // Remove exclamation mark
      if (this.exclamationGroup && this.richard && this.richard.mesh) {
        try {
          this.richard.mesh.remove(this.exclamationGroup);
          this.exclamationGroup.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
          this.exclamationGroup = null;
        } catch (e) {
          console.warn('⚠️ [Level0Controller] Error removing exclamation mark', e);
        }
      }

      // Take camera control
      director.takeControl();
      
      // Fade out
      await director.fadeOut({ ms: 800 });
      
  // Boss arena placed far from level to avoid interference (high and offset)
  const ARENA_ORIGIN = new THREE.Vector3(2000, 600, 2000);
  const platformPos = { x: ARENA_ORIGIN.x, y: ARENA_ORIGIN.y, z: ARENA_ORIGIN.z };
  // Use symmetric placement well within a 60x60 platform bounds (±30 half extents)
  const playerPos = new THREE.Vector3(ARENA_ORIGIN.x, ARENA_ORIGIN.y + 8, ARENA_ORIGIN.z - 10);
  const bossPos   = new THREE.Vector3(ARENA_ORIGIN.x, ARENA_ORIGIN.y + 12, ARENA_ORIGIN.z + 10);
      
      // Spawn boss enemy (lobber_boss)
      let bossEnemy = null;
      if (this.level && this.level.enemyManager) {
        // Check if boss already exists
        bossEnemy = this.level.enemyManager.enemies.find(e => e.enemyType === 'lobber_boss');
        if (!bossEnemy) {
          // Spawn new boss (scale 2.5x is hardcoded in LobberBossEnemy class)
          bossEnemy = this.level.enemyManager.spawn('lobber_boss', {
            position: [bossPos.x, bossPos.y, bossPos.z],
            health: 500,
            game: this.game,
          });
        } else {
          // Reposition existing boss
          bossEnemy.setPosition(bossPos);
        }
      }

      // Setup boss fight system IMMEDIATELY so the platform exists before we place the player (prevents falling)
      if (bossEnemy) {
        const loader = new GLTFLoader();
        this.bossFightSystem = setupBossFight({
          bossEnemy,
          scene: this.game.scene,
          world: this.game.physicsWorld,
          player: this.game.player,
          thirdPersonCamera: this.game.thirdCam,
          gltfLoader: loader,
          options: {
            platformPosition: platformPos,
            platformSize: [60, 2, 60],
            onMissileImpact: (damage) => {
              // Invulnerability window at start of fight to prevent instant death
              const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
              if (this._bossFightInvulnUntil && now < this._bossFightInvulnUntil) return;
              if (this.game.player && this.game.player.takeDamage) {
                this.game.player.takeDamage(Math.max(5, Math.min(20, damage)));
              }
            },
          },
        });
      }

      // Teleport player AFTER platform is created
      if (this.game.player.body) {
        this.game.player.body.position.set(playerPos.x, playerPos.y, playerPos.z);
        this.game.player.body.velocity.set(0, 0, 0);
      }
      if (this.game.player.mesh) {
        this.game.player.mesh.position.copy(playerPos);
      }

      // Wait briefly for boss assets to appear (non-blocking for platform collisions)
      if (bossEnemy && !bossEnemy.mesh) {
        await this._wait(400);
      }
      
      // Set camera to boss view using camera rig settings (zoom in on boss)
      // Camera positioned to show boss far in front within high-alt arena
      const cameraPos = new THREE.Vector3(
        playerPos.x - 6,
        playerPos.y + 10,
        playerPos.z - 10
      );
      const bossLookAt = bossPos.clone();
      bossLookAt.y += 5; // Look at boss center
      
      director.cutTo({
        position: [cameraPos.x, cameraPos.y, cameraPos.z],
        lookAt: [bossLookAt.x, bossLookAt.y, bossLookAt.z],
        fov: 60
      });
      
      // Activate boss camera rig
      if (this.bossFightSystem && this.bossFightSystem.cameraRig) {
        this.bossFightSystem.cameraRig.activate();
      }
      
      // Sync freeCam yaw/pitch
      const cam = director.cam;
      const dir = bossLookAt.clone().sub(cameraPos).normalize();
      director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
      director.freeCam.yaw = Math.atan2(dir.x, dir.z);
      
      // Disable gameplay input during the cutscene to ensure camera control is respected
      if (this.game?.input?.setEnabled) {
        this.game.input.setEnabled(false);
        this.game.input.alwaysTrackMouse = false;
      }

  // Fade in
      await director.fadeIn({ ms: 600 });
      await this._wait(300);
      
      // Dialogue sequence (Richard and Steve not physically present, just dialogue)
      this._setupEnterKeyListener(director);
      await this._showCaption('Oh no! Your stack tool broke with the fall.', 0, 'Richard');
      
      // Break the stack tool permanently
      if (this.game.breakStackTool) {
        this.game.breakStackTool();
        console.log('[Level0] Stack tool permanently broken');
      }
      
      await this._waitForEnter();
      cm._hideCaption?.(true);
      await this._wait(200);
      
      this._setupEnterKeyListener(director);
      await this._showCaption('That\'s the bugger. Be careful.', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      await this._wait(200);
      
      // Start boss fight
      if (this.bossFightSystem && this.bossFightSystem.start) {
        // brief invulnerability window from first missile impacts
        this._bossFightInvulnUntil = (typeof performance !== 'undefined' ? performance.now() : Date.now()) + 4000;
        this.bossFightSystem.start();
        console.log('⚔️ [Level0Controller] Boss fight started');
      }
      
      // Release camera and restore gameplay
      await director.release();
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      // Auto re-lock pointer after the scene
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      // Re-enable input now that gameplay resumes
      if (this.game?.input?.setEnabled) {
        this.game.input.setEnabled(true);
        this.game.input.alwaysTrackMouse = true;
      }
      this.game.player.unlockMovement();
      this.cutsceneActive = false;
      
      console.log('✅ [Level0Controller] Boss room teleport complete');
      
    } catch (e) {
      console.error('❌ [Level0Controller] Error in boss room teleport:', e);
      try { await cm.director.release(); } catch {}
      // Auto re-lock pointer after the scene (error path)
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      if (this.game?.thirdCameraObject) this.game.activeCamera = this.game.thirdCameraObject;
      this.game?.player?.unlockMovement?.();
      this._resetFadeSafely(cm);
      this.cutsceneActive = false;
    }
  }

  /**
   * Check node proximity and handle interaction
   */
  _checkNodeProximity() {
    if (!this.game || !this.game.player || !this.game.player.mesh) return;
    if (this.cutsceneActive) return; // Don't allow node interaction during cutscenes

    const playerPos = this.game.player.mesh.position;
    this.currentInteractableNode = null;
    let closestDistance = Infinity;

    // Find closest interactable node
    for (const nodeMesh of this.nodeMeshes) {
      if (this.collectedNodes.has(nodeMesh.name)) continue; // Already collected

      const distance = playerPos.distanceTo(nodeMesh.position);
      if (distance < this.nodeInteractionRange && distance < closestDistance) {
        this.currentInteractableNode = nodeMesh;
        closestDistance = distance;
      }
    }

    // Show/hide interaction prompt for node collection
    const nodePrompt = this.game?.ui?.get('interactionPrompt');
    if (nodePrompt) {
      if (this.currentInteractableNode) {
        // Only take control if prompt is not visible or we already own it
        if (!nodePrompt.isVisible || this._nodePromptActive) {
          const currentText = nodePrompt.getText ? nodePrompt.getText() : '';
          const isComputerPrompt = currentText.includes('GLITCHED') || currentText.includes('LLMs');
          if (!isComputerPrompt) {
            nodePrompt.show('to collect node');
            this._nodePromptActive = true;
          }
        }
      } else if (this._nodePromptActive && nodePrompt.isVisible) {
        nodePrompt.hide();
        this._nodePromptActive = false;
      }
    }

    // Check if E key is pressed
    const currentTime = Date.now();
    if (this.game.input && this.game.input.isKey('KeyE')) {
      if (currentTime - this.lastEKeyPress > this.nodeInteractionCooldown) {
        this.lastEKeyPress = currentTime;
        if (this.currentInteractableNode) {
          this._handleNodePickup(this.currentInteractableNode);
        }
      }
    }
  }

  /**
   * Handle node pickup
   */
  async _handleNodePickup(nodeMesh) {
    if (!nodeMesh || this.collectedNodes.has(nodeMesh.name)) return;
    if (!this.game || !this.game.player) return;

    console.log(`🎯 [Level0Controller] Player picked up node: ${nodeMesh.name}`);

    // Mark node as collected
    this.collectedNodes.add(nodeMesh.name);

    // Update HUD node counter
    const hud = this.game?.ui?.get('hud');
    if (hud && hud.updateNodeCount) {
      hud.updateNodeCount(this.collectedNodes.size, 2);
    }

    // Hide the node mesh (node disappears in the eye of the player)
    nodeMesh.visible = false;
    
    // Hide node prompt if we were showing it
    const np = this.game?.ui?.get('interactionPrompt');
    if (np && this._nodePromptActive) {
      np.hide();
      this._nodePromptActive = false;
    }
    
    // Remove from nodeMeshes array
    this.nodeMeshes = this.nodeMeshes.filter(n => n !== nodeMesh);

    // Check if this is the second node
    if (this._debugSecondNodeAlways || this.collectedNodes.size === 2) {
      // Second node - run consolidated special cutscene flow
      await this._runSecondNodeCutscene();
    } else {
      // First node - run normal teleport sequence
      await this._handleFirstNodeSequence();
    }
  }

  /**
   * Prelude before second-node cutscene: keep current camera, show short line, then fade to cutscene
   */
  async _handleSecondNodePreludeThenCutscene() {
    // Backwards-compat entry point: delegate to the new unified flow
    return this._runSecondNodeCutscene();
  }

  /**
   * Prepare second-node cutscene: teleport actors and set initial camera during fade.
   */
  async _prepareSecondNodeCutsceneSetup(director) {
    // Positions
    const stevePos = new THREE.Vector3(0.63, 10.66, -16.99);
    const playerPos = new THREE.Vector3(5.35, 10.66, -16.99);
    const richardPos = new THREE.Vector3(11.91, 10.66, -7.58);
    const lookAtTarget = new THREE.Vector3(0.06, 13.66, 2.85);

    // Teleport player
    if (this.game.player?.body) {
      this.game.player.body.position.set(playerPos.x, playerPos.y, playerPos.z);
      this.game.player.body.velocity.set(0, 0, 0);
    }
    if (this.game.player?.mesh) {
      this.game.player.mesh.position.copy(playerPos);
    }

    // Teleport Steve
    if (this.steve?.mesh) {
      this.steve.mesh.position.copy(stevePos);
      if (this.steve.body) {
        this.steve.body.position.set(stevePos.x, stevePos.y, stevePos.z);
        this.steve.body.velocity.set(0, 0, 0);
        this.steve.body.angularVelocity.set(0, 0, 0);
      }
    }

    // Teleport Richard
    if (this.richard?.mesh) {
      this.richard.mesh.position.copy(richardPos);
      if (this.richard.body) {
        this.richard.body.position.set(richardPos.x, richardPos.y, richardPos.z);
        this.richard.body.velocity.set(0, 0, 0);
        this.richard.body.angularVelocity.set(0, 0, 0);
      }
    }

    // Orient NPCs toward target
    await this._faceNpcTo(this.steve, lookAtTarget);
    await this._faceNpcTo(this.richard, lookAtTarget);

    // Set camera to initial shot
    const camPos = [32.8985553459216, 29.19431675166226, -35.152627603733485];
    const camLookAt = [20.00885268741525, 21.424375016482198, -21.981311389808575];
    director.cutTo({ position: camPos, lookAt: camLookAt, fov: 60 });

    // Sync freeCam yaw/pitch to shot
    const la = new THREE.Vector3(...camLookAt);
    const dir = la.clone().sub(new THREE.Vector3(...camPos)).normalize();
    director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
    director.freeCam.yaw = Math.atan2(dir.x, dir.z);
  }

  /**
   * New unified second-node cutscene flow:
   * 1) Take control and show "Nice u got them both" (Enter to continue)
   * 2) Fade out, teleport actors and set camera
   * 3) Fade in and play dialogues (Enter-gated)
   * 4) Fade out, clear overlay, release camera, restore gameplay
   */
  async _runSecondNodeCutscene() {
    if (!this.level?.cinematicsManager || !this.game?.player) return;
    const cm = this.level.cinematicsManager;
    const director = cm.director;

    try {
      this.cutsceneActive = true;
      // Lock player movement for whole sequence
      this.game.player.lockMovement('SecondNodeCutscene');

      // Take camera control;

      // Prelude caption
      this._setupEnterKeyListener(director);
      await this._showCaption('Nice! You got them both.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Fade out to reposition actors + camera
      console.log('🎬 [SecondNode] Fading out to reposition...');
      await director.fadeOut({ ms: 800 });
      console.log('🎬 [SecondNode] Fade out complete');

      // Teleport actors and orient them
      {
        // Positions (control room)
        const stevePos = new THREE.Vector3(0.63, 10.66, -16.99);
        const playerPos = new THREE.Vector3(5.35, 10.66, -16.99);
        const richardPos = new THREE.Vector3(11.91, 10.66, -7.58);
        const lookAtTarget = new THREE.Vector3(0.06, 13.66, 2.85);
        try {
          // Teleport player
          if (this.game.player?.body) {
            this.game.player.body.position.set(playerPos.x, playerPos.y, playerPos.z);
            this.game.player.body.velocity.set(0, 0, 0);
          }
          if (this.game.player?.mesh) {
            this.game.player.mesh.position.copy(playerPos);
          }

          // Teleport Steve
          if (this.steve?.mesh) {
            this.steve.mesh.position.copy(stevePos);
            if (this.steve.body) {
              this.steve.body.position.set(stevePos.x, stevePos.y, stevePos.z);
              this.steve.body.velocity.set(0, 0, 0);
              this.steve.body.angularVelocity.set(0, 0, 0);
            }
          }

          // Teleport Richard
          if (this.richard?.mesh) {
            this.richard.mesh.position.copy(richardPos);
            if (this.richard.body) {
              this.richard.body.position.set(richardPos.x, richardPos.y, richardPos.z);
              this.richard.body.velocity.set(0, 0, 0);
              this.richard.body.angularVelocity.set(0, 0, 0);
            }
          }

          // Orient NPCs toward target (non-blocking immediate face to avoid hangs)
          if (this.steve?.mesh) this._makeNpcFaceTarget(this.steve, lookAtTarget);
          if (this.richard?.mesh) this._makeNpcFaceTarget(this.richard, lookAtTarget);

          // Set camera to initial shot
          const camPos = [32.8985553459216, 29.19431675166226, -35.152627603733485];
          const camLookAt = [20.00885268741525, 21.424375016482198, -21.981311389808575];
          director.cutTo({ position: camPos, lookAt: camLookAt, fov: 60 });

          // Sync freeCam yaw/pitch to shot
          const la = new THREE.Vector3(...camLookAt);
          const dir = la.clone().sub(new THREE.Vector3(...camPos)).normalize();
          director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
          director.freeCam.yaw = Math.atan2(dir.x, dir.z);
        } catch (tpErr) {
          console.error('❌ [SecondNode] Error during teleport/camera setup:', tpErr);
        } finally {
          // Always attempt to fade back in, even if teleport had issues
          try {
            await director.fadeIn({ ms: 600 });
            console.log('🎬 [SecondNode] Fade in complete');
          } catch (fiErr) {
            console.warn('⚠️ [SecondNode] Fade in failed, forcing overlay clear');
            try { await director.fadeIn({ ms: 0 }); } catch {}
            if (director._fadeEl) director._fadeEl.style.opacity = '0';
          }
        }
      }
      await this._wait(200);

      // Dialogues (Enter-gated)
      // Steve: Richard its still red whats happening
      this._setupEnterKeyListener(director);
      await this._showCaption('Richard, it\'s still red. What\'s happening?', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard: this is bad
      this._setupEnterKeyListener(director);
      await this._showCaption('this is bad', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard: One infiltrated...
      this._setupEnterKeyListener(director);
      await this._showCaption('One infiltrated the tree, a big one. We won\'t be able to stop it.', 0, 'Richard');
      // Requirement: Hide node HUD once Richard tells about something inside the tree
      try {
        const hud = this.game?.ui?.get('hud');
        if (hud && hud.showNodeCounter) hud.showNodeCounter(false);
      } catch (_) {}
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard: I know you did a lot...
      this._setupEnterKeyListener(director);
      await this._showCaption('I know you did a lot for us already, but please...', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard: if he cuts out connection...
      this._setupEnterKeyListener(director);
      await this._showCaption('If he cuts out the connection to the mainland, this whole tree will collapse. Please help us.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard: when you decide...
      this._setupEnterKeyListener(director);
      await this._showCaption('When you decide what to do and are ready, please come to me.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Conclude: fade out, set post-cutscene state
      await director.fadeOut({ ms: 800 });

      // Post-cutscene setup: move NPCs to static spots and show exclamation
      {
        // Richard static
        const richardStaticPos = new THREE.Vector3(22.40, 10.66, -15.98);
        if (this.richard?.mesh) {
          this.richard.mesh.position.copy(richardStaticPos);
          this.richard.mesh.rotation.y = 0; // face +X
        }
        if (this.richard?.body) {
          this.richard.body.position.set(richardStaticPos.x, richardStaticPos.y, richardStaticPos.z);
          this.richard.body.velocity.set(0, 0, 0);
          this.richard.body.angularVelocity.set(0, 0, 0);
        }
        // Steve static
        const steveStaticPos = new THREE.Vector3(28.91, 12.66, -1.21);
        if (this.steve?.mesh) this.steve.mesh.position.copy(steveStaticPos);
        if (this.steve?.body) {
          this.steve.body.position.set(steveStaticPos.x, steveStaticPos.y, steveStaticPos.z);
          this.steve.body.velocity.set(0, 0, 0);
          this.steve.body.angularVelocity.set(0, 0, 0);
        }
        // Indicator
        this._showExclamationMark();
        // Enable final post-second-node choice
        this._finalBinaryChoiceEnabled = true;
      }

      // Ensure overlay is cleared before releasing
      try {
        await director.fadeIn({ ms: 0 });
        if (director._fadeEl) director._fadeEl.style.opacity = '0';
      } catch {}

      // Release camera and restore gameplay
      await director.release();
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      // Auto re-lock pointer after the scene
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      this.game.player.unlockMovement();
      this.cutsceneActive = false;

      console.log('✅ [Level0Controller] Second node cutscene complete');
    } catch (e) {
      console.error('❌ [Level0Controller] Error in second node cutscene flow:', e);
      try { await cm.director.release(); } catch {}
      // Auto re-lock pointer after the scene (error path)
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      if (this.game?.thirdCameraObject) this.game.activeCamera = this.game.thirdCameraObject;
      this.game?.player?.unlockMovement?.();
      this._resetFadeSafely(cm);
      this.cutsceneActive = false;
    }
  }

  /**
   * Handle first node pickup sequence (normal teleport)
   */
  async _handleFirstNodeSequence() {
    // Lock player movement
    this.game.player.lockMovement('NodePickup');

    // Wait a brief moment so player sees the node disappear
    await this._wait(200);

    // Teleport player to specific first-node vanish location
    {
      const teleportPos = new THREE.Vector3(-5.17192, 6.60477, 10.4465);
      if (this.game.player.body) {
        this.game.player.body.position.set(teleportPos.x, teleportPos.y, teleportPos.z);
        this.game.player.body.velocity.set(0, 0, 0);
      }
      if (this.game.player.mesh) {
        this.game.player.mesh.position.copy(teleportPos);
      }
    }
    // Run the teleport sequence
    await this._handleNodePickupSequence();
  }

  /**
   * Handle second node pickup sequence: special cutscene with all characters
   */
  async _handleSecondNodeCutscene() {
    if (!this.level?.cinematicsManager || !this.game?.player) return;
    const cm = this.level.cinematicsManager;
    const director = cm.director;

    try {
      this.cutsceneActive = true;
      
      // Lock player movement
      this.game.player.lockMovement('SecondNodeCutscene');
      
      // Take camera control
      director.takeControl();

      // Prelude handled fadeOut/teleport/camera and we are already faded in here

      // Steve dialogue: "Richard its still red whats happening"
      this._setupEnterKeyListener(director);
      await this._showCaption('Richard, it\'s still red. What\'s happening?', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard turns back (180 degrees) and moves to previous static position
      // Richard's original static position (from pacing start): around 22.40, 10.66, -15.98
      const richardStaticPos = new THREE.Vector3(22.40, 10.66, -15.98);
      
      // Calculate rotation to face positive X (0 radians)
      const targetRotation = 0; // Facing positive X
      
      // Smoothly move Richard to static position
      if (this.richard && this.richard.mesh) {
        // Animate movement
        const startPos = this.richard.mesh.position.clone();
        const duration = 1500; // ms
        const startTime = Date.now();
        
        await new Promise((resolve) => {
          const moveRichard = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth interpolation
            const eased = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            this.richard.mesh.position.lerpVectors(startPos, richardStaticPos, eased);
            if (this.richard.body) {
              this.richard.body.position.set(
                this.richard.mesh.position.x,
                this.richard.mesh.position.y,
                this.richard.mesh.position.z
              );
            }
            
            // Rotate to face positive X
            const currentRot = this.richard.mesh.rotation.y;
            let rotDiff = targetRotation - currentRot;
            rotDiff = ((rotDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
            this.richard.mesh.rotation.y += rotDiff * 0.2;
            
            if (progress < 1) {
              requestAnimationFrame(moveRichard);
            } else {
              resolve();
            }
          };
          
          moveRichard();
        });
      }

      // Clear tracking interval
      trackingActive = false;
      clearInterval(trackInterval);

      // Richard dialogue 1: "this is bad"
      this._setupEnterKeyListener(director);
      await this._showCaption('this is bad', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard dialogue 2: "One infilitrated the tree, a big one, We wont be able to stop it"
      this._setupEnterKeyListener(director);
      await this._showCaption('One infiltrated the tree, a big one. We won\'t be able to stop it.', 0, 'Richard');
      // Requirement: Hide node HUD when Richard reveals something is inside the tree
      try {
        const hud = this.game?.ui?.get('hud');
        if (hud && hud.showNodeCounter) hud.showNodeCounter(false);
      } catch (_) {}
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Setup Richard and Steve to track the player
      trackingActive = true;
      const trackPlayerInterval = setInterval(() => {
        if (!trackingActive || !this.richard || !this.steve || !this.game.player || !this.game.player.mesh) {
          clearInterval(trackPlayerInterval);
          return;
        }
        this._makeNpcFaceTarget(this.richard, this.game.player.mesh.position);
        this._makeNpcFaceTarget(this.steve, this.game.player.mesh.position);
      }, 50);

      await this._wait(500);

      // Richard dialogue 3: "I know u did alot for us already but please" (split long dialogue)
      this._setupEnterKeyListener(director);
      await this._showCaption('I know you did a lot for us already, but please...', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard dialogue 4: "if he cuts out connection to the main land this whole tree will collapse please help us"
      this._setupEnterKeyListener(director);
      await this._showCaption('If he cuts out the connection to the mainland, this whole tree will collapse. Please help us.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Richard dialogue 5: "when u decide what to do and is ready please come to me"
      this._setupEnterKeyListener(director);
      await this._showCaption('When you decide what to do and are ready, please come to me.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Clear tracking
      trackingActive = false;
      clearInterval(trackPlayerInterval);

      // Fade out to conclude, then clear overlay and release
      await director.fadeOut({ ms: 800 });

      // Post-cutscene setup: move NPCs to static spots and show exclamation
      {
        // Richard static
        const richardStaticPos = new THREE.Vector3(22.40, 10.66, -15.98);
        if (this.richard?.mesh) {
          this.richard.mesh.position.copy(richardStaticPos);
          this.richard.mesh.rotation.y = 0; // face +X
        }
        if (this.richard?.body) {
          this.richard.body.position.set(richardStaticPos.x, richardStaticPos.y, richardStaticPos.z);
          this.richard.body.velocity.set(0, 0, 0);
          this.richard.body.angularVelocity.set(0, 0, 0);
        }
        // Steve static
        const steveStaticPos = new THREE.Vector3(28.91, 12.66, -1.21);
        if (this.steve?.mesh) this.steve.mesh.position.copy(steveStaticPos);
        if (this.steve?.body) {
          this.steve.body.position.set(steveStaticPos.x, steveStaticPos.y, steveStaticPos.z);
          this.steve.body.velocity.set(0, 0, 0);
          this.steve.body.angularVelocity.set(0, 0, 0);
        }
        // Indicator
        this._showExclamationMark();
        // Enable final post-second-node choice
        this._finalBinaryChoiceEnabled = true;
      }

      // Ensure overlay is cleared before releasing
      try {
        await director.fadeIn({ ms: 0 });
        if (director._fadeEl) director._fadeEl.style.opacity = '0';
      } catch {}

      // Release camera and restore gameplay
      await director.release();
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      // Auto re-lock pointer after the scene
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      this.game.player.unlockMovement();
      this.cutsceneActive = false;

      console.log('✅ [Level0Controller] Second node cutscene complete');
    } catch (e) {
      console.error('❌ [Level0Controller] Error in second node cutscene flow:', e);
      try { await cm.director.release(); } catch {}
      // Auto re-lock pointer after the scene (error path)
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      if (this.game?.thirdCameraObject) this.game.activeCamera = this.game.thirdCameraObject;
      this.game?.player?.unlockMovement?.();
      this._resetFadeSafely(cm);
      this.cutsceneActive = false;
    }
  }

  /**
   * Handle node pickup sequence: dialogue, fade out, teleport to control room, fade in
   */
  async _handleNodePickupSequence() {
    if (!this.level?.cinematicsManager || !this.game?.player) return;
    const cm = this.level.cinematicsManager;
    const director = cm.director;

    try {
      this.cutsceneActive = true;
      
      // Take camera control
      director.takeControl();

      // Show Richard dialogue "Good Job"
      this._setupEnterKeyListener(director);
      await this._showCaption('Good Job', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);

      // Fade out
      await director.fadeOut({ ms: 800 });

      // Teleport player to control room in front of Steve
      if (!this.steve || !this.steve.mesh) {
        console.error('❌ [Level0Controller] Steve not found for teleport');
        // Fallback position
        const fallbackPos = new THREE.Vector3(28.91, 10.66, -1.21);
        if (this.game.player.body) {
          this.game.player.body.position.set(fallbackPos.x, fallbackPos.y, fallbackPos.z);
        }
        if (this.game.player.mesh) {
          this.game.player.mesh.position.copy(fallbackPos);
        }
      } else {
        // Position player in front of Steve
        const stevePos = this.steve.mesh.position;
        // Position ~2-3 units in front of Steve (based on his rotation)
        const steveRotation = this.steve.mesh.rotation.y;
        const offsetX = Math.sin(steveRotation) * 3;
        const offsetZ = Math.cos(steveRotation) * 3;
        
        const playerPos = new THREE.Vector3(
          stevePos.x - offsetX,
          stevePos.y, // Same height as Steve
          stevePos.z - offsetZ
        );

        if (this.game.player.body) {
          this.game.player.body.position.set(playerPos.x, playerPos.y, playerPos.z);
          this.game.player.body.velocity.set(0, 0, 0);
        }
        if (this.game.player.mesh) {
          this.game.player.mesh.position.copy(playerPos);
        }
      }

      // Position camera to look at player and Steve
      if (this.game.player.mesh && this.steve && this.steve.mesh) {
        const playerPos = this.game.player.mesh.position;
        const stevePos = this.steve.mesh.position;
        const midPoint = new THREE.Vector3()
          .addVectors(playerPos, stevePos)
          .multiplyScalar(0.5);
        
        const cameraPos = new THREE.Vector3(
          midPoint.x,
          midPoint.y + 3,
          midPoint.z + 5
        );

        director.cutTo({
          position: [cameraPos.x, cameraPos.y, cameraPos.z],
          lookAt: [midPoint.x, midPoint.y, midPoint.z],
          fov: 60
        });
      }

      // Fade in
      await director.fadeIn({ ms: 600 });
      await this._wait(300);

      // Release camera and restore gameplay
      await director.release();
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      // Auto re-lock pointer after the scene
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      this.game.player.unlockMovement();
      this.cutsceneActive = false;

      console.log('✅ [Level0Controller] Node pickup sequence complete');
    } catch (e) {
      console.error('❌ [Level0Controller] Error in node pickup sequence:', e);
      try { await cm.director.release(); } catch {}
      // Auto re-lock pointer after the scene (error path)
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      if (this.game?.thirdCameraObject) this.game.activeCamera = this.game.thirdCameraObject;
      this.game?.player?.unlockMovement?.();
      this._resetFadeSafely(cm);
      this.cutsceneActive = false;
    }
  }

  /**
   * Main entry point - start the cutscene sequence
   */
  async startSequence() {
    if (this._disableOpeningCutscene) {
      console.log('⏭️  Opening cutscene disabled. Skipping startSequence.');
      return;
    }
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
      await this._showCaption('Oh no no, oh no! What are we gonna do?', 3000);
      
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
      await this._showCaption('IF WE DO NOT GET THE NODES, WE ARE SCREWED!', 0); // No auto-hide
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
          // Auto re-lock pointer after the scene
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
      
      // Enable early door triggers to block player from doors until they speak to Richard
      this._earlyDoorTriggersEnabled = true;
      this._lastEarlyDoorMessageTime = 0;
      
      this.cutsceneActive = false;
      console.log('✅ [Level0Controller] Cutscene complete!');
      
    } catch (error) {
      console.error('❌ [Level0Controller] Error during cutscene:', error);
      await director.release();
      // Auto re-lock pointer after the scene (error path)
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      this._resetFadeSafely(cm);
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
    // Show the prompt when starting to wait
    this._showEnterPrompt();
    
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this._enterPressed) {
          clearInterval(checkInterval);
          this._enterPressed = false;
          // Hide the prompt before resolving
          this._hideEnterPrompt();
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Ensure the Enter prompt UI element exists
   */
  _ensureEnterPromptUI() {
    if (this.enterPromptEl) return;
    
    this.enterPromptEl = document.createElement('div');
    this.enterPromptEl.className = 'enter-prompt';
    this.enterPromptEl.style.cssText = `
      position: fixed;
      left: 50%;
      bottom: 3vh;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.75);
      color: #ffdd44;
      padding: 12px 20px;
      border-radius: 12px;
      font-family: system-ui, "Segoe UI", Arial, sans-serif;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      z-index: 10000;
      display: none;
      opacity: 0;
      transition: opacity 200ms ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      letter-spacing: 0.2px;
    `;
    this.enterPromptEl.textContent = 'Press Enter to continue';
    document.body.appendChild(this.enterPromptEl);
  }

  /**
   * Show the Enter prompt with fade-in animation and start pulse effect
   */
  _showEnterPrompt() {
    this._ensureEnterPromptUI();
    
    if (!this.enterPromptEl) return;
    
    // Show the element
    this.enterPromptEl.style.display = 'block';
    // Force repaint before opacity change
    this.enterPromptEl.style.opacity = '0';
    void this.enterPromptEl.offsetHeight;
    this.enterPromptEl.style.opacity = '1';
    
    // Start pulse animation
    this._startPromptPulse();
  }

  /**
   * Hide the Enter prompt with fade-out animation and stop pulse effect
   */
  _hideEnterPrompt() {
    if (!this.enterPromptEl || this.enterPromptEl.style.display === 'none') return;
    
    // Stop pulse animation
    this._stopPromptPulse();
    
    // Fade out
    this.enterPromptEl.style.opacity = '0';
    setTimeout(() => {
      if (this.enterPromptEl) {
        this.enterPromptEl.style.display = 'none';
      }
    }, 200);
  }

  /**
   * Start pulsing animation for the Enter prompt
   */
  _startPromptPulse() {
    this._stopPromptPulse(); // Clear any existing animation
    
    let startTime = null;
    const pulseDuration = 1500; // 1.5 seconds per cycle
    
    const pulse = (timestamp) => {
      if (!startTime) startTime = timestamp;
      if (!this.enterPromptEl || this.enterPromptEl.style.display === 'none') {
        this.enterPromptPulseId = null;
        return;
      }
      
      const elapsed = timestamp - startTime;
      const progress = (elapsed % pulseDuration) / pulseDuration;
      // Create sine wave: 0 to 1, then scale to opacity range 0.6 to 1.0
      const opacity = 0.6 + (0.4 * (Math.sin(progress * Math.PI * 2) * 0.5 + 0.5));
      
      this.enterPromptEl.style.opacity = opacity.toString();
      
      this.enterPromptPulseId = requestAnimationFrame(pulse);
    };
    
    this.enterPromptPulseId = requestAnimationFrame(pulse);
  }

  /**
   * Stop pulsing animation for the Enter prompt
   */
  _stopPromptPulse() {
    if (this.enterPromptPulseId) {
      cancelAnimationFrame(this.enterPromptPulseId);
      this.enterPromptPulseId = null;
    }
  }

  /**
   * Safely reset any active fade overlay to transparent to avoid stuck black screens.
   */
  _resetFadeSafely(cm) {
    try {
      if (cm?.director?.fadeIn) {
        cm.director.fadeIn({ ms: 0 });
      }
      if (cm?.director?._fadeEl) {
        cm.director._fadeEl.style.opacity = '0';
      }
    } catch (e) {
      // no-op
    }
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
        const targetRotation = Math.atan2(direction.x, direction.z) + Math.PI; // Add PI to fix backwards facing
        this.richard.mesh.rotation.y = targetRotation;
        
        // Show dialogue again (non-blocking so pacing continues)
        this._showCaption('Oh no, oh no, oh no! What are we gonna do?', 3000).catch(() => {});
      } else {
        // Move towards target
        const direction = new THREE.Vector3()
          .subVectors(targetPos, currentPos);
        direction.y = 0;
        direction.normalize();
        
        // Update rotation to face movement direction
        const targetRotation = Math.atan2(direction.x, direction.z) + Math.PI; // Add PI to fix backwards facing
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
    
    let targetRotation = Math.atan2(
      targetPos.x - npc.mesh.position.x,
      targetPos.z - npc.mesh.position.z
    );
    // Fix Richard's backwards facing issue
    if (npc === this.richard) {
      targetRotation += Math.PI;
    }
    
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
      let targetRotation = Math.atan2(
        targetPos.x - npc.mesh.position.x,
        targetPos.z - npc.mesh.position.z
      );
      // Fix Richard's backwards facing issue
      if (npc === this.richard) {
        targetRotation += Math.PI;
      }
      
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
  _showCaption(text, ms, characterName = 'Richard', voiceoverKey = null) {
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

      // Auto-detect voiceover key if not provided and character is Richard
      if (!voiceoverKey && characterName === 'Richard' && this.game.soundManager) {
        const lowerText = text.toLowerCase();

        // Try to match dialogue text to voiceover keys
        if (lowerText.includes('oh no no') || (lowerText.includes('oh no') && lowerText.includes('what are we'))) {
          voiceoverKey = 'oh_no_no';
        } else if (lowerText.includes('whoa') || lowerText.includes('where did you come from')) {
          voiceoverKey = 'whoa';
        } else if (lowerText.includes("it's the nodes") || lowerText.includes('primary nodes')) {
          voiceoverKey = 'nodes';
        } else if (lowerText.includes('crawlers')) {
          voiceoverKey = 'crawlers';
        } else if (lowerText.includes('yes') && lowerText.includes('please')) {
          voiceoverKey = 'yes_please';
        } else if (lowerText.includes("there's a node") || lowerText.includes('there is a node')) {
          voiceoverKey = 'there_is_node';
        } else if (lowerText.includes('press e')) {
          voiceoverKey = 'press_e';
        } else if (lowerText.includes("there's the node")) {
          voiceoverKey = 'theres_node';
        } else if (lowerText.includes('never mind') || lowerText.includes('nevermind')) {
          voiceoverKey = 'nevermind';
        } else if (lowerText.includes('two ways')) {
          voiceoverKey = 'two_ways';
        } else if (lowerText.includes('oh no') && lowerText.includes('stack tool')) {
          voiceoverKey = 'oh_no';
        } else if (lowerText.includes('nice') && lowerText.includes('got them')) {
          voiceoverKey = 'nice_got_them';
        } else if (lowerText.includes('this is bad')) {
          voiceoverKey = 'this_is_bad';
        } else if (lowerText.includes('one infiltrated')) {
          voiceoverKey = 'one_infiltrated';
        } else if (lowerText.includes('but please') || (lowerText.includes('already') && lowerText.includes('please'))) {
          voiceoverKey = 'but_please';
        } else if (lowerText.includes('connection') && lowerText.includes('mainland')) {
          voiceoverKey = 'connection_mainland';
        } else if (lowerText.includes('when you decide') || lowerText.includes('ready')) {
          voiceoverKey = 'when_decide';
        } else if (lowerText.includes('good job')) {
          voiceoverKey = 'good_job';
        }
      }

      // Auto-detect voiceover key if not provided and character is Steve
      if (!voiceoverKey && characterName === 'Steve' && this.game.soundManager) {
        const lowerText = text.toLowerCase();

        // Try to match dialogue text to voiceover keys
        if (lowerText.includes('before you go')) {
          voiceoverKey = 'before_you_go';
        } else if (lowerText.includes('but beware')) {
          voiceoverKey = 'but_beware';
        } else if (lowerText.includes('calm down')) {
          voiceoverKey = 'calm_down';
        } else if (lowerText.includes('how did they')) {
          voiceoverKey = 'how_did_they';
        } else if (lowerText.includes('it should')) {
          voiceoverKey = 'it_should';
        } else if (lowerText.includes('listen') && (lowerText.includes("we're") || lowerText.includes('were'))) {
          voiceoverKey = 'listen_were';
        } else if (lowerText.includes('press x')) {
          voiceoverKey = 'press_x';
        } else if (lowerText.includes('richard') && lowerText.includes('still red')) {
          voiceoverKey = 'richard_still_red';
        } else if (lowerText.includes('that should')) {
          voiceoverKey = 'that_should';
        } else if (lowerText.includes('bugger')) {
          voiceoverKey = 'thats_bugger';
        } else if (lowerText.includes('this one')) {
          voiceoverKey = 'this_one';
        } else if (lowerText.includes('those crawlers')) {
          voiceoverKey = 'those_crawlers';
        } else if (lowerText.includes('wait') && lowerText.length < 10) {
          voiceoverKey = 'wait';
        } else if (lowerText.includes('you can use')) {
          voiceoverKey = 'you_can_use';
        }
      }

      // Play voiceover if key is provided/detected and character is Richard
      if (voiceoverKey && characterName === 'Richard' && this.game.soundManager) {
        this.game.soundManager.playSFX(voiceoverKey);
        console.log(`🎤 [Level0Controller] Playing Richard voiceover: ${voiceoverKey}`);
      }

      // Play voiceover if key is provided/detected and character is Steve
      if (voiceoverKey && characterName === 'Steve' && this.game.soundManager) {
        this.game.soundManager.playSFX(voiceoverKey);
        console.log(`🎤 [Level0Controller] Playing Steve voiceover: ${voiceoverKey}`);
      }

      // If ms is 0, show caption indefinitely (will be hidden manually)
      if (ms === 0) {
        cm._showCaption(characterName, text, 999999).then(() => resolve()); // Long timeout, will be hidden manually
      } else {
        cm._showCaption(characterName, text, ms).then(resolve);
      }
    });
  }

  /**
   * Load Richard's voiceover audio files
   */
  _loadRichardVoiceovers() {
    if (!this.game.soundManager) {
      console.warn('⚠️ [Level0Controller] SoundManager not available for loading voiceovers');
      return;
    }

    const soundManager = this.game.soundManager;
    const basePath = 'assets/audio/ambient/';

    for (const [key, fileName] of Object.entries(this.richardVoiceoverMap)) {
      const url = `${basePath}${fileName}.mp3`;
      soundManager.load('sfx', key, url, false)
        .catch(err => console.error(`❌ Failed to load voiceover: ${key}`, err));
    }
  }

  /**
   * Load Steve's voiceover audio files
   */
  _loadSteveVoiceovers() {
    if (!this.game.soundManager) {
      console.warn('⚠️ [Level0Controller] SoundManager not available for loading Steve voiceovers');
      return;
    }

    const soundManager = this.game.soundManager;
    const basePath = 'assets/audio/ambient/';

    for (const [key, fileName] of Object.entries(this.steveVoiceoverMap)) {
      const url = `${basePath}${fileName}.mp3`;
      soundManager.load('sfx', key, url, false)
        .catch(err => console.error(`❌ Failed to load Steve voiceover: ${key}`, err));
    }
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
    // This method is kept for compatibility but no longer restricts interactions
    console.log('🎬 [Level0Controller] Richard interaction mode enabled');
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
    // Hide Richard prompt if showing
    const prompt = this.game?.ui?.get('interactionPrompt');
    if (prompt && this._richardPromptActive) {
      prompt.hide();
      this._richardPromptActive = false;
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
      
      // Dialogue 4: Steve - "Calm down Richard"
      await this._showCaption('Calm down Richard', 0, 'Steve');
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
      await this._showCaption('Yes, please! Hurry!', 0, 'Richard');
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
          // Auto re-lock pointer after the scene
          if (typeof document !== 'undefined' && !document.pointerLockElement) {
            document.body.requestPointerLock();
          }
        }
      }
      
      // Re-enable doors and other interactions
      this._disableRichardInteractionMode();
      
      // Disable early door triggers - player has spoken to Richard, normal flow resumes
      this._earlyDoorTriggersEnabled = false;
      
      // Show node HUD below health after this dialogue completes
      const hud = this.game?.ui?.get('hud');
      if (hud && hud.showNodeCounter) {
        hud.showNodeCounter(true);
      }

      // Clear cutscene active flag
      this.cutsceneActive = false;
      
      console.log('✅ [Level0Controller] Richard interaction dialogue complete!');
      
    } catch (error) {
      console.error('❌ [Level0Controller] Error during interaction dialogue:', error);
      await director.release();
      // Auto re-lock pointer after the scene (error path)
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      this._disableRichardInteractionMode();
      // Disable early door triggers - player has spoken to Richard, normal flow resumes
      this._earlyDoorTriggersEnabled = false;
      this.cutsceneActive = false;
    }
  }

  /**
   * Disable Richard-only interaction mode (restore normal interactions)
   */
  _disableRichardInteractionMode() {
    // Ensure any Richard prompt is hidden when disabling mode
    const prompt2 = this.game?.ui?.get('interactionPrompt');
    if (prompt2 && this._richardPromptActive) {
      prompt2.hide();
      this._richardPromptActive = false;
    }
    
    console.log('🎬 [Level0Controller] Richard interaction mode disabled');
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
      // Face positive X direction (-Math.PI / 2 or 3*Math.PI/2, adjusted for model forward direction)
      this.richard.mesh.rotation.y = -Math.PI / 2;
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
    
    // Enable Steve player tracking
    this._steveTrackingEnabled = true;
    
    // Enable door trigger tutorial after repositioning
    this._doorTriggersEnabled = true;
    this._doorTriggersConsumed = false;
    
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
    // Disabled as per request: ensure any existing indicator is removed and do nothing
    if (!this.steve || !this.steve.mesh) {
      console.warn('⚠️ [Level0Controller] Cannot modify Steve exclamation mark - Steve not found');
      return;
    }
    if (this.steveExclamationGroup) {
      try {
        this.steve.mesh.remove(this.steveExclamationGroup);
        this.steveExclamationGroup.traverse((child) => {
          if (child.material) {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
          if (child.geometry) child.geometry.dispose();
        });
      } catch (e) {
        console.warn('⚠️ [Level0Controller] Error cleaning Steve exclamation group', e);
      }
      this.steveExclamationGroup = null;
    }
    // Intentionally no-op: Steve should not have an exclamation mark
    console.log('ℹ️ [Level0Controller] Steve exclamation mark disabled');
  }

  /**
   * Door trigger tutorial: Steve grants Stack tool and explains controls
   */
  async _runStackToolTutorial() {
    if (!this.level?.cinematicsManager || !this.game?.player) return;
    const cm = this.level.cinematicsManager;
    const director = cm.director;
    
    try {
      this.cutsceneActive = true;
      // Freeze player movement
      this.game.player.lockMovement('StackToolTutorial');
      // Disable input so FreeCamera doesn't react to mouse/keys during this cinematic
      if (this.game.input?.setEnabled) this.game.input.setEnabled(false);
      
      // Steve says "Wait." and waits for player to press Enter, then fade out
      this._setupEnterKeyListener(director);
      await this._showCaption('Wait.', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      await director.fadeOut({ ms: 700 });
      
      // Teleport player to the specified position for this scene and face Steve
      if (this.game.player?.setPosition) {
        const playerTarget = new THREE.Vector3(2.05, 10.66, -30.47);
        this.game.player.setPosition(playerTarget);
        // Orient player toward Steve if available
        if (this.steve?.mesh) {
          const stevePos = this.steve.mesh.position.clone();
          const targetRot = Math.atan2(stevePos.x - playerTarget.x, stevePos.z - playerTarget.z);
          if (this.game.player.mesh) this.game.player.mesh.rotation.y = targetRot;
        }
      }
      // Make Steve face the player
      if (this.game.player?.mesh) {
        await this._faceNpcTo(this.steve, this.game.player.mesh.position);
      }
      
      // Set camera to the requested shot (lookAt Player) AFTER teleport, then fade in
      director.takeControl();
      const playerLook = this.game?.player?.mesh?.position?.clone() || new THREE.Vector3(1.6618411501024597, 13.47878441577051, -35.69522380082998);
      director.cutTo({
        position: [1.209026225808091, 24.372258634347013, -18.92837621121],
        lookAt: [playerLook.x, playerLook.y, playerLook.z],
        fov: 60
      });
      // Sync freeCam yaw/pitch to the shot so its update() doesn't override the lookAt
      {
        const cam = director.cam;
        const dir = playerLook.clone().sub(cam.position).normalize();
        director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
        director.freeCam.yaw = Math.atan2(dir.x, dir.z);
      }
  await director.fadeIn({ ms: 600 });
  // Continuously track the player's CURRENT position by aligning freeCam yaw/pitch each frame
  this._startCameraLookAtPlayer(director);
      
      // Dialogue sequence with Enter to advance
      this._setupEnterKeyListener(director);
      await this._showCaption("Before you go, take this. It's an old 'Stack' tool.", 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      await this._wait(200);
      
      // Show popup: Tool acquired
      this._showTemporaryPopup('Tool acquired: Stack', 1800);
      await this._wait(600);
      
      // Grant the Stack tool via game state (only available in Level 1)
      if (this.game.grantStackTool) {
        this.game.grantStackTool();
        console.log('[Level0] Stack tool granted to player');
      }
      
      // Continue dialogue and on-screen controls
      this._setupEnterKeyListener(director);
      await this._showCaption('You can use it to place up to 3 data blocks.', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Show control hints overlay
      const controlsEl = this._showControlsOverlay([
        '[X] - PUSH (Create Block / Boost)',
        '[Z] - POP (Destroy All Blocks)'
      ]);
      
      this._setupEnterKeyListener(director);
      await this._showCaption('Press X to push a block out and boost yourself up. You can stack 3.', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      this._setupEnterKeyListener(director);
      await this._showCaption('But beware—pressing Z pops all 3 at once. Use it wisely.', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      this._setupEnterKeyListener(director);
      await this._showCaption('It should help you reach places that are hard to get to. Also, take this communicator. Good luck.', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Cleanup overlays
      if (controlsEl && controlsEl.parentElement) controlsEl.parentElement.removeChild(controlsEl);
      
  // Release camera and restore gameplay
  this._stopCameraLookAtPlayer();
      await director.release();
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      // Auto re-lock pointer after the scene
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      this.game.player.unlockMovement();
      if (this.game.input?.setEnabled) this.game.input.setEnabled(true);
      this.cutsceneActive = false;
      
      // Enable lift area trigger after Stack tool tutorial completes
      this._liftTriggerEnabled = true;
      this._liftTriggerConsumed = false;
      
      // Enable boost hint trigger so player can learn jump + X combo
      this._boostHintTriggerEnabled = true;
      console.log('💡 [Level0Controller] Boost hint trigger enabled');
    } catch (e) {
      console.error('❌ [Level0Controller] Error in Stack tool tutorial:', e);
  this._stopCameraLookAtPlayer();
      try { await cm.director.release(); } catch {}
      // Auto re-lock pointer after the scene (error path)
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      if (this.game?.thirdCameraObject) this.game.activeCamera = this.game.thirdCameraObject;
      this.game?.player?.unlockMovement?.();
  if (this.game.input?.setEnabled) this.game.input.setEnabled(true);
      this.cutsceneActive = false;
    }
  }

  /**
   * Continuously aim the cinematic camera at Steve's current world position during the Stack Tool tutorial.
   */
  _startCameraLookAtSteve(director) {
    this._stopCameraLookAtSteve();
    const loop = () => {
      if (!this.cutsceneActive || !director || !this.steve?.mesh) {
        this._lookAtSteveRaf = null;
        return;
      }
      const target = this.steve.mesh.getWorldPosition(new THREE.Vector3());
      try {
        director.cam.lookAt(target);
      } catch {}
      this._lookAtSteveRaf = requestAnimationFrame(loop);
    };
    this._lookAtSteveRaf = requestAnimationFrame(loop);
  }

  _stopCameraLookAtSteve() {
    if (this._lookAtSteveRaf) {
      cancelAnimationFrame(this._lookAtSteveRaf);
      this._lookAtSteveRaf = null;
    }
  }

  /**
   * Continuously aim the cinematic camera at Player's current world position during the Stack Tool tutorial.
   */
  _startCameraLookAtPlayer(director) {
    this._stopCameraLookAtPlayer();
    const loop = () => {
      if (!this.cutsceneActive || !director || !this.game?.player?.mesh) {
        this._lookAtPlayerRaf = null;
        return;
      }
      const cam = director.cam;
      const target = this.game.player.mesh.getWorldPosition(new THREE.Vector3());
      try {
        // Compute yaw/pitch from camera to the player's position so FreeCamera update cooperates
        const dir = target.clone().sub(cam.position).normalize();
        director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
        director.freeCam.yaw = Math.atan2(dir.x, dir.z);
        // Optionally ensure exact lookAt for this frame
        cam.lookAt(target);
      } catch {}
      this._lookAtPlayerRaf = requestAnimationFrame(loop);
    };
    this._lookAtPlayerRaf = requestAnimationFrame(loop);
  }

  _stopCameraLookAtPlayer() {
    if (this._lookAtPlayerRaf) {
      cancelAnimationFrame(this._lookAtPlayerRaf);
      this._lookAtPlayerRaf = null;
    }
  }

  _showTemporaryPopup(text, durationMs = 1500) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'fixed';
    el.style.top = '20%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.padding = '12px 18px';
    el.style.background = 'rgba(0,0,0,0.7)';
    el.style.color = '#ffd700';
    el.style.fontFamily = 'sans-serif';
    el.style.fontSize = '20px';
    el.style.border = '1px solid #ffd700';
    el.style.borderRadius = '8px';
    el.style.zIndex = '9999';
    document.body.appendChild(el);
    setTimeout(() => {
      if (el.parentElement) el.parentElement.removeChild(el);
    }, durationMs);
    return el;
  }

  /**
   * Show boost hint popup teaching jump + X combo
   */
  _showBoostHint() {
    console.log('💡 [Level0Controller] Showing boost hint');
    
    // Create multi-line hint overlay
    const hintEl = document.createElement('div');
    hintEl.style.position = 'fixed';
    hintEl.style.top = '30%';
    hintEl.style.left = '50%';
    hintEl.style.transform = 'translate(-50%, -50%)';
    hintEl.style.padding = '20px 30px';
    hintEl.style.background = 'rgba(0,0,0,0.85)';
    hintEl.style.color = '#00ff88';
    hintEl.style.fontFamily = 'monospace, sans-serif';
    hintEl.style.fontSize = '18px';
    hintEl.style.border = '2px solid #00ff88';
    hintEl.style.borderRadius = '10px';
    hintEl.style.zIndex = '9999';
    hintEl.style.textAlign = 'center';
    hintEl.style.lineHeight = '1.6';
    
    hintEl.innerHTML = `
      <div style="font-size: 22px; font-weight: bold; margin-bottom: 12px; color: #ffd700;">💡 HINT: Stack Tool Boost</div>
      <div style="margin-bottom: 8px;">Jump and press <span style="color: #ffd700; font-weight: bold;">X</span> to boost yourself up!</div>
      <div style="margin-bottom: 8px;">You can stack up to 3 blocks.</div>
      <div>If you need to move more than 3 blocks, press <span style="color: #ffd700; font-weight: bold;">Z</span> to pop them so you can boost again.</div>
    `;
    
    document.body.appendChild(hintEl);
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
      if (hintEl.parentElement) {
        hintEl.style.opacity = '0';
        hintEl.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          if (hintEl.parentElement) hintEl.parentElement.removeChild(hintEl);
        }, 500);
      }
    }, 6000);
  }

  /**
   * Lift area cutscene: guides player to fix the lift using Stack tool
   */
  async _runLiftAreaCutscene() {
    if (!this.level?.cinematicsManager || !this.game?.player) return;
    const cm = this.level.cinematicsManager;
    const director = cm.director;
    
    try {
      this.cutsceneActive = true;
      // Freeze player movement
      this.game.player.lockMovement('LiftAreaCutscene');
      
      // Take camera control
      director.takeControl();
      
      // Pre-zoom shot (provided)
      const camStartPos = [
        -143.36011528522985,
        74.38862095232327,
        45.26406617505654
      ];
      const camStartLookAt = [
        -159.34525123301924,
        73.42898954985826,
        57.24549081080394
      ];

      // Post-zoom (target) shot (provided)
      const camZoomPos = [
        -505.1357120556016,
        52.67024305173521,
        316.4276685312916
      ];
      const camZoomLookAt = [
        -521.120848003391,
        51.710611649270206,
        328.409093167039
      ];

      // Start camera aligned with the zoom target
      director.cutTo({ position: camStartPos, lookAt: camStartLookAt, fov: 60 });

      // Sync freeCam orientation to the pre-zoom shot so its update() doesn't override the lookAt during the move
      {
        const lookAtStartV = new THREE.Vector3(...camStartLookAt);
        const dirStart = lookAtStartV.clone().sub(new THREE.Vector3(...camStartPos)).normalize();
        director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dirStart.y, -1, 1));
        director.freeCam.yaw = Math.atan2(dirStart.x, dirStart.z);
      }

      // Zoom/move from start to the next specified shot (push-in along the same line)
      if (director.moveTo) {
        await director.moveTo({ position: camZoomPos, lookAt: camZoomLookAt, fov: 60, duration: 2500, ease: 'quadOut' });
      } else {
        director.cutTo({ position: camZoomPos, lookAt: camZoomLookAt, fov: 60 });
        await this._wait(500);
      }
      {
        // Sync freeCam yaw/pitch to the zoom target (prevents freeCam update from drifting the lookAt)
        const lookAtVec1 = new THREE.Vector3(...camZoomLookAt);
        const dir1 = lookAtVec1.clone().sub(new THREE.Vector3(...camZoomPos)).normalize();
        director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir1.y, -1, 1));
        director.freeCam.yaw = Math.atan2(dir1.x, dir1.z);
      }
      
      // Wait a moment
      await this._wait(500);
      
      // Setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Richard: "Theres a node"
      await this._showCaption('There\'s a node.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Fade out
      await director.fadeOut({ ms: 800 });
      
      // Camera Position 2: Cut to new position
      const cam2Pos = [-402.3180252502396, 78.19130472056894, 228.4097942646058];
      const cam2LookAt = [-411.6181265700495, 60.753981237230946, 231.48353224607055];
      director.cutTo({
        position: cam2Pos,
        lookAt: cam2LookAt,
        fov: 60
      });
      
      // Sync freeCam
      const lookAtVec2 = new THREE.Vector3(...cam2LookAt);
      const dir2 = lookAtVec2.clone().sub(new THREE.Vector3(...cam2Pos)).normalize();
      director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir2.y, -1, 1));
      director.freeCam.yaw = Math.atan2(dir2.x, dir2.z);
      
      // Fade in
      await director.fadeIn({ ms: 600 });
      await this._wait(300);
      
      // Dialogue: Steve then Richard
      this._setupEnterKeyListener(director);
      await this._showCaption('How did they know to guard the shortest path?', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      this._setupEnterKeyListener(director);
      await this._showCaption('Never mind that.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Fade out
      await director.fadeOut({ ms: 800 });
      
      // Camera Position 3: Cut to lift position
      const cam3Pos = [-464.162086792485, 26.74864580159782, 215.22313148750766];
      const cam3LookAt = [-477.0301245620225, 17.353779398664244, 227.31238660239322];
      
      director.cutTo({
        position: cam3Pos,
        lookAt: cam3LookAt,
        fov: 60
      });
      
      // Sync freeCam
      const lookAtVec3 = new THREE.Vector3(...cam3LookAt);
      const dir3 = lookAtVec3.clone().sub(new THREE.Vector3(...cam3Pos)).normalize();
      director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir3.y, -1, 1));
      director.freeCam.yaw = Math.atan2(dir3.x, dir3.z);
      
      // Fade in to show the lift scene
      await director.fadeIn({ ms: 600 });
      await this._wait(300);
      
      // Setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Richard: "Press E to lift a block and place it on the plates"
      await this._showCaption('Press E to lift a block and place it on the plates', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Fade out
      await director.fadeOut({ ms: 800 });
      
      // Camera Position 4: Same position, different lookAt
      const cam4Pos = [-464.162086792485, 26.74864580159782, 215.22313148750766];
      const cam4LookAt = [-479.08220153313306, 19.759346565943243, 203.88558888249946];
      
      director.cutTo({
        position: cam4Pos,
        lookAt: cam4LookAt,
        fov: 60
      });
      
      // Sync freeCam
      const lookAtVec4 = new THREE.Vector3(...cam4LookAt);
      const dir4 = lookAtVec4.clone().sub(new THREE.Vector3(...cam4Pos)).normalize();
      director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir4.y, -1, 1));
      director.freeCam.yaw = Math.atan2(dir4.x, dir4.z);
      
      // Fade in
      await director.fadeIn({ ms: 600 });
      await this._wait(300);
      
      // Setup Enter key listener
      this._setupEnterKeyListener(director);
      
      // Steve: "that should get the lift back up and running"
      await this._showCaption('That should get the lift back up and running.', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Release camera and restore gameplay
      await director.release();
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      // Auto re-lock pointer after the scene
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      this.game.player.unlockMovement();
      this.cutsceneActive = false;
      
      console.log('✅ [Level0Controller] Lift area cutscene complete');
    } catch (e) {
      console.error('❌ [Level0Controller] Error in lift area cutscene:', e);
      try { await cm.director.release(); } catch {}
      // Auto re-lock pointer after the scene (error path)
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      if (this.game?.thirdCameraObject) this.game.activeCamera = this.game.thirdCameraObject;
      this.game?.player?.unlockMovement?.();
      this._resetFadeSafely(cm);
      this.cutsceneActive = false;
    }
  }
  
  /**
   * Right-side approach cutscene (huge trigger at 277.64,10.91,-33.92)
   */
  async _runRightPathCutscene() {
    if (!this.level?.cinematicsManager || !this.game?.player) return;
    const cm = this.level.cinematicsManager;
    const director = cm.director;
    
    try {
      this.cutsceneActive = true;
      this.game.player.lockMovement('RightPathCutscene');
      director.takeControl();
      
      // Camera Position A (cut) - updated start shot
      const posA = [342.2284256223885,
        247.9397063711324,
        -219.8648795638604];
      const lookA = [340.8827021708668,
        241.28882295335478,
        -201.05119363698378];
      director.cutTo({ position: posA, lookAt: lookA, fov: 60 });
      
      // Sync freeCam
      {
        const la = new THREE.Vector3(...lookA);
        const dir = la.clone().sub(new THREE.Vector3(...posA)).normalize();
        director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
        director.freeCam.yaw = Math.atan2(dir.x, dir.z);
      }
      await this._wait(300);
      
      // Zoom-in move to Position B - updated target shot
      const posB = [296.84255649635713,
        23.632012223162562,
        414.64549200598526];
      const lookB = [295.49683304483545,
        16.98112880538497,
        433.4591779328619];
      if (director.moveTo) {
        await director.moveTo({ position: posB, lookAt: lookB, fov: 60, duration: 2500, ease: 'quadOut' });
      } else {
        director.cutTo({ position: posB, lookAt: lookB, fov: 60 });
        await this._wait(400);
      }
      
      // Richard: there s the node
      this._setupEnterKeyListener(director);
      await this._showCaption('There\'s the node.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Fade out
      await director.fadeOut({ ms: 800 });
      
      // Camera Position 2: Cut to new position
      const posC = [268.80087190447995, 182.26145828072922, 9.299643635569545];
      const lookC = [267.12235344898016, 166.66979483365512, 21.71264515606087];
      director.cutTo({ position: posC, lookAt: lookC, fov: 60 });
      // Sync freeCam
      {
        const lc = new THREE.Vector3(...lookC);
        const dir = lc.clone().sub(new THREE.Vector3(...posC)).normalize();
        director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
        director.freeCam.yaw = Math.atan2(dir.x, dir.z);
      }
      await director.fadeIn({ ms: 600 });
      await this._wait(300);
      
      // Dialogue: Steve then Richard
      this._setupEnterKeyListener(director);
      await this._showCaption('How did they know to guard the shortest path?', 0, 'Steve');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      this._setupEnterKeyListener(director);
      await this._showCaption('Never mind that.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Fade out
      await director.fadeOut({ ms: 800 });
      
      // Camera Position 3: Cut to lift position
      const posD = [321.0640880949602, 50.73027575325627, -72.21474211077759];
      const lookD = [329.43533656744535, 42.465643469972974, -56.04013076354499];
      director.cutTo({ position: posD, lookAt: lookD, fov: 60 });
      // Sync freeCam
      {
        const ld = new THREE.Vector3(...lookD);
        const dir = ld.clone().sub(new THREE.Vector3(...posD)).normalize();
        director.freeCam.pitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));
        director.freeCam.yaw = Math.atan2(dir.x, dir.z);
      }
      await director.fadeIn({ ms: 600 });
      await this._wait(300);
      
      // Richard: final guidance
      this._setupEnterKeyListener(director);
      await this._showCaption('You have two ways to get to the node. Choose wisely.', 0, 'Richard');
      await this._waitForEnter();
      cm._hideCaption?.(true);
      
      // Return camera back to player
      await director.release();
      if (this.game.thirdCameraObject) {
        this.game.activeCamera = this.game.thirdCameraObject;
      }
      // Auto re-lock pointer after the scene
      if (typeof document !== 'undefined' && !document.pointerLockElement) {
        document.body.requestPointerLock();
      }
      this.game.player.unlockMovement();
      this.cutsceneActive = false;
      
      console.log('✅ [Level0Controller] Right-path cutscene complete');
    } catch (e) {
      console.error('❌ [Level0Controller] Error in right-path cutscene:', e);
      try { await cm.director.release(); } catch {}
      if (this.game?.thirdCameraObject) this.game.activeCamera = this.game.thirdCameraObject;
      this.game?.player?.unlockMovement?.();
      this._resetFadeSafely(cm);
      this.cutsceneActive = false;
    }
  }

  _showControlsOverlay(lines = []) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
    wrapper.style.transform = 'translate(-50%, -50%)';
    wrapper.style.padding = '10px 14px';
    wrapper.style.background = 'rgba(0,0,0,0.6)';
    wrapper.style.color = '#fff';
    wrapper.style.fontFamily = 'monospace';
    wrapper.style.fontSize = '16px';
    wrapper.style.borderRadius = '6px';
    wrapper.style.border = '1px solid rgba(255,255,255,0.25)';
    wrapper.style.zIndex = '9999';
    
    for (const line of lines) {
      const p = document.createElement('div');
      p.textContent = line;
      p.style.whiteSpace = 'pre';
      wrapper.appendChild(p);
    }
    document.body.appendChild(wrapper);
    return wrapper;
  }

  /**
   * Update method - should be called from game loop to track player with Steve
   */
  update(delta) {
    // Guard: keep node HUD hidden until the first Richard interaction has actually occurred
    try {
      if (!this.interactionDialogueShown) {
        const hud = this.game?.ui?.get('hud');
        if (hud && hud.showNodeCounter) hud.showNodeCounter(false);
      }
    } catch (_) {}
    // (Preview disabled)

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
    
    // Update boss fight system if active
    if (this.bossFightSystem) {
      const { controller, spawner, hud } = this.bossFightSystem;
      
      if (controller && controller.update) {
        controller.update(delta);
      }
      
      if (spawner && spawner.update) {
        spawner.update(delta);
      }
      
      // Sync health between boss enemy and controller
      if (controller && controller.syncHealth) {
        // Find boss enemy
        const bossEnemy = this.level?.enemyManager?.enemies?.find(e => e.enemyType === 'lobber_boss');
        if (bossEnemy && bossEnemy.health !== undefined) {
          controller.syncHealth(bossEnemy.health, bossEnemy.maxHealth || 500);
          // Update on-screen HUD if present
          if (hud && hud.update) {
            hud.update(controller.health, controller.maxHealth);
          }
        }
      }
    }
    
    // Check if player has fallen below -20 and respawn at initial spawn position
    if (this.game?.player?.mesh?.position && this.game.player.mesh.position.y < -20) {
      console.log('⚠️ [Level0Controller] Player fell below -20, respawning at initial spawn');
      this._respawnPlayer(false); // false = not from death
    }
    
    // Check for player death and respawn if needed
    if (this.game?.player) {
      const currentHealth = this.game.player.health;
      
      // Detect death (health was > 0, now <= 0)
      if (this.lastPlayerHealth !== null && this.lastPlayerHealth > 0 && currentHealth <= 0) {
        // If in boss fight, store custom respawn handler to override default level reload
        if (this.bossFightSystem !== null) {
          console.log('💀 [Level0Controller] Player died in boss fight - setting custom respawn handler');
          this._customRespawnHandler = () => {
            this._respawnPlayer(true); // Use our custom boss respawn logic
          };
        }
      }
      
      // Update last known health
      this.lastPlayerHealth = currentHealth;
    }
    
    // Check early door triggers (before Richard interaction) - push player back and show message
    if (this._earlyDoorTriggersEnabled && !this.interactionDialogueShown && this.game?.player?.body) {
      const p = this.game.player.body.position; // CANNON.Vec3
      
      for (const box of this._doorTriggerBoxes) {
        // Simple AABB check (ignore Y or include small vertical tolerance)
        const inX = Math.abs(p.x - box.center.x) <= box.halfSize.x;
        const inZ = Math.abs(p.z - box.center.z) <= box.halfSize.z;
        // Y not critical, allow generous tolerance
        if (inX && inZ) {
          // Calculate direction away from door (push player back)
          const doorCenter = new CANNON.Vec3(box.center.x, p.y, box.center.z);
          const direction = new CANNON.Vec3();
          p.vsub(doorCenter, direction); // Direction from door to player (push away from door)
          direction.normalize();
          
          // Apply pushback force
          const pushbackForce = 500; // Adjust force magnitude as needed
          direction.scale(pushbackForce);
          this.game.player.body.applyImpulse(direction, p);
          
          // Show message (throttled to avoid spam)
          const currentTime = Date.now();
          if (currentTime - this._lastEarlyDoorMessageTime > 3000) { // 3 seconds between messages
            if (this.game.showMessage) {
              this.game.showMessage('Speak to the distressed robot.', 3000);
            }
            this._lastEarlyDoorMessageTime = currentTime;
          }
          
          break; // Only handle one trigger at a time
        }
      }
    }
    
    // Check door trigger volumes to start Stack tool tutorial
    if (this._doorTriggersEnabled && !this._doorTriggersConsumed && this.game?.player?.body) {
      const p = this.game.player.body.position; // CANNON.Vec3
      for (const box of this._doorTriggerBoxes) {
        // Simple AABB check (ignore Y or include small vertical tolerance)
        const inX = Math.abs(p.x - box.center.x) <= box.halfSize.x;
        const inZ = Math.abs(p.z - box.center.z) <= box.halfSize.z;
        // Y not critical, allow generous tolerance
        if (inX && inZ) {
          this._doorTriggersConsumed = true;
          this._doorTriggersEnabled = false;
          // Fire and forget async tutorial
          this._runStackToolTutorial().catch(err => console.error('❌ Stack tutorial error', err));
          break;
        }
      }
    }
    
    // Check lift trigger volume to start lift area cutscene
    if (this._liftTriggerEnabled && !this._liftTriggerConsumed && this.game?.player?.body) {
      const p = this.game.player.body.position; // CANNON.Vec3
      const box = this._liftTriggerBox;
      // Simple AABB check with Y tolerance
      const inX = Math.abs(p.x - box.center.x) <= box.halfSize.x;
      const inY = Math.abs(p.y - box.center.y) <= box.halfSize.y;
      const inZ = Math.abs(p.z - box.center.z) <= box.halfSize.z;
      if (inX && inY && inZ) {
        this._liftTriggerConsumed = true;
        this._liftTriggerEnabled = false;
        // Fire and forget async cutscene
        this._runLiftAreaCutscene().catch(err => console.error('❌ Lift area cutscene error', err));
      }
    }
    
    // Check right-side approach trigger volume
    if (this._rightPathTriggerEnabled && !this._rightPathTriggerConsumed && this.game?.player?.body) {
      const p2 = this.game.player.body.position; // CANNON.Vec3
      const box2 = this._rightPathTriggerBox;
      const inX2 = Math.abs(p2.x - box2.center.x) <= box2.halfSize.x;
      const inY2 = Math.abs(p2.y - box2.center.y) <= box2.halfSize.y;
      const inZ2 = Math.abs(p2.z - box2.center.z) <= box2.halfSize.z;
      if (inX2 && inY2 && inZ2) {
        this._rightPathTriggerConsumed = true;
        this._rightPathTriggerEnabled = false;
        this._runRightPathCutscene().catch(err => console.error('❌ Right-path cutscene error', err));
      }
    }
    
    // Check boost hint trigger volume (teaches jump + X combo)
    if (this._boostHintTriggerEnabled && !this._boostHintTriggerConsumed && this.game?.player?.body) {
      const p3 = this.game.player.body.position;
      const box3 = this._boostHintTriggerBox;
      const inX3 = Math.abs(p3.x - box3.center.x) <= box3.halfSize.x;
      const inY3 = Math.abs(p3.y - box3.center.y) <= box3.halfSize.y;
      const inZ3 = Math.abs(p3.z - box3.center.z) <= box3.halfSize.z;
      if (inX3 && inY3 && inZ3) {
        this._boostHintTriggerConsumed = true;
        this._showBoostHint();
      }
    }
    
    // Check node proximity and handle interaction
    this._checkNodeProximity();
    
    // Robust first-interaction handling with Richard: allow direct E key trigger when near
    if (!this.interactionDialogueShown && !this.cutsceneActive) {
      // If exclamation mark is present (first interaction ready)
      const hasIndicator = !!(this.exclamationGroup && this.exclamationGroup.parent);
      const nearRichard = hasIndicator && this._isPlayerNearRichard(4.5);

      // Show/hide prompt for Richard interaction only when interactable
      const rPrompt = this.game?.ui?.get('interactionPrompt');
      if (rPrompt) {
        if (nearRichard) {
          if (!rPrompt.isVisible || this._richardPromptActive) {
            const currentText = rPrompt.getText ? rPrompt.getText() : '';
            const isComputerPrompt = currentText.includes('GLITCHED') || currentText.includes('LLMs');
            if (!isComputerPrompt) {
              rPrompt.show('to talk to Richard');
              this._richardPromptActive = true;
            }
          }
        } else if (this._richardPromptActive && rPrompt.isVisible) {
          rPrompt.hide();
          this._richardPromptActive = false;
        }
      }

      if (nearRichard) {
        const now = Date.now();
        if (this.game.input && this.game.input.isKey('KeyE')) {
          if (now - this.lastRichardInteractionPress > this.richardInteractionCooldown) {
            this.lastRichardInteractionPress = now;
            this._handleRichardInteraction();
          }
        }
      }
    }

    // Check Richard final interaction (when exclamation mark is present)
    if (!this.richardInteractionActive && !this.cutsceneActive) {
      this._checkRichardFinalInteraction();
    }
  }

  /**
   * Respawn player at initial spawn position
   * @param {boolean} fromDeath - true if respawning from death, false if from fall
   */
  _respawnPlayer(fromDeath) {
    if (!this.game?.player) return;
    
    console.log(`🔄 [Level0Controller] Respawning player ${fromDeath ? '(from death)' : '(from fall)'}`);
    
    // Determine respawn position:
    // - If died during boss fight: respawn near Richard for retry
    // - Otherwise: respawn at initial spawn position
    let respawnPosition = this.initialSpawnPosition.clone();
    
    if (fromDeath && this.bossFightSystem !== null && this.richard?.mesh) {
      // Respawn near Richard (but not too close) so player can retry the boss fight
      const richardPos = this.richard.mesh.position;
      respawnPosition = new THREE.Vector3(
        richardPos.x + 5, // 5 units away from Richard
        richardPos.y,
        richardPos.z + 5
      );
      console.log('🔄 [Level0Controller] Died to boss - respawning near Richard for retry');
    }
    
    // Reset player position to respawn point
    if (this.game.player.body) {
      this.game.player.body.position.set(
        respawnPosition.x,
        respawnPosition.y,
        respawnPosition.z
      );
      this.game.player.body.velocity.set(0, 0, 0);
      this.game.player.body.angularVelocity.set(0, 0, 0);
    }
    if (this.game.player.mesh) {
      this.game.player.mesh.position.copy(respawnPosition);
    }
    
    // If respawning from death
    if (fromDeath) {
      // Reset player health to max
      if (this.game.player.maxHealth) {
        this.game.player.health = this.game.player.maxHealth;
      } else {
        this.game.player.health = 100;
      }
      
      // Reset stack to full (3 blocks)
      if (this.game.player.weapon) {
        console.log('🔍 [Level0Controller] Weapon exists:', !!this.game.player.weapon);
        console.log('🔍 [Level0Controller] Stack tool state - Granted:', this.game.state?.stackToolGranted, 'Broken:', this.game.state?.stackToolBroken);
        console.log('🔍 [Level0Controller] Current level ID:', this.game.currentLevelId);
        
        // UNBREAK the stack tool for the retry (it was broken during boss fight)
        if (this.game.state) {
          this.game.state.stackToolBroken = false;
          console.log('🔧 [Level0Controller] Stack tool unbroken for retry');
        }
        
        // Clear any existing blocks
        if (this.game.player.weapon.clear) {
          this.game.player.weapon.clear();
        }
        
        // Re-enable the stack tool using the game's refresh method
        if (this.game.refreshStackToolAvailability) {
          console.log('🔄 [Level0Controller] Calling refreshStackToolAvailability()...');
          this.game.refreshStackToolAvailability();
        } else {
          // Fallback: directly mount
          console.log('🔄 [Level0Controller] Using fallback mount method...');
          this.game.player.weapon.mount();
        }
        
        console.log('✅ [Level0Controller] Stack tool enabled status:', this.game.player.weapon.enabled);
        console.log('🔄 [Level0Controller] Stack restored to full (0/3)');
      }
      
      // Update HUD if available
      const hud = this.game?.ui?.get('hud');
      if (hud && hud.setProps) {
        hud.setProps({
          health: this.game.player.health,
          maxHealth: this.game.player.maxHealth || 100
        });
      }
      
      // If boss fight was active, reset boss fight state and enable Richard's final interaction
      if (this.bossFightSystem !== null) {
        console.log('🔄 [Level0Controller] Resetting boss fight state after death');
        
        // Clean up boss fight system properly
        try {
          if (this.bossFightSystem.cleanup) {
            this.bossFightSystem.cleanup();
          }
          if (this.bossFightSystem.hud && this.bossFightSystem.hud.unmount) {
            this.bossFightSystem.hud.unmount();
          }
        } catch (e) {
          console.warn('⚠️ Error cleaning up boss fight system on reset:', e);
        }
        
        // Clear boss fight system
        this.bossFightSystem = null;
        
        // Re-enable Richard's final interaction (boss fight trigger)
        this._finalBinaryChoiceEnabled = true;
        console.log('✅ [Level0Controller] Richard final interaction re-enabled for retry');
        
        // Ensure Richard is interactable and show exclamation mark
        if (this.richard && this.richard.mesh) {
          // Make sure Richard is set to kinematic (non-interactable by physics)
          if (this.richard.body) {
            this.richard.body.type = CANNON.Body.KINEMATIC;
            this.richard.body.collisionResponse = false;
          }
          // Show exclamation mark above Richard
          this._showExclamationMark();
          console.log('✅ [Level0Controller] Exclamation mark shown above Richard');
        }
        
        // Find and remove/reset boss enemy if it exists
        if (this.level?.enemyManager) {
          const bossEnemy = this.level.enemyManager.enemies.find(e => e.enemyType === 'lobber_boss');
          if (bossEnemy) {
            // Remove boss enemy or reset it
            const bossIndex = this.level.enemyManager.enemies.indexOf(bossEnemy);
            if (bossIndex !== -1) {
              try {
                bossEnemy.dispose();
              } catch (e) {
                console.warn('⚠️ Error disposing boss enemy:', e);
              }
              this.level.enemyManager.enemies.splice(bossIndex, 1);
            }
          }
        }
      }
    }
    
    // If respawning from fall (not death), show movement hint
    if (!fromDeath) {
      this._showTemporaryPopup('Hint: Press and hold Shift to sprint, then press Space to jump', 4000);
    }
    
    // Progress is preserved (nodes, interactions, etc. are not reset)
    console.log('✅ [Level0Controller] Player respawned, progress preserved');
  }

  /**
   * Dispose and cleanup
   */
  dispose() {
    console.log('🧹 [Level0Controller] Disposing...');
    
    // Clean up boss fight system FIRST to remove HUD and platform
    if (this.bossFightSystem) {
      console.log('🧹 [Level0Controller] Cleaning up boss fight system...');
      try {
        if (this.bossFightSystem.cleanup) {
          this.bossFightSystem.cleanup();
        }
        // Extra safety: ensure HUD is unmounted
        if (this.bossFightSystem.hud && this.bossFightSystem.hud.unmount) {
          this.bossFightSystem.hud.unmount();
        }
        this.bossFightSystem = null;
      } catch (e) {
        console.warn('⚠️ Error cleaning up boss fight system:', e);
      }
    }
    
    // Stop pacing and remove listeners
    this._stopPacingLoop();
    // Ensure any cinematic look-at RAFs are stopped
    this._stopCameraLookAtSteve();
    this._stopCameraLookAtPlayer();
    
    // Stop pulsing animation
    if (this._pulseAnimationId) {
      cancelAnimationFrame(this._pulseAnimationId);
      this._pulseAnimationId = null;
    }
    
    // Clean up Enter prompt UI
    this._hideEnterPrompt();
    if (this.enterPromptEl && this.enterPromptEl.parentElement) {
      this.enterPromptEl.parentElement.removeChild(this.enterPromptEl);
    }
    this.enterPromptEl = null;
    if (this.enterPromptPulseId) {
      cancelAnimationFrame(this.enterPromptPulseId);
      this.enterPromptPulseId = null;
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
    
    // Remove level complete event listener
    if (this._levelCompleteHandler) {
      window.removeEventListener('level:complete', this._levelCompleteHandler);
      this._levelCompleteHandler = null;
    }
    
    // Clean up any timers or pending operations
    this.richard = null;
    this.steve = null;
    this.isInitialized = false;
    this.cutsceneActive = false;

    // Restore any overridden interaction handlers (doors/collectibles)
    try {
      this._disableRichardInteractionMode();
    } catch { /* ignore */ }
  }
}