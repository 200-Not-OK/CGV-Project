/**
 * GPU Detector - Detects GPU capabilities and recommends quality settings
 * Helps maintain good performance across different hardware
 */

export class GPUDetector {
    constructor(renderer) {
        this.renderer = renderer;
        this.tier = null;
        this.info = null;
        this.detect();
    }

    detect() {
        const gl = this.renderer.getContext();
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        
        this.info = {
            vendor: 'Unknown',
            renderer: 'Unknown',
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
            maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
            maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
            maxTextureUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
        };

        if (debugInfo) {
            this.info.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            this.info.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }

        // Determine INITIAL GPU tier (simplified - benchmark will finalize)
        this.tier = this._calculateTier();
        
        console.log(`🔍 GPU Detected:`, this.info);
        console.log(`🎯 Initial Quality Tier: ${this.tier} (will be verified by benchmark)`);
        
        return this.tier;
    }

    _calculateTier() {
        const renderer = this.info.renderer.toLowerCase();
        
        // SIMPLIFIED APPROACH: Only detect obviously LOW-end hardware
        // Default everything else to MEDIUM, let benchmark determine HIGH
        
        const isVeryLowEnd = 
            // Ancient Intel integrated GPUs (10+ years old)
            renderer.includes('intel hd graphics 2000') ||
            renderer.includes('intel hd graphics 3000') ||
            renderer.includes('intel hd graphics 4000') ||
            renderer.includes('intel hd graphics 2500') ||
            renderer.includes('gma') || // Intel GMA series (ancient)
            // Mobile GPUs (phones/tablets)
            renderer.includes('mali') ||
            renderer.includes('adreno') ||
            renderer.includes('powervr') ||
            // Very old texture support
            this.info.maxTextureSize < 2048 ||
            // Mobile devices (conservative)
            /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);

        if (isVeryLowEnd) {
            console.log('🔴 Detected very low-end hardware, starting at LOW quality');
            return 'LOW';
        }

        // Default to MEDIUM for everything else
        // The benchmark will promote to HIGH or demote to LOW based on actual performance
        console.log('🟡 Defaulting to MEDIUM quality (benchmark will adjust)');
        return 'MEDIUM';
    }

    getQualitySettings() {
        return QualityPresets[this.tier] || QualityPresets.MEDIUM;
    }

    // Benchmark test - run a quick performance test to determine REAL tier
    async benchmark(scene, camera, renderer) {
        console.log('🏃 Running performance benchmark...');
        
        const frames = 60;
        const startTime = performance.now();
        
        for (let i = 0; i < frames; i++) {
            renderer.render(scene, camera);
        }
        
        const endTime = performance.now();
        const avgFrameTime = (endTime - startTime) / frames;
        const fps = 1000 / avgFrameTime;
        
        console.log(`📊 Benchmark Results: ${fps.toFixed(1)} FPS (avg frame time: ${avgFrameTime.toFixed(2)}ms)`);
        
        // Determine final tier based on ACTUAL performance
        const oldTier = this.tier;
        
        if (fps < 30) {
            // Poor performance = LOW quality
            this.tier = 'LOW';
            console.log(`🔴 FPS < 30: Setting quality to LOW`);
        } else if (fps >= 55) {
            // Great performance = HIGH quality
            this.tier = 'HIGH';
            console.log(`🟢 FPS ≥ 55: Setting quality to HIGH`);
        } else {
            // Moderate performance = MEDIUM quality
            this.tier = 'MEDIUM';
            console.log(`🟡 FPS 30-55: Setting quality to MEDIUM`);
        }
        
        if (oldTier !== this.tier) {
            console.log(`⚡ Quality tier changed: ${oldTier} → ${this.tier}`);
        }
        
        return { fps, avgFrameTime, tier: this.tier };
    }
}

/**
 * Quality presets for different GPU tiers
 */
export const QualityPresets = {
    LOW: {
        // Lighting & Effects - ULTRA AGGRESSIVE for WORST hardware (Intel HD 2000/3000, 10+ year old laptops)
        plantInstanceCounts: {
            roots: 2,        // ABSOLUTE MINIMUM (was 3)
            petals: 3,       // Barely visible flower (was 4) 
            leaves: 3,       // Only 3 leaves! (was 6)
            moss: 0,         // NO MOSS - too expensive (was 15)
            fireflies: 3     // Only 3 fireflies! (was 5)
        },
        plantFireflySize: 15.0,  // Tiny particles (was 20)
        plantLightCount: 1,      // CRITICAL: Only 1 point light per plant
        plantLightIntensity: 10.0, // VERY BRIGHT for hallway illumination! (was 4.0)
        plantLightDistance: 90,   // Extended range to light hallways! (was 50)
        plantLightDecay: 1.8,     // Lower decay = light travels further (was 2.9)
        plantEmissiveBoost: 4.0,  // Make plant materials glow MUCH more (NO GPU cost!)
        flameParticleCount: 5,   // MINIMAL flame particles (was 10)
        enableComplexShaders: false,  // Simple shaders only
        enableParticles: false,       // No particles at all
        shadowMapSize: 128,           // ULTRA tiny shadows (was 256)
        updateThrottle: 5,            // Update every 5 frames instead of 3
        
        // General
        antialias: false,
        pixelRatio: 0.5,   // Render at HALF resolution! (was 0.75)
        maxLights: 2,      // Only 2 lights TOTAL in scene (was 3)
        enablePostProcessing: false,
        enableGlow: false,
    },
    
    MEDIUM: {
        // Lighting & Effects - For integrated GPUs like Intel Iris, UHD 730
        plantInstanceCounts: {
            roots: 5,        // Moderate (was 6)
            petals: 10,      // Decent flower (was 12)
            leaves: 14,      // Reasonable foliage (was 18)
            moss: 50,        // Reduced (was 80)
            fireflies: 15    // Noticeable but not overwhelming (was 20)
        },
        plantFireflySize: 28.0,  // Medium size (was 30)
        plantLightCount: 2,      // 2 point lights per plant (was 3)
        plantLightIntensity: 5.0, // Good intensity for MEDIUM (was implicit in code)
        plantLightDistance: 80,   // Extended range for hallways (was 70)
        plantLightDecay: 1.9,     // Lower decay for better reach (was 2.0)
        plantEmissiveBoost: 2.5,  // Make plant materials glow more (NO GPU cost!)
        flameParticleCount: 50,  // Full flame particles
        enableComplexShaders: true,
        enableParticles: true,
        shadowMapSize: 1024,
        
        // General
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 1),  // Native or lower
        maxLights: 6,      // Fewer lights (was 8)
        enablePostProcessing: false,
        enableGlow: true,
    },
    
    HIGH: {
        // Lighting & Effects - For dedicated GPUs (GTX 1660+, RTX series, RX 5700+)
        plantInstanceCounts: {
            roots: 8,
            petals: 16,
            leaves: 24,
            moss: 150,
            fireflies: 35
        },
        plantFireflySize: 35.0,
        plantLightCount: 3,      // Full 3 point lights per plant
        flameParticleCount: 50,  // Full flame particles
        enableComplexShaders: true,
        enableParticles: true,
        shadowMapSize: 2048,
        
        // General
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        maxLights: 16,
        enablePostProcessing: true,
        enableGlow: true,
    }
};

/**
 * Singleton instance for easy access
 */
let detectorInstance = null;

export function initGPUDetector(renderer) {
    if (!detectorInstance) {
        detectorInstance = new GPUDetector(renderer);
    }
    return detectorInstance;
}

export function getGPUDetector() {
    return detectorInstance;
}

