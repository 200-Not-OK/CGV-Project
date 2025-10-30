import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

/**
 * Matrix Binary Shader - CODE-STYLED with PROPER SPACING
 * 100% GPU rendered - REAL-LOOKING 0s and 1s (95% binary!)
 * Characters move in SPARSE STREAMS with clear gaps between each character
 * 
 * Features:
 * - Cyan/blue color (sci-fi tech aesthetic!)
 * - Sparse streams with guaranteed gaps (never side-by-side)
 * - Vertical & horizontal spacing between characters (50% & 30% gaps)
 * - Subtle point lights for ambient illumination
 * - Gentle pulsing/breathing light animation
 * - Brighter cyan head characters
 * - Clean, readable Matrix-style aesthetic
 * - Quality tier support (LOW/MEDIUM/HIGH for performance optimization)
 * 
 * Perfect for glowing sci-fi doorways and tech corridors!
 */

// ============================================================================
// VERTEX SHADER
// ============================================================================
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ============================================================================
// FRAGMENT SHADER - WITH REAL TEXT-LIKE CHARACTERS
// ============================================================================
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uDensity;
  uniform float uBrightness;
  uniform float uFallStrength;
  
  varying vec2 vUv;
  varying vec3 vWorldPos;
  
  // Simple hash function
  float hash(vec2 p) {
    p = fract(p * vec2(123.456, 789.012));
    p += dot(p, p + 45.678);
    return fract(p.x * p.y);
  }
  
  // Multi-output hash for getting multiple random values
  vec3 hash3(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
  }
  
  // Cyan/Blue Tech Color (sci-fi aesthetic!)
  vec3 getCyberCyan(float variation) {
    // Bright cyan/blue for tech/sci-fi look
    return vec3(0.0, 0.83, 1.0);
  }
  
  // TEXT CHARACTER RENDERING - actual keyboard-like 0 and 1
  float getChar(float h, vec2 cellUV) {
    vec2 uv = (cellUV - 0.5) * 2.2; // Scale for better character size
    float mask = 0.0;
    
    // 95% binary (0 and 1 only!)
    if (h < 0.95) {
      float binaryChoice = step(0.5, fract(h * 100.0));
      
      if (binaryChoice < 0.5) {
        // "0" - Oval zero like keyboard/terminal text
        vec2 p = uv / vec2(0.5, 0.7); // Oval shape
        float outer = length(p);
        float ring = smoothstep(1.0, 0.85, outer) - smoothstep(0.65, 0.5, outer);
        mask = ring;
      } else {
        // "1" - Straight vertical one like keyboard text
        float stem = smoothstep(0.18, 0.12, abs(uv.x));
        // Small diagonal top (like many fonts have)
        float top = smoothstep(0.15, 0.08, abs((uv.x + 0.15) - (uv.y - 0.5) * 0.4)) * 
                    step(0.3, uv.y) * step(uv.y, 0.7);
        mask = max(stem, top);
      }
    } else {
      // Very rare other characters
      float charType = fract(h * 73.456);
      if (charType < 0.5) {
        mask = smoothstep(0.25, 0.15, length(uv - vec2(0.0, -0.6))); // dot
      } else {
        mask = smoothstep(0.12, 0.08, abs(uv.y)) * step(abs(uv.x), 0.6); // dash
      }
    }
    
    return clamp(mask, 0.0, 1.0);
  }
  
  void main() {
    // Setup columns
    float cols = uDensity;
    float columnIndex = floor(vUv.x * cols);
    float columnUV = fract(vUv.x * cols);
    
    // Column properties with extra randomness
    vec3 colRandom = hash3(vec2(columnIndex, 0.0));
    float colSeed = colRandom.x;
    
    // SPARSE COLUMNS - Only show 40% of columns (ensures gaps between streams)
    float columnVisible = step(0.6, colSeed); // 40% of columns active
    if (columnVisible < 0.5) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }
    
    float colSpeed = uSpeed * (0.7 + colSeed * 0.6);
    float colOffset = colSeed * 100.0;
    
    // Create rows - fewer rows since we're adding spacing
    float rows = cols * 1.0; // Reduced for clearer spacing
    
    // Base scrolling Y position (CONTINUOUS - no fract yet!)
    float scrollBase = vUv.y + uTime * colSpeed * 0.03 - colOffset;
    float scrollY = fract(scrollBase);
    
    // Get character for this cell
    float cellIndex = floor(scrollBase * rows);
    vec3 cellRandom = hash3(vec2(columnIndex, cellIndex));
    float charHash = cellRandom.x;
    
    // CREATE MATRIX-STYLE STREAMS with trailing fade
    // Each column has a "rain" that moves down continuously
    float rainPosition = fract(scrollBase * 0.25 + colRandom.y * 100.0);
    
    // Distance from head of the rain (0 = head, 1 = far behind)
    float distanceFromHead = scrollY - rainPosition;
    if (distanceFromHead < 0.0) distanceFromHead += 1.0; // Wrap around
    
    // Stream length - characters trail behind the head
    float streamLength = 0.3 + colRandom.z * 0.3;
    float inStream = step(distanceFromHead, streamLength);
    
    // Don't exit early - we need to calculate everything for visibility
    if (inStream < 0.01) {
      // Still need to render transparent for proper blending
      inStream = 0.0;
    }
    
    // FALLING EFFECT - Subtle and cyclic (won't disappear permanently)
    float fallTrigger = cellRandom.y;
    float fallTime = cellRandom.z * 10.0;
    
    // Much more subtle falling that cycles
    float fallPhase = fract((uTime * 0.15 + fallTime) / 10.0); // Cycles every 10 seconds
    float atBottom = smoothstep(0.8, 0.95, scrollY);
    float shouldFall = step(0.7, fallTrigger) * atBottom; // Only 30% fall
    
    // Subtle falling animation
    float fallDistance = fallPhase * uFallStrength * 0.3; // Much less distance
    
    // Minimal horizontal drift
    float horizontalDrift = sin(fallPhase * 2.0 + cellRandom.x * 6.28) * 0.1 * fallPhase;
    
    // Apply falling to Y position
    float modifiedScrollY = scrollY;
    float fallingY = scrollY + fallDistance * shouldFall;
    
    // Keep characters mostly visible even when falling
    float fallFade = mix(1.0, 0.7, fallPhase * shouldFall);
    
    // Row calculation
    float rowIndex = floor(fallingY * rows);
    float rowUV = fract(fallingY * rows);
    
    // ADD VERTICAL SPACING - only show character in middle 50% of cell
    // This creates clear gaps between characters vertically (like Matrix!)
    float verticalPadding = 0.25; // 25% gap on top and bottom = 50% gap total
    float spacedRowUV = (rowUV - verticalPadding) / (1.0 - 2.0 * verticalPadding);
    
    // If outside the character area, don't render
    float inVerticalBounds = step(verticalPadding, rowUV) * step(rowUV, 1.0 - verticalPadding);
    
    // Modify columnUV for horizontal drift
    float driftedColumnUV = columnUV + horizontalDrift * shouldFall;
    driftedColumnUV = fract(driftedColumnUV); // Keep in bounds
    
    // ADD HORIZONTAL SPACING - only show character in middle 70% of cell
    float horizontalPadding = 0.15; // 15% gap on left and right
    float spacedColumnUV = (driftedColumnUV - horizontalPadding) / (1.0 - 2.0 * horizontalPadding);
    float inHorizontalBounds = step(horizontalPadding, driftedColumnUV) * step(driftedColumnUV, 1.0 - horizontalPadding);
    
    // Render character with proper spacing (both vertical and horizontal)
    float charMask = getChar(charHash, vec2(spacedColumnUV, spacedRowUV)) * inVerticalBounds * inHorizontalBounds;
    
    // Apply stream visibility to character
    charMask *= inStream;
    
    // Add glitch/breakup effect as it falls
    float glitchNoise = hash(vec2(cellIndex, floor(fallPhase * 10.0)));
    float glitchAmount = shouldFall * fallDistance * 2.0;
    charMask *= mix(1.0, glitchNoise, clamp(glitchAmount, 0.0, 0.8));
    
    // MATRIX EFFECT - Head is BRIGHT WHITE, tail fades to dark green
    // Distance from head determines brightness (0 = head, streamLength = tail)
    float fadePosition = distanceFromHead / max(streamLength, 0.01);
    
    // Head character is SUPER BRIGHT (almost white)
    float headBrightness = 1.0 - smoothstep(0.0, 0.05, distanceFromHead);
    
    // Trail fades exponentially
    float trailFade = exp(-fadePosition * 3.0); // Exponential fade
    
    float brightness = mix(trailFade, 1.0, headBrightness) * fallFade;
    
    // Get VIBRANT CYAN color
    vec3 techColor = getCyberCyan(charHash);
    
    // HEAD CHARACTER is brighter (keep it cyan/blue!)
    if (headBrightness > 0.5) {
      techColor = vec3(0.7, 0.9, 1.0); // Bright cyan with slight white tint
    }
    
    // Add slight color shift for falling characters (electric blue sparks)
    if (shouldFall > 0.5 && fallDistance > 0.1) {
      float sparkiness = clamp(fallDistance * 0.8, 0.0, 1.0);
      vec3 sparkColor = mix(techColor, vec3(0.5, 0.7, 1.0), sparkiness * 0.2);
      techColor = sparkColor;
    }
    
    // CODE-STYLED INTENSITY - luminous but not overwhelming
    float baseIntensity = charMask * brightness * uBrightness * 2.5;
    
    // Moderate glow for light emission
    float glowAmount = charMask * brightness * 1.5;
    
    float totalIntensity = baseIntensity + glowAmount;
    
    // OUTPUT - bright terminal green (code-styled!)
    vec3 finalColor = techColor * totalIntensity;
    
    // Add subtle bloom on heads only
    finalColor += techColor * charMask * headBrightness * 0.8;
    
    float alpha = clamp(totalIntensity, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ============================================================================
// MATERIAL CLASS
// ============================================================================
export class MatrixShaderMaterial extends THREE.ShaderMaterial {
  constructor(options = {}) {
    // Add random time offset for variation between instances
    const timeOffset = Math.random() * 100;
    
    const uniforms = {
      uTime: { value: timeOffset },
      uColor: { value: new THREE.Color(options.color || 0x00d4ff) },  // Cyan/blue
      uSpeed: { value: options.speed || 8.0 },
      uDensity: { value: options.density || 12.0 },  // 40% visible = ~5 streams with gaps
      uBrightness: { value: options.brightness || 3.0 },  // Code-styled brightness
      uFallStrength: { value: options.fallStrength || 0.5 }
    };

    super({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true, // Keep transparent
      blending: THREE.AdditiveBlending, // Keep additive blending for glow
      depthWrite: false, // Transparent no depth write
      depthTest: true,
      side: THREE.DoubleSide // Render both sides for visibility from all angles
    });
    
    // Mark to skip deferred - render in forward pass
    this.userData = this.userData || {};
    this.userData.skipDeferred = true;
    
    console.log('✨ MatrixShaderMaterial created with time offset:', timeOffset.toFixed(2));
  }

  update(deltaTime) {
    if (this.uniforms && this.uniforms.uTime) {
      this.uniforms.uTime.value += deltaTime;
    }
  }
}

// ============================================================================
// MESH COMPONENT
// ============================================================================
export class MatrixShaderMesh {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = {
      position: options.position || [0, 5, 0],
      width: options.width || 4.0,
      height: options.height || 10.0,
      rotation: options.rotation || [0, 0, 0],
      color: options.color || 0x00d4ff,
      speed: options.speed || 7.0,
      density: options.density || 12,  // Higher density, but only 40% show (= 4-5 streams with gaps)
      brightness: options.brightness || 3.0,  // Moderate brightness - code-styled
      fallStrength: options.fallStrength || 0.5,
      lightIntensity: options.lightIntensity || 1.5,  // Subtle ambient light
      lightDistance: options.lightDistance || 6.0,   // Shorter range
      qualityTier: options.qualityTier || 'MEDIUM',  // Store quality tier
      ...options
    };

    this.group = new THREE.Group();
    this.mesh = null;
    this.material = null;
    this.lights = [];  // Array to hold point lights

    this.init();
  }

  init() {
    console.log('💙 Creating CODE-STYLED Binary Streams with Spacing');
    console.log('   Position:', this.options.position);
    console.log('   Size:', this.options.width, 'x', this.options.height);
    console.log('   Density:', this.options.density, '(40% visible, spaced columns)');
    console.log('   Brightness:', this.options.brightness);
    console.log('   ✅ Spaced 0s & 1s, Cyber Cyan, Self-Illuminated!');

    // Create cylinder geometry with quality-based segment count
    const radius = this.options.width / (2 * Math.PI);
    
    // Reduce geometry complexity based on quality
    let segments = 24; // Default for HIGH
    if (this.options.qualityTier === 'LOW') {
      segments = 8; // Much fewer segments for LOW
    } else if (this.options.qualityTier === 'MEDIUM') {
      segments = 12; // Half segments for MEDIUM
    }
    
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      this.options.height,
      segments,  // Quality-based segment count
      1,
      true // Open ended
    );

    // Create material with falling effect
    this.material = new MatrixShaderMaterial({
      color: this.options.color,
      speed: this.options.speed,
      density: this.options.density,
      brightness: this.options.brightness,
      fallStrength: this.options.fallStrength
    });

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    
    // Mesh stays at origin, we'll position the group instead
    this.mesh.position.set(0, 0, 0);
    
    // Critical rendering settings
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    this.mesh.visible = true;
    this.mesh.frustumCulled = false;  // NEVER cull this mesh
    this.mesh.renderOrder = 999;  // Render late for proper transparency
    
    // Force the material to render from both sides
    this.material.side = THREE.DoubleSide;

    // Add to group
    this.group.add(this.mesh);
    
    // CREATE LIGHT SOURCES - Multiple point lights for ambient illumination
    const lightColor = new THREE.Color(this.options.color);
    const numLights = 3;  // Top, middle, bottom
    
    // No lights needed - binary shader is self-illuminated!
    
    // Position the entire group
    this.group.position.set(
      this.options.position[0],
      this.options.position[1] - this.options.height / 2,
      this.options.position[2]
    );
    this.group.rotation.set(...this.options.rotation);
    this.group.frustumCulled = false;  // NEVER cull the group
    
    this.scene.add(this.group);
    
    console.log('✅ Cyber-styled Binary Shader created successfully!');
    console.log('   Cylinder radius:', radius.toFixed(3));
    console.log('   NO LIGHTS - Self-illuminated shader!');
    console.log('   Character spacing: 50% vertical, 30% horizontal');
    console.log('   💙 Clean, readable 0s & 1s with proper gaps!');
  }

  update(deltaTime, elapsedTime) {
    // deltaTime might be in milliseconds OR seconds - check and handle both
    // If deltaTime > 1, it's likely in milliseconds, otherwise it's in seconds
    const deltaSeconds = deltaTime > 1 ? deltaTime / 1000 : deltaTime;
    
    if (this.material) {
      this.material.update(deltaSeconds);
    }
    
    // No lights to update - shader is self-illuminated!
  }

  setPosition(x, y, z) {
    this.group.position.set(x, y - this.options.height / 2, z);
  }

  setRotation(x, y, z) {
    this.group.rotation.set(x, y, z);
  }

  dispose() {
    // No lights to dispose!
    this.lights = [];
    
    // Dispose of material and geometry
    if (this.material) this.material.dispose();
    if (this.mesh) this.mesh.geometry.dispose();
    if (this.group) this.scene.remove(this.group);
  }
}

