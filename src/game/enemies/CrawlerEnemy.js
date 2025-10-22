import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EnemyBase } from './EnemyBase.js';

export class CrawlerEnemy extends EnemyBase {
  constructor(scene, physicsWorld, options = {}) {
    // Crawler-specific defaults
    const crawlerOptions = {
      speed: options.speed ?? 2.5, // Slow crawling movement
      health: options.health ?? 45, // Moderate health
      size: [1.5, 0.8, 1.5], // Low profile crawler
      colliderSize: [1.8, 0.9, 1.8], // Slightly larger than visual size
      modelUrl: options.modelUrl || 'src/assets/enemies/crawler/Enemy_Crawler.gltf',
      ...options
    };

    super(scene, physicsWorld, crawlerOptions);

    // Store game reference for accessing soundManager
    this.game = options.game || null;

    // Crawler-specific properties
    this.enemyType = 'crawler';
    this.attackRange = 7; // Close range attack
    this.chaseRange = options.chaseRange ?? 6.0;
    this.patrolSpeed = 1.2;
    this.chaseSpeed = 3.0;
    this.attackCooldown = 2500; // 2.5 seconds between attacks
    this.lastAttackTime = 0;
    this.attackTargetLocked = false;
    
    // Multi-legged crawling behavior
    this.crawlFrequency = 1.5; // How fast the legs move
    this.crawlAmplitude = 0.1; // How much body bobs during movement
    this.crawlPhase = Math.random() * Math.PI * 2;
    
    // Crawler behavior states
    this.behaviorState = 'patrol'; // 'patrol', 'chase', 'attack'
    this.patrolPoints = options.patrolPoints || [];
    this.currentPatrolIndex = 0;
    this.stateTimer = 0;
    
    // Store initial spawn position
    this.initialPosition = options.position ? 
      new THREE.Vector3(options.position[0], options.position[1], options.position[2]) :
      new THREE.Vector3(0, 0.5, 0);
    
    // Crawler-specific animations (from your animation list)
    this.crawlerAnimations = {
      idle: null,           // 5.04s long looping idle
      idle2: null,          // idle.001 - alternate idle
      move: null,           // 3.08s walking/crawling
      move1: null,          // move.001 - variant 1
      move2: null,          // move.002 - variant 2  
      move3: null,          // move.003 - variant 3
      attack: null,         // 0.79s attack animation
      die1: null,           // 0.67s death variant 1
      die2: null,           // 0.63s death variant 2
      die3: null            // 0.38s death variant 3
    };
    
    // Random movement animation selection
    this.currentMoveAnimation = 'move';
    this.moveAnimations = ['move', 'move1', 'move2', 'move3'];
    
    console.log(`🕷️ CrawlerEnemy created with health: ${this.health}, speed: ${this.speed}`);
  }

  // Override physics body creation for ground-crawling behavior
// Override physics body creation for ground-crawling behavior
_createPhysicsBody() {
  if (this.body) {
    this.physicsWorld.removeBody(this.body);
  }
  
  // OPTION 2: Use SPHERE collider (if you prefer spherical collision)
  // Compute a proper radius for sphere collider - use average of dimensions for balanced collision
  let radius = 3.5; // Default fallback
if (Array.isArray(this.colliderSize) && this.colliderSize.length >= 3) {
    // Calculate sphere radius based on diagonal of the bounding box
    const diagonal = Math.sqrt(
        this.colliderSize[0] * this.colliderSize[0] + 
        this.colliderSize[1] * this.colliderSize[1] + 
        this.colliderSize[2] * this.colliderSize[2]
    );
    radius = diagonal / 2;
}
    radius = radius*1.8;

  // Create crawler physics body with SPHERE collider
  this.body = this.physicsWorld.createDynamicBody({
    mass: 3.0, // Heavier for stability
    shape: 'sphere',
    size: [radius], // Single radius value for sphere
    position: [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z],
    material: 'enemy'
  });
  
  // Configure crawler-specific physics properties
  this.body.linearDamping = 0.7; // Higher damping for stable crawling
  this.body.angularDamping = 0.98; // Very high angular damping
  this.body.allowSleep = false;
  // Lock rotation for stability
  this.body.fixedRotation = true;
  this.body.updateMassProperties();
  
  // Physics material settings
  this.body.material.friction = 0.6; // Good grip for crawling
  this.body.material.restitution = 0.0;
  
  // Set proper userData
  this.body.userData = { 
    type: 'enemy',
    isEnemy: true,
    enemyType: this.enemyType || 'crawler',
    isCrawler: true,
    collider: 'sphere', // Update to match actual collider type
    radius: radius // Store the actual radius
  };
  
  console.log(`🕷️ Created crawler SPHERE physics body (r=${radius.toFixed(2)}) at [${this.mesh.position.x.toFixed(1)}, ${this.mesh.position.y.toFixed(1)}, ${this.mesh.position.z.toFixed(1)}]`);
}

