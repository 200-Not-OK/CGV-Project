# Graphics Settings UI - Proposed Hierarchy

## 📐 Proposed Settings Menu Structure

### **GRAPHICS SETTINGS**
```
┌─────────────────────────────────────────────┐
│  🎨 GRAPHICS SETTINGS                       │
├─────────────────────────────────────────────┤
│                                              │
│  ┌─ RENDERING ─────────────────────────┐   │
│  │ Resolution Scale:    ████░░ 75%    │   │
│  │ Anti-Aliasing:       [ON] [OFF]    │   │
│  │ Pixel Precision:     [HIGH] [MED]  │   │
│  │ Update Throttle:     [NONE] [×3]   │   │
│  └────────────────────────────────────┘   │
│                                              │
│  ┌─ SHADOWS ───────────────────────────┐   │
│  │ Shadow Casting:      [ON] [OFF]     │   │
│  │ Quality:             [LOW][MED][HI] │   │
│  │ Shadow Map Size:     1024 / 2048    │   │
│  │ Shadow Filtering:    [PCF][SOFT]    │   │
│  │ Max Distance:        ████░░ 100m   │   │
│  └────────────────────────────────────┘   │
│                                              │
│  ┌─ SHADERS & MATERIALS ────────────────┐  │
│  │ Enhanced Shaders:    [ON] [OFF]     │  │
│  │ Shader Quality:      [LOW][MED][HI] │  │
│  │ Tone Mapping:        [ACES][LINEAR] │  │
│  │ Toon Effect:         ███░░░ 60%    │  │
│  │ Material Reflectivity: ████░░ 40%  │  │
│  └────────────────────────────────────┘   │
│                                              │
│  ┌─ ENVIRONMENT ────────────────────────┐  │
│  │ Skybox:              [ON] [OFF]     │  │
│  │ Sky Quality:         [LOW][MED][HI] │  │
│  │ Fog:                 [ON] [OFF]     │  │
│  │ Fog Density:         ██░░░░ 20%    │  │
│  │ Ambient Brightness:  ████░░ 1.2x   │  │
│  └────────────────────────────────────┘   │
│                                              │
│  ┌─ LIGHTING ──────────────────────────┐   │
│  │ Dynamic Lights:      [ON] [OFF]     │   │
│  │ Max Light Count:     3 / 5 / 10     │   │
│  │ Light Intensity:     ███░░ 1.5x    │   │
│  │ Light Distance:      ███░░ 1.5x    │   │
│  │ Shadow Caster Lights: 1 / 2 / 5    │   │
│  └────────────────────────────────────┘   │
│                                              │
│  ┌─ EFFECTS ───────────────────────────┐   │
│  │ Particle Effects:    [ON] [OFF]     │   │
│  │ Effect Quality:      [LOW][MED][HI] │   │
│  │ Particle Count:      ███░░ 100%    │   │
│  │ Bloom/Glow:          ███░░ 1.0x    │   │
│  │ Ambient Occlusion:   [ON] [OFF]     │   │
│  └────────────────────────────────────┘   │
│                                              │
│  ┌─ ADVANCED ──────────────────────────┐   │
│  │ Depth of Field:      [ON] [OFF]     │   │
│  │ Motion Blur:         [ON] [OFF]     │   │
│  │ HDR:                 [ON] [OFF]     │   │
│  │ Color Grading:       [NEUTRAL]      │   │
│  │ Reset to Defaults    [RESET]        │   │
│  └────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 📊 QUICK PRESETS

```
Preset Selection:
┌─────────────────────────────────────────────┐
│ 🎮 QUICK PRESETS                           │
├─────────────────────────────────────────────┤
│                                              │
│ [⚡ LOW]         - Max Performance          │
│ Targets: Intel HD, Old iGPU                │
│ Est. FPS: 30-60 on weak hardware           │
│                                              │
│ [⚙️ MEDIUM]      - Balanced (Default)      │
│ Targets: Modern iGPU (Iris, UHD 730)       │
│ Est. FPS: 45-60 on integrated GPU          │
│                                              │
│ [🎨 HIGH]       - Maximum Quality          │
│ Targets: GTX 1660+, RTX, RX 5700+          │
│ Est. FPS: 60+ on dedicated GPU              │
│                                              │
│ [🎯 CUSTOM]     - User Configured          │
│ Your Custom Settings (Unsaved)              │
│                                              │
│ [🔄 AUTO-DETECT] - Based on Hardware       │
│ Re-run GPU detection & benchmark            │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 🔢 DETAILED COMPONENT LIST

