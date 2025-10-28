# How to Add Cutscenes During a Level

## Overview
Cutscenes are defined in `levelData.js` and triggered using the `CinematicsManager`. You can play cinematics at any point during gameplay, not just at the start/end of a level.

## 1. Define a Cinematic in Level Data

In `src/game/levelData.js`, add your cinematic under the `cinematics` field:

```javascript
{
  id: "myLevel",
  // ... other level properties
  cinematics: {
    "myCustomCinematic": {
      "sequence": [
        {
          "type": "takeCamera"
        },
        {
          "type": "fadeOut",
          "ms": 400
        },
        {
          "type": "cut",
          "position": [10, 5, 10],
          "lookAt": [0, 0, 0],
          "fov": 50
        },
        {
          "type": "fadeIn",
          "ms": 600
        },
        {
          "type": "caption",
          "text": "The door opens...",
          "ms": 2500
        },
        {
          "type": "wait",
          "ms": 1000
        },
        {
          "type": "releaseCamera"
        }
      ]
    },
    
    // Other built-in cinematic types:
    "onLevelStart": { /* ... */ },
    "onLevelComplete": { /* ... */ },
    "onEnemyDefeat": { /* ... */ }
  }
}
```

## 2. Available Step Types

### Camera Control
- **`takeCamera`** - Takes control from the player
- **`releaseCamera`** - Returns control to the player
- **`cut`** - Instantly cuts to a camera position
- **`move`** - Smoothly moves the camera to a position
- **`orbit`** - Orbits around a center point
- **`focus`** - Focuses on a specific target (enemy, chest, etc.)

### Visual Effects
- **`fadeIn`** - Fades in from black
- **`fadeOut`** - Fades out to black
- **`shake`** - Camera shake effect
- **`zoom`** - Zooms in/out

### Timing & Dialogue
- **`wait`** - Pauses for a duration
- **`caption`** - Shows text on screen
- **`playVO`** - Plays voiceover with captions

## 3. Trigger a Cinematic During Gameplay

### Method 1: Direct Call (Simplest)
In any game file where you have access to `this.game.level.cinematicsManager`:

```javascript
// Trigger your custom cinematic
this.game.level.cinematicsManager.playCinematic('myCustomCinematic');
```

### Method 2: Add a Helper Method to Level
In `src/game/level.js`, add:

```javascript
// Around line 738
triggerMyCustomCinematic() {
  if (this.cinematicsManager) {
    this.cinematicsManager.playCinematic('myCustomCinematic');
  }
}
```

Then call it from anywhere with access to game:
```javascript
this.game.level.triggerMyCustomCinematic();
```

### Method 3: Trigger from Event
Listen for events and trigger cinematics:

```javascript
// In game.js or wherever you handle events
window.addEventListener('door:opened', () => {
  if (this.level?.cinematicsManager) {
    this.level.cinematicsManager.playCinematic('doorOpensCinematic');
  }
});
```

## 4. Common Trigger Scenarios

### When Player Enters an Area
```javascript
// In game loop or player update
const playerPos = this.player.getPosition();
if (playerPos.x > 50 && playerPos.x < 60 && !this._cinematicPlayed) {
  this.level.cinematicsManager.playCinematic('enterArea');
  this._cinematicPlayed = true;
}
```

### When Collecting Item
```javascript
// In collectibles manager or game
onCollectibleCollected(item) {
  if (item.id === 'specialKey') {
    this.level.cinematicsManager.playCinematic('keyFound');
  }
}
```

### When Enemy Dies
```javascript
// In enemy base class
takeDamage(amount) {
  // ... damage logic
  if (!this.alive && this.kind === 'boss') {
    this.game.level.cinematicsManager.playCinematic('bossDefeated');
  }
}
```

## 5. Using the Cinematic Editor

1. Open `cinematic-editor.html` in your browser
2. Select the level you want to edit
3. Create/Edit cinematics using the UI:
   - Click "Capture" to save current camera position
   - Click "Add Step" to add new steps
   - Adjust properties in the right panel
   - Export JSON when done
4. Copy the exported JSON into your level's `cinematics` field in `levelData.js`

## 6. Advanced Features

### Dynamic Targets
Instead of fixed positions, reference dynamic objects:

```javascript
{
  "type": "focus",
  "target": { "type": "enemy", "of": "snake_boss" },
  "side": "east",
  "distance": 10,
  "height": 2
}
```

### Player Position
```javascript
{
  "type": "orbit",
  "center": "player",  // Automatically tracks player
  "radius": 7.5,
  "startDeg": 0,
  "endDeg": 360,
  "duration": 5000
}
```

### Concurrent Actions
Run camera moves while playing VO:

```javascript
{
  "type": "playVO",
  "vo": "narrator-line",
  "block": true,
  "concurrent": [
    { "type": "orbit", "center": "player", "duration": 4000 },
    { "type": "wait", "ms": 1000 },
    { "type": "cut", "position": [...], "lookAt": [...] }
  ]
}
```

### Scheduled Captions
Show captions at specific times during VO:

```javascript
{
  "type": "playVO",
  "vo": "voiceover-name",
  "segments": [
    { "at": 0, "text": "First line", "ms": 2000 },
    { "at": 2500, "text": "Second line", "ms": 2500 },
    { "at": 5500, "text": "Third line", "ms": 2000 }
  ]
}
```

## 7. Skipping Cutscenes

Players can skip any cinematic by pressing the **K** key during playback.

## Tips

1. **Keep cinematics short** - Players may skip long ones
2. **Use `takeCamera` and `releaseCamera`** - Always properly control camera ownership
3. **Test timing** - VO duration must match `ms` values for captions
4. **Avoid overlapping cinematics** - Check `this.cinematicsManager.isPlaying` before triggering
5. **Clean up** - Use proper wait times and camera release for smooth transitions

## Example: Complete Door Opening Cinematic

```javascript
"doorOpensCinematic": {
  "sequence": [
    { "type": "takeCamera" },
    { "type": "fadeOut", "ms": 300 },
    { "type": "cut", "position": [5, 3, -8], "lookAt": [0, 0, 0], "fov": 50 },
    { "type": "fadeIn", "ms": 600 },
    { "type": "caption", "text": "The door creaks open...", "ms": 2000 },
    { "type": "wait", "ms": 500 },
    { "type": "playVO", "vo": "door-opening", "block": true },
    { "type": "shake", "seconds": 0.3, "magnitude": 0.1 },
    { "type": "wait", "ms": 1000 },
    { "type": "releaseCamera" }
  ]
}
```

Trigger it when the door opens:
```javascript
onDoorOpen() {
  this.level.cinematicsManager.playCinematic('doorOpensCinematic');
}
```


