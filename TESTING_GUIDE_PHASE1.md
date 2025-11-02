# 🧪 Graphics Settings - Phase 1 Testing Guide

**Purpose:** Validate that all graphics settings work correctly without errors  
**Scope:** 50+ individual settings, UI functionality, persistence, performance  
**Expected Duration:** 15-20 minutes for full test suite  

---

## Pre-Test Checklist

- [ ] Game loads without errors in browser console
- [ ] GPU detection completes successfully
- [ ] Press Shift+G: graphics settings panel appears on right side
- [ ] Panel has cyan/neon styling and is fully visible
- [ ] localStorage is enabled (check: DevTools → Application → localStorage)

---

## Test Suite 1: UI Functionality

### T1.1 - Panel Visibility
```
Step 1: Press Shift+G
Expected: Settings panel appears on right side with "⚙️ Graphics Settings" header
Expected: Panel shows 7 tabs: Rendering, Shadows, Shaders, Environment, Lighting, Effects, Advanced

Step 2: Click [✕] button (top-right of panel)
Expected: Panel disappears smoothly

Step 3: Press Shift+G again
Expected: Panel reappears
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

### T1.2 - Tab Navigation
```
Step 1: In settings panel, verify all 7 tabs visible
Step 2: Click "Shadows" tab
Expected: Tab becomes highlighted with cyan glow
Expected: Content switches to shadow settings (checkboxes, quality buttons, sliders)
Expected: Previous tab content hidden

Step 3: Click each remaining tab in order:
- Shaders
- Environment  
- Lighting
- Effects
- Advanced
Expected: Each tab content loads correctly, previous hides
Expected: Currently active tab is highlighted

Step 4: Return to "Rendering" tab
Expected: First tab properly highlights and content displays
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

### T1.3 - Keyboard Shortcut Reliability
```
Step 1: Press Shift+G three times rapidly
Expected: Panel toggles open→close→open (no glitches)
Expected: No console errors

Step 2: Press Shift+G while typing in chat/input
Expected: Only triggers if NOT focused on text input
Expected: If focused on input, input receives the keys instead

Step 3: Test with Caps Lock ON
Expected: Shift+G still works (Shift key press detected correctly)
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

## Test Suite 2: Individual Settings

### T2.1 - Resolution Scale Setting
```
Tab: Rendering → Resolution Scale

Step 1: Current value should be shown (e.g., "1.0x")
Step 2: Drag slider LEFT to 0.25
Expected: Visuals noticeably pixelated/low-res
Expected: Value display shows "0.25x"
Expected: FPS counter increases (faster rendering)

Step 3: Drag slider to CENTER (1.0)
Expected: Visuals back to normal quality
Expected: Value display shows "1.0x"
Expected: FPS returns to original

Step 4: Drag slider RIGHT to 2.0
Expected: Visuals are clearer/sharper
Expected: Value display shows "2.0x"
Expected: FPS may decrease (more pixels to render)

Step 5: Return slider to 1.0 and close panel
Step 6: Reload page (F5)
Expected: Settings persist - resolution still 1.0x
Expected: Visuals are at correct resolution (not pixelated)
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue
**FPS Change:** Original ~___ FPS → At 0.25x ~___ FPS (+/- ___%)

---

### T2.2 - Shadow Settings
```
Tab: Shadows

Step 1: Toggle "Shadows Enabled"
- ON: Scene should have shadows visible
- OFF: Scene appears brighter, no shadows
Expected: Visual difference clearly noticeable
Expected: Value updates immediately

Step 2: Try each Shadow Quality button:
- Click "Low"
- Click "Medium" 
- Click "High"
Expected: Shadows become progressively more detailed
Expected: Currently selected button highlighted in cyan
Expected: Quality change visible (not just FPS change)

Step 3: Try each Shadow Map Resolution:
- Click "512"
- Click "1024"
- Click "2048"
Expected: Buttons toggle correctly
Expected: Shadows sharper/softer based on resolution
Expected: Performance indicator shows change (lower FPS at 2048)

Step 4: Adjust "Shadow Type" dropdown
Options: Basic, PCF, PCF Soft
Expected: Dropdown opens and shows options
Expected: Selection updates immediately
Expected: Visual change in shadow appearance

Step 5: Adjust "Shadow Distance" slider (50-200m)
Expected: Slider works smoothly
Expected: Value display updates
Expected: Shadows cast further/shorter based on distance
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue
**Observations:** Describe visual differences observed for each quality level

---

### T2.3 - Shader Settings
```
Tab: Shaders

