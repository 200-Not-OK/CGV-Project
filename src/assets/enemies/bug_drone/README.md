# Enemy Eye Drone Animations

## Animation List

| Animation | Duration | Description |
|-----------|----------|-------------|
| **Attack** | 0.6s | Attack action with body movement and piston extension |
| **BackFlip** | 1.33s | Acrobatic evasive maneuver |
| **Charging** | 0.5s | Charge-up animation before attack |
| **Hit** | 0.27s | Short impact reaction animation |
| **Idle** | 3.33s | Looping hover animation with subtle movements |
| **Look** | 3.33s | Scanning/tracking behavior animation |

## Animated Components

- **Root** - Base transform
- **Body** - Main body rotation and translation
- **Eyelid_Top** - Upper eyelid movement
- **Eyelid_Bottom** - Lower eyelid movement
- **FrontPiston.L** - Left front piston
- **BackPiston.L** - Left back piston
- **FrontPiston.R** - Right front piston
- **BackPiston.R** - Right back piston

## Technical Details

- Uses mix of **STEP** and **LINEAR** interpolation
- All animations control **translation**, **rotation**, and **scale** channels
- Skeletal rig with 8 joints total