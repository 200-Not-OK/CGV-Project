import { HumanNpcBase } from './HumanNpcBase.js';

export class Woman3 extends HumanNpcBase {
  constructor(scene, physicsWorld, options = {}) {
    const womanOptions = {
      speed: 1.4,
      health: 25,
      modelUrl: 'assets/npc/AnimatedWoman1.glb',
      npcType: 'animated_woman_2',
      ...options
    };

    super(scene, physicsWorld, womanOptions);
    
    console.log(`🚶‍♀️ Animated Woman 2 created at position [${this.mesh.position.x}, ${this.mesh.position.y}, ${this.mesh.position.z}]`);
  }
}