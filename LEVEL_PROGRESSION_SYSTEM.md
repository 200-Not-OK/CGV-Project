# Level Progression System

## Overview

A complete level progression and locking system has been implemented with local storage persistence. This allows you to:

- ✅ Lock all levels except Level 1
- ✅ Automatically unlock the next level when the previous one is completed
- ✅ Display lock status visually on hub level triggers
- ✅ Persist completion progress to browser localStorage

## How It Works

### 1. **ProgressionManager** (`src/game/ProgressionManager.js`)

The core system that manages level progression:

**Key Methods:**
- `isLevelUnlocked(levelId)` - Check if a level is unlocked
- `isLevelCompleted(levelId)` - Check if a level is completed
- `completeLevel(levelId)` - Mark a level as completed and unlock the next one
- `getStatus()` - Get current progression state
- `resetProgress()` - Clear all progress

**Progression Logic:**
- Hub and Level 1 start unlocked
- When Level 1 is completed → Level 2 unlocked
- When Level 2 is completed → Level 3 unlocked
- All progress stored in localStorage key: `csplatformer_progress`

**Data Structure:**
```javascript
{
  "completedLevels": ["level1", "level2"],
  "timestamp": "2025-11-02T10:30:00.000Z"
}
```

### 2. **Integration Points**

#### Game.js (`src/game/game.js`)
- **Import:** `import { ProgressionManager } from './ProgressionManager.js';`
- **Initialization:** `this.progressionManager = new ProgressionManager();`
- **Level Completion:** When `_onLevelComplete()` is called:
  ```javascript
  if (currentLevelId && this.progressionManager) {
    this.progressionManager.completeLevel(currentLevelId);
  }
  ```

#### TriggerManager.js (`src/game/TriggerManager.js`)
- **Lock Check:** Before loading a level, check if it's unlocked:
  ```javascript
  if (!this.game.progressionManager.isLevelUnlocked(trigger.targetLevel)) {
    console.warn(`🔒 Level is locked`);
    this.game.showMessage(`🔒 Level locked! Complete the previous level...`);
    return;
  }
  ```
- **Visual Indicator:** Trigger labels display lock status:
  - **Unlocked levels:** Orange text with glow
  - **Locked levels:** Gray text with lock emoji (🔒)

## Usage Examples

### Check Progression Status
```javascript
const status = game.progressionManager.getStatus();
console.log(status);
// { completedLevels: ["level1"], unlockedLevels: ["hub", "level1", "level2"] }
```

### Check If Level Is Unlocked
```javascript
if (game.progressionManager.isLevelUnlocked('level2')) {
  console.log('Level 2 is accessible');
}
```

### Complete a Level
```javascript
game.progressionManager.completeLevel('level1');
// Level 2 is now automatically unlocked
```

### Reset Progress (Dev/Testing)
```javascript
game.progressionManager.resetProgress();
// Clears localStorage and resets to initial state
```

## Browser Storage

Progress is automatically saved to localStorage. To manually inspect:

### In Browser Console
```javascript
// View saved progress
JSON.parse(localStorage.getItem('csplatformer_progress'))

// Clear progress
localStorage.removeItem('csplatformer_progress')

// Force reload
location.reload()
```

## Player Experience

### Hub Level
1. Player spawns at hub with access to Level 1 and locked Level 2
2. Trigger labels show:
   - `Level 1` (orange) - unlocked
   - `Level 2 🔒` (gray) - locked
3. Attempting to enter Level 2 shows: "🔒 Level locked! Complete the previous level to unlock it."

### Completing Level 1
1. Player reaches the exit and completes Level 1
2. Level completion event triggers: `window.dispatchEvent(new Event('level:complete'))`
3. `_onLevelComplete()` marks Level 1 as completed
4. Progress is saved to localStorage
5. Level 2 is automatically unlocked

### Returning to Hub
1. Progress persists across browser sessions
2. Trigger labels update:
   - `Level 1` (orange) - completed & unlocked
   - `Level 2` (orange) - now unlocked
   - `Level 3 🔒` (gray) - still locked

## Technical Details

### Initialization Order
1. Game constructor creates `this.progressionManager`
2. ProgressionManager loads saved progress from localStorage
3. TriggerManager checks progression on level load trigger
4. Game marks levels complete on `level:complete` event

### localStorage Format
```
Key: csplatformer_progress
Value: {
  "completedLevels": ["level1", "level2"],
  "timestamp": "2025-11-02T10:30:00.000Z"
}
```

### Progression Chain
```
Initial State:
├─ Hub ✓ (unlocked)
├─ Level 1 ✓ (unlocked)
└─ Level 2 🔒 (locked)

After Level 1 Complete:
├─ Hub ✓ (unlocked)
├─ Level 1 ✓ (unlocked)
└─ Level 2 ✓ (unlocked)

After Level 2 Complete:
├─ Hub ✓ (unlocked)
├─ Level 1 ✓ (unlocked)
├─ Level 2 ✓ (unlocked)
└─ Level 3 ✓ (unlocked)
```

## Files Modified

1. **src/game/ProgressionManager.js** (NEW)
   - Core progression manager with localStorage persistence

2. **src/game/game.js** (MODIFIED)
   - Added ProgressionManager import
   - Added progression initialization
   - Updated `_onLevelComplete()` to mark levels complete

3. **src/game/TriggerManager.js** (MODIFIED)
   - Added lock check before level loading
   - Updated trigger labels to show lock status (gray + 🔒 emoji)
   - Added user feedback for locked levels

## Testing

### Manual Testing Checklist
- [ ] Load game → Level 1 and Hub unlocked, Level 2 locked ✓
- [ ] Try to enter Level 2 → Shows lock message ✓
- [ ] Complete Level 1 → Level 2 becomes unlocked ✓
- [ ] Refresh page → Progress persists ✓
- [ ] Return to hub → Level 2 shows orange text (unlocked) ✓
- [ ] Complete Level 2 → Level 3 unlocks ✓

### Console Debug Commands
```javascript
// View progression
window.__GAME__.progressionManager.getStatus()

// Complete a level programmatically
window.__GAME__.progressionManager.completeLevel('level1')

// Reset progress
window.__GAME__.progressionManager.resetProgress()

// Check if level unlocked
window.__GAME__.progressionManager.isLevelUnlocked('level2')
```

## Future Enhancements

Possible additions:
- Progress bar showing levels completed
- Achievements/badges system
- Difficulty selection per level
- Speed-run tracking
- Collectible tracking per level
