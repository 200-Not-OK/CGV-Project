import * as THREE from 'three';
import { createSceneAndRenderer, setSkyPreset, enforceOnlySunLight, disableAllShadows, loadPanoramaSky } from './scene.js';
import { InputManager } from './input.js';
import { Player } from './player.js';
import { LevelManager } from './levelManager.js';
import { ThirdPersonCamera } from './thirdPersonCamera.js';
import { FreeCamera } from './freeCamera.js';
import { UIManager } from './uiManager.js';
import { HUD } from './components/hud.js';
import { Minimap } from './components/minimap.js';
import { Objectives } from './components/objectives.js';
import { SmallMenu } from './components/menu.js';
import { FPS } from './components/fps.js';
import { Crosshair } from './components/crosshair.js';
import { Collectibles } from './components/collectibles.js';
import { InteractionPrompt } from './components/interactionPrompt.js';
import { CollectiblesLevel3 } from './components/CollectiblesLevel3.js';
import { DeathMenu } from './components/deathMenu.js';
import { VoiceoverCard } from './components/voiceoverCard.js';
import { Coordinates } from './components/coordinates.js';
import { TriggerPrompt } from './components/triggerPrompt.js';
import { FirstPersonCamera } from './firstPersonCamera.js';
import { LightManager } from './lightManager.js';
import * as LightModules from './lights/index.js';
import { PhysicsWorld } from './physics/PhysicsWorld.js';
import { CombatSystem } from './combatSystem.js';
import { DoorManager } from '../../public/assets/doors/DoorManager.js';
import { CollectiblesManager } from './CollectiblesManager.js';
import { SoundManager } from './soundManager.js';
import { ProximitySoundManager } from './proximitySoundManager.js';
import { PerformanceMonitor } from './performanceMonitor.js';
import { initGPUDetector } from './utils/gpuDetector.js';
import { initQualityControls } from './utils/qualityControls.js';
import { GlitchManager } from './GlitchManager.js';
import { ComputerTerminal } from './components/ComputerTerminal.js';

// OPTIONAL: if you have a levelData export, this improves level picker labelling.
// If your project doesn't export this, you can safely remove the import and the uses of LEVELS.
import { levels as LEVELS } from './levelData.js';

export class Game {
  constructor() {
    const { scene, renderer, shaderSystem } = createSceneAndRenderer();
    this.scene = scene;
    this.renderer = renderer;
    this.shaderSystem = shaderSystem;

    // GPU Detection & Quality Settings
    console.log('🔍 Detecting GPU capabilities...');
    this.gpuDetector = initGPUDetector(this.renderer);
    this.qualitySettings = this.gpuDetector.getQualitySettings();
    console.log(`🎮 GPU Tier: ${this.gpuDetector.tier}`);
    console.log(`⚙️ Quality Settings:`, this.qualitySettings);
    
    // Apply quality to renderer
    this.renderer.setPixelRatio(this.qualitySettings.pixelRatio);

    // Initialize physics world with scene for improved collision detection
    this.physicsWorld = new PhysicsWorld(this.scene, {
      useAccurateCollision: false, // Disable Trimesh by default for more reliable collision
      debugMode: false
    });

    // Input
    this.input = new InputManager(window);

    // Level system
    this.levelManager = new LevelManager(this.scene, this.physicsWorld, this);
    this.level = null;

    // Performance monitoring
    this.performanceMonitor = new PerformanceMonitor();
    // Debug: center-screen ray probe (to identify unexpected occluders)
    this._centerProbeEnabled = false;
    this._centerProbeCooldown = 0;

    // Player
    this.player = new Player(this.scene, this.physicsWorld, {
      speed: 17,
      jumpStrength: 12,
      size: [1, 1.5, 1],
      // Collider size scaling factors (optional)
      colliderWidthScale: 0.5,   // 40% of model width (default: 0.4)
      colliderHeightScale: 1,  // 90% of model height (default: 0.9)
      colliderDepthScale: 0.5,    // 40% of model depth (default: 0.4)
      game: this // Pass game reference for death handling and boss win event
    }, this);
    // Player position will be set by loadLevel() call

    // Cameras
    this.thirdCam = new ThirdPersonCamera(this.player, this.input, window);
    this.firstCam = new FirstPersonCamera(this.player, this.input, window);
    this.freeCam = new FreeCamera(this.input, window);
    // Cache the underlying three.js camera objects so identity checks are reliable
    this.thirdCameraObject = this.thirdCam.getCamera();
    this.firstCameraObject = this.firstCam.getCamera();
    this.freeCameraObject = this.freeCam.getCamera();
    this.activeCamera = this.thirdCameraObject;
    //this.activeCamera = this.freeCameraObject;
    // Enable alwaysTrackMouse for third-person camera
    this.input.alwaysTrackMouse = true;
    
    // Skip intro/cinematic with K key
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyK' && this.cinematicLock) {
        console.log('⏭️ Skipping intro/cinematic with K key');
        this.cinematicLock = false;
        if (this.input) this.input.setEnabled(true);
        if (this.level?.cinematicsManager) {
          this.level.cinematicsManager.skipRequested = true;
        }
        // Force camera back to third person
        if (this.thirdCameraObject) {
          this.activeCamera = this.thirdCameraObject;
        }
        this.input.alwaysTrackMouse = true;
      }
    });
    
    // Request pointer lock for third-person/first-person camera when the user clicks
    // Ignore clicks originating from the pause menu so the Resume button's click
    // doesn't accidentally trigger a second request or race with the resume flow.
    window.addEventListener('click', (e) => {
      if (this.pauseMenu && this.pauseMenu.contains && this.pauseMenu.contains(e.target)) return;

      // Resume AudioContext on first user interaction (required by browsers)
      if (this.soundManager && this.soundManager.listener && this.soundManager.listener.context) {
        if (this.soundManager.listener.context.state === 'suspended') {
          this.soundManager.listener.context.resume().then(() => {
            console.log('🔊 AudioContext resumed - now playing pending audio');

            // Play any pending music/ambient/voiceover after AudioContext is resumed
            if (this._pendingMusic) {
              console.log('🔊 Playing pending music:', this._pendingMusic);
              this.soundManager.playMusic(this._pendingMusic);
              this._pendingMusic = null;
            }
            if (this._pendingAmbient) {
              console.log('🔊 Playing pending ambient:', this._pendingAmbient);
              this.soundManager.playAmbient(this._pendingAmbient);
              this._pendingAmbient = null;
            }
            if (this._pendingVoiceover) {
              console.log('🔊 Playing pending voiceover:', this._pendingVoiceover);
              const voToPlay = this._pendingVoiceover;
              this._pendingVoiceover = null;
              setTimeout(() => {
                // Play first voiceover with callback to play maze voiceover after
                this.playVoiceover(voToPlay, 15000, () => {
                  // After levelstart VO finishes, play maze VO (Level 2 only)
                  if (this.level?.data?.id === 'level2') {
                    console.log('🎤 Levelstart VO finished, playing maze VO next');
                    setTimeout(() => {
                      this.playVoiceover('vo-maze', 12000);
                    }, 2000); // 2 second pause between voiceovers
                  }
                });
              }, 500); // Small delay so VO plays after music starts
            }
          });
        }
      }

      // request pointer lock when clicking while in first or third person
      if ((this.activeCamera === this.thirdCameraObject || this.activeCamera === this.firstCameraObject) && document.pointerLockElement !== document.body) {
        try {
          document.body.requestPointerLock();
        } catch (err) {
          // Some browsers may throw if the gesture was not accepted; swallow and warn
          console.warn('requestPointerLock failed:', err);
        }
      }
    });

    // When pointer lock is exited (usually via Escape), if we were in third/first person
    // we should go directly to the pause menu. Some exits are intentional (we call
    // document.exitPointerLock()); to avoid treating those as user Esc presses we
    // use a suppression flag.
    this._suppressPointerLockPause = false;
    document.addEventListener('pointerlockchange', () => {
      // Only react to lock being removed
      if (document.pointerLockElement) return;
      if (this._suppressPointerLockPause) {
        // programmatic exit; clear flag and do nothing
        this._suppressPointerLockPause = false;
        return;
      }
      // Don't show pause menu if player is dead
      if (this.playerDead) {
        return;
      }
      // If we were in first/third person, interpret the pointerlock exit as Esc -> pause
      if (this.activeCamera === this.thirdCameraObject || this.activeCamera === this.firstCameraObject) {
        this.setPaused(true);
      }
    });

    // When switching to free camera, move it near player
    this._bindKeys();

    // UI manager (modular UI per-level)
    this.ui = new UIManager(document.getElementById('app'));
    // register a default HUD — actual per-level UI will be loaded by loadLevel
    this.ui.add('hud', HUD, { health: 100 });
    // Add FPS counter
    this.ui.add('fps', FPS, { showFrameTime: true });
    console.log('📊 FPS counter enabled. Press F to toggle visibility.');
    // Add coordinates display
    this.ui.add('coordinates', Coordinates, {});
    // Add crosshair for combat
    this.ui.add('crosshair', Crosshair, { visible: true });
    // Add interaction prompt for chests
    this.ui.add('interactionPrompt', InteractionPrompt, { message: 'to interact' });
    // Add trigger prompt for level teleporters
    console.log('📝 Adding TriggerPrompt to UIManager');
    this.ui.add('triggerPrompt', TriggerPrompt, {});
    console.log('✅ TriggerPrompt added to UIManager');
    // Add voiceover card for character dialogues
    this.ui.add('voiceoverCard', VoiceoverCard, {
      characterName: 'Pravesh',
      position: 'left'
    });

    // Combat system
    this.combatSystem = new CombatSystem(this.scene, this.physicsWorld);

    // Collectibles system
    this.collectiblesManager = new CollectiblesManager(this.scene, this.physicsWorld, this);

    // Door system
    this.doorManager = new DoorManager(this.scene, this.physicsWorld, this);
    this.doorHelpersVisible = false; // Track door collision helper visibility (invisible by default)
    this.doorsUnlockedByApples = false; // Track if doors have been unlocked by apple collection

    // Lighting manager (modular per-level lights) with quality settings
    this.lights = new LightManager(this.scene, this.qualitySettings);

    // Sound manager (initialize with camera for 3D audio)
    this.soundManager = new SoundManager(this.thirdCameraObject);

    //glitch
  this.glitchManager = new GlitchManager(this);
