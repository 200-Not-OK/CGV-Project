import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class GLTFPlatform {
  constructor(platformData, scene, physicsWorld) {
    this.data = platformData;
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    
    this.mesh = null;
    this.body = null;
    this.gltfScene = null;
    
    // Animation state
    this.animationState = {
      time: 0,
      currentWaypoint: 0,
      visible: true,
      lerpProgress: 0
    };
  }
  
  async create() {
    await this._loadGLTF();
    this._createPhysicsFromGLTF();
  }
  
  async _loadGLTF() {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        this.data.gltfUrl,
        (gltf) => {
          this.gltfScene = gltf.scene;
          this.mesh = new THREE.Group();
          this.mesh.add(gltf.scene);
          
          // Apply transforms
          this.mesh.position.set(...this.data.position);
          if (this.data.rotation) {
            this.mesh.rotation.set(...this.data.rotation);
          }
          if (this.data.scale) {
            this.mesh.scale.set(...this.data.scale);
          }
          
          // Setup materials
          gltf.scene.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Apply custom material properties if specified
              if (this.data.materialOverride) {
                const oldMap = child.material.map;
                child.material = new THREE.MeshStandardMaterial({
                  ...this.data.materialOverride,
                  map: oldMap // Keep texture
                });
              }
            }
          });
          
          this.scene.add(this.mesh);
          resolve();
        },
        undefined,
        (error) => {
          console.error('Failed to load GLTF platform:', error);
          reject(error);
        }
      );
    });
  }
  
  _createPhysicsFromGLTF() {
    // Choose physics type based on data
    const physicsType = this.data.physicsType || 'box';
    
    switch (physicsType) {
      case 'box':
        this._createBoxCollider();
        break;
      case 'mesh':
      case 'trimesh':
        this._createTrimeshCollider();
        break;
      case 'convex':
        this._createConvexCollider();
        break;
      default:
        console.warn(`Unknown physics type: ${physicsType}, using box`);
        this._createBoxCollider();
    }
  }
  
  _createBoxCollider() {
    // Calculate bounding box
    const bbox = new THREE.Box3().setFromObject(this.mesh);
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());
    
    const shape = new CANNON.Box(new CANNON.Vec3(
      size.x / 2,
      size.y / 2,
      size.z / 2
    ));
    
    this.body = new CANNON.Body({
      mass: 0,
      type: this.data.type === 'static' ? CANNON.Body.STATIC : CANNON.Body.KINEMATIC,
      shape: shape,
      position: new CANNON.Vec3(center.x, center.y, center.z),
      material: this.physicsWorld.materials?.[this.data.materialType || 'platform'] || null
    });
    
    this.physicsWorld.world.addBody(this.body);
    console.log(`Created box collider for GLTF platform: ${this.data.id}`);
  }
  
  _createTrimeshCollider() {
    const vertices = [];
    const indices = [];
    let indexOffset = 0;
    
    this.gltfScene.traverse(child => {
      if (child.isMesh) {
        const geometry = child.geometry;
        const positionAttr = geometry.attributes.position;
        
        // Update world matrix
        child.updateMatrixWorld(true);
        
        // Extract vertices in world space
        for (let i = 0; i < positionAttr.count; i++) {
          const vertex = new THREE.Vector3(
            positionAttr.getX(i),
            positionAttr.getY(i),
            positionAttr.getZ(i)
          );
          
          // Apply mesh transforms
          vertex.applyMatrix4(child.matrixWorld);
          vertices.push(vertex.x, vertex.y, vertex.z);
        }
        
        // Extract indices
        if (geometry.index) {
          for (let i = 0; i < geometry.index.count; i++) {
            indices.push(geometry.index.getX(i) + indexOffset);
          }
          indexOffset += positionAttr.count;
        } else {
          // No index buffer, create indices
          for (let i = 0; i < positionAttr.count; i++) {
            indices.push(i + indexOffset);
          }
          indexOffset += positionAttr.count;
        }
      }
    });
    
    if (vertices.length === 0) {
      console.warn('No vertices found for trimesh, falling back to box');
      this._createBoxCollider();
      return;
    }
    
    const shape = new CANNON.Trimesh(vertices, indices);
    
    this.body = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      shape: shape,
      position: new CANNON.Vec3(0, 0, 0), // Already in world space
      material: this.physicsWorld.materials?.[this.data.materialType || 'platform'] || null
    });
    
    this.physicsWorld.world.addBody(this.body);
    console.log(`Created trimesh collider for GLTF platform: ${this.data.id} (${vertices.length/3} vertices)`);
  }
  
  _createConvexCollider() {
    // Extract vertices for convex hull
    const vertices = [];
    
    this.gltfScene.traverse(child => {
      if (child.isMesh) {
        const positionAttr = child.geometry.attributes.position;
        child.updateMatrixWorld(true);
        
        for (let i = 0; i < positionAttr.count; i++) {
          const vertex = new THREE.Vector3(
            positionAttr.getX(i),
            positionAttr.getY(i),
            positionAttr.getZ(i)
          );
          vertex.applyMatrix4(child.matrixWorld);
          vertices.push(new CANNON.Vec3(vertex.x, vertex.y, vertex.z));
        }
      }
    });
    
    if (vertices.length === 0) {
      console.warn('No vertices found for convex hull, falling back to box');
      this._createBoxCollider();
      return;
    }
    
    try {
      const shape = new CANNON.ConvexPolyhedron({ vertices, faces: [] });
      
      this.body = new CANNON.Body({
        mass: 0,
        type: this.data.type === 'static' ? CANNON.Body.STATIC : CANNON.Body.KINEMATIC,
        shape: shape,
        position: new CANNON.Vec3(0, 0, 0),
        material: this.physicsWorld.materials?.[this.data.materialType || 'platform'] || null
      });
      
      this.physicsWorld.world.addBody(this.body);
      console.log(`Created convex collider for GLTF platform: ${this.data.id}`);
    } catch (error) {
      console.warn('Failed to create convex hull, falling back to box:', error);
      this._createBoxCollider();
    }
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
    if (this.mesh && this.body) {
      this.mesh.position.copy(this.body.position);
      this.mesh.quaternion.copy(this.body.quaternion);
    }
  }
  
  _updateMovingPlatform(delta) {
    const anim = this.data.animation;
    if (!anim.path || anim.path.length < 2) return;
    
    const current = anim.path[this.animationState.currentWaypoint];
    const next = anim.path[(this.animationState.currentWaypoint + 1) % anim.path.length];
    
    // Calculate direction vector
    const direction = new CANNON.Vec3(
      next[0] - current[0],
      next[1] - current[1],
      next[2] - current[2]
    );
    
    const distance = direction.length();
    
    // Avoid division by zero
    if (distance < 0.01) {
      this.animationState.currentWaypoint = 
        (this.animationState.currentWaypoint + 1) % anim.path.length;
      this.body.velocity.set(0, 0, 0);
      return;
    }
    
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
    
    // Check if we reached the waypoint
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
      if (this.mesh) this.mesh.visible = true;
      if (this.body) this.body.collisionResponse = true;
    } else if (phase >= anim.disappearInterval && this.animationState.visible) {
      // Disappear
      this.animationState.visible = false;
      if (this.mesh) this.mesh.visible = false;
      if (this.body) this.body.collisionResponse = false;
    }
  }
  
  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          } else {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
      });
    }
    if (this.body) {
      this.physicsWorld.world.removeBody(this.body);
    }
  }
}
