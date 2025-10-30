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
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
      points: options.points,
      color: options.color || 0x00ff00,  // Green
      intensity: options.intensity || 3.0,
      borderWidth: options.borderWidth || 0.15,
      ...options
    };

    this.mesh = null;
    this.material = null;
    this.light = null;
    this.time = 0;

    this.init();
  }

  init() {
    console.log('⚡ Creating Lightning Border');
    console.log('   Points:', this.options.points);
    console.log('   Color: Green lightning');

    // Create custom geometry for quad from 4 points
    const points = this.options.points;
    const positions = new Float32Array([
      ...points[0], // 0: p0 (bottom left)
      ...points[1], // 1: p1 (bottom right)
      ...points[2], // 2: p2 (top right)
      ...points[3]  // 3: p3 (top left)
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

    // Create shader material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(this.options.color) },
        uBorderWidth: { value: this.options.borderWidth },
        uIntensity: { value: this.options.intensity }
      },
      vertexShader,
      fragmentShader,
      transparent: true, // Keep transparent for proper look
      blending: THREE.AdditiveBlending, // Keep additive for glow effect
      side: THREE.DoubleSide,
      depthWrite: false // Transparent objects don't write depth
    });

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 999;
    // Skip deferred - render in forward pass AFTER lighting
    this.mesh.userData.skipDeferred = true;

    // Add to scene
    this.scene.add(this.mesh);

    console.log('✅ Lightning Border created (self-illuminated, no light needed)!');
  }
  
  update(deltaTime, elapsedTime) {
    if (!this.mesh || !this.material) return;
    
    const deltaSeconds = deltaTime / 1000;
    this.time += deltaSeconds;
    
    // Update shader time
    this.material.uniforms.uTime.value = this.time;
    
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

