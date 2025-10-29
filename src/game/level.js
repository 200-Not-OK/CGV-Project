// src/game/level.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { EnemyManager } from './EnemyManager.js';
import { NpcManager } from './NpcManager.js';
import { loadGLTFModel } from './gltfLoader.js';
import { CinematicsManager } from './cinematicsManager.js';
import { Platform } from './components/Platform.js';
import { InteractiveObjectManager } from './InteractiveObjectManager.js';
import { PlaceableBlockManager } from './PlaceableBlockManager.js';
import { Level0Controller } from './levels/Level0Controller.js';

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
    this.platforms = [];      // Platform instances
    this.animatedMeshes = []; // Meshes with animations (rotating, moving, disappearing)
    this.gltfLoaded = false;
    this.gltfScene = null;

    this.enemyManager = new EnemyManager(this.scene, this.physicsWorld);
    this.npcManager = new NpcManager(this.scene, this.physicsWorld);
    this.interactiveObjectManager = new InteractiveObjectManager(this.scene, this.physicsWorld, null);
    this.placeableBlockManager = new PlaceableBlockManager(this.scene, this.physicsWorld);

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
    
    // 4.75) Platforms
    console.log('🟦 Loading platforms...');
    this._loadPlatforms();
    
    // 4.8) Interactive Objects
    console.log('🎯 Loading interactive objects...');
    await this._loadInteractiveObjects();

    // 4.9) Mesh Animations
    console.log('🎞️ Loading mesh animations...');
    await this._loadMeshAnimations();
    
    // 4.95) Placeable Blocks
    console.log('📦 Loading placeable blocks...');
    await this._loadPlaceableBlocks();

    // 5) Cinematics
    if (this.data.cinematics) {
      console.log('🎬 Loading cinematics...');
      this.cinematicsManager.loadCinematics(this.data.cinematics);
    }

    // 6) Level-specific controllers (e.g., Level0Controller)
    if (this.data.id === 'level0') {
      console.log('🎬 Initializing Level0Controller...');
      this.controller = new Level0Controller(this.game, this);
      // Start sequence after a brief delay to ensure everything is settled
      setTimeout(() => {
        if (this.controller) {
          this.controller.startSequence();
        }
      }, 500);
    }

    console.log(`✅ Level build complete. GLTF loaded: ${this.gltfLoaded}. Visual objects: ${this.objects.length}. Physics bodies: ${this.physicsBodies.length}. Platforms: ${this.platforms.length}`);
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
    // Log available mesh names for debugging
    console.log('🔍 Available meshes in GLTF:', meshesToProcess.slice(0, 30).map(m => m.name));
    
    // Tag visuals
    for (const mesh of meshesToProcess) {
      mesh.userData.type = 'gltf';
      this.objects.push(mesh);
    }

    // Build physics by definitions
    for (const def of this.data.colliders) {
      try {
        console.log(`  🎯 Creating manual collider: ${def.id || '(no-id)'} (type: ${def.type}, meshName: ${def.meshName || 'N/A'})`);
        const body = this._createPhysicsBodyFromDefinition(def, meshesToProcess);
        if (!body) {
          console.warn(`  ❌ Failed to create collider ${def.id}`);
          continue;
        }
        console.log(`  ✅ Successfully created collider ${def.id}`);
        
        // Check if this collider's mesh has an animation
        if (def.meshName && this.data.meshAnimations) {
          const hasAnimation = this.data.meshAnimations.some(
            anim => anim.meshName === def.meshName
          );
          
          if (hasAnimation) {
            // Make this body kinematic so it can be moved by animation
            body.type = CANNON.Body.KINEMATIC;
            console.log(`  ✓ Collider set to KINEMATIC for animated mesh: ${def.meshName}`);
          }
        }
        
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
          // Store mesh name on body for later lookup
          if (!body.userData) body.userData = {};
          body.userData.meshName = meshName;
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
      const body = this.physicsWorld.addStaticBox(pos, half, materialType, rotation);
      if (body && meshName) {
        // Store mesh name on body for later lookup
        if (!body.userData) body.userData = {};
        body.userData.meshName = meshName;
      }
      return body;
    }

    if (type === 'sphere') {
      const radius = size[0] || 1;
      const body = this.physicsWorld.addStaticSphere(pos, radius, materialType, rotation);
      if (body && meshName) {
        // Store mesh name on body for later lookup
        if (!body.userData) body.userData = {};
        body.userData.meshName = meshName;
      }
      return body;
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
  
  _loadPlatforms() {
    if (!Array.isArray(this.data.platforms) || this.data.platforms.length === 0) return;

    for (const platformData of this.data.platforms) {
      try {
        const platform = new Platform(platformData, this.scene, this.physicsWorld);
        this.platforms.push(platform);
      } catch (e) {
        console.warn('Failed to create platform', platformData, e);
      }
    }
    console.log(`🟦 Loaded ${this.platforms.length} platforms`);
  }
  
  async _loadInteractiveObjects() {
    if (!this.data.interactiveObjects || this.data.interactiveObjects.length === 0) {
      console.log('No interactive objects defined in level data');
      return;
    }
    
    try {
      await this.interactiveObjectManager.loadInteractiveObjects(this.data);
      console.log(`🎯 Loaded ${this.interactiveObjectManager.objects.size} interactive objects`);
    } catch (e) {
      console.warn('Failed to load interactive objects', e);
    }
  }

  async _loadMeshAnimations() {
    if (!this.data.meshAnimations || this.data.meshAnimations.length === 0) {
      console.log('No mesh animations defined in level data');
      return;
    }

    console.log(`Loading ${this.data.meshAnimations.length} mesh animations...`);

    for (const animData of this.data.meshAnimations) {
      const mesh = this._findMeshByName(animData.meshName);
      
      if (!mesh) {
        console.warn(`Mesh "${animData.meshName}" not found for animation`);
        continue;
      }

      // Find the corresponding physics body for this mesh
      const physicsBody = this._findPhysicsBodyForMesh(animData.meshName);

      // Store animation data on the mesh
      mesh.userData.animation = {
        type: animData.animationType,
        data: animData.data,
        time: 0,
        originalPosition: mesh.position.clone(),
        originalRotation: mesh.rotation.clone(),
        currentWaypoint: 0,
        physicsBody: physicsBody // Store reference to physics body
      };

      this.animatedMeshes.push(mesh);
      console.log(`✓ Loaded ${animData.animationType} animation for mesh: ${animData.meshName}`, 
                  physicsBody ? '(with physics body)' : '(no physics body)');
    }
  }
  
  async _loadPlaceableBlocks() {
    if (!this.data.placeableBlocks || this.data.placeableBlocks.length === 0) {
      console.log('No placeable blocks defined in level data');
      return;
    }
    
    try {
      await this.placeableBlockManager.loadBlocks(this.data);
    } catch (e) {
      console.warn('Failed to load placeable blocks', e);
    }
  }

  _findMeshByName(meshName) {
    let foundMesh = null;
    
    if (this.gltfScene) {
      this.gltfScene.traverse((child) => {
        if (child.name === meshName) {
          foundMesh = child;
        }
      });
    }
    
    return foundMesh;
  }

  _findPhysicsBodyForMesh(meshName) {
    // Search through all physics bodies to find one with matching meshName in userData
    for (const body of this.physicsWorld.world.bodies) {
      if (body.userData && body.userData.meshName === meshName) {
        return body;
      }
    }
    return null;
  }

  _updateAnimatedMeshes(delta) {
    this.animatedMeshes.forEach(mesh => {
      const anim = mesh.userData.animation;
      if (!anim) return;

      anim.time += delta;

      switch (anim.type) {
        case 'rotating':
          this._updateRotatingMesh(mesh, anim, delta);
          break;
        case 'moving':
          this._updateMovingMesh(mesh, anim, delta);
          break;
        case 'disappearing':
          this._updateDisappearingMesh(mesh, anim, delta);
          break;
      }
    });
  }

  _updateRotatingMesh(mesh, anim, delta) {
    const axis = anim.data.axis || [0, 1, 0];
    const speed = anim.data.speed || 1;
    
    // Rotate the visual mesh around the specified axis
    if (axis[0] !== 0) {
      mesh.rotation.x += speed * delta;
    }
    if (axis[1] !== 0) {
      mesh.rotation.y += speed * delta;
    }
    if (axis[2] !== 0) {
      mesh.rotation.z += speed * delta;
    }
    
    // Also rotate the physics body if it exists
    if (anim.physicsBody) {
      // Convert axis array to CANNON.Vec3
      const cannonAxis = new CANNON.Vec3(axis[0], axis[1], axis[2]);
      cannonAxis.normalize();
      
      // Create rotation quaternion
      const rotationQuat = new CANNON.Quaternion();
      rotationQuat.setFromAxisAngle(cannonAxis, speed * delta);
      
      // Apply rotation to body
      anim.physicsBody.quaternion = rotationQuat.mult(anim.physicsBody.quaternion);
      anim.physicsBody.quaternion.normalize();
    }
  }

  _updateMovingMesh(mesh, anim, delta) {
    const path = anim.data.path;
    const speed = anim.data.speed || 2;
    const loopBehavior = anim.data.loopBehavior || 'loop';
    
    if (!path || path.length < 2) return;

    const currentPoint = path[anim.currentWaypoint];
    let nextWaypointIndex;
    
    // Determine next waypoint based on loop behavior
    if (loopBehavior === 'pingpong') {
      if (!anim.direction) anim.direction = 1; // 1 = forward, -1 = backward
      
      nextWaypointIndex = anim.currentWaypoint + anim.direction;
      
      // Check if we've reached an endpoint
      if (nextWaypointIndex >= path.length) {
        anim.direction = -1; // Reverse direction
        nextWaypointIndex = path.length - 2;
      } else if (nextWaypointIndex < 0) {
        anim.direction = 1; // Reverse direction
        nextWaypointIndex = 1;
      }
    } else if (loopBehavior === 'once') {
      nextWaypointIndex = anim.currentWaypoint + 1;
      
      // Stop at the last waypoint
      if (nextWaypointIndex >= path.length) {
        const finalPos = path[path.length - 1];
        mesh.position.set(finalPos[0], finalPos[1], finalPos[2]);
        
        // Also set physics body to final position
        if (anim.physicsBody) {
          anim.physicsBody.position.set(finalPos[0], finalPos[1], finalPos[2]);
          anim.physicsBody.velocity.set(0, 0, 0);
        }
        return; // Don't continue moving
      }
    } else { // default: 'loop'
      nextWaypointIndex = (anim.currentWaypoint + 1) % path.length;
    }
    
    const nextPoint = path[nextWaypointIndex];

    // Calculate direction to next waypoint
    const targetPos = new THREE.Vector3(nextPoint[0], nextPoint[1], nextPoint[2]);
    const currentPos = mesh.position.clone();
    const direction = new THREE.Vector3().subVectors(targetPos, currentPos);
    const distance = direction.length();

    if (distance < 0.1) {
      // Reached waypoint, move to next
      anim.currentWaypoint = nextWaypointIndex;
      
      // Stop velocity when reaching waypoint
      if (anim.physicsBody) {
        anim.physicsBody.velocity.set(0, 0, 0);
      }
    } else {
      // Move towards waypoint
      direction.normalize();
      const moveAmount = speed * delta;
      const movement = direction.clone().multiplyScalar(moveAmount);
      
      // Move visual mesh
      mesh.position.add(movement);
      
      // Move physics body (if exists) with velocity for proper physics interaction
      if (anim.physicsBody) {
        // Set body type to kinematic if not already
        if (anim.physicsBody.type !== CANNON.Body.KINEMATIC) {
          anim.physicsBody.type = CANNON.Body.KINEMATIC;
        }
        
        // Calculate velocity vector for physics
        const velocityVec = new CANNON.Vec3(
          direction.x * speed,
          direction.y * speed,
          direction.z * speed
        );
        
        // Set velocity (for carrying objects on top)
        anim.physicsBody.velocity.copy(velocityVec);
        
        // Also update position directly
        anim.physicsBody.position.copy(mesh.position);
      }
    }
  }

  _updateDisappearingMesh(mesh, anim, delta) {
    const visibleDuration = anim.data.visibleInterval || 3;
    const invisibleDuration = anim.data.invisibleDuration || 2;
    const cycleDuration = visibleDuration + invisibleDuration;
    
    const phase = anim.time % cycleDuration;
    
    if (phase < visibleDuration) {
      // Visible phase
      mesh.visible = true;
      
      // Enable physics collisions
      if (anim.physicsBody) {
        anim.physicsBody.collisionResponse = true;
      }
    } else {
      // Invisible phase
      mesh.visible = false;
      
      // Disable physics collisions (objects will fall through)
      if (anim.physicsBody) {
        anim.physicsBody.collisionResponse = false;
      }
    }
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
    
    // Update platforms
    if (this.platforms && this.platforms.length > 0) {
      for (const platform of this.platforms) {
        platform.update(delta);
      }
    }
    
    // Update interactive objects
    if (this.interactiveObjectManager) {
      this.interactiveObjectManager.update(delta);
    }
    
    // Update animated meshes
    this._updateAnimatedMeshes(delta);
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

      // Clear animated meshes
      this.animatedMeshes = [];

      // Managers
      if (this.enemyManager) { this.enemyManager.dispose?.(); this.enemyManager = null; }
      if (this.npcManager) { this.npcManager.dispose?.(); this.npcManager = null; }
      if (this.cinematicsManager) { this.cinematicsManager.dispose?.(); this.cinematicsManager = null; }
      if (this.interactiveObjectManager) { this.interactiveObjectManager.dispose?.(); this.interactiveObjectManager = null; }
      if (this.placeableBlockManager) { this.placeableBlockManager.dispose?.(); this.placeableBlockManager = null; }
      
      // Level-specific controllers
      if (this.controller) { this.controller.dispose?.(); this.controller = null; }
      
      // Platforms
      if (this.platforms && this.platforms.length > 0) {
        for (const platform of this.platforms) {
          platform.destroy();
        }
        this.platforms = [];
      }
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