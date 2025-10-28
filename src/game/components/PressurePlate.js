import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { InteractiveObject } from './InteractiveObject.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class PressurePlate extends InteractiveObject {
  constructor(data, scene, physicsWorld) {
    super(data, scene, physicsWorld);
    
    // Pressure plate specific properties
    this.pressedHeight = data.pressedHeight || -0.1;
    this.resetHeight = 0;
    this.activationWeight = data.activationWeight || 50;
    this.requiresContinuousWeight = data.requiresContinuous !== false;
    
    // Track objects on plate
    this.objectsOnPlate = new Set();
    this.currentWeight = 0;
    
    // Animation state
    this.targetY = this.resetHeight;
    this.currentY = this.resetHeight;
    this.animationSpeed = data.animationSpeed || 5.0;
    
    // Visual feedback
    this.activeColor = data.activeColor || 0x00ff00;
    this.inactiveColor = data.inactiveColor || 0x888888;
    this.emissiveIntensity = data.emissiveIntensity || 0.5;
    
    // Contact tracking
    this.contactBodies = new Set();
  }
  
  async _loadGLTF() {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        this.gltfUrl,
        (gltf) => {
          this.gltfScene = gltf.scene;
          this.mesh = new THREE.Group();
          this.mesh.add(gltf.scene);
          this.mesh.position.set(...this.data.position);
          
          // Store original materials for color changing
          this.gltfScene.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.userData.originalMaterial = child.material.clone();
            }
          });
          
          this.scene.add(this.mesh);
          resolve();
        },
        undefined,
        reject
      );
    });
  }
  
  _createPrimitive() {
    // Fallback: procedural pressure plate
    const plateGeometry = new THREE.BoxGeometry(
      this.data.size || 2,
      0.2,
      this.data.size || 2
    );
    
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: this.inactiveColor,
      metalness: 0.6,
      roughness: 0.4,
      emissive: this.inactiveColor,
      emissiveIntensity: 0
    });
    
    this.mesh = new THREE.Mesh(plateGeometry, plateMaterial);
    this.mesh.position.set(...this.data.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
  
  _createPhysics() {
    const size = this.data.size || 2;
    
    // Main platform body (what player stands on)
    const shape = new CANNON.Box(new CANNON.Vec3(
      size / 2,
      0.1, // Thin plate
      size / 2
    ));
    
    this.body = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.KINEMATIC,
      shape: shape,
      position: new CANNON.Vec3(...this.data.position),
      material: this.physicsWorld.materials.platform
    });
    
    // Store reference for identification
    this.body.userData = { 
      type: 'pressurePlate', 
      plateInstance: this 
    };
    
    this.physicsWorld.world.addBody(this.body);
    
    // Setup contact detection using world collision events
    this._setupContactListeners();
  }
  
  _setupContactListeners() {
    // Listen to the physics world's begin/end contact events
    this.physicsWorld.world.addEventListener('beginContact', (event) => {
      this._handleBeginContact(event);
    });
    
    this.physicsWorld.world.addEventListener('endContact', (event) => {
      this._handleEndContact(event);
    });
  }
  
  _handleBeginContact(event) {
    const bodyA = event.bodyA;
    const bodyB = event.bodyB;
    
    let otherBody = null;
    
    // Check if this plate is involved in the contact
    if (bodyA === this.body) {
      otherBody = bodyB;
    } else if (bodyB === this.body) {
      otherBody = bodyA;
    }
    
    // If this plate isn't involved, ignore
    if (!otherBody) return;
    
    // Check if contact is from above (player/object landing on plate)
    const isFromAbove = otherBody.position.y > this.body.position.y;

    // Debug details to help tune thresholds
    try {
      console.log('🔍 Pressure plate contact:', {
        mass: otherBody.mass,
        required: this.activationWeight,
        isFromAbove,
        bodyType: otherBody.userData?.type
      });
    } catch (e) {}
    
    // More lenient weight check: allow activation at 90% of configured weight
    if (isFromAbove && otherBody.mass >= this.activationWeight * 0.9) {
      console.log('Pressure plate contact detected! Mass:', otherBody.mass);
      this._addObjectOnPlate(otherBody);
    }
  }
  
  _handleEndContact(event) {
    const bodyA = event.bodyA;
    const bodyB = event.bodyB;
    
    let otherBody = null;
    
    // Check if this plate is involved in the contact
    if (bodyA === this.body) {
      otherBody = bodyB;
    } else if (bodyB === this.body) {
      otherBody = bodyA;
    }
    
    // If this plate isn't involved, ignore
    if (!otherBody) return;
    
    this._removeObjectFromPlate(otherBody);
  }
  
  _addObjectOnPlate(body) {
    const wasEmpty = this.objectsOnPlate.size === 0;
    this.objectsOnPlate.add(body.id);
    this.contactBodies.add(body);
    this.currentWeight += body.mass;
    
    console.log('Object added to plate. Total weight:', this.currentWeight, 'Required:', this.activationWeight);
    
    if (wasEmpty && this.currentWeight >= this.activationWeight) {
      console.log('✅ Pressure plate activated!');
      this._pressDown();
    }
  }
  
  _removeObjectFromPlate(body) {
    if (this.objectsOnPlate.has(body.id)) {
      this.objectsOnPlate.delete(body.id);
      this.contactBodies.delete(body);
      this.currentWeight -= body.mass;
      
      console.log('Object removed from plate. Remaining weight:', this.currentWeight);
      
      if (this.requiresContinuousWeight && this.objectsOnPlate.size === 0) {
        console.log('⬆️ Pressure plate deactivated!');
        this._releaseUp();
      }
    }
  }
  
  _pressDown() {
    this.targetY = this.pressedHeight;
    this.state = 'activated';
    this._updateVisualFeedback(true);
    this.activate(); // Call base class activation (triggers connected objects)

    // Lock any placeable blocks currently tracked to this plate and apply visuals
    for (const body of this.contactBodies) {
      try {
        const block = body.userData && body.userData.blockInstance ? body.userData.blockInstance : null;
        if (block && !block.isLockedToPlate) {
          const radius = block.getSphereRadius ? block.getSphereRadius() : 0.5;
          const snapPoint = this.getSnapPoint(radius);
          block.attachToPlate(this.body, snapPoint);
          // Do not modify block color; only the plate changes visuals on activation
        }
      } catch (e) {}
    }
  }
  
  _releaseUp() {
    this.targetY = this.resetHeight;
    this.state = 'idle';
    this._updateVisualFeedback(false);
    this.deactivate(); // Call base class deactivation
  }
  
  _updateVisualFeedback(active) {
    const targetColor = active ? this.activeColor : this.inactiveColor;
    const targetEmissive = active ? this.emissiveIntensity : 0;
    
    console.log('🎨 Updating visual feedback. Active:', active, 'Color:', targetColor.toString(16));
    
    if (this.gltfScene) {
      // Update GLTF materials
      this.gltfScene.traverse(child => {
        if (child.isMesh && child.material) {
          child.material.color.setHex(targetColor);
          child.material.emissive.setHex(targetColor);
          child.material.emissiveIntensity = targetEmissive;
          child.material.needsUpdate = true;
        }
      });
    } else if (this.mesh.material) {
      // Update primitive material
      this.mesh.material.color.setHex(targetColor);
      this.mesh.material.emissive.setHex(targetColor);
      this.mesh.material.emissiveIntensity = targetEmissive;
      this.mesh.material.needsUpdate = true;
    }
  }
  
  update(delta) {
    // Animate plate movement
    if (Math.abs(this.currentY - this.targetY) > 0.001) {
      this.currentY += (this.targetY - this.currentY) * this.animationSpeed * delta;
      
      // Update visual position
      this.mesh.position.y = this.data.position[1] + this.currentY;
      
      // Update physics body position
      this.body.position.y = this.data.position[1] + this.currentY;
    }
    
    // Verify contacts are still valid (in case physics world missed endContact)
    this._verifyContacts();
    
    // Use proximity detection as backup for objects that stopped generating contact events
    this._checkProximity();
  }
  
  _verifyContacts() {
    // Check if objects are still actually in contact
    for (const body of this.contactBodies) {
      const distance = this.body.position.distanceTo(body.position);
      const combinedRadius = 3; // Slightly more lenient to account for sphere colliders
      
      if (distance > combinedRadius) {
        // Object moved away without triggering endContact
        this._removeObjectFromPlate(body);
      }
    }
  }

  _checkProximity() {
    // Proximity-based backup detection for objects that stop generating contacts
    const platePos = this.body.position;
    const detectionRadius = 2.5; // Check objects within this horizontal distance
    const detectionHeight = 1.5; // Only check objects slightly above plate
    
    // Check all bodies in the physics world
    for (const body of this.physicsWorld.world.bodies) {
      if (body === this.body || !body.mass) continue;
      
      const dx = body.position.x - platePos.x;
      const dy = body.position.y - platePos.y;
      const dz = body.position.z - platePos.z;
      const horizontalDistance = Math.sqrt(dx*dx + dz*dz); // Horizontal distance only
      
      // If object is close horizontally and resting on/near the plate
      if (horizontalDistance < detectionRadius && dy > -0.5 && dy < detectionHeight) {
        // Only add if it has enough weight and not already tracked
        if (body.mass >= this.activationWeight * 0.9 && !this.objectsOnPlate.has(body.id)) {
          console.log('📍 Proximity detected object:', body.userData?.type, 'mass:', body.mass);
          this._addObjectOnPlate(body);
        }
      }
    }
  }

  /**
   * Manually add a block (for snapped blocks that use constraints)
   */
  _manuallyAddBlock(blockBody) {
    // Directly add to plate without checking contact events
    const wasEmpty = this.objectsOnPlate.size === 0;
    this.objectsOnPlate.add(blockBody.id);
    this.contactBodies.add(blockBody);
    this.currentWeight += blockBody.mass;
    
    console.log('✅ Block manually added to plate. Total weight:', this.currentWeight);
    
    if (wasEmpty && this.currentWeight >= this.activationWeight) {
      console.log('✅ Pressure plate activated!');
      this._pressDown();
    }
  }
  
  /**
   * Manually remove a block (for snapped blocks that use constraints)
   */
  _manuallyRemoveBlock(blockBody) {
    if (this.objectsOnPlate.has(blockBody.id)) {
      const hadObjects = this.objectsOnPlate.size > 0;
      this.objectsOnPlate.delete(blockBody.id);
      this.contactBodies.delete(blockBody);
      this.currentWeight -= blockBody.mass;
      
      console.log('✅ Block manually removed from plate. Remaining weight:', this.currentWeight);
      
      // Only deactivate if it was the only object and plate requires continuous weight
      if (this.requiresContinuousWeight && hadObjects && this.objectsOnPlate.size === 0) {
        console.log('⬆️ Pressure plate deactivated!');
        this._releaseUp();
      }
    }
  }
  
  /**
   * Get the snap point on top of this pressure plate
   */
  getSnapPoint(blockRadius = 0.5) {
    const plateHalfHeight = 0.15; // Half of plate thickness
    // Position the sphere so its bottom touches the plate top
    // sphere center Y = plate top Y + sphere radius
    const y = this.body.position.y + plateHalfHeight + blockRadius + 0.01; // +0.01 tiny gap to avoid penetration
    return new THREE.Vector3(
      this.body.position.x,
      y,
      this.body.position.z
    );
  }
  
  /**
   * Check if a position is within the snap zone
   */
  isWithinSnapZone(position, horizontalRadius = 2.0, verticalRange = 1.0) {
    const platePos = this.body.position;
    const dx = position.x - platePos.x;
    const dz = position.z - platePos.z;
    const horizontalDistance = Math.sqrt(dx*dx + dz*dz);
    const verticalDistance = position.y - platePos.y;
    
    // Use plate's actual size plus a small buffer for edge detection
    const plateSize = this.data.size || 2;
    const effectiveRadius = horizontalRadius + plateSize * 0.5; // Account for plate size
    
    return horizontalDistance < effectiveRadius && 
           verticalDistance > -0.5 && 
           verticalDistance < verticalRange;
  }
  
  destroy() {
    super.destroy();
  }
}
