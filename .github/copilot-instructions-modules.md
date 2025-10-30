# CS Platformer v2 — Module-specific Copilot Instructions

This document provides focused, actionable guidance for AI assistants and contributors working on the following runtime modules:
- `src/game/game.js`
- `src/game/components/ComputerTerminal.js`
- `src/game/GlitchManager.js`
- `src/game/CollectiblesManager.js`

Follow these rules exactly when editing or generating code for these files.

---

## General Conventions
- Preserve existing exported APIs and public method names unless the change is part of a deliberate refactor and you update all call sites.
- Keep visual/physics separation: Three.js transforms are visuals; Cannon.js bodies live in `physicsWorld` and are authoritative for collisions.
- Use `console.log` sparingly for debugging; remove or gate verbose logs behind a `this.debug` flag before committing.
- Use ES6 modules and named exports.
- Strictly follow the existing event names: examples: `level:complete`, `onCollectiblePickup`, `onAppleCollected`.

---

## `src/game/game.js` — responsibilities & guidance

Responsibilities:
- Initialize renderer, physics world (`PhysicsWorld`), input, managers (level, lights, sound, collectibles, doors, combat).
- Manage game loop `_loop()` with update order: physics.step -> update managers -> render.
- Load levels via `loadLevel(index)`/`loadLevelByName`, set player start, swap UI and lights.
- Maintain camera switching and pointer lock behavior.

Guidance for edits:
- When modifying level loading, always recreate or reassign `this.physicsWorld` before creating physics bodies. Preserve `wasDebugEnabled` when re-creating world.
- If loading level data twice is seen (loadIndex called twice), ensure `levelManager.loadIndex()` is awaited once and used consistently for `this.level` and `this.level.data`.
- When setting player start position, always call `this.player.setPosition(new THREE.Vector3(...start))` not mutate player.mesh directly.
- If adding new per-level systems (e.g., computer terminal), create initialization after the level is fully loaded and `this.level` is set.

Common code snippets:
- Recreate physics world safely:
  const wasDebug = this.physicsWorld?.isDebugEnabled?.() || false;
  this.physicsWorld?.dispose?.();
  this.physicsWorld = new PhysicsWorld(this.scene, { useAccurateCollision: false, debugMode: wasDebug });

- Ensure managers referencing physicsWorld are updated:
  this.collectiblesManager.updatePhysicsWorld(this.physicsWorld);
  this.doorManager = new DoorManager(this.scene, this.physicsWorld, this);

- Live debug helper exposure (use in dev only):
  if (typeof window !== 'undefined') window.__GAME__ = this;

---

## `src/game/components/ComputerTerminal.js` — responsibilities & guidance

Responsibilities:
- Visual representation of a computer terminal that can be interacted with by the player.
- Query `glitchManager` to determine activation eligibility and trigger `loadLevelByName` on success.
- Present interaction prompts via `game.ui.get('interactionPrompt')` and manage `isPlayerInRange` checks.

Guidance for edits:
- Keep visual creation in `createComputerMesh()` and avoid adding game logic there.
- `interact()` should return a consistent object: `{ success: boolean, message: string, level?: string }` and must not directly call `loadLevelByName` synchronously — use a setTimeout or a game-level queue to avoid reentrancy during update loops.
- Use `this.mesh.userData` to mark transient flags (`isComputer`, `interactionTarget`) but do not add non-serializable fields to level data.

Edge cases:
- If `this.game` is undefined (unit tests, headless), `interact()` should still return a structured result and not throw.
- When showing prompts, check `interactionPrompt.isVisible` before calling `show()` to avoid flicker.

Example interaction flow (pseudocode):
  const result = terminal.interact();
  if (result.success) {
    // schedule level change
    setTimeout(() => this.game.loadLevelByName(result.level), 2000);
  }

---

## `src/game/GlitchManager.js` — responsibilities & guidance

