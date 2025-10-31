import * as THREE from 'three';

/**
 * BossMissileSpawner
 * Area-denial missiles using a GLTF rocket visual (optional) and timed warnings/impacts.
 */
export class BossMissileSpawner {
  /**
   * @param {Object} opts
   * @param {THREE.Scene} opts.scene
   * @param {any} opts.world - Physics world (unused here, AoE is computed script-side)
   * @param {any} [opts.loader] - GLTF loader with loadAsync(url) or load(url, onLoad, onProgress, onError)
   * @param {number} [opts.poolSize=64]
   * @param {THREE.Material} [opts.markerMaterial]
   * @param {Function} [opts.explosionFx] - (pos) => void
   * @param {number} [opts.missileScale=1]
   * @param {number} [opts.markerRadius=1.2]
   * @param {string} [opts.assetPath='assets/enemies/lobber_boss/rocket.gltf']
   * @param {number} [opts.groundY=0] - Y coordinate where markers/impacts land
   * @param {number} [opts.missileStartHeight=22] - Height above ground to spawn missiles
   */
  constructor(opts) {
    this.scene = opts.scene;
    this.world = opts.world;
    this.loader = opts.loader;
    this.poolSize = opts.poolSize ?? 64;
    this.markerMaterial = opts.markerMaterial || new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.85 });
    this.explosionFx = opts.explosionFx;
    this.missileScale = opts.missileScale ?? 1;
    this.markerRadius = opts.markerRadius ?? 1.2;
    this.assetPath = opts.assetPath || 'assets/enemies/lobber_boss/rocket.gltf';
    this.groundY = opts.groundY ?? 0;
    this.missileStartHeight = opts.missileStartHeight ?? 22;

    // Pools and timers
    this._missilePool = [];
    this._missileIdx = 0;
    this._activeWaves = [];
    this._markers = [];
    this._activeMissiles = [];

    // Pre-create marker geometry
    this._markerGeo = new THREE.CircleGeometry(this.markerRadius, 24);
    this._markerGeo.rotateX(-Math.PI / 2);

    // Simple fallback missile visual (cone on a small cylinder base)
    this._fallbackMissile = this._buildFallbackMissile();

    // Lazy load missiles on demand; fall back to primitive if loader not provided
  }

  /**
   * Schedule an area-denial missile wave
   * @param {Object} params
   * @param {number} params.count
   * @param {{x:number, z:number}} params.targetCenter
   * @param {number} [params.radius=5]
   * @param {number} [params.speed=25] - Not used (visual only in this implementation)
   * @param {number} [params.damage=20]
   * @param {number} [params.warningDelay=2.0]
   * @param {number} [params.impactDelay=1.5]
   * @param {'uniform'|'center-biased'} [params.spreadBias='uniform']
   */
  scheduleWave(params) {
    const {
      count,
      targetCenter,
      radius = 5,
      damage = 20,
      warningDelay = 2.0,
      impactDelay = 1.5,
      spreadBias = 'uniform',
    } = params;

    const spots = [];
    for (let i = 0; i < count; i++) {
      const p = this._randomPointInRadius(radius, spreadBias);
      spots.push({ x: targetCenter.x + p.x, z: targetCenter.z + p.z });
    }

    // Track wave timers relative to now
    this._activeWaves.push({
      t: 0,
      warningTime: warningDelay,
      impactTime: warningDelay + impactDelay,
      spots,
      damage,
      warned: false,
      impacted: false,
    });
  }

  /** Call every frame */
  update(dt) {
    if (!this._activeWaves.length) return;
    for (let i = 0; i < this._activeWaves.length; i++) {
      const wave = this._activeWaves[i];
      wave.t += dt;

      if (!wave.warned && wave.t >= wave.warningTime) {
        wave.warned = true;
        this._spawnMarkers(wave.spots);
        this._spawnMissilesForWave(wave);
      }

      if (!wave.impacted && wave.t >= wave.impactTime) {
        wave.impacted = true;
        this._doImpacts(wave.spots, wave.damage);
      }
    }

    // Cleanup finished waves and markers
    this._activeWaves = this._activeWaves.filter(w => !w.impacted || w.t < w.impactTime + 0.05);

    // Animate active missiles descending
    if (this._activeMissiles.length) {
      for (let i = this._activeMissiles.length - 1; i >= 0; i--) {
        const m = this._activeMissiles[i];
        // If already reached target, remove
        if (!m.mesh || !m.mesh.parent) { this._activeMissiles.splice(i, 1); continue; }
        // Move down toward target
        const remaining = Math.max(0, m.tImpact - m.tElapsed);
        const step = m.speed * dt;
        m.mesh.position.y = Math.max(m.targetY, m.mesh.position.y - step);
        m.tElapsed += dt;
        if (m.mesh.position.y <= m.targetY + 0.01) {
          // Remove when it hits the ground; _doImpacts will handle FX/damage separately
          this._despawnMissile(m);
          this._activeMissiles.splice(i, 1);
        }
      }
    }
  }

  clear() {
    this._activeWaves.length = 0;
    this._clearMarkers();
  }

  dispose() {
    this.clear();
    if (this._markerGeo) this._markerGeo.dispose();
    this._markerGeo = null;
    this.markerMaterial = null;
    this.scene = null;
    this.world = null;
    this.loader = null;
  }

  // ----- Internals -----

  _spawnMarkers(spots) {
    if (!this.scene) return;
    for (const s of spots) {
      const m = new THREE.Mesh(this._markerGeo, this.markerMaterial);
      m.position.set(s.x, this.groundY + 0.01, s.z);
      m.userData.__marker = true;
      this.scene.add(m);
      this._markers.push(m);
    }
  }

  _clearMarkers() {
    if (!this.scene) return;
    for (const m of this._markers) {
      if (m.parent === this.scene) this.scene.remove(m);
      if (m.geometry) m.geometry.dispose?.();
      // material is shared
    }
    this._markers.length = 0;
  }

  _doImpacts(spots, damage) {
    // Remove markers for these spots
    this._clearMarkers();

    // Despawn any missiles aimed at these spots
    if (this._activeMissiles.length) {
      for (let i = this._activeMissiles.length - 1; i >= 0; i--) {
        const m = this._activeMissiles[i];
        if (spots.some(s => Math.abs(s.x - m.spot.x) < 0.5 && Math.abs(s.z - m.spot.z) < 0.5)) {
          this._despawnMissile(m);
          this._activeMissiles.splice(i, 1);
        }
      }
    }

    // Visual FX callback if provided
    if (this.explosionFx) {
      for (const s of spots) this.explosionFx(new THREE.Vector3(s.x, this.groundY, s.z));
    }

    // AoE damage hook: integrate with your damage system
    // Example callback could be injected externally; here we simply expose positions via event
    if (this.onImpact) this.onImpact(spots, damage);
  }

  _randomPointInRadius(r, bias) {
    // Uniform disk sampling
    const u = Math.random();
    const v = Math.random();
    let radius = Math.sqrt(u) * r;
    if (bias === 'center-biased') radius = Math.pow(Math.random(), 1.5) * r;
    const theta = 2 * Math.PI * v;
    return { x: radius * Math.cos(theta), z: radius * Math.sin(theta) };
  }

  // ----- Missile visuals -----
  _buildFallbackMissile() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 1.2, 10),
      new THREE.MeshStandardMaterial({ color: 0x999999 })
    );
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.8, 12),
      new THREE.MeshStandardMaterial({ color: 0xdd3333 })
    );
    body.position.y = 0.6;
    nose.position.y = 1.4;
    group.add(body);
    group.add(nose);
    group.scale.setScalar(this.missileScale);
    return group;
  }

  _spawnMissilesForWave(wave) {
    // Spawn a simple descending visual for each spot
    const timeToImpact = Math.max(0.2, wave.impactTime - wave.t);
    const startY = this.groundY + this.missileStartHeight;
    const targetY = this.groundY + 0.5;
    const descendDist = Math.max(0.1, startY - targetY);
    const speed = descendDist / timeToImpact; // units per second

    for (const s of wave.spots) {
      const mesh = this._acquireMissileMesh();
      mesh.position.set(s.x, startY, s.z);
      mesh.rotation.x = Math.PI; // point nose downward
      this.scene.add(mesh);
      this._activeMissiles.push({
        mesh,
        spot: s,
        targetY,
        speed,
        tElapsed: 0,
        tImpact: timeToImpact
      });
    }
  }

  _acquireMissileMesh() {
    // For now, just clone fallback; can extend to GLTF-pool in future
    return this._fallbackMissile.clone(true);
  }

  _despawnMissile(m) {
    if (m && m.mesh && this.scene && m.mesh.parent === this.scene) {
      this.scene.remove(m.mesh);
      // Let GC collect; geometries/materials are shared primitives
    }
  }
}


