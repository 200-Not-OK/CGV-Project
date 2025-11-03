import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { StackWeapon } from './weapons/StackWeapon.js';

export class Player {
  constructor(scene, physicsWorld, options = {}, game = null) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.game = game;
    const opts = options || {};

    this.groundTolerance      = opts.groundTolerance ?? 0.12; // meters
    this.maxGroundAngleRad    = THREE.MathUtils.degToRad(opts.maxGroundAngle ?? 55);
    this.coyoteTime           = opts.coyoteTime ?? 0.12;      // seconds
    this.minAirFramesToFall   = opts.minAirFramesToFall ?? 3; // frames

    // --- Ground smoothing state ---
    this._airFrames   = 0;
    this._coyoteTimer = 0;
    this._raycaster   = new THREE.Raycaster();
    this.isGrounded   = false; 
    
     this._animLockUntil = 0;
    // Player settings
    this.speed = options.speed ?? 8;
  this.jumpStrength = options.jumpStrength ?? 16; // Increased further for higher platformer-style jumps
    this.shortJumpMultiplier =
   (options.shortJumpMultiplier ?? (
     (typeof options.shortJumpStrength === 'number')
       ? (options.shortJumpStrength <= 1 ? options.shortJumpStrength : 0.6)
       : 0.6
   ));
    this.sprintMultiplier = options.sprintMultiplier ?? 1.6;
    this.health = options.health ?? 100;
  // Animation smoothing and hysteresis to avoid rapid start/stop flicker
  this.smoothedHorizontalSpeed = 0;
  this.moveStartSpeed = options.moveStartSpeed ?? 0.35; // enter walk/sprint
  this.moveStopSpeed = options.moveStopSpeed ?? 0.18;  // return to idle
  this.minAnimStateMs = options.minAnimStateMs ?? 400; // min duration per state
  this._lastAnimChangeAt = 0;
  this.minAirborneForJumpMs = options.minAirborneForJumpMs ?? 80; // delay before jump state
  this._airborneTimerSec = 0;

    
    // Stair climbing settings
    this.maxStepHeight = options.maxStepHeight ?? 2.5; // Maximum height to auto-climb (units) - reduced to avoid climbing minor slopes
    this.stepCheckDistance = options.stepCheckDistance ?? 1.8; // How far ahead to check for steps (world units)
    this.stepClimbSpeed = 25; // Speed of step climbing (increased for faster response)
    this.debugStepClimb = true; // Enable debug logging for stair detection
    this.lastStepClimbTime = 0; // Track when we last climbed a step
    this.stepClimbCooldown = 0.1; // Cooldown between step climbs (seconds) - increased to prevent excessive climbing
    this.isClimbingStep = false; // Flag to indicate we're currently in a step climb
    
    // Collider sizing options
    this.colliderScale = {
      width: options.colliderWidthScale ?? 0.4,    // Scale factor for width (X/Z)
      height: options.colliderHeightScale ?? 1,  // Scale factor for height (Y)
      depth: options.colliderDepthScale ?? 0.4     // Scale factor for depth (Z)
    };
    
    // Collider offset options (local space relative to player mesh)
    this.colliderOffset = {
      x: options.colliderOffsetX ?? 0,     // Sideways offset
      y: options.colliderOffsetY ?? 0,     // Vertical offset  
      z: options.colliderOffsetZ ?? -0.8   // Forward/backward offset (negative = backward)
    };
    
    // Visual mesh (Three.js)
    this.mesh = new THREE.Group();
    this.scene.add(this.mesh);
    
    // Physics body (Cannon.js) - will be created after model loads
    this.body = null;
    this.originalModelSize = null; // Store original model dimensions for collider updates
    
    // Animation system
    this.mixer = null;
    this.actions = { 
      idle: null, 
      walk: null, 
      sprint: null, 
      jump: null, 
      attack: null,
      interact: null,
      death: null 
    };
    this.currentAction = null;
    this.lastAnimationState = null; // Track animation state to avoid constant restarts
    
    // Mesh syncing smoothing (reduces jitter when moving)
  this.meshSyncStrength = 0.12;      // Slightly slower blend for smoother visuals
    this.rotationSyncStrength = 0.1;   // Rotation slerp blending (0-1, lower = smoother)
    
    // Combat system
    // ↓ Add this in the constructor after health setup
    this.alive = true; // single-shot death guard

    this.maxHealth = 100;
    this.health = Math.min(this.maxHealth, this.health ?? this.maxHealth);
    this.isAttacking = false;
    this.attackDuration = 600; // Attack animation duration in ms
    this.lastAttackTime = 0;
    
    // Interaction system
    this.isInteracting = false;
    this.lastInteractionTime = 0;
    
    // Movement lock system for animations
    this.movementLocked = false;
    this.movementLockReason = '';
    
    // Movement state
    this.isGrounded = false;
    this.isOnSlope = false; // Track if player is on a sloped surface
  // Lock-on assist settings
  this.lockOnEnabled = true;
  this.lockOnRange = options.lockOnRange ?? 5.5; // Distance to auto-face nearest enemy
  this.lockOnSmoothing = options.lockOnSmoothing ?? 0.28; // How quickly to rotate toward target
  this._lockOnTarget = null; // Cached enemy target
  this._lockOnHysteresis = 0.75; // Extra range to keep lock before dropping
  this._lockOnCooldownMs = 150; // Min time between target switches to avoid flicker
  this._lastLockSwitchAt = 0;
    this.isSprinting = false;
    this.isJumping = false;
    this.isMoving = false;

    // Double jump system
    this.enableDoubleJump = true;           // Feature flag
    this.jumpCount = 0;                     // Track number of jumps performed
    this.maxJumps = 2;                      // Maximum jumps allowed (1 = normal, 2 = double jump)
    this.doubleJumpStrength = 14;           // Slightly weaker than first jump
    this.canDoubleJump = true;              // Reset when landing
    this._liftOffFrames = 0;

    // Jump responsiveness improvements
    this.jumpBufferTime = options.jumpBufferTime ?? 0.2;   // Time window to buffer jump requests (seconds) - increased for better reliability
    this.coyoteTime = options.coyoteTime ?? 0.15;          // Time window after leaving ground where jump still works (seconds) - increased for edge jumps
    this.jumpBufferTimer = 0;               // Track remaining buffer time
    this.coyoteTimeTimer = 0;               // Track remaining coyote time
    this.wasGroundedLastFrame = false;      // Track previous grounded state

    // Sound state for footsteps
    this.footstepTimer = 0;
    this.footstepInterval = 0.4; // Time between footsteps (seconds)
    
    // Ground detection
    this.groundCheckDistance = 0.1;
    this.groundNormalThreshold = 0.2;
    
    // Wall sliding system
    this.enableWallSliding = true;
    this.wallSlideSmoothing = 0.85; // How smoothly to slide along walls (0-1)
    this.wallSlideSpeed = 3.0; // Speed when sliding down walls
    this.collisionContacts = []; // Store current collision contacts
    this.wallNormals = []; // Store wall normal vectors for sliding
    
    // Anti-stuck system - detects when player is wedged in geometry
    this.stuckDetectionTime = 0;
    this.stuckThreshold = 0.005; // Time (seconds) before considering player stuck
    this.lastPosition = new THREE.Vector3();
    this.stuckEscapeForce = 150; // Force to apply when escaping stuck state
    
    // Character-only lighting (illuminates only the player model)
    this.characterLight = new THREE.PointLight(0xFFFFFF, 50, 15); // Very bright white light, large range
    this.characterLight.position.set(0, 3, 0); // Position above player for better coverage
    this.characterLight.castShadow = false; // No shadows, just illumination
    // Restrict this light to affect only the player by using a separate layer
    // We'll enable this layer on the player meshes, but keep them visible on default layer for the camera
    this.characterLight.layers.set(1);
    this.mesh.add(this.characterLight); // Attach to player so it follows
    console.log('💡 Character self-illumination light added');
    
    // Initialize weapon system
    this.weapon = new StackWeapon(this, scene, physicsWorld);
    // Do not mount by default - Level 1 tutorial grants it via game state
    this.weapon.unmount();
    
    // Block pickup system
    this.heldBlock = null; // Reference to block currently being held
    this.pickupRange = 20.0; // Maximum detection distance (dynamic angle-based pickup)
    this.lastPickupTime = 0; // Cooldown to prevent rapid pickup/drop
    this.pickupCooldown = 0.3; // 300ms cooldown between pickup attempts
    
