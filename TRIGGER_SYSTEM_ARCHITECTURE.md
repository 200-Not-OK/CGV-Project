# Trigger System Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      GAME LOOP                              │
│                   (game.js)                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              LEVEL UPDATE                                   │
│          (level.js:update())                                │
├─────────────────────────────────────────────────────────────┤
│ • Enemy updates                                             │
│ • NPC updates                                               │
│ • Platform updates                                          │
│ • Interactive object updates                                │
│ • TRIGGER UPDATES ─────────┐                               │
│                            │                                │
└──────────────────────────────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │   TRIGGER MANAGER UPDATE              │
         │ (TriggerManager.js:update())          │
         ├───────────────────────────────────────┤
         │ 1. Get player position                │
         │ 2. Calculate distance to each trigger │
         │ 3. Find closest trigger in range      │
         │ 4. Update active trigger              │
         │ 5. Check for E key press              │
         │ 6. Fire trigger action if E pressed   │
         └───────────────────────────────────────┘
                    │              │
        ┌───────────┴──────┬───────┴──────────────┐
        │                  │                      │
        ▼                  ▼                      ▼
   ┌─────────┐      ┌──────────────┐      ┌─────────────┐
   │ Show    │      │ Hide Prompt  │      │ Fire        │
   │ Prompt  │      │ (no trigger) │      │ Trigger     │
   │ (UIMan) │      │ (UIMan)      │      │ (callback)  │
   └─────────┘      └──────────────┘      └─────────────┘
        │                                        │
        ▼                                        ▼
   ┌─────────────────────────────────┐   ┌──────────────────┐
   │ TriggerPrompt.show()            │   │ Type Check:      │
   │ Display POI Text + E Button     │   │ levelLoader      │
   │ Center on screen with animation │   │ custom           │
   └─────────────────────────────────┘   └────────┬─────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────────┐
                                        │ Load Level           │
                                        │ levelManager         │
                                        │ .loadLevel()         │
                                        └──────────────────────┘
```

## Class Structure

### TriggerManager

```
TriggerManager
├── Properties
│   ├── scene (THREE.Scene)
│   ├── physicsWorld (CANNON.World)
│   ├── game (Game instance)
│   ├── triggers (Array<Trigger>)
│   ├── activeTrigger (Trigger | null)
│   └── triggerBodies (Array<CANNON.Body>)
│
├── Methods
│   ├── loadTriggers(triggersData)
│   │   └── Parse levelData triggers
│   │   └── Create physics sensor bodies
│   │   └── Validate target levels
│   │
│   ├── update(playerPos, input)
│   │   ├── Find closest trigger in range
│   │   ├── Update activeTrigger
│   │   ├── Show/hide UI prompt
│   │   └── Handle E key interaction
│   │
│   ├── getActiveTrigger()
│   │   └── Return current active trigger
│   │
│   ├── debugVisualizeTriggers()
│   │   └── Render wireframe spheres
│   │
│   └── disposeTriggers()
│       ├── Remove physics bodies
│       └── Clear trigger list
│
└── Private Methods
    ├── _createTrigger(trigData)
    │   ├── Parse trigger config
    │   ├── Create physics body
    │   └── Add to trigger list
    │
    ├── _handleTriggerInteraction(trigger)
    │   └── Route based on trigger.type
    │
    └── _handleLevelLoad(trigger)
        └── Call levelManager.loadLevel()
```

### TriggerPrompt (UI Component)

```
TriggerPrompt extends UIComponent
├── Properties
│   ├── root (HTMLElement)
│   ├── promptContainer (HTMLDiv)
│   ├── poiText (HTMLDiv)
│   └── keyPrompt (HTMLDiv)
│
├── Methods
│   ├── show(trigger)
│   │   ├── Update poiText content
│   │   ├── Add pulse animation
│   │   └── Set display = 'block'
│   │
│   ├── hide()
│   │   ├── Remove pulse animation
│   │   └── Set display = 'none'
│   │
│   └── update(props)
│       └── Dynamic property updates
│
└── Styling
    ├── Center on screen (top: 50%, left: 50%)
    ├── Gold text with glow effect
    ├── Green E button with gradient
    ├── Pop-in animation
    └── Pulse animation for active state
```

## Integration Points

```
Game
├── Input (E key)
│   └── TriggerManager detects keydown
│
├── Level
│   ├── Loads triggers from levelData
│   ├── Updates triggerManager each frame
│   └── Disposes triggers on unload
│
├── UIManager
│   ├── Registers TriggerPrompt component
│   ├── updateTriggerPrompt() method
│   └── Shows/hides prompt based on state
│
├── LevelManager
│   └── Called by trigger to load new level
│
├── PhysicsWorld
│   ├── Creates sensor bodies for triggers
│   └── Manages physics lifecycle
│
└── Player
    └── Position used for distance checks
