import * as THREE from 'three';

/**
 * Creates a dynamic "Matrix-style" hacker screen with flowing green binary code
 * The screen acts as both a visual element and can emit green light
 */
export class BinaryScreen {
  static qualityProfile = {
    glowEnabled: true,
    headBlur: 10,
    trailBlur: 2,
    trailLength: 15,
    speedMultiplier: 1.0,
    driftStrength: 0.0,     // subtle horizontal drift per column
    headExtraGlow: 0,       // extra blur added for head on second pass
    headDoubleDraw: false,  // if true, draw head twice for punchier glow
    trailBlurFalloff: 0.7,  // multiply blur as j increases
    // Dynamic head lights (HIGH tier)
    headLightsCount: 0,
    headLightIntensity: 2.0,
    headLightDistance: 3.0,
    headLightOffset: 0.12,
    overlaysEnabled: false
  };
  static setQualityProfile(profile = {}) {
    BinaryScreen.qualityProfile = {
      ...BinaryScreen.qualityProfile,
      ...profile
    };
  }
  constructor(options = {}) {
    this.position = options.position || [0, 5, 0];
    this.width = options.width || 4;
    this.height = options.height || 3;
    this.rotation = options.rotation || [0, 0, 0];
    this.emitLight = options.emitLight !== undefined ? options.emitLight : true;
    this.lightIntensity = options.lightIntensity || 2.0;
    this.lightDistance = options.lightDistance || 10;
    this.adaptiveDepthToggle = !!options.adaptiveDepthToggle;
    
    // Exact corners mode: if provided, we place the screen exactly at those 4 points
    this.corners = Array.isArray(options.corners) && options.corners.length === 4 ? options.corners : null;
    this._cornerVecs = this.corners ? this.corners.map(c => new THREE.Vector3(c[0], c[1], c[2])) : null;
    
    // Curved screen settings
    this.curved = options.curved || false;
    this.curveAmount = options.curveAmount || 0.3;
    
    // Canvas settings for binary code
    this.canvasWidth = 512;
    this.canvasHeight = 512;
    this.fontSize = 14;
    this.columns = Math.floor(this.canvasWidth / this.fontSize);
    this.drops = [];
    this.speeds = []; // Variable speeds per column
    this.trailLength = 15; // Length of the trailing effect
    this.columnColors = [];
    
    // Color settings
    this.backgroundColor = options.backgroundColor || '#000000';
    this.textColor = options.textColor || '#009a00'; // Darker Matrix green
    this.glowColor = options.glowColor || 0x009a00;
    this.palette = Array.isArray(options.palette) && options.palette.length > 0
      ? options.palette
      : ['#7a0000', '#003070', '#007a2a']; // dark red, dark blue, dark emerald
    
    // Animation settings
    this.updateInterval = options.updateInterval || 50; // ms between updates
    this.lastUpdate = 0;
    this._elapsedTime = 0;
    
    // Event callback for when drops hit bottom
    this.onDropHitBottom = options.onDropHitBottom || null;
    
    // Initialize
    this.canvas = null;
    this.context = null;
    this.texture = null;
    this.mesh = null;
    this.light = null;
    this.group = new THREE.Group();
    this.headLights = [];
    this._orderedCorners = null; // for exact-corners mapping
    
    console.log('🖥️ Creating BinaryScreen at', this.position, 'size:', this.width, 'x', this.height, this.corners ? '(exact corners mode)' : '');
    
    this.init();
  }
  
