// src/game/level.js
import * as THREE from 'three';
import { EnemyManager } from './EnemyManager.js';
import { NpcManager } from './NpcManager.js';
import { loadGLTFModel } from './gltfLoader.js';
import { CinematicsManager } from './cinematicsManager.js';

/**
 * Level
 * - Loads GLTF (visuals) and optional manual colliders from levelData
 * - Falls back to procedural geometry if GLTF fails/missing
 * - Always guarantees at least one static ground so player doesn't fall forever
 * - Spawns enemies and NPCs, exposes getPlatforms() for player collisions
 * - Provides cinematic trigger helpers
 * - Disposes cleanly
 */
export class Level {
  constructor(scene, physicsWorld, levelData, showColliders = true, game = null) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    this.data = levelData || {};
    this.game = game;

    this.showColliders = !!showColliders;

    this.objects = [];        // THREE.Mesh/Group added to scene (visuals)
    this.physicsBodies = [];  // physics handles from PhysicsWorld
    this.gltfLoaded = false;
    this.gltfScene = null;

    this.enemyManager = new EnemyManager(this.scene, this.physicsWorld);
    this.npcManager = new NpcManager(this.scene, this.physicsWorld);

    // Cinematics
    this.cinematicsManager = new CinematicsManager(this.game);
  }

  // Async factory to enforce that content is fully built before returning.
  static async create(scene, physicsWorld, levelData, showColliders = true, game = null) {
    const level = new Level(scene, physicsWorld, levelData, showColliders, game);
    await level._buildFromData();
    return level;
  }

  // ---------------------------------------------------------------------------
  // BUILD
  // ---------------------------------------------------------------------------
  async _buildFromData() {
    const id = this.data.id || '(no-id)';
    console.log('🏗️ Building level from data:', id);
    console.log('📋 Level data gltfUrl:', this.data.gltfUrl || 'NOT SET');

    let geometryLoaded = false;

    // 1) Try GLTF visuals first
    if (this.data.gltfUrl) {
      try {
        await this._loadGLTFGeometry(this.data.gltfUrl);
        this.gltfLoaded = true;
        geometryLoaded = true;
        console.log('✅ GLTF level geometry loaded successfully');
      } catch (error) {
        console.warn('❌ Failed to load GLTF level geometry:', error);
        this.gltfLoaded = false;
      }
    }

    // 2) Fallback procedural geometry
    if (!geometryLoaded) {
      console.log('📦 Using fallback procedural geometry');
      this._buildFallbackGeometry();
    }

    // 3) Always ensure there's at least a ground collider if none exist
    this._ensureDefaultGround();

    // 4) Enemies
    console.log('👾 Loading enemies...');
    this._loadEnemies();

    // 4.5) NPCs
    console.log('🤖 Loading NPCs...');
    this._loadNpcs();

    // 5) Cinematics
    if (this.data.cinematics) {
      console.log('🎬 Loading cinematics...');
      this.cinematicsManager.loadCinematics(this.data.cinematics);
    }

    console.log(`✅ Level build complete. GLTF loaded: ${this.gltfLoaded}. Visual objects: ${this.objects.length}. Physics bodies: ${this.physicsBodies.length}`);
  }

  async _loadGLTFGeometry(url) {
    console.log('🔄 Loading GLTF from:', url);
    const gltf = await loadGLTFModel(url);

    if (!gltf || !gltf.scene) {
      throw new Error(`Invalid GLTF: ${url}`);
    }

    // Add whole GLTF to scene first to keep transforms
    this.scene.add(gltf.scene);
    this.gltfScene = gltf.scene;

    // Collect meshes for tagging/association
    const meshesToProcess = [];
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        meshesToProcess.push(child);
      }
    });
  console.log(`🔍 Found ${meshesToProcess.length} meshes in GLTF`);

    const hasManualColliders = Array.isArray(this.data.colliders) && this.data.colliders.length > 0;

    if (hasManualColliders) {
      // Debug dump of mesh names to help diagnose name mismatches
      const sampleNames = meshesToProcess.slice(0, 80).map(m => {
        const parent = m.parent && m.parent.name ? ` (parent: ${m.parent.name})` : '';
        return `${m.name || '(unnamed)'}${parent}`;
      });
      console.log('🧩 GLTF mesh names (first up to 80):', sampleNames.join(', '));
      console.log('🎯 Using manual colliders from level data');
      this._loadManualColliders(meshesToProcess);
    } else {
      console.log('🖼️ No manual colliders defined — adding visuals only (no physics from GLTF)');
      this._loadVisualsOnly(meshesToProcess);
    }
  }

  /**
   * Resolve a THREE.Mesh from a provided name more robustly.
   * Handles common GLTF cases where Blender/GLTF adds suffixes like `_0` to mesh primitives
   * or where the named node is a Group/Object3D with Mesh children.
   */
  _resolveMeshFromName(meshesToProcess, meshName) {
    if (!meshName) return null;
    const targetLower = meshName.toLowerCase();
    const targetBase = meshName.split('.')[0].toLowerCase();
    const normalize = (s) => (s || '').toLowerCase().replace(/[^a-z0-9_\-]+/g, '');
    const targetNormalized = normalize(meshName);

    // 1) Exact (case-insensitive) match among meshes
    let match = meshesToProcess.find(m =>
      m.name === meshName || (m.name && m.name.toLowerCase() === targetLower)
    );
    if (match) return match;

    // 2) Prefix match to handle GLTFLoader suffixes like "_0", "_1"
    match = meshesToProcess.find(m => m.name && m.name.toLowerCase().startsWith(targetLower + '_'));
    if (match) return match;

    // 2b) Prefix match using base before dot (e.g., Plane.001 -> Plane)
    match = meshesToProcess.find(m => m.name && m.name.toLowerCase().startsWith(targetBase + '.'));
    if (match) return match;

    // 2c) Normalized includes (ignore punctuation differences)
    match = meshesToProcess.find(m => normalize(m.name).includes(targetNormalized));
    if (match) return match;

    // 3) Parent name match (the node might be named, while the Mesh child has a suffixed name)
    match = meshesToProcess.find(m => m.parent && (
      m.parent.name === meshName || (m.parent.name && m.parent.name.toLowerCase() === targetLower)
    ));
    if (match) return match;

    // 4) Search the full GLTF scene for an object with the given name; if it's not a Mesh, pick first Mesh descendant
    if (this.gltfScene && this.gltfScene.getObjectByName) {
      const obj = this.gltfScene.getObjectByName(meshName);
      if (obj) {
        if (obj.isMesh) return obj;
        let found = null;
        obj.traverse((child) => {
          if (!found && child.isMesh) found = child;
        });
        if (found) return found;
      }
    }

    return null;
  }

  _loadManualColliders(meshesToProcess) {
    // Tag visuals
    for (const mesh of meshesToProcess) {
      mesh.userData.type = 'gltf';
      this.objects.push(mesh);
    }

    // Build physics by definitions
    for (const def of this.data.colliders) {
      try {
        console.log(`  🎯 Creating manual collider: ${def.id || '(no-id)'}`);
        const body = this._createPhysicsBodyFromDefinition(def, meshesToProcess);
        if (!body) continue;
        this.physicsBodies.push(body);

        // Associate matching mesh (optional) - only for non-mesh types
        if (def.type !== 'mesh') {
          const match = meshesToProcess.find(m =>
            m.name === def.meshName ||
            (def.meshName && m.name?.toLowerCase() === def.meshName.toLowerCase())
          );
          if (match) {
            match.userData.physicsBody = body;
            match.userData.manualCollider = true;
          }
        }
      } catch (e) {
        console.warn('⚠️ Failed to create manual collider:', def, e);
      }
    }
  }

  _loadVisualsOnly(meshesToProcess) {
    for (const mesh of meshesToProcess) {
      mesh.userData.type = 'gltf';
      mesh.userData.visualOnly = true;
      this.objects.push(mesh);
    }
    console.log(`📝 Added ${meshesToProcess.length} visual meshes without physics bodies`);
  }

  _createPhysicsBodyFromDefinition(colliderDef, meshesToProcess = []) {
    const { type, position = [0, 0, 0], size = [1, 1, 1], rotation = [0, 0, 0], materialType = 'ground', meshName } = colliderDef;

    const pos = new THREE.Vector3(position[0], position[1], position[2]);

    // Support for mesh-based colliders (Trimesh from GLTF)
    if (type === 'mesh' && meshName) {
      const match = this._resolveMeshFromName(meshesToProcess, meshName);

      if (match && match.geometry) {
        console.log(`  🌍 Creating Trimesh collider from GLTF mesh: ${match.name} (requested: ${meshName})`);
        const body = this.physicsWorld.addStaticMesh(match, materialType, {
          useAccurateCollision: true // Force Trimesh for terrain
        });
        if (body) {
          match.userData.physicsBody = body;
          match.userData.manualCollider = true;
        }
        return body;
      } else {
        // Improve diagnostics: show sample available names (first 20)
        const candidates = meshesToProcess
          .map(m => m.name || '(unnamed)')
          .slice(0, 20);
        console.warn(`⚠️ Mesh not found for collider: ${meshName}. Sample available names: ${candidates.join(', ')}`);
        return null;
      }
    }

    if (type === 'box') {
      const half = new THREE.Vector3(size[0], size[1], size[2]);
      return this.physicsWorld.addStaticBox(pos, half, materialType, rotation);
    }

    if (type === 'sphere') {
      const radius = size[0] || 1;
      return this.physicsWorld.addStaticSphere(pos, radius, materialType, rotation);
    }

    console.warn(`Unknown collider type: ${type}`);
    return null;
  }

  _buildFallbackGeometry() {
    const src = this.data.fallbackObjects || this.data.objects || [];
    console.log('🔨 Building fallback geometry (count):', src.length);

    const hasManualColliders = Array.isArray(this.data.colliders) && this.data.colliders.length > 0;
    const createPhysics = hasManualColliders;

    if (!createPhysics) {
      console.log('🖼️ No colliders in level data — fallback meshes will be visual-only');
    }

    for (const obj of src) {
      if (obj.type === 'box') {
        const geom = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
        const mat = new THREE.MeshStandardMaterial({ color: obj.color ?? 0x808080 });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(obj.position[0], obj.position[1], obj.position[2]);
        mesh.userData.type = 'box';
        if (!createPhysics) mesh.userData.visualOnly = true;

        this.scene.add(mesh);
        this.objects.push(mesh);

        if (createPhysics) {
          const body = this.physicsWorld.addStaticMesh(mesh);
          if (body) {
            this.physicsBodies.push(body);
            mesh.userData.physicsBody = body;
          }
        }
      }
      // TODO: support more primitive types if you add them to levelData
    }
  }

  /**
   * Ensure there's a basic ground if no physics bodies exist at all.
   * Prevents "fall forever" when GLTF has no colliders and fallback had none.
   */
  _ensureDefaultGround() {
    if (this.physicsBodies.length > 0) return;

    const size = 200;
    const groundGeom = new THREE.BoxGeometry(size, 2, size);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.position.set(0, -1, 0);
    ground.receiveShadow = true;
    ground.userData.type = 'auto-ground';

    this.scene.add(ground);
    this.objects.push(ground);

    const body = this.physicsWorld.addStaticMesh(ground, 'ground');
    if (body) {
      this.physicsBodies.push(body);
      ground.userData.physicsBody = body;
    }
    console.log('🟫 Added default ground collider (safety net)');
  }

  // ---------------------------------------------------------------------------
  // ENEMIES
  // ---------------------------------------------------------------------------
  _loadEnemies() {
    if (!Array.isArray(this.data.enemies) || this.data.enemies.length === 0) return;

    for (const ed of this.data.enemies) {
      try {
        const opts = { ...ed, game: this.game };
        this.enemyManager.spawn(ed.type, opts);
      } catch (e) {
        console.warn('Failed to spawn enemy', ed, e);
      }
    }
    console.log(`👾 Loaded ${this.data.enemies.length} enemies`);
  }

  _loadNpcs() {
    if (!Array.isArray(this.data.npcs) || this.data.npcs.length === 0) return;

    for (const nd of this.data.npcs) {
      try {
        const opts = { ...nd, game: this.game };
        this.npcManager.spawn(nd.type, opts);
      } catch (e) {
        console.warn('Failed to spawn NPC', nd, e);
      }
    }
    console.log(`🤖 Loaded ${this.data.npcs.length} NPCs`);
  }

  // ---------------------------------------------------------------------------
  // TICK
  // ---------------------------------------------------------------------------
  update(delta = 1 / 60, player = null, platforms = []) {
    if (this.enemyManager) {
      const plats = platforms && platforms.length ? platforms : this.getPlatforms();
      this.enemyManager.update(delta, player, plats);
    }
    if (this.npcManager) {
      const plats = platforms && platforms.length ? platforms : this.getPlatforms();
      this.npcManager.update(delta, player, plats);
    }
  }

  // For player collisions we prefer objects that actually have physics.
  getPlatforms() {
    const withBodies = this.objects.filter(o => o.userData?.physicsBody);
    if (withBodies.length > 0) return withBodies;
    // Fallback to all objects (safe)
    return this.objects;
  }

  toggleColliders(v) {
    this.showColliders = !!v;
    // Visual debug is owned by physics engine’s debug drawer.
  }

  // ---------------------------------------------------------------------------
  // CINEMATICS helpers (callable from Game)
  // ---------------------------------------------------------------------------
  triggerLevelStartCinematic(/* camera, player */) {
    if (this.cinematicsManager) this.cinematicsManager.playCinematic('onLevelStart');
  }
  triggerEnemyDefeatCinematic(/* camera, player */) {
    if (this.cinematicsManager) this.cinematicsManager.playCinematic('onEnemyDefeat');
  }
  triggerLevelCompleteCinematic(/* camera, player */) {
    if (this.cinematicsManager) this.cinematicsManager.playCinematic('onLevelComplete');
  }
  getCinematicsManager() { return this.cinematicsManager; }
  getEnemies() { return this.enemyManager ? this.enemyManager.enemies : []; }

  // ---------------------------------------------------------------------------
  // DISPOSE
  // ---------------------------------------------------------------------------
  dispose() {
    try {
      // Remove GLTF scene (first, in case contained meshes are also in objects)
      if (this.gltfScene) {
        this.scene.remove(this.gltfScene);
        this._disposeObject3DDeep(this.gltfScene);
        this.gltfScene = null;
      }

      // Remove visual objects
      for (const obj of this.objects) {
        this.scene.remove(obj);
        this._disposeObject3DDeep(obj);
      }
      this.objects = [];

      // Remove physics bodies
      for (const body of this.physicsBodies) {
        if (body) this.physicsWorld.removeBody(body);
      }
      this.physicsBodies = [];

      // Managers
      if (this.enemyManager) { this.enemyManager.dispose?.(); this.enemyManager = null; }
      if (this.npcManager) { this.npcManager.dispose?.(); this.npcManager = null; }
      if (this.cinematicsManager) { this.cinematicsManager.dispose?.(); this.cinematicsManager = null; }
    } catch (e) {
      console.warn('Level.dispose encountered an issue:', e);
    }
  }

  _disposeObject3DDeep(obj) {
    obj.traverse((n) => {
      if (n.isMesh) {
        if (n.geometry) n.geometry.dispose?.();
        if (n.material) {
          if (Array.isArray(n.material)) {
            n.material.forEach(m => m?.dispose?.());
          } else {
            n.material.dispose?.();
          }
        }
      }
    });
  }
}
