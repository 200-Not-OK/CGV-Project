import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Platform {
  constructor(platformData, scene, physicsWorld) {
    this.data = platformData;
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    
    this.mesh = null;
    this.body = null;
    this.animationState = {
      time: 0,
      currentWaypoint: 0,
      visible: true,
      lerpProgress: 0
    };
    
    this._create();
  }
  
  _create() {
    // Create Three.js mesh
    const geometry = new THREE.BoxGeometry(...this.data.size);
    const material = this._loadMaterial();
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(...this.data.position);
    this.mesh.rotation.set(...this.data.rotation);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
    
    // Create Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(
      this.data.size[0] / 2,
      this.data.size[1] / 2,
      this.data.size[2] / 2
    ));
    
    this.body = new CANNON.Body({
      mass: 0, // Static or kinematic
      type: this.data.type === 'static' ? CANNON.Body.STATIC : CANNON.Body.KINEMATIC,
      shape: shape,
      position: new CANNON.Vec3(...this.data.position),
      material: this.physicsWorld.materials[this.data.materialType || 'platform']
    });
    
    // Set rotation if specified
    if (this.data.rotation && this.data.rotation.length === 3) {
      const euler = new CANNON.Vec3(...this.data.rotation);
      this.body.quaternion.setFromEuler(euler.x, euler.y, euler.z);
    }
    
    this.physicsWorld.world.addBody(this.body);
  }
  
  _loadMaterial() {
    const textureLoader = new THREE.TextureLoader();
    const textureUrls = {
      wood: 'assets/textures/wood.jpg',
      metal: 'assets/textures/metal.jpg',
      stone: 'assets/textures/stone.jpg',
      ice: 'assets/textures/ice.jpg'
    };
    
    const textureUrl = this.data.texture === 'custom' 
      ? this.data.textureUrl 
      : textureUrls[this.data.texture];
    
    if (textureUrl) {
      const texture = textureLoader.load(textureUrl);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(...(this.data.textureRepeat || [1, 1]));
      
      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: this.data.texture === 'metal' ? 0.6 : 0.2
      });
    }
    
    // Fallback to color
    return new THREE.MeshLambertMaterial({ color: this.data.color || 0x888888 });
  }
  
  update(delta) {
    if (!this.data.animation) return;
    
    this.animationState.time += delta;
    
    switch (this.data.type) {
      case 'moving':
        this._updateMovingPlatform(delta);
        break;
      case 'rotating':
        this._updateRotatingPlatform(delta);
        break;
      case 'disappearing':
        this._updateDisappearingPlatform(delta);
        break;
    }
    
    // Sync mesh with physics body
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
  
  _updateMovingPlatform(delta) {
    const anim = this.data.animation;
    if (!anim.path || anim.path.length < 2) return;
    
    const current = anim.path[this.animationState.currentWaypoint];
    const next = anim.path[(this.animationState.currentWaypoint + 1) % anim.path.length];
    
    // Calculate distance between waypoints
    const distance = Math.sqrt(
      Math.pow(next[0] - current[0], 2) +
      Math.pow(next[1] - current[1], 2) +
      Math.pow(next[2] - current[2], 2)
    );
    
    // Avoid division by zero
    if (distance < 0.01) {
      this.animationState.currentWaypoint = 
        (this.animationState.currentWaypoint + 1) % anim.path.length;
      this.body.velocity.set(0, 0, 0);
      return;
    }
    
    // Calculate direction vector
    const direction = new CANNON.Vec3(
      next[0] - current[0],
      next[1] - current[1],
      next[2] - current[2]
    );
    direction.normalize();
    
    // Calculate velocity to move at desired speed
    const speed = anim.speed || 2.0;
    const velocity = new CANNON.Vec3(
      direction.x * speed,
      direction.y * speed,
      direction.z * speed
    );
    
    // Update lerp progress
    const moveSpeed = speed * delta;
    this.animationState.lerpProgress += moveSpeed / distance;
    
    // Clamp and check if we reached the waypoint
    if (this.animationState.lerpProgress >= 1.0) {
      this.animationState.lerpProgress = 0;
      this.animationState.currentWaypoint = 
        (this.animationState.currentWaypoint + 1) % anim.path.length;
      
      // Update to exact waypoint position
      const nextWaypoint = anim.path[this.animationState.currentWaypoint];
      this.body.position.set(nextWaypoint[0], nextWaypoint[1], nextWaypoint[2]);
      this.body.velocity.set(0, 0, 0);
    } else {
      // Set velocity for smooth movement (this carries objects on the platform)
      this.body.velocity.copy(velocity);
      
      // Also update position for consistency
      const t = this.animationState.lerpProgress;
      const newPos = new CANNON.Vec3(
        current[0] + (next[0] - current[0]) * t,
        current[1] + (next[1] - current[1]) * t,
        current[2] + (next[2] - current[2]) * t
      );
      
      this.body.position.copy(newPos);
    }
  }
  
  _updateRotatingPlatform(delta) {
    const anim = this.data.animation;
    const axis = new CANNON.Vec3(...(anim.rotationAxis || [0, 1, 0]));
    axis.normalize();
    
    const angle = (anim.rotationSpeed || 1.0) * delta;
    
    const rotationQuat = new CANNON.Quaternion();
    rotationQuat.setFromAxisAngle(axis, angle);
    this.body.quaternion = rotationQuat.mult(this.body.quaternion);
  }
  
  _updateDisappearingPlatform(delta) {
    const anim = this.data.animation;
    const cycleTime = (anim.disappearInterval || 3.0) + (anim.disappearDuration || 2.0);
    const phase = this.animationState.time % cycleTime;
    
    if (phase < anim.disappearInterval && !this.animationState.visible) {
      // Reappear
      this.animationState.visible = true;
      this.mesh.visible = true;
      this.body.collisionResponse = true;
    } else if (phase >= anim.disappearInterval && this.animationState.visible) {
      // Disappear
      this.animationState.visible = false;
      this.mesh.visible = false;
      this.body.collisionResponse = false;
    }
  }
  
  destroy() {
    this.scene.remove(this.mesh);
    this.physicsWorld.world.removeBody(this.body);
    if (this.mesh.geometry) this.mesh.geometry.dispose();
    if (this.mesh.material) {
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach(m => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      } else {
        if (this.mesh.material.map) this.mesh.material.map.dispose();
        this.mesh.material.dispose();
      }
    }
  }
}
