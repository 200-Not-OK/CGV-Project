# Graphics Settings - Quick Reference Card

## 🎯 What Can Be Toggled

### ✅ ALWAYS CAN TOGGLE (No Reload Needed)
- Resolution scale
- Anti-aliasing
- Shadow map size
- Shadow quality type (PCF vs Soft)
- Shadow bias/normal bias
- Shader system (on/off)
- Toon effect intensity
- Hatching effect
- Grain/noise
- Fog density
- Bloom intensity
- Light intensity
- Light distance
- Particle count
- Particle effects (flames, lightning)
- Tone mapping exposure
- Real-time shader uniform updates

### ⚠️ REQUIRES RELOAD (Level Restart Needed)
- Skybox (changing sky texture)
- Specific light components being added/removed
- Quality tier switching (reloads with new settings)
- Enhanced shaders OFF→ON (material swap)

### 🚫 CANNOT TOGGLE (Requires Restart)
- Renderer initialization settings
- WebGL context settings (antialias at init, stencil buffer)
- Shader compilation (compile-time only)

---

## 🎨 Entry Points for Toggling

### RENDERING
```javascript
renderer.setPixelRatio(0.5)              // Resolution
renderer.shadowMap.enabled = false       // Shadows
renderer.outputColorSpace = value        // Color space
renderer.toneMapping = value             // Tone mapping
renderer.toneMappingExposure = 0.8       // Exposure
```

### SHADERS
```javascript
shaderSystem.toggleShaders()             // All shaders on/off
shaderSystem.applyToonSettings({         // Toon effects
    posterizeLevels: 5,
    hatchStrength: 0.22,
    saturationBoost: 0.22,
    ...
})
```

### SHADOWS
```javascript
renderer.shadowMap.type = THREE.PCFSoftShadowMap
light.castShadow = true/false
light.shadow.mapSize.set(1024, 1024)
light.shadow.bias = -0.0001
light.shadow.camera.far = 100
```

### LIGHTING
```javascript
lightManager.add('key', ComponentClass, props)
lightManager.remove('key')
lightManager.setQualitySettings(presets)
```

### SKYBOX
```javascript
await loadPanoramaSky(scene, renderer, 'texture.hdr', {})
disposeSky(scene, renderer)
```

### FOG
```javascript
shaderSystem.applyFog(0x000510, 30, 150)
scene.fog = new THREE.Fog(color, near, far)
```

### PARTICLES/EFFECTS
```javascript
lightManager.remove('flameParticles')
lightManager.remove('redLightning')
lightManager.remove('binaryShader')
```

### QUALITY TIERS
```javascript
qualityControls.setTier('LOW')           // Force tier
qualityControls.setTier('MEDIUM')
qualityControls.setTier('HIGH')
qualityControls.runBenchmark()           // Auto-detect
```

---

## 📊 FPS Impact Quick Lookup

### Most Impact (Turn OFF to gain 5%+ FPS)
```
Resolution Scale (per -0.25x)  →  ~6-8% per step
Shadows (completely)            →  ~5-10% gain
Enhanced Shaders                →  ~3-5% gain
Post-Processing (bloom, etc)    →  ~3-5% gain
```

### Medium Impact (1-3% FPS each)
```
Shadow Map Size (per -512x)     →  ~2-3% gain
Particle Effects (all)          →  ~2-5% depending
Dynamic Lights                  →  ~1-2% per light
Fog Effect                      →  ~1-2% gain
Toon Shaders                    →  ~1-2% gain
```

### Low Impact (<1% FPS each)
```
Anti-aliasing                   →  ~0.5-1% gain
Shadow type (PCF vs Soft)       →  <1% difference
Stencil buffer                  →  <1% gain
Pixel precision                 →  <1% gain
Light count (1→2)              →  ~0.5% gain
```

---

## 🎮 Console Commands

```javascript
// Quality Control
qualityControls.setTier('LOW')           // Switch tier
qualityControls.cycleTier()              // Cycle LOW→MED→HIGH
qualityControls.runBenchmark()           // Run 60-frame test
qualityControls.getComparisonData()      // Show all presets

// In-Game Shortcuts
Shift+H                                   // Toggle quality UI
Shift+Q                                   // Cycle tiers
Shift+1/2/3                              // Force LOW/MED/HIGH
Shift+B                                   // Run benchmark

// Direct Access
window.__GAME__.shaderSystem.toggleShaders()
window.__GAME__.renderer.setPixelRatio(0.75)
```

---

## 📋 Settings Hierarchy

