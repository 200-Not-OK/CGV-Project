# Trigger System Documentation

## Overview

The Trigger System is a proximity-based interaction system that allows players to trigger events (like loading levels) by entering specific zones in a level. Triggers are fully configurable via the `levelData.js` file and display interactive prompts to the player.

## Features

- **Proximity Detection**: Triggers activate when the player enters their radius
- **On-Screen Prompts**: Displays POI (Point of Interest) text and interaction instructions
- **Keyboard Interaction**: Press `E` to activate a trigger
- **Level Loading**: Built-in support for loading levels from `levelData.js`
- **Extensible**: Easy to add custom trigger types with your own logic

## Architecture

### Core Components

1. **TriggerManager** (`src/game/TriggerManager.js`)
   - Manages all triggers in a level
   - Handles proximity detection using physics sensors
   - Updates trigger state each frame
   - Handles trigger activation logic

2. **TriggerPrompt UI** (`src/game/components/triggerPrompt.js`)
   - Displays the POI text and "E to interact" prompt
   - Shows when player is near an active trigger
   - Animated with smooth fade-in/out

3. **Level Integration** (`src/game/level.js`)
   - Loads triggers from level data
   - Updates triggers each frame
   - Disposes triggers when level unloads

### How It Works

1. When a level loads, `TriggerManager` reads the `triggers` array from `levelData.js`
2. Each trigger is created as a physics sensor (non-colliding sphere)
3. Every frame, the TriggerManager checks which trigger is closest to the player
4. If the closest trigger is within its radius, it becomes "active"
5. The UI prompt is shown/hidden based on active trigger state
6. When the player presses `E` near an active trigger, the trigger fires
7. For level loaders, this calls `levelManager.loadLevel(targetLevel)`

## Level Data Configuration

### Basic Syntax

Add a `triggers` array to your level data in `levelData.js`:

```javascript
{
  "id": "hub",
  "name": "Hub Level",
  // ... other level config ...
  "triggers": {
    "levelLoaders": [
      {
        "id": "trigger_level1",
        "position": [-50, 15, 50],      // World position [x, y, z]
        "radius": 8,                     // Activation radius (units)
        "poiText": "⚡ The Valley",      // Text shown to player
        "targetLevel": "level1"          // Level to load
      },
      // ... more triggers ...
    ]
  }
}
```

### Trigger Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the trigger |
| `position` | [x, y, z] | Yes | World position of the trigger center |
| `radius` | number | Yes | Activation radius in game units |
| `poiText` | string | Yes | POI name/description shown to player |
| `targetLevel` | string | levelLoaders | Level ID to load (for levelLoaders type) |

### Example Hub Level with Triggers

```javascript
{
  "id": "hub",
  "name": "Hub Level",
  "order": 1,
  "gltfUrl": "assets/levels/Hub/Hub.glb",
  "startPosition": [0, 15, 8],
  
  "triggers": {
    "levelLoaders": [
      {
        "id": "trigger_level1",
        "position": [-50, 15, 50],
        "radius": 10,
        "poiText": "⚡ The Electrified Valley",
        "targetLevel": "level1"
      },
      {
        "id": "trigger_level2",
        "position": [50, 15, 50],
        "radius": 10,
        "poiText": "🐍 The Serpent's Labyrinth",
        "targetLevel": "level2"
      },
      {
        "id": "trigger_level3",
        "position": [0, 15, -50],
        "radius": 10,
        "poiText": "🏰 The Crystal Tower",
        "targetLevel": "level3"
      }
    ]
  },
  
  // ... rest of level config ...
}
```

## Gameplay Flow

### Player Perspective

1. Player walks through hub level
2. Player approaches a POI (Point of Interest)
3. On-screen prompt appears with the POI name and "E to interact"
4. Player presses `E`
5. Level loads (with transition effects if any)

### Visual Feedback

```
[Center screen]
        ⚡ The Valley
        
        [E] to interact
```

The prompt includes:
- **POI Text** in gold with glow effect
- **Key Button** (green "E" box)
- **Instruction** ("to interact")

## Adding Custom Trigger Types

You can extend the trigger system with custom trigger types. Triggers automatically infer their type from their properties:

- **Type: levelLoader** - If trigger has a `targetLevel` property
- **Type: custom** - If trigger has a `customAction` property

### 1. Define in Level Data

