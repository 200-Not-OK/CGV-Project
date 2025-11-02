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
    this._eyelidMats = new Set();
    this._eyelidMatsInit = false;
    this._blinkCtrl = null;
    
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
      color: originalMaterial.color ? originalMaterial.color.clone() : new THREE.Color(0xffffff),
      alphaMap: originalMaterial.alphaMap,
      aoMap: originalMaterial.aoMap,
      roughnessMap: originalMaterial.roughnessMap,
      metalnessMap: originalMaterial.metalnessMap,
      emissiveMap: originalMaterial.emissiveMap,
      
      // Character-specific properties
      roughness: originalMaterial.roughness !== undefined ? originalMaterial.roughness : (options.roughness ?? 0.6),
      metalness: originalMaterial.metalness !== undefined ? originalMaterial.metalness : (options.metalness ?? 0.1),
      
      // No emissive - keep original color
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.0,
      
      // Enable shadows
      shadowSide: THREE.DoubleSide,
      transparent: originalMaterial.transparent || false,
      opacity: originalMaterial.opacity !== undefined ? originalMaterial.opacity : 1.0,
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
      uniform vec3 eyeUpObj;
      uniform vec3 eyeFwdObj;
      varying vec3 vNormal;
      varying vec3 vNormalWorld;
      varying vec3 vPosition;
      varying vec3 vWorldPos;
      varying vec2 vUv;
      varying vec3 vNormalObj;
      varying vec3 vEyeFwdWorld;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        // Proper world-space normal (handles non-uniform scale)
        mat3 normalMatWorld = mat3(transpose(inverse(modelMatrix)));
        vNormalWorld = normalize(normalMatWorld * normal);
        vNormalObj = normalize(normal);          // object space, rotation-proof
        // eye forward in WORLD space (w=0 so only rotation/scale applied)
        vEyeFwdWorld = normalize((modelMatrix * vec4(eyeFwdObj, 0.0)).xyz);
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
      // Eyelid overlay (disabled by default)
      uniform float eyelidEnable;   // 0 off, 1 on
      uniform float blink;          // 0 open → 1 closed
      uniform float lidFeather;     // soft edge width 0..0.3
      uniform float lidCurve;       // added center drop 0..0.8
      uniform float lidCurvePower;  // >=1 shape control for arc
      uniform vec3  lidTintColor;   // red tint
      uniform float lidOpacity;     // 0..1 strength
      uniform float lidThreshold;   // 0..1 gating threshold
      uniform float lidHardness;    // 0..1 0=soft gate, 1=hard step
      uniform vec3  eyeUp;          // optional override; 0-vector => use worldUp
      uniform float eyelidDebug;    // 0/1 to visualize mask
      // local-space basis for invariant mask
      uniform vec3 eyeUpObj;   // e.g., (0,1,0) in the eye mesh's local space
      uniform vec3 eyeFwdObj;  // e.g., (0,0,-1) in the eye mesh's local space
      uniform float openPurpleEnable;   // 0/1
      uniform vec3  openPurpleColor;    // e.g., vec3(1.0, 0.0, 1.0) for purple
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      varying vec2 vUv;
      varying vec3 vNormalObj;
      varying vec3 vEyeFwdWorld;
      
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

        // Eyelid with world-space horizontal alignment (no tilt)
        if (eyelidEnable > 0.5) {
          // blink: 0=open, 1=closed
          float b = clamp(blink, 0.0, 1.0);

          // ---- EARLY EXIT WHEN OPEN (no mixing at all) ----
          // hard threshold so there is absolutely no tint leakage
          if (b <= 0.03) {
            // Optional: if you want a diagnostic color when fully open, toggle here.
            // finalColor = openPurpleEnable > 0.5 ? openPurpleColor : finalColor;
          } else {
            // ------ HORIZONTAL LIDS (world-up aligned) ------
            // Build stable world-space frame: up = worldUp, side = up × eyeForwardWorld.
            vec3 upW   = normalize(worldUp);
            vec3 fwdW  = normalize(vEyeFwdWorld);
            vec3 sideW = cross(upW, fwdW);
            if (dot(sideW, sideW) < 1e-6) {
              // Degenerate (forward ~ up): fall back to normal to pick a side
              sideW = normalize(cross(upW, normalize(vNormalWorld)));
              if (dot(sideW, sideW) < 1e-6) sideW = vec3(1.0, 0.0, 0.0);
            }

            // Use WORLD normal so lid stays horizontal even as the eye rotates
            vec3 nW = normalize(vNormalWorld);
            float y = clamp(dot(nW, upW),   -1.0, 1.0);
            float x = clamp(dot(nW, sideW), -1.0, 1.0);

            // Convert blink to "open" and build a very straight slit
            float open = 1.0 - b; // 1=open, 0=closed
            float curveTerm = lidCurve * (1.0 - pow(abs(x), max(lidCurvePower, 1e-4))) * 0.25;
            float halfGap   = max(0.0, open - curveTerm);
            float f         = max(lidFeather, 1e-4);

            // Open region is |y| < halfGap; outside is covered by lids
            float openMask = 1.0 - smoothstep(halfGap - f, halfGap + f, abs(y));
            float lidMask  = 1.0 - openMask;

            // thresholded gate with adjustable hardness
            float g    = smoothstep(lidThreshold, lidThreshold + max(f*0.5, 1e-4), lidMask);
            float hard = step(0.5, g);
            float mEff = mix(g, hard, clamp(lidHardness, 0.0, 1.0));

            // **** GUARANTEE NO MIX WHEN PRACTICALLY OPEN ****
            // Multiply by a strict gate so if b<=0.03 there is zero effect.
            float applyMask = step(0.03, b);
            mEff *= applyMask;
            
            // Force hard replacement - no mixing, complete independence
            // When mask is active, use hard step for complete color replacement
            mEff = step(0.5, mEff);

            if (eyelidDebug > 0.5) {
              finalColor = mix(finalColor, vec3(1.0, 0.0, 1.0), mEff);
            } else {
              // Hard replacement in the eye shader - no lerp, no opacity
              // Inside the covered region: strict gate and set finalColor = lidTintColor
              if (mEff > 0.5) {
                finalColor = lidTintColor;  // direct assignment, no mixing
              }
            }
          }
        }
        
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
        // Eyelid defaults (off by default, only enabled for the eye)
        eyelidEnable: { value: 0.0 },
        blink:        { value: 0.0 },
        lidFeather:   { value: 0.06 },
        lidCurve:     { value: 0.10 }, // Very reduced for straighter lids
        lidCurvePower:{ value: 2.5 }, // Higher power = flatter center
        lidTintColor: { value: new THREE.Color(0xcc0000) }, // red
        lidOpacity:   { value: 1.0 },
        lidThreshold: { value: 0.55 },
        lidHardness:  { value: 1.0 },
        eyeUp:        { value: new THREE.Vector3(0,0,0) }, // 0-vector => fallback to worldUp
        eyeUpObj:     { value: new THREE.Vector3(0, 1, 0) },
        eyeFwdObj:    { value: new THREE.Vector3(0, 0, -1) },
        openPurpleEnable: { value: 0.0 }, // disable by default
        openPurpleColor:  { value: new THREE.Color(0x800080) },
        eyelidDebug:  { value: 0.0 },
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
    // Skip NPCs - they should never use the custom shader
    if (mesh.userData?.isNpc || mesh.userData?.skipShader || mesh.userData?.isStar) return null;
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
   * Force the eye rig to use ShaderMaterial and enable eyelid uniforms
   * @param {THREE.Object3D} rig - The eye rig object
   * @returns {number} Number of meshes that were updated
   */
  _ensureEyeShaderOnRig(rig) {
    let applied = 0;
    console.log('👁️ Searching for eye meshes in rig:', rig.name || '(unnamed)');
    rig.traverse((child) => {
      if (!child.isMesh) return;
      const mat = child.material;
      console.log(`👁️ Found mesh: ${child.name || '(unnamed)'}, material type: ${mat?.constructor?.name || 'unknown'}`);

      // If already our ShaderMaterial with eyelid uniforms, just register it
      if (mat && mat.isShaderMaterial && mat.uniforms && ('eyelidEnable' in mat.uniforms)) {
        console.log(`👁️ Found existing ShaderMaterial with eyelid on mesh: ${child.name || '(unnamed)'}`);
        mat.uniforms.eyelidEnable.value = 0.0; // Disabled - no color mixing during blink
        mat.uniforms.lidTintColor.value.set(0xcc0000); // red
        mat.uniforms.lidOpacity.value = 1.0;
        mat.uniforms.lidCurve.value = 0.10; // Very straight lids
        mat.uniforms.lidCurvePower.value = 2.5; // Flatter center
        mat.uniforms.lidThreshold.value  = 0.55;
        mat.uniforms.lidHardness.value   = 1.0;
        mat.uniforms.eyeUpObj.value.set(0, 1, 0);   // adjust if your eye model's up differs
        mat.uniforms.eyeFwdObj.value.set(0, 0, -1); // adjust if forward differs
        mat.uniforms.openPurpleEnable.value = 0.0; // disable purple tint by default
        this._eyelidMats.add(mat);
        applied++;
        return;
      }

      // Replace with our custom shader, preserving color/map
      console.log(`👁️ Replacing material on mesh: ${child.name || '(unnamed)'}, old type: ${mat?.constructor?.name || 'unknown'}`);
      const shader = this.createCustomShader({
        uniforms: {
          baseColor: { value: (mat && mat.color) ? mat.color.clone() : new THREE.Color(0xffffff) },
          map:       { value: (mat && mat.map) ? mat.map : null }
        },
        materialOptions: { lights: false }
      });
      shader.uniforms.eyelidEnable.value = 1.0;
      shader.uniforms.lidTintColor.value.set(0xcc0000); // red
      shader.uniforms.lidOpacity.value = 1.0;
      shader.uniforms.lidCurve.value = 0.10; // Very straight lids
      shader.uniforms.lidCurvePower.value = 2.5; // Flatter center
      shader.uniforms.lidThreshold.value  = 0.55;
      shader.uniforms.lidHardness.value   = 1.0;
      shader.uniforms.eyeUpObj.value.set(0, 1, 0);   // adjust if your eye model's up differs
      shader.uniforms.eyeFwdObj.value.set(0, 0, -1); // adjust if forward differs
      shader.uniforms.openPurpleEnable.value = 0.0; // disable purple tint by default

      child.material = shader;
      this.enhancedMaterials.set(child.uuid, shader);
      this._eyelidMats.add(shader);
      console.log(`👁️ Applied shader to mesh: ${child.name || '(unnamed)'}, eyelid enabled`);
      applied++;
    });
    return applied;
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
    const levelId = scene && scene.userData ? scene.userData.levelId : null;
    const isLevel3 = levelId === 'level3';
    const levelIdKnown = typeof levelId === 'string' && levelId.length > 0;

    // Hard guard: if not in level 3, ensure any leftover level-3-only sun/eye objects are removed.
    // This prevents the eye-shaped dome or related lights from leaking into other levels.
    if (levelIdKnown && !isLevel3 && scene && scene.userData) {
      try {
        // Remove eyeball rig/group if still present
        if (scene.userData.sunEye && scene.userData.sunEye.group) {
          const g = scene.userData.sunEye.group;
          if (g.parent) g.parent.remove(g);
          scene.userData.sunEye = null;
        }
        // Remove any object marked as sun
        const toRemove = [];
        scene.traverse((obj) => { if (obj && obj.userData && obj.userData.isSun) toRemove.push(obj); });
        toRemove.forEach((obj) => { if (obj.parent) obj.parent.remove(obj); });
        // Clear top/ambient fill references from level 3 preset if lingering
        if (scene.userData.topFillLight) {
          try {
            const l = scene.userData.topFillLight;
            if (l.parent) l.parent.remove(l);
          } catch (_) {}
          scene.userData.topFillLight = null;
        }
        if (scene.userData.ambientFill) {
          try {
            const a = scene.userData.ambientFill;
            if (a.parent) a.parent.remove(a);
          } catch (_) {}
          scene.userData.ambientFill = null;
        }
        // Remove any stray eyelid meshes by name if they somehow persisted
        try {
          const eyelids = [];
          scene.traverse((obj) => {
            if (!obj || !obj.isMesh) return;
            const n = (obj.name || '').toLowerCase();
            if (n === 'topeyelist' || n === 'bottomeyelist' || n === 'topeyelid' || n === 'bottomeyelid') {
              eyelids.push(obj);
            }
          });
          eyelids.forEach((m) => { if (m.parent) m.parent.remove(m); });
        } catch (_) {}
        // Heuristic purge: remove large, opaque, pure-black MeshBasicMaterial meshes (typical of L3 eye/eyelids)
        try {
          const suspects = [];
          scene.traverse((obj) => {
            if (!obj || !obj.isMesh) return;
            const lowerName = (obj.name || '').toLowerCase();
            if (lowerName.includes('suneye') || lowerName.includes('sun_eye') || lowerName.includes('sun-eye')) {
              suspects.push(obj);
              return;
            }
            const mat = obj.material;
            const isBlackBasic = (() => {
              const check = (material) => {
                if (!material || !material.isMeshBasicMaterial) return false;
                if (!material.color) return false;
                const c = material.color;
                if (!(c.r === 0 && c.g === 0 && c.b === 0)) return false;
                if (material.map) return false;
                if (material.opacity !== undefined && material.opacity < 0.99) return false;
                return true;
              };
              if (Array.isArray(mat)) {
                return mat.some(check);
              }
              return check(mat);
            })();
            if (!isBlackBasic) return;
            let radius = 0;
            const s = obj.scale ? Math.max(obj.scale.x, obj.scale.y, obj.scale.z) : 1;
            if (obj.geometry) {
              const geom = obj.geometry;
              if (!geom.boundingSphere) {
                try { geom.computeBoundingSphere(); } catch (_) {}
              }
              if (geom.boundingSphere && isFinite(geom.boundingSphere.radius)) {
                radius = Math.max(radius, geom.boundingSphere.radius * s);
              }
              if (!geom.boundingBox) {
                try { geom.computeBoundingBox(); } catch (_) {}
              }
              if (geom.boundingBox) {
                const sz = geom.boundingBox.getSize(new THREE.Vector3());
                radius = Math.max(radius, Math.max(sz.x, sz.y, sz.z) * 0.5 * s);
              }
            }
            if (radius >= 15) {
              suspects.push(obj);
            }
          });
          suspects.forEach((m) => {
            if (m.parent) {
              m.parent.remove(m);
              console.log('🧹 Removed stray Level3 black mesh outside level3:', m.name || '(unnamed)');
            }
          });
        } catch (_) {}
      } catch (_) {
        // non-fatal cleanup
      }
    }
    // Only allow sun eye/group behavior in level 3
    const sunData = isLevel3 && scene && scene.userData ? scene.userData.sunEye : null;
    const sunGroup = isLevel3 && sunData && sunData.group ? sunData.group : (isLevel3 && scene && scene.userData ? scene.userData.sun : null);
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

    if (isLevel3 && anchorPos && sunGroup) {
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

    if (isLevel3 && anchorPos && scene && scene.userData && scene.userData.sunTarget) {
      scene.userData.sunTarget.position.lerp(anchorPos, 0.25);
    }

    let sunDirection = defaultSunDir.clone();
    if (isLevel3 && sunGroup) {
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
    } else if (isLevel3 && sunData && sunData.direction) {
      sunDirection.copy(sunData.direction).normalize();
    }

    // Allow scene to override sun direction (e.g., fixed top-down for Level 3)
    if (isLevel3 && scene && scene.userData && scene.userData.sunOverrideDir) {
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
    
    // Initialize eyeState if it doesn't exist yet (before the anchorPos check)
    if (isLevel3 && sunData && !sunData.eyeState) {
      sunData.eyeState = {
        initialized: false,
        altUp: new THREE.Vector3(1, 0, 0),
        forwardAxis: new THREE.Vector3(0, 0, -1),
        forwardDetermined: false,
        lastFacing: 1,
        blinkTimer: 1.0, // Start with 1 second delay for testing
        blinkDuration: 0,
        isBlinking: false,
        originalScaleY: 1.0,
        blinkTimerInitialized: true // Mark as initialized so inner code doesn't override
      };
    }

    // Overlay disabled: eyelid rendered entirely by the eye materials

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
          // deltaTime is in milliseconds, convert to seconds and scale for cloud animation
          uniforms.uTime.value += (deltaTime * 0.001) * 0.6;
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
        const rotSpeed = skyEntry.rotationSpeed ?? 0.035;
        // deltaTime is in milliseconds from game loop, convert to seconds for rotation
        skyEntry.group.rotation.y += (deltaTime * 0.001) * rotSpeed;
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

    if (isLevel3 && anchorPos && sunData && sunData.rig) {
      try {
        const rig = sunData.rig;
        const lookTarget = tmp.lookTarget.copy(anchorPos);
        const eyeState = sunData.eyeState || (sunData.eyeState = {
          initialized: false,
          altUp: tmp.altUp.clone(),
          forwardAxis: new THREE.Vector3(0, 0, -1),
          forwardDetermined: false,
          lastFacing: 1,
          blinkTimer: 0,
          blinkDuration: 0,
          isBlinking: false,
          originalScaleY: 1.0
        });
        
        // Initialize blink timer once
        if (!eyeState.blinkTimerInitialized) {
          eyeState.blinkTimer = 3.0 + Math.random() * 2.0; // Random initial delay 3-5 seconds
          eyeState.blinkTimerInitialized = true;
        }

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
    
    // Eyelid blink controller: update uniforms on eye materials only
    if (sunData && sunData.rig) {
      // one-time discovery of eye ShaderMaterials and enabling eyelid flag
      if (!this._eyelidMatsInit) {
        this._eyelidMatsInit = true;
        this._eyelidMats = new Set();
        const count = this._ensureEyeShaderOnRig(sunData.rig);
        console.log(`👁️ Eyelid: Applied shader to ${count} eye mesh(es). Materials in set: ${this._eyelidMats.size}`);
        if (count === 0) {
          console.warn('👁️ Eyelid: no eye ShaderMaterials found or applied. Check that sunData.rig points at the eye meshes.');
        }
        
        // one-time after eyes are discovered: ensure solid, unmixed red lid
        this._eyelidMats.forEach((shaderMat) => {
          if (shaderMat && shaderMat.uniforms) {
            shaderMat.uniforms.lidFeather.value = 0.001;  // crisp edge
            shaderMat.uniforms.lidHardness.value = 1.0;   // hard gate
            shaderMat.uniforms.openPurpleEnable.value = 0.0; // kill any debug tint
            // ensure no hue band shifts
            if (shaderMat.uniforms.hueDesatStrength) shaderMat.uniforms.hueDesatStrength.value = 0.0;
            if (shaderMat.uniforms.hueDimStrength) shaderMat.uniforms.hueDimStrength.value = 0.0;
            if (shaderMat.uniforms.hue2DesatStrength) shaderMat.uniforms.hue2DesatStrength.value = 0.0;
            if (shaderMat.uniforms.hue2DimStrength) shaderMat.uniforms.hue2DimStrength.value = 0.0;
          }
        });
        // set up a simple auto-blink if not present
        if (!this._blinkCtrl) {
          this._blinkCtrl = { t: 0, v: 0, timer: 0, next: 2.4, auto: true };
          // Start fully open (no forced blink)
          this._blinkCtrl.t = 0.0;
        }
      }

      // animate blink t in [0,1] with short close and reopen
      const dtSec = Math.max(0, (deltaTime || 0)) * 0.001;
      const bc = this._blinkCtrl;
      bc.timer += dtSec;
      if (bc.auto && bc.timer > bc.next) {
        bc.timer = 0;
        bc.next  = 2.2 + Math.random() * 2.2;
        bc.v     = 5.0; // kick to close quickly
      }
      // critically damped return to open
      const target = 0.0;
      bc.v += (target - bc.t) * 7.0 * dtSec;
      bc.v *= Math.pow(0.12, dtSec);
      bc.t  = THREE.MathUtils.clamp(bc.t + bc.v * dtSec, 0, 1);
      
      // snap to fully open to avoid epsilon tint mixing
      if (bc.t < 0.01 && Math.abs(bc.v) < 1e-3) {
        bc.t = 0.0;
        bc.v = 0.0;
      }
      
      // ease for nicer motion
      const ease = (x)=> x*x*(3.0-2.0*x);
      const blinkT = ease(bc.t);

      // push blink uniform to the eye materials
      if (this._eyelidMats) {
        let updated = 0;
        this._eyelidMats.forEach((m) => {
          if (m && m.uniforms && m.uniforms.blink) {
            m.uniforms.blink.value = blinkT;
            updated++;
          }
        });
        // Debug: log every 2 seconds
        if (!this._lastBlinkDebug || (this._timeSec - this._lastBlinkDebug) > 2.0) {
          console.log(`👁️ Blink update: t=${bc.t.toFixed(3)}, blinkT=${blinkT.toFixed(3)}, updated ${updated}/${this._eyelidMats.size} materials`);
          this._lastBlinkDebug = this._timeSec;
        }
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
   * Create the eyelid overlay mesh (a simple plane with a tiny shader)
   */
  _createEyelidOverlayMesh(pixelSize = 2.0, color = 0x7a1a12) {
    const geo = new THREE.PlaneGeometry(2, 2); // unit quad in local space
    const mat = new THREE.ShaderMaterial({
      transparent: false,
      depthTest: false,  // draw on top of everything
      depthWrite: false,
      blending: THREE.NoBlending,
      toneMapped: false, // avoid ACES/tonemapping surprises
      uniforms: {
        uOpen:     { value: 1.0 },                              // 1=open, 0=closed
        uCurve:    { value: 0.75 },                             // arc intensity
        uFeather:  { value: 0.05 },                             // soft edge (set 0 for razor)
        uTilt:     { value: 0.0 },                              // no tilt (horizontal)
        uColor:    { value: new THREE.Color(color) },           // red
        uDebug:    { value: 0.0 }                               // 1 to show mask
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uOpen;    // 0..1
        uniform float uCurve;   // ~0.5..1.2
        uniform float uFeather; // 0..0.2
        uniform float uTilt;    // radians
        uniform vec3  uColor;
        uniform float uDebug;

        float easeInOutQuint(float x){
          x = clamp(x, 0.0, 1.0);
          return x < 0.5 ? 16.0*x*x*x*x*x : 1.0 - pow(-2.0*x + 2.0, 5.0) * 0.5;
        }

        // Parabolic lids over a unit disk in NDC-like space
        float eyelidAlpha(vec2 p, float open01, float curve, float feather, float tiltRad){
          float c = cos(tiltRad), s = sin(tiltRad);
          vec2 q = vec2(c*p.x - s*p.y, s*p.x + c*p.y);

          // open01 in [0,1] -> yOpen in [0.0..0.9]
          float yOpen = mix(0.0, 0.9, open01);
          float arc = curve * max(0.0, 1.0 - q.x*q.x);

          float yTop    =  +yOpen + arc;
          float yBottom =  -yOpen - arc;

          float dTop    = q.y - yTop;      // >0 above top lid boundary
          float dBottom = yBottom - q.y;   // >0 below bottom lid boundary

          float topMask = smoothstep(0.0, feather, dTop);
          float botMask = smoothstep(0.0, feather, dBottom);
          float lid = max(topMask, botMask);

          // Keep it inside the circular eye opening (unit circle in this plane)
          float ellipse = dot(p,p);
          float eyeMask = 1.0 - smoothstep(1.0, 1.0 + feather*2.0, ellipse);

          return lid * eyeMask;
        }

        void main(){
          // Map plane UV [0,1]² to [-1,1]²
          vec2 p = (vUv - 0.5) * 2.0;

          float openSmoothed = easeInOutQuint(uOpen);
          float a = eyelidAlpha(p, openSmoothed, uCurve, max(uFeather, 1e-4), uTilt);
          a = clamp(a, 0.0, 1.0);

          if (a < 0.999) discard;          // solid occlusion, no blending
          if (uDebug > 0.5) {
            gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // magenta to debug mask
          } else {
            gl_FragColor = vec4(uColor, 1.0);
          }
        }
      `
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = 'EyelidOverlay';
    mesh.scale.setScalar(pixelSize); // we will set the real size later
    mesh.renderOrder = 9999;         // draw very late
    mesh.frustumCulled = false;
    return mesh;
  }

  /**
   * Ensure an overlay exists, parented to the eye rig and oriented forward
   */
  _ensureEyelidOverlay(sunData, radius, eyeForwardLocal = new THREE.Vector3(0,0,-1)) {
    if (!sunData) return null;
    if (!sunData.eyelidOverlay) {
      // Size the plane to cover the eye: diameter ~ 2*radius (slightly extra)
      const overlay = this._createEyelidOverlayMesh(2.0, 0x7a1a12);
      // Parent to the rig so it follows the eye
      const rig = sunData.rig || sunData.group;
      if (!rig) return null;
      rig.add(overlay);

      // Position just in front of the cornea along the eye's forward axis
      const forward = eyeForwardLocal.clone().normalize();
      overlay.position.copy(forward).multiplyScalar(radius * 0.99);

      // Rotate plane so its +Z faces along the eye forward
      const zAxis = new THREE.Vector3(0, 0, 1);
      const q = new THREE.Quaternion().setFromUnitVectors(zAxis, forward);
      overlay.quaternion.copy(q);

      // Scale plane to eye diameter (a little extra margin)
      const diameter = radius * 2.2;
      overlay.scale.set(diameter, diameter, 1);

      // Save and return
      sunData.eyelidOverlay = overlay;
    }
    return sunData.eyelidOverlay;
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

  /**
   * Set blink value manually (0 = open, 1 = closed)
   * @param {number} t - Blink value between 0 and 1
   */
  setBlink(t) {
    const v = THREE.MathUtils.clamp(t, 0, 1);
    if (this._eyelidMats) {
      this._eyelidMats.forEach(m => {
        if (m && m.uniforms && m.uniforms.blink) {
          m.uniforms.blink.value = v;
        }
      });
    }
  }

  /**
   * Enable/disable auto-blink
   * @param {boolean} on - true to enable auto-blink, false to disable
   */
  setAutoBlink(on = true) {
    if (this._blinkCtrl) {
      this._blinkCtrl.auto = on;
    }
  }
}
