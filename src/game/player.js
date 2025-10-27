import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { StackWeapon } from './weapons/StackWeapon.js';

export class Player {
  constructor(scene, physicsWorld, options = {}) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    
    // Player settings
    this.speed = options.speed ?? 8;
  this.jumpStrength = options.jumpStrength ?? 24; // Increased further for higher platformer-style jumps
    this.shortJumpStrength = options.shortJumpStrength ?? 12; // For tap jumps
    this.sprintMultiplier = options.sprintMultiplier ?? 1.6;
    this.health = options.health ?? 100;
    
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
    this.meshSyncStrength = 0.15;      // Position lerp blending (0-1, lower = smoother)
    this.rotationSyncStrength = 0.1;   // Rotation slerp blending (0-1, lower = smoother)
    
    // Combat system
    this.maxHealth = 100;
    this.health = this.maxHealth;
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
    this.isSprinting = false;
    this.isJumping = false;
    this.jumpHoldTime = 0; // Track how long jump button is held
    this.maxJumpHoldTime = 0.3; // Maximum time to apply upward force (300ms)
    this.isMoving = false;

    // Double jump system
    this.enableDoubleJump = true;           // Feature flag
    this.jumpCount = 0;                     // Track number of jumps performed
    this.maxJumps = 2;                      // Maximum jumps allowed (1 = normal, 2 = double jump)
    this.doubleJumpStrength = 20;           // Slightly weaker than first jump
    this.canDoubleJump = true;              // Reset when landing

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
    this.mesh.add(this.characterLight); // Attach to player so it follows
    console.log('💡 Character self-illumination light added');
    
    // Initialize weapon system
    this.weapon = new StackWeapon(this, scene, physicsWorld);
    this.weapon.mount();
    
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
          
          // Create physics body now that we know the model dimensions
          this.createPhysicsBody(sizeVec);
          
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
            
