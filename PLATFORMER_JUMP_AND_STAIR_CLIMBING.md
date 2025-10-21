# Platformer Jump & Stair Climbing System

## Overview
Enhanced player movement with platformer-style jumping and automatic stair climbing for a more polished gameplay experience.

## Changes Made

### 1. Improved Jump Mechanics (src/game/player.js)

#### Variable Jump Height
- **Jump Strength Increased**: `15` → `18` for more responsive, platformer-like jumps
- **Hold-to-Jump System**: 
  - Hold spacebar for up to 300ms to apply continuous upward force (higher jumps)
  - Release spacebar early to cut jump short (lower, more precise jumps)
  - Jump boost force: `25` units per frame while holding space
  - Early release cuts upward velocity by 50% for short hops

#### Jump Parameters
```javascript
this.jumpStrength = 18;              // Initial jump impulse
this.shortJumpStrength = 12;         // For tap jumps (future use)
this.jumpHoldTime = 0;               // Tracks hold duration
this.maxJumpHoldTime = 0.3;          // 300ms max boost window
```

#### Better Air Control
- Variable jump height gives players precise control over vertical movement
- Jump boost only applies during initial 300ms window
- Upward velocity capped when space released early

### 2. Stair Climbing System (src/game/player.js)

#### Automatic Step-Up Detection
New `handleStairClimbing()` method provides seamless stair navigation:

**Key Features:**
- **Max Step Height**: `0.5` units (configurable via `maxStepHeight`)
- **Horizontal Detection**: Uses raycast to detect obstacles in movement direction
- **Vertical Detection**: Second raycast checks for surface above current position
- **Smooth Climbing**: Gradual lift at `12` units/second (configurable via `stepClimbSpeed`)

**Algorithm:**
1. Raycast horizontally in movement direction to detect obstacle
2. If obstacle found, raycast downward from above to find step surface
3. Calculate step height (difference between surface and player position)
4. If step height is between `0.05` and `maxStepHeight`, auto-climb
5. Smoothly lift player position and apply forward momentum

**Parameters:**
```javascript
this.maxStepHeight = 0.5;           // Max climbable step (units)
this.stepCheckDistance = 0.6;        // Forward detection range
this.stepClimbSpeed = 12;            // Vertical climb speed
```

#### Integration with Movement
- Only active when grounded and moving
- Uses actual velocity direction for accurate detection
- Works with all movement directions (forward, backward, strafe)
- Prevents bouncing by dampening vertical velocity during climb

### 3. Physics Adjustments (src/game/physics/PhysicsWorld.js)

#### Gravity Tuning
- **Gravity Changed**: `-9.82` → `-20` m/s²
- More responsive falling for platformer feel
- Balances with increased jump strength for better air control
- Works with existing extra gravity force (`-25`) when airborne

### 4. Update Loop Integration (src/game/player.js)

Added to `update()` method:
```javascript
// Update jump hold timer
if (this.isJumping && this.jumpHoldTime < this.maxJumpHoldTime) {
  this.jumpHoldTime += delta;
}

// Check for stair climbing when grounded and moving
if (this.isGrounded && this.isMoving) {
  this.handleStairClimbing(camOrientation, delta);
}
```

## Technical Implementation

### Jump State Machine
1. **Ground State**: Space pressed → Apply initial jump impulse, set `isJumping = true`
2. **Jump Boost State**: Space held → Apply continuous upward force (0-300ms)
3. **Jump Release State**: Space released → Cut velocity if released early, disable boost
4. **Landing State**: Ground contact → Reset `isJumping` and `jumpHoldTime`

### Stair Climbing Ray System
```
Player Position (feet level)
    |
    v
[Horizontal Ray] ---> [Obstacle Detected]
                            |
                            v
                      [Vertical Ray Down]
                            |
                            v
                      [Surface Found]
                            |
                            v
                      [Calculate Step Height]
                            |
                            v
                  [Lift Player if < maxStepHeight]
```

### Collision-Safe Design
- Uses Cannon.js raycast system for accurate detection
- Checks `skipBackfaces: true` to avoid interior geometry
- Validates step height range before climbing
- Smoothly interpolates position to prevent physics glitches

## Configuration Options

### Jump Tuning
- `jumpStrength`: Initial jump impulse (default: 18)
- `shortJumpStrength`: Reserved for future tap-jump mechanics (default: 12)
- `maxJumpHoldTime`: Max boost duration in seconds (default: 0.3)

### Stair Tuning
- `maxStepHeight`: Maximum climbable step height (default: 0.5)
- `stepCheckDistance`: Forward detection range (default: 0.6)
- `stepClimbSpeed`: Vertical climb speed (default: 12)

### Physics Tuning
- World gravity: `-20` m/s²
- Airborne extra gravity: `-25` units (unchanged)
- Jump boost force: `25` units/frame while holding

## Player Experience Improvements

### Before
- Fixed jump height (hold space = same as tap)
- Manual jumping required for all vertical obstacles
- Heavy, floaty jump feel

### After
- ✅ Variable jump height (hold = high, tap = low)
- ✅ Auto-climb stairs up to 0.5 units tall
- ✅ Responsive, snappy platformer jump
- ✅ Better air control with hold-to-jump
- ✅ No interruption when walking on stairs
- ✅ Smooth, seamless step climbing

## Testing Recommendations

1. **Jump Feel**: Test tap vs hold jumps for height difference
2. **Stair Navigation**: Walk up various step heights (0.1 to 0.6 units)
3. **Edge Cases**: Test stair climbing at angles, during sprinting
4. **Performance**: Verify raycast overhead is negligible
5. **Animation**: Ensure jump animation syncs with new mechanics

## Future Enhancements

- **Wall Jump**: Use existing wall detection for wall jump mechanic
- **Double Jump**: Add air jump counter and second jump ability
- **Ledge Grab**: Extend stair climbing to hanging/climbing ledges
- **Coyote Time**: Allow jump input briefly after leaving edge
- **Jump Buffering**: Queue jump input before landing for responsive controls

## Compatibility Notes

- Works with existing wall sliding system
- Compatible with slope movement mechanics
- Integrates with ground detection system
- No conflicts with animation or sound systems
- Maintains physics stability with existing collision handling
