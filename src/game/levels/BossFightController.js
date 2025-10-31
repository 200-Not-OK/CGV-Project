import * as CANNON from 'cannon-es';

/**
 * BossFightController
 * Drives the boss fight loop: RANGED → SLAM → VULNERABLE → RECOVER → RANGED.
 * Relies on external systems for animations and missile spawning.
 */
export class BossFightController {
  /**
   * @param {Object} opts
   * @param {THREE.Object3D} opts.bossMesh
   * @param {CANNON.Body} opts.bossBody
   * @param {{getPosition:()=>{x:number,y:number,z:number}}|THREE.Object3D} opts.playerRef
   * @param {{ scheduleWave:Function, update:Function }} opts.missileSpawner
   * @param {{ mesh: any, body: any }} opts.platformRef
   * @param {Object} [opts.timings]
   * @param {number} [opts.timings.slamWindup=1.0]
   * @param {number} [opts.timings.vulnerable=4.0]
   * @param {number} [opts.timings.recover=1.0]
   * @param {number} [opts.timings.waves=3]
   * @param {Object} [opts.scaling]
   * @param {number} [opts.scaling.baseMissiles=6]
   * @param {number} [opts.scaling.missilesScale=6]
   * @param {number} [opts.scaling.baseFireInterval=0.5]
   * @param {number} [opts.scaling.maxRateMultiplier=2.0]
   * @param {{ maxDamage?:number, thresholdToEnd?:number }} [opts.damageWindow]
   * @param {{ attack?:any, die1?:any, move?:any, stand?:any }} [opts.animationRefs]
   * @param {{ onStateChange?:(s:string)=>void, onSlam?:Function, onLand?:Function, onTakeoff?:Function }} [opts.events]
   */
  constructor(opts) {
    this.bossMesh = opts.bossMesh;
    this.bossBody = opts.bossBody;
    this.playerRef = opts.playerRef;
    this.missileSpawner = opts.missileSpawner;
    this.platformRef = opts.platformRef;
    this.animationRefs = opts.animationRefs || {};
    this.events = opts.events || {};

    const timings = opts.timings || {};
    this.timingSlamWindup = timings.slamWindup ?? 1.0;
    this.timingVulnerable = timings.vulnerable ?? 4.0;
    this.timingRecover = timings.recover ?? 1.0;
    this.wavesPerCycle = timings.waves ?? 3;

    const scaling = opts.scaling || {};
    this.baseMissiles = scaling.baseMissiles ?? 6;
    this.missilesScale = scaling.missilesScale ?? 6;
    this.baseFireInterval = scaling.baseFireInterval ?? 0.5;
    this.maxRateMultiplier = scaling.maxRateMultiplier ?? 2.0;

    this.damageWindow = opts.damageWindow || {};

    // Health tracking (hook into your health system as needed)
    this.maxHealth = 100;
    this.health = this.maxHealth;

    // State
    this.state = 'idle';
    this.elapsed = 0;
    this.wavesFiredThisCycle = 0;
    this.running = false;

    // Internal controls
    // Attack gating so missiles only fire tied to attack animation
    this.attackWindup = (opts.timings && typeof opts.timings.attackWindup === 'number') ? opts.timings.attackWindup : 0.4; // seconds
    this._attackTimer = 0;        // cooldown to next attack attempt
    this._attackInProgress = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._enterRanged();
  }

  stop() {
    this.running = false;
  }

  /**
   * External damage entry. Only applies during VULNERABLE.
   * @param {number} amount
   */
  onDamage(amount) {
    if (this.state !== 'vulnerable') return;
    this.health = Math.max(0, this.health - (amount || 0));
  }

  /** Force a phase (debug/helper) */
  forcePhase(state) {
    switch (state) {
      case 'ranged': this._enterRanged(); break;
      case 'slam': this._enterSlam(); break;
      case 'vulnerable': this._enterVulnerable(); break;
      case 'recover': this._enterRecover(); break;
      default: break;
    }
  }

  /**
   * Sync health from external boss entity
   * @param {number} currentHealth
   * @param {number} [maxHealth]
   */
  syncHealth(currentHealth, maxHealth) {
    if (typeof currentHealth === 'number') this.health = currentHealth;
    if (typeof maxHealth === 'number') this.maxHealth = maxHealth;
  }

  /**
   * Update loop tick
   * @param {number} dt seconds
   */
  update(dt) {
    if (!this.running) return;
    this.elapsed += dt;

    // Update animation mixer if boss has one
    if (this.bossMesh?.userData?.mixer && typeof this.bossMesh.userData.mixer.update === 'function') {
      this.bossMesh.userData.mixer.update(dt);
    }

    switch (this.state) {
      case 'ranged':
        this._updateRanged(dt);
        break;
      case 'slam':
        if (this.elapsed >= this.timingSlamWindup) {
          this._enterVulnerable();
        }
        break;
      case 'vulnerable':
        if (this.elapsed >= this.timingVulnerable) {
          this._enterRecover();
        }
        break;
      case 'recover':
        if (this.elapsed >= this.timingRecover) {
          this._enterRanged();
        }
        break;
      default:
        break;
    }
  }

  // ----- Internals -----