### RENDERING (Resolution/Performance)
| Setting | Type | Range | Default | Impact |
|---------|------|-------|---------|--------|
| Resolution Scale | Slider | 0.25x - 2.0x | 1.0x | 30% FPS per 0.5x change |
| Pixel Ratio | Locked | Follows Res Scale | - | Core to performance |
| Anti-Aliasing | Toggle | OFF / ON | OFF | 2-3% FPS cost |
| Precision | Dropdown | mediump / highp | highp | <1% FPS difference |
| Stencil Buffer | Toggle | OFF / ON | OFF | <1% FPS, rarely needed |
| Update Throttle | Dropdown | None / 3fps / 10fps | None | Varies by component |

### SHADOWS (Depth & Quality)
| Setting | Type | Range | Default | Impact |
|---------|------|-------|---------|--------|
| Shadow Casting | Toggle | OFF / ON | ON | 5-10% FPS cost when ON |
| Quality Preset | Dropdown | OFF / LOW / MED / HI | MED | Combines below 3 settings |
| Shadow Map Size | Dropdown | 512 / 1024 / 2048 | 1024 | ~3-5% per 2x increase |
| Shadow Type | Dropdown | BasicShadow / PCF / PCFSoft | PCFSoft | <1% difference |
| Shadow Bias | Slider | -0.01 to 0.001 | -0.0001 | Eliminates artifacts |
| Shadow Distance | Slider | 10m - 500m | 100m | ~1% per 100m |
| Soft Shadows | Toggle | OFF / ON | ON | <1% FPS cost |

### SHADERS & MATERIALS
| Setting | Type | Range | Default | Impact |
|---------|------|-------|---------|--------|
| Enhanced Shaders | Toggle | OFF / ON | ON | 3-5% FPS cost |
| Shader Complexity | Dropdown | OFF / SIMPLE / FULL | FULL | 1-3% per step |
| Tone Mapping | Dropdown | None / Linear / ACES | ACES | <1% FPS difference |
| Toon Effect | Slider | 0% - 100% | 60% | Custom intensity |
| Posterization | Slider | 0 (off) - 8 | 5 | Cartoon style level |
| Hatching Effect | Slider | 0% - 100% | 22% | Line density in shadows |
| Grain/Noise | Slider | 0% - 100% | 3.5% | Texture overlay |
| Saturation Boost | Slider | -0.5 to 1.0 | 0.22 | Color vibrancy |
| Vibrance | Slider | 0 - 1.0 | 0.38 | Affects saturated colors |
| Shadow Lift | Slider | 0 - 0.5 | 0.08 | Brightens dark areas |
| Rim Lighting | Slider | 0 - 1.0 | 0.18 | Edge highlighting |

### ENVIRONMENT (Sky & Atmosphere)
| Setting | Type | Range | Default | Impact |
|---------|------|-------|---------|--------|
| Skybox Enabled | Toggle | OFF / ON | ON | 2-3% FPS cost |
| Sky Quality | Dropdown | LOW (1 layer) / MED (2) / HI (3) | MED | 0.5-1% per layer |
| Sky Geometry | Dropdown | Low-Poly / Med / High | Low-Poly | <1% difference |
| Fog Enabled | Toggle | OFF / ON | ON | 1-2% FPS cost |
| Fog Density | Slider | 0% - 100% | 100% | Blends sky with scene |
| Fog Color | Color Picker | Any color | 0x000510 (dark blue) | Visual only |
| Fog Start Distance | Slider | 10m - 100m | 30m | Fog near plane |
| Fog End Distance | Slider | 100m - 500m | 150m | Fog far plane |
| Ambient Brightness | Slider | 0x - 2.0x | 1.0x | Global light level |
| Environmental Lighting | Toggle | OFF / ON | ON (HIGH) | IBL for reflections |
| HDR Sky | Toggle | OFF / ON | ON | Uses tone mapping |