Step 1: Toggle "Enhanced Shaders"
- ON: Materials should look stylized/toon-like
- OFF: Materials revert to basic appearance
Expected: Obvious visual difference between ON and OFF
Expected: Setting applies immediately

Step 2: Adjust "Toon Effect Strength" (0.0 - 1.0)
Expected: Slider moves smoothly
Expected: At 0.0: materials look more realistic
Expected: At 1.0: materials look very stylized/cartoon
Expected: Visual change is gradual and noticeable

Step 3: Adjust "Posterization Levels" (2-16)
Expected: Slider snaps to integer values
Expected: At 2: very blocky colors
Expected: At 16: smoother color transitions
Expected: Effect visible on all materials

Step 4: Adjust each remaining shader value:
- Hatch Strength
- Grain
- Saturation
- Vibrance
Expected: Each slider works and updates value display
Expected: Visual changes visible on materials
Expected: No visual glitches or artifacts

Step 5: Interact with materials (walk around, look at objects)
Expected: Shader effects follow movement correctly
Expected: No lag or stuttering from shader updates
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue
**Observations:** Note visual quality at different settings

---

### T2.4 - Environment Settings
```
Tab: Environment

Step 1: Toggle "Skybox"
- ON: Skybox visible (space/nebulae background)
- OFF: Solid color background
Expected: Clear difference visible
Expected: Change applies immediately

Step 2: Try "Skybox Quality" buttons:
- Low: Lower resolution skybox
- Medium: Default resolution
- High: Higher resolution
Expected: All buttons functional
Expected: Visual difference at different distances

Step 3: Toggle "Fog"
- ON: Distance objects fade to fog color
- OFF: All objects visible regardless of distance
Expected: Obvious visual difference
Expected: Fog fades objects smoothly

Step 4: Adjust "Fog Density" (0.1 - 2.0)
Expected: Slider works smoothly
Expected: At 0.1: minimal fog effect
Expected: At 2.0: strong fog, limited visibility
Expected: Change is gradual and smooth

Step 5: Adjust "Ambient Brightness" (0.5 - 2.0)
Expected: Slider works smoothly
Expected: At 0.5: scene noticeably darker
Expected: At 2.0: scene noticeably brighter
Expected: Change affects overall scene brightness

Step 6: Walk around level while changing these settings
Expected: Settings update smoothly while moving
Expected: No stuttering or performance drops
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

### T2.5 - Lighting Settings
```
Tab: Lighting

Step 1: Toggle "Dynamic Lights"
- ON: Additional lights illuminate scene
- OFF: Only main lights visible
Expected: Noticeable difference in lighting

Step 2: Adjust "Max Light Count" (1-5)
Expected: Slider works smoothly
Expected: At 1: minimal dynamic lighting
Expected: At 5: more objects and areas lit
Expected: FPS decreases as count increases

Step 3: Adjust "Light Intensity" (0.5 - 2.0)
Expected: Slider works smoothly
Expected: At 0.5: lights dimmer
Expected: At 2.0: lights brighter
Expected: Change visible across scene

Step 4: Adjust "Light Distance" (0.5 - 3.0)
Expected: Slider works smoothly
Expected: At 0.5: lights reach shorter distances
Expected: At 3.0: lights reach farther
Expected: More/fewer objects illuminated

