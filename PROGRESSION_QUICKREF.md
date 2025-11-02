# Level Progression System - Quick Reference

## What Was Added

### ✅ Complete Feature List
- All levels locked except Level 1
- Level 1 completion → Level 2 unlocked
- Level 2 completion → Level 3 unlocked
- Progress saved to browser localStorage
- Visual lock indicators (🔒) on hub level
- User feedback when attempting locked levels

## Core Components

### 1. ProgressionManager.js
**Location:** `src/game/ProgressionManager.js`

**Key API:**
```javascript
// Check if level is accessible
isLevelUnlocked(levelId) → boolean

// Mark level as completed and unlock next
completeLevel(levelId) → boolean

// Get current progression
getStatus() → { completedLevels: [], unlockedLevels: [] }

// Clear all progress
resetProgress() → void
```

### 2. Integration in Game.js
**Location:** `src/game/game.js` (lines ~100-110)

```javascript
import { ProgressionManager } from './ProgressionManager.js';

// In constructor:
this.progressionManager = new ProgressionManager();

// In _onLevelComplete():
this.progressionManager.completeLevel(currentLevelId);
```

### 3. Trigger Lock Check in TriggerManager.js
**Location:** `src/game/TriggerManager.js` (lines ~260-285)

Prevents entering locked levels and shows visual feedback.

## Browser Storage

**Key:** `csplatformer_progress`  
**Persists:** Browser refreshes, tab closes, session ends

**Reset from Console:**
```javascript
localStorage.removeItem('csplatformer_progress')
location.reload()
```

## Debug from Browser Console

```javascript
// See all progression
window.__GAME__.progressionManager.getStatus()

// Mark level complete
window.__GAME__.progressionManager.completeLevel('level2')

// Check unlock status
window.__GAME__.progressionManager.isLevelUnlocked('level3')

// Reset
window.__GAME__.progressionManager.resetProgress()
```

## Progression Flow

```
START:
  Hub        → UNLOCKED
  Level 1    → UNLOCKED
  Level 2    → LOCKED 🔒
  Level 3    → LOCKED 🔒

AFTER completing Level 1:
  Hub        → UNLOCKED
  Level 1    → UNLOCKED ✓
  Level 2    → UNLOCKED
  Level 3    → LOCKED 🔒

AFTER completing Level 2:
  Hub        → UNLOCKED
  Level 1    → UNLOCKED ✓
  Level 2    → UNLOCKED ✓
  Level 3    → UNLOCKED
```

## Hub Level Triggers Visual

```
Hub Level:
├─ Level 1 indicator     (orange text)     → Click to enter
├─ Level 2 indicator     (orange text)     → Click to enter (after L1)
│                         (gray + 🔒)      → Shows lock message (before L1)
└─ Level 3 indicator     (gray + 🔒)       → Shows lock message (until L2 done)
```

## How Completion Works

1. **Player reaches level exit** → Trigger `level:complete` event
2. **Game detects completion** → `_onLevelComplete()` called
3. **ProgressionManager marks level done** → `completeLevel(levelId)`
4. **Next level automatically unlocked** → Progression chain continues
5. **localStorage saved** → Progress persists across sessions

## File Changes Summary

| File | Changes |
|------|---------|
| `src/game/ProgressionManager.js` | NEW - Core system |
| `src/game/game.js` | Added import, init, completion handling |
| `src/game/TriggerManager.js` | Added lock check, visual indicators |

## Testing Quick Checklist

- [ ] Open game → Level 1 accessible, Level 2 locked
- [ ] Can't enter Level 2 → Shows lock message
- [ ] Complete Level 1 → Level 2 becomes accessible
- [ ] Refresh page → Progress persists
- [ ] Complete Level 2 → Level 3 becomes accessible