// ============================================================================
// LIGHT COMPONENT - For integration with game's lighting system
// ============================================================================
export class BinaryShader extends LightComponent {
  constructor(props = {}) {
    super(props);
    this.binaryShaderMesh = null;
  }

  mount(scene) {
    // Get quality settings if available
    const quality = this.props.quality || {};
    const qualityTier = quality.tier || 'MEDIUM';
    
    // AGGRESSIVE optimization for low-end devices
    let densityMultiplier = 1.0;
    let brightnessMultiplier = 1.0;
    let speedMultiplier = 1.0;
    let skipInstance = false;
    
    if (qualityTier === 'LOW') {
      // VERY aggressive reduction for integrated GPUs
      densityMultiplier = 0.25; // Only 25% of streams
      brightnessMultiplier = 0.6; // Much dimmer
      speedMultiplier = 0.7; // Slower to reduce GPU load
      
      // Skip every other instance on LOW to reduce total count
      if (!BinaryShader._instanceCount) BinaryShader._instanceCount = 0;
      BinaryShader._instanceCount++;
      if (BinaryShader._instanceCount % 2 === 0) {
        skipInstance = true;
      }
    } else if (qualityTier === 'MEDIUM') {
      densityMultiplier = 0.5; // Half density
      brightnessMultiplier = 0.75;
      speedMultiplier = 0.85;
    }
    // HIGH uses full quality (multiplier = 1.0)
    
    // If we should skip this instance on LOW quality, don't mount it
    if (skipInstance) {
      console.log('💙 BinaryShader SKIPPED (LOW quality optimization)');
      this._mounted = false;
      return;
    }
    
    const options = {
      position: this.props.position || [0, 5, 0],
      width: this.props.width || 4.0,
      height: this.props.height || 10.0,
      color: this.props.color || 0x00d4ff,
      speed: (this.props.speed || 7.0) * speedMultiplier,
      density: (this.props.density || 12.0) * densityMultiplier,
      brightness: (this.props.brightness || 3.0) * brightnessMultiplier,
      fallStrength: this.props.fallStrength || 0.5,
      qualityTier: qualityTier,  // Pass quality tier to mesh
      ...this.props
    };

    this.binaryShaderMesh = new MatrixShaderMesh(scene, options);
    this._mounted = true;

    console.log('💙 BinaryShader light mounted:', {
      position: options.position,
      width: options.width,
      height: options.height,
      color: `0x${options.color.toString(16)}`,
      quality: qualityTier,
      density: options.density.toFixed(1),
      speed: options.speed.toFixed(1)
    });
  }

