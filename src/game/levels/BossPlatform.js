import * as THREE from 'three';
import * as CANNON from 'cannon-es';

/**
 * Boss platform built from primitives to ensure perfect 1:1 match
 * between visual mesh and physics body. Default size is 24x2x24.
 */
export class BossPlatform {
  /**
   * @param {Object} [options]
   * @param {[number, number, number]} [options.size=[24,2,24]] Width, Height, Depth
   * @param {{x:number,y:number,z:number}} [options.position={x:0,y:0,z:0}] Initial position
   * @param {number|string} [options.color=0x555555] Mesh material color
   * @param {Object} [options.materialProps] Extra MeshStandardMaterial props
   * @param {{ friction?: number, restitution?: number }} [options.physics] Physics material props
   */
  constructor(options = {}) {
    const {
      size = [50, 2, 50],
      position = { x: 0, y: 0, z: 0 },
      color = 0x555555,
      materialProps = {},
      physics: physicsOptions = {},
    } = options;

  const [width, height, depth] = size;

    // THREE: Visuals
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.1,
      roughness: 0.85,
      ...materialProps,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.position.set(position.x, position.y, position.z);

  // CANNON: Physics (KINEMATIC box with half-extents)
    const halfExtents = new CANNON.Vec3(width / 2, height / 2, depth / 2);
    const shape = new CANNON.Box(halfExtents);
  const body = new CANNON.Body({ mass: 0 });
  // Use KINEMATIC for consistency with other static world bodies
  body.type = CANNON.Body.KINEMATIC;
    body.addShape(shape);
    body.position.set(position.x, position.y, position.z);

    if (physicsOptions) {
      if (typeof physicsOptions.friction === 'number') {
        body.material = body.material || new CANNON.Material('bossPlatform');
        body.material.friction = physicsOptions.friction;
      }
      if (typeof physicsOptions.restitution === 'number') {
        body.material = body.material || new CANNON.Material('bossPlatform');
        body.material.restitution = physicsOptions.restitution;
      }
    }

    this.mesh = mesh;
    this.body = body;
    this._geometry = geometry;
    this._material = material;
    this.size = [width, height, depth];
  }

  /**
   * Add platform to scene and world
   * @param {THREE.Scene} scene
   * @param {CANNON.World} world
   */
  addTo(scene, world) {
    if (scene && this.mesh && !this.mesh.parent) scene.add(this.mesh);
    if (world && this.body) {
      // If a PhysicsWorld wrapper is provided, apply its platform material for correct contacts
      if (!this.body.material && world.materials && world.materials.platform) {
        this.body.material = world.materials.platform;
      }
      // Tag body for identification (player wall-slide and filters)
      if (!this.body.userData) this.body.userData = {};
      this.body.userData.type = 'static';
      this.body.userData.kind = 'bossPlatform';

      if (!this._isBodyInWorld(world, this.body)) {
        // Support both raw CANNON.World and PhysicsWorld wrapper
        if (typeof world.addBody === 'function') {
          world.addBody(this.body);
        } else if (world.world && typeof world.world.addBody === 'function') {
          world.world.addBody(this.body);
        }
      }
    }
  }

  /**
   * Set position for both mesh and body
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  setPosition(x, y, z) {
    if (this.mesh) this.mesh.position.set(x, y, z);
    if (this.body) this.body.position.set(x, y, z);
  }

  /**
   * Apply quaternion rotation to both mesh and body
   * @param {THREE.Quaternion|{x:number,y:number,z:number,w:number}} q
   */
  setQuaternion(q) {
    const { x, y, z, w } = q;
    if (this.mesh) this.mesh.quaternion.set(x, y, z, w);
    if (this.body) this.body.quaternion.set(x, y, z, w);
  }

  /** Sync mesh transform from physics body (rarely needed for static) */
  syncFromPhysics() {
    if (!this.mesh || !this.body) return;
    this.mesh.position.set(this.body.position.x, this.body.position.y, this.body.position.z);
    this.mesh.quaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
  }

  /**
   * Dispose resources and optionally remove from scene/world
   * @param {THREE.Scene} [scene]
   * @param {CANNON.World} [world]
   */
  dispose(scene, world) {
    if (scene && this.mesh && this.mesh.parent === scene) scene.remove(this.mesh);
    if (world && this.body) {
      const inWorld = this._isBodyInWorld(world, this.body);
      if (inWorld) {
        if (typeof world.removeBody === 'function') {
          world.removeBody(this.body);
        } else if (world.world && typeof world.world.removeBody === 'function') {
          world.world.removeBody(this.body);
        }
      }
    }

    if (this._geometry) this._geometry.dispose();
    if (this._material) this._material.dispose();

    this.mesh = null;
    this.body = null;
    this._geometry = null;
    this._material = null;
  }

  /**
   * Check if a body is already in the world
   * @param {CANNON.World} world
   * @param {CANNON.Body} body
   * @returns {boolean}
   */
  _isBodyInWorld(world, body) {
    if (!world) return false;
    // Handle PhysicsWorld wrapper vs raw CANNON.World
    const w = world.world && Array.isArray(world.world.bodies) ? world.world : world;
    if (!w.bodies) return false;
    return w.bodies.indexOf(body) !== -1;
  }

  /** Get the world-space Y of the walkable top surface */
  getTopY() {
    if (this.body && this.body.position) {
      return this.body.position.y + (this.size ? this.size[1] / 2 : 0);
    }
    if (this.mesh && this.mesh.position) {
      return this.mesh.position.y + (this.size ? this.size[1] / 2 : 0);
    }
    return 0;
  }
}


