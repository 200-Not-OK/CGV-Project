import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

/**
 * RedLightning - Physically accurate lightning using DBM (Dielectric Breakdown Model)
 * Based on real lightning physics:
 * - Stepped leader propagates downward (~1.5×10^5 m/s)
 * - Return stroke travels upward (~1.0×10^8 m/s) - this is the bright flash
 * - Fractal branching with realistic propagation
 */
export class RedLightning extends LightComponent {
    static sharedClock = null;
    
    constructor(props = {}) {
        super(props);
        
        // Initialize shared clock
        if (!RedLightning.sharedClock) {
            RedLightning.sharedClock = new THREE.Clock();
            RedLightning.sharedClock.start();
        }
        
        this.time = 0;
        // --- Improved for "roof start" (default to high Y)
        // If no position is given, start up high at y=14
        this.basePosition = new THREE.Vector3().fromArray(props.position || [0, 14, 0]);
        
        // UNIQUE SEED for each lightning instance - creates unique shapes
        this.seed = Math.random() * 10000;
        
        // Get quality settings
        const quality = props.quality || {};
        const qualityTier = quality.tier || 'MEDIUM';
        
        // AGGRESSIVE optimization for low-end devices
        let branchMultiplier = 1.0;
        let intensityMultiplier = 1.0;
        let frequencyMultiplier = 1.0;
        let geometryMultiplier = 1.0;
        
        if (qualityTier === 'LOW') {
            // VERY aggressive reduction for integrated GPUs
            branchMultiplier = 0.2; // Max 1 branch (20% of 5 = 1)
            intensityMultiplier = 0.6; // Much dimmer
            frequencyMultiplier = 0.5; // Strike half as often
            geometryMultiplier = 0.5; // Simpler geometry
        } else if (qualityTier === 'MEDIUM') {
            branchMultiplier = 0.5; // Max 2-3 branches
            intensityMultiplier = 0.75;
            frequencyMultiplier = 0.75;
            geometryMultiplier = 0.75;
        }
        // HIGH uses full quality (multiplier = 1.0)
        
        // --- ENHANCED COLOR SYSTEM ---
        // Shocking vivid lightning with animated colors!
        this.color = props.color || 0x8be9fd; // Bright blue-cyan core (default)
        this.edgeColor = props.edgeColor || 0x5321f0; // Dramatic deep purple/blue edge
        this.branchColor = props.branchColor || 0xFF007C; // Hot magenta for branches
        this.intensity = (props.intensity || 5.5) * intensityMultiplier;
        this.strikeFrequency = (props.strikeFrequency || 0.32) * frequencyMultiplier;
        this.boltLength = props.length || 18.0; // Long dramatic bolts
        this.maxBranches = Math.max(1, Math.floor((props.branches || 5) * branchMultiplier));
        this.qualityTier = qualityTier;
        this.geometryMultiplier = geometryMultiplier;
        
        // Physics-based timing (scaled for maximum visibility)
        // Real leader: ~20ms, we use ~2s for dramatic visual effect
        this.leaderDuration = 2.0; // Stepped leader phase - slow dramatic growth
        this.returnDuration = 0.3; // Return stroke - flash visible longer
        this.fadeDuration = 0.8; // Afterglow - lingers for dramatic effect
        
        // State machine - stagger initial strikes
        this.phase = 'idle';
        this.phaseDuration = 0;
        // Stagger start times so lightning is always visible somewhere
        this.nextStrikeTime = Math.random() * 2; // Reduced from 3 to 2
        
        // Animation control
        this.growthProgress = 0; // 0 to 1 - how far the leader has progressed
        this.strikeIntensity = 0; // 0 to 1 - brightness of return stroke
        
        // Store meshes and materials
        this.lightningGroup = new THREE.Group();
        this.boltMeshes = [];
        this.glowMesh = null;
        this.lightningLight = null;
        
        // Pre-generate the bolt path (but don't show it yet)
        this.boltPath = null;
        this.branchPaths = [];
        
        console.log(`⚡ RedLightning created at [${this.basePosition.x.toFixed(2)}, ${this.basePosition.y.toFixed(2)}, ${this.basePosition.z.toFixed(2)}] | Quality: ${qualityTier} | Branches: ${this.maxBranches}`);
    }