  unmount(scene) {
    if (this.binaryShaderMesh) {
      this.binaryShaderMesh.dispose();
      this.binaryShaderMesh = null;
    }
    this._mounted = false;
  }

  update(deltaTime) {
    if (this.binaryShaderMesh && this._mounted) {
      // Pass deltaTime directly - MatrixShaderMesh will handle the conversion
      if (!this.elapsedTime) this.elapsedTime = 0;
      const dt = deltaTime > 1 ? deltaTime / 1000 : deltaTime; // Convert to seconds if needed
      this.elapsedTime += dt;
      this.binaryShaderMesh.update(deltaTime, this.elapsedTime);
      
      // Debug logging disabled for performance
    }
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================
export function createBinaryShader(scene, options) {
  return new MatrixShaderMesh(scene, options);
}

// ============================================================================
// PRESETS
// ============================================================================
export const BinaryShaderPresets = {
  tree: {
    width: 4.0,
    height: 4.0,
    speed: 6.0,
    density: 12,  // 40% show = 4-5 streams with guaranteed gaps
    brightness: 3.0,  // Code-styled - not too bright
    fallStrength: 0.5,
    lightIntensity: 1.5,  // Subtle ambient glow
    lightDistance: 6.0
  },
  
  etherealString: {
    width: 2.5,
    height: 4.0,
    speed: 4.0,
    density: 10,  // 40% show = 3-4 streams with gaps
    brightness: 2.8,  // Code-styled
    fallStrength: 0.7,
    lightIntensity: 1.2,  // Soft glow
    lightDistance: 5.0
  },
  
  sciFiBranch: {
    width: 3.0,
    height: 5.0,
    speed: 7.0,
    density: 15,  // 40% show = 5-6 streams with gaps
    brightness: 3.5,  // Brighter but still code-styled
    fallStrength: 0.6,
    lightIntensity: 2.0,  // Moderate glow
    lightDistance: 7.0
  }
};