### LIGHTING (Lights & Illumination)
| Setting | Type | Range | Default | Impact |
|---------|------|-------|---------|--------|
| Dynamic Lights | Toggle | OFF / ON | ON | 1-5% per light |
| Max Light Count | Slider | 1 - 10 | 3 | ~1-2% per light added |
| Light Intensity | Slider | 0.5x - 2.0x | 1.0x | Brightness multiplier |
| Light Distance | Slider | 0.5x - 2.0x | 1.0x | How far light reaches |
| Point Light Decay | Dropdown | Linear / Quadratic / None | Quadratic | ~1% cost difference |
| Shadow-Casting Lights | Slider | 1 - 5 | 2 | ~2-3% per light |
| Directional Light | Toggle | OFF / ON | ON (not LOW) | 1% FPS cost |
| Ambient Multiplier | Slider | 0.1x - 3.0x | 1.0x | Ambient light strength |
| Fill Light Intensity | Slider | 0% - 100% | 40% | Secondary light strength |

### EFFECTS (Particles & Visuals)
| Setting | Type | Range | Default | Impact |
|---------|------|-------|---------|--------|
| Particle Effects | Toggle | OFF / ON | ON | 2-5% depending on type |
| Effect Quality | Dropdown | LOW / MEDIUM / HIGH | MEDIUM | Varies per effect |
| Particle Count | Slider | 0% - 200% | 100% | Linear scaling |
| Firefly Count | Slider | 0 - 50 | 12 | 0.3% per 10 |
| Firefly Size | Slider | 10px - 50px | 25px | Negligible |
| Bloom/Glow | Slider | 0x - 2.0x | 1.0x | Post-process effect |
| Bloom Threshold | Slider | 0 - 2.0 | 0.8 | Brightness threshold |
| Flame Effects | Toggle | OFF / ON | ON (not LOW) | 1-2% FPS |
| Flame Intensity | Slider | 0x - 2.0x | 1.0x | Brightness |
| Lightning Effects | Toggle | OFF / ON | ON (only HIGH) | 0.5-1% FPS |
| Strike Frequency | Slider | 0.1x - 2.0x | 1.0x | How often strikes happen |
| Motion Trails | Slider | 0% - 100% | 50% | Blurred movement |
| Ambient Occlusion | Toggle | OFF / ON | OFF | 3-5% FPS cost |

### ADVANCED (Performance & Experimental)
| Setting | Type | Range | Default | Impact |
|---------|------|-------|---------|--------|
| Frame Rate Target | Dropdown | 30 / 60 / 120 / Unlimited | 60 | Vsync/limiting |
| Auto Quality Downgrade | Toggle | OFF / ON | ON | Auto-switches on low FPS |
| Low FPS Threshold | Slider | 15 - 45 fps | 30 fps | Trigger point |
| Dynamic Resolution | Toggle | OFF / ON | OFF | Scales res on low FPS |
| Min Resolution | Slider | 0.25x - 0.75x | 0.5x | Floor for dynamic res |
| Physics Quality | Dropdown | OFF / LOW / MED / HI | MEDIUM | Physics simulation detail |
| Asset LOD Bias | Slider | -2 - 2 | 0 | Model detail level |
| Texture Resolution | Dropdown | LOW (512px) / MED / HI | MED | Texture quality |
| Draw Distance | Slider | 50m - 1000m | 500m | Culling distance |

---

## 🎨 VISUAL EXAMPLES

### LOW Quality Tier
```
Resolution: 50% (half pixel count)
Shadows: OFF or 512px
Materials: Basic (no shaders)
Lights: 1 ambient only
Sky: 1 layer, low-poly
Particles: Minimal or OFF
FPS Target: 30-60

Result: Works on 10-year-old laptops
```

