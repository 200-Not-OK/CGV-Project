import * as THREE from 'three';
import * as CANNON from 'cannon-es';

/**
 * PlaceableBlock - A dynamic block that players can pick up, carry, and drop
 * Can be used to activate pressure plates or solve puzzles
 */
export class PlaceableBlock {
  constructor(data, scene, physicsWorld) {
    this.data = data;
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    
    // Block properties
    this.id = data.id;
    this.position = new THREE.Vector3(...data.position);
    this.size = data.size || [1, 1, 1];
    this.mass = data.mass || 50;
    this.color = data.color || 0x00ff88;
    this.colorName = data.colorName || 'green';
    
    // Respawn settings
    this.respawn = data.respawn !== false;
    this.respawnTime = data.respawnTime || 3;
    this.respawnThreshold = data.respawnThreshold || -50;
    this.spawnPosition = new THREE.Vector3(...(data.spawnPosition || data.position));
    
    // State
    this.heldByPlayer = false;
    this.holdingPlayer = null;
    this.respawnTimer = 0;
    this.isRespawning = false;
    
    // Components
    this.mesh = null;
    this.body = null;
    
    // Offset when held by player (in front of camera, floating)
    this.heldOffset = new THREE.Vector3(0, 0, -2); // 2 units in front, centered
    
    // Snap constraint for magnetic attachment to pressure plates
    this.snapConstraint = null;
    this.snappedToPlate = null;
    this.isLockedToPlate = false; // prevent movement/pickup while locked
  }
  
  create() {
    this._createVisual();
    this._createPhysics();
  }
  
