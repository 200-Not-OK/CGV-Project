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
      suitM: SuitM
      // You can register more types here as you create them
    };
    
    // Patrol system state
    this.patrolData = new Map(); // Maps NPC ID to patrol data
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
    
    const npc = new Cls(this.scene, this.physicsWorld, options);
    
    // Set initial position
    if (options.position) {
      npc.setPosition(new THREE.Vector3(...options.position));
    }
    
    // Set scale if provided
    if (options.scale) {
      npc.setScale(options.scale);
    }
    
    // Store NPC data for reference
    npc.userData = {
      id: options.id || `npc_${Date.now()}`,
      type: type,
      originalData: options
    };
    
    // Initialize patrol system if this NPC has patrol points
    if (options.patrolPoints && options.patrolPoints.length > 0) {
      this._initializePatrol(npc, options);
    }
    
    this.npcs.push(npc);
    return npc;
  }

  // Initialize patrol behavior for an NPC
  _initializePatrol(npc, npcData) {
    const patrolData = {
      points: npcData.patrolPoints.map(point => new THREE.Vector3(point[0], point[1], point[2])),
      currentPointIndex: 0,
      behavior: npcData.patrolBehavior || 'loop',
      speed: npcData.speed || 1.5,
      waitTime: npcData.waitTime || 0.5,
      waitTimer: 0,
      isMoving: true,
      forward: true // For ping-pong behavior
    };
    
    this.patrolData.set(npc.userData.id, patrolData);
    
    console.log(`Initialized patrol for NPC ${npc.userData.id}:`, {
      points: patrolData.points.length,
      behavior: patrolData.behavior,
      speed: patrolData.speed
    });
  }

  update(delta, player, platforms = []) {
    for (const npc of this.npcs) {
      // Update NPC base behavior
      npc.update(delta, player, platforms);
      
      // Update patrol behavior if this NPC has patrol points
      this._updatePatrolBehavior(npc, delta);
    }
  }

  _updatePatrolBehavior(npc, delta) {
    const patrolData = this.patrolData.get(npc.userData.id);
    if (!patrolData || patrolData.points.length < 2) return;
    
    if (patrolData.isMoving) {
      // Move towards current patrol point
      const targetPoint = patrolData.points[patrolData.currentPointIndex];
      const currentPos = npc.getPosition();
      
      // Calculate direction to target
      const direction = new THREE.Vector3()
        .subVectors(targetPoint, currentPos)
        .normalize();
      
      // Move NPC
      const moveDistance = patrolData.speed * delta;
      const newPosition = currentPos.clone().add(direction.multiplyScalar(moveDistance));
      npc.setPosition(newPosition);
      
      // Rotate NPC to face movement direction (optional)
      if (direction.length() > 0.1) {
        npc.faceDirection(direction);
      }
      
      // Check if reached the point
      const distanceToTarget = currentPos.distanceTo(targetPoint);
      if (distanceToTarget < 0.5) { // Close enough to consider reached
        patrolData.isMoving = false;
        patrolData.waitTimer = patrolData.waitTime;
        
        // Move to next point based on behavior
        this._advanceToNextPoint(patrolData);
      }
    } else {
      // Waiting at point
      patrolData.waitTimer -= delta;
      if (patrolData.waitTimer <= 0) {
        patrolData.isMoving = true;
      }
    }
  }

  _advanceToNextPoint(patrolData) {
    const totalPoints = patrolData.points.length;
    
    switch (patrolData.behavior) {
      case 'loop':
        // Move to next point, loop back to start
        patrolData.currentPointIndex = (patrolData.currentPointIndex + 1) % totalPoints;
        break;
        
      case 'pingpong':
        // Move back and forth along the path
        if (patrolData.forward) {
          if (patrolData.currentPointIndex >= totalPoints - 1) {
            patrolData.forward = false;
            patrolData.currentPointIndex--;
          } else {
            patrolData.currentPointIndex++;
          }
        } else {
          if (patrolData.currentPointIndex <= 0) {
            patrolData.forward = true;
            patrolData.currentPointIndex++;
          } else {
            patrolData.currentPointIndex--;
          }
        }
        break;
        
      case 'once':
        // Stop at the last point
        if (patrolData.currentPointIndex < totalPoints - 1) {
          patrolData.currentPointIndex++;
        } else {
          // Stay at last point indefinitely
          patrolData.isMoving = false;
        }
        break;
        
      case 'random':
        // Move to a random point (not current point)
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * totalPoints);
        } while (newIndex === patrolData.currentPointIndex && totalPoints > 1);
        
        patrolData.currentPointIndex = newIndex;
        break;
        
      default:
        // Default to loop behavior
        patrolData.currentPointIndex = (patrolData.currentPointIndex + 1) % totalPoints;
        break;
    }
    
    console.log(`NPC moving to point ${patrolData.currentPointIndex}, behavior: ${patrolData.behavior}`);
  }

  // Get all NPCs (useful for UI or debugging)
  getNpcs() {
    return this.npcs;
  }

  // Get a specific NPC by ID
  getNpcById(id) {
    return this.npcs.find(npc => npc.userData.id === id);
  }

  // Remove an NPC
  removeNpc(npc) {
    const index = this.npcs.indexOf(npc);
    if (index > -1) {
      // Remove patrol data
      if (npc.userData.id) {
        this.patrolData.delete(npc.userData.id);
      }
      
      // Remove from scene and physics
      if (npc.dispose) npc.dispose();
      
      this.npcs.splice(index, 1);
    }
  }

  // Clear all NPCs
  clear() {
    for (const npc of this.npcs) {
      if (npc.dispose) npc.dispose();
    }
    this.npcs = [];
    this.patrolData.clear();
  }

  dispose() {
    this.clear();
  }
}