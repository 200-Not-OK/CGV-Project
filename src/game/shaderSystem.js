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
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        // Simple diffuse lighting
        vec3 lightDir = normalize(lightPosition - vPosition);
        float diff = max(dot(vNormal, lightDir), 0.0);
        
        // Ambient + diffuse
        vec3 ambient = baseColor * 0.1;
        vec3 diffuse = lightColor * diff * lightIntensity;
        
        vec3 finalColor = ambient + diffuse * baseColor;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
    
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        lightPosition: { value: new THREE.Vector3(0, 10, 0) },
        lightColor: { value: new THREE.Color(0xffffff) },
        lightIntensity: { value: 1.0 },
        baseColor: { value: new THREE.Color(0x808080) },
        roughness: { value: 0.8 },
        ...options.uniforms
      },
      ...options.materialOptions
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
  update(deltaTime) {
    // Update any dynamic shader properties here
    // For example, animated emissive intensity, etc.
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
