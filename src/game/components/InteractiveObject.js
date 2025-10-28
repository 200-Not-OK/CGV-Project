import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base class for all interactive objects in the game
 * Provides common functionality for physics, visuals, and interaction logic
 */
export class InteractiveObject {
  constructor(data, scene, physicsWorld) {
    this.data = data;
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    
    // Core components
    this.mesh = null;           // Three.js visual
    this.body = null;           // Cannon.js physics
    this.interactive = true;    // Can be interacted with
    
    // State management
    this.state = 'idle';        // idle, activated, triggered, cooldown
    this.activationTime = 0;
    this.cooldownDuration = data.cooldown || 0;
    
    // Interaction callbacks (set by game logic)
    this.onActivate = null;     // Function called when activated
    this.onDeactivate = null;   // Function called when deactivated
    this.onTrigger = null;      // Function called on trigger events
    
    // GLTF support
    this.gltfUrl = data.gltfUrl || null;
    this.gltfScene = null;
  }
  
  async create() {
    if (this.gltfUrl) {
      await this._loadGLTF();
    } else {
      this._createPrimitive();
    }
    this._createPhysics();
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
          
          // Setup materials
          gltf.scene.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          this.scene.add(this.mesh);
          resolve();
        },
        undefined,
        (error) => {
          console.warn('Failed to load GLTF for interactive object:', error);
          // Fallback to primitive
          this._createPrimitive();
          resolve();
        }
      );
    });
  }
  
  _createPrimitive() {
    // Override in subclasses for procedural geometry
    console.warn('InteractiveObject._createPrimitive() not implemented in subclass');
  }
  
  _createPhysics() {
    // Override in subclasses for physics bodies
    console.warn('InteractiveObject._createPhysics() not implemented in subclass');
  }
  
  update(delta) {
    // Handle cooldown
    if (this.state === 'cooldown') {
      this.activationTime += delta;
      if (this.activationTime >= this.cooldownDuration) {
        this.state = 'idle';
        this.activationTime = 0;
      }
    }
    
    // Override in subclasses for specific behavior
  }
  
  activate() {
    if (this.state === 'cooldown') return;
    
    this.state = 'activated';
    this.activationTime = 0;
    
    if (this.onActivate) {
      this.onActivate(this);
    }
    
    // Enter cooldown if specified
    if (this.cooldownDuration > 0) {
      this.state = 'cooldown';
    }
  }
  
  deactivate() {
    this.state = 'idle';
    this.activationTime = 0;
    
    if (this.onDeactivate) {
      this.onDeactivate(this);
    }
  }
  
  trigger(entity) {
    if (this.onTrigger) {
      this.onTrigger(this, entity);
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