Responsibilities:
- Track collected LLMs, which glitched levels remain, and decide next glitched level.
- Expose `canActivateComputer()`, `activateComputer()` and `completeGlitchedLevel()`.

Guidance for edits:
- Keep `requiredLLMs` and level-specific collectible counts configurable via `setRequirements(...)`.
- `canActivateComputer()` must be deterministic and side-effect free.
- `activateComputer()` may mutate internal state (`this.currentLevel`) but should return an object `{ success, level?, message }` and not perform side-effects like calling `game.loadLevelByName` directly.

Testing:
- Unit test `canActivateComputer()` with different `collectedLLMs` sets.
- Ensure `getNextGlitchedLevel()` returns `null` when all glitched levels are completed.

---

## `src/game/CollectiblesManager.js` — responsibilities & guidance

Responsibilities:
- Spawn visual collectible meshes and physics bodies for apples, potions, chests.
- Handle proximity-based pickup and explicit interactions (opening chests).
- Emit events via `triggerEvent('onCollectiblePickup', collectible)` and `triggerEvent('onAppleCollected', ...)`.
- Provide `cleanup()` when level changes.

Guidance for edits:
- Keep physics/visual sync consistent: physics bodies are authoritative for collision, but legacy code may update physics body position from visual. Prefer updating visual from physics when possible.
- `collectItem(id)` should:
  1. guard against double-collect (if collectible.collected return false)
  2. mark `collected = true`
  3. play effects and sounds via `this.game.soundManager`
  4. remove mesh and physics body
  5. emit events & update UI
  6. delete from `this.collectibles` map

- For chests: use `openChest(chestCollectible)` which should orchestrate animation, VO, and delayed removal. Keep animation non-blocking.
- Avoid referencing `Date.now()` inside IDs for deterministic tests; use `generateId()` where possible.

Rotation / animation rules:
- For spinning/floating collectibles, update visual rotation and float offset in `update(deltaTime)`.
- Do not mutate `deltaTime` with modulus checks like `if (deltaTime % 60 === 0)` (this is probably wrong because deltaTime is fractional seconds); instead use an accumulator or a timestamp to log periodically.

Fix the logging bug example:
  // replace incorrect "if (deltaTime % 60 === 0)" with:
  this._logAccumulator = (this._logAccumulator || 0) + deltaTime;
  if (this._logAccumulator >= 1.0) { console.log(...); this._logAccumulator = 0; }

Closest-player detection:
- When searching nearest chest, use squared distance comparisons to avoid sqrt cost.

Collision / physics updates:
- Update physics body position from visual only when physics bodies are kinematic; prefer moving physics body and copying position to mesh.

Example `collectItem` skeleton:

collectItem(id) {
  const c = this.collectibles.get(id);
  if (!c || c.collected) return false;
  c.collected = true;
  this.createPickupEffect(c.mesh.position.clone());
  this.scene.remove(c.mesh);
  if (this.physicsWorld && c.body) this.physicsWorld.removeBody(c.body);
  this.triggerEvent('onCollectiblePickup', c);
  if (c.type === 'apple') this.triggerEvent('onAppleCollected', c);
  this.collectibles.delete(id);
  return true;
}

---

## Cross-file integration notes
- When adding new game-level objects (computer terminal, collectible types), update `Game._initializeLevel` and `Level` loader to ensure objects are created after `this.physicsWorld` exists.
- When removing meshes/colliders from editor, ensure exported `levelData.js` matches what `Level` expects (rotation degrees vs radians conversions).

---

## When creating patches or fixes
- Provide concise, targeted edits. Use existing helper methods (`_createColliderVisuals`, `createPickupEffect`, etc.) rather than re-implementing logic.
- After edits, run the game editor and play a short walkthrough ensuring collectibles, computers and glitch activation work end-to-end.
- Add tests or a QA checklist entry describing how to validate the change.

---

Last updated: 2025-10-30
