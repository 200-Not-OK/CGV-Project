# Trigger System Testing & Debugging Guide

## Testing Checklist

### Setup
- [ ] Run `npm run dev`
- [ ] Game starts with hub level
- [ ] No console errors on startup
- [ ] TriggerPrompt UI component visible in DOM

### Basic Functionality
- [ ] Navigate to first trigger position
- [ ] POI text appears on screen (golden text)
- [ ] "E to interact" button is visible
- [ ] Text is centered on screen
- [ ] Text has glow/shadow effects

### Interaction
- [ ] Press E key while near trigger
- [ ] Level begins loading
- [ ] Loading transition happens smoothly
- [ ] New level starts correctly
- [ ] No console errors during transition

### UI Behavior
- [ ] Prompt appears smoothly (animation)
- [ ] Prompt disappears when leaving trigger radius
- [ ] Moving between triggers updates prompt text
- [ ] Prompt is always centered on screen
- [ ] Prompt doesn't block game interaction

### Multiple Triggers
- [ ] Hub has multiple trigger zones
- [ ] Only closest trigger is "active"
- [ ] Walking between triggers updates UI
- [ ] Each trigger loads correct level
- [ ] No overlap issues

## Debug Console Commands

### List All Triggers
```javascript
// In browser console while in hub level
if (window.__GAME__?.level?.triggerManager) {
  console.log(window.__GAME__.level.triggerManager.triggers);
}
```

### Get Active Trigger
```javascript
const active = window.__GAME__?.level?.triggerManager?.getActiveTrigger();
console.log('Active trigger:', active);
```

### Visualize Trigger Zones
```javascript
// Shows green/yellow wireframe spheres for all triggers
window.__GAME__?.level?.triggerManager?.debugVisualizeTriggers();
```

### Manually Fire Trigger
```javascript
const trigger = window.__GAME__?.level?.triggerManager?.getActiveTrigger();
if (trigger) {
  window.__GAME__.level.triggerManager._handleTriggerInteraction(trigger);
}
```

### Check Trigger Manager State
```javascript
const tm = window.__GAME__?.level?.triggerManager;
console.log({
  triggersCount: tm?.triggers.length,
  activeTrigger: tm?.getActiveTrigger()?.id,
  triggerBodies: tm?.triggerBodies.length,
  hasUIComponent: !!window.__GAME__?.ui?.get('triggerPrompt')
});
```

### Monitor Trigger Updates
```javascript
// Add logging to see what's happening each frame
const origUpdate = window.__GAME__.level.triggerManager.update.bind(
  window.__GAME__.level.triggerManager
);
window.__GAME__.level.triggerManager.update = function(playerPos, input) {
  console.log('🎯 Trigger Update:', {
    playerPos: playerPos.toArray(),
    active: this.getActiveTrigger()?.id || 'none',
    eKeyPressed: input?.keys['KeyE'] || false
  });
  return origUpdate(playerPos, input);
};
```

## Common Issues & Solutions

### Issue: Prompt Not Appearing

**Symptoms**: Walking near trigger, no UI prompt visible

**Debug Steps**:
```javascript
// 1. Check if triggerManager exists
console.log(!!window.__GAME__?.level?.triggerManager);
// Should be: true

// 2. Check if triggers loaded
console.log(window.__GAME__?.level?.triggerManager?.triggers);
// Should show array with triggers

// 3. Check if TriggerPrompt component registered
console.log(!!window.__GAME__?.ui?.get('triggerPrompt'));
// Should be: true

// 4. Get player distance to trigger
const trigger = window.__GAME__?.level?.triggerManager?.triggers?.[0];
const playerPos = window.__GAME__?.player?.mesh?.position;
console.log('Distance:', playerPos.distanceTo(trigger.position));
console.log('Radius:', trigger.radius);
// Distance should be <= radius to be in range
```