    mount(scene) {
        this.lightningGroup.position.copy(this.basePosition);
        scene.add(this.lightningGroup);
        
        // Generate the lightning path using fractal algorithm
        this.generateLightningPath();
        
        // Create the visual geometry
        this.createLightningBolt();
        
        // Create glow effect at origin
        this.createGlowEffect();
        
        // Create dynamic light
        const lightColor = new THREE.Color(this.color);
        this.lightningLight = new THREE.PointLight(lightColor, 0, 25, 2);
        this.lightningLight.position.copy(this.basePosition);
        scene.add(this.lightningLight);
        
        this._mounted = true;
        console.log('⚡ RedLightning mounted with physics-based behavior');
    }

    /**
     * Seeded random for consistent but unique patterns per bolt
     */
    seededRandom() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    
    /**
     * Generate lightning path using modified DBM (Dielectric Breakdown Model)
     * Creates realistic fractal branching pattern with UNIQUE shape per instance
     */
    generateLightningPath() {
        const segments = 24;
        const path = [];
        
        let currentPos = new THREE.Vector3(0, 0, 0);
        path.push(currentPos.clone());
        
        // --- NEW: Random bolt direction every strike ---
        const azimuth = Math.random() * 2 * Math.PI; // horizontal: 0..360°
        const elevation = (Math.random() - 0.2) * (Math.PI * 0.41); // slightly up/down, mostly flat, -37°..+67°
        const stepSize = this.boltLength / segments;
        const jaggedness = 0.21 + this.seededRandom() * 0.32;
        const zigzagFrequency = 0.19 + this.seededRandom() * 0.54;
        const zigzagAmplitude = 0.09 + this.seededRandom() * 0.19;
        for (let i = 1; i <= segments; i++) {
            const nextPos = currentPos.clone();
            // Use fixed direction for most of bolt, randomize azimuth/elevation slightly for forks
            let angleA = azimuth + (this.seededRandom()-0.5)*0.35; // minor azimuth jitter per segment
            let angleE = elevation + (this.seededRandom()-0.5)*0.18; // minor vertical jitter
            let dx = Math.cos(angleE) * Math.cos(angleA) * stepSize;
            let dz = Math.cos(angleE) * Math.sin(angleA) * stepSize;
            let dy = Math.sin(angleE) * stepSize;
            nextPos.x += dx;
            nextPos.z += dz;
            nextPos.y += dy;
            // Jitter
            const angle = this.seededRandom() * Math.PI * 2;
            const deviation = (this.seededRandom() * jaggedness * stepSize);
            nextPos.x += Math.cos(angle) * deviation;
            nextPos.z += Math.sin(angle) * deviation;
            // Zigzag
            const noiseX = Math.sin(i * zigzagFrequency + this.seed * 0.01) * zigzagAmplitude * stepSize;
            const noiseZ = Math.cos(i * zigzagFrequency * 0.7 + this.seed * 0.01) * zigzagAmplitude * stepSize;
            nextPos.x += noiseX;
            nextPos.z += noiseZ;
            path.push(nextPos);
            currentPos = nextPos;
        }
        this.boltPath = path;
        // --- Branches: crawl and fork in all directions! (More ceiling-crawler and sideways forks)
        this.branchPaths = [];
        const branchPoints = Math.floor(segments * 0.7); // 70% middle for longer branches
        const actualBranches = Math.floor(3 + this.seededRandom() * 3);
        for (let b = 0; b < actualBranches; b++) {
            const branchStartIdx = Math.floor(segments * 0.15 + this.seededRandom() * branchPoints);
            const branchStart = path[branchStartIdx].clone();
            // --- Crawler branch (flat or upwards/downwards fork) ---
            const branchMajorAngle = (Math.PI * this.seededRandom()); // 0 to 180 deg in XZ
            const branchElevation = (this.seededRandom()-0.5)*1.85; // -90 to +90 deg from flat
            const branchLength = this.boltLength * (0.24 + this.seededRandom() * 0.42);
            const branchSegs = Math.floor(9 + this.seededRandom() * 7);
            const branchPath = [branchStart.clone()];
            let branchPos = branchStart.clone();
            const branchJaggedness = 0.16 + this.seededRandom() * 0.27;
            for (let i = 1; i <= branchSegs; i++) {
                const nextPos = branchPos.clone();
                const xyAngle = branchMajorAngle + (this.seededRandom()-0.5)*1.4; // XZ rotate
                const elev = branchElevation;
                nextPos.x += Math.cos(xyAngle) * (branchLength / branchSegs) * Math.cos(elev);
                nextPos.z += Math.sin(xyAngle) * (branchLength / branchSegs) * Math.cos(elev);
                nextPos.y += Math.sin(elev) * (branchLength / branchSegs);
                // Jitter
                nextPos.x += (this.seededRandom() - 0.5) * branchJaggedness;
                nextPos.z += (this.seededRandom() - 0.5) * branchJaggedness;
                nextPos.y += (this.seededRandom() - 0.5) * branchJaggedness * 0.7;
                branchPath.push(nextPos);
                branchPos = nextPos;
            }
            this.branchPaths.push({
                path: branchPath,
                startProgress: branchStartIdx / segments
            });
        }
        console.log(`⚡ Generated unique lightning with ${actualBranches} branches (seed: ${this.seed.toFixed(0)})`);
    }