    // Load 3D model first, then create physics body
    this.loadModel();
  }

  async loadModel() {
    const loader = new GLTFLoader();
    
    // Try different path formats for the model
    const modelPaths = [
      'assets/Knight/Knight.gltf'
    ];
    
    let currentPathIndex = 0;
    
    const tryLoadModel = () => {
      const currentPath = modelPaths[currentPathIndex];
      
      loader.load(
        currentPath,
        (gltf) => {
          
          // Clear any existing mesh children
          while (this.mesh.children.length > 0) {
            this.mesh.remove(this.mesh.children[0]);
          }
        
          // Compute bounding box for the whole scene
          const bbox = new THREE.Box3().setFromObject(gltf.scene);
          const sizeVec = new THREE.Vector3();
          bbox.getSize(sizeVec);
          
          // Store model size for later physics body creation (defer until level load)
          this.originalModelSize = {
            x: sizeVec.x,
            y: sizeVec.y,
            z: sizeVec.z
          };
          console.log('🎨 Player model loaded, physics body will be created on level load');
          
          // Center model horizontally and vertically
          const centerX = (bbox.max.x + bbox.min.x) / 2;
          const centerZ = (bbox.max.z + bbox.min.z) / 2;
          const centerY = (bbox.max.y + bbox.min.y) / 2;
          gltf.scene.position.x -= centerX;
          gltf.scene.position.z -= centerZ;
          gltf.scene.position.y -= centerY;
          
          // Add the loaded model to our mesh group
          this.mesh.add(gltf.scene);
          
          // Enable shadow casting and receiving for the character
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;    // Character casts shadows
              child.receiveShadow = true;  // Character receives shadows from environment
              child.frustumCulled = false; // Prevent disappearing due to frustum culling
              // Enable layer 1 on all player meshes so the character-only light affects them
              child.layers.enable(1);
              
              // Ensure material is stable and doesn't flicker
              if (child.material) {
                child.material.depthWrite = true;
                child.material.depthTest = true;
                child.material.needsUpdate = true;
                
                // Remove emissive - use point light only
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    mat.depthWrite = true;
                    mat.depthTest = true;
                    mat.transparent = false;
                    mat.needsUpdate = true;
                  });
                } else {
                  child.material.transparent = false;
                }
              }
              
              // Set render order to ensure it's drawn consistently
              child.renderOrder = 1;
            }
          });
          console.log('✅ Character shadow casting enabled, frustum culling disabled, and materials stabilized');
          
          // Setup animations if available
          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(gltf.scene);

            console.log(`Available animations : ${gltf.animations.map(a => a.name).join(', ')}`);
            
            // Find animation clips with exact names from your model
            const findClip = (names) => {
              if (!names) return null;
              for (const n of names) {
                for (const c of gltf.animations) {
                  if (c.name && c.name === n) return c; // Exact match
                }
              }
              return null;
            };
            
            // Find clips with fallback to similar names
            const findClipWithFallback = (exactNames, fallbackNames) => {
              let clip = findClip(exactNames);
              if (!clip && fallbackNames) {
                for (const n of fallbackNames) {
                  const lower = n.toLowerCase();
                  for (const c of gltf.animations) {
                    if (c.name && c.name.toLowerCase().includes(lower)) {
                      clip = c;
                      break;
                    }
                  }
                  if (clip) break;
                }
              }
              return clip;
            };
            
            // Map animations to actions using exact names from your model
            const idleClip = findClip(['Idle']);
            const walkClip = findClip(['Walking_A', 'Walking_B', 'Walking_C']) || findClipWithFallback(null, ['walking']);
            const sprintClip = findClip(['Running_A', 'Running_B']) || findClipWithFallback(null, ['running', 'sprint']);
            const jumpClip = findClip(['Jump_Full_Long', 'Jump_Full_Short', 'Jump_Start']) || findClipWithFallback(null, ['jump']);
            const attackClip = findClip(['1H_Melee_Attack_Slice_Horizontal', '1H_Melee_Attack_Chop', '1H_Melee_Attack_Stab', 'Unarmed_Melee_Attack_Punch_A']);
            const interactClip = findClip(['Interact', 'Use_Item', 'PickUp']);
            const deathClip = findClip(['Death_A', 'Death_B']);
            
            // Set up idle animation
            if (idleClip) {
              this.actions.idle = this.mixer.clipAction(idleClip);
              this.actions.idle.setLoop(THREE.LoopRepeat);
              console.log('✅ Idle animation loaded:', idleClip.name);
            }
            
            // Set up walk animation
            if (walkClip) {
              this.actions.walk = this.mixer.clipAction(walkClip);
              this.actions.walk.setLoop(THREE.LoopRepeat);
              console.log('✅ Walk animation loaded:', walkClip.name);
            }
            
            // Set up sprint animation
            if (sprintClip) {
              this.actions.sprint = this.mixer.clipAction(sprintClip);
              this.actions.sprint.setLoop(THREE.LoopRepeat);
              console.log('✅ Sprint animation loaded:', sprintClip.name);
            }
            
            // Set up jump animation
            if (jumpClip) {
              this.actions.jump = this.mixer.clipAction(jumpClip);
              this.actions.jump.setLoop(THREE.LoopOnce);
              console.log('✅ Jump animation loaded:', jumpClip.name);
            }
            
            // Set up attack animation
            if (attackClip) {
              this.actions.attack = this.mixer.clipAction(attackClip);
              this.actions.attack.setLoop(THREE.LoopOnce);
              this.actions.attack.clampWhenFinished = true;
              console.log('✅ Attack animation loaded:', attackClip.name);
            }
            
            // Set up interact animation
            if (interactClip) {
              this.actions.interact = this.mixer.clipAction(interactClip);
              this.actions.interact.setLoop(THREE.LoopOnce);
              this.actions.interact.clampWhenFinished = true;
              console.log('✅ Interact animation loaded:', interactClip.name);
            }
            
            // Set up death animation
            if (deathClip) {
              this.actions.death = this.mixer.clipAction(deathClip);
              this.actions.death.setLoop(THREE.LoopOnce);
              this.actions.death.clampWhenFinished = true;
              console.log('✅ Death animation loaded:', deathClip.name);
            }
            
            // Start with idle animation
            if (this.actions.idle) {
              this.actions.idle.play();
              this.currentAction = this.actions.idle;
            }
          } else {
          }
        },
        (progress) => {
          console.log('⏳ Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          console.error(`❌ Failed to load model from ${currentPath}:`, error);
          
          // Try next path
          currentPathIndex++;
          if (currentPathIndex < modelPaths.length) {
            console.log('🔄 Trying next path...');
            tryLoadModel();
          } else {
            console.error('❌ All model paths failed, creating fallback geometry...');
            // Create a fallback cube if all paths fail
            const geometry = new THREE.BoxGeometry(1, 2, 1);
            const material = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
            const fallbackMesh = new THREE.Mesh(geometry, material);
            
            // Clear any existing meshes and add fallback
            while (this.mesh.children.length > 0) {
              this.mesh.remove(this.mesh.children[0]);
            }
            this.mesh.add(fallbackMesh);
            
            // Store fallback size - physics body will be created on level load
            this.originalModelSize = { x: 1, y: 2, z: 1 };
          }
        }
      );
    };
    
    // Start loading
    tryLoadModel();
  }

  createPhysicsBody(modelSize) {
    // If body already exists, remove it from physics world
    if (this.body) {
      this.physicsWorld.world.removeBody(this.body);
    }
    
    // Store original model size for future collider updates
    this.originalModelSize = {
      x: modelSize.x,
      y: modelSize.y,
      z: modelSize.z
    };
    
    // Use two-sphere collider for Cannon-es Trimesh compatibility
    // Cannon-es supports Sphere↔Trimesh but NOT Box/Cylinder/Convex↔Trimesh
    // Reduce radius slightly to prevent wedging in tight spaces
    const sphereRadius = Math.max(modelSize.x, modelSize.z) * this.colliderScale.width * 0.45;
    
    // Calculate sphere offset - smaller offset brings bottom sphere closer to center
    // This creates a more compact capsule around the player's torso
    const sphereOffset = modelSize.y * 0.25; // Brings bottom sphere higher (was 0.5)
    
    // Get player material from physics world
    const playerMaterial = this.physicsWorld.materials.player;
    
    // Create body with two spheres for capsule-like collision
    this.body = new CANNON.Body({
      mass: 80, // Realistic human mass
      position: new CANNON.Vec3(0, 0, 0), // Position will be set by loadLevel
      material: playerMaterial,
      linearDamping: 0.06, // Slightly more damping to calm micro-bounces
      angularDamping: 1.0, // Prevent rotation
      fixedRotation: true, // Prevent tipping over
      sleepSpeedLimit: 1.0,
      allowSleep: false
    });
    
    // Add two spheres stacked vertically (capsule shape)
    const topSphere = new CANNON.Sphere(sphereRadius);
    const bottomSphere = new CANNON.Sphere(sphereRadius);
    
    // Top sphere at +offset, bottom sphere at -offset (both closer to center now)
    this.body.addShape(topSphere, new CANNON.Vec3(0, sphereOffset, 0));
    this.body.addShape(bottomSphere, new CANNON.Vec3(0, -sphereOffset, 0));

    this._colliderRadius   = sphereRadius;   // sphere radius
this._colliderHalfSpan = sphereOffset;
    
    // Add body to physics world
    this.physicsWorld.world.addBody(this.body);
    
    console.log(`✅ Player two-sphere capsule collider created: radius=${sphereRadius.toFixed(2)}, offset=±${sphereOffset.toFixed(2)} (bottom sphere center ${(-sphereOffset).toFixed(2)}, bottom edge ${(-sphereOffset - sphereRadius).toFixed(2)}), shapes=${this.body.shapes.length}`);
    
    // Create visual debug helper for sphere collider
    // this._createSphereColliderVisualizer(sphereRadius, sphereOffset);
    
    // Set up collision event listeners for wall sliding
    this.setupCollisionListeners();
  }

  setupCollisionListeners() {
    if (!this.body) return;
    
    // Listen for collision begin events
    this.body.addEventListener('collide', (event) => {
      this.handleCollision(event);
    });
  }

  // _createSphereColliderVisualizer(radius, offset) {
  //   // Create wireframe visualization of the two-sphere capsule collider
  //   const group = new THREE.Group();
  //   group.name = 'ColliderVisualizer';
  //   
  //   const wireframeMaterial = new THREE.MeshBasicMaterial({
  //     color: 0x00ff00,
  //     wireframe: true,
  //     transparent: true,
  //     opacity: 0.6,
  //     depthTest: false,
  //     depthWrite: false
  //   });
  //   
  //   // Top sphere
  //   const topSphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
  //   const topSphere = new THREE.Mesh(topSphereGeometry, wireframeMaterial);
  //   topSphere.position.y = offset;
  //   group.add(topSphere);
  //   
  //   // Bottom sphere
  //   const bottomSphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
  //   const bottomSphere = new THREE.Mesh(bottomSphereGeometry, wireframeMaterial);
  //   bottomSphere.position.y = -offset;
  //   group.add(bottomSphere);
  //   
  //   // Connecting cylinder for visual clarity
  //   const cylinderHeight = offset * 2;
  //   const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, cylinderHeight, 16, 1, true);
  //   const cylinder = new THREE.Mesh(cylinderGeometry, wireframeMaterial);
  //   group.add(cylinder);
  //   
  //   group.renderOrder = 999;
  //   group.frustumCulled = false;
  //   
  //   this.colliderVisualizer = group;
  //   this.mesh.add(this.colliderVisualizer);
  //   this.colliderVisualizerVisible = true;
  //   
  //   console.log('🔍 Two-sphere capsule visualizer created (Press V to toggle)');
  // }

  // toggleColliderVisualizer() {
  //   if (!this.colliderVisualizer) {
  //     console.warn('⚠️ No collider visualizer found!');
  //     return;
  //   }
  //   
  //   this.colliderVisualizerVisible = !this.colliderVisualizerVisible;
  //   this.colliderVisualizer.visible = this.colliderVisualizerVisible;
  //   
  //   console.log(`🔍 Collider visualizer toggled: ${this.colliderVisualizerVisible ? 'ON' : 'OFF'}`);
  //   console.log(`🔍 Visualizer object visible property: ${this.colliderVisualizer.visible}`);
  //   console.log(`🔍 Visualizer in scene: ${this.colliderVisualizer.parent !== null}`);
  // }

  handleCollision(event) {
    const contact = event.contact;
    const otherBody = event.target === this.body ? event.body : event.target;
    
    // Get the contact normal
    let normal = contact.ni.clone();
    
    // Determine which body is the player and flip normal if needed
    if (event.target === this.body) {
      normal.negate(); // Flip normal to point away from wall toward player
    }
    
    // Skip ground/ceiling/stair collisions - only handle WALLS
    // Ground and stairs have significant Y component (> 0.3), walls are more horizontal
    if (Math.abs(normal.y) > 0.3) {
      return; // This is ground, stairs, or ceiling - not a wall
    }
    
    // Check if this is a wall or enemy collision
    const isWallOrEnemy = this.isWallOrEnemyBody(otherBody);
    
    if (isWallOrEnemy) {
      // Store wall normal for sliding calculation
      this.addWallNormal(normal);
      
      // Special handling for enemy collisions - add impulse to prevent sticking
      if (otherBody.userData && (otherBody.userData.type === 'enemy' || otherBody.userData.isEnemy)) {
        this.handleEnemyCollision(normal, otherBody);
      }
    }
  }

  handleEnemyCollision(normal, enemyBody) {
    // Apply a small impulse to push player away from enemy
    const pushStrength = 2.0;
    
    // Ensure we have a proper THREE.Vector3 object
    const pushDirection = new THREE.Vector3(normal.x, normal.y, normal.z);
    
    // Only apply horizontal push (don't affect jumping)
    pushDirection.y = 0;
    pushDirection.normalize();
    
    if (pushDirection.length() > 0.1) {
      const pushForce = pushDirection.multiplyScalar(pushStrength);
      this.body.velocity.x += pushForce.x;
      this.body.velocity.z += pushForce.z;
    }
  }

  isWallOrEnemyBody(body) {
    if (!body || !body.userData) return false;
    
    // Check if it's a static body (walls/level geometry)
    if (body.userData.type === 'static') return true;
    
    // Check if it's an enemy body (multiple ways enemies might be identified)
    if (body.userData.type === 'enemy') return true;
    if (body.userData.isEnemy) return true;
    if (body.userData.enemyType) return true;
    
    // Check material type (both material object and material name)
    if (body.material) {
      if (body.material === this.physicsWorld.materials.wall) return true;
      if (body.material === this.physicsWorld.materials.enemy) return true;
      if (body.material.name === 'wall') return true;
      if (body.material.name === 'enemy') return true;
    }
    
    // Check if body belongs to enemy based on mass (enemies typically have specific mass ranges)
    // Be more specific about mass range to avoid false positives
    if (body.mass > 0.5 && body.mass < 10 && body !== this.body) {
      return true; // Likely an enemy
    }
    
    return false;
  }

  addWallNormal(normal) {
    // Store wall normals for sliding - only true WALLS (horizontal surfaces)
    // Reject ground, stairs, and ceiling surfaces (those with significant Y component)
    // Use stricter threshold to avoid treating valley slopes as walls
    if (Math.abs(normal.y) < 0.8) {
      // Convert CANNON.Vec3 to THREE.Vector3 for consistency
      const threeVector = new THREE.Vector3(normal.x, normal.y, normal.z);
      this.wallNormals.push(threeVector);
      
      // Limit stored normals to prevent memory buildup
      if (this.wallNormals.length > 8) {
        this.wallNormals.shift();
      }
    }
  }

  // Combat methods
  performAttack() {
    if (this.isAttacking) {
      console.log('🗡️ Attack blocked - already attacking');
      return false; // Already attacking
    }

    this.isAttacking = true;
    this.lastAttackTime = Date.now();

    console.log('🗡️ Player starting attack animation');

    // Play sword sound
    if (this.game && this.game.soundManager) {
      this.game.soundManager.playSFX('sword', 0.6);
    }

    // Play attack animation if available
    if (this.actions.attack) {
      this.playAction(this.actions.attack, 0.1, false);
      
      // Use mixer event listener instead of action event listener
      const onFinished = (event) => {
        if (event.action === this.actions.attack) {
          this.isAttacking = false;
          this.mixer.removeEventListener('finished', onFinished);
          
          // Return to appropriate animation
          if (this.isGrounded) {
            if (this.body && (Math.abs(this.body.velocity.x) > 0.1 || Math.abs(this.body.velocity.z) > 0.1)) {
              this.playAction(this.actions.walk);
            } else {
              this.playAction(this.actions.idle);
            }
          }
        }
      };
      
      this.mixer.addEventListener('finished', onFinished);
      
      // Fallback timeout in case event doesn't fire
      setTimeout(() => {
        if (this.isAttacking) {
          this.isAttacking = false;
          console.log('🗡️ Attack finished (timeout fallback)');
        }
      }, this.attackDuration);
    } else {
      console.log('🗡️ No attack animation found - using timer only');
      // No attack animation, just set a timer
      setTimeout(() => {
        this.isAttacking = false;
        console.log('🗡️ Attack finished (no animation)');
      }, this.attackDuration);
    }

    return true;
  }

  takeDamage(amount) {
    const previousHealth = this.health;
    this.health = Math.max(0, this.health - amount);
    console.log(`💔 Player took ${amount} damage, health: ${this.health}/${this.maxHealth}`);

    // Play low health warning sound when health drops below 30%
    const lowHealthThreshold = this.maxHealth * 0.3;
    const wasAboveThreshold = previousHealth > lowHealthThreshold;
    const isNowBelowThreshold = this.health <= lowHealthThreshold && this.health > 0;

    if (wasAboveThreshold && isNowBelowThreshold) {
      // First time crossing low health threshold
      if (this.game && this.game.soundManager && this.game.soundManager.sfx['low-health']) {
        console.log('⚠️ Playing low health warning sound');
        this.game.soundManager.playSFX('low-health', 0.8);
      }
    }

    if (this.health <= 0 && this.alive) {
      this.alive = false;              // guard: only trigger once
      this.onDeath();                  // play anim etc.
      // Tell the game a death happened
      try { window.dispatchEvent(new Event('player:death')); } catch (e) {}
    }


    return this.health;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    console.log(`💚 Player healed ${amount} HP, health: ${this.health}/${this.maxHealth}`);
    return this.health;
  }

  onDeath() {
    console.log('💀 Player has died!');
    // this.lockMovement?.('Death');
    // Play death animation if available
    if (this.actions.death) {
      this.playAction(this.actions.death, 0.2, false);
    }
    
    // Can trigger game over, respawn, etc.
  }

  performInteract() {
    if (this.isInteracting) {
      console.log('🤝 Interact blocked - already interacting');
      return false; // Already interacting
    }

    if (this.actions.interact) {
      this.isInteracting = true;
      console.log('🤝 Player starting interact animation');
      
      this.playAction(this.actions.interact, 0.2, false);
      
      // Use mixer event listener to detect when animation finishes
      const onFinished = (event) => {
        if (event.action === this.actions.interact) {
          this.isInteracting = false;
          this.mixer.removeEventListener('finished', onFinished);
          
          console.log('🤝 Interact animation finished');
          
          // Return to appropriate animation
          if (this.isGrounded) {
            if (this.body && (Math.abs(this.body.velocity.x) > 0.1 || Math.abs(this.body.velocity.z) > 0.1)) {
              this.playAction(this.actions.walk);
            } else {
              this.playAction(this.actions.idle);
            }
          }
        }
      };
      
      this.mixer.addEventListener('finished', onFinished);
      
      // Fallback timeout in case event doesn't fire (3 seconds max)
      setTimeout(() => {
        if (this.isInteracting) {
          this.isInteracting = false;
          console.log('🤝 Interact finished (timeout fallback)');
          
          // Return to appropriate animation
          if (this.isGrounded) {
            if (this.body && (Math.abs(this.body.velocity.x) > 0.1 || Math.abs(this.body.velocity.z) > 0.1)) {
              this.playAction(this.actions.walk);
            } else {
              this.playAction(this.actions.idle);
            }
          }
        }
      }, 3000); // 3 second fallback timeout
      
      return true;
    } else {
      console.log('🤝 No interact animation found');
      return false;
    }
  }

  playAction(action, fadeDuration = 0.3, loop = true) {
    if (!action || action === this.currentAction) return;
    
    if (this.currentAction) {
      this.currentAction.crossFadeTo(action, fadeDuration, false);
    }
    
    action.reset();
    if (loop) {
      action.setLoop(THREE.LoopRepeat);
    } else {
      action.setLoop(THREE.LoopOnce);
    }
    action.play();
    this.currentAction = action;
  }

  /**
   * Lock player movement (e.g., during chest animations)
   */
  lockMovement(reason = 'Animation') {
    this.movementLocked = true;
    this.movementLockReason = reason;
    console.log(`🔒 Player movement locked: ${reason}`);
  }

  /**
   * Unlock player movement
   */
  unlockMovement() {
    this.movementLocked = false;
    console.log(`🔓 Player movement unlocked (was locked for: ${this.movementLockReason})`);
    this.movementLockReason = '';
  }

  /**
   * Check if player movement is currently locked
   */
  isMovementLocked() {
    return this.movementLocked;
  }

  update(delta, input, camOrientation = null, platforms = [], playerActive = true) {
    // Clear wall normals from previous frame
    this.wallNormals = [];
    
    if (!this.body) {
      return;
    }
  
    // Update ground detection
    this.updateGroundDetection(delta);
    
    // Jump hold timer is no longer used for variable jump height
    // (discrete low/high jump system instead)
    
    // Apply additional downward force when airborne for faster falling
    if (!this.isGrounded) {
      const extraGravityForce = -25; // Additional downward force (negative Y)
      this.body.applyForce(new CANNON.Vec3(0, extraGravityForce, 0), this.body.position);
    }
    
    // Handle movement input
    if (playerActive) {
      this.handleJumpInput(input);
      this.handleMovementInput(input, camOrientation, delta);
      
      // Check for buffered jumps immediately after jump input processing
      // This catches edge cases where player presses jump at the very edge
      this.handleInteractionInput(input);
      
      // Handle weapon input
      this.weapon.handleInput(input);
      
      // Stair climbing removed
        if (this.isGrounded && this.isMoving) {
          this.handleStairClimbing(camOrientation, delta);
        }
      
      // Anti-stuck detection - check if player is trying to move but stuck
      this.detectAndEscapeStuck(input, delta);
    }

    // Auto lock-on assist: rotate toward nearest enemy when close
    if (playerActive && this.lockOnEnabled) {
      this.updateLockOnTarget();
      this.applyLockOnRotation(delta);
    }
    
    // Apply wall sliding physics (works even without input)
    this.applyWallSlidingPhysics(delta);
    
    // Clamp Y velocity when on slopes to prevent bouncing
    if (this.isGrounded && this.isOnSlope && (!this.isJumping || this.body.velocity.y <= 0)) {
      // Limit upward velocity when on slopes to prevent being shot into the air
      if (this.body.velocity.y > 2.0) {
        this.body.velocity.y = Math.min(this.body.velocity.y, 2.0);
      }
      // Also prevent excessive downward velocity that might cause jitter
      if (this.body.velocity.y < -5.0) {
        this.body.velocity.y = Math.max(this.body.velocity.y, -5.0);
      }
    }

    // Clamp very small vertical oscillations when grounded on uneven mesh surfaces
    if (this.isGrounded && (!this.isJumping || this.body.velocity.y <= 0)) {
      const smallY = 0.6; // max allowed tiny vertical jitter
      if (this.body.velocity.y >  smallY) this.body.velocity.y =  smallY;
      if (this.body.velocity.y < -smallY) this.body.velocity.y = -smallY;
    }
    
    // Update weapon system
    this.weapon.update(delta);
    
    // Sync visual mesh with physics body
    this.syncMeshWithBody();
    
    // Update animations
    this.updateAnimations(delta);

    // Handle footstep sounds
    this.updateFootsteps(delta);
  }

  isLockOnActive() {
    return !!this._lockOnTarget;
  }

  getLockOnTarget() {
    return this._lockOnTarget;
  }

  /**
 * Robust grounded detection with false-fall smoothing.
 * Uses:
 *  - direct physics contact check,
 *  - short downward Cannon ray probe under the feet within groundTolerance,
 *  - coyote time (keep grounded for a short window after leaving),
 *  - min consecutive air frames before declaring a fall.
 */
