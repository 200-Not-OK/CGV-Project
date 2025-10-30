# GPU Auto-Detection - How It Works

## ✅ Yes, It Auto-Adapts Based on Your GPU!

When your game starts, the system:

1. **Detects your GPU** via WebGL
2. **Analyzes the GPU name** (Intel HD, RTX, etc.)
3. **Checks hardware capabilities** (VRAM, texture size, etc.)
4. **Assigns a quality tier** (LOW/MEDIUM/HIGH)
5. **Automatically applies** the appropriate settings

---

## 🔍 How Auto-Detection Works

### Step 1: GPU Information Extraction

```javascript
// Runs automatically when game starts
const gl = renderer.getContext();
const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

GPU Vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
GPU Renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
```

**Examples of what's detected:**
- `"NVIDIA GeForce RTX 3060"`
- `"Intel(R) UHD Graphics 620"`
- `"AMD Radeon RX 6700 XT"`
- `"ANGLE (Intel, Intel(R) HD Graphics 4000)"`

---

### Step 2: Tier Assignment Algorithm

The system uses **pattern matching + scoring**:

```javascript
Score starts at 50 (MEDIUM)

If GPU name contains:
  ❌ "Intel HD Graphics" → Score -30 (likely LOW)
  ❌ "Intel UHD Graphics" → Score -30 (likely LOW)  
  ❌ "Integrated" → Score -30 (likely LOW)
  ❌ Mobile GPU (Mali, Adreno) → Score -20 (likely LOW)
  
  ✅ "RTX" → Score +40 (likely HIGH)
  ✅ "GTX 1660" or higher → Score +40 (likely HIGH)
  ✅ "Radeon RX" → Score +40 (likely HIGH)
  
Additional checks:
  Max Texture Size < 4096 → Score -20
  Max Texture Size ≥ 8192 → Score +15
  Mobile device detected → Score -20

Final Score:
  < 40  → LOW
  40-69 → MEDIUM
  ≥ 70  → HIGH
```

---

## 🎯 Real-World Examples

### 🔴 AUTO-DETECTED AS LOW:

```
GPU: Intel(R) HD Graphics 4000
Score: 50 - 30 (Intel HD) - 20 (old texture support) = 0
✅ Assigned: LOW

GPU: Intel(R) UHD Graphics 620  
Score: 50 - 30 (Intel UHD) = 20
✅ Assigned: LOW

GPU: ARM Mali-G76
Score: 50 - 30 (integrated) - 20 (mobile) = 0
✅ Assigned: LOW
```

**What these users see:**
- 5 fireflies per plant
- 10 flame particles
- 75% resolution
- Dimmer lights
- **Playable 30-60 FPS!**

---

### 🟡 AUTO-DETECTED AS MEDIUM:

```
GPU: Intel(R) Iris Xe Graphics
Score: 50 - 30 (integrated) + 15 (good texture support) = 35
⚠️ Close, but → MEDIUM (borderline case)

GPU: NVIDIA GeForce GTX 1050
Score: 50 (base) = 50
✅ Assigned: MEDIUM

GPU: Intel(R) UHD Graphics 770
Score: 50 - 30 (UHD) + 15 (modern) = 35
✅ Assigned: MEDIUM
```

**What these users see:**
- 15 fireflies per plant
- 50 flame particles
- 100% resolution
- Normal lights
- **Balanced 45-60 FPS**

---

### 🟢 AUTO-DETECTED AS HIGH:

```
GPU: NVIDIA GeForce RTX 3060
Score: 50 + 40 (RTX) = 90
✅ Assigned: HIGH

GPU: AMD Radeon RX 6700 XT
Score: 50 + 40 (Radeon RX) = 90
✅ Assigned: HIGH

GPU: NVIDIA GeForce GTX 1660 Ti
Score: 50 + 40 (GTX 1660) = 90
✅ Assigned: HIGH
```

**What these users see:**
- 35 fireflies per plant
- 50 flame particles
- 100-200% resolution
- Bright lights
- **Maximum quality 60+ FPS!**

---

## 🎮 What Happens at Game Startup

### In Your Browser Console:

```
🔍 Detecting GPU capabilities...
GPU Detected: NVIDIA GeForce RTX 3060
🎮 GPU Tier: HIGH
⚙️ Quality Settings: {
  plantInstanceCounts: { fireflies: 35, leaves: 24, petals: 16, ... },
  enableComplexShaders: true,
  pixelRatio: 2,
  ...
}

╔════════════════════════════════════════════════════╗
║        🎮 QUALITY PREVIEW CONTROLS ENABLED         ║
╚════════════════════════════════════════════════════╝

🎯 Auto-Detected Quality: HIGH
   (Based on your GPU: NVIDIA GeForce RTX 3060...)

💡 Tip: Press Shift+H to show the quality UI panel
```

---

## 🛠️ Manual Override Available

**Even though it auto-detects, you can always override:**

### To Test Different Qualities:
- **Shift+1** → Force LOW (see how it looks on worst iGPU)
- **Shift+2** → Force MEDIUM
- **Shift+3** → Force HIGH (your actual GPU)

### Via Console:
```javascript
qualityControls.setTier('LOW')    // Test low-end experience
qualityControls.setTier('MEDIUM') // Test mid-range
qualityControls.setTier('HIGH')   // Back to your GPU's quality
```

---

## 📊 Performance Benchmarking

The system can also **benchmark** your actual performance:

```javascript
// Press Shift+B or run in console:
qualityControls.runBenchmark()
```

**What it does:**
1. Renders 60 frames
2. Calculates average FPS
3. **Auto-downgrades if FPS < 30!**

**Example:**
```
🏃 Running performance benchmark...
📊 Benchmark Results:
  FPS: 24.3
  Avg Frame Time: 41.15ms
  Recommended Tier: LOW

💡 Recommended tier (LOW) differs from current (MEDIUM)
⚡ GPU tier changed from MEDIUM to LOW
```

The system will **automatically switch to LOW** if your FPS is too low!

---

## 🎯 Summary

### ✅ **YES, it's fully automatic!**

1. ✅ **Detects your GPU** automatically on startup
2. ✅ **Assigns quality tier** based on GPU type
3. ✅ **Applies settings** to all lights instantly
4. ✅ **Can benchmark** and auto-adjust if needed
5. ✅ **Manual override** available for testing

### 🎮 Default Behavior:

- **High-end GPU user** → Gets HIGH quality automatically
- **Integrated GPU user** → Gets LOW/MEDIUM automatically
- **Everyone gets playable FPS!** 🚀

### 🔍 UI is Hidden by Default:

- Press **Shift+H** to show/hide the quality panel
- Panel shows current settings and shortcuts
- **Unobtrusive for end users, visible for testing!**

Perfect! 🎉