  _createVisual() {
    const geometry = new THREE.BoxGeometry(this.size[0], this.size[1], this.size[2]);
    const material = new THREE.MeshStandardMaterial({
      color: this.color,
      metalness: 0.6,
      roughness: 0.4,
      emissive: this.color,
      emissiveIntensity: 0.2
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 999; // Render on top to ensure visibility
    
    // Add userData for identification
    this.mesh.userData.blockInstance = this;
    this.mesh.userData.type = 'placeableBlock';
    
    this.scene.add(this.mesh);
  }
  
  _createPhysics() {
    // Combined collider: Sphere + Box
    // - Sphere is kept for reliable Trimesh interactions (level geometry)
    // - Box is added for more stable contacts with flat surfaces (e.g., pressure plates)
    // Sphere radius based on smallest dimension
    const radius = Math.min(this.size[0], this.size[1], this.size[2]) / 2;
    const sphereShape = new CANNON.Sphere(radius);

    // Box half-extents based on block size
    const halfX = (this.size[0] || 1) / 2;
    const halfY = (this.size[1] || 1) / 2;
    const halfZ = (this.size[2] || 1) / 2;
    const boxShape = new CANNON.Box(new CANNON.Vec3(halfX, halfY, halfZ));

    this.body = new CANNON.Body({
      mass: this.mass,
      material: this.physicsWorld.materials.ground,
      position: new CANNON.Vec3(this.position.x, this.position.y, this.position.z),
      linearDamping: 0.3,  // Add damping to prevent excessive sliding
      angularDamping: 0.3,  // Add rotational damping
      allowSleep: true,     // Allow sleeping for performance
      sleepSpeedLimit: 0.5  // Less sensitive: avoid sleeping too early so contacts fire
    });

    // Add both shapes at the body's origin
    this.body.addShape(sphereShape);
    this.body.addShape(boxShape);
    
    // Store reference for identification
    this.body.userData = {
      type: 'placeableBlock',
      blockInstance: this,
      mass: this.mass
    };
    
    this.physicsWorld.world.addBody(this.body);
    console.log(`📦 Block ${this.id} created with mass: ${this.mass}`);
  }
  
  /**
   * Pick up this block (called by player)
   */
  pickUp(player, offset) {
    if (this.heldByPlayer) return false;
    // Do not allow pickup when locked to a plate
    if (this.isLockedToPlate) {
      console.log(`⛔ Block ${this.id} is locked to a plate and cannot be picked up.`);
      return false;
    }
    
    this.heldByPlayer = true;
    this.holdingPlayer = player;
    this.heldOffset.copy(offset || new THREE.Vector3(0, 0, 0));
    
    // Detach from any snapped plate before picking up
    this.detach();
    
    // Change body to kinematic so it follows player without physics forces
    this.body.type = CANNON.Body.KINEMATIC;
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    
    // Disable collision completely by setting collisionResponse to false
    this.body.collisionResponse = false;
    
    // Ensure the mesh is visible while holding
    if (this.mesh) {
      this.mesh.visible = true;
    }
    
    console.log(`📦 Picked up block ${this.id}`);
    return true;
  }
  
  /**
   * Drop this block (called by player)
   */
  drop(position) {
    if (!this.heldByPlayer) return false;
    
    this.heldByPlayer = false;
    const player = this.holdingPlayer;
    this.holdingPlayer = null;
    
    // Change body back to dynamic so it falls and can be pushed
    this.body.type = CANNON.Body.DYNAMIC;
    
    // Re-enable collision
    this.body.collisionResponse = true;
    
    // Set new position
    if (position) {
      this.body.position.set(position.x, position.y, position.z);
      this.mesh.position.copy(position);
    }
    
    // Add a slight forward/upward velocity to make it drop naturally
    this.body.velocity.set(0, 2, 0);
    this.body.wakeUp(); // Ensure contacts will be generated after drop
    
    console.log(`📦 Dropped block ${this.id}`);
    return true;
  }
  
  /**
   * Check if block should respawn (fell off the map)
   */
  checkRespawn() {
    if (!this.respawn || this.heldByPlayer) return;
    
    const currentPos = this.body.position;
    
    if (currentPos.y < this.respawnThreshold) {
      // Start respawn process
      if (!this.isRespawning) {
        this.isRespawning = true;
        this.respawnTimer = 0;
        console.log(`🔄 Block ${this.id} fell off map, respawning...`);
      }
      
      this.respawnTimer += 0.016; // ~60fps delta
      
      if (this.respawnTimer >= this.respawnTime) {
        this.doRespawn();
      }
    }
  }
  
  /**
   * Respawn the block at its spawn position
   */
  doRespawn() {
    this.body.position.set(
      this.spawnPosition.x,
      this.spawnPosition.y,
      this.spawnPosition.z
    );
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.mesh.position.copy(this.spawnPosition);
    
    this.isRespawning = false;
    this.respawnTimer = 0;
    
    console.log(`✅ Block ${this.id} respawned at spawn position`);
  }
  
  /**
   * Update the block (called each frame)
   */
  update(delta) {
    if (this.heldByPlayer && this.holdingPlayer) {
      // If being held, follow the player at offset
      this._updateHeldPosition();
    } else {
      // If not held, sync mesh with physics body
      this.mesh.position.copy(this.body.position);
      this.mesh.quaternion.copy(this.body.quaternion);
    }
    
    // Check for respawn if not held
    this.checkRespawn();
  }
  
  _updateHeldPosition() {
    if (!this.holdingPlayer) {
      console.log('⚠️ No holding player reference');
      return;
    }
  
    // Get camera orientation
    const camera = this.holdingPlayer.game?.activeCamera;
    
    if (!camera) {
      console.log('⚠️ No active camera');
      return;
    }
  
    // Get camera's world direction (where it's looking)
    const cameraForward = new THREE.Vector3();
    camera.getWorldDirection(cameraForward);
    
    // Calculate held position: 2 units in front of camera
    const distance = 12; // Always 2 units forward
    const heldPos = camera.position.clone().add(cameraForward.multiplyScalar(distance));
    
    console.log('📦 Holding block at position:', heldPos.x.toFixed(2), heldPos.y.toFixed(2), heldPos.z.toFixed(2));
    
    // Update both mesh and physics body
    if (this.mesh) {
      this.mesh.position.copy(heldPos);
      this.mesh.visible = true;
    }
    this.body.position.set(heldPos.x, heldPos.y, heldPos.z);
    
    // Rotate to match camera rotation
    this.mesh.quaternion.copy(camera.quaternion);
    this.body.quaternion.set(
      camera.quaternion.x,
      camera.quaternion.y,
      camera.quaternion.z,
      camera.quaternion.w
    );
  }
  
  /**
   * Get the world position of this block
   */
  getPosition() {
    return this.mesh.position.clone();
  }
  
  /**
   * Get the sphere radius of this block
   */
  getSphereRadius() {
    return Math.min(this.size[0], this.size[1], this.size[2]) / 2;
  }
  
  /**
   * Check if this block is being held
   */
  isHeld() {
    return this.heldByPlayer;
  }
  
  /**
   * Attach this block to a pressure plate using a constraint
   */
  attachToPlate(plateBody, snapPosition) {
    // Remove any existing constraint
    this.detach();
    
    // Snap to position first
    this.body.position.set(snapPosition.x, snapPosition.y, snapPosition.z);
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.body.quaternion.set(0, 0, 0, 1); // Reset rotation
    
    // Create lock constraint to keep block on plate
    this.snapConstraint = new CANNON.LockConstraint(plateBody, this.body, {
      maxForce: 1e5
    });
    
    this.physicsWorld.world.addConstraint(this.snapConstraint);
    this.snappedToPlate = plateBody;
    this.isLockedToPlate = true;
    
    // Update mesh position
    if (this.mesh) {
      this.mesh.position.copy(snapPosition);
      this.mesh.quaternion.set(0, 0, 0, 1);
    }
    
    // Manually trigger pressure plate activation since constraint may prevent contact events
    if (plateBody.userData && plateBody.userData.plateInstance) {
      plateBody.userData.plateInstance._manuallyAddBlock(this.body);
    }
    
    console.log(`🧲 Block ${this.id} snapped to pressure plate`);
  }
  
  /**
   * Detach block from pressure plate
   */
  detach() {
    if (this.snapConstraint) {
      // Manually remove from pressure plate first
      if (this.snappedToPlate && this.snappedToPlate.userData && this.snappedToPlate.userData.plateInstance) {
        this.snappedToPlate.userData.plateInstance._manuallyRemoveBlock(this.body);
      }
      
      // Remove constraint
      this.physicsWorld.world.removeConstraint(this.snapConstraint);
      this.snapConstraint = null;
      this.snappedToPlate = null;
      this.isLockedToPlate = false;
      console.log(`🔓 Block ${this.id} detached from pressure plate`);
    }
  }

  /**
   * Apply activation visuals to the block (match plate active color)
   */
  applyActivationVisual(colorHex, emissiveIntensity = 0.5) {
    if (!this.mesh) return;
    const applyToMaterial = (mat) => {
      if (!mat) return;
      if (mat.color) mat.color.setHex(colorHex);
      if (mat.emissive) mat.emissive.setHex(colorHex);
      if (typeof mat.emissiveIntensity === 'number') mat.emissiveIntensity = emissiveIntensity;
      mat.needsUpdate = true;
    };
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach(applyToMaterial);
    } else {
      applyToMaterial(this.mesh.material);
    }
  }
  
  /**
   * Destroy and cleanup this block
   */
  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
    
    if (this.body && this.physicsWorld.world) {
      this.physicsWorld.world.removeBody(this.body);
    }
  }
}
