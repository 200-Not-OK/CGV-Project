# GPU Quality System - Integration Guide

## Overview

This system automatically detects your GPU capabilities and adjusts lighting/particle effects for optimal performance. No more frame drops on integrated GPUs!

## How It Works

1. **GPU Detection** - Detects your GPU type (integrated vs dedicated)
2. **Quality Tiers** - Automatically assigns LOW/MEDIUM/HIGH quality
3. **Dynamic Adjustment** - All light components adjust their complexity based on quality
4. **Performance Benchmarking** - Optional runtime performance testing

## Quick Start

### 1. Import the GPU Detector

```javascript
import { initGPUDetector, QualityPresets } from './utils/gpuDetector.js';
```

### 2. Initialize After Creating Renderer

```javascript
// In your Game constructor or init method
const { scene, renderer, shaderSystem } = createSceneAndRenderer();
this.scene = scene;
this.renderer = renderer;

// Initialize GPU detector
const gpuDetector = initGPUDetector(this.renderer);
const qualitySettings = gpuDetector.getQualitySettings();

console.log(`🎮 GPU Tier: ${gpuDetector.tier}`);
console.log(`⚙️ Quality Settings:`, qualitySettings);
```

### 3. Pass Quality to Light Manager

```javascript
// Create light manager with quality settings
this.lights = new LightManager(this.scene, qualitySettings);
```

### 4. Use Lights Normally

```javascript
// Lights will automatically use the quality settings!
await this.lights.add('plant1', LightModules.CastleBioluminescentPlant, {
    position: [10, 0, 20]
});

await this.lights.add('flame1', LightModules.FlameParticles, {
    position: [0, 2, 0],
    height: 2.0
});
```

## Quality Presets

### LOW (Integrated GPUs)
- **Plant Lights**: 4 roots, 8 petals, 12 leaves, 30 moss, 10 fireflies
- **Particles**: Disabled or minimal
- **Shadows**: 512px
- **Antialiasing**: Off
- **Max Lights**: 4
- **Best for**: Intel HD/UHD Graphics, mobile devices

### MEDIUM (Mid-range GPUs)
- **Plant Lights**: 6 roots, 12 petals, 18 leaves, 80 moss, 20 fireflies
- **Particles**: Enabled
- **Shadows**: 1024px
- **Antialiasing**: On
- **Max Lights**: 8
- **Best for**: GTX 1050-1650, RX 560-5600

### HIGH (High-end GPUs)
- **Plant Lights**: 8 roots, 16 petals, 24 leaves, 150 moss, 35 fireflies
- **Particles**: Full complexity
- **Shadows**: 2048px
- **Antialiasing**: On
- **Max Lights**: 16
- **Best for**: RTX series, GTX 1660+, RX 5700+

## Advanced Usage

### Manual Quality Override

```javascript
// Force a specific quality tier
import { QualityPresets } from './utils/gpuDetector.js';

this.lights = new LightManager(this.scene, QualityPresets.LOW);
```

### Runtime Quality Change

```javascript
// Change quality at runtime (requires rebuilding lights)
this.lights.setQualitySettings(QualityPresets.MEDIUM);

// Then recreate your lights
this.lights.clear();
await this.initializeLights();
```

### Performance Benchmarking

```javascript
// Run a benchmark to verify performance
const gpuDetector = initGPUDetector(this.renderer);
const benchmarkResults = await gpuDetector.benchmark(
    this.scene, 
    this.activeCamera, 
    this.renderer
);

console.log(`Benchmark Results:`, benchmarkResults);
// Tier will auto-adjust if performance is poor
```

### Per-Component Quality Override

```javascript
// Override quality for a specific light
await this.lights.add('special-plant', LightModules.CastleBioluminescentPlant, {
    position: [0, 0, 0],
    quality: {
        plantInstanceCounts: {
            roots: 4,
            petals: 8,
            leaves: 12,
            moss: 50,
            fireflies: 15
        },
        plantFireflySize: 30.0,
        enableComplexShaders: true
    }
});
```

## Performance Tips

### 1. Use Quality-Aware Renderer Settings

```javascript
const gpuDetector = initGPUDetector(renderer);
const quality = gpuDetector.getQualitySettings();

// Apply quality to renderer
renderer.setPixelRatio(quality.pixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Adjust shadow map size
if (quality.shadowMapSize) {
    // Apply to your lights' shadow.mapSize
}
```

### 2. Conditional Post-Processing

```javascript
if (quality.enablePostProcessing) {
    // Enable bloom, SSAO, etc.
} else {
    // Skip post-processing for better performance
}
```

### 3. Monitor Performance

```javascript
// Check FPS and adjust if needed
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
    stats.begin();
    // ... render
    stats.end();
    
    // Auto-downgrade if FPS drops
    if (stats.fps < 25 && currentQuality !== 'LOW') {
        console.warn('Low FPS detected, downgrading quality');
        downgradQuality();
    }
}
```

## Integration Example (Complete)

```javascript
// src/game/game.js
import { initGPUDetector, QualityPresets } from './utils/gpuDetector.js';

export class Game {
  constructor() {
    // Setup scene and renderer
    const { scene, renderer, shaderSystem } = createSceneAndRenderer();
    this.scene = scene;
    this.renderer = renderer;
    this.shaderSystem = shaderSystem;

    // Initialize GPU detector
    this.gpuDetector = initGPUDetector(this.renderer);
    this.qualitySettings = this.gpuDetector.getQualitySettings();
    
    console.log(`🎮 GPU: ${this.gpuDetector.tier}`);
    console.log(`📊 Quality Settings:`, this.qualitySettings);

    // Apply quality to renderer
    this.renderer.setPixelRatio(this.qualitySettings.pixelRatio);

    // ... other initialization ...

    // Create light manager with quality settings
    this.lights = new LightManager(this.scene, this.qualitySettings);
  }

  async initializeLights() {
    // Add lights - they'll automatically use quality settings
    await this.lights.add('plant1', LightModules.CastleBioluminescentPlant, {
        position: [10, 0, 20]
    });

    await this.lights.add('flame1', LightModules.FlameParticles, {
        position: [0, 2, 0]
    });
  }
}
```

## Troubleshooting

### GPU Not Detected Correctly

The system defaults to MEDIUM if it can't determine your GPU. You can:
1. Check browser console for GPU info
2. Manually set quality with `QualityPresets.LOW/MEDIUM/HIGH`
3. Run the benchmark to test actual performance

### Still Low FPS

1. Try forcing LOW quality: `QualityPresets.LOW`
2. Reduce shadow map size further
3. Limit number of lights in scene
4. Disable particles completely
5. Lower pixel ratio

### Looks Too Simple on High-End GPU

1. Check detected tier in console
2. Force HIGH quality if needed
3. Increase instance counts manually
4. Enable post-processing effects

## Supported Light Components

Currently adapted for quality settings:
- ✅ `CastleBioluminescentPlantGPU` - Full quality support
- ✅ `FlameParticles` - Particle count adjustment
- ⚠️ `BasicLights` - No quality adjustment needed (simple lights)
- ⚠️ `PointPulse` - No quality adjustment needed (simple lights)
- ⚠️ `HemisphereFill` - No quality adjustment needed (ambient light)
- ⚠️ `StarLight` - No quality adjustment needed (point light)

## Future Enhancements

- [ ] Adaptive quality based on runtime FPS
- [ ] LOD system for light distances
- [ ] Quality presets UI for user override
- [ ] Mobile-specific optimizations
- [ ] WebGL 2.0 feature detection

## Credits

Built with Three.js for optimal cross-platform performance.

