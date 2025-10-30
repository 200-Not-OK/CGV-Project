import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { NpcBase } from './NpcBase.js';

export class YellowBot extends NpcBase {
  constructor(scene, physicsWorld, options = {}) {
    // Yellow_Bot-specific defaults
    const YellowBotOptions = {
      speed: options.speed ?? 2.5, // Slow crawling movement
      health: options.health ?? 45, // Moderate health
      size: [1.5, 0.8, 1.5], // Low profile Yellow_Bot
      colliderSize: [1.8, 0.9, 1.8], // Slightly larger than visual size
      modelUrl: options.modelUrl || 'assets/npc/yellow_bot/scene.gltf',
      ...options
    };

    super(scene, physicsWorld, YellowBotOptions);

    // Store game reference for accessing soundManager
    this.game = options.game || null;

    // YellowBot properties
    this.npcType = 'yellow_bot';
    
    // Store initial spawn position
    this.initialPosition = options.position ? 
      new THREE.Vector3(options.position[0], options.position[1], options.position[2]) :
      new THREE.Vector3(0, 0.5, 0);
    
    // YellowBot animations - currently just standing animation
    this.botAnimations = {
      take001: null  // Standing/idle animation
    };
    
    console.log(`🤖 YellowBot created with health: ${this.health}`);
    

  }

  // Override physics body creation
  _createPhysicsBody() {
    if (this.body) {
      this.physicsWorld.removeBody(this.body);
    }
    
    // Use SPHERE collider for YellowBot
    let radius = 3.5; // Default fallback
    if (Array.isArray(this.colliderSize) && this.colliderSize.length >= 3) {
      const diagonal = Math.sqrt(
        this.colliderSize[0] * this.colliderSize[0] + 
        this.colliderSize[1] * this.colliderSize[1] + 
        this.colliderSize[2] * this.colliderSize[2]
      );
      radius = diagonal / 2;
    }

    // Create YellowBot physics body with SPHERE collider
    this.body = this.physicsWorld.createDynamicBody({
      mass: 3.0,
      shape: 'sphere',
      size: [radius],
      position: [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z],
      material: 'enemy'
    });
    
    // Configure physics properties
    this.body.linearDamping = 0.7;
    this.body.angularDamping = 0.98;
    this.body.allowSleep = false;
    this.body.fixedRotation = true;
    this.body.updateMassProperties();
    
    this.body.material.friction = 0.6;
    this.body.material.restitution = 0.0;
    
    // Set proper userData
    this.body.userData = { 
      type: 'npc',
      isNpc: true,
      npcType: this.npcType || 'yellow_bot',
      collider: 'sphere',
      radius: radius
    };
    
    console.log(`🤖 Created YellowBot SPHERE physics body (r=${radius.toFixed(2)}) at [${this.mesh.position.x.toFixed(1)}, ${this.mesh.position.y.toFixed(1)}, ${this.mesh.position.z.toFixed(1)}]`);
  }