**Solutions**:
- Verify trigger position is reachable in level
- Check trigger radius isn't too small (8+ units recommended)
- Ensure levelData has `triggers` array
- Check browser console for parser errors

---

### Issue: E Key Doesn't Load Level

**Symptoms**: Prompt shows, E key doesn't work

**Debug Steps**:
```javascript
// 1. Check active trigger
const active = window.__GAME__?.level?.triggerManager?.getActiveTrigger();
console.log('Active trigger:', active?.id);

// 2. Check if input is tracking E key
console.log('E key pressed:', window.__GAME__?.input?.keys['KeyE']);

// 3. Verify level exists
const targetLevel = active?.targetLevel;
console.log('Target level exists:', 
  !!window.__GAME__?.levelManager?.levels?.find(l => l.id === targetLevel)
);

// 4. Try manually firing
window.__GAME__?.level?.triggerManager?._handleTriggerInteraction(active);
```

**Solutions**:
- Verify `targetLevel` matches exact level ID in levelData
- Ensure input manager is enabled: `window.__GAME__.input.enabled = true`
- Check for JavaScript errors in console
- Try pressing E multiple times (debounce)

---

### Issue: Level Loads Wrong Level

**Symptoms**: Pressed E on trigger_level1, but level2 loaded

**Debug Steps**:
```javascript
// Check trigger configuration
const triggers = window.__GAME__?.level?.triggerManager?.triggers;
triggers.forEach(t => {
  console.log(`${t.id}: targetLevel = ${t.targetLevel}`);
});

// Check which trigger is active
const active = window.__GAME__?.level?.triggerManager?.getActiveTrigger();
console.log('Active when E pressed:', active?.id, 'targets:', active?.targetLevel);
```

**Solutions**:
- Verify correct trigger is "active" (closest)
- Check trigger positions aren't overlapping
- Increase radius to prevent boundary issues

---

### Issue: Prompt Flickers

**Symptoms**: UI prompt appears/disappears rapidly

**Debug Steps**:
```javascript
// Add detailed logging
let lastActive = null;
const origUpdate = window.__GAME__.level.triggerManager.update.bind(
  window.__GAME__.level.triggerManager
);
window.__GAME__.level.triggerManager.update = function(playerPos, input) {
  const result = origUpdate(playerPos, input);
  if (this.activeTrigger?.id !== lastActive) {
    console.log(`Trigger changed: ${lastActive} -> ${this.activeTrigger?.id}`);
    lastActive = this.activeTrigger?.id;
  }
  return result;
};

// Check player distance variations
setInterval(() => {
  const player = window.__GAME__?.player?.mesh?.position;
  const active = window.__GAME__?.level?.triggerManager?.activeTrigger;
  if (active) {
    console.log('Distance to active trigger:', 
      player.distanceTo(active.position).toFixed(2)
    );
  }
}, 100);
```

**Solutions**:
- Increase trigger radius by 2-3 units
- Move triggers away from level boundaries
- Check for floating point precision issues
- Verify player collision isn't jittering

---

### Issue: Trigger Zone Not Where Expected

**Symptoms**: Prompt appears at wrong location

**Debug Steps**:
```javascript
// Show player and trigger positions
console.log('Player:', window.__GAME__?.player?.mesh?.position.toArray());
console.log('Triggers:');
window.__GAME__?.level?.triggerManager?.triggers?.forEach(t => {
  console.log(`  ${t.id}: [${t.position.x}, ${t.position.y}, ${t.position.z}]`);
});

// Visualize both
window.__GAME__?.level?.triggerManager?.debugVisualizeTriggers();

// Draw player position indicator
const geometry = new THREE.SphereGeometry(1, 8, 8);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.copy(window.__GAME__.player.mesh.position);
window.__GAME__.scene.add(sphere);
```

