import * as THREE from 'three';

// ============================================================================
// SOLID RED eyelid overlay material.
// If uProgress > 0.0 => draw vec4(uColor, 1.0) (completely opaque).
// No blending, no depth: nothing underneath can shine through.
// ============================================================================
function makeSolidEyelidMaterial({ color = new THREE.Color(0x7a1a12) }) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uProgress: { value: 0.0 }, // 0=open (discard), >0 = solid red
      uColor:    { value: new THREE.Color(color) },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      precision mediump float;
      uniform float uProgress;
      uniform vec3  uColor;
      varying vec2 vUv;

      void main() {
        // Not blinking? Do not draw at all.
        if (uProgress <= 0.0) discard;

        // Blinking => hard, fully opaque red.
        gl_FragColor = vec4(uColor, 1.0);
      }
    `,
    transparent: false,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  // Keep absolutely last
  mat.forceSinglePass = true;
  return mat;
}

// simple ease
const easeInCubic  = t => t * t * t;
const easeOutCubic = t => 1.0 - Math.pow(1.0 - t, 3.0);

export class SunEyeBlinker {
  /**
   * @param {{
   *   rig?: THREE.Object3D,        // the eye rig root (used for world position)
   *   mesh?: THREE.Mesh,           // optional, to estimate radius from bounding sphere
   *   radius?: number,             // optional, fallback radius in world units
   *   camera?: THREE.Camera        // strongly recommended so we can billboard to camera
   * }} sunData
   * @param {{
   *   lidColor?: number|THREE.Color,
   *   firstBlinkDelay?: number,    // seconds until first auto-blink (default 0.25)
   *   autoBlink?: boolean,         // enable random blinking (default true)
   *   blinkOnStart?: boolean       // trigger an immediate blink on construct (default true)
   * }} opts
   */
  constructor(sunData, {
    lidColor = 0x8B0000,
    firstBlinkDelay = 0.25,
    autoBlink = true,
    blinkOnStart = true
  } = {}) {
    this.sunData = sunData || {};
    this.opts = { lidColor, firstBlinkDelay, autoBlink, blinkOnStart };

    this.state = {
      lids: null,             // { plane: THREE.Mesh, mat: ShaderMaterial }
      timer: 0,
      nextBlink: firstBlinkDelay,
      phase: 'idle',          // idle | closing | hold | opening
      phaseTime: 0,
      _hasClock: false,
      _lastNow: 0,
      _radius: this._computeRadius()
    };

    // Build overlay immediately and (optionally) show a test blink so you SEE it.
    this._ensureOverlay();
    if (blinkOnStart) {
      this.forceBlink();
      // If update() isn't called yet, keep it closed briefly so it's visible
      // and proves it's working.
      this._setProgress(1.0);
    }
  }

  // Force an immediate blink
  forceBlink() {
    this._ensureOverlay();
    this.state.phase = 'closing';
    this.state.phaseTime = 0;
    this.state.timer = 0;
    // also align once so you can see it even before the first update loop tick
    this._alignToCamera();
    this._setProgress(0.001);
  }

  // Call this every frame. Pass your clock delta in seconds.
  update(delta) {
    const { rig } = this.sunData;
    if (!rig) return;

    this._ensureOverlay();
    this._alignToCamera();

    // --- robust delta ---
    let dt;
    if (typeof delta === 'number') {
      dt = Math.max(0, delta);
      if (dt > 5) dt *= 0.001; // mistaken ms
    } else {
      const now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      if (!this.state._hasClock) {
        this.state._hasClock = true;
        this.state._lastNow = now;
        dt = 0;
      } else {
        dt = Math.max(0, (now - this.state._lastNow)) * 0.001;
        this.state._lastNow = now;
      }
    }

    if (!Number.isFinite(dt)) dt = 0;

    // auto-blink cadence
    if (this.opts.autoBlink && this.state.phase === 'idle') {
      this.state.timer += dt;
      if (this.state.timer >= this.state.nextBlink) {
        this._beginBlink();
      }
    }

    // timings
    const closeDuration = 0.12;
    const holdDuration  = 0.06;
    const openDuration  = 0.16;

    switch (this.state.phase) {
      case 'idle': {
        this._setProgress(0);
        break;
      }
      case 'closing': {
        this.state.phaseTime += dt;
        const t = Math.min(1, this.state.phaseTime / closeDuration);
        this._setProgress(easeInCubic(t));
        if (t >= 1) { this.state.phase = 'hold'; this.state.phaseTime = 0; }
        break;
      }
      case 'hold': {
        this.state.phaseTime += dt;
        this._setProgress(1);
        if (this.state.phaseTime >= holdDuration) {
          this.state.phase = 'opening';
          this.state.phaseTime = 0;
        }
        break;
      }
      case 'opening': {
        this.state.phaseTime += dt;
        const t = Math.min(1, this.state.phaseTime / openDuration);
        this._setProgress(1 - easeOutCubic(t));
        if (t >= 1) {
          this.state.phase = 'idle';
          this.state.phaseTime = 0;
          // next random blink (natural cadence)
          this.state.nextBlink = this._randomInterval();
        }
        break;
      }
    }
  }

  dispose() {
    const lids = this.state.lids;
    if (lids) {
      const { plane } = lids;
      if (plane.parent) plane.parent.remove(plane);
      plane.geometry?.dispose();
      plane.material?.dispose?.();
    }
    this.state.lids = null;
  }

  // ==========================================================================
  // Internals
  // ==========================================================================

  _computeRadius() {
    // Prefer explicit radius, then mesh bounding sphere, else fallback.
    if (typeof this.sunData.radius === 'number' && this.sunData.radius > 0) return this.sunData.radius;
    const mesh = this.sunData.mesh;
    if (mesh?.geometry) {
      mesh.geometry.computeBoundingSphere?.();
      const r = mesh.geometry.boundingSphere?.radius;
      if (r && Number.isFinite(r)) return r;
    }
    return 1; // sane fallback
  }

  _ensureOverlay() {
    if (this.state.lids) return;
    const { rig } = this.sunData;
    if (!rig) return;

    // Large enough to cover eye region. We will billboard to camera every frame.
    const r = this.state._radius;
    const width  = r * 4.0;
    const height = r * 3.0;

    const geom = new THREE.PlaneGeometry(width, height);
    const mat  = makeSolidEyelidMaterial({ color: this.opts.lidColor });
    const plane = new THREE.Mesh(geom, mat);

    // Overlay behavior: render last, never culled, no depth.
    plane.renderOrder = 2_000_000;
    plane.frustumCulled = false;

    // Attach to rig's parent scene graph so it moves with the eye,
    // but we will *billboard to the camera* every frame.
    rig.add(plane);

    // Align to camera before first render
    plane.onBeforeRender = (renderer, scene, camera) => {
      if (!this.sunData.camera) this.sunData.camera = camera;
      this._alignToCamera();
      // Make absolutely sure we're the very last
      plane.renderOrder = 2_000_000;
    };

    this.state.lids = { plane, mat };
  }

  _setProgress(k) {
    if (!this.state.lids) return;
    const clamped = THREE.MathUtils.clamp(k, 0, 1);
    this.state.lids.mat.uniforms.uProgress.value = clamped;
    this.state.lids.mat.needsUpdate = true;
  }

  _alignToCamera() {
    const { rig, camera } = this.sunData;
    if (!rig || !this.state.lids || !camera) return;

    const plane = this.state.lids.plane;

    // World positions
    const rigPos = new THREE.Vector3();
    const camPos = new THREE.Vector3();
    rig.getWorldPosition(rigPos);
    camera.getWorldPosition(camPos);

    // Direction from rig to camera
    const dir = camPos.clone().sub(rigPos);
    const dist = Math.max(0.001, dir.length());
    dir.normalize();

    // Offset the plane a little toward the camera so it's definitely in front
    const offset = Math.max(0.02 * dist, this.state._radius * 0.1);
    const worldPos = rigPos.clone().add(dir.multiplyScalar(offset));

    // Billboard: face the camera
    plane.quaternion.copy(camera.quaternion);
    plane.position.copy(worldPos);
  }

  _beginBlink() {
    this.state.phase = 'closing';
    this.state.phaseTime = 0;
    this.state.timer = 0;
  }

  _randomInterval() {
    // natural cadence 2.2s..5.5s
    return 2.2 + Math.random() * 3.3;
  }
}