  _updateRanged(dt) {
    // Only allow a wave when triggering the attack animation
    const healthRatio = this.maxHealth > 0 ? this.health / this.maxHealth : 1.0;
    const rateMultiplier = 1.0 + (this.maxRateMultiplier - 1.0) * (1.0 - healthRatio);
    const fireInterval = this.baseFireInterval / rateMultiplier;

    this._attackTimer -= dt;
    if (!this._attackInProgress && this._attackTimer <= 0 && this.wavesFiredThisCycle < this.wavesPerCycle) {
      this._beginAttackCycle();
      this._attackTimer = fireInterval; // next attack window after current one starts
    }

    if (this.wavesFiredThisCycle >= this.wavesPerCycle && !this._attackInProgress) {
      this._enterSlam();
    }
  }

  _fireMissileWave() {
    const healthRatio = this.maxHealth > 0 ? this.health / this.maxHealth : 1.0;
    const count = this.baseMissiles + Math.floor((1.0 - healthRatio) * this.missilesScale);

    const playerPos = this._getPlayerXZ();
    const targetCenter = { x: playerPos.x, z: playerPos.z };

    if (this.missileSpawner && typeof this.missileSpawner.scheduleWave === 'function') {
      this.missileSpawner.scheduleWave({
        count,
        targetCenter,
        radius: 5,
        speed: 25,
        damage: 20,
        // Warnings appear after the attack windup so the visuals match the boss wind-up
        warningDelay: Math.max(0.2, this.attackWindup),
        impactDelay: 1.5,
      });
    }

    this.wavesFiredThisCycle += 1;
  }

  _beginAttackCycle() {
    this._attackInProgress = true;
    // Play attack animation first
    if (this.animationRefs && this.animationRefs.attack && typeof this.animationRefs.attack.play === 'function') {
      // Reset for consistent windup visuals
      this.animationRefs.attack.reset?.();
      this.animationRefs.attack.play();
    }
    // Schedule missiles associated with this attack
    this._fireMissileWave();
    // End attack after a short duration (approx animation length if unknown)
    // If we had clip duration we could derive it; using windup + small tail
    const approxAttackDuration = Math.max(0.6, this.attackWindup + 0.4);
    // Use a simple timer based on update() elapsed accumulation
    this._attackEndTime = (this._attackEndTime || 0) + approxAttackDuration; // not used directly; fallback below
    // Cheap approach: release the in-progress flag after a delay using a micro scheduler
    setTimeout(() => { this._attackInProgress = false; }, approxAttackDuration * 1000);
  }

  _enterRanged() {
    this.state = 'ranged';
    this.elapsed = 0;
    this.wavesFiredThisCycle = 0;
    this._attackTimer = 0;
    this._attackInProgress = false;

    // KINEMATIC during ranged
    if (this.bossBody) {
      this.bossBody.type = CANNON.Body.KINEMATIC;
      this.bossBody.mass = 0;
      this.bossBody.updateMassProperties();
    }
    if (this.events.onStateChange) this.events.onStateChange('ranged');
  }

  _enterSlam() {
    this.state = 'slam';
    this.elapsed = 0;
    if (this.events.onStateChange) this.events.onStateChange('slam');
    if (this.events.onSlam) this.events.onSlam();

    // Play crash/landing animation (die1 used as "crash")
    if (this.animationRefs && this.animationRefs.die1 && typeof this.animationRefs.die1.play === 'function') {
      this.animationRefs.die1.reset?.();
      this.animationRefs.die1.play();
    }
  }

  _enterVulnerable() {
    this.state = 'vulnerable';
    this.elapsed = 0;

    // Switch to DYNAMIC on platform
    if (this.bossBody) {
      this.bossBody.type = CANNON.Body.DYNAMIC;
      if (this.bossBody.mass <= 0) this.bossBody.mass = 50;
      this.bossBody.updateMassProperties();
    }
    if (this.events.onStateChange) this.events.onStateChange('vulnerable');
    if (this.events.onLand) this.events.onLand();
  }

  _enterRecover() {
    this.state = 'recover';
    this.elapsed = 0;
    if (this.events.onStateChange) this.events.onStateChange('recover');

    // Stand/move animation and back to KINEMATIC
    if (this.animationRefs) {
      if (this.animationRefs.stand && typeof this.animationRefs.stand.play === 'function') {
        this.animationRefs.stand.reset?.();
        this.animationRefs.stand.play();
      }
      if (this.animationRefs.move && typeof this.animationRefs.move.play === 'function') {
        this.animationRefs.move.reset?.();
        this.animationRefs.move.play();
      }
    }

    if (this.bossBody) {
      this.bossBody.type = CANNON.Body.KINEMATIC;
      this.bossBody.mass = 0;
      this.bossBody.updateMassProperties();
    }
    if (this.events.onTakeoff) this.events.onTakeoff();
  }

  _getPlayerXZ() {
    if (!this.playerRef) return { x: 0, z: 0 };
    if (typeof this.playerRef.getPosition === 'function') {
      const p = this.playerRef.getPosition();
      return { x: p.x || 0, z: p.z || 0 };
    }
    if (this.playerRef.position) {
      return { x: this.playerRef.position.x || 0, z: this.playerRef.position.z || 0 };
    }
    return { x: 0, z: 0 };
  }
}