  init() {
    // Create canvas for drawing binary code
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.context = this.canvas.getContext('2d');
    
    // Initialize drops and speeds for each column
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -this.canvasHeight / this.fontSize); // Start above screen
      this.speeds[i] = 0.5 + Math.random() * 1.5; // Random speed between 0.5 and 2
      this.columnColors[i] = this.palette[i % this.palette.length];
    }
    
    // Create texture from canvas
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.generateMipmaps = false;
    
    // Create material with emissive properties for glow (no shadows)
    const material = new THREE.MeshStandardMaterial({
      map: this.texture,
      emissive: new THREE.Color(this.glowColor),
      emissiveMap: this.texture,
      emissiveIntensity: 1.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
      alphaTest: 0.0,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -2,
      toneMapped: false
    });
    material.blending = THREE.NormalBlending;
    
    // Create geometry - exact corners quad if provided, else curved/flat plane
    let geometry;
    if (this._cornerVecs) {
      console.log('📐 Creating quad from exact corners');

      // 1) Robustly order corners CCW around centroid (project to best-fit plane normal)
      // Compute a temporary normal from raw points (fallback to +Y if degenerate)
      const tmpN = (() => {
        const e1 = this._cornerVecs[1].clone().sub(this._cornerVecs[0]);
        const e2 = this._cornerVecs[2].clone().sub(this._cornerVecs[0]);
        const n = e1.clone().cross(e2);
        if (n.lengthSq() < 1e-6) return new THREE.Vector3(0, 1, 0);
        return n.normalize();
      })();
      const center = this._cornerVecs.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(1 / 4);
      // Choose an axis in plane for angle computation
      const refX = new THREE.Vector3().subVectors(this._cornerVecs[0], center).projectOnPlane(tmpN);
      if (refX.lengthSq() < 1e-6) refX.set(1, 0, 0);
      refX.normalize();
      const refY = new THREE.Vector3().crossVectors(tmpN, refX).normalize();

      // Sort vertices by angle around centroid
      const withAngles = this._cornerVecs.map((p, idx) => {
        const d = p.clone().sub(center);
        const x = d.dot(refX);
        const y = d.dot(refY);
        const ang = Math.atan2(y, x);
        return { idx, ang, p, x, y };
      });
      withAngles.sort((a, b) => a.ang - b.ang); // CCW order
      const ordered = withAngles.map(o => o.p);
      this._orderedCorners = ordered.map(p => p.clone());

      // Compute planar UVs from projected coordinates (prevents diagonal seam)
      const xs = withAngles.map(o => o.x);
      const ys = withAngles.map(o => o.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const rangeX = (maxX - minX) || 1;
      const rangeY = (maxY - minY) || 1;
      const orderedProj = withAngles.map(o => ({
        u: (o.x - minX) / rangeX,
        v: 1 - (o.y - minY) / rangeY // flip v to match typical top-down
      }));
      // Clamp UVs slightly inside to avoid precision edge issues
      for (const p of orderedProj) {
        p.u = Math.min(0.999, Math.max(0.001, p.u));
        p.v = Math.min(0.999, Math.max(0.001, p.v));
      }

      // 2) Detect very flat: nudge up slightly
      const meanY = ordered.reduce((acc, v) => acc + v.y, 0) / 4;
      const flat = ordered.every(v => Math.abs(v.y - meanY) < 0.3);
      if (flat) {
        for (let v of ordered) v.y += 0.05;
      }

      // 3) Recompute stable normal from ordered quad and offset forward
      const edge1 = ordered[1].clone().sub(ordered[0]);
      const edge2 = ordered[3].clone().sub(ordered[0]);
      const normal = edge1.clone().cross(edge2);
      if (normal.lengthSq() < 1e-6) normal.set(0, 1, 0);
      normal.normalize();
      const OFFSET = 0.2;
      for (let v of ordered) v.addScaledVector(normal, OFFSET);

      // 4) Build geometry with continuous UVs
      const positions = new Float32Array([
        ordered[0].x, ordered[0].y, ordered[0].z,
        ordered[1].x, ordered[1].y, ordered[1].z,
        ordered[2].x, ordered[2].y, ordered[2].z,
        ordered[3].x, ordered[3].y, ordered[3].z
      ]);
      const uvs = new Float32Array([
        orderedProj[0].u, orderedProj[0].v,
        orderedProj[1].u, orderedProj[1].v,
        orderedProj[2].u, orderedProj[2].v,
        orderedProj[3].u, orderedProj[3].v
      ]);
      const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.computeVertexNormals();
    } else if (this.curved) {
      console.log('🌀 Creating curved screen with curveAmount:', this.curveAmount);
      const reverseDirection = this.curveAmount < 0; // Negative curveAmount reverses direction
      const absCurve = Math.abs(this.curveAmount);
      
      geometry = new THREE.CylinderGeometry(
        this.width / absCurve,  // radius
        this.width / absCurve,  // radius (same for cylinder)
        this.height,            // height
        32,                     // radial segments
        1,                      // height segments
        true,                   // open ended
        Math.PI / 2 - 0.5,     // start angle
        1.0                     // sweep angle (creates a curved segment)
      );
      // Rotate to face forward, then flip if needed
      geometry.rotateY(Math.PI / 2);
      if (reverseDirection) {
        geometry.rotateY(Math.PI); // Flip 180° to reverse curve
      }
    } else {
      console.log('📺 Creating flat plane screen');
      geometry = new THREE.PlaneGeometry(this.width, this.height);
    }
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 999;
    
    // Apply position and rotation only if not using exact corners
    if (!this._cornerVecs) {
      this.mesh.position.set(...this.position);
      this.mesh.rotation.set(...this.rotation);
    } else {
      this.mesh.position.y = 0; // quad already placed by vertices
    }
    
    this.group.add(this.mesh);

    // Create dynamic head lights based on quality profile (HIGH)
    const qp = BinaryScreen.qualityProfile;
    if ((qp.headLightsCount || 0) > 0) {
      const count = Math.min(qp.headLightsCount, Math.max(1, Math.floor(this.columns / 6)));
      // Evenly spread columns for lights
      for (let k = 0; k < count; k++) {
        const colIdx = Math.floor((k + 0.5) * this.columns / count);
        const pl = new THREE.PointLight(this.glowColor, qp.headLightIntensity, qp.headLightDistance);
        pl.castShadow = false;
        pl.visible = true;
        this.group.add(pl);
        this.headLights.push({ light: pl, col: colIdx });
      }
    }
    
    // Add point light if enabled (ambient screen light)
    if (this.emitLight) {
      let lx = this.position[0], ly = this.position[1], lz = this.position[2];
      if (this._cornerVecs) {
        // Center of corners for light position
        const c = geometry.getAttribute('position');
        const cx = (c.getX(0) + c.getX(1) + c.getX(2) + c.getX(3)) / 4;
        const cy = (c.getY(0) + c.getY(1) + c.getY(2) + c.getY(3)) / 4;
        const cz = (c.getZ(0) + c.getZ(1) + c.getZ(2) + c.getZ(3)) / 4;
        lx = cx; ly = cy; lz = cz;
      }
      this.light = new THREE.PointLight(this.glowColor, this.lightIntensity, this.lightDistance);
      this.light.position.set(lx, ly, lz + 0.5);
      this.group.add(this.light);
    }
    
    // Draw initial frame
    this.drawBinaryCode();
    
    console.log('✅ BinaryScreen initialized successfully');
  }
  
  // Map (u,v in 0..1) to world position for both modes
  _uvToWorld(u, v) {
    if (this._orderedCorners && this._orderedCorners.length === 4) {
      // Bilinear mapping using our UV assignment
      const v0 = this._orderedCorners[0]; // uv(0,1)
      const v1 = this._orderedCorners[1]; // uv(0,0)
      const v2 = this._orderedCorners[2]; // uv(1,0)
      const v3 = this._orderedCorners[3]; // uv(1,1)
      const p = new THREE.Vector3(0, 0, 0);
      // P = (1-u)*(1-v)*v0 + (1-u)*v*v1 + u*v*v2 + u*(1-v)*v3
      const a = (1 - u) * (1 - v);
      const b = (1 - u) * v;
      const c = u * v;
      const d = u * (1 - v);
      p.addScaledVector(v0, a);
      p.addScaledVector(v1, b);
      p.addScaledVector(v2, c);
      p.addScaledVector(v3, d);
      return p;
    }
    // Plane mode: use localToWorld
    const local = new THREE.Vector3((u - 0.5) * this.width, (0.5 - v) * this.height, 0);
    return this.mesh.localToWorld(local);
  }

  _quadNormal() {
    if (this._orderedCorners && this._orderedCorners.length === 4) {
      const e1 = this._orderedCorners[1].clone().sub(this._orderedCorners[0]);
      const e2 = this._orderedCorners[3].clone().sub(this._orderedCorners[0]);
      const n = e1.clone().cross(e2);
      if (n.lengthSq() < 1e-6) return new THREE.Vector3(0, 0, 1);
      return n.normalize();
    }
    // Plane mode: normal is mesh's forward
    const fwd = new THREE.Vector3(0, 0, 1);
    return fwd.applyEuler(this.mesh.rotation).normalize();
  }
  
  drawBinaryCode() {
    // In drawBinaryCode, make background completely transparent so only the Matrix numbers show
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Set text properties
    this.context.font = `bold ${this.fontSize}px 'Courier New', monospace`;
    
    const prof = BinaryScreen.qualityProfile;
    const trailLen = Math.max(1, Math.floor(prof.trailLength ?? this.trailLength));
    
    // Optional scanline/gradient overlays for HIGH
    if (BinaryScreen.qualityProfile.overlaysEnabled) {
      const grad = this.context.createLinearGradient(0, 0, 0, this.canvasHeight);
      grad.addColorStop(0.0, 'rgba(0,0,0,0.10)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.00)');
      grad.addColorStop(1.0, 'rgba(0,0,0,0.10)');
      this.context.fillStyle = grad;
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // Thin horizontal scanlines
      this.context.fillStyle = 'rgba(255,255,255,0.02)';
      for (let sy = 0; sy < this.canvasHeight; sy += 2) {
        this.context.fillRect(0, sy, this.canvasWidth, 1);
      }
    }
    
    // Draw binary digits with trails
    for (let i = 0; i < this.drops.length; i++) {
      // Subtle horizontal drift (quality-dependent)
      const drift = prof.driftStrength ? Math.sin((this._elapsedTime || 0) * 0.002 + i * 0.37) * prof.driftStrength : 0;
      const x = i * this.fontSize + drift;
      
      // Draw trail (fading characters behind the leading one)
      for (let j = 0; j < trailLen; j++) {
        const trailY = (this.drops[i] - j) * this.fontSize;
        
        if (trailY < 0 || trailY > this.canvasHeight) continue;
        
        const col = this.columnColors[i] || this.textColor;
        const glow = prof;
        
        const blurForThis = j === 0
          ? glow.headBlur + (glow.headExtraGlow || 0)
          : Math.max(0, (glow.trailBlur || 0) * Math.pow(glow.trailBlurFalloff || 0.7, j));
        
        // Leading character is brightest and largest
        if (j === 0) {
          this.context.shadowColor = col;
          this.context.shadowBlur = glow.glowEnabled ? blurForThis : 0;
          this.context.fillStyle = col;
          this.context.globalAlpha = 1;
          
          // Optional head double draw for punch
          if (glow.headDoubleDraw && glow.glowEnabled) {
            // Extra-hot pass
            this.context.shadowBlur = blurForThis * 1.5;
            this.context.fillText(Math.random() > 0.5 ? '1' : '0', x, trailY);
            // Restore main head pass
            this.context.shadowBlur = blurForThis;
          }
        } else {
          this.context.shadowBlur = glow.glowEnabled ? blurForThis : 0;
          this.context.fillStyle = col;
          this.context.globalAlpha = 1;
        }
        
        // Random binary digit or occasional special character
        let text;
        if (Math.random() > 0.98) {
          text = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
        } else {
          text = Math.random() > 0.5 ? '1' : '0';
        }
        
        this.context.fillText(text, x, trailY);
      }
      
      // Reset alpha
      this.context.globalAlpha = 1;
      
      // Move drop down at variable speed (scaled by quality)
      const speedMul = prof.speedMultiplier || 1.0;
      this.drops[i] += this.speeds[i] * speedMul;
      
      // Reset drop when it goes off screen
      if (this.drops[i] * this.fontSize > this.canvasHeight + trailLen * this.fontSize) {
        if (this.onDropHitBottom) {
          this.onDropHitBottom();
        }
        this.drops[i] = -Math.random() * 20;
        this.speeds[i] = 0.5 + Math.random() * 1.5;
      }
      
      if (Math.random() > 0.995) {
        this.speeds[i] = 0.5 + Math.random() * 1.5;
      }
    }
    
    // Reset shadow
    this.context.shadowBlur = 0;
  }
  
  update(deltaTime, elapsedTime) {
    // Update at specified interval
    if (elapsedTime - this.lastUpdate > this.updateInterval) {
      this._elapsedTime = elapsedTime;
      this.drawBinaryCode();
      this.texture.needsUpdate = true;
      this.lastUpdate = elapsedTime;

      // Update dynamic head lights (if any)
      if (this.headLights && this.headLights.length > 0) {
        const n = this._quadNormal();
        const offset = BinaryScreen.qualityProfile.headLightOffset || 0.12;
        for (const hl of this.headLights) {
          const col = Math.max(0, Math.min(this.columns - 1, hl.col));
          const headYPx = this.drops[col] * this.fontSize;
          const v = (headYPx % this.canvasHeight) / this.canvasHeight; // 0..1
          const u = (col + 0.5) / this.columns; // center of column
          const wp = this._uvToWorld(u, v).addScaledVector(n, offset);
          hl.light.position.copy(wp);
        }
      }

      // Adaptive close-up handling to avoid near-plane triangle clipping
      try {
        if (this.adaptiveDepthToggle) {
          const cam = (this.sceneRef && this.sceneRef.userData && this.sceneRef.userData.activeCamera) || (window && window.game && window.game.activeCamera) || null;
          if (cam && this.mesh && this.mesh.material) {
            const n = this._quadNormal();
            const p0 = this._orderedCorners && this._orderedCorners[0] ? this._orderedCorners[0] : this.mesh.getWorldPosition(new THREE.Vector3());
            const camPos = cam.getWorldPosition ? cam.getWorldPosition(new THREE.Vector3()) : cam.position;
            const toCam = camPos.clone().sub(p0);
            const dist = Math.abs(toCam.dot(n));
            const veryCloseThreshold = 0.18;
            this.mesh.material.depthTest = !(dist < veryCloseThreshold);
          }
        }
      } catch (e) {
        // ignore if camera not available
      }
    }
    
    // Optional: subtle pulsing light effect
    if (this.light) {
      const pulse = Math.sin(elapsedTime * 0.003) * 0.3 + 0.7;
      this.light.intensity = this.lightIntensity * pulse;
    }
  }
  
  addToScene(scene) {
    this.sceneRef = scene;
    scene.add(this.group);
  }
  
  removeFromScene(scene) {
    scene.remove(this.group);
  }
  
  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
    if (this.light) {
      this.light.position.set(x, y, z + 0.5);
    }
  }
  
  setRotation(x, y, z) {
    this.mesh.rotation.set(x, y, z);
  }
  
  dispose() {
    if (this.texture) this.texture.dispose();
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
    if (this.canvas) {
      this.canvas.width = 0;
      this.canvas.height = 0;
    }
  }
}