  // Override model loading to handle crawler-specific animations
  _loadModel(url) {
    console.log(`🕷️ [Crawler] Attempting to load model from: "${url}"`);
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      console.log(`🕷️ [Crawler] Successfully loaded model from: "${url}"`);
      
      // Clear existing mesh
      while (this.mesh.children.length > 0) this.mesh.remove(this.mesh.children[0]);

      // Apply scale if specified
      if (this.modelScale !== 1.0) {
        gltf.scene.scale.set(this.modelScale, this.modelScale, this.modelScale);
        console.log(`🕷️ Applied scale ${this.modelScale} to crawler model`);
      }

      // Compute bbox and center
      try {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const sizeVec = new THREE.Vector3();
        bbox.getSize(sizeVec);
        this.size = [sizeVec.x, sizeVec.y, sizeVec.z];
        
        // Use custom collider size instead of calculating from bbox
        console.log(`🕷️ Crawler model size: [${sizeVec.x.toFixed(2)}, ${sizeVec.y.toFixed(2)}, ${sizeVec.z.toFixed(2)}]`);
        console.log(`🕷️ Crawler collider size: [${this.colliderSize[0]}, ${this.colliderSize[1]}, ${this.colliderSize[2]}]`);

        const centerX = (bbox.max.x + bbox.min.x) / 2;
        const centerZ = (bbox.max.z + bbox.min.z) / 2;
        const centerY = (bbox.max.y + bbox.min.y) / 2;
        gltf.scene.position.x -= centerX;
        gltf.scene.position.z -= centerZ;
        gltf.scene.position.y -= centerY;
        
        // Recreate physics body with new size
        this._createPhysicsBody();
      } catch (e) {
        console.warn('Crawler bbox calculation failed:', e);
      }

      this.mesh.add(gltf.scene);

      // Handle animations
      if (gltf.animations && gltf.animations.length > 0) {
        this._mapCrawlerAnimations(gltf.animations);
      } else {
        console.warn('🕷️ No animations found in crawler model');
      }
    }, undefined, (error) => {
      console.error(`❌ [Crawler] Failed to load model from "${url}":`, error);
    });
  }

  _mapCrawlerAnimations(gltfAnimations) {
    if (!gltfAnimations || gltfAnimations.length === 0) {
      console.warn('🕷️ No animations to map');
      return;
    }

    // Create mixer
    this.mixer = new THREE.AnimationMixer(this.mesh);
    
    console.log(`🕷️ Starting animation mapping for ${gltfAnimations.length} available animations:`);
    
    // Log each animation
    gltfAnimations.forEach((clip, index) => {
      console.log(`🕷️   [${index}] "${clip.name}": ${clip.duration}s, ${clip.tracks.length} tracks`);
    });

    // Map crawler animations based on the animation list
    const animationMappings = {
      idle: ['idle'],
      idle2: ['idle.001'],
      move: ['move'],
      move1: ['move.001'],
      move2: ['move.002'],
      move3: ['move.003'],
      attack: ['attack'],
      die1: ['die1'],
      die2: ['die2'],
      die3: ['die3']
    };

    console.log('🕷️ Animation mapping attempts:');
    for (const [crawlerAction, possibleNames] of Object.entries(animationMappings)) {
      console.log(`🕷️ Looking for ${crawlerAction} animation using names:`, possibleNames);
      
      let foundAnimation = false;
      for (const name of possibleNames) {
        const clip = gltfAnimations.find(a => a.name.toLowerCase() === name.toLowerCase());
        if (clip) {
          this.crawlerAnimations[crawlerAction] = this.mixer.clipAction(clip);
          console.log(`🕷️ ✓ Mapped ${crawlerAction} to "${clip.name}" (${clip.duration}s)`);
          foundAnimation = true;
          break;
        }
      }
      
      if (!foundAnimation) {
        console.log(`🕷️ ✗ No animation found for ${crawlerAction}`);
      }
    }

    // Map to base class actions for compatibility
    console.log('🕷️ Mapping to base class actions:');
    const baseMapping = {
      idle: this.crawlerAnimations.idle || this.crawlerAnimations.idle2,
      walk: this.crawlerAnimations.move,
      run: this.crawlerAnimations.move,
      attack: this.crawlerAnimations.attack
    };

    for (const [baseAction, crawlerAction] of Object.entries(baseMapping)) {
      if (crawlerAction) {
        this.actions[baseAction] = crawlerAction;
        console.log(`🕷️ ✓ Mapped base action ${baseAction}`);
      } else {
        console.log(`🕷️ ✗ No mapping for base action ${baseAction}`);
      }
    }

    // Start with idle animation
    if (this.crawlerAnimations.idle) {
      this.crawlerAnimations.idle.reset().play();
      this.currentAction = this.crawlerAnimations.idle;
      console.log('🕷️ Started idle animation');
    }
  }

  _playCrawlerAction(action, fadeDuration = 0.3) {
    this._playAction(action, fadeDuration, true);
  }

  // Get a random movement animation for variety
  _getRandomMoveAnimation() {
    const randomIndex = Math.floor(Math.random() * this.moveAnimations.length);
    const animName = this.moveAnimations[randomIndex];
    return this.crawlerAnimations[animName];
  }

  update(delta, player, platforms = []) {
    if (!this.alive || !this.body) return;
    
    // Call base update for physics and health bar
    super.update(delta, player, platforms);
    
    // Enhanced physics stability for crawler
    if (this.body && this.body.velocity && this.body.angularVelocity) {
      // Constrain angular velocity
      this.body.angularVelocity.x = 0;
      this.body.angularVelocity.z = 0;
      
      // Limit Y angular velocity
      if (Math.abs(this.body.angularVelocity.y) > 3) {
        this.body.angularVelocity.y = Math.sign(this.body.angularVelocity.y) * 3;
      }
      
      // Reset crawler position if it goes too far from patrol area
      const distanceFromStart = this.mesh.position.distanceTo(this.initialPosition);
      if (distanceFromStart > 50) {
        console.log(`🕷️ Crawler too far from patrol area (${distanceFromStart.toFixed(2)}), resetting to initial position`);
        this.setPosition(this.initialPosition.clone());
        this.body.velocity.set(0, 0, 0);
        this.body.angularVelocity.set(0, 0, 0);
        this.behaviorState = 'patrol';
        this.currentPatrolIndex = 0;
        this.stateTimer = 0;
      }
    }
    
    // Update crawler-specific behavior
    this.updateCrawlerBehavior(delta, player);
    
    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(delta);
    }
    
    // Make crawler face movement direction
    if (this._desiredMovement && this._desiredMovement.lengthSq() > 0.01) {
      const targetAngle = Math.atan2(this._desiredMovement.x, this._desiredMovement.z);
      const currentAngle = this.mesh.rotation.y;
      const angleDiff = targetAngle - currentAngle;
      
      // Normalize angle difference
      let normalizedDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;
      
      // Smooth rotation
      this.mesh.rotation.y += normalizedDiff * 0.1; // Slower rotation for crawler
    }
  }

  updateCrawlerBehavior(delta, player) {
    if (!player || !player.mesh) {
      return;
    }

    const playerPosition = player.mesh.position;
    const crawlerPosition = this.mesh.position;
    const distanceToPlayer = crawlerPosition.distanceTo(playerPosition);

    this.stateTimer += delta;
    
    // Debug logging
    if (Math.floor(this.stateTimer) % 3 === 0 && this.stateTimer % 1 < delta) {
      console.log(`🕷️ Crawler state: ${this.behaviorState}, distance to player: ${distanceToPlayer.toFixed(2)}`);
    }

    switch (this.behaviorState) {
      case 'patrol':
        this.handlePatrolState(delta, player, distanceToPlayer);
        break;
      case 'chase':
        this.handleChaseState(delta, player, distanceToPlayer);
        break;
      case 'attack':
        this.handleAttackState(delta, player, distanceToPlayer);
        break;
    }
  }

  handlePatrolState(delta, player, distanceToPlayer) {
    // Check if player is within chase range
    if (distanceToPlayer <= this.chaseRange) {
      this.behaviorState = 'chase';
      this.stateTimer = 0;
      console.log('🕷️ Crawler detected player, switching to chase');
      
      // Switch to movement animation
      const moveAnim = this._getRandomMoveAnimation();
      if (moveAnim) {
        this._playCrawlerAction(moveAnim);
      }
      return;
    }

    // Patrol between points
    if (this.patrolPoints.length > 0) {
      const targetPatrol = this.patrolPoints[this.currentPatrolIndex];
      const targetPos = new THREE.Vector3(
        targetPatrol[0], 
        targetPatrol[1] || 0.5, // Default height for crawler
        targetPatrol[2]
      );
      const currentPos = this.mesh.position;
      const direction = new THREE.Vector3().subVectors(targetPos, currentPos);
      const distanceToTarget = direction.length();

      if (distanceToTarget < 1.5) {
        // Reached patrol point - play idle animation
        if (this.crawlerAnimations.idle && this.currentAction !== this.crawlerAnimations.idle) {
          this._playCrawlerAction(this.crawlerAnimations.idle);
        }
        
        // Stop movement while at patrol point
        this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
        
        // Wait at patrol point for a bit
        if (this.stateTimer > 3.0) { // Longer wait for crawler
          this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
          this.stateTimer = 0;
          console.log(`🕷️ Moving to next patrol point: ${this.currentPatrolIndex}`);
        }
      } else {
        // Move towards patrol point
        direction.normalize();
        const moveDirection = new THREE.Vector3(direction.x, 0, direction.z);
        
        this.setDesiredMovement(moveDirection.multiplyScalar(this.patrolSpeed));
        
        // Play movement animation when actually moving
        if (this.currentAction === this.crawlerAnimations.idle) {
          const moveAnim = this._getRandomMoveAnimation();
          if (moveAnim) {
            this._playCrawlerAction(moveAnim);
          }
        }
      }
    } else {
      // No patrol points - just idle
      this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
      if (this.crawlerAnimations.idle && this.currentAction !== this.crawlerAnimations.idle) {
        this._playCrawlerAction(this.crawlerAnimations.idle);
      }
    }
  }

  handleChaseState(delta, player, distanceToPlayer) {
    // Check if player escaped
    if (distanceToPlayer > this.chaseRange * 1.5) {
      this.behaviorState = 'patrol';
      this.stateTimer = 0;
      console.log('🕷️ Player escaped, returning to patrol');
      if (this.crawlerAnimations.idle) {
        this._playCrawlerAction(this.crawlerAnimations.idle);
      }
      return;
    }

    // Check if close enough to attack
    if (distanceToPlayer <= this.attackRange) {
      const currentTime = Date.now();
      if (currentTime - this.lastAttackTime >= this.attackCooldown) {
        this.behaviorState = 'attack';
        this.stateTimer = 0;
        this.lastAttackTime = currentTime;
              this.attackTargetLocked = true;
        console.log('🕷️ Crawler attacking!');
        if (this.crawlerAnimations.attack) {
          this._playCrawlerAction(this.crawlerAnimations.attack);
        }
        return;
      }
    }

    // Chase the player
    const playerPosition = player.mesh.position;
    const crawlerPosition = this.mesh.position;
    const direction = new THREE.Vector3().subVectors(playerPosition, crawlerPosition);
    direction.y = 0; // Don't chase vertically
    direction.normalize();

    this.setDesiredMovement(direction.multiplyScalar(this.chaseSpeed));

    // Play movement animation while chasing
    if (this.currentAction !== this.crawlerAnimations.attack) {
      const moveAnim = this._getRandomMoveAnimation();
      if (moveAnim && this.currentAction !== moveAnim) {
        this._playCrawlerAction(moveAnim);
      }
    }
  }

  handleAttackState(delta, player, distanceToPlayer) {
    // Stop movement during attack
    this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
    
    // Also stop physics velocity
    if (this.body) {
      this.body.velocity.x = 0;
      this.body.velocity.z = 0;
    }
    
    // Check for hit in the middle of attack animation
    if (this.stateTimer > 0.3 && this.stateTimer < 0.5 && this.attackTargetLocked) {
      if (distanceToPlayer <= this.attackRange) {
        console.log('🕷️ Crawler hit player!');
        if (player.takeDamage) {
          player.takeDamage(10); // Moderate damage
        }
      }
      this.attackTargetLocked = false;
    }
    
    // Attack animation is 0.79s, then return to chase
    if (this.stateTimer > 0.79) {
      this.lastAttackTime = Date.now();
      
      if (distanceToPlayer <= this.chaseRange) {
        this.behaviorState = 'chase';
        console.log('🕷️ Crawler returning to chase after attack');
        const moveAnim = this._getRandomMoveAnimation();
        if (moveAnim) {
          this._playCrawlerAction(moveAnim);
        }
      } else {
        this.behaviorState = 'patrol';
        console.log('🕷️ Crawler returning to patrol after attack');
        if (this.crawlerAnimations.idle) {
          this._playCrawlerAction(this.crawlerAnimations.idle);
        }
      }
      this.stateTimer = 0;
    }
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    
    if (this.alive) {
      // Become aggressive when hurt
      this.behaviorState = 'chase';
      this.stateTimer = 0;
      console.log(`🕷️ Crawler took ${amount} damage, becoming aggressive!`);
    }
  }

  onDeath() {
    // Play random death animation
    const deathAnims = [this.crawlerAnimations.die1, this.crawlerAnimations.die2, this.crawlerAnimations.die3].filter(anim => anim);
    if (deathAnims.length > 0) {
      const randomDeathAnim = deathAnims[Math.floor(Math.random() * deathAnims.length)];
      if (randomDeathAnim) {
        this._playCrawlerAction(randomDeathAnim, 0.1);
        
        // Set timeout to call super.onDeath after death animation
        setTimeout(() => {
          super.onDeath();
        }, randomDeathAnim.getClip().duration * 1000);
        
        console.log(`🕷️ Crawler playing death animation: ${randomDeathAnim.getClip().name}`);
        return; // Early return to prevent immediate super.onDeath call
      }
    }
    
    // Fallback if no death animations
    super.onDeath();
    console.log('🕷️ Crawler has been defeated!');
  }
}