    /**
     * Create the visual lightning bolt geometry with shader-based growth
     */
    createLightningBolt() {
        const boltColor = new THREE.Color(this.color);
        
        // Main bolt material with clipping shader
        const boltMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                // --- NO WHITE: use only vibrant blue, purple, magenta for gradient ---
                color1: { value: new THREE.Color(0x163cff) }, // Electric blue core
                color2: { value: new THREE.Color(this.color) }, // Main (blue/pink)
                color3: { value: new THREE.Color(0xe934fc) }, // Vivid magenta
                color4: { value: new THREE.Color(this.edgeColor) }, // Purple edge
                growthProgress: { value: 0 },
                strikeIntensity: { value: 0 },
                leaderIntensity: { value: 0.45 },
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying float vProgress; // Position along the bolt (0=top, 1=bottom)
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    // Calculate how far along the bolt this vertex is
                    vProgress = uv.y;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform vec3 color4;
                uniform float growthProgress;
                uniform float strikeIntensity;
                uniform float leaderIntensity;
                
                varying vec2 vUv;
                varying vec3 vPosition;
                varying float vProgress;
                
                // Improved noise function
                float noise(vec2 p) {
                    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                }
                
                // Simplified FBM for better performance (2 octaves instead of 4)
                float fbm(vec2 p) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    for(int i = 0; i < 2; i++) {
                        value += amplitude * noise(p);
                        p *= 2.0;
                        amplitude *= 0.5;
                    }
                    return value;
                }
                
                void main() {
                    // CRITICAL: Clip anything beyond growth progress
                    // This makes the bolt literally grow from top to bottom
                    if (vProgress > growthProgress) {
                        discard; // Don't render this pixel
                    }
                    
                    // Distance from center (for core glow)
                    float centerDist = abs(vUv.x - 0.5) * 2.0;
                    float coreFalloff = 1.0 - smoothstep(0.0, 1.2, centerDist);
                    
                    // Optimized electric noise pattern (fewer texture lookups)
                    float electricNoise = fbm(vUv * 60.0 + time * 12.0);
                    electricNoise = electricNoise * 0.7 + 0.3; // Keep it bright
                    
                    // Simplified electric arcing effect
                    float arc = sin(vUv.y * 30.0 + time * 20.0) * 0.08;
                    electricNoise += arc;
                    
                    // Stepped leader is DIM, return stroke is BRIGHT
                    float brightness = mix(leaderIntensity, 1.0, strikeIntensity);
                    
                    // Add growth tip glow effect - brighten the leading edge
                    float distanceFromTip = abs(vProgress - growthProgress);
                    float tipGlow = 0.0;
                    if (vProgress <= growthProgress && distanceFromTip < 0.1) {
                        // Within 10% of the growth tip
                        tipGlow = (1.0 - distanceFromTip / 0.1) * 0.4 * (1.0 - strikeIntensity);
                    }
                    brightness += tipGlow;
                    
                    // Enhanced color gradient (bright white core to deep blue edges)
                    vec3 color;
                    if (coreFalloff > 0.8) {
                        // Hottest core - pure white
                        color = color1;
                    } else if (coreFalloff > 0.6) {
                        // White to cyan transition
                        color = mix(color2, color1, (coreFalloff - 0.6) / 0.2);
                    } else if (coreFalloff > 0.3) {
                        // Cyan to blue
                        color = mix(color3, color2, (coreFalloff - 0.3) / 0.3);
                    } else {
                        // Blue to dark blue edges
                        color = mix(color4, color3, coreFalloff / 0.3);
                    }
                    
                    // Apply brightness and electric noise
                    color *= brightness * electricNoise;
                    
                    // Return stroke is MUCH brighter with bloom
                    color *= (1.0 + strikeIntensity * 4.0);
                    
                    // Add extra glow during strike
                    float glow = coreFalloff * strikeIntensity * 0.5;
                    color += vec3(glow * 0.3, glow * 0.8, glow * 1.0); // Blue glow
                    
                    // Add glow to growth tip
                    if (tipGlow > 0.0) {
                        color += vec3(tipGlow * 0.5, tipGlow * 1.0, tipGlow * 1.2); // Bright cyan at tip
                    }
                    
                    // Enhanced alpha for thicker appearance
                    float alpha = coreFalloff * electricNoise;
                    alpha *= (0.5 + strikeIntensity * 0.5);
                    alpha = clamp(alpha, 0.0, 1.0);
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        
        // Create main bolt tube - Quality-based segments
        const curve = new THREE.CatmullRomCurve3(this.boltPath);
        const tubularSegments = Math.max(16, Math.floor(64 * this.geometryMultiplier));
        const radialSegments = Math.max(4, Math.floor(6 * this.geometryMultiplier));
        const tubeGeometry = new THREE.TubeGeometry(curve, tubularSegments, 0.18, radialSegments, false);
        const boltMesh = new THREE.Mesh(tubeGeometry, boltMaterial);
        this.lightningGroup.add(boltMesh);
        this.boltMeshes.push({ mesh: boltMesh, material: boltMaterial, isBranch: false });
        
        // Create branches - Quality-based segments
        this.branchPaths.forEach(branchData => {
            const branchCurve = new THREE.CatmullRomCurve3(branchData.path);
            const branchTubularSegs = Math.max(8, Math.floor(24 * this.geometryMultiplier));
            const branchRadialSegs = Math.max(3, Math.floor(5 * this.geometryMultiplier));
            const branchGeometry = new THREE.TubeGeometry(branchCurve, branchTubularSegs, 0.12, branchRadialSegs, false);
            const branchMaterial = boltMaterial.clone();
            branchMaterial.uniforms.leaderIntensity.value = 0.33; // Slightly brighter
            // --- COLORFUL BRANCHES ---
            branchMaterial.uniforms.color2.value = new THREE.Color(this.branchColor); // Use dramatic color for branches
            
            const branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);
            this.lightningGroup.add(branchMesh);
            this.boltMeshes.push({ 
                mesh: branchMesh, 
                material: branchMaterial, 
                isBranch: true,
                startProgress: branchData.startProgress 
            });
        });
        
