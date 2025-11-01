# Trigger System Quick Start

## What's New

A complete proximity-based trigger system for level transitions and player interactions.

## Quick Example

Add this to your hub level in `src/game/levelData.js`:

```javascript
"triggers": [
  {
    "id": "trigger_level1",
    "type": "levelLoader",
    "position": [-50, 15, 50],      // Place near level entrance
    "radius": 8,                     // ~player interaction distance
    "poiText": "⚡ The Valley",      // Shown on screen
    "targetLevel": "level1"          // Level to load
  }
]
```

## What Happens

1. Player walks near trigger position
2. Yellow glowing text appears on screen with POI name
3. Player sees "E to interact" button
4. Player presses E
5. Level loads instantly

## Files Created

- `src/game/TriggerManager.js` - Core trigger logic
- `src/game/components/triggerPrompt.js` - On-screen UI prompt
- `public/assets/TRIGGER_SYSTEM.md` - Full documentation

## Files Modified

- `src/game/level.js` - Integrated trigger loading/updating/disposal
- `src/game/game.js` - Added TriggerPrompt UI component
- `src/game/uiManager.js` - Added updateTriggerPrompt() method
- `src/game/levelData.js` - Added trigger examples to hub level

## Testing

1. Run `npm run dev`
2. Start in hub level
3. Walk towards trigger zones (look for POI text)
4. Press E to load level

## Configuration

### Positioning Tips
- Use your level editor or coordinates (press `)
- Place near obvious entrances/landmarks
- Radius of 8 units = comfortable player interaction distance

### POI Text Examples
```
"🗻 Mountain Peak"
"🌳 Enchanted Forest"
"⚔️ The Battle Arena"
"🏛️ Ancient Temple"
"🌀 Storm Vortex"
"💎 Diamond Caverns"
"🏰 Crystal Tower"
```

## API Reference

### TriggerManager Methods

```javascript
// Load triggers from level data (called automatically)
triggerManager.loadTriggers(triggersData);

// Update each frame (called automatically by level)
triggerManager.update(playerPos, input);

// Get current active trigger
triggerManager.getActiveTrigger();

// Debug: show all trigger zones
triggerManager.debugVisualizeTriggers();

// Clean up
triggerManager.disposeTriggers();
```

### Trigger Data Structure

```javascript
{
  "id": "unique_id",                    // Required - unique identifier
  "position": [x, y, z],                // World position
  "radius": 8,                          // Activation range
  "poiText": "Name of Location",        // Display text
  "targetLevel": "level_id"             // Target level (for levelLoaders)
}
```

**Organization:** Triggers are organized by type in the levelData:
- `triggers.levelLoaders[]` - Level loading triggers
- `triggers.customTriggers[]` - Custom trigger types (optional)

## Common Patterns

### Level Selection Hub
```javascript
"triggers": {
  "levelLoaders": [
    {
      "id": "trigger_level1",
      "position": [-30, 15, 50],
      "radius": 8,
      "poiText": "⚡ Level 1",
      "targetLevel": "level1"
    },
    {
      "id": "trigger_level2",
      "position": [0, 15, 50],
      "radius": 8,
      "poiText": "🐍 Level 2",
      "targetLevel": "level2"
    },
    {
      "id": "trigger_level3",
      "position": [30, 15, 50],
      "radius": 8,
      "poiText": "🏰 Level 3",
      "targetLevel": "level3"
    }
  ]
}
```

### Checkpoint System (Future)
```javascript
// Currently triggers are level-based, but can extend for:
// - Mid-level checkpoints
// - Save points
// - Fast travel portals
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Trigger not visible | Check position coordinates, move closer |
| Level won't load | Verify `targetLevel` ID exists in levelData |
| Prompt appears but E key doesn't work | Check browser console for errors |
| Prompt flickering | Check trigger radius overlap |

## Next Steps

1. ✅ Add triggers to hub level via levelData
2. ✅ Position them at level entrances
3. ✅ Test E key interaction
4. 🔄 Extend with custom trigger types (optional)
5. 🔄 Add sound effects (optional)
6. 🔄 Add animation/transitions (optional)

## For Developers

Full documentation: `public/assets/TRIGGER_SYSTEM.md`

Key files:
- TriggerManager logic: `src/game/TriggerManager.js`
- UI display: `src/game/components/triggerPrompt.js`
- Level integration: `src/game/level.js`
