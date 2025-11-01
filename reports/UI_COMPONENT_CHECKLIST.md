# UI Component Creation Checklist

Quick reference for creating new UI components that work correctly with the game's UI system.

## Pre-Development

- [ ] Decide if component is **global** (persists across levels) or **level-specific** (recreated per level)
- [ ] Choose correct positioning: `fixed` (on-screen) vs `absolute` (in-world) vs `relative` (text flow)
- [ ] Plan z-index value (1000+ for overlays that should appear above everything)

## Component File Creation

```javascript
// ✅ TEMPLATE: src/game/components/myComponent.js

import { UIComponent } from '../uiComponent.js';

export class MyComponent extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    
    // Set root element styling
    this.root.className = 'my-component';
    this.root.style.cssText = `
      position: fixed;                    // ✅ Use 'fixed' for on-screen UI
      top: 50%;                           // ✅ Center on screen if needed
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;               // ✅ Prevent blocking game input
      user-select: none;                  // ✅ Don't let text be selectable
      z-index: 1000;                      // ✅ Above most elements
      display: none;                      // ✅ Hide by default
    `;
    
    console.log('🎯 MyComponent created');  // ✅ Debug logging
    this._createElements();
  }
  
  _createElements() {
    // Create DOM elements here
    this.root.appendChild(/* your elements */);
    console.log('✅ MyComponent DOM elements created');
  }
  
  mount() {
    console.log('📌 MyComponent.mount() called');  // ✅ Override for logging
    super.mount();
    console.log('📌 MyComponent mounted, root in DOM:', !!this.root.parentNode);
  }
  
  show() {
    console.log('🎯 MyComponent.show() called');
    this.root.style.display = 'block';
  }
  
  hide() {
    console.log('❌ MyComponent.hide() called');
    this.root.style.display = 'none';
  }
  
  update(props = {}) {
    this.setProps(props);
  }
}
```

## Registration in game.js

### For Global Components (persist across levels)

Add in constructor after UIManager creation:

```javascript
// In game.js constructor after this.ui = new UIManager(...)

this.ui.add('myComponent', MyComponent, {
  // props here
});
```

Then add to globalComponents in `applyLevelUI()`:

```javascript
applyLevelUI(levelData) {
  const globalComponents = new Map();
  
  // ... existing global components ...
  
  // ✅ ADD YOUR COMPONENT
  if (this.ui.get('myComponent')) {
    globalComponents.set('myComponent', this.ui.get('myComponent'));
  }
  
  this.ui.clear();
  
  // ... rest of method ...
}
```

### For Level-Specific Components

Add in `applyLevelUI()` method:

```javascript
const uiList = (levelData && levelData.ui) ? levelData.ui : ['hud'];

for (const uiItem of uiList) {
  // ... existing logic ...
  
  if (key === 'myComponent') {
    this.ui.add('myComponent', MyComponent, levelConfig);
  }
}
```

Then add to level data in `levelData.js`:

```javascript
{
  "id": "level1",
  // ... other config ...
  "ui": [
    "hud",
    { "type": "myComponent", "config": { "option": "value" } }
  ]
}
```

## Testing Checklist

### Startup Tests
- [ ] Component appears in browser console logs
- [ ] `🎯 MyComponent created` logged
- [ ] `✅ MyComponent DOM elements created` logged
- [ ] `📌 MyComponent mounted, root in DOM: true` logged
- [ ] No JavaScript errors in console

### Visibility Tests
- [ ] Component element exists in DOM inspector (`<div class="my-component">`)
- [ ] Component has correct styling applied
- [ ] Component is visible when `display: block`
- [ ] Component hidden when `display: none`
- [ ] Z-index allows component to appear above/below as intended

### Interaction Tests
- [ ] Show method works (`myComponent.show()` in console)
- [ ] Hide method works (`myComponent.hide()` in console)
- [ ] Show/hide logs appear in console

### Persistence Tests (Global Components Only)
- [ ] Component survives loading a new level
- [ ] Component works in second, third, etc. levels
- [ ] No duplicate components created after level transitions
- [ ] `🗑️ Disposed all triggers` doesn't remove global component from UI

### Console Commands to Test

```javascript
// Get the component
const comp = window.__GAME__?.ui?.get('myComponent');

// Check if it exists
console.log('Component exists:', !!comp);

// Show it
comp?.show();

// Hide it
comp?.hide();

// Check if it's in DOM
console.log('In DOM:', !!comp?.root?.parentNode);

// Check styling
console.log('Display:', comp?.root?.style?.display);
console.log('Z-index:', comp?.root?.style?.zIndex);

// List all UI components
window.__GAME__?.ui?.listComponents();
```

## Common Mistakes to Avoid

❌ **Wrong:**
```javascript
this.root.style.cssText = `position: absolute;`;  // Doesn't stay centered
this.root.style.pointerEvents = 'auto';           // May block game input
// Forgot to add to globalComponents map in applyLevelUI()
```

✅ **Right:**
```javascript
this.root.style.cssText = `position: fixed; pointer-events: none;`;
// Added to globalComponents in applyLevelUI():
if (this.ui.get('myComponent')) {
  globalComponents.set('myComponent', this.ui.get('myComponent'));
}
```

## Debugging Steps

If component doesn't appear:

1. **Check startup logs:**
   - Do you see `🎯 MyComponent created`?
   - Do you see `✅ MyComponent DOM elements created`?
   - Do you see `📌 MyComponent mounted, root in DOM: true`?

2. **If logs appear but component invisible:**
   - Check `display` property: `console.log(comp.root.style.display)`
   - Check z-index: too low? Try `z-index: 9999`
   - Check if `pointer-events: none` is blocking visibility
   - Check `visibility: hidden` or `opacity: 0`

3. **If component appears then disappears after level load:**
   - **YOU FORGOT TO ADD TO GLOBAL COMPONENTS!**
   - Check `applyLevelUI()` method in game.js
   - Add your component to the `globalComponents` map

4. **If component shows multiple times:**
   - Check if component is being registered twice
   - Check `UIManager.add()` duplicate logic
   - Look for multiple calls to register same component

## Performance Considerations

- ✅ Create DOM elements in `_createElements()` not every frame
- ✅ Cache element references (this.poiText, this.root, etc.)
- ✅ Use `display: none` for hiding, not removing from DOM
- ✅ Add event listeners in constructor, not update()
- ✅ Throttle expensive operations if updating frequently

## Resources

- **Full Report:** `UI_COMPONENT_DEBUGGING_REPORT.md`
- **UIComponent Base Class:** `src/game/uiComponent.js`
- **UIManager:** `src/game/uiManager.js`
- **Example (Global):** `src/game/components/triggerPrompt.js`
- **Example (Level-specific):** `src/game/components/collectibles.js`

---

**Last Updated:** November 2, 2025  
**Based On:** TriggerPrompt debugging session  
**Apply To:** All new UI component development
