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
      
      // Subtle rim lighting effect via emissive
      emissive: options.rimColor ?? new THREE.Color(0x1a1a2e),
      emissiveIntensity: options.rimIntensity ?? 0.15,
      
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
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
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
      uniform vec3 rimColor;
      uniform float rimIntensity;
      uniform float rimPower;
      uniform vec3 specColor;
      uniform float specIntensity;
      uniform float specPower;
      // Toon controls
      uniform float toonDiffuseSteps; // e.g., 3.0 for banded diffuse
      uniform float toonSpecSteps;    // e.g., 2.0 for crisp spec
      uniform float outlineStrength;  // 0..1 darkening near edges
      uniform float outlinePower;     // controls edge falloff
      // Sun wrap amount (0..1) controls how much light wraps around silhouettes
      uniform float sunWrap;
      // Color pop controls
      uniform float saturationBoost; // uniform boost to saturation
      uniform float vibrance;        // boosts low-sat colors more than already vibrant ones
      uniform float shadowLift;      // gently lifts deep shadows
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        // normals in view space
        vec3 N = normalize(vNormal);
        // light direction in view space for point light fallback
        vec3 Lp = normalize(lightPosition - vPosition);
        // view vector (approx in view space)
        vec3 V = normalize(-vPosition);
        
        // Albedo
        vec3 albedo = baseColor;
        if (useMap > 0.5) {
          vec4 tex = texture2D(map, vUv);
          albedo = tex.rgb;
        }
        
        // Diffuse terms: point light and directional sun tint
        float ndl_point = max(dot(N, Lp), 0.0);
        float ndl_sun_raw = dot(N, normalize(sunDir));
        float ndl_sun = clamp((ndl_sun_raw + sunWrap) / (1.0 + sunWrap), 0.0, 1.0);

        // Toon banding for diffuse
        float dPoint = ndl_point;
        float dSun = ndl_sun;
        if (toonDiffuseSteps > 0.5) {
          dPoint = floor(dPoint * toonDiffuseSteps) / toonDiffuseSteps;
          dSun = floor(dSun * toonDiffuseSteps) / toonDiffuseSteps;
        }
        vec3 diffuse = lightColor * lightIntensity * dPoint + sunColor * dSun;
        
        // Specular (Blinn-Phong)
        vec3 H = normalize(Lp + V);
        float ndh = max(dot(N, H), 0.0);
        float spec = pow(ndh, specPower) * specIntensity * (0.04 + (1.0 - roughness) * 0.5);
        spec *= lightIntensity; // disable point-spec when point light is off
        if (toonSpecSteps > 0.5) {
          spec = floor(spec * toonSpecSteps) / toonSpecSteps;
        }
        vec3 specular = specColor * spec;
        
        // Rim (Fresnel-like)
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), rimPower);
        vec3 rim = rimColor * fresnel * rimIntensity;
        
        // Ambient
        vec3 ambient = ambientColor;
        
        vec3 lit = albedo * (ambient + diffuse) + specular + rim;
        
        // Simple tone map
        vec3 finalColor = lit / (lit + vec3(1.0));

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

        // Gentle shadow lift (protect highlights)
        float liftAmount = shadowLift * max(0.0, 0.3 - Y);
        finalColor += liftAmount * (vec3(1.0) - finalColor) * 0.35;
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
        rimColor: { value: new THREE.Color(0xffffff) },
        rimIntensity: { value: 0.18 },
        rimPower: { value: 2.0 },
        specColor: { value: new THREE.Color(0xffffff) },
        specIntensity: { value: 0.35 },
        specPower: { value: 32.0 },
        toonDiffuseSteps: { value: options.uniforms?.toonDiffuseSteps?.value ?? 0.0 },
        toonSpecSteps: { value: options.uniforms?.toonSpecSteps?.value ?? 0.0 },
        outlineStrength: { value: options.uniforms?.outlineStrength?.value ?? 0.0 },
        outlinePower: { value: options.uniforms?.outlinePower?.value ?? 2.0 },
        sunWrap: { value: options.uniforms?.sunWrap?.value ?? 0.6 },
        saturationBoost: { value: options.uniforms?.saturationBoost?.value ?? 0.15 },
        vibrance: { value: options.uniforms?.vibrance?.value ?? 0.3 },
        shadowLift: { value: options.uniforms?.shadowLift?.value ?? 0.08 },
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
        rimIntensity: { value: opts.rimIntensity ?? 0.18 },
        rimPower: { value: opts.rimPower ?? 2.0 },
        specIntensity: { value: opts.specIntensity ?? 0.35 },
        specPower: { value: opts.specPower ?? 32.0 },
        toonDiffuseSteps: { value: opts.toonDiffuseSteps ?? 0.0 },
        toonSpecSteps: { value: opts.toonSpecSteps ?? 0.0 },
        outlineStrength: { value: opts.outlineStrength ?? 0.0 },
        outlinePower: { value: opts.outlinePower ?? 2.0 }
      },
      materialOptions: { lights: false }
    });
    mesh.material = shaderMat;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.enhancedMaterials.set(mesh.uuid, shaderMat);
    return shaderMat;
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

    this.enhancedMaterials.forEach((mat) => {
      if (!mat || !mat.uniforms) return;
      if (cam && mat.uniforms.cameraPositionWorld) {
        mat.uniforms.cameraPositionWorld.value.copy(cam.position);
      }
      if (mat.uniforms.sunDir) {
        mat.uniforms.sunDir.value.copy(sunDirection);
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
          uniforms.uSunDir.value.copy(sunDirection);
        }
      }
      if (skyEntry.gradientMaterial && skyEntry.gradientMaterial.uniforms && skyEntry.gradientMaterial.uniforms.sunDir) {
        skyEntry.gradientMaterial.uniforms.sunDir.value.copy(sunDirection);
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
}