this.collectiblesManager = new CollectiblesManager(this.scene, this.physicsWorld, this);
this.setupGlitchedLevelProgression();

// Connect the CollectiblesManager to GlitchManager for LLM events
this.setupLLMTracking();
    

     // Setup LLM tracking
    this.setupLLMTracking();
    
    // Make sure computer updates are called
    //this.setupComputerUpdates();

    // Proximity sound manager (for location-based sounds like torches)
    this.proximitySoundManager = null; // Will be initialized after player is ready

    // Overlays (built on demand)
    this._victoryOverlay = null;
    this._levelPicker = null;

    // Listen for level completion (boss dispatches 'level:complete')
    window.addEventListener('level:complete', () => this._onLevelComplete());

    // Load the initial level early so subsequent code can reference `this.level`
    this._initializeLevel();

    // small world grid
    const grid = new THREE.GridHelper(200, 200, 0x444444, 0x222222);
    this.scene.add(grid);
    // Pause state
    this.paused = false;
    this.playerDead = false; // Flag to track if player is dead
    this.pauseMenu = document.getElementById('pauseMenu');

    // Resume button
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) resumeBtn.addEventListener('click', (e) => {
      // prevent the click from bubbling to the global click handler which would
      // also try to request pointer lock and could race with this handler
      e.stopPropagation();
      e.preventDefault();
      this.setPaused(false);
      // After resuming, if we're in a camera mode that prefers pointer lock,
      // request it using the same user gesture (the button click). Wrap in try/catch
      // to avoid unhandled exceptions in browsers that refuse the request.
      if (this.activeCamera === this.thirdCameraObject || this.activeCamera === this.firstCameraObject) {
        try {
          document.body.requestPointerLock();
        } catch (err) {
          console.warn('requestPointerLock on resume failed:', err);
        }
      }
    });

    // Shader toggle button
    const toggleShadersBtn = document.getElementById('toggleShadersBtn');
    if (toggleShadersBtn) {
      toggleShadersBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.shaderSystem) {
          const newState = this.shaderSystem.toggleShaders();
          const statusText = document.getElementById('shaderStatusText');
          if (statusText) {
            statusText.textContent = newState ? 'ON' : 'OFF';
            toggleShadersBtn.style.background = newState ? '#2196F3' : '#ff6b6b';
          }
        }
      });
    }

    // Setup audio controls
    this._setupAudioControls();

    // loop
    this.last = performance.now();
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
    
    // Log available key bindings for user reference
    setTimeout(() => {
      console.log(`
🎮 === GAME CONTROLS ===
🎥 C - Cycle cameras (Free → Third → First)
🔄 N - Level Picker
🔍 M - Toggle physics debug visualization  
🚪 H - Toggle door collision helpers
⚔️  B - Toggle combat debug visuals
� E - Interact with chests and doors
📊 F - Toggle FPS counter
⏸️  ESC - Pause/Resume game
========================`);
    }, 1000); // Delay to ensure other startup messages are shown first
    
    // Initialize Quality Testing Controls (press Shift+Q to test different GPU tiers)
    setTimeout(() => {
      this.qualityControls = initQualityControls(this);
    }, 1500);
  }

  // Initialize the first level asynchronously
  async _initializeLevel() {
    await this.loadLevel(0);
    // Apply lights for current level   
    this.applyLevelLights(this.level?.data);

    // Show level picker shortly after load-in (as requested)
    setTimeout(() => this._showLevelPicker(), 400);
  }


  _bindKeys() {
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      // Always allow toggling pause via Escape, but not when player is dead
      if (code === 'Escape' && !this.playerDead) {
        this.setPaused(!this.paused);
        return;
      }
      // When paused ignore other keys
      if (this.paused) return;

      if (code === 'KeyC') {
        // cycle cameras: free -> third -> first -> free
        if (this.activeCamera === this.freeCameraObject) {
          // free -> third
          this.activeCamera = this.thirdCameraObject;
          this.input.alwaysTrackMouse = true;
          document.body.requestPointerLock();
          this.player.mesh.visible = true;
          // Safety: outside level3, disable L1/L2 on newly active camera
          try { if (this.level?.data?.id !== 'level3') { this.activeCamera.layers.disable(1); this.activeCamera.layers.disable(2); } } catch (_) {}
        } else if (this.activeCamera === this.thirdCameraObject) {
          // third -> first
          this.activeCamera = this.firstCameraObject;
          this.input.alwaysTrackMouse = true;
          document.body.requestPointerLock();
          this.player.mesh.visible = false; // hide model in first-person to avoid clipping
          // Safety: outside level3, disable L1/L2 on newly active camera
          try { if (this.level?.data?.id !== 'level3') { this.activeCamera.layers.disable(1); this.activeCamera.layers.disable(2); } } catch (_) {}
        } else {
          // first (or other) -> free
          this.freeCam.moveNearPlayer(this.player);
          this.activeCamera = this.freeCameraObject;
          this.input.alwaysTrackMouse = false;
          if (document.pointerLockElement) { this._suppressPointerLockPause = true; document.exitPointerLock(); }
          this.player.mesh.visible = true; // restore visibility
        }
        // ensure player is active when in third- or first-person
        // (handled each frame in _loop by checking activeCamera)
      } else if (code === 'KeyN') {
        // Open the Level Picker instead of jumping to next level
        this._showLevelPicker();
      } else if (code === 'KeyM') {
        // toggle physics debug visualization
        this.physicsWorld.enableDebugRenderer(!this.physicsWorld.isDebugEnabled());
      } else if (code === 'KeyP') {
        // toggle performance stats display
        this.performanceMonitor.toggleStatsDisplay();
      } else if (code === 'KeyH') {
        // toggle door collision helpers (green boxes around doors)
        if (this.doorManager) {
          this.doorHelpersVisible = !this.doorHelpersVisible;
          this.doorManager.toggleColliders(this.doorHelpersVisible);
        }
      } else if (code === 'KeyB') {
        // toggle combat debug visuals
        if (this.combatSystem) {
          this.combatSystem.toggleDebug();
        }
      }else if (code === 'KeyE') {
  // interact with computer, doors, or chests
  let interacted = false;
  
  // First try computer interaction (in level 3)
  if (this.computerTerminal && this.computerTerminal.isPlayerInRange(this.player.getPosition())) {
    console.log('💻 E key pressed near computer');
    this.computerTerminal.interact();
    interacted = true;
  }
  
  // If no computer interaction, try chest interaction
  if (!interacted && this.collectiblesManager && this.collectiblesManager.handleInteraction) {
    interacted = this.collectiblesManager.handleInteraction();
  }
  
  // If no chest interaction, try door interaction
  if (!interacted && this.doorManager) {
    const playerPos = this.player.getPosition();
    this.doorManager.interactWithClosestDoor(playerPos);
  }
  
  if (!interacted) {
    console.log('❌ No interactable object found');
  }


} else if (code === 'KeyF') {
        // toggle FPS counter visibility
        this.toggleFPSCounter();
      } else if (code === 'KeyQ') {
        // use health potion
        this.useHealthPotion();
      } else if (code === 'KeyJ') {
        // Debug: damage player for testing death system
        if (this.player && this.player.takeDamage) {
          this.player.takeDamage(50);
          console.log('🩸 Debug: Player damaged for testing');
        }
      } else if (code === 'KeyP') {
        // Debug: manually play music
        console.log('🔊 DEBUG: Manual music trigger (P key pressed)');
        console.log('🔊 AudioContext state:', this.soundManager.listener.context.state);
        console.log('🔊 Pending music:', this._pendingMusic);
        console.log('🔊 Current music:', this.soundManager.currentMusic);
        console.log('🔊 Available music tracks:', Object.keys(this.soundManager.music));

        // Try to resume AudioContext
        if (this.soundManager.listener.context.state === 'suspended') {
          this.soundManager.listener.context.resume().then(() => {
            console.log('🔊 AudioContext resumed via P key');
          });
        }

        // Try to play pending or intro music
        if (this._pendingMusic) {
          console.log('🔊 Playing pending music:', this._pendingMusic);
          this.soundManager.playMusic(this._pendingMusic, 0); // No fade for debugging
        } else if (this.soundManager.music['intro-theme']) {
          console.log('🔊 Playing intro-theme directly');
          this.soundManager.playMusic('intro-theme', 0); // No fade for debugging
        } else if (this.soundManager.music['level2-theme']) {
          console.log('🔊 Playing level2-theme directly');
          this.soundManager.playMusic('level2-theme', 0); // No fade for debugging
        }
      }
      // Toggle center probe
      if (code === 'KeyB') {
        this._centerProbeEnabled = !this._centerProbeEnabled;
        console.log(`🔎 Center probe ${this._centerProbeEnabled ? 'ENABLED' : 'DISABLED'}`);
      }
    });
  }

  toggleFPSCounter() {
    const fpsComponent = this.ui.get('fps');
    if (fpsComponent) {
      // Toggle visibility by modifying the display style
      const currentDisplay = fpsComponent.root.style.display;
      const isCurrentlyVisible = currentDisplay !== 'none';
      
      fpsComponent.root.style.display = isCurrentlyVisible ? 'none' : 'block';
      
      const newState = isCurrentlyVisible ? 'hidden' : 'visible';
      console.log(`📊 FPS counter is now ${newState} (Press F to toggle)`);
      
      // Store the state for consistency
      fpsComponent.isVisible = !isCurrentlyVisible;
    } else {
      console.warn('⚠️ FPS component not found. Cannot toggle visibility.');
    }
  }

  useHealthPotion() {
    // Get the UI component that manages potions
    const collectiblesUI = this.ui.get('collectibles');
    const hudUI = this.ui.get('hud');
    
    let potionUsed = false;
    let potionAvailable = false;
    
    // Try collectibles UI first (for levels that use collectibles component)
    if (collectiblesUI && collectiblesUI.useHealthPotion) {
      potionAvailable = collectiblesUI.collectibles.potions.count > 0;
      if (potionAvailable) {
        potionUsed = collectiblesUI.useHealthPotion();
      }
    }
    // Fall back to HUD UI (for levels that use HUD component)
    else if (hudUI && hudUI.useHealthPotion) {
      potionAvailable = hudUI.healthPotions > 0;
      if (potionAvailable) {
        potionUsed = hudUI.useHealthPotion();
      }
    }
    
    if (potionUsed) {
      // Play potion sound
      if (this.soundManager && this.soundManager.sfx['potion']) {
        this.soundManager.playSFX('potion', 0.8);
      }

      // Heal the player
      if (this.player && this.player.heal) {
        this.player.heal(25); // Heal 25 HP
      }
      console.log('🧪 Used health potion! +25 HP');
    } else if (!potionAvailable) {
      console.log('❌ No health potions available!');
    } else {
      console.log('⚠️ Could not use health potion');
    }
  }

  playVoiceover(voName, duration = 5000, onComplete = null) {
    console.log(`🎤 playVoiceover called with: ${voName}`);
    console.log(`🎤 soundManager exists?`, !!this.soundManager);
    console.log(`🎤 soundManager.sfx exists?`, !!this.soundManager?.sfx);
    console.log(`🎤 soundManager.sfx[${voName}] exists?`, !!this.soundManager?.sfx?.[voName]);

    // Play voiceover and show the card
    if (this.soundManager && this.soundManager.sfx[voName]) {
      console.log(`🎤 Playing voiceover: ${voName}`);
      this.soundManager.playSFX(voName, 1.0);

      // Show voiceover card
      const voCard = this.ui.get('voiceoverCard');
      console.log(`🎤 voCard exists?`, !!voCard);
      if (voCard) {
        console.log(`🎤 Showing voiceover card for Pravesh`);
        voCard.show('Pravesh');
        voCard.startSpeaking();

        // Hide after duration
        setTimeout(() => {
          console.log(`🎤 Stopping voiceover card speaking animation`);
          voCard.stopSpeaking();
          setTimeout(() => {
            console.log(`🎤 Hiding voiceover card`);
            voCard.hide();

            // Call completion callback if provided
            if (onComplete && typeof onComplete === 'function') {
              console.log(`🎤 Calling voiceover completion callback`);
              onComplete();
            }
          }, 500);
        }, duration);
      } else {
        console.error(`🎤 ERROR: voiceoverCard component not found!`);
        // Still call callback even if card fails
        if (onComplete && typeof onComplete === 'function') {
          setTimeout(() => onComplete(), duration);
        }
      }
    } else {
      console.error(`🎤 ERROR: Voiceover ${voName} not found in soundManager.sfx`);
      console.log(`🎤 Available SFX:`, Object.keys(this.soundManager?.sfx || {}));
    }
  }

  showDeathMenu() {
    console.log('💀 Showing death menu');

    // Play fail voiceover if available
    if (this.soundManager && this.soundManager.sfx['vo-fail']) {
      console.log('🎤 Playing fail voiceover');
      // Stop music and play fail VO
      if (this.soundManager.currentMusic) {
        this.soundManager.stopMusic();
      }
      this.playVoiceover('vo-fail', 10000); // 10 seconds for fail voiceover
    }

    // Set death state flag
    this.playerDead = true;

    // Create death menu if it doesn't exist
    if (!this.ui.get('deathMenu')) {
      this.ui.add('deathMenu', DeathMenu, {
        onRespawn: () => this.respawnPlayer()
      });
    }

    // Show the death menu
    const deathMenu = this.ui.get('deathMenu');
    if (deathMenu && deathMenu.show) {
      deathMenu.show();
    }

    // Pause the game without showing pause menu
    this.paused = true;

    // Disable input handling when paused
    if (this.input && this.input.setEnabled) {
      this.input.setEnabled(false);
    }

    // Exit pointer lock if active
    if (document.pointerLockElement) {
      this._suppressPointerLockPause = true;
      document.exitPointerLock();
    }
  }

  respawnPlayer() {
    console.log('🔄 Respawning player');
    
    // Clear death state flag
    this.playerDead = false;
    
    // Hide death menu
    const deathMenu = this.ui.get('deathMenu');
    if (deathMenu && deathMenu.hide) {
      deathMenu.hide();
    }
    
    // Reload the current level
    if (this.levelManager && this.levelManager.getCurrentLevelIndex !== undefined) {
      const currentIndex = this.levelManager.getCurrentLevelIndex();
      this.loadLevel(currentIndex);
    }
    
    // Reset player health
    this.player.health = this.player.maxHealth;
    
    // Update HUD
    const hudUI = this.ui.get('hud');
    if (hudUI && hudUI.setProps) {
      hudUI.setProps({ 
        health: this.player.health,
        maxHealth: this.player.maxHealth 
      });
    }
    
    // Unpause the game
    this.paused = false;
    
    // Re-enable input handling
    if (this.input && this.input.setEnabled) {
      this.input.setEnabled(true);
    }
  }

  _loop() {
    requestAnimationFrame(this._loop);
    const now = performance.now();
    let delta = (now - this.last) / 1000;
    this.last = now;
    // clamp delta
    delta = Math.min(delta, 1 / 20);

    // Start frame timing
    this.performanceMonitor.startFrame();

    // If paused: skip updates but still render the current frame.
    if (this.paused) {
      this.renderer.render(this.scene, this.activeCamera);
      this.performanceMonitor.endFrame(this.renderer);
      return;
    }

    // Update computer terminal if it exists
  if (this.computerTerminal && this.player) {
    this.computerTerminal.update(this.player.getPosition());
  }

    // Start physics timing
    this.performanceMonitor.startPhysics();
    // Step physics simulation
    this.physicsWorld.step(delta);
    // End physics timing
    this.performanceMonitor.endPhysics();

    // Start update timing
    this.performanceMonitor.startUpdate();

    // update level (updates colliders/helpers and enemies) - only if level is loaded
    if (this.level && this.level.update) {
      this.level.update(delta, this.player, this.level.getPlatforms());
    }

    // update UI each frame with some context (player model and simple state)
    if (this.ui) {
      const ctx = {
        player: { 
          health: this.player.health ?? 100,
          maxHealth: this.player.maxHealth ?? 100 
        },
        playerModel: this.player.mesh,
        enemies: this.level ? this.level.getEnemies() : [],
        collectibles: this.collectiblesManager ? this.collectiblesManager.getAllCollectibles() : [],
        game: this  // Pass game reference for coordinates component
      };
      this.ui.update(delta, ctx);
    }

    // determine camera orientation for movement mapping
    let camOrientation, playerActive;
    if (this.activeCamera === this.thirdCam.getCamera()) {
      this.thirdCam.update();
      camOrientation = this.thirdCam.getCameraOrientation();
      playerActive = true;
    } else if (this.activeCamera === this.firstCam.getCamera()) {
      this.firstCam.update();
      camOrientation = this.firstCam.getCameraOrientation();
      playerActive = true;
    } else {
      this.freeCam.update(delta);
      camOrientation = this.freeCam.getOrientation();
      playerActive = false;
    }

    // Update crosshair visibility based on camera mode
    const crosshair = this.ui.get('crosshair');
    if (crosshair) {
      crosshair.setProps({ visible: true }); // Always visible for debugging
    }

    // update player (movement read from input manager)
    const platforms = this.level ? this.level.getPlatforms() : [];
    this.player.update(delta, this.input, camOrientation, platforms, playerActive);

    // Handle combat input (left-click to attack)
    if (playerActive && this.input.wasLeftClicked() && this.combatSystem.canAttack()) {
      if (this.player.performAttack()) {
        // Set enemies for combat system if level has them
        if (this.level && this.level.getEnemies) {
          this.combatSystem.setEnemies(this.level.getEnemies());
        }
        // Perform the sword swing attack (better for horizontal sword animation)
        this.combatSystem.performSwordSwing(this.player, this.activeCamera);
      }
    }

    // Update combat system
    this.combatSystem.update(delta);

    // Check for final snake remaining (Level 2 only)
    if (this.level?.data?.id === 'level2') {
      this.checkFinalSnake();
    }

    // Update door system
    this.doorManager.update(delta, this.player.getPosition());

    // Update collectibles system
    this.collectiblesManager.update(delta);
    
    // Update placeable blocks
    if (this.level && this.level.placeableBlockManager) {
      this.level.placeableBlockManager.update(delta);
    }

    // Update proximity sounds
    if (this.proximitySoundManager) {
      this.proximitySoundManager.update();
    } else {
      // Debug: Log once per second if proximity sound manager doesn't exist
      if (!this._proximityDebugTime) this._proximityDebugTime = 0;
      this._proximityDebugTime += delta;
      if (this._proximityDebugTime > 1000) {
        console.log('⚠️ No proximitySoundManager in update loop');
        this._proximityDebugTime = 0;
      }
    }
    // Check apple collection status for Level 2 door unlocking
    this.checkAppleCollectionForDoors();

    // update lights (allow dynamic lights to animate)
    if (this.lights) this.lights.update(delta);

    // Update shaders with camera & sun info
    if (this.shaderSystem) {
      this.shaderSystem.update(delta, this.activeCamera, this.scene);
    }

    // Optional: center-screen ray probe once per ~0.5s to find front-most occluder
    if (this._centerProbeEnabled && this.activeCamera && this.level?.data?.id) {
      this._centerProbeCooldown -= delta;
      if (this._centerProbeCooldown <= 0) {
        this._centerProbeCooldown = 500; // ms
        try {
          const ray = new THREE.Raycaster();
          const origin = new THREE.Vector3();
          const dir = new THREE.Vector3();
          origin.copy(this.activeCamera.position);
          this.activeCamera.getWorldDirection(dir);
          ray.set(origin, dir);
          const hits = ray.intersectObjects(this.scene.children, true);
          const ignore = (obj) => {
            const n = (obj.name || '').toLowerCase();
            if (n.includes('sky') || n.includes('cloud')) return true;
            if (obj.renderOrder !== undefined && obj.renderOrder < 0) return true;
            return false;
          };
          let hit = null;
          for (const h of hits) { if (!ignore(h.object)) { hit = h; break; } }
          if (hit) {
            const mat = hit.object.material;
            const matName = Array.isArray(mat) ? mat.map((m)=>m && m.type).join(',') : (mat && mat.type);
            console.log('🎯 Center hit:', {
              level: this.level.data.id,
              object: hit.object.name || '(unnamed)',
              dist: Number(hit.distance.toFixed(2)),
              layers: hit.object.layers ? hit.object.layers.mask : 'n/a',
              material: matName
            });
          } else {
            console.log('🎯 Center hit: none');
          }
        } catch (e) { /* ignore */ }
      }
    }

    // Safety: outside Level 3, ensure the player-only character light never contributes and that
    // Level 3-specific visuals stay disabled.
    try {
      if (this.level?.data?.id !== 'level3') {
        if (this.player?.characterLight) {
          this.player.characterLight.visible = false;
          this.player.characterLight.intensity = 0;
        }
        if (this.player?.mesh?.userData?.__toonOutlined) {
          const toRemove = [];
          this.player.mesh.traverse((child) => {
            if (!child) return;
            if (child.userData && child.userData.__toonOutline) {
              const om = child.userData.__toonOutline;
              if (om && om.parent) om.parent.remove(om);
              child.userData.__toonOutline = null;
            }
            if (child.name && typeof child.name === 'string' && child.name.endsWith('_toonOutline')) {
              toRemove.push(child);
            }
          });
          toRemove.forEach((m) => { if (m.parent) m.parent.remove(m); });
          delete this.player.mesh.userData.__toonOutlined;
        }
        if (this.activeCamera?.layers) {
          this.activeCamera.layers.disable(1);
          this.activeCamera.layers.disable(2);
        }
      }
    } catch (_) {}
    // One-shot logging to identify suspicious black meshes outside Level 3
    try {
      if (this.level?.data?.id !== 'level3') {
        if (!this._nonLevel3EyeLogged) {
          this._nonLevel3EyeLogged = true;
          const suspects = [];
          const tmpSize = new THREE.Vector3();
          this.scene.traverse((obj) => {
            if (!obj || !obj.isMesh) return;
            const lowerName = (obj.name || '').toLowerCase();
            const matchesName = lowerName.includes('eye') || lowerName.includes('sun');
            const mat = obj.material;
            const checkMaterial = (material) => {
              if (!material) return false;
              if (material.isMeshBasicMaterial || material.isMeshStandardMaterial || material.isMeshPhongMaterial) {
                if (!material.color) return false;
                const c = material.color;
                const nearlyBlack = c.r < 0.05 && c.g < 0.05 && c.b < 0.05;
                if (!nearlyBlack) return false;
                if (material.opacity !== undefined && material.opacity < 0.9) return false;
                return true;
              }
              return false;
            };
            const hasBlackMaterial = Array.isArray(mat) ? mat.some(checkMaterial) : checkMaterial(mat);
            if (!matchesName && !hasBlackMaterial) return;
            let radius = 0;
            const scaleMax = obj.scale ? Math.max(obj.scale.x, obj.scale.y, obj.scale.z) : 1;
            if (obj.geometry) {
              const geom = obj.geometry;
              if (!geom.boundingSphere) {
                try { geom.computeBoundingSphere(); } catch (_) {}
              }
              if (geom.boundingSphere && isFinite(geom.boundingSphere.radius)) {
                radius = Math.max(radius, geom.boundingSphere.radius * scaleMax);
              }
              if (!geom.boundingBox) {
                try { geom.computeBoundingBox(); } catch (_) {}
              }
              if (geom.boundingBox) {
                geom.boundingBox.getSize(tmpSize);
                radius = Math.max(radius, tmpSize.length() * 0.25 * scaleMax);
              }
            }
            if (radius < 5) return;
            // Immediately neutralize the suspect outside Level 3
            try {
              obj.visible = false;
              if (obj.layers) { obj.layers.disable(2); obj.layers.disable(1); }
              if (obj.parent) obj.parent.remove(obj);
            } catch (_) {}
            // Collect for log/debug
            suspects.push({
              name: obj.name || '(unnamed)',
              material: Array.isArray(mat) ? mat.map((m) => m?.type || 'Material').join(',') : (mat?.type || 'Material'),
              layers: obj.layers ? obj.layers.mask : 'n/a',
              radius: Number(radius.toFixed(2))
            });
          });
          if (suspects.length > 0) {
            console.log('👁️ Non-Level3 eye suspects', suspects);
          }
        }
      } else {
        this._nonLevel3EyeLogged = false;
      }
    } catch (err) {
      console.warn('⚠️ Non-level3 eye logging failed:', err);
    }

    // End update timing
    this.performanceMonitor.endUpdate();

    // Start render timing
    this.performanceMonitor.startRender();
    // render
    this.renderer.render(this.scene, this.activeCamera);
    // End render timing
    this.performanceMonitor.endRender();

    // End frame timing and collect stats
    this.performanceMonitor.endFrame(this.renderer);
  }

  // Load level by index and swap UI based on level metadata
  // Load level by index and swap UI based on level metadata
  async loadLevel(index) {
    if (this.level) this.level.dispose();

   if (this.collectiblesManager) {
    this.collectiblesManager.clearPersistentChests();
  }
  // Preserve debug state before disposing old physics world
  const wasDebugEnabled = this.physicsWorld.isDebugEnabled();

  // Clear existing physics bodies and recreate physics world
  this.physicsWorld.dispose();
    this.physicsWorld = new PhysicsWorld(this.scene, {
      useAccurateCollision: false,
      debugMode: wasDebugEnabled
    });

    // Reset per-level state trackers
    this._nonLevel3EyeLogged = false;

    console.log('🚀 Loading level index:', index);
  
  // === Get level metadata without constructing it yet ===
  // Read from the level registry directly to avoid constructing the level twice
  const levelData = this.levelManager.levels[index];
  this.currentLevelId = levelData?.id;
  
  console.log('📋 Level data loaded:', this.currentLevelId);
  console.log('📍 Computer location in data:', levelData.computerLocation);

  // Set levelId and eye-allow flag ASAP so scene code gates correctly
  try {
    if (!this.scene.userData) this.scene.userData = {};
    this.scene.userData.levelId = this.currentLevelId || null;
    this.scene.userData.allowSunEye = (this.scene.userData.levelId === 'level3');
  } catch (_) {}

  // Immediate cleanup: remove any lingering Level 3 sun/eye groups before rendering next frame
  try {
    if (this.scene?.userData?.sunEye) {
      const g = this.scene.userData.sunEye.group;
      if (g && g.parent) g.parent.remove(g);
      this.scene.userData.sunEye = null;
    }
    const toRemove = [];
    this.scene.traverse((obj) => { if (obj?.userData?.isSun) toRemove.push(obj); });
    toRemove.forEach((obj) => { if (obj.parent) obj.parent.remove(obj); });
    if (this.scene?.userData?.topFillLight) {
      const l = this.scene.userData.topFillLight; if (l.parent) l.parent.remove(l);
      this.scene.userData.topFillLight = null;
    }
    if (this.scene?.userData?.ambientFill) {
      const a = this.scene.userData.ambientFill; if (a.parent) a.parent.remove(a);
      this.scene.userData.ambientFill = null;
    }
  } catch (_) { /* non-fatal cleanup */ }

  // Update references that depend on physics world
  this.player.physicsWorld = this.physicsWorld;
  this.combatSystem.physicsWorld = this.physicsWorld;
  this.doorManager.physicsWorld = this.physicsWorld;
  this.collectiblesManager.updatePhysicsWorld(this.physicsWorld);
  this.doorManager.dispose();
  this.doorManager = new DoorManager(this.scene, this.physicsWorld, this);
  this.doorsUnlockedByApples = false;

  if (this.player.originalModelSize) {
    this.player.createPhysicsBody(this.player.originalModelSize);
  }

  this.levelManager.physicsWorld = this.physicsWorld;
  
  // === Load the level once ===
  this.level = await this.levelManager.loadIndex(index);

  // Store current level id on scene for shader/scoping before applying presets
  try {
    if (!this.scene.userData) this.scene.userData = {};
    this.scene.userData.levelId = this.level?.data?.id || null;
    // Explicit flag to allow sun eye only in level3
    this.scene.userData.allowSunEye = (this.scene.userData.levelId === 'level3');
  } catch (e) { /* ignore */ }

  // === COMPUTER SETUP - CALL THIS AFTER LEVEL IS LOADED ===
  if (this.level.data.id === 'level3') {
    console.log('🎯 Setting up computer for level3');
    this.setupComputerTerminal();
    // TEMP: Completely disable the Level 3 eye to test Level 1 artifacts
    try {
      if (this.scene?.userData) {
        this.scene.userData.allowSunEye = false; // do not allow sun/eye rig
        // Remove any existing sun/eye groups if present
        if (this.scene.userData.sunEye && this.scene.userData.sunEye.group) {
          const g = this.scene.userData.sunEye.group; if (g.parent) g.parent.remove(g);
        }
        this.scene.userData.sunEye = null;
        if (this.scene.userData.sun) { try { if (this.scene.userData.sun.parent) this.scene.remove(this.scene.userData.sun); } catch (_) {} this.scene.userData.sun = null; }
        if (this.scene.userData.topFillLight) { try { if (this.scene.userData.topFillLight.parent) this.scene.remove(this.scene.userData.topFillLight); } catch (_) {} this.scene.userData.topFillLight = null; }
        if (this.scene.userData.ambientFill) { try { if (this.scene.userData.ambientFill.parent) this.scene.remove(this.scene.userData.ambientFill); } catch (_) {} this.scene.userData.ambientFill = null; }
        if (this.scene.userData.sunTarget) { try { if (this.scene.userData.sunTarget.parent) this.scene.remove(this.scene.userData.sunTarget); } catch (_) {} this.scene.userData.sunTarget = null; }
      }
    } catch (_) {}
    // Light, complimentary sky for level 3
    try { setSkyPreset(this.scene, this.renderer, 'light'); } catch (e) { console.warn('Sky preset failed', e); }
    // Ensure only the eyeball sun contributes light
    try { enforceOnlySunLight(this.scene); } catch (e) { console.warn('Light enforcement failed', e); }
    // Hard-disable all object/light shadows to prevent any halo circle
    try { disableAllShadows(this.scene); } catch (e) { console.warn('Disable all shadows failed', e); }
    // Turn off eyeball sun directional, use softer bottom-up lighting
    try {
      const sunLight = this.scene.userData?.sunLight;
      if (sunLight) { sunLight.visible = false; sunLight.intensity = 0; sunLight.castShadow = false; }
      const topFill = this.scene.userData?.topFillLight;
      if (topFill) { 
        topFill.intensity = 1.0; // reduce to prevent washout
        topFill.position.set(0, -800, 0);
        // Update light target to point upward from ground
        if (topFill.target) {
          topFill.target.position.set(0, 0, 0);
        }
      }
      const ambient = this.scene.userData?.ambientFill;
      if (ambient) { ambient.intensity = 0.7; } // lower ambient for more contrast
      // Slightly lower overall exposure to avoid white crush
      if (this.renderer) { this.renderer.toneMappingExposure = 0.65; }
      // Add a touch more cloud coverage for midtones if sky present
      try {
        const cloudMat = this.scene.userData?.sky?.light?.cloudMaterial;
        if (cloudMat && cloudMat.uniforms?.uCoverage) {
          cloudMat.uniforms.uCoverage.value = 0.56;
        }
      } catch (_) { /* non-fatal */ }
      // Fix shader sun direction to bottom-up for illumination from ground
      if (this.scene?.userData) {
        this.scene.userData.sunOverrideDir = new THREE.Vector3(0, 1, 0);
      }
    } catch (e) { console.warn('Bottom-up light config failed', e); }

    // Ensure sky spheres (radius ~2000-2200) render for all cameras
    try {
      const FAR_FOR_SKY = 3000;
      const cams = [this.thirdCameraObject, this.firstCameraObject, this.freeCameraObject];
      cams.forEach((c) => {
        if (c && (typeof c.far === 'number') && c.far < FAR_FOR_SKY) {
          c.far = FAR_FOR_SKY;
          c.updateProjectionMatrix && c.updateProjectionMatrix();
        }
        // Do NOT enable layer 2 while the eye is disabled
        try { c.layers.disable(2); } catch (_) {}
      });
    } catch (e) { console.warn('Failed to extend camera far plane for sky', e); }
    // Apply player outline for toon style if GPU tier allows
    try {
      const quality = this.gpuDetector?.getQualitySettings?.() || {};
      const toon = quality.toon || {};
      const tier = this.gpuDetector?.tier || 'MEDIUM';
      const canOutline = toon.enabled && toon.outlinePlayer && tier !== 'LOW';
      if (canOutline && this.shaderSystem && this.player?.mesh && !this.player.mesh.userData.__toonOutlined) {
        // Attempt immediately; if model not ready, retry shortly
        const tryOutline = () => {
          let outlined = false;
          this.player.mesh.traverse((child) => {
            if (child.isMesh && child.geometry && !child.userData?.__toonOutline) {
              this.shaderSystem.addOutlineToMesh(child, { thickness: 1.03, color: 0x000000 });
              outlined = true;
            }
          });
          if (outlined) {
            this.player.mesh.userData.__toonOutlined = true;
          } else {
            // Retry once if not yet available
            setTimeout(tryOutline, 300);
          }
        };
        tryOutline();
      }
    } catch (e) {
      console.warn('Toon player outline failed:', e);
    }
  } else {
    // Remove computer if switching away from level3
    if (this.computerTerminal) {
      console.log('🗑️ Removing computer (switching from level3)');
      this.scene.remove(this.computerTerminal.mesh);
      this.computerTerminal = null;
    }
    // Block sun eye usage for non-level3
    if (this.scene?.userData) this.scene.userData.allowSunEye = false;
    // Disable layer 1 and 2 on all cameras so any player-only or L3-only artifacts never render
    try {
      [this.thirdCameraObject, this.firstCameraObject, this.freeCameraObject].forEach((c)=>{ 
        if (!c) return; 
        c.layers.disable(1); // player/self illumination layer
        c.layers.disable(2); // level-3 eye + fill lights layer
      });
    } catch (_) {}
    // HARD PURGE: remove or hide any lingering Level 3 visuals from the scene graph
    // Users reported a black circle in Level 1 caused by Level 3 assets leaking through.
    try {
      const L2_MASK = (1 << 2);
      const toRemove = [];
      this.scene.traverse((obj) => {
        if (!obj || obj === this.scene) return;
        // 1) Anything explicitly on layer 2 should not exist outside level 3
        try {
          if (obj.layers && (obj.layers.mask & L2_MASK)) {
            obj.layers.disable(2);
            // Hide aggressively to ensure no contribution
            obj.visible = false;
            // Collect leaf meshes/groups to remove if they are standalone L3 helpers
            if (!obj.userData || !obj.userData.preserveOutsideLevel3) {
              toRemove.push(obj);
            }
            return;
          }
        } catch (_) {}
        // 2) Name heuristics for Level 3 sun/eye pieces that might not be on layer 2
        const n = (obj.name || '').toLowerCase();
        if (n.includes('sun') || n.includes('eye') || n.includes('eyelid') || n.includes('iris') || n.includes('pupil')) {
          obj.visible = false;
          if (!obj.userData || !obj.userData.preserveOutsideLevel3) {
            toRemove.push(obj);
          }
        }
        // 3) Material heuristic: large, opaque, nearly-black basic/standard meshes are likely eyelids
        try {
          const mat = obj.material;
          const isBlackish = (m) => {
            if (!m || !m.color) return false;
            const c = m.color; return c.r < 0.05 && c.g < 0.05 && c.b < 0.05 && (m.opacity === undefined || m.opacity > 0.95);
          };
          const typeOk = (m) => m && (m.isMeshBasicMaterial || m.isMeshStandardMaterial || m.isMeshPhongMaterial);
          const nearlyBlack = Array.isArray(mat) ? mat.some((m)=> typeOk(m) && isBlackish(m)) : (typeOk(mat) && isBlackish(mat));
          if (nearlyBlack) {
            obj.visible = false;
            if (!obj.userData || !obj.userData.preserveOutsideLevel3) {
              toRemove.push(obj);
            }
          }
        } catch (_) {}
      });
      // Remove after traversal to avoid disrupting iteration
      toRemove.forEach((obj) => { try { if (obj.parent) obj.parent.remove(obj); } catch (_) {} });
    } catch (_) {}
    // Strip any lingering toon outlines from player (added in level3)
    try {
      if (this.player?.mesh) {
        const toRemove = [];
        this.player.mesh.traverse((child) => {
          if (!child) return;
          if (child.userData && child.userData.__toonOutline) {
            const om = child.userData.__toonOutline;
            if (om && om.parent) om.parent.remove(om);
            child.userData.__toonOutline = null;
          }
          if (child.name && typeof child.name === 'string' && child.name.endsWith('_toonOutline')) {
            toRemove.push(child);
          }
        });
        toRemove.forEach((m) => { if (m.parent) m.parent.remove(m); });
        if (this.player.mesh.userData && this.player.mesh.userData.__toonOutlined) {
          delete this.player.mesh.userData.__toonOutlined;
        }
      }
    } catch (_) {}
    // Restore sky when leaving level3. If the incoming level provides its own
    // panoramaSky, don't force 'dark' here so the starry sky shows immediately.
    if (!levelData?.panoramaSky) {
      try { setSkyPreset(this.scene, this.renderer, 'dark'); } catch {}
    }
  }

  // Load panorama sky if specified in level data
  if (levelData.panoramaSky) {
    try {
      let textureUrl;
      let options = {};
      
      if (typeof levelData.panoramaSky === 'string') {
        // Simple string format: "panoramaSky": "path/to/texture.hdr"
        textureUrl = levelData.panoramaSky;
      } else if (typeof levelData.panoramaSky === 'object' && levelData.panoramaSky.url) {
        // Object format: "panoramaSky": { "url": "path/to/texture.hdr", "radius": 1000, "rotation": 0 }
        textureUrl = levelData.panoramaSky.url;
        options = {
          radius: levelData.panoramaSky.radius,
          rotation: levelData.panoramaSky.rotation,
          useAsEnvironment: levelData.panoramaSky.useAsEnvironment
        };
      } else {
        console.warn('⚠️ Invalid panoramaSky format in level data, expected string or object with url property');
        return;
      }
      
      await loadPanoramaSky(this.scene, this.renderer, textureUrl, options);
      console.log('✅ Panorama sky loaded for level:', this.currentLevelId);
    } catch (error) {
      console.warn('⚠️ Failed to load panorama sky:', error);
      // Fallback to default sky preset on error
      try { setSkyPreset(this.scene, this.renderer, 'dark'); } catch {}
    }
  }

  // Position player at start position from level data
  const start = this.level.data.startPosition;
  this.player.setPosition(new THREE.Vector3(...start));
  // Ensure player and input state are sane after level switch (in case previous level hid/locked them)
  if (this.player?.mesh) this.player.mesh.visible = true;
  if (this.input?.setEnabled) this.input.setEnabled(true);
  if (this.input) this.input.alwaysTrackMouse = true;
  console.log(`🏃 Player spawned at position: [${start.join(', ')}] for level: ${this.level.data.name}`);

  // swap UI + lights first
  this.applyLevelUI(this.level.data);
  this.applyLevelLights(this.level.data);

  // IMPORTANT: If an onLevelStart cinematic exists, we want the cinematic to control VO timing.
  const hasLevelStartCinematic = !!(this.level?.data?.cinematics && (this.level.data.cinematics.onLevelStart || Array.isArray(this.level.data.cinematics)));

  // Load sounds. If cinematic exists, defer VO to it.
  await this.applyLevelSounds(this.level.data, { deferVoiceoverToCinematic: hasLevelStartCinematic });

  // Spawn collectibles AFTER sounds/UI are ready
  this.collectiblesManager.cleanup();
  await this.collectiblesManager.spawnCollectiblesForLevel(this.level.data);

  // Doors (Level 2 example)
  if (this.level?.data?.id === 'level2') {
    this.doorManager.spawn('model', {
      position: [25.9, 0, -4.5],
      preset: 'wooden',
      width: 6,
      height: 6.5,
      depth: 0.5,
      type: 'model',
      modelUrl: 'assets/doors/level2_boss_door.glb',
      swingDirection: 'forward left',
      interactionDistance: 10,
      autoOpenOnApproach: false,
      locked: true,
      requiredKey: 'all_apples'
    });
    this.doorManager.spawn('basic', {
      position: [56.5, 0, -9.4],
      preset: 'wooden',
      width: 4.7,
      height: 6.5,
      depth: 0.5,
      type: 'model',
      modelUrl: 'assets/doors/level2_boss_door.glb',
      swingDirection: 'forward left',
      initialRotation: 90,
      interactionDistance: 10,
      autoOpenOnApproach: false,
      locked: true,
      requiredKey: 'all_apples'
    });
    this.doorManager.toggleColliders(this.doorHelpersVisible);
  }

  // Finally: trigger the cinematic (sounds are loaded and ready).
  this.level.triggerLevelStartCinematic(this.activeCamera, this.player);

  return this.level;
}

  /**
   * Check if all apples have been collected and unlock doors in Level 2
   */
  checkAppleCollectionForDoors() {
    // Only check in Level 2
    if (!this.level || this.level.data.id !== 'level2') {
      return;
    }

    // Skip if doors are already unlocked
    if (this.doorsUnlockedByApples) {
      return;
    }

    // Get collectible statistics
    const stats = this.collectiblesManager.getStats();
    
    // Check if all apples have been collected
    const allApplesCollected = stats.apples.total > 0 && stats.apples.collected >= stats.apples.total;
    
    if (allApplesCollected && this.doorManager && this.doorManager.doors) {
      // Find and unlock doors that require 'all_apples'
      let doorsUnlocked = 0;
      for (const door of this.doorManager.doors) {
        if (door.locked && door.requiredKey === 'all_apples') {
          door.locked = false;
          door.autoOpenOnApproach = true; // Enable auto-open now that it's unlocked
          doorsUnlocked++;
        }
      }
      
      if (doorsUnlocked > 0) {
        this.doorsUnlockedByApples = true;
        console.log(`🔓 ${doorsUnlocked} door(s) unlocked! All ${stats.apples.total} apples collected in Level 2`);
        
        // Trigger Pravesh dialogue about mysterious door opening
        console.log('🎬 About to trigger apple collection dialogue...');
        this.triggerAppleCollectionDialogue();
      }
    }
  }

  /**
   * Trigger dialogue when all apples are collected
   */
  triggerAppleCollectionDialogue() {
    console.log('🎬 triggerAppleCollectionDialogue called!');
    
    // Simple approach: create dialogue UI directly
    this.showSimpleDialogue('Pravesh', 'Ooh, a mysterious door has opened!', 3000);
  }

  /**
   * Show a simple dialogue message
   */
  showSimpleDialogue(character, message, duration = 3000) {
    console.log(`🎬 Showing dialogue: ${character}: ${message}`);
    
    // Create dialogue element
    const dialogue = document.createElement('div');
    dialogue.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 600px;
      text-align: center;
      font-family: Arial, sans-serif;
      z-index: 1000;
      animation: fadeIn 0.5s ease-in;
    `;
    
    // Add character name
    const characterElement = document.createElement('div');
    characterElement.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #ffdd44;
    `;
    characterElement.textContent = character.toUpperCase();
    
    // Add message text
    const textElement = document.createElement('div');
    textElement.style.cssText = `
      font-size: 18px;
      line-height: 1.4;
    `;
    textElement.textContent = message;
    
    // Add fade animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
    
    dialogue.appendChild(characterElement);
    dialogue.appendChild(textElement);
    document.body.appendChild(dialogue);
    
    // Auto-hide after duration
    setTimeout(() => {
      dialogue.style.animation = 'fadeOut 0.5s ease-out';
      setTimeout(() => {
        document.body.removeChild(dialogue);
        document.head.removeChild(style);
      }, 500);
    }, duration);
    
    console.log('🎬 Dialogue displayed successfully!');
  }

  applyLevelLights(levelData) {
    if (!this.lights) return;
    // Clear existing lights
    this.lights.clear();
    const list = (levelData && levelData.lights) ? levelData.lights : null;
    if (!list) return;
    
    // Debug: Log current quality settings
    if (this.qualitySettings && this.qualitySettings.plantInstanceCounts) {
      console.log(`💡 Creating lights with quality settings:`, {
        fireflies: this.qualitySettings.plantInstanceCounts.fireflies,
        leaves: this.qualitySettings.plantInstanceCounts.leaves,
        petals: this.qualitySettings.plantInstanceCounts.petals,
        tier: this.gpuDetector?.tier || 'Unknown'
      });
    }
    
    // list is array of either string keys or objects { key, props }
    let lightCounter = {}; // Track count of each light type for unique keys
    for (const item of list) {
      let key, props;
      if (typeof item === 'string') { key = item; props = {}; }
      else { key = item.key; props = item.props || {}; }
      const Module = LightModules[key];
      if (!Module) {
        console.warn('Unknown light module key in level data:', key);
        continue;
      }
      // Generate unique key for each instance (e.g., "FlameParticles_0", "FlameParticles_1")
      if (!lightCounter[key]) lightCounter[key] = 0;
      const uniqueKey = `${key}_${lightCounter[key]++}`;
      this.lights.add(uniqueKey, Module, props);
    }
  }

  applyLevelUI(levelData) {
  // Clear existing UI and re-add defaults according to level metadata
  if (!this.ui) return;
  
  // Store global components that should persist across levels
  const globalComponents = new Map();
  if (this.ui.get('fps')) {
    globalComponents.set('fps', this.ui.get('fps'));
  }
  if (this.ui.get('crosshair')) {
    globalComponents.set('crosshair', this.ui.get('crosshair'));
  }
  if (this.ui.get('interactionPrompt')) {
    globalComponents.set('interactionPrompt', this.ui.get('interactionPrompt'));
  }
  if (this.ui.get('voiceoverCard')) {
    globalComponents.set('voiceoverCard', this.ui.get('voiceoverCard'));
  }
  if (this.ui.get('coordinates')) {
    globalComponents.set('coordinates', this.ui.get('coordinates'));
  }
  if (this.ui.get('triggerPrompt')) {
    globalComponents.set('triggerPrompt', this.ui.get('triggerPrompt'));
  }
  
  this.ui.clear();
  
  // Re-add global components first
  for (const [key, component] of globalComponents) {
    this.ui.components.set(key, component);
    // Re-mount the component since it was unmounted during clear
    if (component.mount) {
      component.mount();
    }
    // Hide trigger prompt when transitioning to a new level
    if (key === 'triggerPrompt' && component.hide) {
      component.hide();
    }
  }
  
  const uiList = (levelData && levelData.ui) ? levelData.ui : ['hud'];
  
  for (const uiItem of uiList) {
    // Handle both string format ("hud") and object format ({ type: "collectibles", config: {...} })
    let key, config;
    if (typeof uiItem === 'string') {
      key = uiItem;
      config = {};
    } else if (typeof uiItem === 'object' && uiItem.type) {
      key = uiItem.type;
      config = uiItem.config || {};
    } else {
      console.warn('Invalid UI item format in level data:', uiItem);
      continue;
    }
    
    if (key === 'hud') {
      this.ui.add('hud', HUD, { health: this.player.health ?? 100 });
    } else if (key === 'minimap') {
      const minimap = this.ui.add('minimap', Minimap, config);
      // Set level data for minimap rendering
      if (minimap && minimap.setLevelData) {
        minimap.setLevelData(levelData);
      }
    } else if (key === 'objectives') {
      this.ui.add('objectives', Objectives, { 
        items: levelData.objectives ?? ['Reach the goal'],
        ...config 
      });
    } else if (key === 'menu') {
      this.ui.add('menu', SmallMenu, { 
        onResume: () => this.setPaused(false),
        onToggleShaders: () => {
          if (this.shaderSystem) {
            const newState = this.shaderSystem.toggleShaders();
            return newState;
          }
          return true;
        },
        ...config 
      });
    } else if (key === 'collectibles') {
      // USE CollectiblesLevel3 ONLY FOR LEVEL 3
      if (levelData.id === 'level3') {
        console.log('🎯 Using CollectiblesLevel3 for Level 3');
        this.ui.add('collectibles', CollectiblesLevel3, config);
      } else {
        // Use regular Collectibles for other levels
        this.ui.add('collectibles', Collectibles, config);
      }
    } else if (key === 'fps') {
      // FPS is already added as a global component, skip
      continue;
    } else if (key === 'coordinates') {
      // Coordinates is already added as a global component, skip
      continue;
    } else {
      console.warn('Unknown UI component type in level data:', key);
    }
  }
  
  // Set up collectibles manager references after UI is loaded
  const collectiblesUI = this.ui.get('collectibles');
  const interactionPrompt = this.ui.get('interactionPrompt');
  if (collectiblesUI) {
    this.collectiblesManager.setReferences(this.player, collectiblesUI);
  }
  if (interactionPrompt) {
    this.collectiblesManager.setInteractionPrompt(interactionPrompt);
  }
}

  async applyLevelSounds(levelData, opts = {}) {
    const { deferVoiceoverToCinematic = false } = opts;

    console.log('🔊 applyLevelSounds for:', levelData?.name, 'deferVO:', deferVoiceoverToCinematic);

    if (!this.soundManager) {
      console.warn('⚠️ Sound manager not available!');
      return;
    }
    if (!levelData?.sounds) {
      console.warn('⚠️ No sounds config in level data!');
      // Proximity sounds still handled below if present
    }

    try {
      if (levelData?.sounds) {
        await this.soundManager.loadSounds(levelData.sounds);
        console.log('🔊 Sounds loaded OK');

        // Store what to play
        this._pendingMusic    = levelData.sounds.playMusic || null;
        this._pendingAmbient  = levelData.sounds.playAmbient || null;

        // If a cinematic will drive VO timing, do NOT set a pending VO here.
        this._pendingVoiceover = deferVoiceoverToCinematic ? null : (levelData.sounds.playVoiceover || null);

        const ctx = this.soundManager.listener.context;
        const ctxRunning = ctx && ctx.state === 'running';

        // Start music/ambient immediately if we can. (No delay!)
        if (ctxRunning) {
          if (this._pendingMusic) {
            this.soundManager.playMusic(this._pendingMusic);
            this._pendingMusic = null;
          }
          if (this._pendingAmbient) {
            this.soundManager.playAmbient(this._pendingAmbient);
            this._pendingAmbient = null;
          }
          // Only auto-play VO if not deferred to cinematic
          if (this._pendingVoiceover) {
            // No 500ms delay—start now so it doesn’t drift
            const vo = this._pendingVoiceover;
            this._pendingVoiceover = null;
            this.playVoiceover(vo, 2000);
          }
        } else {
          console.log('🔊 AudioContext suspended. Will start audio on first user click.');
        }
      }

      // Proximity sounds
      if (levelData?.proximitySounds) {
        if (!this.proximitySoundManager) {
          this.proximitySoundManager = new ProximitySoundManager(this.soundManager, this.player);
        }
        this.proximitySoundManager.loadProximitySounds(levelData.proximitySounds);
      } else if (this.proximitySoundManager) {
        // Clean up if the new level doesn't define proximity audio
        this.proximitySoundManager.dispose();
      }
    } catch (err) {
      console.error(`❌ Failed to load/apply sounds for ${levelData?.name}:`, err);
    }
  }


  checkFinalSnake() {
    if (!this.level || !this.level.getEnemies) return;

    const enemies = this.level.getEnemies();
    const aliveSnakes = enemies.filter(e => e.isAlive && e.health > 0);

    // Play rumbling when only 1 snake remains
    if (aliveSnakes.length === 1 && !this._rumblingSoundPlayed) {
      console.log('🐍 Final snake remaining! Playing rumbling sound');
      if (this.soundManager && this.soundManager.sfx['rumbling']) {
        this.soundManager.playSFX('rumbling', 0.7);
      }
      this._rumblingSoundPlayed = true; // Play only once
    }

    // Reset flag when level reloads
    if (aliveSnakes.length > 1) {
      this._rumblingSoundPlayed = false;
    }
  }

  _setupAudioControls() {
    if (!this.soundManager) return;

    // Get all audio control elements
    const masterSlider = document.getElementById('masterVolume');
    const musicSlider = document.getElementById('musicVolume');
    const sfxSlider = document.getElementById('sfxVolume');
    const ambientSlider = document.getElementById('ambientVolume');
    const muteBtn = document.getElementById('muteBtn');

    const masterValue = document.getElementById('masterValue');
    const musicValue = document.getElementById('musicValue');
    const sfxValue = document.getElementById('sfxValue');
    const ambientValue = document.getElementById('ambientValue');

    // Update volume display helper
    const updateDisplay = (slider, valueElement, value) => {
      if (slider) slider.value = value;
      if (valueElement) valueElement.textContent = `${value}%`;
    };

    // Master volume control
    if (masterSlider) {
      masterSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        this.soundManager.setVolume('master', value / 100);
        updateDisplay(null, masterValue, value);
      });
    }

    // Music volume control
    if (musicSlider) {
      console.log('🔊 Music slider found, adding listener');
      musicSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        console.log('🔊 Music slider changed to:', value);
        this.soundManager.setVolume('music', value / 100);
        console.log('🔊 Current music volume after change:', this.soundManager.volumes.music);
        updateDisplay(null, musicValue, value);
      });
    } else {
      console.warn('⚠️ Music slider not found!');
    }

    // SFX volume control
    if (sfxSlider) {
      sfxSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        this.soundManager.setVolume('sfx', value / 100);
        updateDisplay(null, sfxValue, value);
      });
    }

    // Ambient volume control
    if (ambientSlider) {
      ambientSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        this.soundManager.setVolume('ambient', value / 100);
        updateDisplay(null, ambientValue, value);
      });
    }

    // Mute button
    if (muteBtn) {
      console.log('🔊 Mute button found, adding click listener');
      muteBtn.addEventListener('click', (e) => {
        console.log('🔊 Mute button clicked!');
        e.stopPropagation();
        this.soundManager.toggleMute();
        const isMuted = this.soundManager.muted;
        console.log('🔊 Muted state:', isMuted);
        muteBtn.textContent = isMuted ? '🔊 Unmute All' : '🔇 Mute All';
        muteBtn.classList.toggle('muted', isMuted);
      });
    } else {
      console.warn('⚠️ Mute button not found in DOM!');
    }
  }

  setPaused(v) {
    const want = !!v;
    if (this.paused === want) return;
    this.paused = want;
    // show/hide UI
    if (this.pauseMenu) {
      this.pauseMenu.style.display = want ? 'flex' : 'none';
      this.pauseMenu.setAttribute('aria-hidden', (!want).toString());
    }
    // disable input handling when paused
    if (this.input && this.input.setEnabled) {
      this.input.setEnabled(!want);
    }
    // if pausing, exit pointer lock so user can interact with UI
    if (want && document.pointerLockElement) {
      try { document.exitPointerLock(); } catch (e) { /* ignore */ }
    }
  }

  /* ===========================
     Victory Moment + overlays
     =========================== */

  _onLevelComplete() {
  console.log('🏁 Level complete event received');

  // 🚫 Skip victory sequence for level2_glitched
  const currentLevelId = this.currentLevelId || this.level?.data?.id;
  if (currentLevelId === 'level2_glitched') {
    console.log('🚫 Victory sequence skipped for level2_glitched');
    
    // Just re-enable input and return without showing victory screen
    this.input?.setEnabled?.(true);
    
    
    
    
    return;
  }

  // Temporarily disable input while we show cinematics/overlays
  this.input?.setEnabled?.(false);

  // Kick the level-complete cinematic if your level defines it
  if (this.level?.triggerLevelCompleteCinematic) {
    this.level.triggerLevelCompleteCinematic(this.activeCamera, this.player);
  }

  // Play success VO (pravesh_success_vo.mp3 should be registered as "vo-success")
  if (this.soundManager?.sfx?.['vo-success']) {
    this.playVoiceover('vo-success', 7000);
    // Optional captions to go with the VO (simple sequenced bubbles)
    this._runCaptionSequence([
      { at: 0,    text: "You made it—the apples are yours and the labyrinth is behind you." },
      { at: 1700, text: "Not bad, knight." },
      { at: 2600, text: "I'd say you've earned a break… but the next challenge won't be so forgiving." },
      { at: 4800, text: "Take a breath, sharpen your wits," },
      { at: 6200, text: "and get ready—Level Four awaits." }
    ]);
  }

  // Show the victory overlay a beat after the camera move starts
  setTimeout(() => {
    this._showVictoryOverlay();  // already shows Replay + Go To Level
    this._showLevelPicker();     // or pop the picker directly
    this.input?.setEnabled?.(true);
  }, 3000); // after orbit; tweak to your taste
}

  _runCaptionSequence(segments = []) {
    // Uses the same simple bubble you already use in showSimpleDialogue
    segments.forEach(seg => {
      setTimeout(() => {
        this.showSimpleDialogue('Pravesh', seg.text, 1600);
      }, seg.at || 0);
    });
  }

  _ensureVictoryOverlay() {
    if (this._victoryOverlay) return;

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, rgba(0,0,0,.65), rgba(0,0,0,.85))',
      zIndex: 9999
    });

    const card = document.createElement('div');
    Object.assign(card.style, {
      width: 'min(92vw, 720px)',
      borderRadius: '18px',
      border: '3px solid #51cf66',
      background: '#0b1324',
      color: 'white',
      padding: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,.6)',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center'
    });

    const title = document.createElement('div');
    title.textContent = 'Victory! 🏆';
    Object.assign(title.style, { fontSize: '28px', fontWeight: 800, marginBottom: '6px' });

    const subtitle = document.createElement('div');
    subtitle.textContent = 'Choose your next step:';
    Object.assign(subtitle.style, { opacity: .85, marginBottom: '16px' });

    const actions = document.createElement('div');
    Object.assign(actions.style, {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center'
    });

    const btn = (label) => {
      const b = document.createElement('button');
      b.textContent = label;
      Object.assign(b.style, {
        cursor: 'pointer',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '2px solid #51cf66',
        background: '#112143',
        color: 'white',
        fontWeight: 700
      });
      b.onmouseenter = () => b.style.transform = 'translateY(-2px)';
      b.onmouseleave = () => b.style.transform = 'translateY(0)';
      return b;
    };

    const replay = btn('Replay Level');
    replay.onclick = () => {
      overlay.style.display = 'none';
      // Reload current level index
      const idx = this.levelManager?.currentIndex ?? 0;
      this.loadLevel(idx);
      // Re-enable input
      this.input?.setEnabled?.(true);
    };

    const toLevelButtonsWrap = document.createElement('div');
    Object.assign(toLevelButtonsWrap.style, { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' });

    const levelsArray = this._getAvailableLevels();
    for (const lvl of levelsArray) {
      const b = btn(`Go to: ${lvl.name || lvl.id}`);
      b.onclick = () => {
        overlay.style.display = 'none';
        const idx = this._findLevelIndexById(lvl.id);
        if (idx >= 0) this.loadLevel(idx);
        this.input?.setEnabled?.(true);
      };
      toLevelButtonsWrap.appendChild(b);
    }

    const hint = document.createElement('div');
    hint.textContent = 'Press N to open the Level Picker any time';
    Object.assign(hint.style, { marginTop: '10px', opacity: .65, fontSize: '12px' });

    actions.appendChild(replay);
    actions.appendChild(toLevelButtonsWrap);
    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(actions);
    card.appendChild(hint);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    this._victoryOverlay = overlay;
  }

  _showVictoryOverlay() {
    this._ensureVictoryOverlay();
    if (this._victoryOverlay) {
      this._victoryOverlay.style.display = 'flex';
    }
  }

  /* ===========================
     Level Picker overlay
     =========================== */

  _ensureLevelPicker() {
    if (this._levelPicker) return;

    const picker = document.createElement('div');
    Object.assign(picker.style, {
      position: 'fixed',
      inset: 0,
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.75))',
      zIndex: 9998
    });

    const card = document.createElement('div');
    Object.assign(card.style, {
      width: 'min(92vw, 640px)',
      borderRadius: '18px',
      border: '3px solid #4dabf7',
      background: '#0b1222',
      color: 'white',
      padding: '22px',
      boxShadow: '0 20px 60px rgba(0,0,0,.55)',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center'
    });

    const title = document.createElement('div');
    title.textContent = 'Choose a Level';
    Object.assign(title.style, { fontSize: '26px', fontWeight: 800, marginBottom: '8px' });

    const grid = document.createElement('div');
    Object.assign(grid.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '10px',
      marginTop: '12px'
    });

    const levelsArray = this._getAvailableLevels();
    levelsArray.forEach((lvl) => {
      const b = document.createElement('button');
      b.textContent = `${lvl.name || lvl.id}`;
      Object.assign(b.style, {
        cursor: 'pointer',
        padding: '18px 12px',
        borderRadius: '14px',
        border: '2px solid #4dabf7',
        background: '#142647',
        color: 'white',
        fontWeight: 700
      });
      b.onclick = () => {
        picker.style.display = 'none';
        const idx = this._findLevelIndexById(lvl.id);
        if (idx >= 0) this.loadLevel(idx);
      };
      grid.appendChild(b);
    });

    const hint = document.createElement('div');
    hint.textContent = 'Press ESC to close • Press N to open this any time';
    Object.assign(hint.style, { marginTop: '10px', opacity: .65, fontSize: '12px' });

    card.appendChild(title);
    card.appendChild(grid);
    card.appendChild(hint);
    picker.appendChild(card);
    document.body.appendChild(picker);

    // Close on ESC
    const onEsc = (e) => { if (e.code === 'Escape') picker.style.display = 'none'; };
    window.addEventListener('keydown', onEsc);

    this._levelPicker = picker;
  }

  _showLevelPicker() {
    this._ensureLevelPicker();
    if (this._levelPicker) {
      this._levelPicker.style.display = 'flex';
    }
  }

  _getAvailableLevels() {
    // Prefer explicit level data export if present
    const listFromExport = Array.isArray(LEVELS) ? LEVELS : (LEVELS?.levels ?? null);
    const listFromManager = this.levelManager?.levels ?? null;

    const list = listFromExport || listFromManager || [];
    // If you only want a couple of levels visible, filter here:
    // return list.filter(l => ['intro','level2'].includes(l.id));
    return list;
  }

  _findLevelIndexById(id) {
    const listFromExport = Array.isArray(LEVELS) ? LEVELS : (LEVELS?.levels ?? null);
    const listFromManager = this.levelManager?.levels ?? null;
    const list = listFromExport || listFromManager || [];
    const idx = list.findIndex(l => l.id === id);
    return idx >= 0 ? idx : 0;
  }
