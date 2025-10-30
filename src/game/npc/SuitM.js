import { HumanNpcBase } from './HumanNpcBase.js';

export class SuitM extends HumanNpcBase {
  constructor(scene, physicsWorld, options = {}) {
    const suitOptions = {
      speed: 1.7, // Confident business walk
      health: 35,
      modelUrl: 'assets/npc/BusinessMan.glb',
      npcType: 'suit_male',
      ...options
    };

    super(scene, physicsWorld, suitOptions);
    
    console.log(`👨‍💼 Business Man created at position [${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}]`);
  }
}