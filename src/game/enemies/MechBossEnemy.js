import { EnemyBase } from './EnemyBase.js';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class MechBossEnemy extends EnemyBase {
  constructor(scene, physicsWorld, options = {}) {
    // Mech Boss-specific defaults
    const mechBossOptions = {
      speed: options.speed ?? 1.5, // Slower, heavy mech movement
      health: options.health ?? 600, // Very high health for mech boss
      size: [2.0, 3.0, 2.0], // Tall mech
      colliderSize: [2.0, 2.0, 2.0], // Tighter sphere collision for accuracy
      modelUrl: 'src/assets/enemies/robot_boss/scene.gltf',
      ...options
    };

    super(scene, physicsWorld, mechBossOptions);
    
    // Mech Boss-specific properties
    this.enemyType = 'mech_boss';
    this.isBoss = true;
    this.attackRange = 3.0; // Longer reach for mech
    this.chaseRange = options.chaseRange ?? 15.0; // Wide detection range
    this.detectionRange = 15.0; // Same as chase range
    this.patrolSpeed = 0; // Static by default
    this.chaseSpeed = 2.0; // Moderate chase speed
    this.attackCooldown = 4000; // 4 seconds between attacks
    this.lastAttackTime = Date.now() - this.attackCooldown;
    this.attackStartTime = null;
    this.attackDuration = 2000; // Attack animation duration
    
    // Grace period system for fairer combat
    this.attackGracePeriod = 1000; // 1 second warning before attack
    this.graceStartTime = null;
    this.hasGracePeriod = true;
    
    // Mech behavior states
    this.behaviorState = 'idle'; // 'idle', 'chase', 'attack', 'pre_attack', 'enraged'
    this.patrolPoints = options.patrolPoints || [];
    this.currentPatrolIndex = 0;
    this.patrolDirection = 1;
    this.stateTimer = 0;
    
    // Mech-specific mechanics
    this.enrageThreshold = this.maxHealth * 0.25; // Enrage at 25% health
    this.isEnraged = false;
    this.multiAttackCount = 0;
    this.maxMultiAttacks = 2; // Can do 2 consecutive attacks when enraged
    
    // Store initial spawn position
    this.initialPosition = options.position ? 
      new THREE.Vector3(options.position[0], options.position[1], options.position[2]) :
      new THREE.Vector3(0, 2, 0);
    
    // Mech-specific animations (using the provided animation names)
    this.mechAnimations = {
      idle: null,       // Will be set based on available animations
      walk: null,       // MSA_Anim_1 (walk cycle)
      attack: null,     // MSA_Anim_3 (attack cycle)
    };
    
    // Enhanced health bar for boss
    this.healthBarAlwaysVisible = true;
    this.healthBarSize = { width: 2.5, height: 0.3 }; // Large health bar for mech

    // Ensure we only signal defeat once
    this._deathEventFired = false;
    
    console.log(`🤖 MechBossEnemy created with health: ${this.health}, speed: ${this.speed}`);
    console.log(`🤖 Mech Boss enrage threshold: ${this.enrageThreshold}`);
  }

  // Override physics body creation for larger mech boss
  _createPhysicsBody() {
    if (this.body) {
      this.physicsWorld.removeBody(this.body);
    }
    
    // Vertical offset for better collision alignment
    const colliderOffset = 1.5;
    
    // Sphere radius for accurate collision (adjusted for mech body)
    const sphereRadius = 1.5; // Tighter fit around mech's torso
    
    // Create mech boss physics body with very high mass
    this.body = this.physicsWorld.createDynamicBody({
      mass: 8.0, // Very heavy mech
      shape: 'sphere',
      size: [sphereRadius * 2, sphereRadius * 2, sphereRadius * 2], // Diameter for sphere
      position: [this.mesh.position.x, this.mesh.position.y + colliderOffset, this.mesh.position.z],
      material: 'enemy'
    });
    
    // Configure mech-specific physics properties
    this.body.linearDamping = 0.6; // Heavy damping for slow, deliberate movement
    this.body.angularDamping = 0.99;
    this.body.allowSleep = false;
    this.body.fixedRotation = true;
    this.body.updateMassProperties();
    
    // Physics material for mech
    this.body.material.friction = 0.8;
    this.body.material.restitution = 0.0; // No bounce
    
    // Set proper userData
    this.body.userData = { 
      type: 'enemy',
      isEnemy: true,
      isBoss: true,
      enemyType: this.enemyType || 'mech_boss'
    };
    
    console.log(`🤖 Created mech boss physics body at [${this.mesh.position.x}, ${this.mesh.position.y + colliderOffset}, ${this.mesh.position.z}]`);
  }

  // Override health bar creation for boss-sized health bar
  _createHealthBar() {
    console.log(`🤖 Creating boss health bar for ${this.constructor.name}`);
    
    // Create health bar group that will float above the mech
    this.healthBarGroup = new THREE.Group();
    this.healthBarGroup.position.y = this.size[1] + 1.0; // Higher above mech
    this.healthBarGroup.visible = this.healthBarAlwaysVisible || false;
    
    // Set the healthBarVisible flag for the parent class
    this.healthBarVisible = this.healthBarAlwaysVisible || false;
    
    // Large health bar background
    const bgGeometry = new THREE.PlaneGeometry(this.healthBarSize.width, this.healthBarSize.height);
    const bgMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000, 
      transparent: true, 
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    this.healthBarBg = new THREE.Mesh(bgGeometry, bgMaterial);
    this.healthBarGroup.add(this.healthBarBg);
    
    // Mech boss health bar fill (orange/red for mech)
    const fillGeometry = new THREE.PlaneGeometry(this.healthBarSize.width * 0.9, this.healthBarSize.height * 0.7);
    const fillMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6600, // Orange for mech
      transparent: true, 
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    this.healthBarFill = new THREE.Mesh(fillGeometry, fillMaterial);
    this.healthBarFill.position.z = 0.001;
    this.healthBarGroup.add(this.healthBarFill);
    
    this.mesh.add(this.healthBarGroup);
    
    console.log(`🤖 Mech boss health bar created and always visible`);
  }

  // Override model loading to handle mech-specific animations
  _loadModel(url) {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      // Clear existing mesh children
      while (this.mesh.children.length > 0) {
        this.mesh.remove(this.mesh.children[0]);
      }

      // Compute bbox and center
      try {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const sizeVec = new THREE.Vector3();
        bbox.getSize(sizeVec);
        this.size = [sizeVec.x, sizeVec.y, sizeVec.z];
        
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        gltf.scene.position.sub(center);
        gltf.scene.position.y += sizeVec.y / 2;

        // Scale the mech boss model using the scale from options
        const scale = this.modelScale; // Use scale from options/levelData
        gltf.scene.scale.set(scale, scale, scale);
        
        this.mesh.add(gltf.scene);
        
        // Setup mech animations
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(gltf.scene);
          
          console.log(`🤖 Available animations:`, gltf.animations.map(clip => clip.name));
          
          // Map the provided animation names to our mech animations
          gltf.animations.forEach(clip => {
            const action = this.mixer.clipAction(clip);
            
            switch (clip.name) {
              case 'MSA_Anim_1':
                this.mechAnimations.attack = action;
                this.actions.attack = action;
                console.log(`🤖 Mapped MSA_Anim_1 to attack animation`);
                break;
              case 'MSA_Anim_3':
                this.mechAnimations.walk = action;
                this.actions.walk = action;
                console.log(`🤖 Mapped MSA_Anim_3 to walk animation`);
                break;
              default:
                // Use first animation as idle if we don't have a dedicated one
                if (!this.mechAnimations.idle) {
                  this.mechAnimations.idle = action;
                  this.actions.idle = action;
                  console.log(`🤖 Using ${clip.name} as idle animation`);
                }
            }
          });
          
          // If we don't have an idle animation, use walk as idle
          if (!this.mechAnimations.idle && this.mechAnimations.walk) {
            this.mechAnimations.idle = this.mechAnimations.walk;
            console.log(`🤖 Using walk animation as idle fallback`);
          }
          
          // Start with idle animation
          if (this.mechAnimations.idle) {
            this.mechAnimations.idle.play();
            this.currentAction = this.mechAnimations.idle;
          }
          
          console.log(`🤖 Mech animations loaded:`, Object.keys(this.mechAnimations).filter(key => this.mechAnimations[key]));
        }
        
        // Create health bar after mesh is ready
        this._createHealthBar();
        
        console.log(`🤖 Mech boss model loaded successfully with scale ${scale}`);
      } catch (error) {
        console.error('🤖 Error processing mech boss model:', error);
      }
    }, undefined, (error) => {
      console.error('🤖 Error loading mech boss model:', error);
    });
  }

  // Enhanced AI behavior for mech boss
  update(deltaTime, player) {
    if (!this.alive || !this.body || !player) return;

    // Call parent update but skip animation handling (we'll do it ourselves)
    const originalMixer = this.mixer;
    this.mixer = null;
    super.update(deltaTime, player);
    this.mixer = originalMixer;

    // Adjust mesh position to compensate for collider offset
    const colliderOffset = 1.5;
    this.mesh.position.y = this.body.position.y - colliderOffset;

    // Check for enrage state
    if (!this.isEnraged && this.health <= this.enrageThreshold) {
      this._enterEnrageMode();
    }

    // Enhanced mech AI
    this._updateMechAI(deltaTime, player);
    
    // Handle mech animations
    this._updateMechAnimations(deltaTime);
  }

  _enterEnrageMode() {
    this.isEnraged = true;
    this.speed *= 1.3; // Increase speed when enraged
    this.attackCooldown *= 0.75; // Faster attacks
    this.chaseSpeed *= 1.2;
    
    // Change health bar color to indicate enrage
    if (this.healthBarFill) {
      this.healthBarFill.material.color.setHex(0xff0000); // Red when enraged
    }
    
    console.log(`🤖 MECH BOSS ENRAGED! Health: ${this.health}/${this.maxHealth}`);
  }

  _updateMechAI(deltaTime, player) {
    const distanceToPlayer = this.mesh.position.distanceTo(player.mesh.position);
    const currentTime = Date.now();

    // Debug logging for mech AI
    if (Math.random() < 0.01) {
      console.log(`🤖 Mech AI: State=${this.behaviorState}, Distance=${distanceToPlayer.toFixed(2)}, DetectionRange=${this.detectionRange}`);
    }

    // Mech-specific behavior logic - remains static until player is detected
    switch (this.behaviorState) {
      case 'idle':
        // Mech remains completely static until player comes into view
        if (distanceToPlayer <= this.detectionRange) {
          this.behaviorState = 'chase';
          this.stateTimer = 0;
          console.log(`🤖 Mech Boss detected player! Activating... Distance: ${distanceToPlayer.toFixed(2)}`);
        }
        // No movement in idle state
        break;

      case 'chase':
        if (distanceToPlayer > this.chaseRange * 1.5) {
          // Player escaped - mech returns to idle/static state
          this.behaviorState = 'idle';
          this.graceStartTime = null;
          console.log(`🤖 Mech Boss lost player. Deactivating...`);
        } else if (distanceToPlayer <= this.attackRange) {
          // Check if we need grace period before attacking
          if (this.hasGracePeriod && !this.graceStartTime) {
            this.graceStartTime = currentTime;
            this.behaviorState = 'pre_attack';
            console.log(`🤖 Mech in attack range, starting grace period (${this.attackGracePeriod}ms)`);
          } else if (!this.hasGracePeriod || (this.graceStartTime && currentTime - this.graceStartTime > this.attackGracePeriod)) {
            if (currentTime - this.lastAttackTime > this.attackCooldown) {
              this.behaviorState = 'attack';
              console.log(`🤖 Mech Boss initiating attack! Distance: ${distanceToPlayer.toFixed(2)}`);
              this.graceStartTime = null;
            }
          }
        } else {
          this._chasePlayer(player);
          this.graceStartTime = null;
        }
        break;

      case 'pre_attack':
        const graceTimeRemaining = this.attackGracePeriod - (currentTime - this.graceStartTime);
        
        if (distanceToPlayer > this.attackRange * 1.2) {
          this.behaviorState = 'chase';
          this.graceStartTime = null;
          console.log(`🤖 Player escaped during grace period, returning to chase`);
        } else if (graceTimeRemaining <= 0) {
          if (currentTime - this.lastAttackTime > this.attackCooldown) {
            this.behaviorState = 'attack';
            console.log(`🤖 Grace period ended, mech initiating attack!`);
          } else {
            this.behaviorState = 'chase';
            console.log(`🤖 Grace period ended but attack on cooldown, returning to chase`);
          }
          this.graceStartTime = null;
        } else {
          if (Math.random() < 0.02) {
            console.log(`🤖 ⚠️  MECH CHARGING ATTACK: ${graceTimeRemaining.toFixed(0)}ms remaining ⚠️`);
          }
        }
        break;

      case 'attack':
        this._performAttack(player);
        break;
    }

    this.stateTimer += deltaTime;
  }

  _performAttack(player) {
    const currentTime = Date.now();
    
    if (currentTime - this.lastAttackTime > this.attackCooldown) {
      console.log(`🤖 Mech executing attack sequence...`);
      
      // Play attack animation
      if (this.mechAnimations.attack) {
        this._playAnimation(this.mechAnimations.attack, false);
        
        const animationClip = this.mechAnimations.attack._clip;
        if (animationClip) {
          this.attackDuration = (animationClip.duration * 1000);
          console.log(`🤖 Attack animation duration: ${this.attackDuration}ms`);
        } else {
          this.attackDuration = 2000;
        }
      } else {
        this.attackDuration = 2000;
      }
      
      // Mech deals heavy damage
      const damage = this.isEnraged ? 35 : 25;
      const distanceToPlayer = this.mesh.position.distanceTo(player.mesh.position);
      
      if (distanceToPlayer <= this.attackRange) {
        console.log(`🤖 Mech Boss attacks player for ${damage} damage!`);
        if (player.takeDamage) {
          player.takeDamage(damage);
        }
      }
      
      this.lastAttackTime = currentTime;
      this.multiAttackCount++;
      
      // Disable grace period after first attack
      if (this.hasGracePeriod) {
        this.hasGracePeriod = false;
        console.log(`🤖 Mech grace period disabled - full combat mode!`);
      }
      
      this.attackStartTime = currentTime;
      
    } else if (this.attackStartTime && (currentTime - this.attackStartTime > this.attackDuration)) {
      console.log(`🤖 Attack animation completed...`);
      
      // Enraged mech can chain attacks
      if (this.isEnraged && this.multiAttackCount < this.maxMultiAttacks) {
        this.attackCooldown = 2000; // Faster chained attacks
        console.log(`🤖 Mech chains another attack (${this.multiAttackCount}/${this.maxMultiAttacks})`);
        this.attackStartTime = null;
      } else {
        this.attackCooldown = this.isEnraged ? 3000 : 4000;
        this.multiAttackCount = 0;
        this.behaviorState = 'chase';
        this.attackStartTime = null;
        console.log(`🤖 Mech attack sequence complete, returning to chase`);
      }
    }
  }

  _chasePlayer(player) {
    const direction = new THREE.Vector3().subVectors(player.mesh.position, this.mesh.position);
    direction.normalize();
    
    const moveForce = this.chaseSpeed;
    this._desiredMovement.copy(direction).multiplyScalar(moveForce);
    this._applyMovement();
  }

  _applyMovement() {
    if (!this.body) return;

    // Heavy mech movement
    const force = new CANNON.Vec3(
      this._desiredMovement.x * 4, // Strong forces for heavy mech
      0,
      this._desiredMovement.z * 4
    );
    
    this.body.applyForce(force, this.body.position);
  }

  _playAnimation(action, loop = true) {
    if (this.currentAction && this.currentAction !== action) {
      this.currentAction.fadeOut(0.3);
    }
    
    if (action) {
      action.reset();
      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
      
      if (!loop && action._clip) {
        action.clampWhenFinished = true;
      }
      
      action.fadeIn(0.3);
      action.play();
      this.currentAction = action;
      
      console.log(`🤖 Playing animation: ${action._clip?.name || 'unknown'}, Loop: ${loop}`);
    }
  }

  _updateMechAnimations(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }

    // Don't override animations during attack
    if (this.behaviorState === 'attack') {
      return;
    }

    // Update animation based on state
    const currentSpeed = new THREE.Vector3(
      this.body?.velocity.x || 0,
      0,
      this.body?.velocity.z || 0
    ).length();

    let targetAnimation = null;

    // Idle state - no movement animation
    if (this.behaviorState === 'idle') {
      targetAnimation = this.mechAnimations.idle;
    }
    // Pre-attack - stay in idle/walk animation
    else if (this.behaviorState === 'pre_attack') {
      targetAnimation = this.mechAnimations.idle || this.mechAnimations.walk;
    }
    // Moving - play walk animation
    else if (currentSpeed > 0.5) {
      targetAnimation = this.mechAnimations.walk;
    }
    // Standing still but active
    else {
      targetAnimation = this.mechAnimations.idle || this.mechAnimations.walk;
    }

    if (targetAnimation && targetAnimation !== this.currentAction) {
      this._playAnimation(targetAnimation);
    }
  }

  // Override death to play death animation + fire one-time defeat events
  takeDamage(amount) {
    const wasDead = !this.alive;
    super.takeDamage(amount);
    
    if (!wasDead && !this.alive) {
      console.log(`🤖 MECH BOSS DEFEATED!`);

      // Fire once: tell the rest of the game the boss is down
      if (!this._deathEventFired) {
        this._deathEventFired = true;
        try {
          const levelId = this.game?.currentLevelId || this.game?.levelId || null;

          if (this.game?.events?.emit) {
            this.game.events.emit('boss:defeated', { levelId });
          }

          window.dispatchEvent(new CustomEvent('boss:defeated', { detail: { levelId } }));
        } catch (e) {
          console.warn('Could not dispatch boss:defeated event:', e);
        }
      }

      if (this.game?.events?.emit) {
        this.game.events.emit('level:complete', { levelId: this.game?.level?.data?.id });
      } else {
        window.dispatchEvent(new CustomEvent('level:complete', {
          detail: { levelId: this.game?.level?.data?.id }
        }));
      }
    }
  }

  dispose() {
    super.dispose();
    console.log(`🤖 Mech boss enemy disposed`);
  }
}
