import { HumanNpcBase } from './HumanNpcBase.js';

export class Women2 extends HumanNpcBase {
  constructor(scene, physicsWorld, options = {}) {
    const womanOptions = {
      speed: 1.5,
      health: 25,
      modelUrl: 'assets/npc/AnimatedWoman.glb',
      npcType: 'animated_woman_1',
      ...options
    };

    super(scene, physicsWorld, womanOptions);
    
    console.log(`🚶‍♀️ Animated Woman 1 created at position [${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}]`);
  }
}