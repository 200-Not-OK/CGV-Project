import { HumanNpcBase } from './HumanNpcBase.js';

export class Worker extends HumanNpcBase {
  constructor(scene, physicsWorld, options = {}) {
    const workerOptions = {
      speed: 1.2, // Slower, carrying tools
      health: 40, // Sturdier worker
      size: [0.7, 1.8, 0.7],
      colliderSize: [0.7, 1.8, 0.7],
      modelUrl: 'assets/npc/Worker.glb',
      npcType: 'worker',
      ...options
    };

    super(scene, physicsWorld, workerOptions);
    
    console.log(`👷 Worker created at position [${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}]`);
  }
}