import * as THREE from 'three';
import { YellowBot } from './npc/YellowBot.js';
import { OtherBot } from './npc/OtherBot.js';


export class NpcManager {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.npcs = [];
    this.typeRegistry = {
        yellow_bot: YellowBot,
        other_bot: OtherBot,
      // register more types here
    };
  }

  spawn(type, options = {}) {
    const Cls = this.typeRegistry[type];
    if (!Cls) throw new Error('Unknown NPC type: ' + type);
    const npc = new Cls(this.scene, this.physicsWorld, options);
    if (options.position) npc.setPosition(new THREE.Vector3(...options.position));
    this.npcs.push(npc);
    return npc;
  }

  update(delta, player, platforms = []) {
    for (const npc of this.npcs) npc.update(delta, player, platforms);
  }

  dispose() {
    console.log(`🧹 Disposing ${this.npcs.length} NPCs`);
    for (const npc of this.npcs) {
      if (npc.dispose) {
        npc.dispose();
      }
    }
    this.npcs = [];
    console.log('🧹 NPC manager cleared');
  }

}
