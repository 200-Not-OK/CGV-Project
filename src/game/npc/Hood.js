import { HumanNpcBase } from './HumanNpcBase.js';

export class Hood extends HumanNpcBase {
  constructor(scene, physicsWorld, options = {}) {
    const hoodOptions = {
      speed: 1.3, // Casual stroll
      health: 30,
      modelUrl: 'assets/npc/HoodieCharacter.glb',
      npcType: 'hoodie',
      ...options
    };

    super(scene, physicsWorld, hoodOptions);
    
    console.log(`🧥 Hoodie Character created at position [${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}]`);
  }
}