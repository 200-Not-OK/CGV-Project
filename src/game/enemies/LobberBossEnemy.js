import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EnemyBase } from './EnemyBase.js';

// A stationary boss that lobs projectiles (projectile logic can be added later).
// Uses a kinematic physics body so it's not pushed by other bodies.
export class LobberBossEnemy extends EnemyBase {
  constructor(scene, physicsWorld, options = {}) {
    const bossOptions = {
      speed: options.speed ?? 0, // stationary by default
  health: options.health ?? 500,
  // Visually larger baseline; actual mesh scale still controlled by options.scale
  size: options.size ?? [3.5, 4.2, 3.5],
  // Collider dimensions: base size (14.130, 6.520, 13.355) / scale 3.5 = (4.037, 1.863, 3.816)
  colliderSize: options.colliderSize ?? [4.037, 1.863, 3.816],
      modelUrl: options.modelUrl || 'assets/enemies/lobber_boss/lobber.gltf',
      scale: options.scale ?? 1.0,
      ...options
    };

    super(scene, physicsWorld, bossOptions);

    this.enemyType = 'lobber_boss';
    this.isBoss = true;

    // Behavior ranges
    this.detectRange = options.detectRange ?? 20.0;
    this.attackRange = options.attackRange ?? 18.0;
    this.attackCooldown = options.attackCooldown ?? 3000; // ms
    this.lastAttackTime = 0;

    // Animation slots matching provided names
    this.animations = {
      idle: null,
      move: null,
      attack: null,
      die1: null,
      die2: null,
      die3: null
    };

    // Always show health bar for bosses
    this.healthBarAlwaysVisible = true;
  }

  // Override: create a kinematic body
_createPhysicsBody() {
  if (this.body) {
    this.physicsWorld.removeBody(this.body);
    this.body = null;
  }

  // Calculate scaled collider size
  const baseSize = this.colliderSize || [4.037, 1.863, 3.816];
  const scale = this.modelScale || 1.0;
  
  const size = [
    baseSize[0] * scale,
    baseSize[1] * scale, 
    baseSize[2] * scale
  ];

  // Create box shape with half-extents (CANNON.Box uses half-extents)
  const shape = new CANNON.Box(new CANNON.Vec3(size[0] / 2, size[1] / 2, size[2] / 2));
  
  // Offset shape upward by half-height so bottom aligns with body position
  // This makes the collider bottom-aligned instead of center-aligned
  shape.offset = new CANNON.Vec3(0, size[1] / 2, 0);

  const body = new CANNON.Body({
    mass: 0,
    type: CANNON.Body.KINEMATIC,
    material: this.physicsWorld.materials.enemy
  });
  body.addShape(shape);
  body.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
  body.quaternion.set(0, 0, 0, 1);
  body.fixedRotation = true;
  body.updateMassProperties();
  body.allowSleep = false;

  body.userData = {
    type: 'enemy',
    isEnemy: true,
    isBoss: true,
    enemyType: this.enemyType
  };

  this.physicsWorld.addBody(body);
  this.body = body;
}

  // Show larger health bar for boss
  _createHealthBar() {
    const width = 2.8;
    const height = 0.28;

    this.healthBarGroup = new THREE.Group();
    this.healthBarGroup.position.y = (this.size?.[1] || 3.0) + 1.2;
    this.healthBarGroup.visible = true;
    this.healthBarVisible = true;

    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
    );
    this.healthBarGroup.add(bg);

