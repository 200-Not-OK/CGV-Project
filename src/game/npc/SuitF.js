import { HumanNpcBase } from './HumanNpcBase.js';

export class SuitF extends HumanNpcBase {
  constructor(scene, physicsWorld, options = {}) {
    const suitOptions = {
      speed: 1.6, // Business-like pace
      health: 30,
      modelUrl: 'assets/npc/Suit.glb',
      npcType: 'suit_female',
      ...options
    };

    super(scene, physicsWorld, suitOptions);
    
    console.log(`👩‍💼 Female Business Suit created at position [${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}]`);
  }
}