
# CS Platformer v2 — AI Coding Agent Instructions

## Architecture Overview

This project is a modular Three.js 3D platformer with Cannon.js physics, dual editor system, and a strong separation between visual and physics layers. Key boundaries:

- **Game Core** (`src/game/`): Main loop, player, physics, and state
- **Physics Layer** (`src/game/physics/PhysicsWorld.js`): Cannon.js world, materials, debug
- **Visual Layer**: Three.js scene, GLTF loading, rendering
- **Editor Systems**: In-game (`src/game/editor/`) and standalone (`src/editor/`)
- **Component Systems**: Enemies, Lights, UI, all with mount/unmount lifecycle
- **Asset Pipeline**: GLTF models, JSON level data, fallback procedural geometry
- **Cinematics**: Dialogue/cutscenes via `CinematicsManager`

## Developer Workflows

- **Dev server:** `npm run dev` (game at `/`, editor at `/editor.html`)
- **Build:** `npm run build`  |  **Preview:** `npm run preview`
- **Physics debug:**
  - `window.__GAME__` in console for live game instance
  - `window.togglePhysicsDebug()` or 'L' key for Cannon.js wireframes
  - `physicsWorld.enableDebugRenderer()` for green wireframes
- **Editor:** Press 'E' in-game or open `/editor.html` for full editor

## Key Patterns & Conventions

- **Physics-Visual Separation:** Physics bodies drive visuals. Sync via `mesh.position.copy(body.position)`.
- **Component Lifecycle:** All major systems (enemies, lights, UI) use `mount(scene)`, `unmount(scene)`, `update(delta)`.
- **Level Data:** Hybrid GLTF + procedural schema in `src/game/levelData.js`. Fallback objects used if GLTF fails.
- **Camera Modes:** Third-person (default), first-person, and free camera. Pointer lock managed automatically.
- **Input:** `InputManager` tracks `keys[e.code]`, pointer lock, and mouse deltas.
- **Asset Loading:**
  - **Levels:** Place GLTFs in `public/assets/levels/`. Name collision meshes with "collision" or "collider" for auto-collision.
  - **Doors:** Modular system in `public/assets/doors/` and `DoorManager.js`. Supports procedural and model-based doors, passcodes, and physics.
  - **Collectibles:** Place chest GLTFs in `public/assets/collectables/chest/` (animations: "open", "close").
  - **Enemies:** Place models/animations in `public/assets/enemies/`. See per-enemy README for animation and model specs.
  - **Audio:** Place music, sfx, ambient in `public/assets/audio/`. Reference in `levelData.js`.

## Integration Points

- **Physics-Movement:** Player uses direct velocity when grounded, forces when airborne.
- **EnemyManager:** Centralizes enemy updates, async GLTF loading, bbox for collisions.
- **LightManager:** Instantiates lights from `lights/index.js` per level config.
- **UIManager:** Mounts/unmounts UI components on level load/unload.
- **Procedural Fallback:** If GLTF fails, uses `fallbackObjects` from level data.

## Project Structure Highlights

- `src/game/enemies/`: Enemy classes (extend `EnemyBase`)
- `src/game/lights/`: Light components (register in `lights/index.js`)
- `src/game/components/`: UI (HUD, minimap, etc.)
- `public/assets/levels/`: Level GLTFs (see README for Blender export/collision naming)
- `public/assets/doors/`: Modular door system (see README for usage and extension)
- `public/assets/collectables/chest/`: Chest models (see README for animation names)
- `public/assets/enemies/`: Enemy models/animations (see README for requirements)
- `public/assets/audio/`: Music, sfx, ambient (see README for config)

## Examples

**Level Data Example:**
```js
{
  id: 'level1',
  gltfUrl: 'src/assets/levels/level1.gltf',
  startPosition: [0,2,0],
  lights: ['BasicLights'],
  enemies: [{ type: 'walker', position: [1,0,2] }],
  fallbackObjects: [ { type: 'box', position: [0,0,0], size: [2,1,2], color: 0x00ff00 } ]
}
```

**Door Spawn Example:**
```js
doorManager.spawn('model', {
  position: [5,0,8], width:2, height:4, depth:0.2,
  modelUrl: 'src/assets/models/door.glb', passcode: '123'
});
```

**Audio Config Example:**
```js
sounds: {
  music: { 'main-theme': { url: 'src/assets/audio/music/main-theme.mp3', loop: true } },
  sfx: { 'jump': { url: 'src/assets/audio/sfx/jump.wav', loop: false } },
  playMusic: 'main-theme'
}
```

---
**For more details, see per-asset README files in `public/assets/` and code comments in `src/game/` modules.**