**Solutions**:
- Use in-game coordinates display (press `)
- Adjust levelData trigger positions
- Verify coordinate system (use level editor for reference)
- Test with visualize command

---

## Performance Profiling

### Frame Time Analysis
```javascript
// Add timing to trigger updates
const perfNow = performance.now;
let updateTime = 0;

const origUpdate = window.__GAME__.level.triggerManager.update.bind(
  window.__GAME__.level.triggerManager
);
window.__GAME__.level.triggerManager.update = function(playerPos, input) {
  const start = perfNow();
  const result = origUpdate(playerPos, input);
  updateTime = perfNow() - start;
  console.log(`Trigger update: ${updateTime.toFixed(2)}ms`);
  return result;
};

// Run for a few frames and check console
```

### Expected Performance
- 1-2 triggers: < 0.05ms
- 3-5 triggers: < 0.1ms  
- 10 triggers: < 0.2ms
- Should have minimal frame impact

## Visual Debugging

### Enable Debug Visualization
```javascript
// Permanently enable wireframe visualization
window.__GAME__.level.triggerManager.debugVisualizeTriggers();

// This adds colored wireframe spheres:
// - Green: levelLoader triggers
// - Yellow: custom triggers
```

### Debug Overlay
```javascript
// Create a simple debug display
const debugDiv = document.createElement('div');
debugDiv.style.cssText = `
  position: fixed;
  top: 100px;
  right: 20px;
  background: rgba(0,0,0,0.8);
  color: #0f0;
  font-family: monospace;
  padding: 10px;
  font-size: 12px;
  max-width: 300px;
  max-height: 200px;
  overflow: auto;
  z-index: 10000;
`;
document.body.appendChild(debugDiv);

// Update it each frame
setInterval(() => {
  const tm = window.__GAME__?.level?.triggerManager;
  const player = window.__GAME__?.player?.mesh?.position;
  debugDiv.innerHTML = `
    <strong>🎯 Trigger Debug</strong><br>
    Loaded: ${tm?.triggers?.length || 0}<br>
    Active: ${tm?.getActiveTrigger()?.id || 'none'}<br>
    Player: [${player?.x.toFixed(1)}, ${player?.y.toFixed(1)}, ${player?.z.toFixed(1)}]<br>
    ${tm?.getActiveTrigger() ? `
      Distance: ${player?.distanceTo(tm.activeTrigger.position).toFixed(1)}<br>
      Radius: ${tm.activeTrigger.radius}
    ` : ''}
  `;
}, 100);
```

## Unit Testing

### Test Trigger Creation
```javascript
import { TriggerManager } from './TriggerManager.js';

// Mock objects
const mockScene = { add: () => {}, remove: () => {} };
const mockPhysicsWorld = { addBody: () => {}, removeBody: () => {} };
const mockGame = { 
  levelManager: { 
    levels: [{ id: 'test_level' }] 
  },
  input: { keys: {} },
  uiManager: { updateTriggerPrompt: () => {} }
};

// Create manager
const tm = new TriggerManager(mockScene, mockPhysicsWorld, mockGame);

// Test loading
tm.loadTriggers([{
  id: 'test',
  type: 'levelLoader',
  position: [0, 0, 0],
  radius: 5,
  poiText: 'Test',
  targetLevel: 'test_level'
}]);

console.assert(tm.triggers.length === 1, 'Should have 1 trigger');
console.assert(tm.triggers[0].id === 'test', 'Trigger ID should match');
```

## Checklist for Production

- [ ] All triggers in levelData are valid
- [ ] All targetLevel values exist in levelData
- [ ] Trigger positions are reachable in level
- [ ] Trigger radius is 5-10 units (player comfort zone)
- [ ] POI text is descriptive and includes emoji
- [ ] UI prompt displays correctly
- [ ] E key interaction works smoothly
- [ ] Level transitions are smooth
- [ ] No console errors
- [ ] Performance is good (< 0.2ms per frame)
- [ ] Debug commands work
- [ ] Documentation is clear