```

## State Machine

```
┌─────────────────────────────────────┐
│      INITIAL STATE                  │
│  (no trigger in range)              │
│  activeTrigger = null               │
│  UI: hidden                         │
└──────────┬──────────────────────────┘
           │
           │ Player enters trigger radius
           ▼
┌─────────────────────────────────────┐
│      ACTIVE STATE                   │
│  (player in range)                  │
│  activeTrigger = trigger            │
│  UI: visible                        │
│  Waiting for E key                  │
└──────────┬──────────────────────────┘
           │
           ├─── Player leaves radius
           │    └──> INITIAL STATE
           │
           └─── Player presses E
                └──> FIRING STATE
                     └──> Load Level / Execute Callback
                          └──> INITIAL STATE (after transition)
```

## Trigger Data Structure

```javascript
{
  // Identification
  id: string,              // Unique identifier
  
  // Position & Size
  position: THREE.Vector3, // World position [x, y, z]
  radius: number,          // Activation radius
  
  // Display
  poiText: string,         // "🏰 The Castle"
  
  // Behavior - Type Inference:
  // - Has targetLevel → "levelLoader" type
  // - Has customAction → "custom" type
  targetLevel: string,     // For levelLoaders type
  customAction: string,    // For custom triggers
  active: boolean,         // Current state
  cooldown: number         // Prevents repeat firing
}
```

## Level Data Example

Trigger data uses nested object structure matching the collectibles pattern:

```javascript
{
  "id": "hub",
  "name": "Hub Level",
  
  "triggers": {
    "levelLoaders": [
      {
        "id": "portal_level1",
        "position": [-50, 15, 50],
        "radius": 8,
        "poiText": "⚡ The Valley",
        "targetLevel": "level1"
      },
      // ... more level portals ...
    ],
    
    "customTriggers": [
      // Future custom trigger types
    ]
  }
}
```

**Why Nested Structure?**
- Matches collectibles pattern (`{ chests: [...], potions: [...] }`)
- Scales well for multiple trigger types
- Improves code organization and readability
- Enables type inference (no `type` field needed)

## Physics Integration

```
Trigger Manager
├── Create CANNON.Body for each trigger
│   ├── mass: 0 (static/kinematic)
│   ├── shape: Sphere (radius from config)
│   ├── collisionResponse: 0 (sensor/no collision)
│   └── position: set from config
│
├── Add to physicsWorld
│   ├── world.addBody(body)
│   └── Store in triggerBodies array
│
└── Cleanup on Level Unload
    └── world.removeBody(body) for each
```

## Update Loop Integration

```
Game.animate()
  │
  ├─ Input updates (keys, mouse)
  │
  ├─ Physics step
  │
  ├─ Player update
  │
  ├─ Level update
  │   │
  │   ├─ Enemy updates
  │   ├─ NPC updates
  │   ├─ Platform updates
  │   ├─ Interactive objects
  │   │
  │   └─ TRIGGER UPDATES ◄───┐
  │       │                   │
  │       ├─ Distance checks  │ TriggerManager.update()
  │       ├─ State changes    │ Called with:
  │       ├─ UI updates       │ - playerPos
  │       └─ Input handling   │ - input manager
  │           └─ E key check  │
  │
  ├─ Camera update
  │
  ├─ Render
  │
  └─ Next frame
```

## Key Integration Points

### 1. Level Constructor
```javascript
this.triggerManager = new TriggerManager(this.scene, this.physicsWorld, game);
```

### 2. Level._buildFromData()
```javascript
this._loadTriggers();  // Load from levelData
```

### 3. Level.update()
```javascript
if (this.triggerManager && player) {
  this.triggerManager.update(player.mesh.position, this.game?.input);
}
```

### 4. Level.dispose()
```javascript
if (this.triggerManager) {
  this.triggerManager.disposeTriggers?.();
  this.triggerManager = null;
}
```

### 5. Game.constructor()
```javascript
this.ui.add('triggerPrompt', TriggerPrompt, {});
```

### 6. UIManager.updateTriggerPrompt()
```javascript
const triggerPrompt = this.get('triggerPrompt');
if (trigger) {
  triggerPrompt.show(trigger);
} else {
  triggerPrompt.hide();
}
```

## Performance Characteristics

```
Operation               | Complexity | Per-Frame Cost
─────────────────────────────────────────────────────
Distance calculations   | O(n)       | n * 2 distance calls
Closest trigger search  | O(n)       | n comparisons
Active trigger check    | O(1)       | 1 comparison
Input detection         | O(1)       | 1 key check
Physics update          | O(1)       | n physics bodies
─────────────────────────────────────────────────────
Total (3 triggers)      |            | ~0.1ms at 60fps

n = number of triggers in level
Typically: 2-5 triggers per hub level