setupComputerTerminal() {
  console.log('🛠️ === SETUP COMPUTER TERMINAL START ===');
  
  try {
    // Check if we have level data
    if (!this.level || !this.level.data) {
      console.error('❌ No level data available in setupComputerTerminal');
      console.log('this.level:', this.level);
      return;
    }
    
    const levelData = this.level.data;
    console.log('📋 Setting up computer for level:', levelData.id);
    
    // Check if computerLocation exists
    if (!levelData.computerLocation) {
      console.error('❌ No computerLocation in level data!');
      console.log('Available keys in level data:', Object.keys(levelData));
      return;
    }
    
    console.log('📍 Computer location from level data:', levelData.computerLocation);
    
    // Remove existing computer if any
    if (this.computerTerminal) {
      console.log('🗑️ Removing existing computer terminal');
      this.scene.remove(this.computerTerminal.mesh);
      this.computerTerminal = null;
    }
    
    // Verify the position is valid
    const position = levelData.computerLocation.position;
    if (!Array.isArray(position) || position.length !== 3) {
      console.error('❌ Invalid computer position:', position);
      return;
    }
    
    console.log('🎯 Computer will be created at:', position);
    
    // Set required LLMs from level data
    if (levelData.computerLocation.requiredLLMs && levelData.computerLocation.requiredLLMs.length > 0) {
      this.glitchManager.requiredLLMs = [...levelData.computerLocation.requiredLLMs];
      console.log('🎯 Using required LLMs from level data:', this.glitchManager.requiredLLMs);
    } else {
      console.warn('⚠️ No requiredLLMs specified in level data, using defaults');
    }
    
    // Create new computer terminal
    console.log('🔧 Creating new computer terminal...');
    this.computerTerminal = new ComputerTerminal(
      levelData.computerLocation, 
      this.glitchManager,
      this
    );
    
    console.log('💾 Computer terminal created:', this.computerTerminal);
    
    // Add to scene
    this.scene.add(this.computerTerminal.mesh);
    console.log('✅ Computer added to scene');
    
    // Force immediate render
    this.renderer.render(this.scene, this.activeCamera);
    
    // Debug: verify computer is in scene
    setTimeout(() => {
      this.debugComputerTerminal();
    }, 100);
    
  } catch (error) {
    console.error('❌ Error setting up computer terminal:', error);
  }
  
  console.log('🛠️ === SETUP COMPUTER TERMINAL END ===');
}