Step 5: Observe FPS while changing light settings
Expected: Light count has largest FPS impact
Expected: Intensity/distance have smaller impact
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

### T2.6 - Effects Settings
```
Tab: Effects

Step 1: Toggle "Particles"
- ON: Particle effects visible
- OFF: Particle effects disabled
Expected: Clear visual difference

Step 2: Try "Particle Quality" buttons (Low/Medium/High)
Expected: All buttons functional
Expected: Higher quality shows more particle detail

Step 3: Adjust "Particle Count" (0-200%)
Expected: Slider works smoothly
Expected: At 0%: no particles
Expected: At 200%: maximum particles
Expected: FPS changes with count

Step 4: Adjust "Bloom Effect" (0.0 - 2.0)
Expected: Slider works smoothly
Expected: At 0.0: no bloom/glow
Expected: At 2.0: strong glow on bright objects

Step 5: Adjust "Fireflies" (0-30)
Expected: Slider snaps to integer values
Expected: At 0: no fireflies
Expected: At 30: many fireflies visible
Expected: Visual change noticeable

Step 6: Toggle "Flames"
Expected: Shows "(Requires level reload)" message
Expected: Toggle works but may not show effect until reload

Step 7: Toggle "Lightning"
Expected: Shows "(Requires level reload)" message
Expected: Toggle works but may not show effect until reload

Step 8: Observe FPS with particles ON vs OFF
Expected: Noticeable FPS difference with high particle count
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

### T2.7 - Advanced Settings
```
Tab: Advanced

Step 1: Adjust "Target FPS" (30-120)
Expected: Slider works smoothly
Expected: Value display shows selected FPS target
Expected: Slider snaps to 10 FPS increments

Step 2: Toggle "Auto-Downgrade on Low FPS"
Expected: Toggle works
Expected: When ON: system may reduce quality if FPS drops
Expected: When OFF: quality stays fixed

Step 3: Toggle "Dynamic Resolution"
Expected: Toggle works
Expected: When ON: resolution may adjust based on performance
Expected: When OFF: resolution stays fixed

Step 4: Adjust "Texture Quality" dropdown
Options: Low/Medium/High
Expected: Dropdown opens and shows all options
Expected: Selection updates immediately
Expected: May require level reload to take full effect

Step 5: Adjust "Draw Distance" (100-1000m)
Expected: Slider works smoothly
Expected: At 100: objects disappear at closer range
Expected: At 1000: can see farther objects
Expected: May affect FPS

Step 6: Check FPS at different draw distances
Expected: Closer draw distance = higher FPS
Expected: Farther draw distance = lower FPS
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

## Test Suite 3: Quality Presets

### T3.1 - LOW Quality Preset
```
Step 1: Click "Low Quality" preset button

Expected Changes:
- Resolution: 0.5x (pixelated visuals)
- Shadows: Disabled or LOW quality
- Shaders: OFF (basic materials)
- Lights: 1 max
- Particles: OFF or minimal
- FPS: Should increase noticeably

Step 2: Observe all settings in each tab
Expected: All values match LOW preset configuration
Expected: Visuals noticeably lower quality but higher FPS

Step 3: Verify preset applied correctly
- Rendering tab: Resolution should be 0.5x
- Shadows tab: Should be disabled or LOW
- Shaders tab: Should be OFF
- Lighting tab: Max count should be 1
- Effects tab: Particles OFF

Step 4: Check FPS in performance monitor
Expected: Should be 30 FPS target or higher actual FPS
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue
**Measured FPS:** ___ FPS

---

### T3.2 - MEDIUM Quality Preset
```
Step 1: Click "Medium Quality" preset button

Expected Changes:
- Resolution: 0.75x
- Shadows: MEDIUM quality
- Shaders: ON
- Lights: 2 max
- Particles: ON medium quality
- FPS: Balanced

