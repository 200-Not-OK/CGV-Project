# Quality Tier Comparison

## Visual Differences You'll See

### 🔴 LOW Quality (Worst iGPU - Intel HD 4000, UHD 620)
**Target Hardware:** Intel HD Graphics 4000/5000, UHD 610/620, old laptops

**Settings:**
- ✨ Fireflies: **5** (7x fewer than HIGH!)
- 🍃 Leaves: **6** (4x fewer)
- 🌸 Petals: **4** (4x fewer)
- 🪨 Moss: **15** (10x fewer)
- 🔥 Particles: **OFF**
- 🎨 Shaders: **Simple**
- 📊 Resolution: **75%** (renders at 3/4 resolution)

**What it looks like:**
- Plants look very minimal and sparse
- Only 5 glowing fireflies visible
- Flower has just 4 petals (very simple)
- Almost no moss
- No particle effects
- Much better FPS on weak hardware!

---

### 🟡 MEDIUM Quality (Modern iGPU - Intel Iris, UHD 730)
**Target Hardware:** Intel Iris Xe, UHD 730/770, MX series, older dedicated GPUs

**Settings:**
- ✨ Fireflies: **15** (3x more than LOW, half of HIGH)
- 🍃 Leaves: **14** (2x more than LOW)
- 🌸 Petals: **10** (2.5x more than LOW)
- 🪨 Moss: **50** (3x more than LOW)
- 🔥 Particles: **ON**
- 🎨 Shaders: **Complex**
- 📊 Resolution: **100%**

**What it looks like:**
- Plants look decent and balanced
- Noticeable glowing fireflies
- Flower looks complete
- Good amount of moss
- Particle effects enabled
- Good balance of visuals and performance

---

### 🟢 HIGH Quality (Dedicated GPU - GTX 1660+, RTX, RX 5700+)
**Target Hardware:** GTX 1660+, RTX series, RX 5700+, high-end laptops

**Settings:**
- ✨ Fireflies: **35** (7x more than LOW!)
- 🍃 Leaves: **24** (4x more than LOW)
- 🌸 Petals: **16** (4x more than LOW)
- 🪨 Moss: **150** (10x more than LOW)
- 🔥 Particles: **ON** (full complexity)
- 🎨 Shaders: **Complex**
- 📊 Resolution: **100-200%**

**What it looks like:**
- Plants look lush and full
- Many glowing fireflies creating atmosphere
- Flower has full petal count
- Dense moss coverage
- Full particle effects
- Maximum visual quality!

---

## Side-by-Side Comparison

| Feature | LOW 🔴 | MEDIUM 🟡 | HIGH 🟢 |
|---------|--------|-----------|---------|
| **Fireflies** | 5 | 15 | 35 |
| **Leaves** | 6 | 14 | 24 |
| **Petals** | 4 | 10 | 16 |
| **Moss Patches** | 15 | 50 | 150 |
| **Roots** | 3 | 5 | 8 |
| **Firefly Size** | 20 | 28 | 35 |
| **Particles** | OFF | ON | ON |
| **Shaders** | Simple | Complex | Complex |
| **Resolution** | 75% | 100% | 100-200% |
| **Max Lights** | 3 | 6 | 16 |
| **Shadow Quality** | 256px | 1024px | 2048px |

---

## Performance Impact

### LOW Quality
- **Target FPS:** 30-60 FPS on Intel HD 4000
- **Expected FPS Boost:** 3-5x compared to HIGH
- **VRAM Usage:** ~200-300MB
- **Best for:** Old laptops, weak iGPUs, office computers

### MEDIUM Quality  
- **Target FPS:** 45-60 FPS on Intel Iris Xe
- **Expected FPS Boost:** 2x compared to HIGH
- **VRAM Usage:** ~400-600MB
- **Best for:** Modern iGPUs, entry-level GPUs

### HIGH Quality
- **Target FPS:** 60+ FPS on GTX 1660+
- **VRAM Usage:** ~600-1000MB
- **Best for:** Gaming PCs, dedicated GPUs

---

## Testing Now

Press these keys to test:

1. **Shift+3** → HIGH quality (your GPU)
2. **Shift+1** → LOW quality (worst iGPU simulation)
3. **Look at the plants!** You should see a MASSIVE difference:
   - HIGH: 35 glowing fireflies, lush leaves, full flower
   - LOW: Only 5 fireflies, sparse leaves, minimal flower

4. **Check FPS** (Press F)
   - LOW should give you significantly higher FPS
   - If LOW still lags, the hardware is extremely weak

---

## When Each Tier is Auto-Detected

**LOW** is assigned when:
- Intel HD Graphics detected
- Intel UHD 610/620 detected
- Mobile GPU (Mali, Adreno, PowerVR)
- Low VRAM detected
- Benchmark shows <30 FPS

**MEDIUM** is assigned when:
- Intel Iris Xe / UHD 730+
- AMD Vega iGPU
- NVIDIA MX series
- Older dedicated GPUs (GTX 1050)
- Benchmark shows 30-55 FPS

**HIGH** is assigned when:
- GTX 1660 or better
- RTX series
- RX 5700+ or better
- Dedicated gaming GPU detected
- Benchmark shows 55+ FPS

---

## The BIG Difference

```
LOW  (iGPU):  ✨✨✨✨✨ (5 fireflies, sparse plant)
HIGH (dGPU):  ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨ (35 fireflies, lush plant)
```

**That's a 7x reduction in particle count!** 🚀

Plus reduced geometry, simpler shaders, and lower resolution = **playable on worst hardware!**