    this.healthBarFill = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.94, height * 0.7),
      new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
    );
    this.healthBarFill.position.z = 0.001;
    this.healthBarGroup.add(this.healthBarFill);

    this.mesh.add(this.healthBarGroup);
  }

  // Map animations by exact names provided: attack, die1, die2, die3, idle, move
  _loadModel(url) {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      while (this.mesh.children.length > 0) this.mesh.remove(this.mesh.children[0]);

      // Center model around origin and keep feet on ground
      try {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        gltf.scene.position.sub(center);
        gltf.scene.position.y += size.y / 2;
      } catch {}

      // Scale
      if (this.modelScale && this.modelScale !== 1) {
        gltf.scene.scale.setScalar(this.modelScale);
      }

      this.mesh.add(gltf.scene);

      // Animations
      if (gltf.animations && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(gltf.scene);
        const byName = (name) => gltf.animations.find(a => a.name && a.name.toLowerCase() === name.toLowerCase());

        const names = ['idle','move','attack','die1','die2','die3'];
        names.forEach(n => {
          const clip = byName(n);
          if (clip) {
            const act = this.mixer.clipAction(clip);
            this.animations[n] = act;
            if (n === 'idle') this.actions.idle = act;
            if (n === 'move') { this.actions.walk = act; this.actions.run = act; }
            if (n === 'attack') this.actions.attack = act;
          }
        });

        // Start idle by default
        if (this.animations.idle) {
          this.animations.idle.play();
          this.currentAction = this.animations.idle;
        }
      }

      // Build boss health bar after model
      this._createHealthBar();
    }, undefined, (err) => console.error('❌ LobberBoss model load failed:', err));
  }

  update(delta, player) {
    if (!this.alive || !this.body) return;

    // Let EnemyBase handle basic sync/animation/damping, but avoid trying to move kinematic via velocity
    const savedSpeed = this.speed;
    this.speed = 0; // prevent base from writing velocities for kinematic
    super.update(delta, player);
    this.speed = savedSpeed;

    // Face the player slowly
    if (player && player.mesh) {
      const dir = new THREE.Vector3().subVectors(player.mesh.position, this.mesh.position);
      dir.y = 0;
      if (dir.lengthSq() > 0.001) {
        const targetY = Math.atan2(dir.x, dir.z);
        const cur = this.mesh.rotation.y;
        let diff = targetY - cur;
        diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
        this.mesh.rotation.y += diff * 0.1;
        // sync body orientation
        if (this.body) {
          const e = new CANNON.Vec3(0, this.mesh.rotation.y, 0);
          this.body.quaternion.setFromEuler(e.x, e.y, e.z);
        }
      }
    }

    // Simple attack cadence: if player within range and cooldown ready, play attack
    const now = Date.now();
    if (player && player.mesh) {
      const d = this.mesh.position.distanceTo(player.mesh.position);
      if (d <= this.attackRange && now - this.lastAttackTime >= this.attackCooldown) {
        this._playAttackOnce();
        this.lastAttackTime = now;
      }
    }

    // Update animation mixer
    if (this.mixer) this.mixer.update(delta);
  }

  _playAttackOnce() {
    if (!this.animations.attack) return;
    try {
      if (this.currentAction && this.currentAction !== this.animations.attack) {
        this.currentAction.crossFadeTo(this.animations.attack, 0.2, false);
      }
      const act = this.animations.attack;
      act.reset();
      act.setLoop(THREE.LoopOnce);
      act.clampWhenFinished = true;
      act.play();
      this.currentAction = act;

      // After attack ends, return to idle/move
      const duration = (act._clip?.duration || 1.5) * 1000;
      setTimeout(() => {
        if (!this.alive) return;
        const fallback = this.animations.idle || this.animations.move;
        if (fallback) {
          fallback.reset();
          fallback.setLoop(THREE.LoopRepeat);
          fallback.play();
          this.currentAction = fallback;
        }
      }, duration);
    } catch {}
  }

  // Override onDeath to play one of the death animations
  onDeath() {
    if (!this.alive) return;
    this.alive = false;

    // Play any available death animation
    const choices = [this.animations.die1, this.animations.die2, this.animations.die3].filter(Boolean);
    const pick = choices.length ? choices[Math.floor(Math.random() * choices.length)] : null;

    if (pick) {
      try {
        if (this.currentAction && this.currentAction !== pick) {
          this.currentAction.crossFadeTo(pick, 0.25, false);
        }
        pick.reset();
        pick.setLoop(THREE.LoopOnce);
        pick.clampWhenFinished = true;
        pick.play();
        this.currentAction = pick;
      } catch {}
    }

    // Hide health bar
    if (this.healthBarGroup) {
      this.healthBarGroup.visible = false;
      this.healthBarVisible = false;
    }

    // Keep the mesh for the death pose; remove physics
    if (this.body) {
      this.physicsWorld.removeBody(this.body);
      this.body = null;
    }

    // Dispatch boss defeat event for game flow
    try {
      window.dispatchEvent(new CustomEvent('boss:defeated', { detail: { type: 'lobber_boss' } }));
    } catch {}
  }
}