/**
 * Setup LLM collection tracking
 */
/**
 * Setup LLM collection tracking
 */
setupLLMTracking() {
  console.log('🔧 Setting up LLM tracking...');
  
  // Check if collectiblesManager exists
  if (!this.collectiblesManager) {
    console.error('❌ CollectiblesManager not found!');
    return;
  }
  
  // Listen for LLM collection events from CollectiblesManager
  this.collectiblesManager.addEventListener('onLLMCollected', (data) => {
    console.log('🎯 Game: Received LLM collection event for', data.type);
    
    // Update GlitchManager
    if (this.glitchManager && data.type) {
      this.glitchManager.collectLLM(data.type);
    } else {
      console.error('❌ Missing glitchManager or LLM type:', { 
        hasGlitchManager: !!this.glitchManager, 
        dataType: data.type 
      });
    }
    
    // Also update UI if needed (CollectiblesManager should handle this, but double-check)
    if (this.ui && this.ui.get('collectibles')) {
      const collectiblesUI = this.ui.get('collectibles');
      if (collectiblesUI && collectiblesUI.collectLLM) {
        collectiblesUI.collectLLM(data.type);
      }
    }
  });
  
  console.log('✅ LLM tracking setup complete');
}

/**
 * Check if enough collectibles are collected in glitched levels
 */