  // Override model loading to handle YellowBot-specific animations
  _loadModel(url) {
    console.log(`🤖 [YellowBot] Attempting to load model from: "${url}"`);
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      console.log(`🤖 [YellowBot] Successfully loaded model from: "${url}"`);
      
      // Clear existing mesh
      while (this.mesh.children.length > 0) this.mesh.remove(this.mesh.children[0]);

      // Compute bbox and center BEFORE scaling
      try {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const sizeVec = new THREE.Vector3();
        bbox.getSize(sizeVec);
        
        // Store UNSCALED size for physics
        this.size = [sizeVec.x, sizeVec.y, sizeVec.z];
        
        // Keep the fixed collider size from constructor, don't recalculate
        console.log(`🤖 YellowBot model size (unscaled): [${sizeVec.x.toFixed(2)}, ${sizeVec.y.toFixed(2)}, ${sizeVec.z.toFixed(2)}]`);
        console.log(`🤖 YellowBot collider size (fixed): [${this.colliderSize[0]}, ${this.colliderSize[1]}, ${this.colliderSize[2]}]`);

        const centerX = (bbox.max.x + bbox.min.x) / 2;
        const centerZ = (bbox.max.z + bbox.min.z) / 2;
        const centerY = (bbox.max.y + bbox.min.y) / 2;
        gltf.scene.position.x -= centerX;
        gltf.scene.position.z -= centerZ;
        gltf.scene.position.y -= centerY;
        
      } catch (e) {
        console.warn('YellowBot bbox calculation failed:', e);
      }

      // Apply scale AFTER centering but BEFORE adding to mesh
      if (this.modelScale !== 1.0) {
        gltf.scene.scale.set(this.modelScale, this.modelScale, this.modelScale);
        console.log(`🤖 Applied scale ${this.modelScale} to YellowBot model`);
      }

      this.mesh.add(gltf.scene);

      // Mark all NPC meshes to prevent shader application
      this.mesh.traverse((child) => {
        if (child.isMesh) {
          if (!child.userData) child.userData = {};
          child.userData.isNpc = true;
        }
      });

      // Apply character shader to ALL submeshes after model loads
      try {
        const game = this.game;
        const isLevel3 = game?.level?.data?.id === 'level3';
        
        if (game && game.shaderSystem && this.mesh) {
          this.mesh.traverse((child) => {
            if (child.isMesh && child.material) {
              // For Level 3, use brighter material with emissive to prevent darkening
              if (isLevel3) {
                const originalMaterial = child.material;
                const brightMaterial = new THREE.MeshStandardMaterial({
                  map: originalMaterial.map,
                  normalMap: originalMaterial.normalMap,
                  color: originalMaterial.color ? originalMaterial.color.clone() : new THREE.Color(0xffffff),
                  alphaMap: originalMaterial.alphaMap,
                  aoMap: originalMaterial.aoMap,
                  roughnessMap: originalMaterial.roughnessMap,
                  metalnessMap: originalMaterial.metalnessMap,
                  emissiveMap: originalMaterial.emissiveMap,
                  roughness: 0.6,
                  metalness: 0.1,
                  // Add emissive to make NPCs visible in low light
                  emissive: originalMaterial.color ? originalMaterial.color.clone().multiplyScalar(0.15) : new THREE.Color(0x222222),
                  emissiveIntensity: 0.4,
                  transparent: originalMaterial.transparent || false,
                  opacity: originalMaterial.opacity !== undefined ? originalMaterial.opacity : 1.0,
                });
                child.material = brightMaterial;
                child.castShadow = false;
                child.receiveShadow = false;
              } else {
                game.shaderSystem.applyCharacterShader(child, {
                  roughness: 0.6,
                  metalness: 0.1,
                  rimIntensity: 1.5
                });
              }
            }
          });
        } else if (this.mesh) {
          // Fallback: adjust material properties without emissive
          this.mesh.traverse((child) => {
            if (child.isMesh && child.material) {
              const m = child.material;
              if (m.isMeshStandardMaterial) {
                m.roughness = Math.min(0.8, (m.roughness ?? 0.7));
                m.metalness = Math.max(0.0, (m.metalness ?? 0.1));
              }
            }
          });
        }
      } catch (e) { console.warn('YellowBot material enhancement failed', e); }

      // Handle animations
      if (gltf.animations && gltf.animations.length > 0) {
        this._mapBotAnimations(gltf.animations);
      } else {
        console.warn('🤖 No animations found in YellowBot model');
      }
    }, undefined, (error) => {
      console.error(`❌ [YellowBot] Failed to load model from "${url}":`, error);
    });
  }