_stableGrounded(platforms, dt, vy) {
  if (!this.body) return false;

  // 1) Contact-based check from the physics world
  const contactGrounded = this.physicsWorld.isBodyGrounded(this.body, this.groundNormalThreshold);

  // 2) Short downward ray probe just below the capsule's bottom
  let rayGrounded = false;
  try {
    // Bottom of the capsule: center minus half-span minus radius
    const bottomY = this.body.position.y - (this._colliderHalfSpan || 0) - (this._colliderRadius || 0);

    // Start a little above bottom to avoid self-intersection, and probe down
    const startY   = bottomY + Math.min(0.2, (this.groundTolerance ?? 0.12) * 0.5 + 0.05);
    const maxProbe = (this.groundTolerance ?? 0.12) + (this._colliderRadius || 0.15) * 0.5 + 0.05;

    const from = new CANNON.Vec3(this.body.position.x, startY, this.body.position.z);
    const to   = new CANNON.Vec3(this.body.position.x, startY - maxProbe, this.body.position.z);

    const ray = new CANNON.Ray(from, to);
    const res = new CANNON.RaycastResult();
    ray.mode = CANNON.Ray.CLOSEST;
    ray.intersectWorld(this.physicsWorld.world, { skipBackfaces: false, result: res });

    if (res.hasHit) {
      // Accept only reasonably “upward” surfaces within slope limit
      const nY = res.hitNormalWorld.y; // dot(n, up)
      const slopeOK = nY >= Math.cos(this.maxGroundAngleRad ?? THREE.MathUtils.degToRad(55));
      const distanceOK = res.distance <= maxProbe + 1e-3;
      rayGrounded = slopeOK && distanceOK;
    }
  } catch (_) {
    // Fall back to contact only if ray fails for any reason
    rayGrounded = false;
  }

  // Raw grounded signal
  let grounded = contactGrounded || rayGrounded;

  // 3) False-fall smoothing
  // Reset counters immediately when truly grounded
  if (grounded) {
    this._airFrames   = 0;
    this._coyoteTimer = 0;
    return true;
  }

  // If we are rising (jumping) or within forced liftoff frames, allow immediate airborne
  if (vy > 1.0 || this._liftOffFrames > 0 || this.isJumping) {
    this._airFrames++;
    return false;
  }

  // Coyote window: keep grounded briefly after stepping off an edge
  if (this._coyoteTimer < (this.coyoteTime ?? 0.12)) {
    this._coyoteTimer += dt;
    return true;
  }

  // Require N consecutive air frames before we finally report “falling”
  this._airFrames++;
  const needAir = (this.minAirFramesToFall ?? 3);
  if (this._airFrames < needAir) return true;

  return false;
}


  updateLockOnTarget() {
    try {
      // Don't lock when movement is locked (e.g., cinematics)
      if (this.movementLocked || !this.game || !this.game.level) {
        this._lockOnTarget = null;
        return;
      }
      const enemies = this.game.level.getEnemies ? this.game.level.getEnemies() : [];
      if (!enemies || enemies.length === 0) { this._lockOnTarget = null; return; }

      // Keep current target if still valid within hysteresis range to prevent flicker
      const now = Date.now();
      const keepRange = this.lockOnRange + this._lockOnHysteresis;
      const playerPos = this.mesh.position;
      const current = this._lockOnTarget;
      if (current && current.alive !== false && current.mesh) {
        const cpos = current.mesh.position;
        const dist = playerPos.distanceTo(cpos);
        if (dist <= keepRange) {
          return; // keep current target
        }
      }

      // Rate-limit switching
      if (now - this._lastLockSwitchAt < this._lockOnCooldownMs) return;

      // Find nearest enemy within lockOnRange
      let nearest = null, nearestDist = Infinity;
      for (const e of enemies) {
        if (!e || e.alive === false) continue;
        const pos = (e.body)
          ? new THREE.Vector3(e.body.position.x, e.body.position.y, e.body.position.z)
          : (e.mesh ? e.mesh.position : null);
        if (!pos) continue;
        const d = playerPos.distanceTo(pos);
        if (d <= this.lockOnRange && d < nearestDist) { nearest = e; nearestDist = d; }
      }
      if (nearest !== this._lockOnTarget) {
        this._lockOnTarget = nearest || null;
        this._lastLockSwitchAt = now;
      }
    } catch (e) {
      // If anything goes wrong, just clear the target
      this._lockOnTarget = null;
    }
  }

  applyLockOnRotation(delta) {
    const target = this._lockOnTarget;
    if (!target || !target.mesh) return;
    const targetPos = target.mesh.position;
    const selfPos = this.mesh.position;
    // Compute horizontal direction to target
    const dx = targetPos.x - selfPos.x;
    const dz = targetPos.z - selfPos.z;
    const desiredYaw = Math.atan2(dx, dz);
    const currentYaw = this.mesh.rotation.y;
    // Shortest angle difference
    let diff = desiredYaw - currentYaw;
    diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    // Apply smoothing toward target
    this.mesh.rotation.y = currentYaw + diff * this.lockOnSmoothing;
  }

  updateFootsteps(delta) {
    // Only play footsteps when moving and grounded
    if (this.isMoving && this.isGrounded) {
      // Adjust footstep speed based on whether sprinting
      const currentInterval = this.isSprinting ? this.footstepInterval * 0.6 : this.footstepInterval;

      this.footstepTimer += delta;

      if (this.footstepTimer >= currentInterval) {
        this.footstepTimer = 0;

        // Play footstep sound if sound manager is available
        if (this.game && this.game.soundManager) {
          // Use different sound for running vs walking
          const soundName = this.isSprinting ? 'running' : 'walk';
          console.log(`🎵 Playing footstep: ${soundName}, SFX available:`, Object.keys(this.game.soundManager.sfx));
          this.game.soundManager.playSFX(soundName, 0.4);
        } else {
          console.warn('⚠️ Sound manager not available for footsteps');
        }
      }
    } else {
      // Reset timer when not moving
      this.footstepTimer = 0;
    }
  }

