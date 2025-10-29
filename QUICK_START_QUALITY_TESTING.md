# Quick Start - Quality Testing Controls

Test how your game looks on low-end devices from your high-end PC!

## Installation (3 steps)

### Step 1: Add Imports to `game.js`

At the top of `src/game/game.js`, add:

```javascript
import { initGPUDetector } from './utils/gpuDetector.js';
import { initQualityControls } from './utils/qualityControls.js';
```

### Step 2: Initialize in Game Constructor

In your `Game` constructor, after creating the renderer, add:

```javascript
export class Game {
  constructor() {
    const { scene, renderer, shaderSystem } = createSceneAndRenderer();
    this.scene = scene;
    this.renderer = renderer;
    this.shaderSystem = shaderSystem;

    // ✨ ADD THIS: Initialize GPU detector
    this.gpuDetector = initGPUDetector(this.renderer);
    this.qualitySettings = this.gpuDetector.getQualitySettings();
    
    // ... rest of existing code ...
    
    // MODIFY THIS: Pass quality to LightManager
    // OLD: this.lights = new LightManager(this.scene);
    // NEW:
    this.lights = new LightManager(this.scene, this.qualitySettings);
    
    // ... more existing code ...
  }

  async init() {
    // ... existing init code ...
    
    // ✨ ADD THIS: Initialize quality controls (at end of init)
    this.qualityControls = initQualityControls(this);
  }
}
```

### Step 3: Start Testing!

That's it! Now you can:

## Keyboard Controls

| Key | Action |
|-----|--------|
| **Shift+Q** | Cycle through LOW → MEDIUM → HIGH quality |
| **Shift+1** | Force LOW quality (test iGPU performance) |
| **Shift+2** | Force MEDIUM quality |
| **Shift+3** | Force HIGH quality |
| **Shift+B** | Run performance benchmark |
| **Shift+H** | Toggle UI visibility |

## What You'll See

### Visual Quality Differences

**LOW Quality (Integrated GPU Simulation)**
- 🌿 Plants: 4 roots, 8 petals, 12 leaves, 10 fireflies
- 🔥 Particles: Reduced or disabled
- 📐 Lower geometry detail
- 🎨 Simpler shaders
- ⚡ Fastest performance

**MEDIUM Quality (Mid-range GPU)**
- 🌿 Plants: 6 roots, 12 petals, 18 leaves, 20 fireflies
- 🔥 Particles: Enabled
- 📐 Medium geometry detail
- 🎨 Complex shaders
- ⚡ Balanced performance

**HIGH Quality (Your Current GPU)**
- 🌿 Plants: 8 roots, 16 petals, 24 leaves, 35 fireflies
- 🔥 Particles: Full complexity
- 📐 High geometry detail
- 🎨 Complex shaders with all effects
- ⚡ Maximum visual quality

## Testing Workflow

1. **Start Game** - Loads with auto-detected quality
2. **Press Shift+1** - Switch to LOW to see iGPU performance
3. **Press Shift+2** - Switch to MEDIUM
4. **Press Shift+3** - Switch back to HIGH
5. **Press Shift+Q** - Quick cycle between all tiers

Each switch automatically reloads the current level with new quality settings!

## Console Commands

Open browser console (F12) for advanced control:

```javascript
// Get comparison table of all quality settings
qualityControls.getComparisonData()

// Switch to specific tier
qualityControls.setTier('LOW')
qualityControls.setTier('MEDIUM')
qualityControls.setTier('HIGH')

// Run benchmark
qualityControls.runBenchmark()

// Get current settings
qualityControls.currentTier
```

## UI Indicator

A quality indicator appears in the top-right showing:
- Current quality tier (with color coding)
- GPU info
- Active settings (fireflies, particles, etc.)
- Keyboard shortcuts

Press **Shift+H** to hide/show it.

## Performance Testing Tips

### Test Frame Rate Impact

1. Load a level with many lights
2. Press **Shift+3** (HIGH) - note FPS
3. Press **Shift+2** (MEDIUM) - note FPS improvement
4. Press **Shift+1** (LOW) - note maximum FPS

### Run Benchmark

Press **Shift+B** to run a 60-frame performance test. It will:
- Calculate average FPS
- Recommend optimal quality tier
- Auto-adjust if performance is poor

### Simulate User Experience

**iGPU User (Intel HD/UHD Graphics):**
```
Press Shift+1 → See exactly what they'll see
```

**Mid-range GPU User (GTX 1050-1650):**
```
Press Shift+2 → See their experience
```

**High-end GPU User (RTX, high-end AMD):**
```
Press Shift+3 → See maximum quality
```

## Troubleshooting

### Controls Not Working

Make sure you:
1. Added both imports to game.js
2. Initialized `gpuDetector` before creating `LightManager`
3. Called `initQualityControls(this)` in your `init()` method
4. Passed `this` to initQualityControls, not `game`

### Level Doesn't Reload

The system automatically reloads the current level when you change quality. If this doesn't work:
- Check that `this.level` and `this.levelManager` exist
- Make sure level is fully loaded before changing quality
- Check browser console for errors

### UI Not Visible

- Press **Shift+H** to toggle visibility
- Check if it's hidden behind other UI elements
- Look in browser console for errors

## Example Console Output

```
╔════════════════════════════════════════════════════╗
║        🎮 QUALITY PREVIEW CONTROLS ENABLED         ║
╚════════════════════════════════════════════════════╝

Keyboard Shortcuts:
  Shift+Q      - Cycle through LOW → MEDIUM → HIGH
  Shift+1      - Force LOW quality (iGPU preview)
  Shift+2      - Force MEDIUM quality
  Shift+3      - Force HIGH quality (dedicated GPU)
  Shift+B      - Run performance benchmark
  Shift+H      - Toggle UI visibility

Current Quality: HIGH
```

When you switch:
```
==================================================
🎮 SWITCHING TO LOW QUALITY
==================================================
⚙️ Quality Settings Updated: {...}
🔄 Reloading level 1 with new quality settings...
✅ Level reloaded with LOW quality
==================================================
```

## Next Steps

- Use Shift+1 to test LOW quality before deploying
- Run Shift+B benchmark on different machines
- Share with testers to verify quality tiers work correctly
- Adjust `QualityPresets` in `gpuDetector.js` if needed

Enjoy testing! 🎮✨