_mapBotAnimations(gltfAnimations) {
  if (!gltfAnimations || gltfAnimations.length === 0) {
    console.warn('🤖 No animations found in YellowBot model');
    return;
  }

  // Create mixer
  this.mixer = new THREE.AnimationMixer(this.mesh);
  
  console.log(`🤖 Starting animation mapping for ${gltfAnimations.length} available animations:`);
  
  // Log each animation
  gltfAnimations.forEach((clip, index) => {
    console.log(`🤖   [${index}] "${clip.name}": ${clip.duration}s, ${clip.tracks.length} tracks`);
  });

  // Map standing animation - search for "Take 001" (with space)
  const standingClip = gltfAnimations.find(a => {
    const name = a.name.toLowerCase();
    return name === 'take 001' || name === 'take.001' || name === 'take001';
  });
  
  if (standingClip) {
    this.botAnimations.take001 = this.mixer.clipAction(standingClip);
    console.log(`🤖 ✓ Mapped take001 to "${standingClip.name}" (${standingClip.duration}s)`);
  } else {
    console.log(`🤖 ✗ No standing animation found, using first available animation`);
    if (gltfAnimations.length > 0) {
      this.botAnimations.take001 = this.mixer.clipAction(gltfAnimations[0]);
      console.log(`🤖 Using "${gltfAnimations[0].name}" as fallback`);
    }
  }

  // Start with standing animation
  if (this.botAnimations.take001) {
    this.botAnimations.take001.reset().play();
    this.currentAction = this.botAnimations.take001;
    console.log('🤖 Started standing animation');
  }
}

  // PATROL LOGIC COMMENTED OUT FOR FUTURE USE - YellowBot currently just stands idle
  /*
  updateBotBehavior(delta, player) {
    if (!player || !player.mesh) {
      return;
    }

    const playerPosition = player.mesh.position;
    const botPosition = this.mesh.position;
    const distanceToPlayer = botPosition.distanceTo(playerPosition);

    this.stateTimer += delta;
    
    // Debug logging
    if (Math.floor(this.stateTimer) % 3 === 0 && this.stateTimer % 1 < delta) {
      console.log(`🤖 YellowBot state: ${this.behaviorState}, distance to player: ${distanceToPlayer.toFixed(2)}`);
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
      console.log('🤖 YellowBot detected player, switching to chase');
      return;
    }

    // Patrol between points
    if (this.patrolPoints.length > 0) {
      const targetPatrol = this.patrolPoints[this.currentPatrolIndex];
      const targetPos = new THREE.Vector3(
        targetPatrol[0], 
        targetPatrol[1] || 0.5,
        targetPatrol[2]
      );
      const currentPos = this.mesh.position;
      const direction = new THREE.Vector3().subVectors(targetPos, currentPos);
      const distanceToTarget = direction.length();

      if (distanceToTarget < 1.5) {
        this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
        
        if (this.stateTimer > 3.0) {
          this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
          this.stateTimer = 0;
          console.log(`🤖 Moving to next patrol point: ${this.currentPatrolIndex}`);
        }
      } else {
        direction.normalize();
        const moveDirection = new THREE.Vector3(direction.x, 0, direction.z);
        this.setDesiredMovement(moveDirection.multiplyScalar(this.patrolSpeed));
      }
    } else {
      this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
    }
  }

  handleChaseState(delta, player, distanceToPlayer) {
    if (distanceToPlayer > this.chaseRange * 1.5) {
      this.behaviorState = 'patrol';
      this.stateTimer = 0;
      console.log('🤖 Player escaped, returning to patrol');
      return;
    }

    if (distanceToPlayer <= this.attackRange) {
      const currentTime = Date.now();
      if (currentTime - this.lastAttackTime >= this.attackCooldown) {
        this.behaviorState = 'attack';
        this.stateTimer = 0;
        this.lastAttackTime = currentTime;
        console.log('🤖 YellowBot attacking!');
        return;
      }
    }

    const playerPosition = player.mesh.position;
    const botPosition = this.mesh.position;
    const direction = new THREE.Vector3().subVectors(playerPosition, botPosition);
    direction.y = 0;
    direction.normalize();

    this.setDesiredMovement(direction.multiplyScalar(this.chaseSpeed));
  }

  handleAttackState(delta, player, distanceToPlayer) {
    this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
    
    if (this.body) {
      this.body.velocity.x = 0;
      this.body.velocity.z = 0;
    }
    
    if (this.stateTimer > 0.3 && this.stateTimer < 0.5) {
      if (distanceToPlayer <= this.attackRange) {
        console.log('🤖 YellowBot hit player!');
        if (player.takeDamage) {
          player.takeDamage(10);
        }
      }
    }
    
    if (this.stateTimer > 0.79) {
      this.lastAttackTime = Date.now();
      
      if (distanceToPlayer <= this.chaseRange) {
        this.behaviorState = 'chase';
        console.log('🤖 YellowBot returning to chase after attack');
      } else {
        this.behaviorState = 'patrol';
        console.log('🤖 YellowBot returning to patrol after attack');
      }
      this.stateTimer = 0;
    }
  }
  */

  update(delta, player, platforms = []) {
    if (!this.alive || !this.body) return;
    
    // Call base update for physics and health bar
    super.update(delta, player, platforms);
    
    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(delta);
    }
    
    // YellowBot just stands - no movement or patrol behavior
    // Future patrol logic can be uncommmented in updateBotBehavior() method above
  }
}