import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

// Noise function (unchanged)
const SHADER_NOISE = /* glsl */`
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
`;

// HSL to RGB conversion function (unchanged)
const HSL_FUNC = /* glsl */`
    vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }
`;

export class CastleBioluminescentPlantGPU extends LightComponent {
    constructor(props = {}) {
        super(props);
        this.position = new THREE.Vector3().fromArray(props.position || [0, 0, 0]);
        this.clock = new THREE.Clock();
        this.interactionStrength = 0.0;

        // Continuous blooming animation
        this.bloomProgress = 0.0;
        this.bloomDirection = 1;
        this.bloomSpeed = 0.3;
        
        // AGGRESSIVE update throttling - quality-based
        this.updateCounter = 0;
        this.updateThrottle = 3; // Will be overridden by quality settings
        
        // Quality settings - can be overridden by props
        this.quality = props.quality || {
            plantInstanceCounts: {
                roots: 8,
                petals: 16,
                leaves: 24,
                fireflies: 35
            },
            plantFireflySize: 35.0,
            enableComplexShaders: true,
            updateThrottle: 3
        };
        
        // Apply quality-based update throttle
        this.updateThrottle = this.quality.updateThrottle || 3;
    }

    mount(scene) {
        this.plantGroup = new THREE.Group();
        this.plantGroup.position.copy(this.position);

        // Debug: Log what quality settings this plant is using
        console.log(`🌿 Creating Bioluminescent Plant at [${this.position.x}, ${this.position.y}, ${this.position.z}] with:`, {
            roots: this.quality.plantInstanceCounts.roots,
            petals: this.quality.plantInstanceCounts.petals,
            leaves: this.quality.plantInstanceCounts.leaves,
            fireflies: this.quality.plantInstanceCounts.fireflies,
            fireflySize: this.quality.plantFireflySize
        });

        // Taller, more elegant curve for fairytale plant
        const plantCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),           // Ground level
            new THREE.Vector3(-0.15, 0.4, 0),     // Gentle curve
            new THREE.Vector3(0.1, 0.9, 0.05),    // Middle arc
            new THREE.Vector3(-0.05, 1.5, 0),     // Upper curve
            new THREE.Vector3(0, 2.2, 0)          // Top - taller for better flower placement
        ]);
        
        // Flower attaches at the very top of the stem
        const topPosition = plantCurve.getPoint(1.0); // Exactly at the end of curve

        this._createBioluminescentRoots();
        this._createEnergyVeinBranch(plantCurve);
        this._createFlowerBase(topPosition);
        this._createCrystallineBloom(topPosition);
        this._createStamen(topPosition);
        // REMOVED: Crystal orb (too expensive!)
        // REMOVED: Pollen particles (too expensive!)
        // REMOVED: Aura rings (too expensive!)
        this._createInstancedLeaves(plantCurve);
        // REMOVED: Moss (not essential)
        this._createFireflies(plantCurve); // Minimal count
        // REMOVED: Magical dust (too expensive!)
        this._createAmbientLight();

        scene.add(this.plantGroup);
        this._mounted = true;
    }

    _createBioluminescentRoots() {
        const rootCount = this.quality.plantInstanceCounts.roots;
        const rootGeometry = new THREE.IcosahedronGeometry(0.1, 0); // Simpler geometry
        this.roots = new THREE.InstancedMesh(rootGeometry, null, rootCount);
        this.roots.frustumCulled = false;
        const rootData = new Float32Array(rootCount * 4);
        for(let i=0; i<rootCount; i++) {
            const angle = (i / rootCount) * Math.PI * 2;
            const radius = 0.2 + Math.random() * 0.15;
            rootData[i*4+0] = Math.cos(angle) * radius;
            rootData[i*4+1] = (Math.random() - 0.5) * 0.05;
            rootData[i*4+2] = Math.sin(angle) * radius;
            rootData[i*4+3] = Math.random();
        }
        this.roots.geometry.setAttribute('aRootData', new THREE.InstancedBufferAttribute(rootData, 4));
        this.roots.material = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: `
                attribute vec4 aRootData;
                void main() {
                    vec3 pos = position * 0.8;
                    pos += aRootData.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }`,
            fragmentShader: `
                ${HSL_FUNC}
                void main() {
                    vec3 color = hsl2rgb(vec3(0.82, 0.9, 0.6));
                    gl_FragColor = vec4(color, 0.8);
                }`,
            transparent: true, blending: THREE.AdditiveBlending
        });
        this.plantGroup.add(this.roots);
    }

    _createEnergyVeinBranch(curve) {
        // Optimized: Lower segment count
        const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.05, 6, false); // 64→32 segments, 8→6 radial
        this.branchMesh = new THREE.Mesh(tubeGeometry, new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: `
                uniform float uTime; varying vec2 vUv; varying vec3 vPosition;
                void main() { 
                    vUv = uv; 
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
                }`,
            fragmentShader: `
                uniform float uTime; varying vec2 vUv; varying vec3 vPosition;
                ${HSL_FUNC}
                void main() {
                    // GORGEOUS stem gradient: green → purple-pink
                    float gradient = vUv.y;
                    float hue = mix(0.3, 0.85, gradient); // Green base to pink top
                    float saturation = 0.7 + gradient * 0.2;
                    float lightness = 0.25 + gradient * 0.15;
                    
                    vec3 baseColor = hsl2rgb(vec3(hue, saturation, lightness));
                    
                    // Simple energy pulse (no expensive noise!)
                    float pulse = sin(vUv.y * 8.0 - uTime * 2.0) * 0.5 + 0.5;
                    pulse = pow(pulse, 6.0);
                    
                    // Bright vein glow
                    vec3 glowColor = hsl2rgb(vec3(hue + 0.1, 1.0, 0.6));
                    vec3 finalColor = baseColor + glowColor * pulse * 0.4;
                    
                    // Subtle rim glow
                    float rim = abs(sin(vUv.x * 3.14159));
                    finalColor += glowColor * rim * 0.15;
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                }`
        }));
        this.plantGroup.add(this.branchMesh);
    }

    _createFlowerBase(position) {
        // Create a beautiful bulb-like base where flower meets stem
        const baseGeometry = new THREE.SphereGeometry(0.12, 16, 12);
        baseGeometry.scale(1, 0.8, 1); // Slightly squashed sphere
        this.flowerBase = new THREE.Mesh(baseGeometry, new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: `
                uniform float uTime; varying vec3 vNormal; varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    vNormal = normalize(normalMatrix * normal);
                    vec3 pos = position;
                    // Gentle pulsing
                    pos += normal * sin(uTime * 2.0) * 0.02;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }`,
            fragmentShader: `
                uniform float uTime; varying vec3 vNormal; varying vec3 vPosition;
                ${HSL_FUNC}
                ${SHADER_NOISE}
                void main() {
                    // Purple-pink gradient from bottom to top
                    float gradient = (vPosition.y + 0.1) / 0.2;
                    float hue = 0.77 + gradient * 0.08; // Purple to pink gradient
                    float noise = snoise(vPosition.xy * 8.0 + uTime * 0.3) * 0.1;
                    vec3 color = hsl2rgb(vec3(hue + noise, 0.95, 0.55));
                    
                    // Rim glow
                    vec3 viewDir = normalize(vPosition - cameraPosition);
                    float rim = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
                    color += hsl2rgb(vec3(hue + 0.05, 1.0, 0.7)) * rim * 0.4;
                    
                    gl_FragColor = vec4(color, 1.0);
                }`,
            transparent: false
        }));
        this.flowerBase.position.copy(position);
        this.flowerBase.position.y -= 0.05; // Slightly below flower attachment point
        this.plantGroup.add(this.flowerBase);
    }

    _createCrystallineBloom(position) {
        const shardCount = this.quality.plantInstanceCounts.petals;
        // Adjust geometry segments based on quality
        const segments = this.quality.enableComplexShaders ? [2, 4] : [1, 2];
        const shardGeometry = new THREE.PlaneGeometry(0.45, 0.9, segments[0], segments[1]);
        shardGeometry.translate(0, 0.3, 0);
        
        this.crystallineBloom = new THREE.InstancedMesh(shardGeometry, null, shardCount);
        this.crystallineBloom.frustumCulled = false;
        const petalData = new Float32Array(shardCount * 4);
        for(let i=0; i < shardCount; i++) {
            petalData[i*4+0] = (i / shardCount) * Math.PI * 2;
            petalData[i*4+1] = 0.5 + Math.random() * 0.5;
            petalData[i*4+2] = Math.random() * 0.15 + 0.9; // Slight variation for natural look
            petalData[i*4+3] = 0.5 + Math.random() * 0.5;
        }
        this.crystallineBloom.geometry.setAttribute('aPetalData', new THREE.InstancedBufferAttribute(petalData, 4));
        this.crystallineBloom.material = new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0 }, 
                uBloomProgress: { value: 0.0 }, 
                uInteractionStrength: { value: 0.0 }
            },
            vertexShader: `
                uniform float uTime; uniform float uBloomProgress; 
                uniform float uInteractionStrength;
                attribute vec4 aPetalData; varying vec3 vNormal; varying vec3 vViewPosition; varying vec2 vUv;
                
                mat4 rotationY(float angle) { float s = sin(angle); float c = cos(angle); return mat4(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1); }
                mat4 rotationZ(float angle) { float s = sin(angle); float c = cos(angle); return mat4(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
                
                void main() {
                    vUv = uv;
                    float angle = aPetalData.x; 
                    float random = aPetalData.y; 
                    vec3 pos = position;
                    
                    // BEAUTIFUL petal shape with natural curve
                    float petalCurve = sin(uv.y * 3.14159) * 0.25;
                    pos.x += petalCurve * (1.0 - abs(uv.x * 2.0 - 1.0)) * 1.2;
                    
                    // Elegant taper from base to tip
                    float widthScale = pow(sin(uv.y * 3.14159), 1.3);
                    pos.x *= widthScale * 1.1;
                    
                    // Graceful 3D curl
                    pos.z += sin(uv.y * 3.14159) * 0.15 * (1.0 - uv.y * 0.5);
                    
                    // SMOOTH OPENING ANIMATION - petals unfold gracefully
                    float openAngle = uBloomProgress * 1.4 * (0.85 + random * 0.3);
                    mat4 openMatrix = rotationZ(openAngle); 
                    pos = (openMatrix * vec4(pos, 1.0)).xyz;
                    
                    // Placement around center
                    mat4 placementMatrix = rotationY(angle); 
                    pos = (placementMatrix * vec4(pos, 1.0)).xyz;
                    
                    // Gentle breathing/swaying
                    float breath = sin(uTime * 1.5 + angle * 2.0) * 0.04 * uBloomProgress;
                    float sway = sin(uTime * 0.8 + random * 6.28) * 0.03;
                    pos += normalize(pos) * breath;
                    pos.x += sway;
                    
                    // Interaction response - petals reach toward player
                    pos += normalize(pos) * uInteractionStrength * 0.12;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    vNormal = normalize(normalMatrix * normal);
                    vViewPosition = -mvPosition.xyz;
                    gl_Position = projectionMatrix * mvPosition;
                }`,
            fragmentShader: `
                uniform float uTime; varying vec3 vNormal; varying vec3 vViewPosition; varying vec2 vUv;
                ${HSL_FUNC}
                
                void main() {
                    // SUPER SIMPLE gradient - minimal GPU load
                    float gradient = vUv.y;
                    float hue = 0.75 + gradient * 0.15; // Purple to pink
                    
                    vec3 color = hsl2rgb(vec3(hue, 0.9, 0.6));
                    
                    // Simple glow at base
                    float baseGlow = smoothstep(0.2, 0.0, vUv.y) * 0.5;
                    color += vec3(0.3, 0.2, 0.3) * baseGlow;
                    
                    // Simple rim (no expensive calculations)
                    vec3 viewDir = normalize(vViewPosition); 
                    float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
                    color += vec3(0.2, 0.1, 0.2) * rim * 0.3;
                    
                    float alpha = 0.85;
                    gl_FragColor = vec4(color, alpha);
                }`,
            transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
        });
        this.crystallineBloom.position.copy(position);
        this.plantGroup.add(this.crystallineBloom);
    }

    _createStamen(position) {
        // SIMPLIFIED stamen - much less GPU intensive
        const stamenGroup = new THREE.Group();
        
        // Single central glow (instead of many parts)
        const stamenGeometry = new THREE.SphereGeometry(0.08, 8, 8); // Simple sphere
        const stamen = new THREE.Mesh(stamenGeometry, new THREE.MeshBasicMaterial({
            color: 0xffaaee,
            transparent: true,
            opacity: 0.8
        }));
        stamenGroup.add(stamen);
        
        stamenGroup.position.copy(position);
        stamenGroup.position.y += 0.1;
        this.stamenGroup = stamenGroup;
        this.plantGroup.add(stamenGroup);
    }

    _createCrystalOrb(position) {
        const orbGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        this.crystalOrb = new THREE.Mesh(orbGeometry, new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0 }, 
                uAnimationProgress: { value: 0.0 },
                uInteractionStrength: { value: 0.0 }
            },
            vertexShader: `
                uniform float uTime; uniform float uAnimationProgress; uniform float uInteractionStrength;
                varying vec3 vNormal; varying vec3 vViewPosition; varying vec3 vPosition;
                void main() {
                    vec3 pos = position; 
                    pos.y += smoothstep(1.0, 2.0, uAnimationProgress) * 0.6;
                    
                    // Multi-frequency pulsing for magical effect
                    float pulse1 = sin(uTime * 3.0) * 0.05;
                    float pulse2 = sin(uTime * 5.0) * 0.03;
                    pos += normal * (pulse1 + pulse2) * (1.0 + uInteractionStrength);
                    
                    vPosition = pos;
                    vNormal = normalMatrix * normal; 
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    vViewPosition = -mvPosition.xyz; 
                    gl_Position = projectionMatrix * mvPosition;
                }`,
            fragmentShader: `
                uniform float uTime; uniform float uAnimationProgress; uniform float uInteractionStrength;
                varying vec3 vNormal; varying vec3 vViewPosition; varying vec3 vPosition;
                ${HSL_FUNC}
                ${SHADER_NOISE}
                
                void main() {
                    float opacity = 1.0 - smoothstep(3.0, 4.0, uAnimationProgress); 
                    if (opacity < 0.01) discard;
                    
                    vec3 viewDir = normalize(vViewPosition); 
                    float fresnel = pow(1.0 - abs(dot(viewDir, normalize(vNormal))), 3.0);
                    
                    // Rainbow swirling effect inside the orb
                    float noisePattern = snoise(vPosition * 5.0 + uTime * 0.5);
                    float hue = 0.75 + noisePattern * 0.3 + uTime * 0.1 + uInteractionStrength * 0.2;
                    
                    // Multiple pulsing layers
                    float pulse1 = sin(uTime * 2.0) * 0.3 + 0.7;
                    float pulse2 = sin(uTime * 3.5 + noisePattern) * 0.2 + 0.8;
                    float pulse = pulse1 * pulse2;
                    
                    // Magical energy inside
                    float energy = pow(snoise(vPosition * 8.0 - uTime * 0.8) * 0.5 + 0.5, 2.0);
                    
                    // Base color with rainbow shift
                    vec3 color = hsl2rgb(vec3(hue, 0.9, 0.6 + energy * 0.2)) * pulse;
                    
                    // Add bright inner glow with PURPLE-PINK colors (no white!)
                    vec3 innerGlow1 = hsl2rgb(vec3(hue + 0.1, 1.0, 0.75)) * energy * 0.6;
                    vec3 innerGlow2 = hsl2rgb(vec3(hue - 0.05, 0.95, 0.7)) * (sin(uTime * 4.0) * 0.2 + 0.3);
                    
                    // Sparkles inside the orb - PINK sparkles not white!
                    float sparkle = pow(snoise(vPosition * 15.0 + uTime * 1.5) * 0.5 + 0.5, 5.0);
                    vec3 sparkleColor = hsl2rgb(vec3(hue + 0.15, 1.0, 0.8));
                    
                    // Combine all effects
                    color += innerGlow1 + innerGlow2;
                    color += sparkleColor * sparkle * 0.5;
                    color += hsl2rgb(vec3(hue + 0.2, 1.0, 0.8)) * fresnel * 0.8;
                    
                    gl_FragColor = vec4(color, opacity * 0.9);
                }`,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        }));
        this.crystalOrb.position.copy(position);
        this.plantGroup.add(this.crystalOrb);
    }

    _createInstancedLeaves(curve) {
        const leavesPerPlant = this.quality.plantInstanceCounts.leaves;
        
        // Adjust leaf geometry based on quality
        const segments = this.quality.enableComplexShaders ? [1, 3] : [1, 2];
        const leafGeometry = new THREE.PlaneGeometry(0.2, 1.0, segments[0], segments[1]);
        leafGeometry.translate(0, 0.5, 0);

        this.leafMesh = new THREE.InstancedMesh(leafGeometry, null, leavesPerPlant);
        this.leafMesh.frustumCulled = false;

        const leafData = new Float32Array(leavesPerPlant * 4);
        const leafRandoms = new Float32Array(leavesPerPlant * 4);

        for (let j = 0; j < leavesPerPlant; j++) {
            const t = 0.3 + Math.random() * 0.5; // Better distribution
            
            const pos = curve.getPoint(t);
            const tangent = curve.getTangent(t);
            const angle = Math.atan2(tangent.x, tangent.z);
            const perpendicular = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0,1,0)).normalize();
            
            // More natural placement around branch
            const branchOffset = (Math.random() - 0.5) * 0.08;
            pos.add(perpendicular.multiplyScalar(branchOffset));

            leafData[j*4+0] = pos.x; 
            leafData[j*4+1] = pos.y; 
            leafData[j*4+2] = pos.z;
            leafData[j*4+3] = angle + (Math.random() - 0.5) * 1.2; // Reduced angle variation
            
            leafRandoms[j*4+0] = Math.random(); // Color variation
            leafRandoms[j*4+1] = 0.3 + Math.random() * 0.4; // Tilt variation (reduced)
            leafRandoms[j*4+2] = 0.7 + Math.random() * 0.3; // Scale variation (reduced)
            leafRandoms[j*4+3] = Math.random() * 6.28; // Growth phase offset
        }

        this.leafMesh.geometry.setAttribute('aLeafData', new THREE.InstancedBufferAttribute(leafData, 4));
        this.leafMesh.geometry.setAttribute('aRandoms', new THREE.InstancedBufferAttribute(leafRandoms, 4));

        this.leafMesh.material = new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0 },
                uInteractionStrength: { value: 0.0 }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uInteractionStrength;
                attribute vec4 aLeafData;
                attribute vec4 aRandoms;
                varying vec3 vColor;
                varying vec2 vUv;
                ${HSL_FUNC}
                
                mat4 rotationMatrix(vec3 axis, float angle) {
                    axis = normalize(axis);
                    float s = sin(angle);
                    float c = cos(angle);
                    float oc = 1.0 - c;
                    return mat4(
                        oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                        0.0,                                0.0,                                0.0,                                1.0
                    );
                }

                void main() {
                    vUv = uv;
                    float growthPhase = aRandoms.w;
                    
                    // BEAUTIFUL FAIRY LEAF SHAPE - elegant and natural
                    vec3 leafPos = vec3(0.0);
                    float v = uv.y; // 0 to 1 from base to tip
                    
                    // Perfect leaf shape - narrow base, wide middle, pointed tip
                    float widthProfile = sin(v * 3.14159);
                    widthProfile = pow(widthProfile, 1.8) * 1.3; // More dramatic taper
                    
                    // Natural asymmetry with shimmer
                    float shimmerWave = sin(v * 8.0 + uTime * 2.0) * 0.06;
                    
                    // Apply elegant shape
                    leafPos.x = position.x * widthProfile + shimmerWave;
                    leafPos.y = position.y;
                    
                    // Beautiful 3D curl - like real fairy wings
                    leafPos.z = sin(v * 6.283) * 0.08 * (1.0 - abs(position.x)) * v;
                    
                    // Graceful flutter animation
                    float flutter = sin(uTime * 2.5 + growthPhase) * 0.08 + 0.92;
                    leafPos *= flutter;
                    
                    // Optimal scale for beauty
                    float masterScale = 0.4;
                    float randomScale = aRandoms.z;
                    
                    // Smooth flowing motion
                    float flow = sin(uTime * 1.2 + aLeafData.y * 4.0) * 0.12;
                    float ripple = sin(uTime * 3.5 + aLeafData.z * 6.0) * 0.04;
                    
                    // Interaction - leaves reach toward player
                    float interactionReach = sin(uTime * 4.0 + aLeafData.x * 8.0) * uInteractionStrength * 0.4;
                    
                    // Apply rotations
                    mat4 baseRotMatrix = rotationMatrix(vec3(0.0, 1.0, 0.0), aLeafData.w);
                    mat4 tiltMatrix = rotationMatrix(vec3(1.0, 0.0, 0.0), aRandoms.y * 0.8);
                    mat4 flowMatrix = rotationMatrix(vec3(0.0, 0.0, 1.0), flow + ripple + interactionReach);
                    
                    // Transform leaf position
                    vec3 finalPos = leafPos * randomScale * masterScale;
                    finalPos = (baseRotMatrix * tiltMatrix * flowMatrix * vec4(finalPos, 1.0)).xyz;
                    finalPos += aLeafData.xyz;
                    
                    // Vibrant purple-pink color
                    float hue = mix(0.75, 0.88, aRandoms.x);
                    float glow = sin(uTime * 2.5 + aRandoms.x * 6.28) * 0.2 + 0.4;
                    vColor = hsl2rgb(vec3(hue, 0.9, 0.5 + glow));
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
                }`,
            fragmentShader: `
                varying vec3 vColor;
                varying vec2 vUv;
                
                void main() {
                    // ULTRA SIMPLE - just color and fade
                    float edgeFade = 1.0 - smoothstep(0.4, 0.5, abs(vUv.x - 0.5));
                    edgeFade *= 1.0 - smoothstep(0.85, 1.0, vUv.y);
                    
                    gl_FragColor = vec4(vColor, 0.85 * edgeFade);
                }`,
            transparent: true, 
            side: THREE.DoubleSide,
            alphaTest: 0.1
        });
        this.plantGroup.add(this.leafMesh);
    }

    _createInstancedMoss(curve) {
        const mossPatches = 40; // HALVED for performance
        const mossGeometry = new THREE.SphereGeometry(0.035, 5, 4); // Slightly larger, fewer instances
        this.mossMesh = new THREE.InstancedMesh(mossGeometry, null, mossPatches);
        this.mossMesh.frustumCulled = false;
        const mossData = new Float32Array(mossPatches * 4);
        for (let i = 0; i < mossPatches; i++) {
            const t = Math.random();
            const pointOnCurve = curve.getPoint(t);
            const tangent = curve.getTangent(t).normalize();
            const randomVec = new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).normalize();
            const perpendicular = new THREE.Vector3().crossVectors(tangent, randomVec).normalize();
            const offset = perpendicular.multiplyScalar(0.04);
            mossData[i*4+0] = pointOnCurve.x+offset.x; mossData[i*4+1] = pointOnCurve.y+offset.y; mossData[i*4+2] = pointOnCurve.z+offset.z;
            mossData[i*4+3] = Math.random() * Math.PI * 2.0;
        }
        this.mossMesh.geometry.setAttribute('aMossData', new THREE.InstancedBufferAttribute( mossData, 4));
        this.mossMesh.material = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: `uniform float uTime; attribute vec4 aMossData; void main() { float scale=0.7+sin(uTime*1.5+aMossData.w)*0.3; vec3 pos=position*scale; pos+=aMossData.xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}`,
            fragmentShader: `
                uniform float uTime;
                ${HSL_FUNC}
                void main() {
                    // Vibrant purple-magenta moss
                    vec3 color = hsl2rgb(vec3(0.78, 0.9, 0.5 + sin(uTime * 0.5) * 0.1));
                    gl_FragColor = vec4(color, 0.95);
                }`,
            transparent: true
        });
        this.plantGroup.add(this.mossMesh);
    }

    _createFireflies(curve) {
        const fireflyCount = this.quality.plantInstanceCounts.fireflies;
        const positions = new Float32Array(fireflyCount * 3);
        const randoms = new Float32Array(fireflyCount * 4);
        const colors = new Float32Array(fireflyCount * 3); // Individual colors
        
        for (let i = 0; i < fireflyCount; i++) {
            const t = Math.random();
            const pos = curve.getPoint(t);
            // More natural distribution around the plant
            pos.x += (Math.random() - 0.5) * 1.5;
            pos.y += Math.random() * 2.2;
            pos.z += (Math.random() - 0.5) * 1.5;
            pos.toArray(positions, i * 3);
            
            randoms[i * 4 + 0] = Math.random() * 10; 
            randoms[i * 4 + 1] = Math.random() * 10;
            randoms[i * 4 + 2] = Math.random() * 10; 
            randoms[i * 4 + 3] = Math.random() * 10;
            
            // PURPLE-PINK-MAGENTA COLOR VARIATION - fairytale colors only!
            colors[i * 3 + 0] = 0.75 + Math.random() * 0.15; // Hue: 0.75-0.9 (purple to pink)
            colors[i * 3 + 1] = 0.9 + Math.random() * 0.1; // High saturation
            colors[i * 3 + 2] = 0.6 + Math.random() * 0.3; // Bright but not white
        }
        
        const fireflyGeometry = new THREE.BufferGeometry();
        fireflyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        fireflyGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4));
        fireflyGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        
        // Add emissive boost for LOW quality - makes fireflies BRIGHTER with no GPU cost!
        const emissiveBoost = this.quality.plantEmissiveBoost || 1.0;
        
        this.fireflies = new THREE.Points(fireflyGeometry, new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0 }, 
                uFireflySize: { value: this.quality.plantFireflySize },
                uInteractionStrength: { value: 0.0 },
                uEmissiveBoost: { value: emissiveBoost } // Brightness multiplier!
            },
            vertexShader: `
                uniform float uTime; uniform float uFireflySize; uniform float uInteractionStrength;
                attribute vec4 aRandom; attribute vec3 aColor; 
                varying vec3 vColor;
                ${SHADER_NOISE}
                
                void main() {
                    vec3 basePos = position;
                    
                    // Improved natural movement with 3D noise
                    float noiseX = snoise(vec2(uTime * 0.3 + aRandom.x, aRandom.y));
                    float noiseY = snoise(vec2(uTime * 0.25 + aRandom.z, aRandom.w));
                    float noiseZ = snoise(vec2(uTime * 0.35 + aRandom.y, aRandom.z));
                    
                    // Circular flight pattern around plant
                    float circleTime = uTime * 0.5 + aRandom.x * 6.28;
                    float circleX = sin(circleTime) * 0.3;
                    float circleZ = cos(circleTime) * 0.3;
                    
                    vec3 offset = vec3(noiseX + circleX, noiseY, noiseZ + circleZ) * 0.4;
                    
                    // Interaction response - fireflies get excited
                    vec3 interactionOffset = vec3(
                        sin(uTime * 8.0 + aRandom.x * 10.0),
                        sin(uTime * 6.0 + aRandom.y * 8.0),
                        sin(uTime * 7.0 + aRandom.z * 9.0)
                    ) * uInteractionStrength * 0.8;
                    
                    vec3 finalPos = basePos + offset + interactionOffset;
                    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
                    
                    // Size variation
                    float sizeVariation = 0.7 + sin(uTime * 5.0 + aRandom.w * 10.0) * 0.3;
                    gl_PointSize = uFireflySize * sizeVariation * (1.0 / -mvPosition.z);
                    
                    vColor = aColor;
                    gl_Position = projectionMatrix * mvPosition;
                }`,
            fragmentShader: `
                uniform float uTime; 
                uniform float uEmissiveBoost; 
                varying vec3 vColor;
                ${HSL_FUNC}
                
                void main() {
                    // SIMPLE glow - minimal GPU
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    float glow = 1.0 - smoothstep(0.2, 0.5, dist);
                    
                    // Apply emissive boost for LOW quality - MUCH brighter!
                    vec3 color = hsl2rgb(vColor) * uEmissiveBoost;
                    gl_FragColor = vec4(color, glow * 0.7);
                }`,
            transparent: true, 
            blending: THREE.AdditiveBlending, 
            depthWrite: false
        }));
        this.plantGroup.add(this.fireflies);
    }

    _createPollenParticles(position) {
        // REDUCED pollen
        const pollenCount = 10; // 20 → 10
        const positions = new Float32Array(pollenCount * 3);
        const randoms = new Float32Array(pollenCount * 3);
        
        for (let i = 0; i < pollenCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.15;
            positions[i * 3 + 0] = position.x + Math.cos(angle) * radius;
            positions[i * 3 + 1] = position.y + Math.random() * 0.3;
            positions[i * 3 + 2] = position.z + Math.sin(angle) * radius;
            
            randoms[i * 3 + 0] = Math.random() * 10;
            randoms[i * 3 + 1] = Math.random() * 10;
            randoms[i * 3 + 2] = Math.random() * 10;
        }
        
        const pollenGeometry = new THREE.BufferGeometry();
        pollenGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pollenGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
        
        this.pollenParticles = new THREE.Points(pollenGeometry, new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0 },
                uSize: { value: 20.0 }
            },
            vertexShader: `
                uniform float uTime; uniform float uSize; attribute vec3 aRandom;
                ${SHADER_NOISE}
                void main() {
                    vec3 pos = position;
                    // Float upward with spiral
                    float riseTime = uTime * 0.5 + aRandom.z;
                    float riseHeight = mod(riseTime, 3.0);
                    pos.y += riseHeight;
                    
                    // Spiral motion
                    float spiral = riseTime * 2.0;
                    pos.x += sin(spiral + aRandom.x) * 0.08;
                    pos.z += cos(spiral + aRandom.y) * 0.08;
                    
                    // Gentle drift
                    float drift = snoise(vec2(uTime * 0.3 + aRandom.x, aRandom.y)) * 0.05;
                    pos.x += drift;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = uSize * (1.0 / -mvPosition.z) * (1.0 - riseHeight / 3.0);
                    gl_Position = projectionMatrix * mvPosition;
                }`,
            fragmentShader: `
                uniform float uTime;
                ${HSL_FUNC}
                void main() {
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
                    
                    // Golden-yellow pollen color
                    float sparkle = sin(uTime * 5.0 + gl_FragCoord.x * 0.1) * 0.3 + 0.7;
                    vec3 color = hsl2rgb(vec3(0.15, 0.95, 0.7)) * sparkle;
                    
                    gl_FragColor = vec4(color, alpha * 0.7);
                }`,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        this.plantGroup.add(this.pollenParticles);
    }

    _createMagicalAuraRings(position) {
        // SIMPLIFIED - only 1 ring, less complex
        const ringGeometry = new THREE.RingGeometry(0.3, 0.35, 16); // 32 → 16 segments
        ringGeometry.rotateX(-Math.PI / 2);
        
        const ring = new THREE.Mesh(ringGeometry, new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0 }
            },
            vertexShader: `
                uniform float uTime;
                void main() {
                    vec3 pos = position;
                    float wave = sin(uTime * 1.2) * 0.5 + 0.5;
                    float scale = 1.0 + wave * 2.5;
                    pos *= scale;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }`,
            fragmentShader: `
                uniform float uTime;
                ${HSL_FUNC}
                void main() {
                    float wave = sin(uTime * 1.2) * 0.5 + 0.5;
                    float fade = 1.0 - wave;
                    vec3 color = hsl2rgb(vec3(0.82, 0.9, 0.7));
                    gl_FragColor = vec4(color, fade * 0.3);
                }`,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        }));
        ring.position.copy(position);
        ring.position.y += 0.1;
        this.auraRing = ring; // Single ring
        this.plantGroup.add(ring);
    }

    _createMagicalDust(curve) {
        // MINIMAL dust
        const dustCount = 12; // 20 → 12
        const positions = new Float32Array(dustCount * 3);
        const randoms = new Float32Array(dustCount * 3);
        
        for (let i = 0; i < dustCount; i++) {
            const t = Math.random();
            const pos = curve.getPoint(t);
            pos.x += (Math.random() - 0.5) * 0.8;
            pos.y += Math.random() * 2.0;
            pos.z += (Math.random() - 0.5) * 0.8;
            pos.toArray(positions, i * 3);
            
            randoms[i * 3 + 0] = Math.random() * 10;
            randoms[i * 3 + 1] = Math.random() * 10;
            randoms[i * 3 + 2] = Math.random() * 10;
        }
        
        const dustGeometry = new THREE.BufferGeometry();
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        dustGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
        
        this.magicalDust = new THREE.Points(dustGeometry, new THREE.ShaderMaterial({
            uniforms: { 
                uTime: { value: 0 }, 
                uSize: { value: 25.0 }
            },
            vertexShader: `
                uniform float uTime; uniform float uSize; attribute vec3 aRandom;
                ${SHADER_NOISE}
                void main() {
                    vec3 pos = position;
                    // Slow floating motion
                    float noiseX = snoise(vec2(uTime * 0.2 + aRandom.x, aRandom.y)) * 0.3;
                    float noiseY = snoise(vec2(uTime * 0.15 + aRandom.z, aRandom.x)) * 0.3;
                    float noiseZ = snoise(vec2(uTime * 0.18 + aRandom.y, aRandom.z)) * 0.3;
                    pos += vec3(noiseX, noiseY, noiseZ);
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = uSize * (1.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }`,
            fragmentShader: `
                uniform float uTime;
                ${HSL_FUNC}
                void main() {
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                    
                    // Twinkling purple-pink dust
                    float twinkle = sin(uTime * 3.0 + gl_FragCoord.x * 0.1) * 0.3 + 0.7;
                    vec3 color = hsl2rgb(vec3(0.8 + sin(uTime * 0.5) * 0.1, 0.9, 0.7));
                    
                    gl_FragColor = vec4(color * twinkle, alpha * 0.6);
                }`,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        this.plantGroup.add(this.magicalDust);
    }

    _createAmbientLight() {
        // Quality-based light creation - OPTIMIZED for brightness without GPU cost!
        if (!this.quality.enableComplexShaders) {
            // LOW QUALITY: SUPER BRIGHT single light to illuminate hallways!
            const intensity = this.quality.plantLightIntensity || 10.0; // Cranked up for hallway coverage!
            const distance = this.quality.plantLightDistance || 90;      // Extended to light entire hallways
            const decay = this.quality.plantLightDecay || 1.8;           // Lower decay = light travels much further
            this.ambientLight = new THREE.PointLight(0xff88ff, intensity, distance, decay);
            this.ambientLight.position.set(0, 1.5, 0);
            this.plantGroup.add(this.ambientLight);
            console.log(`💡 Plant using ULTRA LOW quality lighting: 1 SUPER BRIGHT light, intensity ${intensity}, distance ${distance}, decay ${decay}`);
        } else if (this.quality.plantInstanceCounts.fireflies < 20) {
            // MEDIUM QUALITY: Two lights with extended range for hallway illumination
            const intensity = this.quality.plantLightIntensity || 5.0;
            const distance = this.quality.plantLightDistance || 80;
            const decay = this.quality.plantLightDecay || 1.9;
            
            this.ambientLight = new THREE.PointLight(0xff77ee, intensity, distance, decay);
            this.ambientLight.position.set(0, 1.5, 0);
            this.plantGroup.add(this.ambientLight);
            
            // Secondary light with 60% intensity and slightly shorter range
            this.secondaryLight = new THREE.PointLight(0xff55dd, intensity * 0.6, distance * 0.7, decay + 0.2);
            this.secondaryLight.position.set(0, 1.0, 0);
            this.plantGroup.add(this.secondaryLight);
            console.log(`💡 Plant using MEDIUM quality lighting: 2 lights, intensity ${intensity}, distance ${distance}, decay ${decay}`);
        } else {
            // HIGH QUALITY: Full 3-light setup with MAXIMUM range
            this.ambientLight = new THREE.PointLight(0xff77ee, 8.0, 100, 1.8); // Extended 60→100!
            this.ambientLight.position.set(0, 1.5, 0);
            this.plantGroup.add(this.ambientLight);
            
            this.secondaryLight = new THREE.PointLight(0xff55dd, 4.0, 70, 2.0); // Extended 40→70
            this.secondaryLight.position.set(0, 1.0, 0);
            this.plantGroup.add(this.secondaryLight);
            
            this.tertiaryLight = new THREE.PointLight(0xffaaee, 3.2, 60, 2.0); // Extended 35→60
            this.tertiaryLight.position.set(0, 2.0, 0);
            this.plantGroup.add(this.tertiaryLight);
            console.log('💡 Plant using HIGH quality lighting: 3 lights, MAXIMUM range');
        }
    }

    updatePlayerPosition(playerPosition) {
        if (!this._mounted) return;
        const distance = this.plantGroup.position.distanceTo(playerPosition);
        const strength = 1.0 - Math.min(distance / 8.0, 1.0);
        this.interactionStrength = THREE.MathUtils.lerp(this.interactionStrength, strength > 0 ? strength * strength : 0, 0.05);
        
        // Player proximity speeds up blooming
        if (this.interactionStrength > 0.5) {
            this.bloomSpeed = 0.4 + this.interactionStrength * 0.3; // Faster when player is close
        } else {
            this.bloomSpeed = 0.3; // Normal speed
        }
    }

    update() {
        if (!this._mounted) return;
        
        // THROTTLE UPDATES for performance (quality-based)
        this.updateCounter++;
        if (this.updateCounter < this.updateThrottle) return;
        this.updateCounter = 0;
        
        // Skip expensive calculations on LOW quality (update every OTHER throttled frame)
        if (!this.quality.enableComplexShaders && this.updateCounter % 2 === 0) {
            return;
        }
        
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = this.clock.getDelta() * this.updateThrottle; // Compensate for throttling
        
        // Blooming animation
        this.bloomProgress += deltaTime * this.bloomSpeed * this.bloomDirection;
        
        if (this.bloomProgress >= 1.0) {
            this.bloomProgress = 1.0;
            this.bloomDirection = -1;
        } else if (this.bloomProgress <= 0.3) {
            this.bloomProgress = 0.3;
            this.bloomDirection = 1;
        }
        
        const easedBloom = THREE.MathUtils.smoothstep(this.bloomProgress, 0.3, 1.0);
        
        // Update interaction strength on materials
        if (this.crystallineBloom) {
            this.crystallineBloom.material.uniforms.uBloomProgress.value = easedBloom;
        }
        if (this.stamenGroup) {
            this.stamenGroup.scale.setScalar(0.8 + easedBloom * 0.3);
        }
        
        this.plantGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.05;
        this.plantGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.05;
        const timeUniform = { value: elapsedTime };
        // Only update essential elements
        if(this.branchMesh) this.branchMesh.material.uniforms.uTime = timeUniform;
        if(this.crystallineBloom) this.crystallineBloom.material.uniforms.uTime = timeUniform;
        if(this.fireflies) this.fireflies.material.uniforms.uTime = timeUniform;
        if (this.ambientLight) {
            const baseIntensity = 1.0 + Math.sin(elapsedTime * 1.5) * 0.3;
            const interactionGlow = this.interactionStrength * 4.0;
            const brightnessMultiplier = 6.0;
            this.ambientLight.intensity = brightnessMultiplier * (baseIntensity + interactionGlow);
            
            // Animate secondary lights for magical shimmer
            if (this.secondaryLight) {
                this.secondaryLight.intensity = 3.0 + Math.sin(elapsedTime * 2.0) * 1.0 + interactionGlow * 2.0;
            }
            if (this.tertiaryLight) {
                this.tertiaryLight.intensity = 2.5 + Math.cos(elapsedTime * 1.8) * 0.8 + interactionGlow * 1.5;
            }
        }
    }

    unmount(scene) {
        if (!this._mounted) return;
        scene.remove(this.plantGroup);
        this.roots?.geometry.dispose(); this.roots?.material.dispose();
        this.branchMesh?.geometry.dispose(); this.branchMesh?.material.dispose();
        this.flowerBase?.geometry.dispose(); this.flowerBase?.material.dispose();
        this.crystallineBloom?.geometry.dispose(); this.crystallineBloom?.material.dispose();
        this.leafMesh?.geometry.dispose(); this.leafMesh?.material.dispose();
        this.fireflies?.geometry.dispose(); this.fireflies?.material.dispose();
        if(this.stamenGroup) {
            this.stamenGroup.children.forEach(child => {
                child.geometry?.dispose();
                child.material?.dispose();
            });
        }
        this._mounted = false;
    }
}