```javascript
"triggers": {
  "levelLoaders": [
    {
      "id": "trigger_level1",
      "position": [10, 15, 20],
      "radius": 8,
      "poiText": "⚡ The Valley",
      "targetLevel": "level1"
    }
  ],
  "customTriggers": [
    {
      "id": "trigger_custom",
      "position": [50, 15, 50],
      "radius": 6,
      "poiText": "🌟 Mystery Portal",
      "customAction": "playAnimation"
    }
  ]
}
```

### 2. Handle Custom Actions in TriggerManager (Optional)

Edit `src/game/TriggerManager.js` to add custom logic:

```javascript
_handleTriggerInteraction(trigger) {
  if (trigger.targetLevel) {
    // Auto-handled: levelLoader type
    this._handleLevelLoad(trigger);
  } else if (trigger.customAction) {
    // Your custom logic
    switch (trigger.customAction) {
      case 'playAnimation':
        console.log(`Playing animation: ${trigger.id}`);
        break;
      case 'spawnEnemy':
        console.log(`Spawning enemy: ${trigger.id}`);
        break;
      // ... more custom actions ...
    }
  }
}
```

## Console Logging

The trigger system provides detailed console logging:

```
📍 Loading 2 triggers
  ✓ Trigger "trigger_level1" (levelLoader) at [-50,15,50] - radius 8
  ✓ Trigger "trigger_level2" (levelLoader) at [50,15,50] - radius 8
✅ Loaded 2 triggers

✨ Entered trigger: "trigger_level1"
🎯 Trigger activated: "trigger_level1"
🚀 Loading level: level1
```

### Visual Debug Mode

To visualize all trigger spheres in a level, you can enable debug visualization:

```javascript
// In game.js console or extending TriggerManager
if (this.level?.triggerManager) {
  this.level.triggerManager.debugVisualizeTriggers();
}
```

This renders wireframe spheres for each trigger (green for levelLoaders, yellow for others).

## Best Practices

### Positioning

- **Hub Level**: Place triggers at clear locations (near entrances, signage, etc.)
- **POI Names**: Use descriptive, thematic names with emojis
- **Radius**: Use 8-12 units for comfortable interaction distance (roughly player height × 5)

### POI Text Examples

```javascript
"🗻 Mountain Peak"
"🌳 Enchanted Forest"
"⚔️ The Battle Arena"
"🏛️ Ancient Temple"
"🌀 Storm Vortex"
"💎 Diamond Caverns"
```

### Level Organization

Group related triggers in your level data:

```javascript
// Portal Zone
"triggers": [
  // ... level teleporters ...
],

// Event Triggers (future expansion)
"eventTriggers": [
  // ... cutscenes, dialogue, etc ...
],
```

## Integration with Existing Systems

### PhysicsWorld

Triggers use non-colliding physics sensors:
- Created as Cannon.js bodies with `mass: 0` and `collisionResponse: 0`
- Stored in `triggerManager.triggerBodies`
- Automatically removed when level unloads

### InputManager

Triggers monitor the `E` key via `input.keys['KeyE']`:
- Prevents repeat firing with frame-based consumption
- Works seamlessly with existing input handling

### UIManager

Triggers communicate with UI via `updateTriggerPrompt()`:
- Centralized through `game.uiManager.updateTriggerPrompt(trigger)`
- TriggerPrompt component shows/hides automatically

## Performance Notes

- Triggers use simple distance checks (fast)
- Physics sensors are non-colliding (minimal overhead)
- Each trigger creates one physics body
- Hub level with 3 triggers: negligible performance impact

## Troubleshooting

### Trigger Not Appearing

1. Check console for loading errors
2. Verify trigger position is reachable in level
3. Ensure `targetLevel` exists in levelData (for levelLoaders)
4. Check trigger radius isn't too small

### Prompt Not Showing

1. Check if TriggerPrompt UI component is registered (it is by default)
2. Verify you're within trigger radius
3. Check browser console for errors

### Level Not Loading

1. Verify `targetLevel` matches exact level ID in levelData
2. Check that the target level data is properly formatted
3. Look for errors in levelManager console output

## Future Extensions

Possible trigger system enhancements:

- **Conditional Triggers**: Require items/upgrades before activation
- **Multiple Interactions**: Different actions per trigger type
- **Delayed Activation**: Trigger events after time delay
- **Audio Cues**: Sound effects when entering/interacting
- **Animation Sequences**: Play cinematics on interaction
- **Dialogue Branches**: Trigger branching conversations
