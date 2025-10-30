import * as THREE from 'three';

/**
 * Advanced Shader System for Dark Castle Theme
 * Provides atmospheric lighting, shadows, and visual enhancements
 */
export class ShaderSystem {
  constructor(renderer, scene) {
    this.renderer = renderer;
    this.scene = scene;
    this.enhancedMaterials = new Map();
    this.originalMaterials = new Map(); // Store original materials for toggling
    this.shadersEnabled = true; // Track shader state
    this._lastToonSettings = {}; // Live-tunable toon uniforms
    
    this.setupRenderer();
  }

  setupRenderer() {
    // Enable high-quality shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
    
    // Enhanced rendering settings
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    
    // Enable physically correct lighting
    this.renderer.useLegacyLights = false;
    
    console.log('🎨 Shader System: Renderer enhanced with shadow mapping');
  }

  /**
   * Apply atmospheric shader to a mesh for enhanced castle ambiance
   */
  applyAtmosphericShader(mesh, options = {}) {
    if (!mesh.isMesh) return;
    
    // Skip if this is a star or other special object
    if (mesh.userData.isStar || mesh.userData.skipShader) return;
    
    const originalMaterial = mesh.material;
    
    // Store original material if not already stored
    if (!this.originalMaterials.has(mesh.uuid)) {
      this.originalMaterials.set(mesh.uuid, originalMaterial);
    }
    
    // Create enhanced material with atmospheric properties
    let enhancedMaterial;
    
    if (originalMaterial.map) {
      // Has texture - use MeshStandardMaterial for PBR
      enhancedMaterial = new THREE.MeshStandardMaterial({
        map: originalMaterial.map,
        normalMap: originalMaterial.normalMap,
        roughnessMap: originalMaterial.roughnessMap,
        metalnessMap: originalMaterial.metalnessMap,
        
        // Enhanced properties for dark castle
        roughness: options.roughness ?? 0.8,
        metalness: options.metalness ?? 0.2,
        
        // Subtle emissive for firelight reflection
        emissive: options.emissive ?? new THREE.Color(0x000000),
        emissiveIntensity: options.emissiveIntensity ?? 0.0,
        
        // Enable shadows
        shadowSide: THREE.FrontSide,
      });
    } else {
      // No texture - use color-based material
      enhancedMaterial = new THREE.MeshStandardMaterial({
        color: originalMaterial.color || 0x808080,
        
        roughness: options.roughness ?? 0.8,
        metalness: options.metalness ?? 0.2,
        
        emissive: options.emissive ?? new THREE.Color(0x000000),
        emissiveIntensity: options.emissiveIntensity ?? 0.0,
        
        shadowSide: THREE.FrontSide,
      });
    }
    
    // Apply the enhanced material
    mesh.material = enhancedMaterial;
    
    // Enable shadow casting and receiving
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // Store reference
    this.enhancedMaterials.set(mesh.uuid, enhancedMaterial);
    
    return enhancedMaterial;
  }

  /**
   * Apply character shader with enhanced lighting response
   */
  applyCharacterShader(mesh, options = {}) {
    if (!mesh.isMesh) return;
    
    // Skip if this is a star or other special object
    if (mesh.userData.isStar || mesh.userData.skipShader) return;
    
    const originalMaterial = mesh.material;
    
    // Store original material if not already stored
    if (!this.originalMaterials.has(mesh.uuid)) {
      this.originalMaterials.set(mesh.uuid, originalMaterial);
    }
    
    // Character gets enhanced material with better light interaction
    const characterMaterial = new THREE.MeshStandardMaterial({
      map: originalMaterial.map,
      normalMap: originalMaterial.normalMap,
      
      // Character-specific properties
      roughness: options.roughness ?? 0.6,
      metalness: options.metalness ?? 0.1,
      
      // Much brighter rim lighting effect via emissive
      emissive: options.rimColor ?? new THREE.Color(0x4a4a6e),
      emissiveIntensity: options.rimIntensity ?? 0.45,
      
      // Enable shadows
      shadowSide: THREE.DoubleSide,
    });
    
    mesh.material = characterMaterial;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    this.enhancedMaterials.set(mesh.uuid, characterMaterial);
    
    return characterMaterial;
  }

  /**
   * Apply stone/wall shader for castle surfaces
   */
  applyCastleStoneShader(mesh, options = {}) {
    return this.applyAtmosphericShader(mesh, {
      roughness: 0.9,
      metalness: 0.0,
      emissive: new THREE.Color(0x0a0a0f), // Very subtle blue-ish tint
      emissiveIntensity: 0.05,
      ...options
    });
  }

  /**
   * Apply metal shader for weapons, armor, etc.
   */
  applyMetalShader(mesh, options = {}) {
    return this.applyAtmosphericShader(mesh, {
      roughness: 0.3,
      metalness: 0.9,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.0,
      ...options
    });
  }

  /**
   * Process entire object hierarchy and apply shaders
   */
  processObject(object, shaderType = 'atmospheric') {
    object.traverse((child) => {
      if (child.isMesh) {
        switch(shaderType) {
          case 'character':
            this.applyCharacterShader(child);
            break;
          case 'stone':
            this.applyCastleStoneShader(child);
            break;
          case 'metal':
            this.applyMetalShader(child);
            break;
          case 'atmospheric':
          default:
            this.applyAtmosphericShader(child);
            break;
        }
      }
    });
    
    console.log(`🎨 Shader System: Processed object with '${shaderType}' shader`);
  }

