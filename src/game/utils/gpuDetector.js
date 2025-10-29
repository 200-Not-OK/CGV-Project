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
        // STRATEGY: NO directional/point lights - objects glow themselves with ambient lighting
        plantInstanceCounts: {
            roots: 2,        // ABSOLUTE MINIMUM
            petals: 3,       // Barely visible flower
            leaves: 3,       // Only 3 leaves!
            moss: 0,         // NO MOSS - too expensive
            fireflies: 5     // A few more since they're just emissive (was 3)
        },
        plantFireflySize: 18.0,  // Slightly bigger for visibility (was 15)
        plantLightCount: 0,      // NO point lights - objects glow themselves
        plantLightIntensity: 0.0, // Not used (no lights)
        plantLightDistance: 0,   // Not used (no lights)
        plantLightDecay: 2.5,     // Not used (no lights)
        plantEmissiveBoost: 12.0, // STRONG emissive glow so objects are visible without point lights
        flameParticleCount: 0,   // 🔥 NO flame particles! Too expensive for LOW (was 3)
        flameGeometrySegments: { height: 12, radial: 8 }, // 🔥 ULTRA low poly flames!
        enableComplexShaders: false,  // Simple shaders only
        enableParticles: false,       // No particles at all
        shadowMapSize: 128,           // ULTRA tiny shadows
        updateThrottle: 5,            // Update every 5 frames instead of 3
        
        // General
        antialias: false,
        pixelRatio: 0.60,  // 60% resolution for maximum FPS
        maxLights: 3,      // Very limited total lights
        enablePostProcessing: false,
        enableGlow: false,
        disableShadows: true, // 🔥 Disable shadows on LOW quality!
    },
    
    MEDIUM: {
        // Lighting & Effects - OPTIMIZED for laptop integrated GPUs (Intel Iris, UHD 730, MX series)
        // STRATEGY: Minimal geometry + single lights + aggressive throttling
        plantInstanceCounts: {
            roots: 2,        // 🔥 Same as LOW for performance (was 3)
            petals: 4,       // 🔥 Reduced significantly (was 6)
            leaves: 6,       // 🔥 Further reduced (was 8)
            moss: 10,        // 🔥 Minimal moss (was 20)
            fireflies: 6     // 🔥 Reduced for FPS (was 10)
        },
        plantFireflySize: 20.0,  // Smaller for performance (was 22)
        plantLightCount: 1,      // ✅ Only 1 point light per plant
        plantLightIntensity: 10.0, // Bright single light for hallway illumination
        plantLightDistance: 90,   // Extended range to light hallways
        plantLightDecay: 1.8,     // Lower decay = light travels further
        plantEmissiveBoost: 4.5,  // 🔥 Higher emissive to compensate (was 4.0)
        flameParticleCount: 5,   // 🔥 Fewer particles (was 8)
        flameGeometrySegments: { height: 16, radial: 10 }, // 🔥 Even simpler geometry! (was 20×12)
        enableComplexShaders: false, // ✅ Keep shaders simple!
        enableParticles: true,       // Some particles okay
        shadowMapSize: 512,          // Better shadows for visual quality (was 256)
        updateThrottle: 5,           // 🔥 Update every 5 frames (was 4)
        
        // General
        antialias: false,  // ✅ Disabled for FPS
        pixelRatio: 0.85,  // Better resolution for clarity (was 0.75)
        maxLights: 3,      // 🔥 Very limited (was 4)
        enablePostProcessing: false,
        enableGlow: false, // 🔥 Disable glow effects (was true)
        disableShadows: false, // Keep minimal shadows enabled
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
        plantLightCount: 2,      // 2 point lights per plant (was 3, still looks great!)
        plantLightIntensity: 6.0, // Good intensity for HIGH
        plantLightDistance: 100,  // Maximum range
        plantLightDecay: 1.8,     // Lower decay for beautiful range
        plantEmissiveBoost: 2.0,  // Moderate emissive
        flameParticleCount: 50,  // Full flame particles
        flameGeometrySegments: { height: 64, radial: 36 }, // Full detail flames
        enableComplexShaders: true,
        enableParticles: true,
        shadowMapSize: 2048,
        updateThrottle: 3,       // Update every 3 frames
        
        // General
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5), // Cap at 1.5 for performance (was 2)
        maxLights: 12,     // Reduced from 16 for better performance
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

