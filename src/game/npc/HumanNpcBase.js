import * as THREE from 'three';
import { NpcBase } from './NpcBase.js';

export class HumanNpcBase extends NpcBase {
  constructor(scene, physicsWorld, options = {}) {
    // Human-specific defaults
    const humanOptions = {
      speed: options.speed ?? 1.5,
      health: options.health ?? 30,
      size: [0.6, 1.8, 0.6], // Typical human size
      colliderSize: [0.6, 1.8, 0.6],
      ...options
    };

    super(scene, physicsWorld, humanOptions);

    // Human NPC properties
    this.npcType = options.npcType || 'human';
    
    // Patrol behavior - handle the data format from levelData
    this.patrolPoints = this._normalizePatrolPoints(options.patrolPoints || []);
    this.currentPatrolIndex = options.currentPatrolIndex || 0;
    this.patrolSpeed = options.speed ? options.speed * 0.8 : 1.2;
    this.idleDuration = options.waitTime || 2; // Use waitTime from data or default to 2 seconds
    this.idleTimer = 0;
    this.isIdle = !(options.isMoving ?? true); // Use isMoving from data
    this.patrolBehavior = options.patrolBehavior || 'loop';
    
    // Store initial position
    this.initialPosition = options.position ? 
      new THREE.Vector3(options.position[0], options.position[1], options.position[2]) :
      new THREE.Vector3(0, 0.5, 0);
    
    // Generate patrol points if none provided
    if (this.patrolPoints.length === 0) {
      this._generatePatrolPoints();
    }
    
    console.log(`🧍 ${this.constructor.name} created with ${this.patrolPoints.length} patrol points, speed: ${this.patrolSpeed}`);
  }

  // NEW METHOD: Normalize patrol points to handle both [x,y,z] and [x,y,z,waitTime] formats
  _normalizePatrolPoints(points) {
    return points.map(point => {
      if (point.length >= 3) {
        // Return just [x, y, z] - ignore any extra values
        return [point[0], point[1], point[2]];
      }
      return point;
    });
  }

  _generatePatrolPoints() {
    // Generate 2-4 patrol points around initial position
    const numPoints = 2 + Math.floor(Math.random() * 3);
    const patrolRadius = 3 + Math.random() * 4;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const x = this.initialPosition.x + Math.cos(angle) * patrolRadius;
      const z = this.initialPosition.z + Math.sin(angle) * patrolRadius;
      
      this.patrolPoints.push([x, this.initialPosition.y, z]);
    }
    
    console.log(`🧍 Generated ${this.patrolPoints.length} patrol points for ${this.constructor.name}`);
  }

  updatePatrolBehavior(delta) {
    if (this.patrolPoints.length === 0 || !this.onGround) {
      if (this.patrolPoints.length === 0) {
        console.warn(`🧍 ${this.constructor.name} has no patrol points`);
      }
      return;
    }
    
    if (this.isIdle) {
      this.idleTimer += delta;
      this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
      
      if (this.idleTimer >= this.idleDuration) {
        this.isIdle = false;
        this.idleTimer = 0;
        
        // Move to next patrol point based on behavior type
        if (this.patrolBehavior === 'loop') {
          this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        } else if (this.patrolBehavior === 'pingpong') {
          // TODO: Implement pingpong behavior
          this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        } else {
          // Default to loop
          this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        }
        
        console.log(`🧍 ${this.constructor.name} moving to patrol point ${this.currentPatrolIndex}`);
      }
      return;
    }
    
    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    const targetPos = new THREE.Vector3(targetPoint[0], targetPoint[1], targetPoint[2]);
    const currentPos = this.mesh.position;
    
    const direction = new THREE.Vector3().subVectors(targetPos, currentPos);
    const distanceToTarget = direction.length();
    
    if (distanceToTarget < 1.5) { // Increased arrival distance for higher speeds
      // Reached patrol point, go idle
      this.isIdle = true;
      this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
      console.log(`🧍 ${this.constructor.name} reached patrol point ${this.currentPatrolIndex}, idling for ${this.idleDuration}s`);
    } else {
      // Move toward patrol point
      direction.y = 0;
      if (direction.length() > 0.01) {
        direction.normalize();
        this.setDesiredMovement(direction.multiplyScalar(this.patrolSpeed));
        
        // Debug logging - less frequent for high-speed NPCs
        if (Math.random() < 0.005) {
          console.log(`🧍 ${this.constructor.name} moving to point ${this.currentPatrolIndex}, distance: ${distanceToTarget.toFixed(2)}, speed: ${this.patrolSpeed}`);
        }
      }
    }
  }

  // OVERRIDE THE UPDATE METHOD
  update(delta, player, platforms = []) {
    if (!this.alive || !this.body) return;
    
    // UPDATE ORDER IS CRITICAL:
    // 1. First update patrol behavior to set desired movement
    this.updatePatrolBehavior(delta);
    
    // 2. Then call base update which will use the desired movement we just set
    super.update(delta, player, platforms);
    
    // 3. Update animations based on current movement state
    this.updateAnimations();
  }

  updateAnimations() {
    if (!this.mixer) return;
    
    // Check if actually moving (not just wanting to move)
    const isMoving = this.body && 
      (Math.abs(this.body.velocity.x) > 0.1 || Math.abs(this.body.velocity.z) > 0.1);
    
    if (isMoving && this.actions.walk) {
      this._playAction(this.actions.walk, 0.2, true);
    } else if (this.actions.idle) {
      this._playAction(this.actions.idle, 0.2, true);
    }
  }

  // Override takeDamage to add human-specific reactions
  takeDamage(amount) {
    const remainingHealth = super.takeDamage(amount);
    
    if (this.alive && this.health < this.maxHealth * 0.5) {
      console.log(`😫 ${this.constructor.name} is badly hurt!`);
    }
    
    return remainingHealth;
  }
}