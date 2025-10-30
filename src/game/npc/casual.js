import { HumanNpcBase } from './HumanNpcBase.js';

export class casual extends HumanNpcBase {
  constructor(scene, physicsWorld, options = {}) {
    const punkOptions = {
      speed: 1.8, // Faster, more energetic
      health: 45, // Tougher
      modelUrl: 'assets/npc/CasualCharacter.glb',
      npcType: 'casual',
      ...options
    };

    super(scene, physicsWorld, punkOptions);
    
    console.log(`🤘 Punk created at position [${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}]`);
  }
}