updateGroundDetection(delta = 0) {
  if (!this.body) { this.isGrounded = false; return; }

  const wasGrounded = this.isGrounded;
  const vy = this.body?.velocity?.y ?? 0;

  // === Robust grounded state (false-fall guard) ===
  const groundedNow = this._stableGrounded([], delta, vy);
  this.isGrounded = groundedNow;

  // Transition flags
  const justLeftGround = wasGrounded && !groundedNow;
  const justLanded     = !wasGrounded && groundedNow;

  // Coyote timer (for Space handling in handleJumpInput)
  if (justLeftGround) {
    this.coyoteTimeTimer = this.coyoteTime;       // start coyote window
  } else if (groundedNow) {
    this.coyoteTimeTimer = 0;                     // reset when on ground
  } else if (this.coyoteTimeTimer > 0) {
    this.coyoteTimeTimer = Math.max(0, this.coyoteTimeTimer - delta);
  }

  // Jump buffer countdown and execute buffered jump as soon as we regain ground
  if (this.jumpBufferTimer > 0) {
    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);

    if (this.isGrounded && this.jumpBufferTimer > 0 && this.jumpCount === 0 && !this.isJumping) {
      // Preserve and slightly boost horizontal velocity
      const hv = Math.hypot(this.body.velocity.x, this.body.velocity.z);
      if (hv > 0.1) {
        const boost = 1.15;
        this.body.velocity.x *= boost;
        this.body.velocity.z *= boost;
      }
      this.body.velocity.y = this.jumpStrength;
      this.isJumping = true;
      this._liftOffFrames = 2;
      this.isGrounded = false;           // we just jumped
      this.wasGroundedLastFrame = false;
      this.jumpCount = 1;
      this.jumpBufferTimer = 0;
      this.coyoteTimeTimer = 0;

      if (this.game && this.game.soundManager) {
        this.game.soundManager.playSFX('jump', 0.5);
      }
      // We deliberately return here — other “grounded” updates do not apply this frame.
      return;
    }
  }

  // Slope state (unchanged helper)
  this.isOnSlope = this.checkIfOnSlope();

  // Landing housekeeping: clear jump state and restore double jump
  if (this.isGrounded && this.isJumping && this.body.velocity.y <= 0.1) {
    this.isJumping = false;
    this.jumpCount = 0;
    this.canDoubleJump = true;
    this.coyoteTimeTimer = 0;
  }
}


  /**
   * Check if the player is standing on a sloped surface
   */
  checkIfOnSlope() {
    const contacts = this.physicsWorld.getContactsForBody(this.body);
    
    for (const contact of contacts) {
      // Get the contact normal
      let normalY;
      if (contact.bi === this.body) {
        normalY = -contact.ni.y;
      } else {
        normalY = contact.ni.y;
      }
      
      // If normal Y is between slope threshold and grounded threshold, we're on a slope
      if (normalY > this.groundNormalThreshold && normalY < 0.9) {
        // Debug logging for slope detection
        if (Math.random() < 0.01) { // Log occasionally to avoid spam
          console.log(`🏔️ Player on slope - Normal Y: ${normalY.toFixed(3)}`);
        }
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get the velocity of the platform the player is standing on
   * Returns zero velocity if not on a moving platform
   */
  getGroundPlatformVelocity() {
    const contacts = this.physicsWorld.getContactsForBody(this.body);
    
    for (const contact of contacts) {
      // Get the contact normal to identify ground contact
      let normalY;
      let groundBody;
      
      if (contact.bi === this.body) {
        // Player is body i, normal points from us to other body
        normalY = -contact.ni.y;
        groundBody = contact.bj;
      } else {
        // Player is body j, normal points from other body to us
        normalY = contact.ni.y;
        groundBody = contact.bi;
      }
      
      // If this is a ground contact (normal Y > threshold)
      if (normalY > this.groundNormalThreshold && groundBody) {
        // Check if the platform is moving (has significant velocity)
        const platformVel = groundBody.velocity;
        const horizontalSpeed = Math.sqrt(platformVel.x * platformVel.x + platformVel.z * platformVel.z);
        
        // Return platform velocity if it's significant
        if (horizontalSpeed > 0.01) {
          return new THREE.Vector3(platformVel.x, platformVel.y, platformVel.z);
        }
      }
    }
    
    // No moving platform detected
    return new THREE.Vector3(0, 0, 0);
  }

  handleMovementInput(input, camOrientation, delta) {
    if (!input || !input.isKey) {
      return;
    }

    if (!this.body) {
      return;
    }

    // Check if movement is locked (e.g., during chest animations)
    if (this.movementLocked) {
      // Stop any existing movement when locked
      this.body.velocity.x = 0;
      this.body.velocity.z = 0;
      return;
    }
    
    let moveForward = 0;
    let moveRight = 0;

    // Read input
    if (input.isKey('KeyW')) moveForward = 1;
    if (input.isKey('KeyS')) moveForward = -1;
    if (input.isKey('KeyA')) moveRight = -1;
    if (input.isKey('KeyD')) moveRight = 1;

    // Check for sprint
    this.isSprinting = input.isKey('ShiftLeft') || input.isKey('ShiftRight');

    // Track movement state for footsteps
    const wasMoving = this.isMoving;
    this.isMoving = (moveForward !== 0 || moveRight !== 0);
    
    // Apply movement if there's input
    if (moveForward !== 0 || moveRight !== 0) {
      // Get camera direction vectors
      const forward = camOrientation?.forward || new THREE.Vector3(0, 0, -1);
      const right = camOrientation?.right || new THREE.Vector3(1, 0, 0);
      
      // Calculate movement direction in world space
      const moveDirection = new THREE.Vector3();
      moveDirection.addScaledVector(forward, moveForward);
      moveDirection.addScaledVector(right, moveRight);
      moveDirection.y = 0; // Remove vertical component
      moveDirection.normalize();
      
      // Calculate target speed
      const targetSpeed = this.speed * (this.isSprinting ? this.sprintMultiplier : 1);
      
      // Calculate target velocity
      let targetVelX = moveDirection.x * targetSpeed;
      let targetVelZ = moveDirection.z * targetSpeed;
      
      // Apply movement based on grounded state
      if (this.isGrounded) {
        // Get platform velocity if standing on a moving platform
        const platformVel = this.getGroundPlatformVelocity();
        
        // Apply wall sliding to movement input for smooth wall movement
        if (this.enableWallSliding && this.wallNormals.length > 0) {
          const slidingVelocity = this.calculateSlidingVelocity(
            new THREE.Vector3(targetVelX, 0, targetVelZ),
            this.wallNormals
          );
          targetVelX = slidingVelocity.x;
          targetVelZ = slidingVelocity.z;
        }
        
        if (this.isOnSlope) {
          // On slopes, use hybrid approach for smooth hill traversal
          // Maintain horizontal velocity while letting physics handle vertical component
          const forceMultiplier = 75; // Reduced for smoother movement
          const maxSpeed = targetSpeed * 1.1; // Slightly faster to compensate
          
          // Calculate current horizontal speed
          const currentSpeed = Math.sqrt(this.body.velocity.x * this.body.velocity.x + this.body.velocity.z * this.body.velocity.z);
          
          if (currentSpeed < maxSpeed) {
            // Apply force to maintain speed on slopes
            this.body.applyForce(
              new CANNON.Vec3(targetVelX * forceMultiplier, 0, targetVelZ * forceMultiplier),
              this.body.position
            );
          }

          // Add platform velocity to preserve movement on moving platforms
          this.body.velocity.x += platformVel.x;
          this.body.velocity.z += platformVel.z;

          // Very gentle damping to prevent excessive speed without killing momentum
          this.body.velocity.x *= 0.95;
          this.body.velocity.z *= 0.95;
        } else {
          // On flat ground, set velocity to player input plus platform velocity
          // This allows player to move with moving platforms while preserving input
          const platformSpeed = Math.sqrt(platformVel.x * platformVel.x + platformVel.z * platformVel.z);
          
          if (platformSpeed > 0.01) {
            // On moving platform: player input relative to platform
            this.body.velocity.x = targetVelX + platformVel.x;
            this.body.velocity.z = targetVelZ + platformVel.z;
          } else {
            // On static ground: just player input
            this.body.velocity.x = targetVelX;
            this.body.velocity.z = targetVelZ;
          }
        }
      } else {
        // When airborne, DON'T apply wall sliding to input
        // Let the player gain velocity, then applyWallSlidingPhysics will handle collision
        // This prevents "clinging" when jumping then pressing forward into wall
        const airControl = 0.65; // Increased air control for better horizontal jump distance (was 0.3)
        const currentVelX = this.body.velocity.x;
        const currentVelZ = this.body.velocity.z;
        
        // Blend current velocity with target velocity for air control
        // Increased lerp factor for more responsive air control (was 0.2)
        this.body.velocity.x = THREE.MathUtils.lerp(currentVelX, targetVelX * airControl, 0.35);
        this.body.velocity.z = THREE.MathUtils.lerp(currentVelZ, targetVelZ * airControl, 0.35);
      }
      
      // Rotate player to face movement direction
      if (moveDirection.lengthSq() > 0) {
        const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
        this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, targetRotation, 0.1);
      }
    } else {
      // Apply damping when not moving for quicker stops
      if (this.isGrounded) {
        // Get platform velocity to preserve it
        const platformVel = this.getGroundPlatformVelocity();
        const platformSpeed = Math.sqrt(platformVel.x * platformVel.x + platformVel.z * platformVel.z);
        
        if (platformSpeed > 0.01) {
          // On a moving platform - move exactly with the platform
          this.body.velocity.x = platformVel.x;
          this.body.velocity.z = platformVel.z;
        } else {
          // Not on a moving platform - apply damping to stop
          this.body.velocity.x *= 0.7;
          this.body.velocity.z *= 0.7;
        }
      } else {
        // Reduced damping when airborne - let wall sliding handle this
        if (this.wallNormals.length > 0) {
          // Light damping when against walls to allow sliding
          this.body.velocity.x *= 0.95;
          this.body.velocity.z *= 0.95;
        } else {
          // Reduced air resistance when not touching walls to preserve horizontal jump distance (was 0.8)
          this.body.velocity.x *= 0.92;
          this.body.velocity.z *= 0.92;
        }
      }
    }
  }

  detectAndEscapeStuck(input, delta) {
    if (!input || !input.isKey) return;
    
    // Check if player is trying to move
    const tryingToMove = input.isKey('KeyW') || input.isKey('KeyS') || 
                        input.isKey('KeyA') || input.isKey('KeyD');
    
    if (!tryingToMove) {
      // Reset stuck detection when not moving
      this.stuckDetectionTime = 0;
      this.lastPosition.copy(this.body.position);
      return;
    }
    
    // Check if player position has barely changed despite input
    const currentPos = new THREE.Vector3(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    );
    const movementDistance = currentPos.distanceTo(this.lastPosition);
    const minMovementThreshold = 0.04; // Very small movement threshold
    
    if (movementDistance < minMovementThreshold && this.isGrounded) {
      // Player is stuck - increment timer
      this.stuckDetectionTime += delta;
      
      if (this.stuckDetectionTime > this.stuckThreshold) {
        // Player has been stuck for too long - apply escape force
        this.applyStuckEscapeForce();
        this.stuckDetectionTime = 0; // Reset timer after escape attempt
      }
    } else {
      // Player is moving normally
      this.stuckDetectionTime = 0;
    }
    
    // Update last position
    this.lastPosition.copy(currentPos);
  }
  
  applyStuckEscapeForce() {
    console.log('🚨 Player stuck detected - applying escape force');
    
    // Strategy: Apply upward force and push away from wall normals
    
    // 1. Apply upward force to help escape valleys/crevices
    const upwardForce = new CANNON.Vec3(0, this.stuckEscapeForce * 1.5, 0);
    this.body.applyImpulse(upwardForce, this.body.position);
    
    // 2. If we have wall normals, push away from them
    if (this.wallNormals.length > 0) {
      // Average all wall normals to find the "escape" direction
      const escapeDir = new THREE.Vector3(0, 0, 0);
      for (const normal of this.wallNormals) {
        escapeDir.add(normal);
      }
      escapeDir.normalize();
      escapeDir.y = 0; // Keep horizontal
      
      // Apply horizontal escape force
      const horizontalEscape = new CANNON.Vec3(
        escapeDir.x * this.stuckEscapeForce,
        0,
        escapeDir.z * this.stuckEscapeForce
      );
      this.body.applyImpulse(horizontalEscape, this.body.position);
    }
    
    // 3. Wake up the body to ensure physics processes the impulse
    this.body.wakeUp();
  }

  applyWallSlidingPhysics(delta) {
    // Stair climbing removed
      if (this.isClimbingStep) {
        return;
      }
    
    // Apply wall sliding physics when touching walls (both grounded and airborne)
    if (!this.enableWallSliding || this.wallNormals.length === 0) {
      return;
    }

    // Get current velocity
    const currentVel = this.body.velocity.clone();
    
    // Calculate sliding velocity (only affect horizontal movement, preserve Y velocity)
    const slidingVelocity = this.calculateSlidingVelocity(
      new THREE.Vector3(currentVel.x, 0, currentVel.z),
      this.wallNormals
    );
    
    // Apply sliding with different strength based on grounded state
    const slidingStrength = this.isGrounded ? 0.8 : 0.6; // Slightly weaker when airborne for more natural feel
    this.body.velocity.x = THREE.MathUtils.lerp(this.body.velocity.x, slidingVelocity.x, slidingStrength * delta * 60);
    this.body.velocity.z = THREE.MathUtils.lerp(this.body.velocity.z, slidingVelocity.z, slidingStrength * delta * 60);
    
    // When airborne and hitting a wall, apply slight downward slide for more natural wall collision
    if (!this.isGrounded && this.wallNormals.length > 0 && this.body.velocity.y < 0) {
      // Let gravity handle downward movement, but prevent sticking by ensuring minimum downward velocity
      const maxSlideSpeed = -(this.wallSlideSpeed ?? 3.0);
      this.body.velocity.y = Math.max(this.body.velocity.y, maxSlideSpeed);
    }
  }


    handleJumpInput(input) {
    if (!input || !input.isKey) return;
    
    // Check if movement is locked (prevent jumping during animations)
    if (this.movementLocked) {
      return;
    }
    
    if (input.isKey('Space')) {
      // Try to execute jump immediately if conditions are met
      let jumpExecuted = false;

      // First jump: check grounded OR coyote time OR buffered jump
      if (this.jumpCount === 0) {
        const canJumpFromGround = this.isGrounded;
        const canJumpFromCoyote = this.coyoteTimeTimer > 0;
        const hasBufferedJump = this.jumpBufferTimer > 0;

        if (canJumpFromGround || canJumpFromCoyote || hasBufferedJump) {
          // Preserve and slightly boost horizontal velocity when jumping to increase horizontal distance
          const horizontalVel = Math.sqrt(this.body.velocity.x * this.body.velocity.x + this.body.velocity.z * this.body.velocity.z);
          if (horizontalVel > 0.1) {
            // Player is moving horizontally - preserve momentum with slight boost
            const boostFactor = 1.15; // 15% boost to horizontal velocity on jump
            this.body.velocity.x *= boostFactor;
            this.body.velocity.z *= boostFactor;
          }
          
          this.body.velocity.y = this.jumpStrength;
          this.isJumping = true;
          this.jumpCount = 1;
          this.jumpBufferTimer = 0; // Clear buffer
          this.coyoteTimeTimer = 0; // Clear coyote time
          this._liftOffFrames = 2;
          this.isGrounded = false;
          this.wasGroundedLastFrame = false;
          jumpExecuted = true;

          // Play jump sound
          if (this.game && this.game.soundManager) {
            this.game.soundManager.playSFX('jump', 0.5);
          }
          
          console.log('🦘 First jump');
        } else {
          // Can't jump yet - buffer the request
          // Refresh buffer to maximum time to ensure it catches delayed ground detection
          this.jumpBufferTimer = this.jumpBufferTime;
        }
      }
      // Double jump (airborne, haven't used double jump yet)
      else if (this.enableDoubleJump && !this.isGrounded && this.jumpCount === 1 && this.canDoubleJump) {
        // Reset Y velocity before applying double jump (feels more responsive)
        this.body.velocity.y = this.doubleJumpStrength;
        this.jumpCount = 2;
        this.canDoubleJump = false; // Prevent triple jump
        this.jumpBufferTimer = 0; // Clear buffer
        this._liftOffFrames = 2;
        jumpExecuted = true;

        // Play different sound for double jump (if available)
        if (this.game && this.game.soundManager) {
          this.game.soundManager.playSFX('jump', 0.7); // Slightly louder
        }
        
        console.log('🦘🦘 Double jump!');
      }
      // Single jump height - no variable height system
    }
  }




  /**
   * Handle picking up a block
   */
  handlePickupBlock() {
    console.log('🔍 Attempting block pickup...');
    
    if (!this.game) {
      console.log('❌ No game reference');
      return false;
    }
    
    if (!this.game.level) {
      console.log('❌ No level reference');
      return false;
    }
    
    const blockManager = this.game.level.placeableBlockManager;
    if (!blockManager) {
      console.log('❌ No block manager');
      return false;
    }
    
    console.log('✅ Block manager found, has blocks:', blockManager.getAllBlocks().length);
    
    // Cooldown check
    const now = Date.now() / 1000;
    if (now - this.lastPickupTime < this.pickupCooldown) {
      return false;
    }
    
    // Get camera for raycast
    const camera = this.game.activeCamera;
    if (!camera) return false;
    
    // Raycast forward to find blocks
    const origin = camera.position;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    console.log('🎯 Raycast from:', origin, 'direction:', direction, 'range:', this.pickupRange);
    
    const block = blockManager.getBlockFromRaycast(origin, direction, this.pickupRange);
    
    if (block) {
      console.log('✅ Block found:', block.id);
      // Calculate offset position (1.5 units forward, 0.5 down from camera)
      const offset = new THREE.Vector3(0, 0, -2); // 2 units in front, floating
      
      this.heldBlock = block;
      block.pickUp(this, offset);
      this.lastPickupTime = now;
      
      console.log('🎯 Picked up block:', block.id);
      return true;
    } else {
      console.log('❌ No block found in raycast');
    }
    
    return false;
  }
  
  /**
   * Handle dropping a held block
   */
  handleDropBlock() {
    if (!this.heldBlock) return false;
    
    const now = Date.now() / 1000;
    if (now - this.lastPickupTime < this.pickupCooldown) {
      return false;
    }
    
    // Get drop position (where block currently is)
    const dropPosition = new THREE.Vector3(
      this.heldBlock.body.position.x,
      this.heldBlock.body.position.y,
      this.heldBlock.body.position.z
    );
    
    // Check for nearby pressure plates to snap to (larger radius to cover entire plate)
    const nearestPlate = this._findNearestPressurePlate(dropPosition, 4.0, 1.5);
    
    // Drop at current held position
    this.heldBlock.drop(dropPosition);
    
    // After drop, snap to plate if nearby
    if (nearestPlate) {
      const blockRadius = this.heldBlock.getSphereRadius();
      const snapPoint = nearestPlate.getSnapPoint(blockRadius);
      this.heldBlock.attachToPlate(nearestPlate.body, snapPoint);
      console.log('🧲 Block snapped to pressure plate!');
    }
    
    this.heldBlock = null;
    this.lastPickupTime = now;
    return true;
  }
  
  /**
   * Find the nearest pressure plate within snap range
   */
  _findNearestPressurePlate(position, horizontalRadius = 2.0, verticalRange = 1.0) {
    let nearestPlate = null;
    let nearestDistance = Infinity;
    
    if (!this.game || !this.game.level) return null;
    
    // Get all interactive objects from the level
    const interactiveObjects = this.game.level.interactiveObjectManager?.objects || [];
    
    for (const obj of interactiveObjects) {
      if (obj.userData?.type === 'pressurePlate' && obj.userData?.plateInstance) {
        const plate = obj.userData.plateInstance;
        
        if (plate.isWithinSnapZone(position, horizontalRadius, verticalRange)) {
          const distance = position.distanceTo(plate.body.position);
          
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestPlate = plate;
          }
        }
      }
    }
    
    return nearestPlate;
  }
  handleInteractionInput(input) {
    if (!input || !input.isKey) return;
    
    // Use 'E' key for interaction and block pickup/drop
    if (input.isKey('KeyE')) {
      // Block pickup/drop takes priority over general interaction
      if (this.heldBlock) {
        // Currently holding a block - try to drop it
        this.handleDropBlock();
        return;
      }
      
      // Check for block pickup first, then interaction
      if (this.handlePickupBlock()) {
        return; // Block was picked up
      }
      
      // No block picked up, try general interaction
      const currentTime = Date.now();
      if (currentTime - (this.lastInteractionTime || 0) > 500) { // 500ms cooldown
        this.lastInteractionTime = currentTime;
        this.performInteract();
      }
    }
    
    // Use 'V' key to toggle collider visualizer
    // if (input.isKey('KeyV')) {
    //   const currentTime = Date.now();
    //   if (currentTime - (this.lastVisualizerToggleTime || 0) > 300) { // 300ms cooldown
    //     this.lastVisualizerToggleTime = currentTime;
    //     this.toggleColliderVisualizer();
    //   }
    // }
  }

  handleStairClimbing(camOrientation, delta) {
    if (!this.body || !this.isGrounded) return;
    
    // Check cooldown - don't climb too frequently
    const currentTime = performance.now() / 1000; // Convert to seconds
    if (currentTime - this.lastStepClimbTime < this.stepClimbCooldown) {
      return; // Still in cooldown
    }

    // Compute movement direction from horizontal velocity
    const moveDir = new THREE.Vector3(this.body.velocity.x, 0, this.body.velocity.z);
    if (moveDir.length() < 0.1) return; // not moving enough
    moveDir.normalize();

    // Get player's collider half extents
    const halfExt = (this.body.shapes && this.body.shapes[0] && this.body.shapes[0].halfExtents)
      ? this.body.shapes[0].halfExtents
      : { x: 0.5, y: 1, z: 0.5 };

    // Get current ground Y under player's feet (not center)
    const playerFootY = this.body.position.y - halfExt.y;
    const footRayStart = new CANNON.Vec3(this.body.position.x, playerFootY + 0.5, this.body.position.z);
    const footRayEnd = new CANNON.Vec3(this.body.position.x, playerFootY - 2.0, this.body.position.z);
    const footRay = new CANNON.Ray(footRayStart, footRayEnd);
    footRay.mode = CANNON.Ray.CLOSEST;
    const footResult = new CANNON.RaycastResult();
    footRay.intersectWorld(this.physicsWorld.world, { skipBackfaces: false, result: footResult });
    if (!footResult.hasHit) return; // no ground under player
    const groundY = footResult.hitPointWorld.y;

    // Sample multiple points ahead at different distances to find the step
    // Cast from way above down to way below to ensure we catch the step
    const sampleDistances = [0.3, 0.6, 0.9, 1.2, 1.5]; // Try many distances
    let bestForwardY = null;
    let bestDeltaY = 0;
    let debugInfo = [];

    // Try each sample distance to find a step
    for (const dist of sampleDistances) {
      const sampleX = this.body.position.x + moveDir.x * dist;
      const sampleZ = this.body.position.z + moveDir.z * dist;

      // Cast multiple rays at different heights to find the highest surface
      // This handles overlapping colliders (steps on top of ground plane)
      const heightSamples = [
        groundY + 0.2,  // Just above current ground
        groundY + 0.5,
        groundY + 1.0,
        groundY + 1.5,
        groundY + 2.0,
        groundY + 3.0,
        groundY + 4.0,
        groundY + 5.0
      ];

      let highestSurfaceY = groundY; // Start with current ground level

      for (const testHeight of heightSamples) {
        if (testHeight > groundY + this.maxStepHeight) break; // Don't test above max step height
        
        // Short downward ray from test height
        const testRayStart = new CANNON.Vec3(sampleX, testHeight + 0.1, sampleZ);
        const testRayEnd = new CANNON.Vec3(sampleX, testHeight - 0.2, sampleZ);
        const testRay = new CANNON.Ray(testRayStart, testRayEnd);
        testRay.mode = CANNON.Ray.CLOSEST;
        const testResult = new CANNON.RaycastResult();
        testRay.intersectWorld(this.physicsWorld.world, { skipBackfaces: false, result: testResult });

        if (testResult.hasHit && testResult.body !== this.body) {
          const hitY = testResult.hitPointWorld.y;
          // If we found a surface higher than what we've seen, update
          if (hitY > highestSurfaceY && hitY > groundY + 0.05) {
            highestSurfaceY = hitY;
          }
        }
      }

      const forwardY = highestSurfaceY;
      const deltaY = forwardY - groundY;
      
      if (deltaY > 0.05) {
        debugInfo.push(`dist=${dist.toFixed(1)}:fwdY=${forwardY.toFixed(2)}:delta=${deltaY.toFixed(2)}`);
        
        // Keep track of the best (highest) step found that's actually elevated
        if (deltaY > bestDeltaY && deltaY <= this.maxStepHeight) {
          bestDeltaY = deltaY;
          bestForwardY = forwardY;
        }
      } else {
        debugInfo.push(`dist=${dist.toFixed(1)}:same`);
      }
    }

    // Always log for debugging with more detail
    if (Math.random() < 0.15) { // Log 15% of the time
      console.log(`🪜 [step-debug] groundY=${groundY.toFixed(2)} bestFwdY=${bestForwardY ? bestForwardY.toFixed(2) : 'none'} deltaY=${bestDeltaY.toFixed(2)} playerY=${this.body.position.y.toFixed(2)} footY=${playerFootY.toFixed(2)}`);
      console.log(`   samples: ${debugInfo.join(' | ')}`);
    }
    
    // Only climb if:
    // 1. We found an elevated surface ahead
    // 2. Player is grounded (using physics ground detection, not manual check)
    // 3. The step height is within range (ignore tiny variations)
    // Note: We use this.isGrounded instead of checking footY vs groundY because the player
    // might be standing on a step already, and groundY might detect the base ground plane below
    
    if (bestForwardY !== null && bestDeltaY > 0.20 && bestDeltaY <= this.maxStepHeight && this.isGrounded) {
      // Set climbing flag to prevent wall sliding interference
      this.isClimbingStep = true;
      
      // Use a more aggressive lift - climb the full step height instantly if small enough
      const instantClimbThreshold = 0.8; // Steps smaller than this are climbed instantly
      let lift;
      
      if (bestDeltaY <= instantClimbThreshold) {
        // Small steps: teleport up instantly to avoid physics conflicts
        lift = bestDeltaY * 1.5; // Extra lift to clear the step edge
      } else {
        // Larger steps: climb quickly but smoothly
        lift = Math.min(bestDeltaY, this.stepClimbSpeed * delta);
      }
      
      // Teleport the body up (this bypasses collision detection temporarily)
      const newY = this.body.position.y + lift;
      this.body.position.set(this.body.position.x, newY, this.body.position.z);
      
      // Also move slightly forward to ensure we're past the step edge
      const forwardPush = 0.15; // Small forward teleport to clear the edge
      this.body.position.x += moveDir.x * forwardPush;
      this.body.position.z += moveDir.z * forwardPush;
      
      // Reset velocities completely to avoid any conflicts
      this.body.velocity.set(
        moveDir.x * this.speed,
        0, // Zero Y velocity to prevent bouncing
        moveDir.z * this.speed
      );
      
      // Wake up the body to ensure physics updates
      this.body.wakeUp();
      
      // Update cooldown timer
      this.lastStepClimbTime = currentTime;
      
      // Clear the climbing flag after a short delay (next frame)
      setTimeout(() => {
        this.isClimbingStep = false;
      }, 16); // ~1 frame at 60fps
      
      // Debug logging
      console.log(`🪜 [CLIMB] groundY=${groundY.toFixed(2)} forwardY=${bestForwardY.toFixed(2)} deltaY=${bestDeltaY.toFixed(2)} lift=${lift.toFixed(2)} newY=${newY.toFixed(2)}`);
    } else {
      // Not climbing, clear the flag
      this.isClimbingStep = false;
    }
  }

  syncMeshWithBody() {
    if (!this.body) return;
    
    // Sync Y-axis rotation from mesh to physics body while keeping it upright
    // This ensures the collider rotates with the player's facing direction
    const meshRotationY = this.mesh.rotation.y;
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), meshRotationY);
    
    // Calculate offset position in world space
    const offset = new THREE.Vector3(
      this.colliderOffset.x,
      this.colliderOffset.y, 
      this.colliderOffset.z
    );
    
    // Rotate offset by mesh rotation to get world space offset
    offset.applyEuler(new THREE.Euler(0, meshRotationY, 0));
    
    // SMOOTH position sync using lerp to reduce jitter
    // Convert CANNON.Vec3 to THREE.Vector3 first (body.position is CANNON.Vec3, not THREE.Vector3)
    const targetPosition = new THREE.Vector3(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    );
    targetPosition.sub(offset);
    
    // Lerp position for smooth blending (reduces jitter from physics corrections)
    this.mesh.position.lerp(targetPosition, this.meshSyncStrength);
  }

  updateAnimations(delta) {
    if (!this.mixer) return;
    
    // Update animation mixer
    this.mixer.update(delta);
    
    // Skip animation changes during attack or interaction
    if (this.isAttacking || this.isInteracting || performance.now() < (this._animLockUntil || 0)) return;
    
    // Determine which animation to play based on current state
    const velocity = this.body.velocity;
    const rawSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
    // Smooth speed to avoid rapid toggling of animations
    const smoothing = 0.12;
    this.smoothedHorizontalSpeed = THREE.MathUtils.lerp(this.smoothedHorizontalSpeed || 0, rawSpeed, smoothing * (delta * 60));
    const startThreshold = this.moveStartSpeed ?? 0.25;
    const stopThreshold = this.moveStopSpeed ?? 0.12;
    if (this._animMoving) {
      if (this.smoothedHorizontalSpeed < stopThreshold) this._animMoving = false;
    } else {
      if (this.smoothedHorizontalSpeed > startThreshold) this._animMoving = true;
    }
    const isMovingBySpeed = this._animMoving;
    // Prefer input-intent for movement to avoid false idles while sprinting into obstacles
    const isMovingByInput = !!this.isMoving; // set in handleMovementInput based on keys
    const isMoving = isMovingByInput || isMovingBySpeed;
    
    // Determine target animation state (as string to prevent constant restarts)
    let targetState = 'idle';
    
    if (!this.isGrounded && this.actions.jump) {
      // Require a tiny airborne delay before flipping to jump to avoid flicker on edges
      this._airborneTimerSec = (this._airborneTimerSec || 0) + delta;
      const airborneMs = this._airborneTimerSec * 1000;
      if (airborneMs > this.minAirborneForJumpMs) {
        targetState = 'jump';
      }
    } else if (isMoving && this.isSprinting && this.actions.sprint) {
      // Slight buffer so small slowdowns don't pop us down to walk immediately
      const sprintHoldBuffer = 0.2;
      if (this.smoothedHorizontalSpeed > (this.moveStartSpeed + sprintHoldBuffer)) {
        targetState = 'sprint';
      } else if (this.actions.walk) {
        targetState = 'walk';
      }
    } else if (isMoving && this.actions.walk) {
      targetState = 'walk';
    }
    
    // Never allow idle while sprint input is held unless the player actually stops input
    // This prevents idle/run flicker when sprinting but momentarily slowed by slopes/collisions
    if (targetState === 'idle' && this.isSprinting && isMovingByInput) {
      if (this.actions.sprint) {
        targetState = 'sprint';
      } else if (this.actions.walk) {
        targetState = 'walk';
      }
    }
    
    // Only transition if animation state actually changed (reduces jitter from constant resets)
    const now = performance.now();
    if (this.isGrounded) this._airborneTimerSec = 0; // reset timer when grounded

    if (targetState !== this.lastAnimationState) {
      // Enforce minimum time in a state to avoid rapid flip-flops
      const elapsed = now - (this._lastAnimChangeAt || 0);
      if (elapsed >= (this.minAnimStateMs || 0)) {
        this._transitionToAnimationState(targetState);
        this.lastAnimationState = targetState;
        this._lastAnimChangeAt = now;
      }
    }
  }

  _transitionToAnimationState(stateName) {
    let targetAction = null;
    
    switch (stateName) {
      case 'jump':
        targetAction = this.actions.jump;
        break;
      case 'sprint':
        targetAction = this.actions.sprint;
        break;
      case 'walk':
        targetAction = this.actions.walk;
        break;
      case 'idle':
      default:
        targetAction = this.actions.idle;
        break;
    }
    
    if (!targetAction) return;
    
    // Smooth crossfade transition instead of hard cut
    const fadeDuration = 0.3; // 300ms fade for smooth transitions
    
    if (this.currentAction && this.currentAction !== targetAction) {
      this.currentAction.fadeOut(fadeDuration);
    }
    
    if (targetAction) {
      targetAction.reset();
      targetAction.fadeIn(fadeDuration);
      targetAction.play();
      this.currentAction = targetAction;
    }
  }

  setPosition(position) {
    if (!position || !this.body) return;
    
    this.body.position.set(position.x, position.y, position.z);
    this.body.velocity.set(0, 0, 0);
    this.syncMeshWithBody();
  }

  getPosition() {
    if (!this.body) return new THREE.Vector3(0, 0, 0);
    return new THREE.Vector3(this.body.position.x, this.body.position.y, this.body.position.z);
  }

  // Method to update collider size at runtime
  updateColliderSize(widthScale, heightScale, depthScale) {
    if (!this.body) {
      console.warn('⚠️ Cannot update collider - physics body not created yet');
      return;
    }
    
    if (!this.originalModelSize) {
      console.warn('⚠️ Cannot update collider - original model size not stored');
      return;
    }
    
    // Update scale factors
    if (widthScale !== undefined) this.colliderScale.width = widthScale;
    if (heightScale !== undefined) this.colliderScale.height = heightScale;
    if (depthScale !== undefined) this.colliderScale.depth = depthScale;
    
    // Store current position and velocity
    const currentPos = this.body.position.clone();
    const currentVel = this.body.velocity.clone();
    
    // Remove old body
    this.physicsWorld.removeBody(this.body);
    
    // Create new body with updated dimensions using original model size
    this.createPhysicsBody(this.originalModelSize);
    
    // Restore position and velocity
    this.body.position.copy(currentPos);
    this.body.velocity.copy(currentVel);
  }

  // Method to update collider offset at runtime
  updateColliderOffset(offsetX, offsetY, offsetZ) {
    if (offsetX !== undefined) this.colliderOffset.x = offsetX;
    if (offsetY !== undefined) this.colliderOffset.y = offsetY;
    if (offsetZ !== undefined) this.colliderOffset.z = offsetZ;
    
    console.log(`🔧 Updated collider offset: (${this.colliderOffset.x.toFixed(2)}, ${this.colliderOffset.y.toFixed(2)}, ${this.colliderOffset.z.toFixed(2)})`);
  }

  calculateSlidingVelocity(desiredVelocity, wallNormals) {
    if (!wallNormals || wallNormals.length === 0) {
      return desiredVelocity;
    }

    let slidingVelocity = desiredVelocity.clone();

    // Apply sliding for each wall normal
    for (const normal of wallNormals) {
      // Project the desired velocity onto the wall surface
      // Formula: v_slide = v_desired - (v_desired · n) * n
      // Where n is the wall normal
      
      const dotProduct = slidingVelocity.dot(normal);
      
      // Only slide if moving into the wall (positive dot product)
      if (dotProduct > 0.01) { // Small threshold to prevent jitter
        const projectionOntoNormal = normal.clone().multiplyScalar(dotProduct);
        slidingVelocity.sub(projectionOntoNormal);
      }
    }

    // Apply smoothing and speed retention to make sliding feel more natural
    const originalLength = desiredVelocity.length();
    const slidingLength = slidingVelocity.length();
    
    if (slidingLength > 0.01 && originalLength > 0.01) {
      // Maintain more of the original speed when sliding
      // Reduce speed loss based on number of walls and angle
      const speedRetention = THREE.MathUtils.lerp(
        0.7, // Minimum speed retention
        this.wallSlideSmoothing, 
        Math.min(wallNormals.length / 3, 1) // More walls = more speed loss
      );
      
      const targetLength = originalLength * speedRetention;
      slidingVelocity.normalize().multiplyScalar(targetLength);
    }

    return slidingVelocity;
  }

  // Debug method to visualize wall normals
  debugWallNormals() {
    console.log('Current wall normals:');
    this.wallNormals.forEach((normal, index) => {
      console.log(`  ${index}: (${normal.x.toFixed(2)}, ${normal.y.toFixed(2)}, ${normal.z.toFixed(2)})`);
    });
  }

  dispose() {
    
    // Unmount weapon system
    this.weapon.unmount();
    
    // Remove physics body
    if (this.body) {
      this.physicsWorld.removeBody(this.body);
    }
    
    // Remove visual mesh
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
  }

  // Legacy compatibility methods
  toggleHelperVisible(visible) {
    // This was for the old collision debug helpers - no longer needed
  }
}
