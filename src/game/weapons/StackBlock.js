import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class StackBlock {
  constructor(position, scene, physicsWorld, player) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.player = player;
    this.position = position;
    
    // Block dimensions
    this.width = 1.0;
    this.height = 0.5;
    this.depth = 1.0;
    
    // Visual mesh
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      metalness: 0.6,
      roughness: 0.4,
      emissive: 0x00aa44,
      emissiveIntensity: 0.2
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.copy(position);
    this.scene.add(this.mesh);
    
    // Physics body - static so player can stand on it
    const shape = new CANNON.Box(new CANNON.Vec3(this.width / 2, this.height / 2, this.depth / 2));
    this.body = new CANNON.Body({
      mass: 0, // Static - won't move
      shape: shape,
      material: this.physicsWorld.groundMaterial,
      position: new CANNON.Vec3(position.x, position.y, position.z)
    });
    
    // Mark as ground surface so player detects it
    this.body.userData = {
      type: 'static',
      isStackBlock: true
    };
    
    this.physicsWorld.world.addBody(this.body);
    
    // Lifetime tracking
    this.createdAt = Date.now();
    this.isPopping = false;
  }
  
  pop(duration = 0.3) {
    if (this.isPopping) return;
    this.isPopping = true;
    
    // Animate pop effect
    const startScale = this.mesh.scale.clone();
    const startTime = Date.now();
    
    const animatePop = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Scale down and fade out
      const scale = 1 - progress;
      this.mesh.scale.set(scale, scale, scale);
      this.mesh.material.opacity = 1 - progress;
      this.mesh.material.transparent = true;
      
      if (progress < 1) {
        requestAnimationFrame(animatePop);
      } else {
        this.destroy();
      }
    };
    
    animatePop();
  }
  
  destroy() {
    this.scene.remove(this.mesh);
    this.physicsWorld.world.removeBody(this.body);
    this.mesh.geometry?.dispose();
    this.mesh.material?.dispose();
  }
  
  update(delta) {
    // Sync mesh with physics body (shouldn't move, but keep in sync)
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}
