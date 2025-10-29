import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { NpcBase } from './NpcBase.js';

export class OtherBot extends NpcBase {
  constructor(scene, physicsWorld, options = {}) {
    // OtherBot-specific defaults
    const OtherBotOptions = {
      speed: options.speed ?? 2.5, // Moderate movement speed
      health: options.health ?? 45, // Moderate health
      size: [1.5, 0.8, 1.5], // Standard bot size
      colliderSize: [1.8, 0.9, 1.8], // Slightly larger than visual size
      modelUrl: options.modelUrl || 'assets/npc/other_bot/Mike.gltf',
      ...options
    };

    super(scene, physicsWorld, OtherBotOptions);

    // Store game reference for accessing soundManager
    this.game = options.game || null;

    // OtherBot properties
    this.npcType = 'other_bot';
    
    // Store initial spawn position
    this.initialPosition = options.position ? 
      new THREE.Vector3(options.position[0], options.position[1], options.position[2]) :
      new THREE.Vector3(0, 0.5, 0);
    
    // OtherBot animations - currently just standing animation
    this.botAnimations = {
      take001: null  // Standing/idle animation
    };
    
    console.log(`🤖 OtherBot created with health: ${this.health}`);
  }

  // Override physics body creation
  _createPhysicsBody() {
    if (this.body) {
      this.physicsWorld.removeBody(this.body);
    }
    
    // Use SPHERE collider for OtherBot
    let radius = 3.5; // Default fallback
    if (Array.isArray(this.colliderSize) && this.colliderSize.length >= 3) {
      const diagonal = Math.sqrt(
        this.colliderSize[0] * this.colliderSize[0] + 
        this.colliderSize[1] * this.colliderSize[1] + 
        this.colliderSize[2] * this.colliderSize[2]
      );
      radius = diagonal / 2;
    }
    radius = radius * 2;

    // Create OtherBot physics body with SPHERE collider
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
      npcType: this.npcType || 'other_bot',
      collider: 'sphere',
      radius: radius
    };
    
    console.log(`🤖 Created OtherBot SPHERE physics body (r=${radius.toFixed(2)}) at [${this.mesh.position.x.toFixed(1)}, ${this.mesh.position.y.toFixed(1)}, ${this.mesh.position.z.toFixed(1)}]`);
  }

  // Override model loading to handle OtherBot-specific animations
  _loadModel(url) {
    console.log(`🤖 [OtherBot] Attempting to load model from: "${url}"`);
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      console.log(`🤖 [OtherBot] Successfully loaded model from: "${url}"`);
      
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
        console.log(`🤖 OtherBot model size (unscaled): [${sizeVec.x.toFixed(2)}, ${sizeVec.y.toFixed(2)}, ${sizeVec.z.toFixed(2)}]`);
        console.log(`🤖 OtherBot collider size (fixed): [${this.colliderSize[0]}, ${this.colliderSize[1]}, ${this.colliderSize[2]}]`);

        const centerX = (bbox.max.x + bbox.min.x) / 2;
        const centerZ = (bbox.max.z + bbox.min.z) / 2;
        const centerY = (bbox.max.y + bbox.min.y) / 2;
        gltf.scene.position.x -= centerX;
        gltf.scene.position.z -= centerZ;
        gltf.scene.position.y -= centerY;
        
      } catch (e) {
        console.warn('OtherBot bbox calculation failed:', e);
      }

      // Apply scale AFTER centering but BEFORE adding to mesh
      if (this.modelScale !== 1.0) {
        gltf.scene.scale.set(this.modelScale, this.modelScale, this.modelScale);
        console.log(`🤖 Applied scale ${this.modelScale} to OtherBot model`);
      }

      this.mesh.add(gltf.scene);

      // Handle animations
      if (gltf.animations && gltf.animations.length > 0) {
        this._mapBotAnimations(gltf.animations);
      } else {
        console.warn('🤖 No animations found in OtherBot model');
      }
    }, undefined, (error) => {
      console.error(`❌ [OtherBot] Failed to load model from "${url}":`, error);
    });
  }

_mapBotAnimations(gltfAnimations) {
  if (!gltfAnimations || gltfAnimations.length === 0) {
    console.warn('🤖 No animations found in OtherBot model');
    return;
  }

  // Create mixer
  this.mixer = new THREE.AnimationMixer(this.mesh);
  
  console.log(`🤖 Starting animation mapping for ${gltfAnimations.length} available animations:`);
  
  // Log each animation
  gltfAnimations.forEach((clip, index) => {
    console.log(`🤖   [${index}] "${clip.name}": ${clip.duration}s, ${clip.tracks.length} tracks`);
  });

  // Map idle animation - search for "Idle"
  const idleClip = gltfAnimations.find(a => {
    const name = a.name.toLowerCase();
    return name === 'idle';
  });
  
  if (idleClip) {
    this.botAnimations.take001 = this.mixer.clipAction(idleClip);
    console.log(`🤖 ✓ Mapped take001 to "${idleClip.name}" (${idleClip.duration}s)`);
  } else {
    console.log(`🤖 ✗ No idle animation found, using first available animation`);
    if (gltfAnimations.length > 0) {
      this.botAnimations.take001 = this.mixer.clipAction(gltfAnimations[0]);
      console.log(`🤖 Using "${gltfAnimations[0].name}" as fallback`);
    }
  }

  // Start with idle animation
  if (this.botAnimations.take001) {
    this.botAnimations.take001.reset().play();
    this.currentAction = this.botAnimations.take001;
    console.log('🤖 Started idle animation');
  }
}

  update(delta, player, platforms = []) {
    if (!this.alive || !this.body) return;
    
    // Call base update for physics and health bar
    super.update(delta, player, platforms);
    
    // Update animation mixer
    if (this.mixer) {
      this.mixer.update(delta);
    }
    
    // OtherBot just stands - no movement or patrol behavior
  }
}

