import { HumanNpcBase } from './HumanNpcBase.js';

export class Woman extends HumanNpcBase {
  constructor(scene, physicsWorld, options = {}) {
    const womanOptions = {
      speed: 1.4,
      health: 25,
      modelUrl: 'assets/npc/Woman.glb',
      npcType: 'woman',
      ...options
    };

    super(scene, physicsWorld, womanOptions);
    
    console.log(`👩 Woman created at position [${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}]`);
  }
}