Step 2: Verify settings across all tabs
- Should be middle-ground between LOW and HIGH
- Visuals should be good quality
- Performance should be reasonable

Step 3: Check FPS
Expected: Should target 60 FPS
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue
**Measured FPS:** ___ FPS

---

### T3.3 - HIGH Quality Preset
```
Step 1: Click "High Quality" preset button

Expected Changes:
- Resolution: 1.0x (full resolution)
- Shadows: HIGH quality, 2048x2048
- Shaders: ON (full complexity)
- Lights: 3 max
- Particles: ON high quality
- FPS: May be lower (depends on GPU)

Step 2: Verify settings in each tab
- Should have maximum quality settings
- Visuals should be best quality

Step 3: Check FPS
Expected: May vary greatly depending on GPU
Expected: Should still maintain 60+ FPS on good hardware
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue
**Measured FPS:** ___ FPS

---

## Test Suite 4: Persistence & Storage

### T4.1 - Settings Persistence
```
Step 1: Change settings in UI
- Set resolution to 0.75x
- Disable shadows
- Set fog density to 0.5
- Note the specific values

Step 2: Close browser tab/window completely

Step 3: Reopen game in same browser

Expected: All settings should be exactly as you left them
Expected: Resolution 0.75x should persist
Expected: Shadows should be disabled
Expected: Fog density should be 0.5

Step 4: Check localStorage in DevTools
- F12 → Application → localStorage → (find your domain)
- Should see "graphics-settings" key
- Value should contain all your settings as JSON
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

### T4.2 - Reset to Defaults
```
Step 1: Make several random changes to settings
- Change resolution to 0.3x
- Disable fog
- Set all sliders to random values
- Apply preset LOW

Step 2: Click "Reset to Defaults" button

Expected: A confirmation dialog should appear asking "Reset all settings to defaults?"

Step 3: Click "Yes" / confirm dialog

Expected: ALL settings should snap back to defaults:
- Resolution: 1.0x
- Shadows: ON, MEDIUM
- Shaders: ON
- Fog: ON, density 1.0
- All other values to defaults

Step 4: Check localStorage
Expected: Should have updated with default values

Step 5: Reload page
Expected: Settings should still be defaults
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

### T4.3 - Settings Export/Import
```
Step 1: In browser console, run:
copy(window.__GAME__.graphicsSettings.exportSettings());

Expected: JSON copied to clipboard with all settings

Step 2: Change all settings dramatically
- LOW preset or max resolution, etc.

Step 3: In console, paste this:
window.__GAME__.graphicsSettings.importSettings(
  `{paste the JSON here}`
)

Expected: All settings should revert to exported state
Expected: No errors in console
Expected: UI updates to reflect imported settings

Step 4: Verify settings in UI
Expected: All sliders/toggles should match exported values
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

## Test Suite 5: Performance & FPS

### T5.1 - Performance Impact Measurement
```
Baseline Measurement:
Step 1: Close settings panel
Step 2: Note FPS in upper-left corner (or where FPS counter is)
Step 3: Record baseline FPS: ___

Test 1: Resolution Scale to 0.5
Step 1: Open settings → Rendering
Step 2: Set Resolution to 0.5x
Expected: FPS should INCREASE by at least 10-30%
Measured: ___ FPS (vs baseline ___ FPS)
Result: +___ % FPS change

Test 2: Shadows OFF
Step 1: Rendering with resolution 1.0x
Step 2: Open settings → Shadows
Step 3: Disable shadows
Expected: FPS should INCREASE by 10-20%
Measured: ___ FPS
Result: +___ % FPS change

Test 3: Lights to 1
Step 1: Open settings → Lighting
Step 2: Set Max Light Count to 1
Step 3: Disable Dynamic Lights
Expected: FPS should INCREASE by 5-10%
Measured: ___ FPS
Result: +___ % FPS change

Test 4: All Combined (Low Preset)
Step 1: Click "Low Quality" preset
Expected: Should be fastest (0.5x + no shadows + 1 light)
Expected: FPS increase of 30-50% from baseline HIGH settings
Measured: ___ FPS
Result: +___ % FPS change from HIGH to LOW
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

### T5.2 - Real-time Performance Display
```
Step 1: Open settings panel
Step 2: Check Performance Monitor section:
- FPS: (should show number)
- GPU: (should show GPU vendor name)
- Memory: (should show RAM usage)

