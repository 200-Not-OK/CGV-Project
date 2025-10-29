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
    
    // Patrol behavior
    this.patrolPoints = options.patrolPoints || [];
    this.currentPatrolIndex = 0;
    this.patrolSpeed = this.speed * 0.5; // Slower when patrolling
    this.idleDuration = 3; // seconds to idle at patrol point
    this.idleTimer = 0;
    this.isIdle = false;
    
    // Store initial position for patrol generation if no points provided
    this.initialPosition = options.position ? 
      new THREE.Vector3(options.position[0], options.position[1], options.position[2]) :
      new THREE.Vector3(0, 0.5, 0);
    
    // Generate patrol points if none provided
    if (this.patrolPoints.length === 0) {
      this._generatePatrolPoints();
    }
    
    console.log(`🧍 ${this.constructor.name} created with ${this.patrolPoints.length} patrol points`);
  }

  _generatePatrolPoints() {
    // Generate 2-4 patrol points around initial position
    const numPoints = 2 + Math.floor(Math.random() * 3);
    const patrolRadius = 3 + Math.random() * 5; // 3-8 unit radius
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const x = this.initialPosition.x + Math.cos(angle) * patrolRadius;
      const z = this.initialPosition.z + Math.sin(angle) * patrolRadius;
      
      this.patrolPoints.push([x, this.initialPosition.y, z]);
    }
    
    console.log(`🧍 Generated ${this.patrolPoints.length} patrol points for ${this.constructor.name}`);
  }

  updatePatrolBehavior(delta) {
    if (this.patrolPoints.length === 0 || !this.onGround) return;
    
    if (this.isIdle) {
      this.idleTimer += delta;
      this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
      
      if (this.idleTimer >= this.idleDuration) {
        this.isIdle = false;
        this.idleTimer = 0;
        this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
      }
      return;
    }
    
    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    const targetPos = new THREE.Vector3(targetPoint[0], targetPoint[1], targetPoint[2]);
    const currentPos = this.mesh.position;
    
    const direction = new THREE.Vector3().subVectors(targetPos, currentPos);
    const distanceToTarget = direction.length();
    
    if (distanceToTarget < 1.0) {
      // Reached patrol point, go idle
      this.isIdle = true;
      this.setDesiredMovement(new THREE.Vector3(0, 0, 0));
    } else {
      // Move toward patrol point
      direction.y = 0;
      direction.normalize();
      this.setDesiredMovement(direction.multiplyScalar(this.patrolSpeed));
    }
  }

  update(delta, player, platforms = []) {
    if (!this.alive || !this.body) return;
    
    // Call base update for physics and health bar
    super.update(delta, player, platforms);
    
    // Update patrol behavior
    this.updatePatrolBehavior(delta);
    
    // Update animation based on movement
    this.updateAnimations();
  }

  updateAnimations() {
    if (!this.mixer) return;
    
    const isMoving = this._desiredMovement.lengthSq() > 0.01;
    
    if (isMoving && this.actions.walk) {
      this._playAction(this.actions.walk, 0.2, true);
    } else if (this.actions.idle) {
      this._playAction(this.actions.idle, 0.2, true);
    }
  }

  // Override takeDamage to add human-specific reactions
  takeDamage(amount) {
    const remainingHealth = super.takeDamage(amount);
    
    // Human NPCs might play a hurt animation or sound here
    if (this.alive && this.health < this.maxHealth * 0.5) {
      // Maybe change to a limping animation when badly hurt
      console.log(`😫 ${this.constructor.name} is badly hurt!`);
    }
    
    return remainingHealth;
  }
}