import { LightComponent } from '../lightComponent.js';
import * as THREE from 'three';

/**
 * Tech-focused lighting system for Level 1A landing room
 * Optimized shaders for desktop GPUs and laptop iGPUs
 */
export class TechLights extends LightComponent {
    constructor(props = {}) {
        super(props);
        this.position = props.position || [0, 0, 0];
        this.quality = props.quality || {};
        this.time = 0;
        this.serverMeshes = [];
        this.treeMeshes = [];
        this.dataStreams = [];
        this.dataFlowMeshes = []; // Meshes with animated data flow
        
        // Quality-aware settings
        this.shaderComplexity = this.quality?.enableComplexShaders !== false ? 1.0 : 0.3;
        this.emissiveIntensity = this.quality?.plantEmissiveBoost || 2.0;
        this.enableParticles = this.quality?.enableParticles !== false;
        this.shadowEnabled = !this.quality?.disableShadows;
    }

    async mount(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.group.position.set(...this.position);
        scene.add(this.group);

        // Create tech atmosphere lighting
        this._createAtmosphere();
        
        // Create server glow lights
        this._createServerLights();
        
        // Create tech tree structure lighting
        this._createTechTreeLights();
        
        // Create data stream effects (if particles enabled)
        if (this.enableParticles) {
            this._createDataStreams();
        }

        console.log('🔵 Tech Lights: Mounted with quality', this.quality);
    }

    unmount(scene) {
        if (this.group) {
            scene.remove(this.group);
        }
        
        // Cleanup data streams
        this.dataStreams.forEach(stream => {
            if (stream.geometry) stream.geometry.dispose();
            if (stream.material) stream.material.dispose();
        });
        this.dataStreams = [];
        
        // Clear data flow mesh references
        this.dataFlowMeshes = [];
    }

    /**
     * Create atmospheric lighting for tech room
     * Updated with cyan-to-dark-blue color scheme
     */
    _createAtmosphere() {
        // Main ambient fill - dark blue/cyan tech atmosphere (close to black)
        const ambientLight = new THREE.AmbientLight(0x001122, 0.3); // Very dark blue
        this.group.add(ambientLight);
        this.ambientLight = ambientLight;

        // Directional key light from above - cyan tech lights
        const keyLight = new THREE.DirectionalLight(0x00ccff, 0.7); // Bright cyan
        keyLight.position.set(0, 30, 0);
        keyLight.castShadow = this.shadowEnabled;
        
        if (this.shadowEnabled) {
            keyLight.shadow.mapSize.width = this.quality?.shadowMapSize || 1024;
            keyLight.shadow.mapSize.height = this.quality?.shadowMapSize || 1024;
            keyLight.shadow.camera.near = 0.5;
            keyLight.shadow.camera.far = 50;
            keyLight.shadow.camera.left = -20;
            keyLight.shadow.camera.right = 20;
            keyLight.shadow.camera.top = 20;
            keyLight.shadow.camera.bottom = -20;
            keyLight.shadow.bias = -0.0001;
        }
        
        this.group.add(keyLight);
        this.keyLight = keyLight;

        // Additional cyan fill light
        const cyanFill = new THREE.DirectionalLight(0x0088aa, 0.4);
        cyanFill.position.set(10, 20, 10);
        this.group.add(cyanFill);

        // Subtle rim light for depth - dark blue
        const rimLight = new THREE.DirectionalLight(0x002244, 0.4);
        rimLight.position.set(-10, 15, -10);
        this.group.add(rimLight);
    }