        console.log(`⚡ Created lightning with ${this.boltMeshes.length} segments`);
    }

    createGlowEffect() {
        // Quality-based glow sphere segments
        const glowSegs = Math.max(6, Math.floor(12 * this.geometryMultiplier));
        const glowGeometry = new THREE.SphereGeometry(0.8, glowSegs, glowSegs);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(this.color) },
                intensity: { value: 0 }
            },
            vertexShader: `
                varying vec3 vNormal;
                
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float intensity;
                
                varying vec3 vNormal;
                
                void main() {
                    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0, 0, 1))), 2.0);
                    vec3 glowColor = color * fresnel * intensity;
                    float alpha = fresnel * intensity * 0.8;
                    
                    gl_FragColor = vec4(glowColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.BackSide
        });
        
        this.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        this.lightningGroup.add(this.glowMesh);
    }

    update(delta) {
        if (!this._mounted) return;
        
        this.time = RedLightning.sharedClock.getElapsedTime();
        this.phaseDuration += delta;
        
        // Physics-based state machine
        switch (this.phase) {
            case 'idle':
                // Completely invisible - waiting for next strike
                if (this.time > this.nextStrikeTime) {
                    this.phase = 'leader';
                    this.phaseDuration = 0;
                    this.growthProgress = 0;
                    this.strikeIntensity = 0;
                    console.log('⚡ Stepped leader propagating...');
                }
                this.growthProgress = 0;
                this.strikeIntensity = 0;
                break;
                
            case 'leader':
                // Stepped leader grows downward (DIM phase)
                if (this.phaseDuration < this.leaderDuration) {
                    // Linear growth from 0 to 1
                    this.growthProgress = this.phaseDuration / this.leaderDuration;
                    this.strikeIntensity = 0; // Leader is dim
                } else {
                    // Leader complete - trigger return stroke!
                    this.phase = 'return';
                    this.phaseDuration = 0;
                    this.growthProgress = 1.0;
                    console.log('⚡⚡⚡ RETURN STROKE! ⚡⚡⚡');
                }
                break;
                
            case 'return':
                // Return stroke - SUDDEN BRIGHT FLASH
                if (this.phaseDuration < this.returnDuration) {
                    this.growthProgress = 1.0;
                    this.strikeIntensity = 1.0; // Maximum brightness
                } else {
                    // Return stroke complete - start fading
                    this.phase = 'fading';
                    this.phaseDuration = 0;
                }
                break;
                
            case 'fading':
                // Afterglow dissipates
                if (this.phaseDuration < this.fadeDuration) {
                    const fadeProgress = this.phaseDuration / this.fadeDuration;
                    this.growthProgress = 1.0;
                    this.strikeIntensity = 1.0 - fadeProgress; // Fade out
                } else {
                    // Complete - return to idle
                    this.phase = 'idle';
                    this.phaseDuration = 0;
                    this.growthProgress = 0;
                    this.strikeIntensity = 0;
                    
                    // Schedule next strike - much shorter idle time for continuous activity
                    const baseInterval = 2.0 / this.strikeFrequency; // Reduced from 4.0 to 2.0
                    const randomVariation = (Math.random() - 0.5) * baseInterval * 0.6;
                    this.nextStrikeTime = this.time + baseInterval + randomVariation;
                }
                break;
        }
        
        // Update all bolt materials with REALISTIC cascading growth
        this.boltMeshes.forEach(bolt => {
            bolt.material.uniforms.time.value = this.time;
            bolt.material.uniforms.strikeIntensity.value = this.strikeIntensity;
            
            if (bolt.isBranch) {
                // REALISTIC BRANCHING: Branches only START growing after main bolt passes their attachment point
                // They grow from their attachment point outward
                
                if (this.growthProgress < bolt.startProgress) {
                    // Main bolt hasn't reached this branch point yet - invisible
                    bolt.material.uniforms.growthProgress.value = 0;
                } else {
                    // Main bolt has passed - branch grows out from attachment point
                    // Give branches a slight delay and slower growth for cascade effect
                    const timeSinceAttachment = this.growthProgress - bolt.startProgress;
                    const branchDelay = 0.05; // Small delay before branch starts
                    const branchGrowthSpeed = 0.8; // Branches grow slightly slower than main bolt
                    
                    if (timeSinceAttachment < branchDelay) {
                        // Still in delay period
                        bolt.material.uniforms.growthProgress.value = 0;
                    } else {
                        // Branch is growing - accelerated growth from 0 to 1
                        const branchTime = (timeSinceAttachment - branchDelay) / branchGrowthSpeed;
                        const branchProgress = Math.min(1.0, branchTime / (1.0 - bolt.startProgress));
                        bolt.material.uniforms.growthProgress.value = branchProgress;
                    }
                }
            } else {
                // Main bolt grows normally from top to bottom
                bolt.material.uniforms.growthProgress.value = this.growthProgress;
            }
        });
        
        // Update glow
        if (this.glowMesh) {
            this.glowMesh.material.uniforms.time.value = this.time;
            
            let glowIntensity = 0;
            if (this.phase === 'leader') {
                glowIntensity = this.growthProgress * 0.3;
            } else if (this.phase === 'return') {
                glowIntensity = 1.5;
            } else if (this.phase === 'fading') {
                glowIntensity = this.strikeIntensity * 0.8;
            }
            
            this.glowMesh.material.uniforms.intensity.value = glowIntensity;
            this.glowMesh.scale.setScalar(0.5 + glowIntensity);
        }
        
        // Update dynamic lighting
        if (this.lightningLight) {
            let lightIntensity = 0;
            
            if (this.phase === 'leader') {
                // Dim glow during leader
                lightIntensity = this.growthProgress * 15 * this.intensity;
            } else if (this.phase === 'return') {
                // MASSIVE FLASH during return stroke
                lightIntensity = 300 * this.intensity;
            } else if (this.phase === 'fading') {
                // Quick fade
                lightIntensity = this.strikeIntensity * 150 * this.intensity;
            }
            
            this.lightningLight.intensity = lightIntensity;
            
            // Jitter during bright phases
            if (this.strikeIntensity > 0.5) {
                const jitter = 0.4;
                this.lightningLight.position.set(
                    this.basePosition.x + (Math.random() - 0.5) * jitter,
                    this.basePosition.y + (Math.random() - 0.5) * jitter,
                    this.basePosition.z + (Math.random() - 0.5) * jitter
                );
            } else {
                this.lightningLight.position.copy(this.basePosition);
            }
        }
    }

    unmount(scene) {
        if (this.lightningGroup) {
            scene.remove(this.lightningGroup);
            
            this.boltMeshes.forEach(bolt => {
                bolt.mesh.geometry.dispose();
                bolt.material.dispose();
            });
            
            if (this.glowMesh) {
                this.glowMesh.geometry.dispose();
                this.glowMesh.material.dispose();
            }
        }
        
        if (this.lightningLight) {
            scene.remove(this.lightningLight);
        }
        
        this._mounted = false;
        console.log('⚡ RedLightning unmounted');
    }
}