checkGlitchedLevelCompletion() {
  if (!this.currentLevelId || !this.currentLevelId.includes('_glitched')) {
    console.log('🔍 Not in glitched level, skipping completion check');
    return;
  }
  
  console.log('🔍 Checking glitched level completion for:', this.currentLevelId);
  
  const requiredCount = this.glitchManager.requiredGlitchedCollectibles[this.currentLevelId] || 2;
  const collectedCount = this.collectiblesManager.getCollectedChestCount();
  
  console.log(`📊 Glitched level progress: ${collectedCount}/${requiredCount} chests`);
  
  if (collectedCount >= requiredCount) {
    console.log(`✅ Required ${requiredCount} chests collected in ${this.currentLevelId}!`);
    
    // Mark this glitched level as completed
    this.glitchManager.completeGlitchedLevel(this.currentLevelId);
    
    // Determine next level
    let nextLevel, message;
    if (this.currentLevelId === 'level1_glitched') {
      nextLevel = 'level2_glitched';
      message = 'Level 1 Glitched completed! Moving to Level 2 Glitched.';
    } else if (this.currentLevelId === 'level2_glitched') {
      nextLevel = 'level3';
      message = 'All glitched levels completed! Returning to Level 3.';
    } else {
      nextLevel = 'level3';
      message = 'Glitched level completed! Returning to Level 3.';
    }
    
    // Show completion message
    this.showMessage(message, 3000);
    
    // Wait, then go to next level
    setTimeout(() => {
      console.log('🚀 Auto-progressing to:', nextLevel);
      this.loadLevelByName(nextLevel);
    }, 3000);
  }
}

async loadLevelByName(levelId) {
  const levels = this.levelManager.levels || [];
  const index = levels.findIndex(level => level.id === levelId);
  if (index >= 0) {
    return this.loadLevel(index);
  } else {
    console.error(`Level not found: ${levelId}`);
    return null;
  }
}

showMessage(message, duration = 3000) {
  console.log('💬 Message:', message);
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    font-family: Arial, sans-serif;
    font-size: 18px;
    text-align: center;
    z-index: 1000;
    border: 2px solid #00ff00;
    max-width: 80%;
  `;
  messageElement.textContent = message;
  
  document.body.appendChild(messageElement);
  
  // Remove after duration
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }, duration);
}

setupGlitchedLevelProgression() {
  console.log('🔧 Setting up glitched level progression...');
  
  // Listen for collectible pickup events
  this.collectiblesManager.addEventListener('onCollectiblePickup', (collectible) => {
    if (collectible.type === 'chest') {
      console.log('📦 Chest collected, checking glitched level completion...');
      this.checkGlitchedLevelCompletion();
    }
  });
  
  console.log('✅ Glitched level progression setup complete');
}

}
