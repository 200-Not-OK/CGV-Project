import * as THREE from 'three';

/**
 * Lightning Border Effect
 * 
 * GPU-rendered animated lightning effect as a border
 * Perfect for boss room doors or portals
 * 
 * Features:
 * - Vertex and fragment shaders for GPU rendering
 * - Animated lightning bolts
 * - Pulsing energy effect
 * - Customizable size and color
 */

// ============================================================================
// VERTEX SHADER
// ============================================================================
const vertexShader = `
  uniform float uOverlayPush; // view-space Z push to avoid near-plane clipping
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float zBefore = mvPosition.z;
    float zAfter = mvPosition.z - uOverlayPush; // camera looks down -Z
    // Scale XY so screen-space size remains consistent after Z adjustment
    // Keep ratio stable; avoid division by zero with small epsilon
    float denom = abs(zBefore) > 1e-6 ? zBefore : (zBefore < 0.0 ? -1e-6 : 1e-6);
    float ratio = zAfter / denom;
    mvPosition.xy *= ratio;
    mvPosition.z = zAfter;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ============================================================================
// FRAGMENT SHADER - Lightning Effect
// ============================================================================
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uBorderWidth;
  uniform float uIntensity;
  
  varying vec2 vUv;
  
  // Random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Noise function
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Fractal Brownian Motion for organic patterns
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for(int i = 0; i < 5; i++) {
      value += amplitude * noise(st * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Lightning bolt function
  float lightning(vec2 uv, float seed, float time) {
    // Create jagged lightning path
    float path = fbm(vec2(uv.y * 10.0 + time + seed, seed)) * 0.3;
    path += sin(uv.y * 20.0 + time * 3.0 + seed) * 0.1;
    
    // Distance from path
    float dist = abs(uv.x - path);
    
    // Create bolt with glow
    float bolt = smoothstep(0.1, 0.0, dist) * 2.0;
    bolt += smoothstep(0.2, 0.0, dist) * 0.5;
    
    // Add flickering
    float flicker = sin(time * 20.0 + seed * 10.0) * 0.3 + 0.7;
    bolt *= flicker;
    
    return bolt;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Calculate distance from edges (border detection)
    float distLeft = uv.x;
    float distRight = 1.0 - uv.x;
    float distBottom = uv.y;
    float distTop = 1.0 - uv.y;
    
    float edgeDist = min(min(distLeft, distRight), min(distBottom, distTop));
    
    // Only show lightning on the border
    float borderMask = smoothstep(uBorderWidth, uBorderWidth * 0.5, edgeDist);
    
    // Create multiple lightning bolts
    float lightningEffect = 0.0;
    
    // Left border
    if (distLeft < uBorderWidth) {
      vec2 boltUV = vec2((distLeft / uBorderWidth), uv.y);
      lightningEffect += lightning(boltUV, 1.0, uTime) * smoothstep(uBorderWidth, 0.0, distLeft);
    }
    
    // Right border
    if (distRight < uBorderWidth) {
      vec2 boltUV = vec2((distRight / uBorderWidth), uv.y);
      lightningEffect += lightning(boltUV, 2.0, uTime) * smoothstep(uBorderWidth, 0.0, distRight);
    }
    
    // Top border
    if (distTop < uBorderWidth) {
      vec2 boltUV = vec2(uv.x, (distTop / uBorderWidth));
      lightningEffect += lightning(boltUV.yx, 3.0, uTime) * smoothstep(uBorderWidth, 0.0, distTop);
    }
    
    // Bottom border
    if (distBottom < uBorderWidth) {
      vec2 boltUV = vec2(uv.x, (distBottom / uBorderWidth));
      lightningEffect += lightning(boltUV.yx, 4.0, uTime) * smoothstep(uBorderWidth, 0.0, distBottom);
    }
    
    // Add pulsing energy glow
    float pulse = sin(uTime * 2.0) * 0.3 + 0.7;
    lightningEffect *= pulse;
    
    // Add ambient border glow
    float borderGlow = smoothstep(uBorderWidth * 2.0, 0.0, edgeDist) * 0.3;
    
    // Final color
    vec3 finalColor = uColor * (lightningEffect + borderGlow) * uIntensity;
    
    // Add extra bloom on lightning
    finalColor += uColor * lightningEffect * 0.5;
    
    float alpha = clamp(lightningEffect + borderGlow, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ============================================================================
// LIGHTNING BORDER CLASS
// ============================================================================
export class LightningBorder {
  constructor(scene, options = {}) {
    this.scene = scene;

    if (!options.points || options.points.length !== 4) {
      throw new Error('LightningBorder requires options.points as an array of 4 [x, y, z] arrays.');
    }

    this.options = {
      points: options.points,             // expected in world space by default
      pointsAreWorld: options.pointsAreWorld !== false, // default true
      attachToMeshName: options.attachToMeshName || null, // optional string to resolve in scene
      parent: options.parent || null,     // optional THREE.Object3D
      surfaceOffset: options.surfaceOffset !== undefined ? options.surfaceOffset : 0.08,
      adaptiveDepthToggle: options.adaptiveDepthToggle === undefined ? true : !!options.adaptiveDepthToggle,
      followAlwaysOverlay: options.followAlwaysOverlay === undefined ? false : !!options.followAlwaysOverlay,
      updateEvery: options.updateEvery ?? 1,
      allowAdditive: options.allowAdditive !== undefined ? !!options.allowAdditive : true,
      color: options.color || 0x00ff00,   // Green
      intensity: options.intensity || 3.0,
      borderWidth: options.borderWidth || 0.15,
      ...options
    };

    this.quality = options.quality || null;
    if (options.updateEvery === undefined && this.quality?.lightningBorderProfile?.updateEvery !== undefined) {
      this.options.updateEvery = this.quality.lightningBorderProfile.updateEvery;
    }
    if (options.allowAdditive === undefined && this.quality?.lightningBorderProfile?.allowAdditive !== undefined) {
      this.options.allowAdditive = this.quality.lightningBorderProfile.allowAdditive;
    }

    this.mesh = null;
    this.material = null;
    this.light = null;
    this.time = 0;
    this.updateEvery = Math.max(1, Math.round(this.options.updateEvery || 1));
    this.timeScale = 1 / this.updateEvery;

    this._resolvedParent = null; // THREE.Object3D we attach to (if any)
    this._worldPoints = this.options.points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    this._localNormal = null; // computed from localPoints
    this._isOverlayMode = false;

    this.init();
  }

  init() {
    console.log('⚡ Creating Lightning Border');
    console.log('   Points:', this.options.points);
    console.log('   Color: Green lightning');

    // Resolve parent if requested
    if (!this._resolvedParent && (this.options.parent || this.options.attachToMeshName)) {
      this._resolvedParent = this.options.parent || this._resolveByName(this.options.attachToMeshName);
      if (this._resolvedParent) {
        console.log('🧲 LightningBorder: attaching to parent object', this._resolvedParent.name || '(unnamed)');
      }
    }

    // Prepare quad positions: either world or parent-local
    const localPoints = this._resolvedParent && this.options.pointsAreWorld
      ? this._worldPoints.map(v => this._resolvedParent.worldToLocal(v.clone()))
      : this._worldPoints;

    // Compute a stable normal (favor CCW ordering) and offset points slightly to avoid z-fighting
    const e1 = localPoints[1].clone().sub(localPoints[0]);
    const e2 = localPoints[3].clone().sub(localPoints[0]);
    let n = e2.clone().cross(e1);
    if (n.lengthSq() < 1e-8) n.set(0, 1, 0);

    // Ensure normal points upward for mostly horizontal quads so offset lifts above surface
    let normalWorld = n.clone();
    if (this._resolvedParent) {
      this._resolvedParent.updateWorldMatrix(true, false);
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(this._resolvedParent.matrixWorld);
      normalWorld.applyMatrix3(normalMatrix).normalize();
    } else {
      normalWorld.normalize();
    }
    const WORLD_UP = new THREE.Vector3(0, 1, 0);
    if (Math.abs(normalWorld.dot(WORLD_UP)) > 0.5 && normalWorld.dot(WORLD_UP) < 0) {
      normalWorld.negate();
      n.negate();
    }
    n.normalize();
    this._localNormal = n.clone();

    const OFFSET = this.options.surfaceOffset || 0;
    if (OFFSET !== 0) {
      const offsetVec = n.clone().multiplyScalar(OFFSET);
      for (const lp of localPoints) lp.add(offsetVec);
    }

    // Cache local-space center for near-plane push calculations (after offset)
    this._localCenter = localPoints.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(0.25);

    // Create custom geometry for quad from 4 points
    const positions = new Float32Array([
      localPoints[0].x, localPoints[0].y, localPoints[0].z,
      localPoints[1].x, localPoints[1].y, localPoints[1].z,
      localPoints[2].x, localPoints[2].y, localPoints[2].z,
      localPoints[3].x, localPoints[3].y, localPoints[3].z
    ]);
    // 2 triangles: 0-1-2, 2-3-0
    const indices = [0, 1, 2, 2, 3, 0];
    // UVs: (bottom left, bottom right, top right, top left)
    const uvs = new Float32Array([
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    const useAdditive = this.options.allowAdditive !== false;

    // Create shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(this.options.color) },
        uBorderWidth: { value: this.options.borderWidth },
        uIntensity: { value: this.options.intensity },
        uOverlayPush: { value: 0.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true, // Keep transparent for proper look
      blending: useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
      fog: false,
      toneMapped: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -4
    });

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 999;
    // Skip deferred - render in forward pass AFTER lighting
    this.mesh.userData.skipDeferred = true;

    // Ensure bounds exist, though we disable culling
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    // Add to scene and follow parent by copying its world matrix each frame.
    // This avoids parent-based frustum culling causing the border to disappear.
    this.scene.add(this.mesh);
    this.mesh.matrixAutoUpdate = !this._resolvedParent; // disable auto when following
    this._followParent = !!this._resolvedParent;
    if (this._followParent && this._resolvedParent) {
      this._resolvedParent.updateWorldMatrix(true, false);
      this.mesh.matrix.copy(this._resolvedParent.matrixWorld);
    }

    // Compute overlay/near-plane push with the exact camera used for rendering
    this.mesh.onBeforeRender = (renderer, scene, camera) => {
      try {
        // Expose active camera for other systems (parity with BinaryScreen usage)
        if (scene && scene.userData) scene.userData.activeCamera = camera;

        const mat = this.mesh.material;
        // Always keep depth testing ON so other objects occlude correctly
        mat.depthTest = true;
        mat.depthWrite = false;
        mat.polygonOffset = true;
        mat.polygonOffsetFactor = -2;
        mat.polygonOffsetUnits = -4;
        // Draw late to help blended look but still respect depth buffer
        this.mesh.renderOrder = 10000;
        this._isOverlayMode = false;

        // Compute worst-case vertex push in view space against current camera near plane
        const mv = new THREE.Matrix4().multiplyMatrices(camera.matrixWorldInverse, this.mesh.matrixWorld);
        const posAttr = this.mesh.geometry.getAttribute('position');
        let zMax = -Infinity;
        for (let i = 0; i < 4; i++) {
          const vLocal = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
          const vView = vLocal.applyMatrix4(mv);
          if (vView.z > zMax) zMax = vView.z; // least negative (closest)
        }
        const near = (typeof camera.near === 'number') ? camera.near : 0.1;
        const margin = 0.05; // small, to avoid visual size jumps
        const needed = Math.max(0, zMax + near + margin);
        // Clamp push to avoid dramatic perspective scaling
        const maxPush = near * 0.5; // half the near plane distance
        this.material.uniforms.uOverlayPush.value = Math.min(needed, maxPush);
      } catch (e) { /* ignore */ }
    };

    console.log('✅ Lightning Border created (self-illuminated, no light needed)!');
  }
  
  update(deltaTime, elapsedTime) {
    if (!this.mesh || !this.material) return;
    
    const deltaSeconds = (deltaTime / 1000) * this.timeScale;
    this.time += deltaSeconds;

    // Update shader time
    this.material.uniforms.uTime.value = this.time;

    // If following a parent, copy its world matrix so we render in the same transform
    if (this._followParent && this._resolvedParent && this.mesh) {
      // Make sure parent's world matrix is current
      this._resolvedParent.updateWorldMatrix(true, false);
      this.mesh.matrix.copy(this._resolvedParent.matrixWorld);
      this.mesh.updateMatrixWorld(true);
    }

    // Overlay/near-plane handling happens in onBeforeRender using the exact camera state

    // Per-frame depth/near-plane handling is done in onBeforeRender to use the exact camera
    
  }

  // Attach to a parent object after creation. Optionally converts world-space points to local.
  attachToObject(object3D, options = {}) {
    if (!object3D || !object3D.isObject3D) return;
    const { pointsAreWorld = true, bindMatrixWorld = null } = options;

    this._resolvedParent = object3D;

    // If we already have a mesh, reparent and, if needed, convert geometry to parent local space
    if (this.mesh) {
      // Ensure we live at scene root to avoid parent frustum culling
      if (this.mesh.parent) this.mesh.parent.remove(this.mesh);

      // Compute local point positions if our stored points are in world space
      if (pointsAreWorld) {
        const geom = this.mesh.geometry;
        let lp;
        if (bindMatrixWorld && bindMatrixWorld.isMatrix4) {
          const inv = new THREE.Matrix4().copy(bindMatrixWorld).invert();
          lp = this._worldPoints.map(v => v.clone().applyMatrix4(inv));
        } else {
          lp = this._worldPoints.map(v => object3D.worldToLocal(v.clone()));
        }
        // Recompute local normal (favor CCW) and apply surface offset consistently
        const e1 = lp[1].clone().sub(lp[0]);
        const e2 = lp[3].clone().sub(lp[0]);
        let n = e2.clone().cross(e1);
        if (n.lengthSq() < 1e-8) n.set(0, 1, 0);

        let normalWorld = n.clone();
        object3D.updateWorldMatrix(true, false);
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(object3D.matrixWorld);
        normalWorld.applyMatrix3(normalMatrix).normalize();
        const WORLD_UP = new THREE.Vector3(0, 1, 0);
        if (Math.abs(normalWorld.dot(WORLD_UP)) > 0.5 && normalWorld.dot(WORLD_UP) < 0) {
          normalWorld.negate();
          n.negate();
        }
        n.normalize();
        this._localNormal = n.clone();

        const OFFSET = this.options.surfaceOffset || 0;
        if (OFFSET !== 0) {
          const offsetVec = n.clone().multiplyScalar(OFFSET);
          for (const v of lp) v.add(offsetVec);
        }
        this._localCenter = lp.reduce((acc, vec) => acc.add(vec), new THREE.Vector3()).multiplyScalar(0.25);
        const arr = geom.getAttribute('position').array;
        arr[0] = lp[0].x; arr[1] = lp[0].y; arr[2] = lp[0].z;
        arr[3] = lp[1].x; arr[4] = lp[1].y; arr[5] = lp[1].z;
        arr[6] = lp[2].x; arr[7] = lp[2].y; arr[8] = lp[2].z;
        arr[9] = lp[3].x; arr[10] = lp[3].y; arr[11] = lp[3].z;
        geom.getAttribute('position').needsUpdate = true;
        geom.computeVertexNormals();
        geom.computeBoundingBox();
        geom.computeBoundingSphere();
      }

      // Add back to scene and follow
      this.scene.add(this.mesh);
      this._followParent = true;
      this.mesh.matrixAutoUpdate = false;
      this._resolvedParent.updateWorldMatrix(true, false);
      this.mesh.matrix.copy(this._resolvedParent.matrixWorld);
      this.mesh.updateMatrixWorld(true);
    }
  }

  _resolveByName(name) {
    if (!name || !this.scene || !this.scene.getObjectByName) return null;
    const obj = this.scene.getObjectByName(name);
    if (obj) return obj;
    let found = null;
    this.scene.traverse((child) => {
      if (!found && child.name === name) found = child;
    });
    return found;
  }

  setPosition(x, y, z) {
    if (this.mesh) {
      this.mesh.position.set(x, y, z);
    }
  }
  
  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.mesh);
      this.mesh = null;
      this.material = null;
    }
    
    console.log('⚡ Lightning Border disposed');
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================
export function createLightningBorder(scene, options) {
  return new LightningBorder(scene, options);
}
