import * as THREE from 'three';
import { YellowBot } from './npc/YellowBot.js';
import { OtherBot } from './npc/OtherBot.js';
import { Punk } from './npc/Punk.js';
import {Worker} from './npc/Worker.js';
import {Hood} from './npc/Hood.js';
import {Woman} from './npc/Woman.js';
import {Woman3} from './npc/Woman3.js';
import {Women2} from './npc/Women2.js';
import {SuitF} from './npc/SuitF.js';
import {SuitM} from './npc/SuitM.js';
import {casual} from './npc/casual.js';

export class NpcManager {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.npcs = [];
    this.typeRegistry = {
      yellow_bot: YellowBot,
      other_bot: OtherBot,
      punk: Punk,
      Worker: Worker,
      hood: Hood,
      woman: Woman,
      woman3: Woman3,
      womans2: Women2,
      suitF: SuitF,
      suitM: SuitM,
      casual: casual
      
    };
    
    // REMOVED: Patrol system - let NPCs handle their own movement
  }

  // Load NPCs from level data (from editor)
  loadFromLevelData(levelData) {
    this.clear(); // Clear existing NPCs
    
    if (!levelData.npcs) return;
    
    levelData.npcs.forEach(npcData => {
      this.spawn(npcData.type, npcData);
    });
    
    console.log(`Loaded ${this.npcs.length} NPCs from level data`);
  }

  spawn(type, options = {}) {
    const Cls = this.typeRegistry[type];
    if (!Cls) {
      console.warn('Unknown NPC type:', type);
      return null;
    }
    
    // Pass ALL options to the NPC constructor - let the NPC handle patrol behavior
    const npc = new Cls(this.scene, this.physicsWorld, options);
    
    // Set initial position if provided
    if (options.position) {
      npc.setPosition(new THREE.Vector3(...options.position));
    }
    
    // Store NPC data for reference
    npc.userData = {
      id: options.id || `npc_${Date.now()}`,
      type: type,
      originalData: options
    };
    
    this.npcs.push(npc);
    
    console.log(`🧍 Spawned ${type} at [${options.position?.[0]?.toFixed(2) || 0}, ${options.position?.[1]?.toFixed(2) || 0}, ${options.position?.[2]?.toFixed(2) || 0}] with ${options.patrolPoints?.length || 0} patrol points`);
    
    return npc;
  }

  update(delta, player, platforms = []) {
    for (const npc of this.npcs) {
      // Let the NPC handle its own update including patrol behavior
      npc.update(delta, player, platforms);
      
      // Debug: Log NPC movement occasionally
      if (Math.random() < 0.001) { // ~1% chance per frame
        this._debugLogNpcState(npc);
      }
    }
  }

  // Debug method to log NPC state
  _debugLogNpcState(npc) {
    if (!npc.body) return;
    
    const velocity = npc.body.velocity;
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
    
    console.log(`🧍 ${npc.constructor.name}:`, {
      position: `[${npc.mesh.position.x.toFixed(2)}, ${npc.mesh.position.y.toFixed(2)}, ${npc.mesh.position.z.toFixed(2)}]`,
      speed: speed.toFixed(2),
      onGround: npc.onGround,
      alive: npc.alive
    });
  }

  // Get all NPCs (useful for UI or debugging)
  getNpcs() {
    return this.npcs;
  }

  // Get a specific NPC by ID
  getNpcById(id) {
    return this.npcs.find(npc => npc.userData.id === id);
  }

  // Get NPCs by type
  getNpcsByType(type) {
    return this.npcs.filter(npc => npc.userData.type === type);
  }

  // Remove an NPC
  removeNpc(npc) {
    const index = this.npcs.indexOf(npc);
    if (index > -1) {
      // Remove from scene and physics
      if (npc.dispose) npc.dispose();
      
      this.npcs.splice(index, 1);
      console.log(`🧍 Removed NPC ${npc.userData.id}`);
    }
  }

  // Clear all NPCs
  clear() {
    for (const npc of this.npcs) {
      if (npc.dispose) {
        npc.dispose();
      }
    }
    this.npcs = [];
    console.log('🧍 Cleared all NPCs');
  }

  // Damage all NPCs in radius (for area attacks)
  damageInRadius(center, radius, damage) {
    const centerVec = new THREE.Vector3(center[0], center[1], center[2]);
    let hitCount = 0;
    
    this.npcs.forEach(npc => {
      if (!npc.alive) return;
      
      const distance = npc.mesh.position.distanceTo(centerVec);
      if (distance <= radius) {
        npc.takeDamage(damage);
        hitCount++;
      }
    });
    
    return hitCount;
  }

  dispose() {
    this.clear();
  }
}