    /**
     * Create animated data flow shader for blue stripes
     * Enhanced with white data packets flowing through cyan-to-dark-blue areas
     */
    _createDataFlowShader() {
        // Shader that detects blue stripes and animates white data flowing through them
        const dataFlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: null },
                uFlowSpeed: { value: 2.0 }, // Faster flow
                uFlowIntensity: { value: this.emissiveIntensity * 1.5 },
                uDataColor: { value: new THREE.Color(0xffffff) }, // WHITE data packets
                uCyanColor: { value: new THREE.Color(0x00ccff) }, // Bright cyan
                uDarkBlueColor: { value: new THREE.Color(0x001122) }, // Dark blue (near black)
                uBlueThreshold: { value: 0.25 }, // Lower threshold to catch more blue areas
                uStripeDirection: { value: 0.0 }, // 0 = auto-detect, 1 = horizontal, 2 = vertical
                uCameraPosition: { value: new THREE.Vector3() },
                uBaseTextureIntensity: { value: 0.7 }, // Preserve original texture slightly
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform sampler2D uTexture;
                uniform float uFlowSpeed;
                uniform float uFlowIntensity;
                uniform vec3 uDataColor; // White
                uniform vec3 uCyanColor; // Bright cyan
                uniform vec3 uDarkBlueColor; // Dark blue near black
                uniform float uBlueThreshold;
                uniform float uStripeDirection;
                uniform vec3 uCameraPosition;
                uniform float uBaseTextureIntensity;
                
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                
                void main() {
                    vec3 baseColor = uDarkBlueColor.rgb; // Dark blue base (near black)
                    
                    // Sample original texture (preserves existing shading)
                    vec4 texSample = texture2D(uTexture, vUv);
                    vec3 texColor = texSample.a > 0.0 || length(texSample.rgb) > 0.01 ? texSample.rgb : baseColor;
                    bool hasTexture = length(texColor - baseColor) > 0.01;
                    
                    // Preserve original texture color with reduced intensity
                    vec3 originalColor = mix(baseColor, texColor, uBaseTextureIntensity);
                    
                    // Detect blue/cyan areas (where data flows)
                    float blueChannel = hasTexture ? texColor.b : 0.6;
                    float greenChannel = hasTexture ? texColor.g : 0.4;
                    float blueDominance = blueChannel - max(texColor.r, greenChannel * 0.8);
                    
                    // Create gradient from cyan to dark blue based on blue intensity
                    float blueIntensity = smoothstep(0.0, 1.0, blueChannel);
                    vec3 gradientColor = mix(uDarkBlueColor, uCyanColor, blueIntensity);
                    
                    // Detect if this is a blue/cyan stripe area
                    bool isBlueStripe = blueDominance > uBlueThreshold || 
                                       blueChannel > 0.4 ||
                                       (!hasTexture && (mod(vUv.x * 10.0, 1.0) < 0.3 || mod(vUv.y * 10.0, 1.0) < 0.3));
                    
                    // Determine flow direction (stripes can be horizontal or vertical)
                    float stripeCoord;
                    if (uStripeDirection < 0.5) {
                        // Auto-detect: check UV pattern
                        float verticalPattern = abs(sin(vUv.x * 15.0));
                        float horizontalPattern = abs(sin(vUv.y * 15.0));
                        // Use whichever pattern is stronger
                        stripeCoord = verticalPattern > horizontalPattern ? vUv.y : vUv.x;
                    } else if (uStripeDirection < 1.5) {
                        stripeCoord = vUv.y; // Horizontal stripes
                    } else {
                        stripeCoord = vUv.x; // Vertical stripes
                    }
                    
                    vec3 finalColor = originalColor;
                    
                    if (isBlueStripe) {
                        // Create continuous flowing WHITE data packets
                        float flow = mod(stripeCoord * 4.0 + uTime * uFlowSpeed, 1.0);
                        
                        // Multiple overlapping white data streams for continuous flow
                        float packet1 = smoothstep(0.35, 0.45, flow) * smoothstep(0.55, 0.45, flow);
                        float packet2 = smoothstep(0.65, 0.75, flow) * smoothstep(0.85, 0.75, flow);
                        float packet3 = smoothstep(0.05, 0.15, flow) * smoothstep(0.25, 0.15, flow);
                        float packet4 = smoothstep(0.90, 1.0, flow) * smoothstep(0.10, 0.0, flow); // Wrap around
                        
                        // Combine all packets with varying intensities
                        float dataFlow = packet1 + packet2 * 0.8 + packet3 * 0.6 + packet4 * 0.7;
                        dataFlow = pow(dataFlow, 0.6); // Sharper, brighter peaks
                        
                        // Bright white data packets with trailing glow
                        vec3 whiteData = uDataColor * dataFlow * uFlowIntensity * 1.5;
                        
                        // Enhance the blue gradient with subtle pulse
                        float pulse = sin(uTime * 1.5 + stripeCoord * 8.0) * 0.15 + 0.85;
                        vec3 enhancedBlue = gradientColor * pulse;
                        
                        // Blend: base texture + cyan-to-dark-blue gradient + white flowing data
                        finalColor = mix(originalColor, enhancedBlue, 0.6) + whiteData;
                        
                        // Add edge glow to blue stripes
                        float stripeEdge = smoothstep(0.2, 0.4, blueDominance);
                        finalColor += uCyanColor * stripeEdge * uFlowIntensity * 0.3;
                    } else {
                        // Non-blue areas: preserve original but tint slightly dark blue
                        finalColor = mix(originalColor, baseColor, 0.3);
                    }
                    
                    // Subtle rim lighting for depth (cyan tint)
                    vec3 viewDir = normalize(uCameraPosition - vPosition);
                    float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
                    rim = pow(rim, 2.5);
                    finalColor += uCyanColor * rim * 0.2 * uFlowIntensity;
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            transparent: false,
        });
        
        return dataFlowMaterial;
    }

    /**
     * Create glowing server rack lights
     */
    _createServerLights() {
        // Create data flow shader for blue stripes
        this.dataFlowShader = this._createDataFlowShader();
        
        // Create optimized shader material for server panels
        // Updated with cyan-to-dark-blue color scheme
        const serverShaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uBaseColor: { value: new THREE.Color(0x001122) }, // Dark blue (near black)
                uGlowColor: { value: new THREE.Color(0x00ccff) }, // Bright cyan
                uEmissiveIntensity: { value: this.emissiveIntensity * 0.8 },
                uScanSpeed: { value: 1.5 },
                uGlowWidth: { value: 0.1 * (1.0 + this.shaderComplexity) },
                uCameraPosition: { value: new THREE.Vector3() },
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uBaseColor;
                uniform vec3 uGlowColor;
                uniform float uEmissiveIntensity;
                uniform float uScanSpeed;
                uniform float uGlowWidth;
                uniform vec3 uCameraPosition;
                
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                
                void main() {
                    // Base color
                    vec3 color = uBaseColor;
                    
                    // Scanning line effect (optimized - simple sine wave)
                    float scanLine = sin(vUv.y * 8.0 + uTime * uScanSpeed) * 0.5 + 0.5;
                    scanLine = pow(scanLine, 4.0); // Sharpen the line
                    
                    // Glow effect along scan line
                    vec3 glow = uGlowColor * scanLine * uEmissiveIntensity;
                    
                    // Subtle edge glow for tech feel
                    float edgeGlow = smoothstep(0.8, 1.0, abs(vUv.x - 0.5) * 2.0);
                    edgeGlow += smoothstep(0.8, 1.0, abs(vUv.y - 0.5) * 2.0);
                    glow += uGlowColor * edgeGlow * 0.3 * uEmissiveIntensity;
                    
                    // Add subtle normal-based rim lighting (if camera position available)
                    vec3 viewDir = normalize(uCameraPosition - vPosition);
                    float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
                    rim = pow(rim, 2.0);
                    glow += uGlowColor * rim * 0.2 * uEmissiveIntensity;
                    
                    // Final color with ambient
                    color = color + glow;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            transparent: false,
        });

        // Store material for server meshes
        this.serverShaderMaterial = serverShaderMaterial;

        // Create example server light point sources (positioned dynamically later based on mesh positions)
        const serverLightPositions = [
            [0, 5, -10],
            [5, 5, -10],
            [-5, 5, -10],
            [0, 5, -15],
        ];

        serverLightPositions.forEach((pos, i) => {
            const pointLight = new THREE.PointLight(0x00ccff, 2.5 * (1.0 - this.shaderComplexity * 0.5), 15); // Bright cyan
            pointLight.position.set(...pos);
            pointLight.castShadow = false; // Skip shadows on point lights for performance
            this.group.add(pointLight);
        });

        console.log('🖥️ Tech Lights: Server lights created');
    }

    /**
     * Create tech tree structure lighting
     */
    _createTechTreeLights() {
        // Create glowing tech tree shader
        // Updated with cyan-to-dark-blue color scheme
        const treeShaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uBaseColor: { value: new THREE.Color(0x001122) }, // Dark blue (near black)
                uEnergyColor: { value: new THREE.Color(0x00ccff) }, // Bright cyan to match theme
                uEmissiveIntensity: { value: this.emissiveIntensity },
                uPulseSpeed: { value: 1.0 },
                uBranchCount: { value: 5.0 },
                uCameraPosition: { value: new THREE.Vector3() },
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                varying float vHeight;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    vUv = uv;
                    vHeight = position.y;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uBaseColor;
                uniform vec3 uEnergyColor;
                uniform float uEmissiveIntensity;
                uniform float uPulseSpeed;
                uniform float uBranchCount;
                uniform vec3 uCameraPosition;
                
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                varying float vHeight;
                
                void main() {
                    vec3 color = uBaseColor;
                    
                    // Energy pulse traveling up the tree
                    float pulse = sin(vHeight * 0.5 + uTime * uPulseSpeed) * 0.5 + 0.5;
                    pulse = pow(pulse, 2.0);
                    
                    // Branch glow effect (simplified - no expensive noise)
                    float branchGlow = sin(vUv.x * uBranchCount * 3.14159) * 0.5 + 0.5;
                    branchGlow = pow(branchGlow, 3.0);
                    
                    // Energy flow
                    vec3 energy = uEnergyColor * pulse * branchGlow * uEmissiveIntensity;
                    
                    // Subtle normal-based rim for tech feel
                    vec3 viewDir = normalize(uCameraPosition - vPosition);
                    float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
                    rim = pow(rim, 1.5);
                    energy += uEnergyColor * rim * 0.3 * uEmissiveIntensity;
                    
                    color = color + energy;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            transparent: false,
        });

        this.treeShaderMaterial = treeShaderMaterial;

        // Create point lights around tree structure
        const treeLightPositions = [
            [0, 12, 0],
            [3, 15, 0],
            [-3, 15, 0],
            [0, 18, 0],
        ];

        treeLightPositions.forEach((pos, i) => {
            const pointLight = new THREE.PointLight(0x00ccff, 1.5 * (1.0 - this.shaderComplexity * 0.4), 20); // Cyan to match theme
            pointLight.position.set(...pos);
            pointLight.castShadow = false;
            this.group.add(pointLight);
        });

        console.log('🌳 Tech Lights: Tree structure lights created');
    }

    /**
     * Create data stream particle effects (quality-aware)
     */
    _createDataStreams() {
        // Only create if particles enabled and not on lowest quality
        if (!this.enableParticles || this.shaderComplexity < 0.5) {
            return;
        }

        const particleCount = Math.floor(50 * this.shaderComplexity);
        const geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Create streams between servers and tree
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = Math.random() * 15 + 5;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // Tech blue-green colors
            const hue = 0.5 + Math.random() * 0.15;
            colors[i3] = 0.0;
            colors[i3 + 1] = 0.8 + Math.random() * 0.2;
            colors[i3 + 2] = 1.0;
            
            sizes[i] = 2.0 + Math.random() * 3.0;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2.0) },
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                
                varying vec3 vColor;
                
                uniform float uTime;
                uniform float uPixelRatio;
                
                void main() {
                    vColor = color;
                    
                    // Animate particles
                    vec3 pos = position;
                    pos.y += sin(uTime * 2.0 + pos.x * 0.5) * 0.5;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                    
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        
        const particles = new THREE.Points(geometry, material);
        this.group.add(particles);
        this.dataStreams.push(particles);
    }

    /**
     * Apply tech shaders to meshes found in the scene
     * Call this after GLTF loads to find servers and tree structures
     */
    applyToMeshes(scene, meshNamePatterns = {}) {
        const serverPatterns = meshNamePatterns.servers || ['server', 'rack', 'panel', 'computer'];
        const treePatterns = meshNamePatterns.tree || ['tree', 'techtree', 'structure', 'tech'];
        
        scene.traverse((object) => {
            if (object.isMesh && object.material) {
                const nameLower = (object.name || '').toLowerCase();
                
                // Check if this is a server mesh
                const isServer = serverPatterns.some(pattern => nameLower.includes(pattern));
                if (isServer && this.serverShaderMaterial) {
                    // Preserve original texture if exists
                    const originalMap = object.material.map;
                    
                    // Check if mesh has blue stripes (by name or material color)
                    const hasBlueStripes = nameLower.includes('stripe') || 
                                          nameLower.includes('line') ||
                                          nameLower.includes('data') ||
                                          (object.material.color && object.material.color.getHex() > 0x0000aa);
                    
                    // Special handling for screens/monitors (add UV scrolling effect)
                    const isScreen = nameLower.includes('screen') || nameLower.includes('monitor') || nameLower.includes('display');
                    
                    // Check if mesh should use data flow shader
                    if (hasBlueStripes && this.dataFlowShader) {
                        // Apply animated data flow to blue stripes
                        const dataFlowMaterial = this.dataFlowShader.clone();
                        if (originalMap) {
                            dataFlowMaterial.uniforms.uTexture.value = originalMap;
                        }
                        
                        // Store original texture for reference
                        object.userData.originalTexture = originalMap;
                        
                        // Auto-detect stripe direction based on mesh orientation or name
                        let stripeDir = 0.0; // Auto-detect
                        if (nameLower.includes('vertical') || nameLower.includes('vert')) {
                            stripeDir = 2.0;
                        } else if (nameLower.includes('horizontal') || nameLower.includes('horiz')) {
                            stripeDir = 1.0;
                        }
                        dataFlowMaterial.uniforms.uStripeDirection.value = stripeDir;
                        
                        object.material = dataFlowMaterial;
                        object.castShadow = this.shadowEnabled;
                        object.receiveShadow = this.shadowEnabled;
                        this.serverMeshes.push(object);
                        this.dataFlowMeshes.push(object);
                        return; // Skip to next mesh in traverse
                    } else if (isScreen && originalMap) {
                        // Create holographic screen shader with UV scrolling
                        const screenShader = new THREE.ShaderMaterial({
                            uniforms: {
                                uTime: { value: 0 },
                                uTexture: { value: originalMap },
                                uScrollSpeed: { value: 0.1 },
                                uGlitchChance: { value: 0.02 }, // 2% chance of glitch per frame
                                uEmissiveIntensity: { value: this.emissiveIntensity * 0.5 },
                            },
                            vertexShader: `
                                varying vec2 vUv;
                                void main() {
                                    vUv = uv;
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                }
                            `,
                            fragmentShader: `
                                uniform float uTime;
                                uniform sampler2D uTexture;
                                uniform float uScrollSpeed;
                                uniform float uGlitchChance;
                                uniform float uEmissiveIntensity;
                                varying vec2 vUv;
                                
                                void main() {
                                    // UV scrolling effect
                                    vec2 scrollUv = vUv;
                                    scrollUv.y += mod(uTime * uScrollSpeed, 1.0);
                                    
                                    vec3 texColor = texture2D(uTexture, scrollUv).rgb;
                                    
                                    // Occasional glitch effect (screen flicker)
                                    float glitch = step(1.0 - uGlitchChance, mod(uTime * 60.0, 1.0));
                                    texColor *= (1.0 - glitch * 0.3); // Dim slightly on glitch
                                    
                                    // Tech blue glow
                                    vec3 glow = vec3(0.0, 0.7, 1.0) * uEmissiveIntensity * 0.3;
                                    texColor += glow;
                                    
                                    gl_FragColor = vec4(texColor, 1.0);
                                }
                            `,
                        });
                        // Store original texture reference
                        object.userData.originalTexture = originalMap;
                        object.material = screenShader;
                        this.serverMeshes.push(object);
                    } else if (originalMap) {
                        // For textured servers, use MeshStandardMaterial with cyan emissive
                        object.material = new THREE.MeshStandardMaterial({
                            map: originalMap,
                            emissive: new THREE.Color(0x00ccff), // Bright cyan
                            emissiveIntensity: this.emissiveIntensity * 0.4,
                            metalness: 0.8,
                            roughness: 0.2,
                        });
                    } else {
                        object.material = this.serverShaderMaterial.clone();
                    }
                    object.castShadow = this.shadowEnabled;
                    object.receiveShadow = this.shadowEnabled;
                    this.serverMeshes.push(object);
                }
                
                // Check if this is a tree structure mesh
                const isTree = treePatterns.some(pattern => nameLower.includes(pattern));
                if (isTree && this.treeShaderMaterial) {
                    const originalMap = object.material.map;
                    const shaderMaterial = this.treeShaderMaterial.clone();
                    if (originalMap) {
                        object.material = new THREE.MeshStandardMaterial({
                            map: originalMap,
                            emissive: new THREE.Color(0x00ccff), // Cyan to match theme
                            emissiveIntensity: this.emissiveIntensity * 0.5,
                            metalness: 0.6,
                            roughness: 0.3,
                        });
                    } else {
                        object.material = shaderMaterial;
                    }
                    object.castShadow = this.shadowEnabled;
                    object.receiveShadow = this.shadowEnabled;
                    this.treeMeshes.push(object);
                }
            }
        });
        
        console.log(`🔵 Tech Lights: Applied to ${this.serverMeshes.length} servers and ${this.treeMeshes.length} tree meshes`);
    }

    update(delta, camera = null) {
        this.time += delta;
        
        // Get camera position for rim lighting
        let cameraPosition = new THREE.Vector3(0, 0, 0);
        if (camera && camera.position) {
            cameraPosition = camera.position;
        } else if (this.scene && this.scene.userData.activeCamera) {
            cameraPosition = this.scene.userData.activeCamera.position;
        } else if (this.scene) {
            // Try to find camera in scene
            this.scene.traverse((child) => {
                if (child.isCamera && cameraPosition.lengthSq() === 0) {
                    cameraPosition.copy(child.position);
                }
            });
        }
        
        // Update base shader materials
        if (this.serverShaderMaterial) {
            this.serverShaderMaterial.uniforms.uTime.value = this.time;
            if (this.serverShaderMaterial.uniforms.uCameraPosition) {
                this.serverShaderMaterial.uniforms.uCameraPosition.value.copy(cameraPosition);
            }
        }
        
        if (this.treeShaderMaterial) {
            this.treeShaderMaterial.uniforms.uTime.value = this.time;
            if (this.treeShaderMaterial.uniforms.uCameraPosition) {
                this.treeShaderMaterial.uniforms.uCameraPosition.value.copy(cameraPosition);
            }
        }
        
        // Update cloned materials on server meshes
        this.serverMeshes.forEach(mesh => {
            if (mesh.material && mesh.material.uniforms) {
                if (mesh.material.uniforms.uTime) {
                    mesh.material.uniforms.uTime.value = this.time;
                }
                if (mesh.material.uniforms.uCameraPosition) {
                    mesh.material.uniforms.uCameraPosition.value.copy(cameraPosition);
                }
                // Update screen shader uniforms if present
                if (mesh.material.uniforms.uTexture && !mesh.material.uniforms.uTexture.value) {
                    // Re-apply texture if it was lost
                    const origTexture = mesh.userData.originalTexture;
                    if (origTexture) {
                        mesh.material.uniforms.uTexture.value = origTexture;
                    }
                }
            }
        });
        
        // Update data flow shaders (separate from regular server meshes)
        this.dataFlowMeshes.forEach(mesh => {
            if (mesh.material && mesh.material.uniforms) {
                if (mesh.material.uniforms.uTime) {
                    mesh.material.uniforms.uTime.value = this.time;
                }
                if (mesh.material.uniforms.uCameraPosition) {
                    mesh.material.uniforms.uCameraPosition.value.copy(cameraPosition);
                }
                // Update texture reference if needed
                if (mesh.material.uniforms.uTexture && !mesh.material.uniforms.uTexture.value) {
                    const origTexture = mesh.userData.originalTexture;
                    if (origTexture) {
                        mesh.material.uniforms.uTexture.value = origTexture;
                    }
                }
                // Ensure new uniforms exist (they should from shader creation, but check for safety)
                if (!mesh.material.uniforms.uCyanColor) {
                    mesh.material.uniforms.uCyanColor = { value: new THREE.Color(0x00ccff) };
                }
                if (!mesh.material.uniforms.uDarkBlueColor) {
                    mesh.material.uniforms.uDarkBlueColor = { value: new THREE.Color(0x001122) };
                }
                if (!mesh.material.uniforms.uDataColor) {
                    mesh.material.uniforms.uDataColor = { value: new THREE.Color(0xffffff) };
                }
            }
        });
        
        // Update cloned materials on tree meshes
        this.treeMeshes.forEach(mesh => {
            if (mesh.material && mesh.material.uniforms) {
                mesh.material.uniforms.uTime.value = this.time;
                if (mesh.material.uniforms.uCameraPosition) {
                    mesh.material.uniforms.uCameraPosition.value.copy(cameraPosition);
                }
            }
        });
        
        // Update data stream particles
        this.dataStreams.forEach(stream => {
            if (stream.material && stream.material.uniforms) {
                stream.material.uniforms.uTime.value = this.time;
            }
        });
    }
}