            // Create physics body for fallback geometry
            this.createPhysicsBody(new THREE.Vector3(1, 2, 1));
          }
        }
      );
    };
    
    // Start loading
    tryLoadModel();
  }

  createPhysicsBody(modelSize) {
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
      position: new CANNON.Vec3(0, 10, 0),
      material: playerMaterial,
      linearDamping: 0.05, // Reduced damping to prevent sticking in valleys
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

    if (this.health <= 0) {
      this.onDeath();
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
    this.updateGroundDetection();
    
    // Update jump hold timer
    if (this.isJumping && this.jumpHoldTime < this.maxJumpHoldTime) {
      this.jumpHoldTime += delta;
    }
    
    // Apply additional downward force when airborne for faster falling
    if (!this.isGrounded) {
      const extraGravityForce = -25; // Additional downward force (negative Y)
      this.body.applyForce(new CANNON.Vec3(0, extraGravityForce, 0), this.body.position);
    }
    
    // Handle movement input
    if (playerActive) {
      this.handleMovementInput(input, camOrientation, delta);
      this.handleJumpInput(input);
      this.handleInteractionInput(input);
      
      // Handle weapon input
      this.weapon.handleInput(input);
      
      // Check for stair climbing when grounded and moving
      if (this.isGrounded && this.isMoving) {
        this.handleStairClimbing(camOrientation, delta);
      }
      
      // Anti-stuck detection - check if player is trying to move but stuck
      this.detectAndEscapeStuck(input, delta);
    }
    
    // Apply wall sliding physics (works even without input)
    this.applyWallSlidingPhysics(delta);
    
    // Clamp Y velocity when on slopes to prevent bouncing
    if (this.isGrounded && this.isOnSlope) {
      // Limit upward velocity when on slopes to prevent being shot into the air
      if (this.body.velocity.y > 2.0) {
        this.body.velocity.y = Math.min(this.body.velocity.y, 2.0);
      }
      // Also prevent excessive downward velocity that might cause jitter
      if (this.body.velocity.y < -5.0) {
        this.body.velocity.y = Math.max(this.body.velocity.y, -5.0);
      }
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

  updateGroundDetection() {
    // Use the physics world's ground detection
    const wasGrounded = this.isGrounded;
    this.isGrounded = this.physicsWorld.isBodyGrounded(this.body, this.groundNormalThreshold);
    
    // Check if we're on a slope (for better physics handling)
    this.isOnSlope = this.checkIfOnSlope();
    
    // Reset jumping flag AND jump count when player lands
    if (this.isGrounded && this.isJumping && this.body.velocity.y <= 0.1) {
      this.isJumping = false;
      this.jumpCount = 0;              // ✅ Reset jump count on landing
      this.canDoubleJump = true;       // ✅ Allow double jump again
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
          
          // Very gentle damping to prevent excessive speed without killing momentum
          this.body.velocity.x *= 0.95;
          this.body.velocity.z *= 0.95;
        } else {
          // On flat ground, use direct velocity for stable movement
          this.body.velocity.x = targetVelX;
          this.body.velocity.z = targetVelZ;
        }
      } else {
        // When airborne, DON'T apply wall sliding to input
        // Let the player gain velocity, then applyWallSlidingPhysics will handle collision
        // This prevents "clinging" when jumping then pressing forward into wall
        const airControl = 0.3; // Reduce air control compared to ground movement
        const currentVelX = this.body.velocity.x;
        const currentVelZ = this.body.velocity.z;
        
        // Blend current velocity with target velocity for air control
        this.body.velocity.x = THREE.MathUtils.lerp(currentVelX, targetVelX * airControl, 0.2);
        this.body.velocity.z = THREE.MathUtils.lerp(currentVelZ, targetVelZ * airControl, 0.2);
      }
      
      // Rotate player to face movement direction
      if (moveDirection.lengthSq() > 0) {
        const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
        this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, targetRotation, 0.1);
      }
    } else {
      // Apply damping when not moving for quicker stops
      if (this.isGrounded) {
        this.body.velocity.x *= 0.7;
        this.body.velocity.z *= 0.7;
      } else {
        // Reduced damping when airborne - let wall sliding handle this
        if (this.wallNormals.length > 0) {
          // Light damping when against walls to allow sliding
          this.body.velocity.x *= 0.95;
          this.body.velocity.z *= 0.95;
        } else {
          // Normal air resistance when not touching walls
          this.body.velocity.x *= 0.8;
          this.body.velocity.z *= 0.8;
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
    const minMovementThreshold = 0.02; // Very small movement threshold
    
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
    // Don't apply wall sliding if we just climbed a step
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
    if (!this.isGrounded && this.wallNormals.length > 0) {
      // Let gravity handle downward movement, but prevent sticking by ensuring minimum downward velocity
      if (this.body.velocity.y > -1) {
        this.body.velocity.y = Math.min(this.body.velocity.y, -1);
      }
    }
  }

  handleJumpInput(input) {
    if (!input || !input.isKey) return;
    
    // Check if movement is locked (prevent jumping during animations)
    if (this.movementLocked) {
      return;
    }
    
    if (input.isKey('Space')) {
      // First jump (grounded)
      if (this.isGrounded && this.jumpCount === 0) {
        this.body.velocity.y = this.jumpStrength;
        this.isJumping = true;
        this.jumpCount = 1;
        this.jumpHoldTime = 0;

        // Play jump sound
        if (this.game && this.game.soundManager) {
          this.game.soundManager.playSFX('jump', 0.5);
        }
        
        console.log('🦘 First jump');
      }
      // Double jump (airborne, haven't used double jump yet)
      else if (this.enableDoubleJump && !this.isGrounded && this.jumpCount === 1 && this.canDoubleJump) {
        // Reset Y velocity before applying double jump (feels more responsive)
        this.body.velocity.y = this.doubleJumpStrength;
        this.jumpCount = 2;
        this.canDoubleJump = false; // Prevent triple jump
        this.jumpHoldTime = 0;

        // Play different sound for double jump (if available)
        if (this.game && this.game.soundManager) {
          this.game.soundManager.playSFX('jump', 0.7); // Slightly louder
        }
        
        console.log('🦘🦘 Double jump!');
      }
      // Variable jump height (hold space for higher jump)
      else if (this.isJumping && this.jumpHoldTime < this.maxJumpHoldTime) {
        const jumpBoostForce = 25;
        this.body.applyForce(
          new CANNON.Vec3(0, jumpBoostForce, 0),
          this.body.position
        );
      }
    } else {
      // Space key released - cut upward velocity for short hop
      if (this.isJumping && this.jumpHoldTime < this.maxJumpHoldTime) {
        if (this.body.velocity.y > 0) {
          this.body.velocity.y *= 0.5;
        }
      }
      this.jumpHoldTime = this.maxJumpHoldTime;
    }
  }

  handleInteractionInput(input) {
    if (!input || !input.isKey) return;
    
    // Use 'E' key for interaction
    if (input.isKey('KeyE')) {
      // Add a small delay to prevent rapid triggering
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
    if (this.isAttacking || this.isInteracting) return;
    
    // Determine which animation to play based on current state
    const velocity = this.body.velocity;
    const horizontalSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
    const isMoving = horizontalSpeed > 0.1;
    
    // Determine target animation state (as string to prevent constant restarts)
    let targetState = 'idle';
    
    if (!this.isGrounded && this.actions.jump) {
      targetState = 'jump';
    } else if (isMoving && this.isSprinting && this.actions.sprint) {
      targetState = 'sprint';
    } else if (isMoving && this.actions.walk) {
      targetState = 'walk';
    }
    
    // Only transition if animation state actually changed (reduces jitter from constant resets)
    if (targetState !== this.lastAnimationState) {
      this._transitionToAnimationState(targetState);
      this.lastAnimationState = targetState;
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