  /**
   * Enable shadows for all meshes in an object
   */
  enableShadows(object, cast = true, receive = true) {
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = cast;
        child.receiveShadow = receive;
      }
    });
  }

  /**
   * Configure light for optimal castle shadows
   */
  configureLightShadows(light, options = {}) {
    light.castShadow = true;
    
    // Shadow quality settings
    light.shadow.mapSize.width = options.shadowMapSize ?? 2048;
    light.shadow.mapSize.height = options.shadowMapSize ?? 2048;
    light.shadow.bias = options.shadowBias ?? -0.001;
    light.shadow.normalBias = options.normalBias ?? 0.02;
    
    // For DirectionalLight and SpotLight
    if (light.shadow.camera) {
      light.shadow.camera.near = options.near ?? 0.5;
      light.shadow.camera.far = options.far ?? 100;
      
      if (light.isDirectionalLight) {
        const size = options.shadowCameraSize ?? 50;
        light.shadow.camera.left = -size;
        light.shadow.camera.right = size;
        light.shadow.camera.top = size;
        light.shadow.camera.bottom = -size;
      }
    }
    
    // For PointLight
    if (light.isPointLight) {
      light.shadow.camera.near = options.near ?? 0.5;
      light.shadow.camera.far = options.far ?? 100;
      light.decay = 2; // Physical light decay
    }
    
    console.log(`🎨 Shader System: Configured shadows for ${light.type}`);
  }

  /**
   * Custom vertex and fragment shaders for special effects
   */
  createCustomShader(options = {}) {
    const vertexShader = options.vertexShader || `
      varying vec3 vNormal;
      varying vec3 vNormalWorld;
      varying vec3 vPosition;
      varying vec3 vWorldPos;
      varying vec2 vUv;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vNormalWorld = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShader = options.fragmentShader || `
      uniform vec3 lightPosition;
      uniform vec3 lightColor;
      uniform float lightIntensity;
      uniform vec3 baseColor;
      uniform float roughness;
      uniform sampler2D map;
      uniform float useMap;
      uniform vec3 sunDir;        // normalized direction to sun (world->light)
      uniform vec3 sunColor;
      uniform vec3 ambientColor;
      uniform vec3 cameraPositionWorld;
      uniform vec3 worldUp;
      // Hand-drawn controls
      uniform float time;            // seconds
      uniform float hatchStrength;   // 0..1 amount of shadow hatching
      uniform float hatchScale;      // stripes density (units)
      uniform float hatchContrast;   // 0.5..2.0 sharpening of hatch mask
      uniform float boilStrength;    // subtle time wobble
      uniform float boilSpeed;       // speed of wobble
      uniform float grainStrength;   // paper grain strength 0..0.2
      // Dark material lifting (ink-friendly)
      uniform float albedoLift;      // 0..1 lifts very dark albedo toward mid-tones
      uniform vec3 darkTintColor;    // small warm tint for near-black materials
      uniform float darkTintStrength;// 0..0.5 strength of tint on darks
      // Selective hue de-saturation (e.g., clamp greens)
      uniform vec3 hueDesatCenter;   // axis of target hue in RGB space (normalized)
      uniform float hueDesatWidth;   // 0..1, cosine similarity threshold start
      uniform float hueDesatStrength;// 0..1 amount to reduce saturation for that hue
      uniform float hueDimStrength;  // 0..1 darken amount for that hue
      // Second selective band (e.g., yellows)
      uniform vec3 hue2DesatCenter;
      uniform float hue2DesatWidth;
      uniform float hue2DesatStrength;
      uniform float hue2DimStrength;
      // Highlight whitening to keep whites clean
      uniform float highlightWhiteBoost;     // 0..0.25 amount to push toward white
      uniform float highlightWhiteThreshold; // 0..1 threshold to start whitening
      uniform vec3 highlightTintColor;       // target tint for near-whites (cream)
      uniform vec3 rimColor;
      uniform float rimIntensity;
      uniform float rimPower;
      uniform vec3 specColor;
      uniform float specIntensity;
      uniform float specPower;
      // Toon controls
      uniform float toonDiffuseSteps; // e.g., 3.0 for banded diffuse
      uniform float toonSpecSteps;    // e.g., 2.0 for crisp spec
      uniform float toonSoftness;     // 0..0.5 softens band edges to reduce popping
      uniform float outlineStrength;  // 0..1 darkening near edges
      uniform float outlinePower;     // controls edge falloff
      // Sun wrap amount (0..1) controls how much light wraps around silhouettes
      uniform float sunWrap;
      // Color pop controls
      uniform float saturationBoost; // uniform boost to saturation
      uniform float vibrance;        // boosts low-sat colors more than already vibrant ones
      uniform float shadowLift;      // gently lifts deep shadows
      // Posterize control (0 or <2 disables)
      uniform float posterizeLevels; // e.g., 5.0 for 5 steps per channel
      // Exposure (to avoid double tone mapping with renderer)
      uniform float exposure;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      varying vec2 vUv;
      
      float softQuantize(float x, float steps, float softness) {
        if (steps < 0.5) return x;
        float scaled = x * steps;
        float idx = floor(scaled);
        float t = fract(scaled);
        // clamp softness to safe range
        float s = smoothstep(0.5 - softness, 0.5 + softness, t);
        return (idx + s) / steps;
      }

      // Rotate 2D
      mat2 rot2(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

      // Stripe pattern [0..1], 1 = line
      float stripe(vec2 uv, float width){
        float s = 0.5 + 0.5 * sin(uv.x);
        return smoothstep(1.0 - width, 1.0, s);
      }

      // Cheap hash
      float hash21(vec2 p){
        p = fract(p*vec2(123.34, 345.45));
        p += dot(p, p+34.345);
        return fract(p.x*p.y);
      }

      void main() {
        // normals in view space
        vec3 N = normalize(vNormal);
        // light direction in view space for point light fallback
        vec3 Lp = normalize(lightPosition - vPosition);
        // view vector (approx in view space)
        vec3 V = normalize(-vPosition);
        // transform world-space sunDir into view space to avoid camera-relative banding
        vec3 sunDirView = normalize((viewMatrix * vec4(sunDir, 0.0)).xyz);
        
        // Albedo
        vec3 albedo = baseColor;
        if (useMap > 0.5) {
          vec4 tex = texture2D(map, vUv);
          albedo = tex.rgb;
        }
        // Lift extremely dark albedo to avoid crushed blacks on wood/ground
        if (albedoLift > 0.001) {
          float Ya = dot(albedo, vec3(0.299, 0.587, 0.114));
          float darkMask = 1.0 - smoothstep(0.10, 0.35, Ya);
          vec3 towardMid = albedo + (vec3(1.0) - albedo) * 0.35; // gentle lift
          albedo = mix(albedo, towardMid, clamp(albedoLift, 0.0, 1.0) * darkMask);
          albedo += darkTintColor * (clamp(darkTintStrength, 0.0, 0.5) * darkMask);
          albedo = clamp(albedo, 0.0, 1.0);
        }
        
        // Diffuse terms: point light and directional sun tint
        float ndl_point = max(dot(N, Lp), 0.0);
        float ndl_sun_raw = dot(N, sunDirView);
        float ndl_sun = clamp((ndl_sun_raw + sunWrap) / (1.0 + sunWrap), 0.0, 1.0);

        // Toon banding for diffuse
        float dPoint = ndl_point;
        float dSun = ndl_sun;
        if (toonDiffuseSteps > 0.5) {
          float softness = clamp(toonSoftness, 0.0, 0.45);
          dPoint = softQuantize(dPoint, toonDiffuseSteps, softness);
          dSun = softQuantize(dSun, toonDiffuseSteps, softness);
        }
        vec3 diffuse = lightColor * lightIntensity * dPoint + sunColor * dSun;
        
        // Specular (Blinn-Phong)
        vec3 H = normalize(Lp + V);
        float ndh = max(dot(N, H), 0.0);
        float spec = pow(ndh, specPower) * specIntensity * (0.04 + (1.0 - roughness) * 0.5);
        spec *= lightIntensity; // disable point-spec when point light is off
        if (toonSpecSteps > 0.5) {
          float softness = clamp(toonSoftness, 0.0, 0.45);
          spec = softQuantize(spec, toonSpecSteps, softness);
        }
        vec3 specular = specColor * spec;
        
        // Rim (Fresnel-like)
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), rimPower);
        vec3 rim = rimColor * fresnel * rimIntensity;
        // Suppress rim on upward-facing flat surfaces (avoids dark ring on ground)
        float upDot = abs(dot(normalize(vNormalWorld), normalize(worldUp)));
        float rimMask = 1.0 - smoothstep(0.6, 0.9, upDot);
        rim *= rimMask;
        
        // Ambient
        vec3 ambient = ambientColor;
        
        vec3 lit = albedo * (ambient + diffuse) + specular + rim;
        // Apply exposure; rely on renderer ACES toneMapping
        vec3 finalColor = lit * exposure;

        // Hand-drawn hatching in shadowed regions (cheap procedural)
        if (hatchStrength > 0.001) {
          float scale = max(hatchScale, 0.0001);
          float ph = time * boilSpeed * 1.2;
          vec2 baseUV = vWorldPos.xz * scale + boilStrength * vec2(
            sin(vWorldPos.x * 0.35 + ph), cos(vWorldPos.z * 0.27 - ph)
          );
          float l0 = stripe(baseUV * rot2(radians(0.0)), 0.22);
          float l1 = stripe(baseUV * rot2(radians(60.0)), 0.22);
          float l2 = stripe(baseUV * rot2(radians(120.0)), 0.22);
          float hatch = max(l0, max(l1, l2));
          // darken more in shadows
          float shade = clamp(1.0 - (dSun*0.85 + dPoint*0.15), 0.0, 1.0);
          hatch = pow(hatch * shade, clamp(hatchContrast, 0.5, 2.0));
          finalColor *= (1.0 - hatchStrength * hatch);
        }

        // Cartoon-style outline via view-angle darkening
        if (outlineStrength > 0.001) {
          float edge = pow(1.0 - max(dot(N, V), 0.0), outlinePower);
          finalColor *= (1.0 - outlineStrength * edge);
        }

        // Vibrance & saturation boosting (post-light)
        float Y = dot(finalColor, vec3(0.299, 0.587, 0.114));
        vec3 fromGray = finalColor - vec3(Y);
        float sat = length(fromGray) / (Y + 1e-3);
        float vibr = vibrance * (1.0 - clamp(sat, 0.0, 1.0));
        float satBoost = saturationBoost + vibr;
        finalColor += fromGray * satBoost;

        // Selective hue de-saturation + dimming for target bands
        {
          vec3 hVec = fromGray;
          float lenh = max(length(hVec), 1e-4);
          vec3 hDir = hVec / lenh;
          // Band 1 (e.g., green, blue, purple)
          if (abs(hueDesatStrength) > 0.001 || hueDimStrength > 0.001) {
            vec3 axis1 = normalize(hueDesatCenter);
            float sim1 = max(0.0, dot(axis1, hDir));
            float m1 = smoothstep(hueDesatWidth, 1.0, sim1);
            finalColor -= fromGray * (hueDesatStrength * m1);
            finalColor *= (1.0 - hueDimStrength * m1);
          }
          // Band 2 (e.g., yellow)
          if (abs(hue2DesatStrength) > 0.001 || hue2DimStrength > 0.001) {
            vec3 axis2 = normalize(hue2DesatCenter);
            float sim2 = max(0.0, dot(axis2, hDir));
            float m2 = smoothstep(hue2DesatWidth, 1.0, sim2);
            finalColor -= fromGray * (hue2DesatStrength * m2);
            finalColor *= (1.0 - hue2DimStrength * m2);
          }
        }

        // Gentle shadow lift (protect highlights)
        float liftAmount = shadowLift * max(0.0, 0.3 - Y);
        finalColor += liftAmount * (vec3(1.0) - finalColor) * 0.35;
        
        // Posterize after color adjustments
        if (posterizeLevels > 1.5) {
          finalColor = floor(finalColor * posterizeLevels) / posterizeLevels;
        }

        // Paper grain
        if (grainStrength > 0.001) {
          float g = hash21(vWorldPos.xy * 0.75 + time * 0.5);
          finalColor += (g - 0.5) * grainStrength;
        }
        // Keep whites clean and neutral
        if (highlightWhiteBoost > 0.001) {
          float Y2 = dot(finalColor, vec3(0.299, 0.587, 0.114));
          float wMask = smoothstep(highlightWhiteThreshold, 1.0, Y2);
          finalColor = mix(finalColor, highlightTintColor, wMask * highlightWhiteBoost);
        }
        // Slight lift for upward-facing surfaces (ground) to avoid overly dark floors
        float upDot2 = abs(dot(normalize(vNormalWorld), normalize(worldUp)));
        float groundMask = smoothstep(0.65, 0.95, upDot2);
        finalColor += (vec3(1.0) - finalColor) * groundMask * 0.06;
        finalColor = clamp(finalColor, 0.0, 1.0);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
    
      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
        lightPosition: { value: new THREE.Vector3(0, 10, 0) },
        lightColor: { value: new THREE.Color(0xffffff) },
        lightIntensity: { value: 0.0 },
        baseColor: { value: new THREE.Color(0x808080) },
        roughness: { value: 0.8 },
        map: { value: options.uniforms?.map?.value || null },
        useMap: { value: options.uniforms?.map?.value ? 1.0 : 0.0 },
        sunDir: { value: new THREE.Vector3(0.6, 0.8, 0.2).normalize() },
        sunColor: { value: new THREE.Color(0xffe6b0).multiplyScalar(6.0) },
        ambientColor: { value: new THREE.Color(0xffffff).multiplyScalar(0.35) },
        cameraPositionWorld: { value: new THREE.Vector3() },
        worldUp: { value: new THREE.Vector3(0, 1, 0) },
        rimColor: { value: new THREE.Color(0xffffff) },
        rimIntensity: { value: 0.18 },
        rimPower: { value: 2.0 },
        specColor: { value: new THREE.Color(0xffffff) },
        specIntensity: { value: 0.35 },
        specPower: { value: 32.0 },
        toonDiffuseSteps: { value: options.uniforms?.toonDiffuseSteps?.value ?? 0.0 },
        toonSpecSteps: { value: options.uniforms?.toonSpecSteps?.value ?? 0.0 },
        toonSoftness: { value: options.uniforms?.toonSoftness?.value ?? 0.0 },
        outlineStrength: { value: options.uniforms?.outlineStrength?.value ?? 0.0 },
        outlinePower: { value: options.uniforms?.outlinePower?.value ?? 2.0 },
        sunWrap: { value: options.uniforms?.sunWrap?.value ?? 0.6 },
        saturationBoost: { value: options.uniforms?.saturationBoost?.value ?? 0.15 },
        vibrance: { value: options.uniforms?.vibrance?.value ?? 0.3 },
        shadowLift: { value: options.uniforms?.shadowLift?.value ?? 0.08 },
        exposure: { value: options.uniforms?.exposure?.value ?? 1.0 },
        posterizeLevels: { value: options.uniforms?.posterizeLevels?.value ?? 0.0 },
        time: { value: 0.0 },
        hatchStrength: { value: options.uniforms?.hatchStrength?.value ?? 0.0 },
        hatchScale: { value: options.uniforms?.hatchScale?.value ?? 2.0 },
        hatchContrast: { value: options.uniforms?.hatchContrast?.value ?? 1.0 },
        boilStrength: { value: options.uniforms?.boilStrength?.value ?? 0.0 },
        boilSpeed: { value: options.uniforms?.boilSpeed?.value ?? 0.6 },
        grainStrength: { value: options.uniforms?.grainStrength?.value ?? 0.0 },
        albedoLift: { value: options.uniforms?.albedoLift?.value ?? 0.0 },
        darkTintColor: { value: options.uniforms?.darkTintColor?.value ?? new THREE.Color(0x000000) },
        darkTintStrength: { value: options.uniforms?.darkTintStrength?.value ?? 0.0 },
        hueDesatCenter: { value: (function(){ const v = new THREE.Vector3(-0.5, 1.0, -0.5); v.normalize(); return v; })() },
        hueDesatWidth: { value: options.uniforms?.hueDesatWidth?.value ?? 0.78 },
        hueDesatStrength: { value: options.uniforms?.hueDesatStrength?.value ?? 0.0 },
        hueDimStrength: { value: options.uniforms?.hueDimStrength?.value ?? 0.0 },
        hue2DesatCenter: { value: (function(){ const v = new THREE.Vector3(1.0, 1.0, -0.2); v.normalize(); return v; })() },
        hue2DesatWidth: { value: options.uniforms?.hue2DesatWidth?.value ?? 0.7 },
        hue2DesatStrength: { value: options.uniforms?.hue2DesatStrength?.value ?? 0.0 },
        hue2DimStrength: { value: options.uniforms?.hue2DimStrength?.value ?? 0.0 },
        highlightWhiteBoost: { value: options.uniforms?.highlightWhiteBoost?.value ?? 0.0 },
        highlightWhiteThreshold: { value: options.uniforms?.highlightWhiteThreshold?.value ?? 0.82 },
        highlightTintColor: { value: options.uniforms?.highlightTintColor?.value || new THREE.Color(0xfff0d9) },
        ...options.uniforms
      },
      ...options.materialOptions
    });
  }

  applyCustomShaderToMesh(mesh, opts = {}) {
    if (!mesh || !mesh.isMesh) return null;
    const originalMaterial = mesh.material;
    if (!this.originalMaterials.has(mesh.uuid)) {
      this.originalMaterials.set(mesh.uuid, originalMaterial);
    }
    const baseColor = (originalMaterial && originalMaterial.color) ? originalMaterial.color.clone() : new THREE.Color(0x808080);
    const shaderMat = this.createCustomShader({
      uniforms: {
        baseColor: { value: baseColor },
        map: { value: originalMaterial && originalMaterial.map ? originalMaterial.map : null },
        ambientColor: { value: opts.ambientColor || new THREE.Color(0xffffff).multiplyScalar(0.35) },
        lightIntensity: { value: 0.0 },
        sunColor: { value: opts.sunColor || new THREE.Color(0xffe6b0).multiplyScalar(6.0) },
        sunWrap: { value: opts.sunWrap ?? 0.8 },
        saturationBoost: { value: opts.saturationBoost ?? 0.15 },
        vibrance: { value: opts.vibrance ?? 0.3 },
        shadowLift: { value: opts.shadowLift ?? 0.08 },
        exposure: { value: opts.exposure ?? 1.0 },
        rimIntensity: { value: opts.rimIntensity ?? 0.18 },
        rimPower: { value: opts.rimPower ?? 2.0 },
        specIntensity: { value: opts.specIntensity ?? 0.35 },
        specPower: { value: opts.specPower ?? 32.0 },
        toonDiffuseSteps: { value: opts.toonDiffuseSteps ?? 0.0 },
        toonSpecSteps: { value: opts.toonSpecSteps ?? 0.0 },
        toonSoftness: { value: opts.toonSoftness ?? 0.0 },
        outlineStrength: { value: opts.outlineStrength ?? 0.0 },
        outlinePower: { value: opts.outlinePower ?? 2.0 },
        time: { value: 0.0 },
        hatchStrength: { value: opts.hatchStrength ?? 0.0 },
        hatchScale: { value: opts.hatchScale ?? 2.0 },
        hatchContrast: { value: opts.hatchContrast ?? 1.0 },
        boilStrength: { value: opts.boilStrength ?? 0.0 },
        boilSpeed: { value: opts.boilSpeed ?? 0.6 },
        grainStrength: { value: opts.grainStrength ?? 0.0 },
        posterizeLevels: { value: opts.posterizeLevels ?? 0.0 },
        albedoLift: { value: opts.albedoLift ?? 0.0 },
        darkTintColor: { value: opts.darkTintColor ?? new THREE.Color(0x000000) },
        darkTintStrength: { value: opts.darkTintStrength ?? 0.0 },
        hueDesatCenter: { value: opts.hueDesatCenter ?? (function(){ const v = new THREE.Vector3(-0.5, 1.0, -0.5); v.normalize(); return v; })() },
        hueDesatWidth: { value: opts.hueDesatWidth ?? 0.78 },
        hueDesatStrength: { value: opts.hueDesatStrength ?? 0.0 },
        hueDimStrength: { value: opts.hueDimStrength ?? 0.0 },
        hue2DesatCenter: { value: opts.hue2DesatCenter ?? (function(){ const v = new THREE.Vector3(1.0, 1.0, -0.2); v.normalize(); return v; })() },
        hue2DesatWidth: { value: opts.hue2DesatWidth ?? 0.7 },
        hue2DesatStrength: { value: opts.hue2DesatStrength ?? 0.0 },
        hue2DimStrength: { value: opts.hue2DimStrength ?? 0.0 },
        highlightWhiteBoost: { value: opts.highlightWhiteBoost ?? 0.0 },
        highlightWhiteThreshold: { value: opts.highlightWhiteThreshold ?? 0.82 },
        highlightTintColor: { value: opts.highlightTintColor ?? new THREE.Color(0xfff0d9) }
      },
      materialOptions: { lights: false }
    });
    mesh.material = shaderMat;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.enhancedMaterials.set(mesh.uuid, shaderMat);
    return shaderMat;
  }

  /**
   * Add a cheap mesh-based outline by rendering backfaces slightly scaled.
   * Applies to a single mesh. Safe for iGPU when used sparingly.
   */
  addOutlineToMesh(mesh, options = {}) {
    if (!mesh || !mesh.isMesh) return null;
    if (mesh.userData.__toonOutline) return mesh.userData.__toonOutline;

    const thickness = options.thickness ?? 1.03;
    const color = options.color ?? 0x000000;

    const outlineMat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide,
      depthTest: true,
      depthWrite: false,
      toneMapped: false
    });

    const outlineMesh = new THREE.Mesh(mesh.geometry, outlineMat);
    outlineMesh.name = (mesh.name || 'mesh') + '_toonOutline';
    outlineMesh.renderOrder = (mesh.renderOrder || 0) - 1;
    outlineMesh.scale.set(thickness, thickness, thickness);
    outlineMesh.frustumCulled = mesh.frustumCulled;

    mesh.add(outlineMesh);
    mesh.userData.__toonOutline = outlineMesh;
    return outlineMesh;
  }

  /**
   * Traverse an object and add outlines to each Mesh child.
   */
  addOutlineToObject(object3d, filterFn = null, options = {}) {
    object3d.traverse((child) => {
      if (child.isMesh) {
        if (filterFn && !filterFn(child)) return;
        this.addOutlineToMesh(child, options);
      }
    });
  }

  applyCustomShaderToObject(object3d, filterFn = null, opts = {}) {
    object3d.traverse((child) => {
      if (child.isMesh) {
        if (filterFn && !filterFn(child)) return;
        this.applyCustomShaderToMesh(child, opts);
      }
    });
  }

  /**
   * Apply fog for atmospheric depth
   */
  applyFog(color = 0x000000, near = 50, far = 200) {
    this.scene.fog = new THREE.Fog(color, near, far);
    console.log('🎨 Shader System: Fog applied for atmospheric depth');
  }

  /**
   * Update shader uniforms (call in animation loop if needed)
   */
  update(deltaTime, camera = null, scene = null) {
    // Update dynamic uniforms (camera and sun)
    if (!this._timeSec) this._timeSec = 0;
    this._timeSec += Math.max(0, (deltaTime || 0)) * 0.001;
    const cam = camera;
    const sunData = scene && scene.userData ? scene.userData.sunEye : null;
    const sunGroup = sunData && sunData.group ? sunData.group : (scene && scene.userData ? scene.userData.sun : null);
    const defaultSunDir = new THREE.Vector3(0.6, 0.8, 0.2);

    if (!this._sunTmp) {
      this._sunTmp = {
        cameraPos: new THREE.Vector3(),
        forward: new THREE.Vector3(),
        anchorPos: new THREE.Vector3(),
        desiredPos: new THREE.Vector3(),
        sunPos: new THREE.Vector3(),
        up: new THREE.Vector3(0, 1, 0),
        side: new THREE.Vector3(),
        tmpOffset: new THREE.Vector3(),
        lookTarget: new THREE.Vector3(),
        rigPos: new THREE.Vector3(),
        toTarget: new THREE.Vector3(),
        targetHint: new THREE.Vector3(),
        desiredQuat: new THREE.Quaternion(),
        lookMatrix: new THREE.Matrix4(),
        altUp: new THREE.Vector3(1, 0, 0),
        altCross: new THREE.Vector3(),
        parentQuat: new THREE.Quaternion(),
        invParentQuat: new THREE.Quaternion(),
        currentQuat: new THREE.Quaternion(),
        finalQuat: new THREE.Quaternion(),
        worldQuat: new THREE.Quaternion(),
        frontDir: new THREE.Vector3(),
        frontDirAlt: new THREE.Vector3(),
        flipAxis: new THREE.Vector3(),
        flipQuat: new THREE.Quaternion()
      };
    }
    const tmp = this._sunTmp;

    let forwardDir = null;
    let anchorPos = null;

    if (cam) {
      cam.getWorldPosition(tmp.cameraPos);
      cam.getWorldDirection(tmp.forward);
      forwardDir = tmp.forward.clone().normalize();
      anchorPos = tmp.anchorPos.copy(tmp.cameraPos).addScaledVector(forwardDir, 8.0);
    }

    let radius = sunData && sunData.radius ? sunData.radius : 300;

    if (anchorPos && sunGroup) {
      const baseDistance = sunData && sunData.distance != null ? sunData.distance : 800;
      const distance = Math.max(baseDistance, radius + 200);
      tmp.desiredPos.copy(anchorPos).addScaledVector(forwardDir || defaultSunDir, distance);
      // Do not force vertical lift; keep eye position logic unchanged per request
      sunGroup.position.lerp(tmp.desiredPos, 0.22);
      sunGroup.updateMatrixWorld();
      if (sunData) {
        sunData.distance = distance;
      }
    }

    if (anchorPos && scene && scene.userData && scene.userData.sunTarget) {
      scene.userData.sunTarget.position.lerp(anchorPos, 0.25);
    }

    let sunDirection = defaultSunDir.clone();
    if (sunGroup) {
      sunGroup.getWorldPosition(tmp.sunPos);
      if (tmp.sunPos.lengthSq() > 0.0001) {
        sunDirection.copy(tmp.sunPos).normalize();
        if (sunData) {
          if (sunData.direction) {
            sunData.direction.copy(sunDirection);
          } else {
            sunData.direction = sunDirection.clone();
          }
        }
      }
    } else if (sunData && sunData.direction) {
      sunDirection.copy(sunData.direction).normalize();
    }

    // Allow scene to override sun direction (e.g., fixed top-down for Level 3)
    if (scene && scene.userData && scene.userData.sunOverrideDir) {
      const o = scene.userData.sunOverrideDir;
      if (o && typeof o.x === 'number') {
        sunDirection.copy(o).normalize();
      }
    }

    // Smooth sun direction to avoid popping/banding
    if (!this._smoothedSunDir) {
      this._smoothedSunDir = new THREE.Vector3().copy(sunDirection);
    } else {
      this._smoothedSunDir.lerp(sunDirection, 0.12).normalize();
    }

    const stableSunDir = this._smoothedSunDir;

    this.enhancedMaterials.forEach((mat) => {
      if (!mat || !mat.uniforms) return;
      if (cam && mat.uniforms.cameraPositionWorld) {
        mat.uniforms.cameraPositionWorld.value.copy(cam.position);
      }
      if (mat.uniforms.sunDir) {
        mat.uniforms.sunDir.value.copy(stableSunDir);
      }
      if (mat.uniforms.time) {
        mat.uniforms.time.value = this._timeSec;
      }
    });

    // Animate 'light' preset sky subtle clouds if present
    if (scene && scene.userData && scene.userData.sky && scene.userData.sky.light) {
      const skyEntry = scene.userData.sky.light;
      if (skyEntry.cloudMaterial && skyEntry.cloudMaterial.uniforms) {
        const uniforms = skyEntry.cloudMaterial.uniforms;
        if (uniforms.uTime) {
          uniforms.uTime.value += deltaTime * 0.6;
        }
        if (uniforms.uSunDir) {
          uniforms.uSunDir.value.copy(stableSunDir);
        }
      }
      if (skyEntry.gradientMaterial && skyEntry.gradientMaterial.uniforms && skyEntry.gradientMaterial.uniforms.sunDir) {
        skyEntry.gradientMaterial.uniforms.sunDir.value.copy(stableSunDir);
      }
      if (skyEntry.group) {
        if (anchorPos) {
          skyEntry.group.position.copy(anchorPos);
        } else if (cam) {
          skyEntry.group.position.copy(tmp.cameraPos);
        }
        const rotSpeed = skyEntry.rotationSpeed ?? 0.02;
        skyEntry.group.rotation.y += deltaTime * rotSpeed;
      }
    }

    // Rotate the sun "eye" so it stares at the camera/player
    if (forwardDir && sunData && sunData.lookOffset) {
      tmp.side.crossVectors(tmp.up, forwardDir).normalize();
      const tilt = THREE.MathUtils.clamp(forwardDir.x, -0.8, 0.8);
      const desiredOffset = tmp.tmpOffset.copy(tmp.side).multiplyScalar(tilt * radius * 0.25);
      sunData.lookOffset.lerp(desiredOffset, 0.15);
    } else if (sunData && sunData.lookOffset) {
      sunData.lookOffset.lerp(tmp.tmpOffset.set(0, 0, 0), 0.12);
    }

    if (anchorPos && sunData && sunData.rig) {
      try {
        const rig = sunData.rig;
        const lookTarget = tmp.lookTarget.copy(anchorPos);
        const eyeState = sunData.eyeState || (sunData.eyeState = {
          initialized: false,
          altUp: tmp.altUp.clone(),
          forwardAxis: new THREE.Vector3(0, 0, -1),
          forwardDetermined: false,
          lastFacing: 1
        });

        if (sunData.lookOffset) {
          lookTarget.add(sunData.lookOffset);
        }

        const verticalTilt = forwardDir ? THREE.MathUtils.clamp(forwardDir.y, -0.6, 0.6) : 0;
        lookTarget.addScaledVector(tmp.up, radius * 0.04 * verticalTilt);

        rig.getWorldPosition(tmp.rigPos);
        tmp.toTarget.copy(lookTarget).sub(tmp.rigPos);

        const toTargetLenSq = tmp.toTarget.lengthSq();
        if (toTargetLenSq > 1e-4) {
          tmp.toTarget.multiplyScalar(1 / Math.sqrt(toTargetLenSq));

          let upHint = tmp.up;
          const dotUp = Math.abs(tmp.toTarget.dot(upHint));
          if (dotUp > 0.96) {
            if (!eyeState.altUp) {
              eyeState.altUp = tmp.altUp.clone();
            }
            const altUp = eyeState.altUp;
            altUp.crossVectors(tmp.up, tmp.toTarget);
            if (altUp.lengthSq() < 1e-5) {
              altUp.crossVectors(tmp.altCross.set(1, 0, 0), tmp.toTarget);
              if (altUp.lengthSq() < 1e-5) {
                altUp.set(0, 1, 0);
              }
            }
            altUp.normalize();
            upHint = altUp;
          } else if (eyeState.altUp) {
            eyeState.altUp.lerp(tmp.up, 0.12);
            if (eyeState.altUp.lengthSq() > 0.999) {
              eyeState.altUp.copy(tmp.up);
            } else {
              eyeState.altUp.normalize();
            }
            upHint = eyeState.altUp;
          }

          tmp.targetHint.copy(lookTarget);

          const parent = rig.parent;
          if (parent) {
            parent.getWorldQuaternion(tmp.parentQuat);
            tmp.invParentQuat.copy(tmp.parentQuat).invert();
          } else {
            tmp.parentQuat.identity();
            tmp.invParentQuat.identity();
          }

          tmp.lookMatrix.lookAt(tmp.rigPos, tmp.targetHint, upHint);
          tmp.desiredQuat.setFromRotationMatrix(tmp.lookMatrix);
          tmp.desiredQuat.premultiply(tmp.invParentQuat);

          const rotationOffset = sunData.rotationOffset || (sunData.rotationOffset = new THREE.Quaternion());
          tmp.finalQuat.copy(tmp.desiredQuat).multiply(rotationOffset);

          tmp.worldQuat.copy(tmp.finalQuat);
          if (parent) {
            tmp.worldQuat.premultiply(tmp.parentQuat);
          }

          const eyeForward = eyeState.forwardAxis;
          tmp.frontDir.copy(eyeForward).applyQuaternion(tmp.worldQuat);
          let facing = tmp.frontDir.dot(tmp.toTarget);

          if (!eyeState.forwardDetermined) {
            const altDot = tmp.frontDirAlt.set(0, 0, 1).applyQuaternion(tmp.worldQuat).dot(tmp.toTarget);
            if (Math.abs(altDot) > Math.abs(facing)) {
              eyeState.forwardAxis.set(0, 0, altDot >= 0 ? 1 : -1);
              tmp.frontDir.copy(eyeState.forwardAxis).applyQuaternion(tmp.worldQuat);
              facing = tmp.frontDir.dot(tmp.toTarget);
            }
            if (facing < 0) {
              eyeState.forwardAxis.negate();
              tmp.frontDir.copy(eyeState.forwardAxis).applyQuaternion(tmp.worldQuat);
              facing = tmp.frontDir.dot(tmp.toTarget);
            }
            eyeState.forwardDetermined = true;
          }

          // If the iris would roll past 90° (showing the back), flip the world orientation
          if (facing < -0.05) {
            tmp.flipAxis.crossVectors(tmp.frontDir, tmp.toTarget);
            if (tmp.flipAxis.lengthSq() < 1e-5) {
              tmp.flipAxis.copy(tmp.up);
            } else {
              tmp.flipAxis.normalize();
            }
            tmp.flipQuat.setFromAxisAngle(tmp.flipAxis, Math.PI);
            tmp.worldQuat.multiply(tmp.flipQuat);
            tmp.frontDir.copy(eyeForward).applyQuaternion(tmp.worldQuat);
            facing = tmp.frontDir.dot(tmp.toTarget);

            tmp.finalQuat.copy(tmp.worldQuat);
            if (parent) {
              tmp.finalQuat.premultiply(tmp.invParentQuat);
            }
          }

          eyeState.lastFacing = facing;

          const clampedDt = THREE.MathUtils.clamp(deltaTime || 0, 0.016, 0.05);
          const maxTurnSpeed = THREE.MathUtils.degToRad(360); // radians per second
          const step = maxTurnSpeed * clampedDt;
          const currentQuat = tmp.currentQuat.copy(rig.quaternion);
          const angle = currentQuat.angleTo(tmp.finalQuat);

          if (!eyeState.initialized || !isFinite(angle)) {
            rig.quaternion.copy(tmp.finalQuat);
            eyeState.initialized = true;
          } else if (angle > 1e-5) {
            const t = Math.min(1, step / Math.max(angle, 1e-5));
            rig.quaternion.slerp(tmp.finalQuat, t);
          } else {
            rig.quaternion.copy(tmp.finalQuat);
          }
        }
      } catch (e) {
        // ignore eye update errors
      }
    }
  }

  /**
   * Toggle shaders on/off
   * Returns the new shader state (true = on, false = off)
   */
  toggleShaders() {
    this.shadersEnabled = !this.shadersEnabled;
    
    if (this.shadersEnabled) {
      // Re-enable shaders: restore enhanced materials
      console.log('🎨 Shaders ENABLED');
      this.originalMaterials.forEach((originalMat, uuid) => {
        const enhancedMat = this.enhancedMaterials.get(uuid);
        if (enhancedMat) {
          // Find the mesh in the scene and apply enhanced material
          this.scene.traverse((obj) => {
            if (obj.uuid === uuid && obj.isMesh) {
              obj.material = enhancedMat;
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });
        }
      });
      
      // Re-enable renderer features
      this.renderer.shadowMap.enabled = true;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.8;
    } else {
      // Disable shaders: restore original materials
      console.log('🎨 Shaders DISABLED');
      this.originalMaterials.forEach((originalMat, uuid) => {
        // Find the mesh in the scene and restore original material
        this.scene.traverse((obj) => {
          if (obj.uuid === uuid && obj.isMesh) {
            obj.material = originalMat;
            obj.castShadow = false;
            obj.receiveShadow = false;
          }
        });
      });
      
      // Disable renderer features for better performance
      this.renderer.shadowMap.enabled = false;
      this.renderer.toneMapping = THREE.NoToneMapping;
      this.renderer.toneMappingExposure = 1.0;
    }
    
    return this.shadersEnabled;
  }

  /**
   * Get current shader state
   */
  isEnabled() {
    return this.shadersEnabled;
  }

  /**
   * Cleanup
   */
  dispose() {
    this.enhancedMaterials.forEach((material) => {
      material.dispose();
    });
    this.enhancedMaterials.clear();
  }

  /**
   * Live-update toon settings across all enhanced materials.
   * Pass a partial settings object with any supported uniform values.
   */
  applyToonSettings(partial = {}) {
    if (!partial || typeof partial !== 'object') return;
    this._lastToonSettings = { ...this._lastToonSettings, ...partial };
    const u = this._lastToonSettings;
    const setIf = (mat, key, value) => {
      if (!mat || !mat.uniforms) return;
      if (key in mat.uniforms && value !== undefined && value !== null) {
        const uni = mat.uniforms[key];
        if (uni && uni.value !== undefined) {
          if (uni.value.set && typeof value === 'object') {
            // THREE.Color or Vector3
            uni.value.copy ? uni.value.copy(value) : uni.value.set(value);
          } else {
            uni.value = value;
          }
        }
      }
    };
    this.enhancedMaterials.forEach((mat) => {
      if (!mat || !mat.uniforms) return;
      // Numeric uniforms
      ['exposure','saturationBoost','vibrance','posterizeLevels','toonDiffuseSteps','toonSpecSteps','toonSoftness','hatchStrength','hatchScale','hatchContrast','boilStrength','boilSpeed','grainStrength','hueDesatWidth','hueDesatStrength','hueDimStrength','hue2DesatWidth','hue2DesatStrength','hue2DimStrength','albedoLift','darkTintStrength','sunWrap','highlightWhiteBoost','highlightWhiteThreshold'].forEach(k => setIf(mat, k, u[k]));
      // Vectors/Colors
      if (u.darkTintColor) setIf(mat, 'darkTintColor', u.darkTintColor);
      if (u.hueDesatCenter) setIf(mat, 'hueDesatCenter', u.hueDesatCenter);
      if (u.hue2DesatCenter) setIf(mat, 'hue2DesatCenter', u.hue2DesatCenter);
      if (u.highlightTintColor) setIf(mat, 'highlightTintColor', u.highlightTintColor);
    });
  }
}