### MEDIUM Quality Tier
```
Resolution: 75%
Shadows: ON, 1024px, PCF soft
Materials: Enhanced with tone mapping
Lights: 1-2 dynamic + 1 ambient
Sky: 2 layers, medium-poly
Particles: Reduced count
Shaders: Toon + hatching (light)
FPS Target: 45-60

Result: Balanced for modern laptops
```

### HIGH Quality Tier
```
Resolution: 100%
Shadows: ON, 2048px, PCF soft + normal bias
Materials: Full PBR with all maps
Lights: 2-3 dynamic + 1 ambient + shadows
Sky: 3 layers, high-poly
Particles: Full count with all effects
Shaders: Full toon + hatching + grain
Effects: Bloom, HDR, ambient lighting
FPS Target: 60+

Result: Maximum visual fidelity
```

---

## 💾 PERSISTENCE

### Save Format (JSON)
```json
{
  "version": 1,
  "preset": "CUSTOM",
  "rendering": {
    "resolutionScale": 0.75,
    "antiAlias": false,
    "pixelPrecision": "highp",
    "updateThrottle": 0
  },
  "shadows": {
    "enabled": true,
    "quality": "MEDIUM",
    "mapSize": 1024,
    "type": "PCFSoft",
    "bias": -0.0001,
    "distance": 100
  },
  "shaders": {
    "enhanced": true,
    "complexity": "FULL",
    "toonEffect": 0.6,
    "posterization": 5,
    "hatchStrength": 0.22,
    "grain": 0.035,
    "saturation": 0.22,
    "rimIntensity": 0.18
  },
  "environment": {
    "skybox": true,
    "skyQuality": "MEDIUM",
    "fog": true,
    "fogDensity": 1.0,
    "ambientBrightness": 1.0,
    "environmentalLighting": true
  },
  "lighting": {
    "dynamicLights": true,
    "maxCount": 3,
    "intensity": 1.0,
    "distance": 1.0
  },
  "effects": {
    "particles": true,
    "quality": "MEDIUM",
    "count": 100,
    "bloom": 1.0,
    "fireflies": 12,
    "flames": true,
    "lightning": false
  },
  "advanced": {
    "frameRateTarget": 60,
    "autoDowngrade": true,
    "dynamicResolution": false,
    "textureResolution": "MEDIUM",
    "drawDistance": 500
  }
}
```

### Storage
- **Browser localStorage** (automatic, ~100KB)
- **Cloud save** (if backend exists)
- **Local file** (if web app supports it)

---

## 🔌 Integration Points (Code)

### To Implement, You'll Need:

1. **Settings Store** (`src/game/utils/GraphicsSettings.js`)
   - Load/save preferences
   - Apply settings to renderer, shaders, lights

2. **UI Component** (`src/game/components/ui/GraphicsSettingsMenu.js`)
   - Render settings panel
   - Handle slider/toggle interactions
   - Show real-time FPS impact

3. **Settings Manager** (`src/game/graphicsSettingsManager.js`)
   - Centralized control
   - Delegate to appropriate systems
   - Track changed values

4. **Event System**
   - Listen for changes
   - Apply changes in real-time
   - Trigger level reload if needed

---

## ✅ IMPLEMENTATION PRIORITY

### Phase 1 (Essential)
1. Resolution scale slider
2. Shadow toggle + quality presets
3. Enhanced shaders toggle
4. Light count slider
5. Particle effects toggle
6. Preset buttons (LOW/MED/HIGH)

### Phase 2 (Quality of Life)
1. All sliders for intensity controls
2. Tone mapping options
3. Fog density controls
4. Bloom/glow controls
5. Settings persistence (localStorage)

### Phase 3 (Advanced)
1. Advanced shader tweaking
2. Per-component toggles
3. Auto-downgrade system
4. Dynamic resolution
5. Performance monitoring overlay

---

## 🎯 SUCCESS METRICS

Once implemented, users should be able to:

✅ Run game at 60 FPS on their hardware (within their tier)
✅ Toggle any feature on/off individually
✅ See real-time FPS impact of each setting
✅ Save/load their preferred settings
✅ Auto-detect and apply optimal settings
✅ Manually override auto-detection if desired
✅ Understand what each setting does (tooltips)
✅ Get performance recommendations based on FPS