Step 3: Change settings and watch FPS change:
- Lower resolution: FPS should increase
- Higher resolution: FPS should decrease
- Changes should reflect in real-time

Step 4: Move around in game
Expected: FPS counter should update smoothly
Expected: Should reflect actual performance changes

Step 5: GPU info should be consistent
Expected: Should show same GPU vendor every session
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

## Test Suite 6: Error Handling

### T6.1 - Console for Errors
```
Step 1: Open browser console (F12)
Step 2: Go to Console tab
Step 3: Repeat all previous tests while watching console

Expected: NO red errors should appear
Expected: Only normal logs and warnings acceptable
Expected: Any GraphicsSettings messages should be informational only

Specifically watch for:
- "Cannot read property X of undefined"
- "TypeError", "ReferenceError", etc.
- "Failed to apply setting"

Step 4: If any errors appear, note them in detail
```
**Result:** ✅ No Errors / ⚠️ Warnings / ❌ Errors Found

**Errors Found (if any):**
```
Error 1: _______________
Error 2: _______________
```

---

### T6.2 - Edge Cases
```
Test 1: Rapid Setting Changes
Step 1: Rapidly click slider back and forth 50 times
Expected: No crashes or visual glitches
Expected: Setting updates stably

Test 2: Extreme Values
Step 1: Set resolution to 0.25x (minimum)
Step 2: Set resolution to 2.0x (maximum)
Step 3: Set fog density to 0.1 (minimum)
Step 4: Set fog density to 2.0 (maximum)
Expected: All extremes render correctly
Expected: No visual artifacts

Test 3: Tab Switching with Drag in Progress
Step 1: Start dragging resolution slider
Step 2: While dragging, click another tab
Expected: Drag should stop cleanly
Expected: Tab should switch
Expected: No stuck states

Test 4: Multiple Preset Clicks
Step 1: Rapidly click LOW → MEDIUM → HIGH → LOW
Expected: Each preset applies completely
Expected: No mixed states
Expected: No console errors
```
**Result:** ✅ Pass / ❌ Fail / ⚠️ Issue

---

## Final Validation

### Checklist
- [ ] All 7 tabs functional
- [ ] All sliders/toggles/dropdowns work
- [ ] Settings apply immediately (visually)
- [ ] Settings persist after reload
- [ ] FPS counter updates correctly
- [ ] Quality presets apply correctly
- [ ] Reset button works as expected
- [ ] No console errors or red warnings
- [ ] UI is responsive and smooth
- [ ] Keyboard shortcut Shift+G works

### Summary
- **Total Tests:** 30+
- **Tests Passed:** ___
- **Tests Failed:** ___
- **Warnings/Issues:** ___

### Critical Issues Found
1. _______________
2. _______________
3. _______________

### Minor Issues / Suggestions
1. _______________
2. _______________

---

## Sign-Off

**Tested By:** _______________  
**Test Date:** _______________  
**GPU Model:** _______________  
**Browser:** _______________  
**FPS Range During Testing:** ___ - ___ FPS  

**Overall Result:** ✅ PASS / ⚠️ PASS WITH ISSUES / ❌ FAIL

**Notes:**
_____________________________________________________________________________

---

**If all tests pass:** Graphics Settings Phase 1 is production-ready! ✅  
**If issues found:** Document above and create bug tickets for Phase 1.1 patch  
**Next Steps:** Begin Phase 2 enhancements or proceed to other features