```
GRAPHICS SETTINGS
├─ RENDERING
│  ├─ Resolution Scale
│  ├─ Anti-Aliasing
│  └─ Pixel Precision
│
├─ SHADOWS
│  ├─ Enabled
│  ├─ Quality (LOW/MED/HIGH)
│  ├─ Map Size (512/1024/2048)
│  └─ Distance
│
├─ SHADERS & MATERIALS
│  ├─ Enhanced Shaders
│  ├─ Toon Effect
│  ├─ Hatching
│  ├─ Grain
│  └─ Saturation Boost
│
├─ ENVIRONMENT
│  ├─ Skybox
│  ├─ Fog
│  ├─ Fog Density
│  └─ Ambient Brightness
│
├─ LIGHTING
│  ├─ Dynamic Lights
│  ├─ Max Light Count
│  ├─ Light Intensity
│  └─ Light Distance
│
├─ EFFECTS
│  ├─ Particles
│  ├─ Particle Count
│  ├─ Bloom
│  ├─ Flames
│  └─ Lightning
│
└─ ADVANCED
   ├─ Frame Rate Target
   ├─ Auto-Downgrade
   └─ Draw Distance
```

---

## 💾 Quality Preset Matrix

| Setting | LOW | MED | HIGH |
|---------|-----|-----|------|
| Resolution | 50% | 75% | 100% |
| Shadows | OFF | 1024 | 2048 |
| Enhanced Shaders | OFF | ON | ON |
| Light Count | 1 | 2 | 3 |
| Particle Count | 0-50% | 50-100% | 100%+ |
| Post-Processing | OFF | OFF | ON |
| Fireflies | 5 | 12 | 35 |
| Tech Effects | OFF | ON | ON |
| Lightning | OFF | OFF | ON |
| FPS Target | 30-60 | 45-60 | 60+ |

---

## 🚨 DANGER ZONES (Can Crash/Break)

### ❌ DON'T DISABLE ENTIRELY
- Depth buffer (required for rendering)
- Depth test (breaks rendering)
- Color space output (colors will be wrong)

### ⚠️ USE WITH CAUTION
- Setting resolution to 0 or negative
- Setting shadow far to less than near
- Setting light distance to 0
- Removing all lights (scene goes black)

### ✅ SAFE TO EXPERIMENT WITH
- All sliders and toggles
- Shader parameters
- Quality tier switching
- Shadow quality settings
- Particle counts

---

## 🔧 Configuration Examples

### Example 1: Ultra Performance (10-Year-Old Laptop)
```javascript
qualityControls.setTier('LOW')
// Automatically sets:
// - Resolution: 50%
// - Shadows: OFF
// - Shaders: OFF
// - Lights: Ambient only
// - Particles: Minimal
// Result: 30-60 FPS
```

### Example 2: Balanced Gaming (Modern Laptop)
```javascript
qualityControls.setTier('MEDIUM')
// Automatically sets:
// - Resolution: 75%
// - Shadows: 1024px
// - Shaders: ON (light)
// - Lights: 2 dynamic
// - Particles: Reduced
// Result: 45-60 FPS
```

### Example 3: Maximum Visuals (Gaming PC)
```javascript
qualityControls.setTier('HIGH')
// Automatically sets:
// - Resolution: 100%
// - Shadows: 2048px
// - Shaders: ON (full)
// - Lights: 3 dynamic + shadows
// - Particles: Full quality
// Result: 60+ FPS
```

### Example 4: Custom (Tweak Individual Settings)
```javascript
// Start with MEDIUM
qualityControls.setTier('MEDIUM')

// Then customize
renderer.setPixelRatio(0.9)              // Boost resolution a bit
shaderSystem.applyToonSettings({
    saturationBoost: 0.5,                // More vibrant
    hatchStrength: 0.1                   // Reduce hatching
})
lightManager.setQualitySettings({
    plantLightCount: 1                   // Fewer lights
})
```

---

## 📈 Performance Monitoring

```javascript
// Watch FPS in console
console.log(`FPS: ${performance.now()}`)

// Or use built-in FPS counter
performanceMonitor.averageFPS

// Manual benchmark
await qualityControls.runBenchmark()
// Returns: { fps: 54.3, avgFrameTime: 18.4ms, tier: 'MEDIUM' }
```

---

## ✅ Verification Checklist

When adding a graphics setting, verify:

- [ ] Can toggle without crashing
- [ ] Shows real-time effect on screen
- [ ] Shows FPS change (positive or negative)
- [ ] Works across all quality tiers
- [ ] Settings persist (if implemented)
- [ ] Doesn't break other graphics features
- [ ] Documented in this reference

---

## 📞 For Questions

Refer to:
1. `GRAPHICS_SETTINGS_DETAILED.md` - Complete documentation
2. `GRAPHICS_SETTINGS_UI_PROPOSAL.md` - UI specifications
3. `GRAPHICS_SETTINGS_ROADMAP.md` - Implementation guide
4. This file - Quick reference