/**
 * Factory function to create a binary screen and add it to a scene
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {Object} options - Configuration options
 * @returns {BinaryScreen} The created binary screen instance
 */
export function createBinaryScreen(scene, options) {
  const screen = new BinaryScreen(options);
  screen.addToScene(scene);
  return screen;
}

/**
 * Create a BinaryScreen from four corner coordinates (auto size/orient upright)
 * corners: Array of 4 positions [x,y,z]. Order doesn't matter.
 * Assumptions: corners roughly form a rectangle on ground (similar y values).
 */
export function createBinaryScreenFromCorners(scene, corners, options = {}) {
  if (!Array.isArray(corners) || corners.length !== 4) {
    throw new Error('createBinaryScreenFromCorners requires exactly 4 corner positions');
  }

  // Convert to vectors
  const v = corners.map(c => new THREE.Vector3(c[0], c[1], c[2]));

  // Center (average of corners)
  const center = v.reduce((acc, p) => acc.add(p), new THREE.Vector3()).multiplyScalar(1 / 4);

  // Project to XZ plane for 2D analysis
  const pts2 = v.map(p => new THREE.Vector2(p.x, p.z));

  // PCA on XZ to find principal axes (width/height on ground footprint)
  let meanX = 0, meanZ = 0;
  for (const p of pts2) { meanX += p.x; meanZ += p.y; }
  meanX /= 4; meanZ /= 4;
  let covXX = 0, covXZ = 0, covZZ = 0;
  for (const p of pts2) {
    const dx = p.x - meanX;
    const dz = p.y - meanZ;
    covXX += dx * dx;
    covXZ += dx * dz;
    covZZ += dz * dz;
  }
  covXX /= 4; covXZ /= 4; covZZ /= 4;

  // Solve 2x2 eigenvectors manually
  const trace = covXX + covZZ;
  const det = covXX * covZZ - covXZ * covXZ;
  const temp = Math.sqrt(Math.max(0, trace * trace / 4 - det));
  const lambda0 = trace / 2 + temp; // major
  // const lambda1 = trace / 2 - temp; // minor

  // Major axis eigenvector
  let e0x = covXZ;
  let e0z = lambda0 - covXX;
  if (Math.abs(e0x) + Math.abs(e0z) < 1e-6) { // fallback
    e0x = 1; e0z = 0;
  }
  const e0Len = Math.hypot(e0x, e0z);
  e0x /= e0Len; e0z /= e0Len;

  // Minor orthogonal in XZ
  const e1x = -e0z;
  const e1z = e0x;

  // Extents along axes
  let min0 = Infinity, max0 = -Infinity, min1 = Infinity, max1 = -Infinity;
  for (const p of pts2) {
    const d0 = (p.x - meanX) * e0x + (p.y - meanZ) * e0z;
    const d1 = (p.x - meanX) * e1x + (p.y - meanZ) * e1z;
    if (d0 < min0) min0 = d0; if (d0 > max0) max0 = d0;
    if (d1 < min1) min1 = d1; if (d1 > max1) max1 = d1;
  }

  const width = Math.abs(max0 - min0);
  const groundMinor = Math.abs(max1 - min1);

  // Build 3D basis: X = major axis in XZ, Y = world up, Z = normal
  const widthDir = new THREE.Vector3(e0x, 0, e0z).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const normal = new THREE.Vector3().crossVectors(widthDir, up).normalize();

  // Height: use either provided options.height or infer from other ground side
  const height = options.height || groundMinor;

  // Rotation from basis
  const basis = new THREE.Matrix4().makeBasis(widthDir, up, normal);
  const quat = new THREE.Quaternion().setFromRotationMatrix(basis);
  const euler = new THREE.Euler().setFromQuaternion(quat);

  // Position: raise to center height
  const pos = new THREE.Vector3(center.x, center.y + height * 0.5, center.z);

  const screen = new BinaryScreen({
    ...options,
    position: [pos.x, pos.y, pos.z],
    width,
    height,
    rotation: [euler.x, euler.y, euler.z]
  });
  screen.addToScene(scene);
  return screen;
}

/**
 * Create a BinaryScreen from four exact corner coordinates (no auto width/height calc)
 * corners: Array of 4 positions [x,y,z]. Order doesn't matter.
 */
export function createBinaryScreenFromExactCorners(scene, corners, options = {}) {
  const screen = new BinaryScreen({ ...options, corners });
  screen.addToScene(scene);
  return screen;
}

/**
 * Helper function to add binary screen to level data
 * This can be called from level.js when loading level 1
 */
export function addBinaryScreenToLevel1(scene, options = {}) {
  // Default position for level 1 - you can customize these
  const defaultOptions = {
    position: [0, 5, -10], // x, y, z
    width: 6,
    height: 4,
    rotation: [0, 0, 0], // No rotation by default
    emitLight: true,
    lightIntensity: 3.0,
    lightDistance: 15,
    textColor: '#00ff00', // Classic green
    glowColor: 0x00ff00,
    updateInterval: 40 // Update every 40ms for smooth animation
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return createBinaryScreen(scene, mergedOptions);
}

