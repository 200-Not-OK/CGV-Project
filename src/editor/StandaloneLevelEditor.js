import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { YellowBot } from '../game/npc/YellowBot.js';

// Standalone Level Editor - Focused on Enemies, Patrol Points, and Lighting
// Features:
// - Load levels from levelData.js with GLTF geometry
// - Edit enemies, patrol points, and lighting only
// - Save changes back to levelData.js
// - Level switching within editor

export class StandaloneLevelEditor {
  constructor(container, statusElement) {
    this.container = container;
    this.statusElement = statusElement;
    
    // Initialize THREE.js scene
    this._initScene();
    
    // Editor state
    this.mode = 'select'; // enemy | light | patrol | collider | mesh | select
    this.enabled = true;
    
    // Level management
    this.levels = [];
    this.currentLevelIndex = 0;
    this.currentLevel = null;
    this.levelGeometry = new THREE.Group(); // Holds GLTF geometry
    this.scene.add(this.levelGeometry);
    
    // Data storage (current level's editable data)
    this.enemies = [];
    this.npcs = [];
    this.lights = [];
    this.patrolPoints = [];
    this.colliders = []; // Manual colliders
    this.levelMeshes = []; // Individual meshes from GLTF for selection
    this.platforms = []; // Platform objects
    this.interactiveObjects = []; // Interactive objects (pressure plates, etc.)
    this.triggers = []; // Trigger connections between interactive objects
    this.meshAnimations = []; // Animations for GLTF meshes
    this.placeableBlocks = []; // Placeable blocks that players can interact with
    
    // Visual representations
    this.enemyMeshes = [];
    this.npcMeshes = [];
    this.lightMeshes = [];
    this.patrolPointMeshes = [];
    this.patrolConnections = []; // Lines showing patrol routes
    this.colliderMeshes = []; // Visual representations of colliders
    this.meshOutlines = []; // Outline materials for mesh selection
    this.platformMeshes = []; // Visual representations of platforms
    this.platformPathLines = []; // Lines showing platform movement paths
    this.platformTextures = {}; // Cache for loaded textures
    this.interactiveObjectMeshes = []; // Visual representations of interactive objects
    this.triggerConnectionLines = []; // Visual lines showing trigger connections
    this.placeableBlockMeshes = []; // Visual representations of placeable blocks
    
    // Selection system
    this.selected = null;
    this.selectedType = null;
    this.selectedMesh = null; // Currently selected GLTF mesh
    
    // Interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Input state
    this.keys = {};
    this.mouseDown = false;
    this.isRotating = false;
    this.mouseDelta = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    
    // Waypoint and mesh animation modes
    this.addingWaypoint = false;
    this.addingMeshWaypoint = false;
    
    // ID counter
    this.nextId = 1;
    
    // GLTF Loader
    this.gltfLoader = new GLTFLoader();
    
    // Enemy and Light types
    this.enemyTypes = ['walker', 'runner', 'jumper', 'flyer', 'snake', 'snake_boss', 'mech_boss', 'crawler'];
    this.npcTypes = ['yellow_bot', 'other_bot']; // NPCs (non-player characters)
    this.lightTypes = ['BasicLights', 'PointPulse', 'HemisphereFill'];
    this.colliderTypes = ['box', 'sphere', 'capsule'];
    this.materialTypes = ['ground', 'wall', 'platform'];
    
    // Platform types
    this.platformTypes = ['static', 'moving', 'rotating', 'disappearing'];
    this.textureTypes = ['wood', 'metal', 'stone', 'ice', 'custom'];
    this.textureUrls = {
      wood: 'assets/textures/wood.jpg',
      metal: 'assets/textures/metal.jpg',
      stone: 'assets/textures/stone.jpg',
      ice: 'assets/textures/ice.jpg'
    };
    
    // Block colors for placeable blocks
    this.blockColors = {
      red: 0xff4444,
      blue: 0x4444ff,
      green: 0x44ff44,
      yellow: 0xffff44,
      purple: 0xff44ff,
      orange: 0xff8844,
      cyan: 0x44ffff
    };
    
    // Interactive object types
    this.interactiveObjectTypes = ['pressurePlate', 'gltfPlatform'];
    this.physicsTypes = ['box', 'trimesh', 'convex'];
    this.triggerTypes = ['activate', 'deactivate', 'toggle', 'custom'];
    
    // Store bound event handlers for proper cleanup
    this.boundEventHandlers = {
      mousedown: this._onMouseDown.bind(this),
      mousemove: this._onMouseMove.bind(this),
      mouseup: this._onMouseUp.bind(this),
      wheel: this._onMouseWheel.bind(this),
      contextmenu: (e) => e.preventDefault(),
      keydown: this._onKeyDown.bind(this),
      keyup: this._onKeyUp.bind(this),
      resize: this._onWindowResize.bind(this)
    };
    
    // Create UI and bind events
    this._createUI();
    this._bindEvents();
    this._addBasicLighting();

    // Track if events are bound to prevent duplicates
    this.eventsBound = true;
    
    // Load levels and initialize
    this._loadLevels();
  }
  
  _initScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Camera controls (manual WASD + mouse look)
    const lookDirection = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), this.camera.position).normalize();
    this.cameraYaw = Math.atan2(lookDirection.x, lookDirection.z);
    this.cameraPitch = Math.asin(THREE.MathUtils.clamp(lookDirection.y, -1, 1));
    this.sensitivity = 0.004;
    this.moveSpeed = 20;
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x87CEEB);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    // Ground plane for raycasting
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      transparent: true, 
      opacity: 0,
      side: THREE.DoubleSide 
    });
    this.groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    this.groundPlane.name = 'groundPlane';
    this.scene.add(this.groundPlane);
  }
  
  _addBasicLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(ambientLight);
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    this.scene.add(directionalLight);
  }
  
  async _loadLevels() {
    try {
      // Import levelData.js dynamically
      const levelModule = await import('../game/levelData.js');
      this.levels = levelModule.levels;
      
      if (this.levels.length > 0) {
        await this._loadLevel(0);
      }
      
      this._updateStatus();
    } catch (error) {
      console.error('Failed to load levels:', error);
      this._updateStatus('Failed to load levels');
    }
  }
  
  async _loadLevel(index) {
    if (index < 0 || index >= this.levels.length) return;
    
    this.currentLevelIndex = index;
    this.currentLevel = this.levels[index];
    
    // Clear previous level data
    this._clearLevel();
    
    // Load GLTF geometry if available
    if (this.currentLevel.gltfUrl) {
      try {
        await this._loadLevelGeometry(this.currentLevel.gltfUrl);
      } catch (error) {
        console.warn('Failed to load GLTF geometry, using fallback:', error);
        this._loadFallbackGeometry();
      }
    } else {
      this._loadFallbackGeometry();
    }
    
    // Load editable data
    this._loadEditableData();
    
    // Position camera to look at the level geometry
    this._positionCameraForLevel();
    
    // Update UI to reflect the new level
    this._updateUI();
    
    this._updateStatus();
  }
  
  _clearLevel() {
    // Don't unbind canvas/keyboard events - we need them to remain active!
    // Only clear the level geometry and data

    // Clear geometry and dispose of materials/geometries
    while (this.levelGeometry.children.length > 0) {
      const child = this.levelGeometry.children[0];

      // Dispose of all meshes in the GLTF scene
      child.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(material => material.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });

      this.levelGeometry.remove(child);
    }

    // Clear visual representations
    this._clearVisualRepresentations();

    // Clear data arrays
    this.enemies = [];
    this.npcs = [];
    this.lights = [];
    this.patrolPoints = [];
    this.colliders = [];
    this.levelMeshes = [];
    this.platforms = [];
    this.interactiveObjects = [];
    this.triggers = [];
    this.placeableBlocks = [];

    this.selected = null;
    this.selectedType = null;
    this.selectedMesh = null;
  }
  
  _clearVisualRepresentations() {
    // Remove and dispose enemy meshes
    this.enemyMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(material => material.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.enemyMeshes = [];

    // Remove and dispose NPC meshes
    this.npcMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(material => material.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.npcMeshes = [];

    // Remove and dispose light meshes
    this.lightMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(material => material.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.lightMeshes = [];

    // Remove and dispose patrol point meshes
    this.patrolPointMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(material => material.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.patrolPointMeshes = [];

    // Remove and dispose patrol connections
    this.patrolConnections.forEach(line => {
      this.scene.remove(line);
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
    this.patrolConnections = [];

    // Remove and dispose collider meshes
    this.colliderMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(material => material.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.colliderMeshes = [];

    // Remove and dispose mesh outlines
    this.meshOutlines.forEach(outline => {
      this.scene.remove(outline);
      if (outline.geometry) outline.geometry.dispose();
      if (outline.material) outline.material.dispose();
    });
    this.meshOutlines = [];
    
    // Remove and dispose platform meshes
    this.platformMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.platformMeshes = [];
    
    // Remove and dispose platform path lines
    this.platformPathLines.forEach(line => {
      this.scene.remove(line);
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
    this.platformPathLines = [];
    
    // Remove and dispose interactive object meshes
    this.interactiveObjectMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.interactiveObjectMeshes = [];
    
    // Remove and dispose placeable block meshes
    this.placeableBlockMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
    });
    this.placeableBlockMeshes = [];
    
    // Remove and dispose trigger connection lines
    this.triggerConnectionLines.forEach(line => {
      this.scene.remove(line);
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
    this.triggerConnectionLines = [];
  }

  _createVisualRepresentations() {
    // Create visuals based on current mode
    switch (this.mode) {
      case 'enemy':
        this._createEnemyVisuals();
        break;
      case 'npc':
        this._createNpcVisuals();
        break;
      case 'light':
        this._createLightVisuals();
        break;
      case 'patrol':
        this._createPatrolPointVisuals();
        this._createPatrolConnections();
        break;
      case 'collider':
        this._createColliderVisuals();
        break;
      case 'platform':
        this._createPlatformVisuals();
        break;
      case 'interactive':
        this._createInteractiveObjectVisuals();
        this._createTriggerConnectionVisuals();
        break;
      case 'block':
        this._createPlaceableBlockVisuals();
        break;
      case 'mesh':
        // Mesh selection doesn't need visuals, just highlighting
        break;
      case 'select':
        // Show all visuals in select mode
        this._createEnemyVisuals();
        this._createNpcVisuals();
        this._createLightVisuals();
        this._createPatrolPointVisuals();
        this._createPatrolConnections();
        this._createColliderVisuals();
        this._createPlatformVisuals();
        this._createInteractiveObjectVisuals();
        this._createTriggerConnectionVisuals();
        this._createPlaceableBlockVisuals();
        break;
    }
  }
  
  async _loadLevelGeometry(gltfUrl) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        gltfUrl,
        (gltf) => {
          this.levelGeometry.add(gltf.scene);
          
          // Extract individual meshes for selection
          this.levelMeshes = [];
          
          // Set up meshes with original materials and textures
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Add to selectable meshes array
              this.levelMeshes.push({
                mesh: child,
                name: child.name || 'Unnamed Mesh',
                originalMaterial: child.material.clone ? child.material.clone() : child.material
              });
              
              // Add interaction capabilities
              child.userData.type = 'levelMesh';
              child.userData.selectable = true;
              
              // Only make collision objects slightly transparent, keep original materials
              if (child.name.toLowerCase().includes('collision') || 
                  child.name.toLowerCase().includes('collider')) {
                // Clone the original material and make it slightly transparent
                if (child.material) {
                  child.material = child.material.clone();
                  child.material.transparent = true;
                  child.material.opacity = 0.7; // Less transparent than before
                }
              }
              // All other meshes keep their original materials and textures
            }
          });
          
          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }
  
  _loadFallbackGeometry() {
    if (!this.currentLevel.fallbackObjects) return;
    
    this.currentLevel.fallbackObjects.forEach(obj => {
      let geometry, material, mesh;
      
      switch (obj.type) {
        case 'box':
          geometry = new THREE.BoxGeometry(obj.size[0], obj.size[1], obj.size[2]);
          material = new THREE.MeshLambertMaterial({ color: obj.color || 0x888888 });
          mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(obj.position[0], obj.position[1], obj.position[2]);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.levelGeometry.add(mesh);
          break;
      }
    });
  }
  
  _loadEditableData() {
    // Load enemies
    if (this.currentLevel.enemies) {
      this.enemies = [...this.currentLevel.enemies];
      this._createEnemyVisuals();
    }
    
    // Load NPCs
    if (this.currentLevel.npcs) {
      this.npcs = [...this.currentLevel.npcs];
      this._createNpcVisuals();
    }
    
    // Load lights
    if (this.currentLevel.lights) {
      this.lights = this.currentLevel.lights.map(lightType => ({
        type: lightType,
        position: [0, 5, 0], // Default position
        id: this.nextId++
      }));
      this._createLightVisuals();
    }
    
    // Load colliders
    if (this.currentLevel.colliders) {
      this.colliders = [...this.currentLevel.colliders];
      this._createColliderVisuals();
    }
    
    // Load platforms
    if (this.currentLevel.platforms) {
      this.platforms = [...this.currentLevel.platforms];
      this._createPlatformVisuals();
    }
    
    // Load interactive objects
    if (this.currentLevel.interactiveObjects) {
      this.interactiveObjects = [...this.currentLevel.interactiveObjects];
      this._createInteractiveObjectVisuals();
    }
    
    // Load triggers
    if (this.currentLevel.triggers) {
      this.triggers = [...this.currentLevel.triggers];
      this._createTriggerConnectionVisuals();
    }
    
    // Load mesh animations
    if (this.currentLevel.meshAnimations) {
      this.meshAnimations = [...this.currentLevel.meshAnimations];
      console.log('Loaded mesh animations:', this.meshAnimations);
    }
    
    // Load placeable blocks
    if (this.currentLevel.placeableBlocks) {
      this.placeableBlocks = [...this.currentLevel.placeableBlocks];
      this._createPlaceableBlockVisuals();
    }
    
    // Extract patrol points from enemies and NPCs
    this._extractPatrolPoints();
    this._createPatrolPointVisuals();
    this._createPatrolConnections();
  }
  
  _positionCameraForLevel() {
    // Calculate bounding box of the level geometry
    const boundingBox = new THREE.Box3();
    
    if (this.levelGeometry.children.length > 0) {
      // Calculate bounds from level geometry
      boundingBox.setFromObject(this.levelGeometry);
    } else {
      // Fallback: use start position if available
      if (this.currentLevel.startPosition) {
        const startPos = this.currentLevel.startPosition;
        boundingBox.setFromPoints([
          new THREE.Vector3(startPos[0] - 25, startPos[1] - 5, startPos[2] - 25),
          new THREE.Vector3(startPos[0] + 25, startPos[1] + 20, startPos[2] + 25)
        ]);
      } else {
        // Default fallback bounds
        boundingBox.setFromPoints([
          new THREE.Vector3(-25, -5, -25),
          new THREE.Vector3(25, 20, 25)
        ]);
      }
    }
    
    // Get the center and size of the bounding box
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    
    // Calculate appropriate camera distance based on level size
    const maxDimension = Math.max(size.x, size.y, size.z);
    const distance = maxDimension * 1.5; // Adjust multiplier as needed
    
    // Position camera at an angle that provides a good overview
    const cameraOffset = new THREE.Vector3(
      distance * 0.7,  // X offset (right side)
      distance * 0.8,  // Y offset (above)
      distance * 0.7   // Z offset (forward)
    );
    
    // Set camera position
    this.camera.position.copy(center).add(cameraOffset);
    this.camera.lookAt(center);
    
    // Extract yaw and pitch from the camera's actual rotation after lookAt()
    const euler = new THREE.Euler().setFromQuaternion(this.camera.quaternion, 'YXZ');
    this.cameraYaw = euler.y;
    this.cameraPitch = euler.x;
    
    console.log(`Camera positioned at: ${this.camera.position.toArray().map(v => v.toFixed(1)).join(', ')}`);
    console.log(`Looking at level center: ${center.toArray().map(v => v.toFixed(1)).join(', ')}`);
    console.log(`Level bounds: ${size.toArray().map(v => v.toFixed(1)).join(', ')}`);
  }
  
  _extractPatrolPoints() {
    this.patrolPoints = [];
    
    this.enemies.forEach((enemy, enemyIndex) => {
      if (enemy.patrolPoints) {
        enemy.patrolPoints.forEach((point, pointIndex) => {
          this.patrolPoints.push({
            position: [point[0], point[1], point[2]],
            waitTime: point[3] || 0.5,
            enemyIndex: enemyIndex,
            pointIndex: pointIndex,
            entityType: 'enemy',
            id: this.nextId++
          });
        });
      }
    });

    this.npcs.forEach((npc, npcIndex) => {
      if (npc.patrolPoints) {
        npc.patrolPoints.forEach((point, pointIndex) => {
          this.patrolPoints.push({
            position: [point[0], point[1], point[2]],
            waitTime: point[3] || 0.5,
            npcIndex: npcIndex,
            pointIndex: pointIndex,
            entityType: 'npc',
            id: this.nextId++
          });
        });
      }
    });
  }
  
  _createEnemyVisuals() {
    try {
      // Clear existing enemy visuals first
      this.enemyMeshes.forEach(mesh => this.scene.remove(mesh));
      this.enemyMeshes = [];
    
    this.enemies.forEach((enemy, index) => {
      const geometry = new THREE.BoxGeometry(1, 1.5, 1);
      const material = new THREE.MeshLambertMaterial({ 
        color: this._getEnemyColor(enemy.type) 
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(enemy.position[0], enemy.position[1], enemy.position[2]);
      mesh.userData = { type: 'enemy', index: index, enemyData: enemy };
      mesh.name = `enemy_${index}`;

      this.scene.add(mesh);
      this.enemyMeshes.push(mesh);
    });
    } catch (error) {
      console.error('Error creating enemy visuals:', error);
    }
  }

  _createNpcVisuals() {
    try {
      // Clear existing NPC visuals first
      this.npcMeshes.forEach(mesh => this.scene.remove(mesh));
      this.npcMeshes = [];
    
    this.npcs.forEach((npc, index) => {
      const geometry = new THREE.SphereGeometry(0.6, 8, 8);
      const material = new THREE.MeshLambertMaterial({ 
        color: 0xffff00, // Yellow for NPCs
        emissive: 0x444400,
        transparent: true,
        opacity: 0.85
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(npc.position[0], npc.position[1], npc.position[2]);
      mesh.userData = { type: 'npc', index: index, npcData: npc };
      mesh.name = `npc_${index}`;

      this.scene.add(mesh);
      this.npcMeshes.push(mesh);
    });
    } catch (error) {
      console.error('Error creating NPC visuals:', error);
    }
  }
  
  _createLightVisuals() {
    // Clear existing light visuals first
    this.lightMeshes.forEach(mesh => this.scene.remove(mesh));
    this.lightMeshes = [];
    
    this.lights.forEach((light, index) => {
      const geometry = new THREE.SphereGeometry(0.5, 8, 6);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffff00,
        transparent: true,
        opacity: 0.7
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(light.position[0], light.position[1], light.position[2]);
      mesh.userData = { type: 'light', index: index, lightData: light };
      mesh.name = `light_${index}`;
      
      this.scene.add(mesh);
      this.lightMeshes.push(mesh);
    });
  }
  
  _createColliderVisuals() {
    // Clear existing collider visuals first
    this.colliderMeshes.forEach(mesh => this.scene.remove(mesh));
    this.colliderMeshes = [];
    
    this.colliders.forEach((collider, index) => {
      // Skip mesh-type colliders - they don't have position/size, they reference GLTF meshes
      if (collider.type === 'mesh') {
        return; // Skip visualization for Trimesh colliders
      }
      
      // Ensure position exists for non-mesh colliders
      if (!collider.position) {
        console.warn('Collider missing position:', collider);
        return;
      }
      
      let geometry;
      
      // Create geometry based on collider type
      if (collider.type === 'box') {
        geometry = new THREE.BoxGeometry(collider.size[0], collider.size[1], collider.size[2]);
      } else if (collider.type === 'sphere') {
        geometry = new THREE.SphereGeometry(collider.size[0], 16, 12);
      } else if (collider.type === 'capsule') {
        geometry = new THREE.CylinderGeometry(collider.size[0], collider.size[0], collider.size[1], 16);
      } else {
        // Default to box
        geometry = new THREE.BoxGeometry(1, 1, 1);
      }
      
      // Color by material type
      const materialColors = {
        ground: 0x00ff00,  // Green
        wall: 0xff0000,    // Red
        platform: 0x0000ff // Blue
      };
      
      const material = new THREE.MeshBasicMaterial({ 
        color: materialColors[collider.materialType] || 0x888888,
        transparent: true,
        opacity: 0.3,
        wireframe: true
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(collider.position[0], collider.position[1], collider.position[2]);
      mesh.userData = { type: 'collider', index: index, colliderData: collider };
      mesh.name = `collider_${index}`;
      
      this.scene.add(mesh);
      this.colliderMeshes.push(mesh);
    });
  }
  
  _highlightSelectedMesh(mesh) {
    // Clear existing highlights
    this.meshOutlines.forEach(outline => this.scene.remove(outline));
    this.meshOutlines = [];
    
    if (!mesh) return;
    
    // Create wireframe outline for selected mesh
    const geometry = mesh.geometry.clone();
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    
    const outline = new THREE.Mesh(geometry, material);
    outline.position.copy(mesh.position);
    outline.rotation.copy(mesh.rotation);
    outline.scale.copy(mesh.scale);
    outline.scale.multiplyScalar(1.01); // Slightly larger to show outline
    
    this.scene.add(outline);
    this.meshOutlines.push(outline);
  }
  
  _createPatrolPointVisuals() {
    // Clear existing patrol point visuals first
    this.patrolPointMeshes.forEach(mesh => this.scene.remove(mesh));
    this.patrolPointMeshes = [];
    
    this.patrolPoints.forEach((point, index) => {
      const geometry = new THREE.SphereGeometry(0.3, 8, 6);
      const material = new THREE.MeshLambertMaterial({ 
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(point.position[0], point.position[1], point.position[2]);
      mesh.userData = { type: 'patrol', index: index, patrolData: point };
      mesh.name = `patrol_${index}`;
      
      this.scene.add(mesh);
      this.patrolPointMeshes.push(mesh);
    });
  }
  
  _createPatrolConnections() {
    // Clear existing patrol connections first
    this.patrolConnections.forEach(line => this.scene.remove(line));
    this.patrolConnections = [];
    
    // Group patrol points by enemy
    const enemyPatrolGroups = {};
    this.patrolPoints.forEach(point => {
      if (!enemyPatrolGroups[point.enemyIndex]) {
        enemyPatrolGroups[point.enemyIndex] = [];
      }
      enemyPatrolGroups[point.enemyIndex].push(point);
    });
    
    // Create lines between consecutive patrol points for each enemy
    Object.values(enemyPatrolGroups).forEach(group => {
      if (group.length < 2) return;
      
      group.sort((a, b) => a.pointIndex - b.pointIndex);
      
      for (let i = 0; i < group.length - 1; i++) {
        const start = group[i].position;
        const end = group[i + 1].position;
        
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(start[0], start[1], start[2]),
          new THREE.Vector3(end[0], end[1], end[2])
        ]);
        
        const material = new THREE.LineBasicMaterial({ 
          color: 0xff00ff,
          transparent: true,
          opacity: 0.6
        });
        
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.patrolConnections.push(line);
      }
    });
  }
  
  _getEnemyColor(type) {
    const colors = {
      walker: 0xff0000,    // Red
      runner: 0x00ff00,    // Green
      jumper: 0x0000ff,    // Blue
      flyer: 0xffff00,     // Yellow
      snake: 0x00ff88,   // Cyan-green
      crawler: 0xff8800   // Orange
    };
    return colors[type] || 0x888888;
  }
  
  _createPlatformVisuals() {
    // Clear existing platform visuals first
    this.platformMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    this.platformMeshes = [];
    
    // Clear existing platform path lines
    this.platformPathLines.forEach(line => {
      this.scene.remove(line);
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
    this.platformPathLines = [];
    
    this.platforms.forEach((platform, index) => {
      const geometry = new THREE.BoxGeometry(
        platform.size[0],
        platform.size[1],
        platform.size[2]
      );
      
      // Load or create material with texture
      const material = this._createPlatformMaterial(platform);
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...platform.position);
      mesh.rotation.set(...platform.rotation);
      
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { type: 'platform', index, platformData: platform };
      mesh.name = `platform_${index}`;
      
      // Add wireframe outline for visibility in editor
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
      );
      mesh.add(line);
      
      // Show animation path for moving platforms
      if (platform.type === 'moving' && platform.animation?.path && platform.animation.path.length > 1) {
        this._createPathVisualization(platform.animation.path);
      }
      
      this.scene.add(mesh);
      this.platformMeshes.push(mesh);
    });
  }
  
  _createPlatformMaterial(platform) {
    const textureLoader = new THREE.TextureLoader();
    
    const textureUrl = platform.texture === 'custom' 
      ? platform.textureUrl 
      : this.textureUrls[platform.texture];
    
    if (textureUrl) {
      // Use cached texture or load new
      if (!this.platformTextures[textureUrl]) {
        const texture = textureLoader.load(textureUrl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(platform.textureRepeat[0], platform.textureRepeat[1]);
        this.platformTextures[textureUrl] = texture;
      }
      
      return new THREE.MeshStandardMaterial({
        map: this.platformTextures[textureUrl],
        roughness: 0.8,
        metalness: platform.texture === 'metal' ? 0.6 : 0.2
      });
    }
    
    // Fallback to color
    return new THREE.MeshLambertMaterial({ color: platform.color || 0x888888 });
  }
  
  _createPathVisualization(path) {
    const points = path.map(p => new THREE.Vector3(p[0], p[1], p[2]));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
      color: 0xff00ff,
      dashSize: 0.5,
      gapSize: 0.3
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    this.scene.add(line);
    this.platformPathLines.push(line);
  }
  
  _createUI() {
    // Create side panel
    const panel = document.createElement('div');
    panel.id = 'editor-panel';
    panel.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 300px;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 20px;
      font-family: monospace;
      font-size: 12px;
      overflow-y: auto;
      z-index: 1000;
      box-sizing: border-box;
    `;
    
    // Prevent right-click context menu on UI panel
    panel.addEventListener('contextmenu', (e) => e.preventDefault());
    
    document.body.appendChild(panel);
    this.panel = panel;
    
    this._updateUI();
  }
  
  _updateUI() {
    if (!this.panel) return;
    
    console.log('_updateUI called, mode:', this.mode, 'selectedMesh:', this.selectedMesh);
    
    const levelSelect = this.levels.map((level, index) => 
      `<option value="${index}" ${index === this.currentLevelIndex ? 'selected' : ''}>${level.name}</option>`
    ).join('');
    
    const enemyTypeOptions = this.enemyTypes.map(type => 
      `<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
    ).join('');
    
    const lightTypeOptions = this.lightTypes.map(type => 
      `<option value="${type}">${type}</option>`
    ).join('');
    
    const colliderTypeOptions = this.colliderTypes.map(type => 
      `<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
    ).join('');
    
    const materialTypeOptions = this.materialTypes.map(type => 
      `<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
    ).join('');
    
    this.panel.innerHTML = `
      <h3>Level Editor</h3>
      
      <div style="margin-bottom: 20px;">
        <label>Current Level:</label><br>
        <select id="level-select" style="width: 100%; padding: 5px;">
          ${levelSelect}
        </select>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label>Edit Mode:</label><br>
        <button id="mode-enemy" class="mode-btn ${this.mode === 'enemy' ? 'active' : ''}">Enemies</button>
        <button id="mode-npc" class="mode-btn ${this.mode === 'npc' ? 'active' : ''}">NPCs</button>
        <button id="mode-light" class="mode-btn ${this.mode === 'light' ? 'active' : ''}">Lights</button>
        <button id="mode-patrol" class="mode-btn ${this.mode === 'patrol' ? 'active' : ''}">Patrol</button>
        <button id="mode-platform" class="mode-btn ${this.mode === 'platform' ? 'active' : ''}">Platforms</button>
        <button id="mode-interactive" class="mode-btn ${this.mode === 'interactive' ? 'active' : ''}">Interactive</button>
        <button id="mode-block" class="mode-btn ${this.mode === 'block' ? 'active' : ''}">Blocks</button>
        <button id="mode-mesh" class="mode-btn ${this.mode === 'mesh' ? 'active' : ''}">Meshes</button>
        <button id="mode-collider" class="mode-btn ${this.mode === 'collider' ? 'active' : ''}">Colliders</button>
        <button id="mode-select" class="mode-btn ${this.mode === 'select' ? 'active' : ''}">Select</button>
      </div>
      
      <div id="enemy-controls" style="display: ${this.mode === 'enemy' ? 'block' : 'none'};">
        <h4>Enemy Controls</h4>
        <label>Type:</label><br>
        <select id="enemy-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          ${enemyTypeOptions}
        </select>
        <button id="add-enemy" style="width: 100%; padding: 5px;">Add Enemy (Click on level)</button>
        
        <div id="enemy-list">
          <h5>Enemies (${this.enemies.length})</h5>
          ${this.enemies.map((enemy, index) => `
            <div class="item-row" data-type="enemy" data-index="${index}">
              <strong>${enemy.type}</strong> at [${enemy.position.join(', ')}]
              <button onclick="window.editor._deleteEnemy(${index})">Delete</button>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div id="npc-controls" style="display: ${this.mode === 'npc' ? 'block' : 'none'};">
        <h4>NPC Controls</h4>
        <label>Type:</label><br>
        <select id="npc-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          ${this.npcTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
        </select>
        <button id="add-npc" style="width: 100%; padding: 5px;">Add NPC (Click on level)</button>
        
        <div id="npc-list">
          <h5>NPCs (${this.npcs.length})</h5>
          ${this.npcs.map((npc, index) => `
            <div class="item-row" data-type="npc" data-index="${index}">
              <strong>${npc.type}</strong> at [${npc.position.join(', ')}]
              <button onclick="window.editor._deleteNpc(${index})">Delete</button>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div id="light-controls" style="display: ${this.mode === 'light' ? 'block' : 'none'};">
        <h4>Light Controls</h4>
        <label>Type:</label><br>
        <select id="light-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          ${lightTypeOptions}
        </select>
        <button id="add-light" style="width: 100%; padding: 5px;">Add Light (Click on level)</button>
        
        <div id="light-list">
          <h5>Lights (${this.lights.length})</h5>
          ${this.lights.map((light, index) => `
            <div class="item-row" data-type="light" data-index="${index}">
              <strong>${light.type}</strong> at [${light.position.join(', ')}]
              <button onclick="window.editor._deleteLight(${index})">Delete</button>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div id="block-controls" style="display: ${this.mode === 'block' ? 'block' : 'none'};">
        <h4>Placeable Block Controls</h4>
        <p style="font-size: 10px; color: #aaa; margin: 5px 0;">
          💡 These blocks can be picked up, moved, and placed by the player
        </p>
        
        <label>Block Color:</label><br>
        <select id="block-color" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          ${Object.keys(this.blockColors).map(color => 
            `<option value="${color}">${color.charAt(0).toUpperCase() + color.slice(1)}</option>`
          ).join('')}
        </select>
        
        <h5>Size</h5>
        <label>Width:</label>
        <input type="number" id="block-width" value="1" step="0.1" min="0.1" style="width: 100%; padding: 5px; margin-bottom: 5px;">
        <label>Height:</label>
        <input type="number" id="block-height" value="1" step="0.1" min="0.1" style="width: 100%; padding: 5px; margin-bottom: 5px;">
        <label>Depth:</label>
        <input type="number" id="block-depth" value="1" step="0.1" min="0.1" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        
        <label>Mass (kg):</label>
        <input type="number" id="block-mass" value="50" step="10" min="1" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        
        <label style="display: flex; align-items: center; margin-bottom: 10px;">
          <input type="checkbox" id="block-respawn" checked style="margin-right: 5px;">
          <span style="font-size: 11px;">Auto-respawn if thrown off level</span>
        </label>
        
        <label>Respawn Time (seconds):</label>
        <input type="number" id="block-respawn-time" value="3" step="0.5" min="0.5" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        
        <button id="add-block" style="width: 100%; padding: 5px;">Add Block (Click on level)</button>
        
        <div id="block-list">
          <h5>Placeable Blocks (${this.placeableBlocks.length})</h5>
          ${this.placeableBlocks.map((block, index) => `
            <div class="item-row" data-type="block" data-index="${index}">
              <strong style="color: #${block.color.toString(16).padStart(6, '0')};">■</strong> 
              ${block.id}<br>
              at [${block.position.map(v => v.toFixed(1)).join(', ')}]<br>
              Mass: ${block.mass}kg
              <button onclick="window.editor._deletePlaceableBlock(${index})">Delete</button>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div id="mesh-controls" style="display: ${this.mode === 'mesh' ? 'block' : 'none'};">
        <h4>Mesh Selection & Animation</h4>
        <p style="font-size: 11px; opacity: 0.8; margin-bottom: 10px;">
          <strong>How to use:</strong><br>
          1. Click on a mesh in the 3D view or list below<br>
          2. Create collider OR add animations<br>
          3. Configure settings and apply
        </p>
        
        <div id="mesh-list">
          <h5>Level Meshes (${this.levelMeshes.length})</h5>
          ${this.levelMeshes.map((meshInfo, index) => `
            <div class="item-row ${this.selectedMesh === meshInfo ? 'selected' : ''}" 
                 data-type="mesh" data-index="${index}">
              <strong>${meshInfo.name}</strong>
              <button onclick="window.editor._selectMesh(${index})">Select</button>
            </div>
          `).join('')}
        </div>
        
        ${this.selectedMesh ? `
          <div style="margin-top: 15px; padding: 10px; border: 1px solid #4CAF50; background: #1a1a1a;">
            <h5 style="color: #4CAF50;">✓ Selected: ${this.selectedMesh.name}</h5>
            
            <h6 style="margin: 10px 0 5px 0;">Collider Settings</h6>
            <label>Collider Type:</label><br>
            <select id="mesh-collider-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
              <option value="mesh">Mesh (Trimesh - Accurate)</option>
              <option value="box">Box (Bounding Box - Faster)</option>
            </select>
            
            <label>Material Type:</label><br>
            <select id="mesh-material-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
              ${materialTypeOptions}
            </select>
            
            <button id="create-collider-from-mesh" style="width: 100%; padding: 5px; background: #4CAF50; color: white; margin-bottom: 15px;">
              Create Collider from Mesh
            </button>
            
            <h6 style="margin: 10px 0 5px 0;">Animation Settings</h6>
            <label>Animation Type:</label><br>
            <select id="mesh-animation-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
              <option value="none">None</option>
              <option value="moving">Moving (Waypoint Path)</option>
              <option value="rotating">Rotating</option>
              <option value="disappearing">Disappearing</option>
            </select>
            
            <div id="mesh-moving-settings" style="display: none; margin-top: 10px; padding: 8px; background: #222; border: 1px solid #2196F3; border-radius: 3px;">
              <h6 style="margin: 0 0 8px 0; color: #2196F3;">Moving Platform Settings</h6>
              
              <div style="font-size: 10px; background: #1a1a1a; padding: 5px; border-radius: 2px; margin-bottom: 8px;">
                <strong>📍 Start Position (Current Mesh):</strong><br>
                <span id="mesh-start-position" style="color: #4CAF50;">Click "Initialize Path" to set</span>
              </div>
              
              <button id="mesh-initialize-path" style="width: 100%; padding: 5px; font-size: 11px; margin-bottom: 8px; background: #4CAF50; color: white; border: none; border-radius: 2px; cursor: pointer;">
                Initialize Path from Current Position
              </button>
              
              <label style="font-size: 11px;">Speed (units/sec):</label><br>
              <input type="number" id="mesh-anim-speed" value="2" step="0.1" min="0.1" 
                     style="width: 100%; padding: 5px; margin-bottom: 8px; font-size: 11px;">
              
              <button id="mesh-add-waypoint-btn" style="width: 100%; padding: 5px; font-size: 11px; margin-bottom: 8px;" disabled>
                Add Waypoint (Click on level)
              </button>
              
              <div style="margin-bottom: 8px;">
                <label style="font-size: 11px;">Loop Behavior:</label><br>
                <select id="mesh-loop-behavior" style="width: 100%; padding: 5px; font-size: 11px;">
                  <option value="loop">Loop (Return to start)</option>
                  <option value="pingpong">Ping-Pong (Reverse direction)</option>
                  <option value="once">Once (Stop at end)</option>
                </select>
              </div>
              
              <label style="font-size: 11px;">Waypoints:</label>
              <div id="mesh-waypoint-list" style="font-size: 10px; max-height: 120px; overflow-y: auto; background: #111; padding: 5px; border-radius: 2px;">
                No waypoints yet - Initialize path first
              </div>
            </div>
            
            <div id="mesh-rotating-settings" style="display: none; margin-top: 10px; padding: 8px; background: #222; border: 1px solid #2196F3; border-radius: 3px;">
              <h6 style="margin: 0 0 8px 0; color: #2196F3;">Rotating Platform Settings</h6>
              <label style="font-size: 11px;">Rotation Axis:</label><br>
              <select id="mesh-rotation-axis" style="width: 100%; padding: 5px; margin-bottom: 8px; font-size: 11px;">
                <option value="0,1,0">Y (Horizontal Spin)</option>
                <option value="1,0,0">X (Flip Forward/Back)</option>
                <option value="0,0,1">Z (Roll Side to Side)</option>
              </select>
              
              <label style="font-size: 11px;">Speed (rad/sec):</label><br>
              <input type="number" id="mesh-rotation-speed" value="1" step="0.1" min="0.1"
                     style="width: 100%; padding: 5px; font-size: 11px;">
            </div>
            
            <div id="mesh-disappearing-settings" style="display: none; margin-top: 10px; padding: 8px; background: #222; border: 1px solid #2196F3; border-radius: 3px;">
              <h6 style="margin: 0 0 8px 0; color: #2196F3;">Disappearing Platform Settings</h6>
              <label style="font-size: 11px;">Visible Duration (s):</label><br>
              <input type="number" id="mesh-disappear-interval" value="3" step="0.5" min="0.1"
                     style="width: 100%; padding: 5px; margin-bottom: 8px; font-size: 11px;">
              
              <label style="font-size: 11px;">Invisible Duration (s):</label><br>
              <input type="number" id="mesh-disappear-duration" value="2" step="0.5" min="0.1"
                     style="width: 100%; padding: 5px; font-size: 11px;">
            </div>
            
            <button id="apply-mesh-animation" style="width: 100%; padding: 8px; background: #2196F3; color: white; margin-top: 15px; border-radius: 3px; font-size: 11px;">
              Apply Animation to Mesh
            </button>
            
            ${this.meshAnimations.length > 0 ? `
              <div style="margin-top: 15px; padding: 10px; border: 1px solid #FF9800; background: #1a1a1a; border-radius: 3px;">
                <h6 style="margin: 0 0 8px 0; color: #FF9800;">📋 Mesh Animations (${this.meshAnimations.length})</h6>
                ${this.meshAnimations.map((anim, index) => `
                  <div style="font-size: 10px; margin: 5px 0; padding: 5px; background: #222; border-radius: 2px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <strong>${anim.meshName}</strong><br>
                      Type: ${anim.animationType}
                      ${anim.animationType === 'moving' ? `<br>Waypoints: ${anim.data.path?.length || 0}` : ''}
                    </div>
                    <button onclick="window.editor._deleteMeshAnimation('${anim.meshName}')" 
                            style="font-size: 9px; padding: 3px 6px; background: #f44336; color: white; border: none; border-radius: 2px; cursor: pointer;">
                      Delete
                    </button>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        ` : '<p style="font-size: 14px; color: #ff5555; margin-top: 10px; padding: 10px; border: 1px solid #ff5555;">⚠️ No mesh selected - click Select button above</p>'}
      </div>
      
      <div id="collider-controls" style="display: ${this.mode === 'collider' ? 'block' : 'none'};">
        <h4>Collider Controls</h4>
        
        <label>Type:</label><br>
        <select id="collider-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          ${colliderTypeOptions}
        </select>
        
        <label>Material Type:</label><br>
        <select id="material-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          ${materialTypeOptions}
        </select>
        
        <button id="add-collider" style="width: 100%; padding: 5px;">Add Collider (Click on level)</button>
        
        <div id="collider-list">
          <h5>Colliders (${this.colliders.length})</h5>
          ${this.colliders.map((collider, index) => {
            // Handle mesh-type colliders differently (they reference GLTF meshes)
            const positionStr = collider.type === 'mesh' 
              ? `Mesh: ${collider.meshName}` 
              : `at [${collider.position.join(', ')}]`;
            
            return `
              <div class="item-row" data-type="collider" data-index="${index}">
                <strong>${collider.type}</strong> (${collider.materialType})<br>
                ${positionStr}
                <button onclick="window.editor._deleteCollider(${index})">Delete</button>
                ${collider.type !== 'mesh' ? `<button onclick="window.editor._editCollider(${index})">Edit</button>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <div id="platform-controls" style="display: ${this.mode === 'platform' ? 'block' : 'none'};">
        <h4>Platform Controls</h4>
        
        <p style="font-size: 10px; color: #aaa; margin: 5px 0;">
          💡 Tip: After placing, switch to <strong>Select</strong> mode and click the platform to add waypoints/edit animations.
        </p>
        
        <label>Type:</label><br>
        <select id="platform-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          <option value="static">Static</option>
          <option value="moving">Moving (needs waypoints)</option>
          <option value="rotating">Rotating</option>
          <option value="disappearing">Disappearing</option>
        </select>
        
        <h5>Size</h5>
        <label>Width:</label>
        <input type="number" id="platform-width" value="4" step="0.5" style="width: 100%; padding: 5px; margin-bottom: 5px;">
        <label>Height:</label>
        <input type="number" id="platform-height" value="0.5" step="0.1" style="width: 100%; padding: 5px; margin-bottom: 5px;">
        <label>Depth:</label>
        <input type="number" id="platform-depth" value="4" step="0.5" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        
        <h5>Appearance</h5>
        <label>Texture:</label><br>
        <select id="platform-texture" style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <option value="wood">Wood</option>
          <option value="metal">Metal</option>
          <option value="stone">Stone</option>
          <option value="ice">Ice (Low Friction)</option>
          <option value="custom">Custom URL...</option>
        </select>
        <input type="text" id="platform-texture-url" placeholder="Texture URL" style="width: 100%; padding: 5px; margin-bottom: 5px; display: none;">
        
        <label>Texture Repeat (U, V):</label><br>
        <input type="number" id="texture-repeat-u" value="1" step="0.5" min="0.1" style="width: 48%; padding: 5px; margin-right: 4%;">
        <input type="number" id="texture-repeat-v" value="1" step="0.5" min="0.1" style="width: 48%; padding: 5px; margin-bottom: 5px;">
        
        <label>Color (Fallback):</label><br>
        <input type="color" id="platform-color" value="#888888" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        
        <button id="add-platform" style="width: 100%; padding: 5px;">Add Platform (Click on level)</button>
        
        <div id="platform-list">
          <h5>Platforms (${this.platforms.length})</h5>
          ${this.platforms.map((platform, index) => `
            <div class="item-row" data-type="platform" data-index="${index}">
              <strong>${platform.type}</strong> ${platform.size[0]}x${platform.size[1]}x${platform.size[2]}<br>
              at [${platform.position.map(v => v.toFixed(1)).join(', ')}]
              <button onclick="window.editor._deletePlatform(${index})">Delete</button>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div id="interactive-controls" style="display: ${this.mode === 'interactive' ? 'block' : 'none'};">
        <h4>Interactive Objects</h4>
        
        <label>Object Type:</label><br>
        <select id="interactive-type" style="width: 100%; padding: 5px; margin-bottom: 10px;">
          <option value="pressurePlate">Pressure Plate</option>
          <option value="gltfPlatform">GLTF Platform</option>
        </select>
        
        <div id="pressure-plate-settings" style="display: none;">
          <h5>Pressure Plate Settings</h5>
          <label>Size:</label>
          <input type="number" id="pp-size" value="2" step="0.5" style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <label>Activation Weight (kg):</label>
          <input type="number" id="pp-weight" value="50" step="10" style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <label>Pressed Height:</label>
          <input type="number" id="pp-pressed-height" value="-0.1" step="0.05" style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <label>Color (Active):</label>
          <input type="color" id="pp-color" value="#00ff00" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        </div>
        
        <div id="gltf-platform-settings" style="display: none;">
          <h5>GLTF Platform Settings</h5>
          <label>GLTF URL:</label>
          <input type="text" id="gp-url" placeholder="public/assets/platforms/..." style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <label>Platform Type:</label>
          <select id="gp-type" style="width: 100%; padding: 5px; margin-bottom: 5px;">
            <option value="static">Static</option>
            <option value="moving">Moving</option>
            <option value="rotating">Rotating</option>
            <option value="disappearing">Disappearing</option>
          </select>
          <label>Physics Type:</label>
          <select id="gp-physics" style="width: 100%; padding: 5px; margin-bottom: 5px;">
            <option value="box">Box Collider</option>
            <option value="trimesh">Mesh Collider (static only)</option>
            <option value="convex">Convex Hull</option>
          </select>
          <label>Scale:</label>
          <input type="number" id="gp-scale" value="1" step="0.1" style="width: 100%; padding: 5px; margin-bottom: 10px;">
        </div>
        
        <button id="add-interactive" style="width: 100%; padding: 5px; margin-bottom: 10px;">Add Object (Click on level)</button>
        
        <div id="interactive-list">
          <h5>Interactive Objects (${this.interactiveObjects ? this.interactiveObjects.length : 0})</h5>
          ${this.interactiveObjects ? this.interactiveObjects.map((obj, index) => `
            <div class="item-row" data-type="interactive" data-index="${index}">
              <strong>${obj.objectType}</strong> ${obj.id}<br>
              at [${obj.position.map(v => v.toFixed(1)).join(', ')}]
              <button onclick="window.editor._deleteInteractiveObject(${index})">Delete</button>
            </div>
          `).join('') : ''}
        </div>
        
        <h5 style="margin-top: 15px;">Trigger Connections</h5>
        <p style="font-size: 10px; color: #aaa; margin: 5px 0;">
          Connect interactive objects to create cause-and-effect relationships
        </p>
        
        <label>Source Object:</label><br>
        <select id="trigger-source" style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <option value="">-- Select Source --</option>
          ${this.interactiveObjects ? this.interactiveObjects.map(obj => `
            <option value="${obj.id}">${obj.id} (${obj.objectType})</option>
          `).join('') : ''}
        </select>
        
        <label>Target Object:</label><br>
        <select id="trigger-target" style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <option value="">-- Select Target --</option>
          ${this.interactiveObjects ? this.interactiveObjects.map(obj => `
            <option value="${obj.id}">${obj.id} (${obj.objectType})</option>
          `).join('') : ''}
        </select>
        
        <label>Trigger Type:</label><br>
        <select id="trigger-type" style="width: 100%; padding: 5px; margin-bottom: 5px;">
          <option value="activate">Activate (turn on target)</option>
          <option value="deactivate">Deactivate (turn off target)</option>
          <option value="toggle">Toggle (flip target state)</option>
          <option value="custom">Custom Logic...</option>
        </select>
        
        <textarea id="trigger-custom-logic" placeholder="Custom JavaScript code (e.g., target.activate(); console.log('triggered'))" 
                  style="width: 100%; padding: 5px; margin-bottom: 5px; display: none; font-family: monospace; font-size: 10px;" 
                  rows="3"></textarea>
        
        <button id="add-trigger" style="width: 100%; padding: 5px; margin-bottom: 10px;">Add Trigger Connection</button>
        
        <div id="trigger-list">
          <h6 style="margin: 5px 0;">Triggers (${this.triggers ? this.triggers.length : 0})</h6>
          ${this.triggers ? this.triggers.map((trigger, index) => `
            <div class="item-row" style="font-size: 10px; padding: 3px 5px;" data-type="trigger" data-index="${index}">
              <strong>${trigger.sourceId}</strong> → ${trigger.targetId}<br>
              Type: ${trigger.type}
              <button onclick="window.editor._deleteTrigger(${index})" style="font-size: 9px; padding: 1px 3px;">Delete</button>
            </div>
          `).join('') : ''}
        </div>
      </div>
      
      <div id="patrol-controls" style="display: ${this.mode === 'patrol' ? 'block' : 'none'};">
        <h4>Patrol Point Controls</h4>
        <p>Select an enemy first, then click to add patrol points</p>
        
        <div id="patrol-list">
          <h5>Patrol Points (${this.patrolPoints.length})</h5>
          ${this.patrolPoints.map((point, index) => `
            <div class="item-row" data-type="patrol" data-index="${index}">
              Enemy ${point.enemyIndex} Point ${point.pointIndex}<br>
              [${point.position.join(', ')}] Wait: ${point.waitTime}s
              <button onclick="window.editor._deletePatrolPoint(${index})">Delete</button>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${this._getSelectionPropertiesHTML()}
      
      <div style="margin-top: 30px;">
        <button id="save-level" style="width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 3px;">
          Save Level
        </button>
      </div>
      
      <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
        <p><strong>Controls:</strong></p>
        <p>WASD - Move camera on X,Z plane</p>
        <p>Q/E - Move camera up/down</p>
        <p>Right-click + drag - Look around</p>
        <p>Mouse wheel - Zoom to center</p>
        <p>Left-click - Place/Select objects</p>
        <p>Delete - Remove selected</p>
        <p><strong>Hotkeys:</strong></p>
        <p>1 - Enemies, 2 - Lights, 3 - Patrol</p>
        <p>4 - Meshes, 5 - Colliders, 6 - Select</p>
      </div>
      
      <style>
        .mode-btn {
          padding: 5px 10px;
          margin: 2px;
          background: #333;
          color: white;
          border: 1px solid #666;
          border-radius: 3px;
          cursor: pointer;
        }
        .mode-btn.active {
          background: #4CAF50;
        }
        .item-row {
          background: #222;
          margin: 5px 0;
          padding: 8px;
          border-radius: 3px;
          font-size: 11px;
        }
        .item-row.selected {
          background: #444;
          border: 1px solid #4CAF50;
        }
        .item-row button {
          float: right;
          padding: 2px 6px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 2px;
          font-size: 10px;
          cursor: pointer;
        }
      </style>
    `;
    
    // Bind UI events
    this._bindUIEvents();
  }
  
  _getSelectionPropertiesHTML() {
    if (!this.selected) {
      return '<div id="selection-properties" style="margin-top: 20px; display: none;"></div>';
    }
    
    const selectedData = this.selected.userData;
    const pos = this.selected.position;
    const rot = this.selected.rotation;
    
    let typeSpecificInputs = '';
    
    // Add type-specific properties
    if (this.selectedType === 'enemy') {
      const enemyData = selectedData.enemyData;
      typeSpecificInputs = `
        <div style="margin-top: 10px;">
          <label style="font-size: 11px;">Enemy Type:</label><br>
          <select id="selected-enemy-type" style="width: 100%; padding: 3px; font-size: 11px;">
            ${this.enemyTypes.map(type => 
              `<option value="${type}" ${type === enemyData.type ? 'selected' : ''}>${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Speed:</label><br>
          <input type="number" id="selected-speed" value="${enemyData.speed || 2}" step="0.1" min="0" 
                 style="width: 100%; padding: 3px; font-size: 11px;" 
                 onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                 oninput="window.editor._onPropertyInputChange()"
                 onchange="window.editor._onPropertyInputChange()">
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Chase Range:</label><br>
          <input type="number" id="selected-chase-range" value="${enemyData.chaseRange || 5}" step="0.5" min="0" 
                 style="width: 100%; padding: 3px; font-size: 11px;" 
                 onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                 oninput="window.editor._onPropertyInputChange()"
                 onchange="window.editor._onPropertyInputChange()">
        </div>
      `;
    } else if (this.selectedType === 'npc') {
      const npcData = selectedData.npcData;
      typeSpecificInputs = `
        <div style="margin-top: 10px;">
          <label style="font-size: 11px;">NPC Type:</label><br>
          <select id="selected-npc-type" style="width: 100%; padding: 3px; font-size: 11px;">
            ${this.npcTypes.map(type => 
              `<option value="${type}" ${type === npcData.type ? 'selected' : ''}>${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Speed:</label><br>
          <input type="number" id="selected-npc-speed" value="${npcData.speed || 2}" step="0.1" min="0" 
                 style="width: 100%; padding: 3px; font-size: 11px;" 
                 onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                 oninput="window.editor._onPropertyInputChange()"
                 onchange="window.editor._onPropertyInputChange()">
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Scale:</label><br>
          <input type="number" id="selected-npc-scale" value="${npcData.scale || 1.0}" step="0.1" min="0.1" 
                 style="width: 100%; padding: 3px; font-size: 11px;" 
                 onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                 oninput="window.editor._onPropertyInputChange()"
                 onchange="window.editor._onPropertyInputChange()">
        </div>
      `;
    } else if (this.selectedType === 'light') {
      const lightData = selectedData.lightData;
      typeSpecificInputs = `
        <div style="margin-top: 10px;">
          <label style="font-size: 11px;">Light Type:</label><br>
          <select id="selected-light-type" style="width: 100%; padding: 3px; font-size: 11px;">
            ${this.lightTypes.map(type => 
              `<option value="${type}" ${type === lightData.type ? 'selected' : ''}>${type}</option>`
            ).join('')}
          </select>
        </div>
      `;
    } else if (this.selectedType === 'collider') {
      const colliderData = selectedData.colliderData;
      typeSpecificInputs = `
        <div style="margin-top: 10px;">
          <label style="font-size: 11px;">Collider Type:</label><br>
          <select id="selected-collider-type" style="width: 100%; padding: 3px; font-size: 11px;">
            ${this.colliderTypes.map(type => 
              `<option value="${type}" ${type === colliderData.type ? 'selected' : ''}>${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Material Type:</label><br>
          <select id="selected-material-type" style="width: 100%; padding: 3px; font-size: 11px;">
            ${this.materialTypes.map(type => 
              `<option value="${type}" ${type === colliderData.materialType ? 'selected' : ''}>${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Size:</label><br>
          ${this._getColliderSizeInputs(colliderData)}
        </div>
        ${colliderData.meshName ? `
          <div style="margin-top: 5px;">
            <label style="font-size: 11px;">Associated Mesh:</label><br>
            <span style="font-size: 10px; color: #888;">${colliderData.meshName}</span>
          </div>
        ` : ''}
      `;
    } else if (this.selectedType === 'platform') {
      const platformData = selectedData.platformData;
      const index = selectedData.index;
      typeSpecificInputs = `
        <div style="margin-top: 10px;">
          <label style="font-size: 11px;">Platform Type:</label><br>
          <select id="selected-platform-type" style="width: 100%; padding: 3px; font-size: 11px;">
            ${this.platformTypes.map(type => 
              `<option value="${type}" ${type === platformData.type ? 'selected' : ''}>${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Size:</label><br>
          <div style="display: flex; gap: 5px;">
            <input type="number" id="selected-platform-width" value="${platformData.size[0]}" step="0.5" min="0.1" placeholder="W"
                   style="width: 33%; padding: 3px; font-size: 11px;" 
                   onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                   oninput="window.editor._onPropertyInputChange()"
                   onchange="window.editor._onPropertyInputChange()">
            <input type="number" id="selected-platform-height" value="${platformData.size[1]}" step="0.1" min="0.1" placeholder="H"
                   style="width: 33%; padding: 3px; font-size: 11px;" 
                   onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                   oninput="window.editor._onPropertyInputChange()"
                   onchange="window.editor._onPropertyInputChange()">
            <input type="number" id="selected-platform-depth" value="${platformData.size[2]}" step="0.5" min="0.1" placeholder="D"
                   style="width: 33%; padding: 3px; font-size: 11px;" 
                   onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                   oninput="window.editor._onPropertyInputChange()"
                   onchange="window.editor._onPropertyInputChange()">
          </div>
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Texture:</label><br>
          <select id="selected-platform-texture" style="width: 100%; padding: 3px; font-size: 11px;">
            ${this.textureTypes.map(type => 
              `<option value="${type}" ${type === platformData.texture ? 'selected' : ''}>${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
            ).join('')}
          </select>
        </div>
        <div style="margin-top: 5px;">
          <label style="font-size: 11px;">Color (Fallback):</label><br>
          <input type="color" id="selected-platform-color" value="#${platformData.color.toString(16).padStart(6, '0')}" 
                 style="width: 100%; padding: 3px; font-size: 11px;">
        </div>
        ${platformData.type !== 'static' ? `
          <div style="margin-top: 10px; padding: 10px; border: 1px solid #2196F3; border-radius: 3px;">
            <h5 style="margin: 0 0 5px 0; color: #2196F3;">Animation Settings</h5>
            ${platformData.type === 'moving' ? `
              <label style="font-size: 11px;">Speed:</label><br>
              <input type="number" id="anim-speed" value="${platformData.animation?.speed || 2}" step="0.1" min="0.1"
                     style="width: 100%; padding: 3px; font-size: 11px; margin-bottom: 5px;">
              <button id="add-waypoint-btn" style="width: 100%; padding: 3px; font-size: 11px; margin-bottom: 5px;">
                Add Waypoint (Click on level)
              </button>
              <label style="font-size: 11px;">Waypoints:</label>
              <div id="waypoint-list" style="font-size: 10px; max-height: 100px; overflow-y: auto;">
                ${(platformData.animation?.path || []).map((wp, i) => `
                  <div style="margin: 2px 0; padding: 2px; background: #222;">[${wp.map(v => v.toFixed(1)).join(', ')}] 
                    <button onclick="window.editor._deleteWaypoint(${index}, ${i})" style="font-size: 9px; padding: 1px 3px;">X</button>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${platformData.type === 'rotating' ? `
              <label style="font-size: 11px;">Rotation Axis:</label><br>
              <select id="rotation-axis" style="width: 100%; padding: 3px; font-size: 11px; margin-bottom: 5px;">
                <option value="0,1,0" ${platformData.animation?.rotationAxis?.join(',') === '0,1,0' ? 'selected' : ''}>Y (Horizontal Spin)</option>
                <option value="1,0,0" ${platformData.animation?.rotationAxis?.join(',') === '1,0,0' ? 'selected' : ''}>X (Flip Forward/Back)</option>
                <option value="0,0,1" ${platformData.animation?.rotationAxis?.join(',') === '0,0,1' ? 'selected' : ''}>Z (Roll Side to Side)</option>
              </select>
              <label style="font-size: 11px;">Speed (rad/s):</label><br>
              <input type="number" id="rotation-speed" value="${platformData.animation?.rotationSpeed || 1}" step="0.1" min="0.1"
                     style="width: 100%; padding: 3px; font-size: 11px;">
            ` : ''}
            ${platformData.type === 'disappearing' ? `
              <label style="font-size: 11px;">Visible Duration (s):</label><br>
              <input type="number" id="disappear-interval" value="${platformData.animation?.disappearInterval || 3}" step="0.5" min="0.1"
                     style="width: 100%; padding: 3px; font-size: 11px; margin-bottom: 5px;">
              <label style="font-size: 11px;">Invisible Duration (s):</label><br>
              <input type="number" id="disappear-duration" value="${platformData.animation?.disappearDuration || 2}" step="0.5" min="0.1"
                     style="width: 100%; padding: 3px; font-size: 11px;">
            ` : ''}
          </div>
        ` : ''}
      `;
    }
    
    return `
      <div id="selection-properties" style="margin-top: 20px; border: 1px solid #444; padding: 10px; border-radius: 3px;">
        <h4 style="margin: 0 0 10px 0; color: #4CAF50;">Selected: ${this.selectedType.charAt(0).toUpperCase() + this.selectedType.slice(1)}</h4>
        
        <div style="margin-bottom: 15px;">
          <h5 style="margin: 0 0 5px 0;">Position</h5>
          <div style="display: flex; gap: 5px;">
            <div>
              <label style="font-size: 10px;">X:</label><br>
              <input type="number" id="selected-pos-x" value="${pos.x.toFixed(2)}" step="0.1" 
                     style="width: 60px; padding: 3px; font-size: 11px;" 
                     onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                     oninput="window.editor._onPropertyInputChange()"
                     onchange="window.editor._onPropertyInputChange()">
            </div>
            <div>
              <label style="font-size: 10px;">Y:</label><br>
              <input type="number" id="selected-pos-y" value="${pos.y.toFixed(2)}" step="0.1" 
                     style="width: 60px; padding: 3px; font-size: 11px;" 
                     onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                     oninput="window.editor._onPropertyInputChange()"
                     onchange="window.editor._onPropertyInputChange()">
            </div>
            <div>
              <label style="font-size: 10px;">Z:</label><br>
              <input type="number" id="selected-pos-z" value="${pos.z.toFixed(2)}" step="0.1" 
                     style="width: 60px; padding: 3px; font-size: 11px;" 
                     onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                     oninput="window.editor._onPropertyInputChange()"
                     onchange="window.editor._onPropertyInputChange()">
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <h5 style="margin: 0 0 5px 0;">Rotation (degrees)</h5>
          <div style="display: flex; gap: 5px;">
            <div>
              <label style="font-size: 10px;">X:</label><br>
              <input type="number" id="selected-rot-x" value="${(rot.x * 180 / Math.PI).toFixed(1)}" step="1" 
                     style="width: 60px; padding: 3px; font-size: 11px;" 
                     onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                     oninput="window.editor._onPropertyInputChange()"
                     onchange="window.editor._onPropertyInputChange()">
            </div>
            <div>
              <label style="font-size: 10px;">Y:</label><br>
              <input type="number" id="selected-rot-y" value="${(rot.y * 180 / Math.PI).toFixed(1)}" step="1" 
                     style="width: 60px; padding: 3px; font-size: 11px;" 
                     onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                     oninput="window.editor._onPropertyInputChange()"
                     onchange="window.editor._onPropertyInputChange()">
            </div>
            <div>
              <label style="font-size: 10px;">Z:</label><br>
              <input type="number" id="selected-rot-z" value="${(rot.z * 180 / Math.PI).toFixed(1)}" step="1" 
                     style="width: 60px; padding: 3px; font-size: 11px;" 
                     onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                     oninput="window.editor._onPropertyInputChange()"
                     onchange="window.editor._onPropertyInputChange()">
            </div>
          </div>
        </div>
        
        ${typeSpecificInputs}
        
        <div style="margin-top: 10px;">
          <button id="apply-properties" style="width: 100%; padding: 5px; background: #2196F3; color: white; border: none; border-radius: 3px; font-size: 11px;">
            Apply Changes
          </button>
          <button id="deselect-object" style="width: 100%; padding: 5px; background: #666; color: white; border: none; border-radius: 3px; font-size: 11px; margin-top: 5px;">
            Deselect
          </button>
        </div>
      </div>
    `;
  }
  
  _getColliderSizeInputs(colliderData) {
    // Check if there's a pending type change from the dropdown
    const colliderTypeSelect = document.getElementById('selected-collider-type');
    const currentType = colliderTypeSelect ? colliderTypeSelect.value : colliderData.type;
    
    if (currentType === 'sphere') {
      return `
        <div>
          <label style="font-size: 10px;">Radius:</label><br>
          <input type="number" id="selected-size-0" value="${colliderData.size[0] || 1}" step="0.1" min="0.1" 
                 style="width: 100%; padding: 3px; font-size: 11px;" 
                 onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                 oninput="window.editor._onPropertyInputChange()"
                 onchange="window.editor._onPropertyInputChange()">
        </div>
      `;
    } else if (currentType === 'capsule') {
      return `
        <div style="display: flex; gap: 5px;">
          <div style="flex: 1;">
            <label style="font-size: 10px;">Radius:</label><br>
            <input type="number" id="selected-size-0" value="${colliderData.size[0] || 0.5}" step="0.1" min="0.1" 
                   style="width: 100%; padding: 3px; font-size: 11px;" 
                   onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                   oninput="window.editor._onPropertyInputChange()"
                   onchange="window.editor._onPropertyInputChange()">
          </div>
          <div style="flex: 1;">
            <label style="font-size: 10px;">Height:</label><br>
            <input type="number" id="selected-size-1" value="${colliderData.size[1] || 2}" step="0.1" min="0.1" 
                   style="width: 100%; padding: 3px; font-size: 11px;" 
                   onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                   oninput="window.editor._onPropertyInputChange()"
                   onchange="window.editor._onPropertyInputChange()">
          </div>
        </div>
      `;
    } else { // box
      return `
        <div style="display: flex; gap: 5px;">
          <div style="flex: 1;">
            <label style="font-size: 10px;">W:</label><br>
            <input type="number" id="selected-size-0" value="${colliderData.size[0] || 1}" step="0.1" min="0.1" 
                   style="width: 100%; padding: 3px; font-size: 11px;" 
                   onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                   oninput="window.editor._onPropertyInputChange()"
                   onchange="window.editor._onPropertyInputChange()">
          </div>
          <div style="flex: 1;">
            <label style="font-size: 10px;">H:</label><br>
            <input type="number" id="selected-size-1" value="${colliderData.size[1] || 1}" step="0.1" min="0.1" 
                   style="width: 100%; padding: 3px; font-size: 11px;" 
                   onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                   oninput="window.editor._onPropertyInputChange()"
                   onchange="window.editor._onPropertyInputChange()">
          </div>
          <div style="flex: 1;">
            <label style="font-size: 10px;">D:</label><br>
            <input type="number" id="selected-size-2" value="${colliderData.size[2] || 1}" step="0.1" min="0.1" 
                   style="width: 100%; padding: 3px; font-size: 11px;" 
                   onkeydown="if(event.key==='Enter'){window.editor._applySelectedProperties();return;}event.stopPropagation();" 
                   oninput="window.editor._onPropertyInputChange()"
                   onchange="window.editor._onPropertyInputChange()">
          </div>
        </div>
      `;
    }
  }
  
  _bindUIEvents() {
    // Level selection
    const levelSelect = document.getElementById('level-select');
    if (levelSelect) {
      levelSelect.addEventListener('change', (e) => {
        this._loadLevel(parseInt(e.target.value));
      });
    }
    
    // Mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.mode = e.target.id.replace('mode-', '');
        this._clearVisualRepresentations(); // Clear old visuals
        this._createVisualRepresentations(); // Create new visuals for current mode
        this._updateUI();
      });
    });
    
    // Add buttons
    const addEnemyBtn = document.getElementById('add-enemy');
    if (addEnemyBtn) {
      addEnemyBtn.addEventListener('click', () => {
        this.mode = 'enemy';
        this._updateStatus('Click on the level to place an enemy');
      });
    }
    
    const addNpcBtn = document.getElementById('add-npc');
    if (addNpcBtn) {
      addNpcBtn.addEventListener('click', () => {
        this.mode = 'npc';
        this._updateStatus('Click on the level to place an NPC');
      });
    }
    
    const addLightBtn = document.getElementById('add-light');
    if (addLightBtn) {
      addLightBtn.addEventListener('click', () => {
        this.mode = 'light';
        this._updateStatus('Click on the level to place a light');
      });
    }
    
    const addColliderBtn = document.getElementById('add-collider');
    if (addColliderBtn) {
      addColliderBtn.addEventListener('click', () => {
        this.mode = 'collider';
        this._updateStatus('Click on the level to place a collider');
      });
    }
    
    const addPlatformBtn = document.getElementById('add-platform');
    if (addPlatformBtn) {
      addPlatformBtn.addEventListener('click', () => {
        this.mode = 'platform';
        this._updateStatus('Click on the level to place a platform');
      });
    }
    
    const addInteractiveBtn = document.getElementById('add-interactive');
    if (addInteractiveBtn) {
      addInteractiveBtn.addEventListener('click', () => {
        this.mode = 'interactive';
        this._updateStatus('Click on the level to place an interactive object');
      });
    }
    
    const addBlockBtn = document.getElementById('add-block');
    if (addBlockBtn) {
      addBlockBtn.addEventListener('click', () => {
        this.mode = 'block';
        this._updateStatus('Click on the level to place a block');
      });
    }
    
    // Interactive object type change - show/hide settings
    const interactiveTypeSelect = document.getElementById('interactive-type');
    if (interactiveTypeSelect) {
      interactiveTypeSelect.addEventListener('change', (e) => {
        const ppSettings = document.getElementById('pressure-plate-settings');
        const gpSettings = document.getElementById('gltf-platform-settings');
        if (ppSettings && gpSettings) {
          ppSettings.style.display = e.target.value === 'pressurePlate' ? 'block' : 'none';
          gpSettings.style.display = e.target.value === 'gltfPlatform' ? 'block' : 'none';
        }
      });
      // Trigger initial change
      interactiveTypeSelect.dispatchEvent(new Event('change'));
    }
    
    // Trigger type change - show/hide custom logic textarea
    const triggerTypeSelect = document.getElementById('trigger-type');
    if (triggerTypeSelect) {
      triggerTypeSelect.addEventListener('change', (e) => {
        const customLogicArea = document.getElementById('trigger-custom-logic');
        if (customLogicArea) {
          customLogicArea.style.display = e.target.value === 'custom' ? 'block' : 'none';
        }
      });
    }
    
    // Add trigger button
    const addTriggerBtn = document.getElementById('add-trigger');
    if (addTriggerBtn) {
      addTriggerBtn.addEventListener('click', () => this._addTrigger());
    }
    
    const createColliderFromMeshBtn = document.getElementById('create-collider-from-mesh');
    if (createColliderFromMeshBtn) {
      createColliderFromMeshBtn.addEventListener('click', () => {
        this._createColliderFromSelectedMesh();
      });
    }
    
    // Save button
    const saveBtn = document.getElementById('save-level');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this._saveLevel());
    }
    
    // Selection property buttons
    const applyBtn = document.getElementById('apply-properties');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this._applySelectedProperties());
    }
    
    const deselectBtn = document.getElementById('deselect-object');
    if (deselectBtn) {
      deselectBtn.addEventListener('click', () => this._selectObject(null));
    }
    
    // Collider type change - update size inputs
    const colliderTypeSelect = document.getElementById('selected-collider-type');
    if (colliderTypeSelect) {
      colliderTypeSelect.addEventListener('change', () => {
        this._updateUI(); // Refresh UI to show correct size inputs
      });
    }
    
    // Platform texture change - show/hide custom URL input
    const platformTextureSelect = document.getElementById('platform-texture');
    if (platformTextureSelect) {
      platformTextureSelect.addEventListener('change', (e) => {
        const urlInput = document.getElementById('platform-texture-url');
        if (urlInput) {
          urlInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
        }
      });
    }
    
    // Add waypoint button for moving platforms
    const addWaypointBtn = document.getElementById('add-waypoint-btn');
    if (addWaypointBtn) {
      addWaypointBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.addingWaypoint = true;
        console.log('Waypoint mode activated. Click on the level to add waypoint.');
        this._updateStatus('👆 Click on the level to add a waypoint to the selected platform');
      });
    }
    
    // Mesh animation type change - show/hide animation settings
    const meshAnimationTypeSelect = document.getElementById('mesh-animation-type');
    if (meshAnimationTypeSelect) {
      meshAnimationTypeSelect.addEventListener('change', (e) => {
        const movingSettings = document.getElementById('mesh-moving-settings');
        const rotatingSettings = document.getElementById('mesh-rotating-settings');
        const disappearingSettings = document.getElementById('mesh-disappearing-settings');
        
        if (movingSettings && rotatingSettings && disappearingSettings) {
          movingSettings.style.display = e.target.value === 'moving' ? 'block' : 'none';
          rotatingSettings.style.display = e.target.value === 'rotating' ? 'block' : 'none';
          disappearingSettings.style.display = e.target.value === 'disappearing' ? 'block' : 'none';
        }
      });
      // Trigger initial change
      meshAnimationTypeSelect.dispatchEvent(new Event('change'));
    }
    
    // Initialize path button for mesh animations
    const meshInitializePathBtn = document.getElementById('mesh-initialize-path');
    if (meshInitializePathBtn) {
      meshInitializePathBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._initializeMeshPath();
      });
    }
    
    // Add mesh waypoint button
    const meshAddWaypointBtn = document.getElementById('mesh-add-waypoint-btn');
    if (meshAddWaypointBtn) {
      meshAddWaypointBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.addingMeshWaypoint = true;
        console.log('Mesh waypoint mode activated. Click on the level to add waypoint.');
        this._updateStatus('👆 Click on the level to add a waypoint to the mesh animation');
      });
    }
    
    // Apply mesh animation button
    const applyMeshAnimationBtn = document.getElementById('apply-mesh-animation');
    if (applyMeshAnimationBtn) {
      applyMeshAnimationBtn.addEventListener('click', () => {
        this._applyMeshAnimation();
      });
    }
  }
  
  _bindEvents() {
    // Prevent duplicate event binding
    if (this.eventsBound) {
      return; // Already bound, don't rebind
    }

    // Mouse events
    this.renderer.domElement.addEventListener('mousedown', this.boundEventHandlers.mousedown);
    this.renderer.domElement.addEventListener('mousemove', this.boundEventHandlers.mousemove);
    this.renderer.domElement.addEventListener('mouseup', this.boundEventHandlers.mouseup);
    this.renderer.domElement.addEventListener('wheel', this.boundEventHandlers.wheel);

    // Prevent right-click context menu
    this.renderer.domElement.addEventListener('contextmenu', this.boundEventHandlers.contextmenu);

    // Keyboard events
    window.addEventListener('keydown', this.boundEventHandlers.keydown);
    window.addEventListener('keyup', this.boundEventHandlers.keyup);

    // Window resize
    window.addEventListener('resize', this.boundEventHandlers.resize);

    // Expose editor to window for button callbacks
    window.editor = this;

    this.eventsBound = true;

    // Start render loop
    this._animate();
  }

  _unbindEvents() {
    if (!this.eventsBound) return;

    // Mouse events
    this.renderer.domElement.removeEventListener('mousedown', this.boundEventHandlers.mousedown);
    this.renderer.domElement.removeEventListener('mousemove', this.boundEventHandlers.mousemove);
    this.renderer.domElement.removeEventListener('mouseup', this.boundEventHandlers.mouseup);
    this.renderer.domElement.removeEventListener('wheel', this.boundEventHandlers.wheel);
    this.renderer.domElement.removeEventListener('contextmenu', this.boundEventHandlers.contextmenu);

    // Keyboard events
    window.removeEventListener('keydown', this.boundEventHandlers.keydown);
    window.removeEventListener('keyup', this.boundEventHandlers.keyup);

    // Window resize
    window.removeEventListener('resize', this.boundEventHandlers.resize);

    this.eventsBound = false;
  }
  
  _onMouseDown(event) {
    if (event.target !== this.renderer.domElement) return;

    this.mouseDown = true;
    this.lastMousePos = { x: event.clientX, y: event.clientY };

    // Check if right mouse button for camera rotation
    if (event.button === 2) { // Right mouse button
      this.isRotating = true;
      return;
    }

    // Only left mouse button (button === 0) for object placement/selection
    if (event.button === 0) { // Left mouse button only
      if (this.mode === 'select') {
        this._handleSelection(event);
      } else {
        this._handlePlacement(event);
      }
    }
    // Middle mouse button (button === 1) and other buttons are ignored
  }
  
  _onMouseMove(event) {
    // Only rotate camera when right mouse button is held down
    if (this.isRotating && this.mouseDown) {
      const deltaX = event.clientX - this.lastMousePos.x;
      const deltaY = event.clientY - this.lastMousePos.y;
      
      this.cameraYaw -= deltaX * this.sensitivity;
      this.cameraPitch -= deltaY * this.sensitivity;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch, -Math.PI/2 + 0.1, Math.PI/2 - 0.1);
      
      this._updateCameraRotation();
      
      this.lastMousePos.x = event.clientX;
      this.lastMousePos.y = event.clientY;
    }
  }
  
  _onMouseUp(event) {
    this.mouseDown = false;
    this.isRotating = false;
  }
  
  _onMouseWheel(event) {
    event.preventDefault();
    
    // Get the center of the screen for zoom direction
    const rect = this.renderer.domElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Cast ray from center of screen
    const mouse = new THREE.Vector2(0, 0); // Center of screen
    this.raycaster.setFromCamera(mouse, this.camera);
    
    // Get the direction to zoom towards
    const zoomDirection = this.raycaster.ray.direction.clone();
    const zoomAmount = event.deltaY > 0 ? -2 : 2; // Inverted: scroll down = zoom in, scroll up = zoom out
    
    // Move camera towards/away from the center point
    this.camera.position.add(zoomDirection.multiplyScalar(zoomAmount));
  }
  
  _onKeyDown(event) {
    this.keys[event.code] = true;
    
    // Delete selected object
    if (event.code === 'Delete' && this.selected) {
      this._deleteSelected();
    }

    // Camera rotation (laptop-friendly controls)
    if (this.keys['ArrowLeft']) {
      this.cameraYaw += this.sensitivity * 10;
      this._updateCameraRotation();
    }
    if (this.keys['ArrowRight']) {
      this.cameraYaw -= this.sensitivity * 10;
      this._updateCameraRotation();
    }
    if (this.keys['ArrowUp']) {
      this.cameraPitch += this.sensitivity * 10;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch, -Math.PI/2 + 0.1, Math.PI/2 - 0.1);
      this._updateCameraRotation();
    }
    if (this.keys['ArrowDown']) {
      this.cameraPitch -= this.sensitivity * 10;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch, -Math.PI/2 + 0.1, Math.PI/2 - 0.1);
      this._updateCameraRotation();
    }

    // Alternative rotation keys (numpad for laptops without arrow keys)
    if (this.keys['Numpad4']) {
      this.cameraYaw += this.sensitivity * 10;
      this._updateCameraRotation();
    }
    if (this.keys['Numpad6']) {
      this.cameraYaw -= this.sensitivity * 10;
      this._updateCameraRotation();
    }
    if (this.keys['Numpad8']) {
      this.cameraPitch += this.sensitivity * 10;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch, -Math.PI/2 + 0.1, Math.PI/2 - 0.1);
      this._updateCameraRotation();
    }
    if (this.keys['Numpad2']) {
      this.cameraPitch -= this.sensitivity * 10;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch, -Math.PI/2 + 0.1, Math.PI/2 - 0.1);
      this._updateCameraRotation();
    }

    // Zoom controls (laptop-friendly)
    if (this.keys['NumpadAdd'] || this.keys['Equal']) { // Zoom in (+ or =)
      this.camera.position.multiplyScalar(0.95);
    }
    if (this.keys['NumpadSubtract'] || this.keys['Minus']) { // Zoom out (-)
      this.camera.position.multiplyScalar(1.05);
    }

    // Mode switching
    if (event.code === 'Digit1') this.mode = 'enemy';
    if (event.code === 'Digit2') this.mode = 'light';
    if (event.code === 'Digit3') this.mode = 'patrol';
    if (event.code === 'Digit4') this.mode = 'mesh';
    if (event.code === 'Digit5') this.mode = 'collider';
    if (event.code === 'Digit6') this.mode = 'select';

    if (event.code.startsWith('Digit')) {
      this._clearVisualRepresentations();
      this._createVisualRepresentations();
      this._updateUI();
    }
  }
  
  _onKeyUp(event) {
    this.keys[event.code] = false;
  }
  
  _onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  _updateCameraRotation() {
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler(this.cameraPitch, this.cameraYaw, 0, 'YXZ');
    quaternion.setFromEuler(euler);
    this.camera.quaternion.copy(quaternion);
  }
  
  _handleCameraMovement(delta) {
    const moveVector = new THREE.Vector3();
    
    // Only move on X,Z plane - ignore camera rotation for movement
    if (this.keys['KeyW']) moveVector.z -= 1; // Forward
    if (this.keys['KeyS']) moveVector.z += 1; // Backward  
    if (this.keys['KeyA']) moveVector.x -= 1; // Left
    if (this.keys['KeyD']) moveVector.x += 1; // Right
    if (this.keys['KeyQ']) moveVector.y -= 1; // Down
    if (this.keys['KeyE']) moveVector.y += 1; // Up
    
    if (moveVector.length() > 0) {
      moveVector.normalize();
      
      // For X,Z movement, only apply Y rotation (yaw), not pitch
      if (moveVector.x !== 0 || moveVector.z !== 0) {
        const yawQuaternion = new THREE.Quaternion();
        yawQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraYaw);
        
        const xzMovement = new THREE.Vector3(moveVector.x, 0, moveVector.z);
        xzMovement.applyQuaternion(yawQuaternion);
        moveVector.x = xzMovement.x;
        moveVector.z = xzMovement.z;
      }
      
      moveVector.multiplyScalar(this.moveSpeed * delta);
      this.camera.position.add(moveVector);
    }
  }
  
  _handlePlacement(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.mode === 'mesh') {
      // In mesh mode, handle mesh waypoint placement
      if (this.addingMeshWaypoint) {
        const allObjects = [
          ...this.levelMeshes.map(info => info.mesh),
          ...this.platformMeshes,
          ...this.enemyMeshes,
          ...this.colliderMeshes
        ];
        const intersects = this.raycaster.intersectObjects(allObjects, true);
        
        if (intersects.length > 0) {
          this._addMeshWaypoint(intersects[0].point.toArray());
          this.addingMeshWaypoint = false;
        }
      } else {
        this._handleMeshSelection(event);
      }
      return;
    }

    // Get intersection with level geometry or ground plane for placement
    const intersects = this.raycaster.intersectObjects([
      ...this.levelGeometry.children,
      this.groundPlane
    ], true);

    if (intersects.length > 0) {
      const point = intersects[0].point;

      switch (this.mode) {
        case 'enemy':
          this._addEnemy(point);
          break;
        case 'npc':
          this._addNpc(point);
          break;
        case 'light':
          this._addLight(point);
          break;
        case 'patrol':
          this._addPatrolPoint(point);
          break;
        case 'collider':
          this._addCollider(point);
          break;
        case 'platform':
          if (this.addingWaypoint) {
            this._addWaypointToSelectedPlatform(point);
          } else {
            this._addPlatform(point);
          }
          break;
        case 'interactive':
          this._addInteractiveObject(point);
          break;
        case 'block':
          this._addPlaceableBlock(point);
          break;
      }
    }
  }
  
  _handleSelection(event) {
    // If adding waypoint, handle that instead of selection
    if (this.addingWaypoint && this.mode === 'select') {
      console.log('Waypoint mode active, raycasting for waypoint position...');
      // Get click position on level geometry
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      
      // Raycast against ALL visible objects (level, platforms, etc.)
      const allObjects = [
        ...this.levelMeshes.map(info => info.mesh),
        ...this.platformMeshes,
        ...this.enemyMeshes,
        ...this.colliderMeshes
      ];
      const intersects = this.raycaster.intersectObjects(allObjects, true);
      
      console.log('Object intersects:', intersects.length);
      
      if (intersects.length > 0) {
        console.log('Found intersection at:', intersects[0].point);
        this._addWaypointToSelectedPlatform(intersects[0].point);
      } else {
        console.warn('No intersection found');
        this._updateStatus('⚠️ Click on any visible geometry (level, platform, etc.) to add waypoint');
      }
      return;
    }
    
    // Only handle selection in select mode
    if (this.mode !== 'select') return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const selectableObjects = [
      ...this.enemyMeshes,
      ...this.npcMeshes,
      ...this.lightMeshes,
      ...this.patrolPointMeshes,
      ...this.colliderMeshes,
      ...this.platformMeshes,
      ...this.placeableBlockMeshes
    ];

    const intersects = this.raycaster.intersectObjects(selectableObjects, false);

    if (intersects.length > 0) {
      this._selectObject(intersects[0].object);
    } else {
      this._selectObject(null);
    }
  }
  
  _handleMeshSelection(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Only intersect with level meshes
    const levelMeshes = this.levelMeshes.map(info => info.mesh);
    const intersects = this.raycaster.intersectObjects(levelMeshes);
    
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const meshInfo = this.levelMeshes.find(info => info.mesh === clickedMesh);
      if (meshInfo) {
        this.selectedMesh = meshInfo;
        this._highlightSelectedMesh(clickedMesh);
        this._updateUI();
        this._updateStatus(`Selected mesh: ${meshInfo.name}`);
      }
    }
  }
  
  _addEnemy(position) {
    const enemyTypeSelect = document.getElementById('enemy-type');
    const type = enemyTypeSelect && enemyTypeSelect.value ? enemyTypeSelect.value : 'walker';
    
    const enemy = {
      type: type,
      position: [position.x, position.y, position.z],
      modelUrl: this._getDefaultModelUrl(type),
      patrolPoints: [],
      speed: this._getDefaultSpeed(type),
      chaseRange: 5,
      id: this.nextId++
    };
    
    this.enemies.push(enemy);
    this._createEnemyVisuals();
    this._updateUI();
    this._updateStatus(`Added ${type} enemy at [${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}]`);
  }

  _addNpc(position) {
    const npcTypeSelect = document.getElementById('npc-type');
    const type = npcTypeSelect && npcTypeSelect.value ? npcTypeSelect.value : 'yellow_bot';
    
    const npc = {
      type: type,
      position: [position.x, position.y, position.z],
      modelUrl: this._getDefaultModelUrl(type),
      patrolPoints: [],
      speed: this._getDefaultSpeed(type),
      scale: 1.0, // Default scale
      chaseRange: 0, // NPCs don't chase
      id: this.nextId++
    };
    
    this.npcs.push(npc);
    this._createNpcVisuals();
    this._updateUI();
    this._updateStatus(`Added ${type} NPC at [${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}]`);
  }
  
  _addLight(position) {
    const lightTypeSelect = document.getElementById('light-type');
    const type = lightTypeSelect && lightTypeSelect.value ? lightTypeSelect.value : 'BasicLights';
    
    const light = {
      type: type,
      position: [position.x, position.y, position.z],
      id: this.nextId++
    };
    
    this.lights.push(light);
    this._createLightVisuals();
    this._updateUI();
    this._updateStatus(`Added ${type} light at [${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}]`);
  }
  
  _addPatrolPoint(position) {
    if (!this.selected || (this.selectedType !== 'enemy' && this.selectedType !== 'npc')) {
      this._updateStatus('Select an enemy or NPC first to add patrol points');
      return;
    }
    
    if (this.selectedType === 'enemy') {
      const enemyIndex = this.selected.userData.index;
      const enemy = this.enemies[enemyIndex];
      
      if (!enemy.patrolPoints) enemy.patrolPoints = [];
      
      const pointIndex = enemy.patrolPoints.length;
      enemy.patrolPoints.push([position.x, position.y, position.z, 0.5]);
      
      // Update patrol points and visuals
      this._extractPatrolPoints();
      this._clearVisualRepresentations();
      this._createEnemyVisuals();
      this._createNpcVisuals();
      this._createLightVisuals();
      this._createColliderVisuals();
      this._createPatrolPointVisuals();
      this._createPatrolConnections();
      
      this._updateUI();
      this._updateStatus(`Added patrol point ${pointIndex} for enemy ${enemyIndex}`);
    } else if (this.selectedType === 'npc') {
      const npcIndex = this.selected.userData.index;
      const npc = this.npcs[npcIndex];
      
      if (!npc.patrolPoints) npc.patrolPoints = [];
      
      const pointIndex = npc.patrolPoints.length;
      npc.patrolPoints.push([position.x, position.y, position.z, 0.5]);
      
      // Update patrol points and visuals
      this._extractPatrolPoints();
      this._clearVisualRepresentations();
      this._createEnemyVisuals();
      this._createNpcVisuals();
      this._createLightVisuals();
      this._createColliderVisuals();
      this._createPatrolPointVisuals();
      this._createPatrolConnections();
      
      this._updateUI();
      this._updateStatus(`Added patrol point ${pointIndex} for NPC ${npcIndex}`);
    }
  }
  
  _addCollider(position) {
    const typeSelect = document.getElementById('collider-type');
    const materialSelect = document.getElementById('material-type');

    const type = typeSelect && typeSelect.value ? typeSelect.value : 'box';
    const materialType = materialSelect ? materialSelect.value : 'ground';
    
    // Default sizes based on type
    let size;
    switch (type) {
      case 'sphere':
        size = [1]; // radius
        break;
      case 'capsule':
        size = [0.5, 2]; // radius, height
        break;
      default: // box
        size = [2, 2, 2]; // width, height, depth
    }
    
    const collider = {
      id: `collider_${this.nextId}`,
      type: type,
      position: [position.x, position.y, position.z],
      size: size,
      materialType: materialType,
      meshName: this.selectedMesh ? this.selectedMesh.name : null
    };
    
    this.colliders.push(collider);
    this.nextId++;
    
    this._createColliderVisuals();
    this._updateUI();
    this._updateStatus(`Added ${type} collider at [${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}]`);
  }
  
  _selectMesh(index) {
    if (index >= 0 && index < this.levelMeshes.length) {
      this.selectedMesh = this.levelMeshes[index];
      console.log('Selected mesh:', this.selectedMesh);
      console.log('Total meshes:', this.levelMeshes.length);
      this._highlightSelectedMesh(this.selectedMesh.mesh);
      this._updateUI();
      this._updateStatus(`Selected mesh: ${this.selectedMesh.name}`);
    } else {
      console.log('Invalid mesh index:', index, 'Total meshes:', this.levelMeshes.length);
    }
  }
  
  _createColliderFromSelectedMesh() {
    if (!this.selectedMesh) {
      this._updateStatus('No mesh selected');
      return;
    }
    
    const mesh = this.selectedMesh.mesh;
    const meshName = this.selectedMesh.name;
    
    // Get user-selected collider type
    const colliderTypeSelect = document.getElementById('mesh-collider-type');
    const colliderType = colliderTypeSelect ? colliderTypeSelect.value : 'mesh';
    
    // Get user-selected material type
    const materialSelect = document.getElementById('mesh-material-type');
    const materialType = materialSelect ? materialSelect.value : 'ground';
    
    let collider;
    
    if (colliderType === 'mesh') {
      // Create Trimesh collider (references the GLTF mesh)
      collider = {
        id: `collider_${this.nextId}`,
        type: 'mesh',
        meshName: meshName,
        materialType: materialType
      };
      
      this._updateStatus(`Created Trimesh collider for: ${meshName}`);
    } else {
      // Create Box collider (bounding box approximation)
      const boundingBox = new THREE.Box3().setFromObject(mesh);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());
      
      collider = {
        id: `collider_${this.nextId}`,
        type: 'box',
        position: [center.x, center.y, center.z],
        size: [size.x, size.y, size.z],
        rotation: [0, 0, 0],
        materialType: materialType
      };
      
      this._updateStatus(`Created Box collider for: ${meshName} (${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)})`);
    }
    
    this.colliders.push(collider);
    this.nextId++;
    
    this._createColliderVisuals();
    this._updateUI();
  }
  
  _deleteCollider(index) {
    if (index >= 0 && index < this.colliders.length) {
      // Clear selection if we're deleting the selected collider
      if (this.selected && this.selectedType === 'collider' && this.selected.userData.index === index) {
        this.selected = null;
        this.selectedType = null;
      }
      
      this.colliders.splice(index, 1);
      this._createColliderVisuals();
      this._updateUI();
      this._updateStatus('Collider deleted');
    }
  }
  
  _editCollider(index) {
    if (index >= 0 && index < this.colliders.length) {
      const collider = this.colliders[index];
      
      // For now, just select the collider mesh for visual feedback
      const colliderMesh = this.colliderMeshes[index];
      if (colliderMesh) {
        this._selectObject(colliderMesh);
      }
      
      this._updateStatus(`Editing collider: ${collider.id}. Use properties panel to modify.`);
    }
  }
  
  _addPlatform(position) {
    const widthInput = document.getElementById('platform-width');
    const heightInput = document.getElementById('platform-height');
    const depthInput = document.getElementById('platform-depth');
    const typeSelect = document.getElementById('platform-type');
    const textureSelect = document.getElementById('platform-texture');
    const textureUrlInput = document.getElementById('platform-texture-url');
    const colorInput = document.getElementById('platform-color');
    const repeatU = document.getElementById('texture-repeat-u');
    const repeatV = document.getElementById('texture-repeat-v');
    
    const platform = {
      id: `platform_${this.nextId++}`,
      type: typeSelect?.value || 'static',
      position: [position.x, position.y, position.z],
      size: [
        parseFloat(widthInput?.value || 4),
        parseFloat(heightInput?.value || 0.5),
        parseFloat(depthInput?.value || 4)
      ],
      rotation: [0, 0, 0],
      texture: textureSelect?.value || 'wood',
      textureUrl: textureUrlInput?.value || '',
      textureRepeat: [
        parseFloat(repeatU?.value || 1),
        parseFloat(repeatV?.value || 1)
      ],
      color: parseInt((colorInput?.value || '#888888').replace('#', '0x')),
      materialType: 'platform',
      friction: 0.5,
      restitution: 0.3
    };
    
    // Add animation config for non-static platforms
    if (platform.type !== 'static') {
      platform.animation = {
        type: platform.type === 'moving' ? 'path' : platform.type,
        speed: 2.0,
        path: platform.type === 'moving' ? [] : undefined,
        rotationAxis: platform.type === 'rotating' ? [0, 1, 0] : undefined,
        rotationSpeed: platform.type === 'rotating' ? 1.0 : undefined,
        disappearInterval: platform.type === 'disappearing' ? 3.0 : undefined,
        disappearDuration: platform.type === 'disappearing' ? 2.0 : undefined
      };
    }
    
    this.platforms.push(platform);
    this._createPlatformVisuals();
    this._updateUI();
    this._updateStatus(`Added ${platform.type} platform`);
  }
  
  _deletePlatform(index) {
    if (index >= 0 && index < this.platforms.length) {
      // Clear selection if we're deleting the selected platform
      if (this.selected && this.selectedType === 'platform' && this.selected.userData.index === index) {
        this.selected = null;
        this.selectedType = null;
      }
      
      this.platforms.splice(index, 1);
      this._createPlatformVisuals();
      this._updateUI();
      this._updateStatus('Platform deleted');
    }
  }
  
  _addWaypointToSelectedPlatform(position) {
    console.log('_addWaypointToSelectedPlatform called', {
      selected: this.selected,
      selectedType: this.selectedType,
      addingWaypoint: this.addingWaypoint,
      position
    });
    
    if (!this.selected || this.selectedType !== 'platform') {
      this._updateStatus('⚠️ Please select a moving platform first');
      this.addingWaypoint = false;
      return;
    }
    
    const platformData = this.selected.userData.platformData;
    const index = this.selected.userData.index;
    
    if (platformData.type !== 'moving') {
      this._updateStatus('⚠️ Waypoints can only be added to moving platforms');
      this.addingWaypoint = false;
      return;
    }
    
    if (!platformData.animation) {
      platformData.animation = { type: 'path', speed: 2.0, path: [] };
    }
    
    if (!platformData.animation.path) {
      platformData.animation.path = [];
    }
    
    platformData.animation.path.push([position.x, position.y, position.z]);
    
    // Update the platform in the array
    this.platforms[index] = platformData;
    
    console.log('Waypoint added successfully:', platformData.animation.path);
    
    this._createPlatformVisuals();
    this._updateUI();
    this._updateStatus(`✅ Added waypoint ${platformData.animation.path.length} to platform`);
    this.addingWaypoint = false;
  }
  
  _deleteWaypoint(platformIndex, waypointIndex) {
    if (platformIndex >= 0 && platformIndex < this.platforms.length) {
      const platform = this.platforms[platformIndex];
      if (platform.animation && platform.animation.path) {
        platform.animation.path.splice(waypointIndex, 1);
        this._createPlatformVisuals();
        this._updateUI();
        this._updateStatus('Waypoint deleted');
      }
    }
  }
  
  // ========================================================================
  // INTERACTIVE OBJECT METHODS
  // ========================================================================
  
  _createInteractiveObjectVisuals() {
    // Clear existing visuals
    this.interactiveObjectMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
    });
    this.interactiveObjectMeshes = [];
    
    this.interactiveObjects.forEach((objData, index) => {
      let mesh;
      
      if (objData.objectType === 'pressurePlate') {
        // Create visual for pressure plate
        const size = objData.size || 2;
        const geometry = new THREE.BoxGeometry(size, 0.2, size);
        const material = new THREE.MeshStandardMaterial({
          color: objData.color || 0x00ff00,
          emissive: objData.color || 0x00ff00,
          emissiveIntensity: 0.3,
          metalness: 0.7,
          roughness: 0.3
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...objData.position);
      } else if (objData.objectType === 'gltfPlatform') {
        // Create placeholder visual for GLTF platform (actual GLTF loaded in game)
        const geometry = new THREE.BoxGeometry(2, 1, 2);
        const material = new THREE.MeshStandardMaterial({
          color: 0x8888ff,
          emissive: 0x4444ff,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 0.5,
          wireframe: true
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...objData.position);
        if (objData.scale) {
          const scale = Array.isArray(objData.scale) ? objData.scale[0] : objData.scale;
          mesh.scale.setScalar(scale);
        }
      }
      
      if (mesh) {
        mesh.userData.type = 'interactive';
        mesh.userData.index = index;
        mesh.userData.objectData = objData;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.scene.add(mesh);
        this.interactiveObjectMeshes.push(mesh);
      }
    });
  }
  
  _addInteractiveObject(position) {
    const typeSelect = document.getElementById('interactive-type');
    const objectType = typeSelect ? typeSelect.value : 'pressurePlate';
    
    const objData = {
      id: `interactive_${this.nextId++}`,
      objectType: objectType,
      position: [position.x, position.y, position.z]
    };
    
    if (objectType === 'pressurePlate') {
      const sizeInput = document.getElementById('pp-size');
      const weightInput = document.getElementById('pp-weight');
      const pressedHeightInput = document.getElementById('pp-pressed-height');
      const colorInput = document.getElementById('pp-color');
      
      objData.size = sizeInput ? parseFloat(sizeInput.value) : 2;
      objData.activationWeight = weightInput ? parseFloat(weightInput.value) : 50;
      objData.pressedHeight = pressedHeightInput ? parseFloat(pressedHeightInput.value) : -0.1;
      objData.color = colorInput ? parseInt(colorInput.value.replace('#', '0x')) : 0x00ff00;
    } else if (objectType === 'gltfPlatform') {
      const urlInput = document.getElementById('gp-url');
      const typeInput = document.getElementById('gp-type');
      const physicsInput = document.getElementById('gp-physics');
      const scaleInput = document.getElementById('gp-scale');
      
      objData.gltfUrl = urlInput ? urlInput.value : '';
      objData.type = typeInput ? typeInput.value : 'static';
      objData.physicsType = physicsInput ? physicsInput.value : 'box';
      objData.scale = scaleInput ? [parseFloat(scaleInput.value), parseFloat(scaleInput.value), parseFloat(scaleInput.value)] : [1, 1, 1];
      
      if (!objData.gltfUrl) {
        this._updateStatus('⚠️ Please enter a GLTF URL');
        return;
      }
      
      // Add animation data for moving/rotating/disappearing types
      if (objData.type === 'moving') {
        objData.animation = {
          path: [[position.x, position.y, position.z]],
          speed: 2.0
        };
      } else if (objData.type === 'rotating') {
        objData.animation = {
          rotationAxis: [0, 1, 0],
          rotationSpeed: 1.0
        };
      } else if (objData.type === 'disappearing') {
        objData.animation = {
          disappearInterval: 3.0,
          disappearDuration: 2.0
        };
      }
    }
    
    this.interactiveObjects.push(objData);
    this._createInteractiveObjectVisuals();
    this._updateUI();
    this._updateStatus(`Added ${objectType}: ${objData.id}`);
  }
  
  _deleteInteractiveObject(index) {
    if (index >= 0 && index < this.interactiveObjects.length) {
      // Clear selection if we're deleting the selected object
      if (this.selected && this.selectedType === 'interactive' && this.selected.userData.index === index) {
        this.selected = null;
        this.selectedType = null;
      }
      
      const obj = this.interactiveObjects[index];
      
      // Remove any triggers connected to this object
      this.triggers = this.triggers.filter(t => 
        t.sourceId !== obj.id && t.targetId !== obj.id
      );
      
      this.interactiveObjects.splice(index, 1);
      this._createInteractiveObjectVisuals();
      this._createTriggerConnectionVisuals();
      this._updateUI();
      this._updateStatus(`Deleted interactive object: ${obj.id}`);
    }
  }
  
  _createPlaceableBlockVisuals() {
    // Clear existing block visuals
    this.placeableBlockMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
    });
    this.placeableBlockMeshes = [];
    
    this.placeableBlocks.forEach((block, index) => {
      const geometry = new THREE.BoxGeometry(
        block.size[0],
        block.size[1],
        block.size[2]
      );
      
      const material = new THREE.MeshStandardMaterial({
        color: block.color,
        emissive: block.color,
        emissiveIntensity: 0.2,
        metalness: 0.3,
        roughness: 0.7
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...block.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      // Add outline for visibility
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
      );
      mesh.add(line);
      
      mesh.userData = { type: 'block', index, blockData: block };
      mesh.name = `block_${index}`;
      
      this.scene.add(mesh);
      this.placeableBlockMeshes.push(mesh);
    });
  }
  
  _addPlaceableBlock(position) {
    const colorSelect = document.getElementById('block-color');
    const widthInput = document.getElementById('block-width');
    const heightInput = document.getElementById('block-height');
    const depthInput = document.getElementById('block-depth');
    const massInput = document.getElementById('block-mass');
    const respawnCheck = document.getElementById('block-respawn');
    const respawnTimeInput = document.getElementById('block-respawn-time');
    
    const colorName = colorSelect?.value || 'red';
    const color = this.blockColors[colorName];
    
    const width = parseFloat(widthInput?.value || 1);
    const height = parseFloat(heightInput?.value || 1);
    const depth = parseFloat(depthInput?.value || 1);
    
    const block = {
      id: `block_${this.nextId++}`,
      type: 'placeableBlock',
      color: color,
      colorName: colorName,
      position: [position.x, position.y, position.z],
      size: [width, height, depth],
      mass: parseFloat(massInput?.value || 50),
      respawn: respawnCheck?.checked !== false,
      respawnTime: parseFloat(respawnTimeInput?.value || 3),
      spawnPosition: [position.x, position.y, position.z], // Original spawn position
      collider: {
        type: 'box',
        size: [width, height, depth],
        materialType: 'ground'
      }
    };
    
    this.placeableBlocks.push(block);
    this._createPlaceableBlockVisuals();
    this._updateUI();
    this._updateStatus(`✅ Added ${colorName} block at [${position.x.toFixed(1)}, ${position.y.toFixed(1)}, ${position.z.toFixed(1)}]`);
  }
  
  _deletePlaceableBlock(index) {
    if (index >= 0 && index < this.placeableBlocks.length) {
      if (this.selected && this.selectedType === 'block' && this.selected.userData.index === index) {
        this.selected = null;
        this.selectedType = null;
      }
      
      const block = this.placeableBlocks[index];
      this.placeableBlocks.splice(index, 1);
      this._createPlaceableBlockVisuals();
      this._updateUI();
      this._updateStatus(`✅ Deleted block: ${block.id}`);
    }
  }
  
  // ========================================================================
  // TRIGGER CONNECTION METHODS
  // ========================================================================
  
  _createTriggerConnectionVisuals() {
    // Clear existing trigger lines
    this.triggerConnectionLines.forEach(line => {
      this.scene.remove(line);
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
    this.triggerConnectionLines = [];
    
    // Create visual lines for each trigger connection
    this.triggers.forEach(trigger => {
      const sourceObj = this.interactiveObjects.find(o => o.id === trigger.sourceId);
      const targetObj = this.interactiveObjects.find(o => o.id === trigger.targetId);
      
      if (!sourceObj || !targetObj) return;
      
      // Create line from source to target
      const points = [
        new THREE.Vector3(...sourceObj.position),
        new THREE.Vector3(...targetObj.position)
      ];
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      // Color based on trigger type
      let color;
      switch (trigger.type) {
        case 'activate': color = 0x00ff00; break;  // Green
        case 'deactivate': color = 0xff0000; break; // Red
        case 'toggle': color = 0xffff00; break;    // Yellow
        case 'custom': color = 0xff00ff; break;    // Magenta
        default: color = 0xffffff;
      }
      
      const material = new THREE.LineBasicMaterial({ 
        color: color,
        opacity: 0.6,
        transparent: true,
        linewidth: 2
      });
      
      const line = new THREE.Line(geometry, material);
      line.userData.type = 'trigger-connection';
      line.userData.trigger = trigger;
      
      this.scene.add(line);
      this.triggerConnectionLines.push(line);
    });
  }
  
  _addTrigger() {
    const sourceSelect = document.getElementById('trigger-source');
    const targetSelect = document.getElementById('trigger-target');
    const typeSelect = document.getElementById('trigger-type');
    const customLogicArea = document.getElementById('trigger-custom-logic');
    
    if (!sourceSelect || !targetSelect || !typeSelect) {
      this._updateStatus('⚠️ Trigger UI elements not found');
      return;
    }
    
    const sourceId = sourceSelect.value;
    const targetId = targetSelect.value;
    const type = typeSelect.value;
    
    if (!sourceId || !targetId) {
      this._updateStatus('⚠️ Please select both source and target objects');
      return;
    }
    
    if (sourceId === targetId) {
      this._updateStatus('⚠️ Source and target must be different objects');
      return;
    }
    
    // Check if trigger already exists
    const exists = this.triggers.some(t => 
      t.sourceId === sourceId && t.targetId === targetId
    );
    
    if (exists) {
      this._updateStatus('⚠️ Trigger connection already exists');
      return;
    }
    
    const triggerData = {
      sourceId: sourceId,
      targetId: targetId,
      type: type
    };
    
    // Add custom logic if type is custom
    if (type === 'custom' && customLogicArea && customLogicArea.value.trim()) {
      triggerData.customLogic = customLogicArea.value.trim();
    }
    
    this.triggers.push(triggerData);
    this._createTriggerConnectionVisuals();
    this._updateUI();
    this._updateStatus(`Added trigger: ${sourceId} → ${targetId} (${type})`);
  }
  
  _deleteTrigger(index) {
    if (index >= 0 && index < this.triggers.length) {
      const trigger = this.triggers[index];
      this.triggers.splice(index, 1);
      this._createTriggerConnectionVisuals();
      this._updateUI();
      this._updateStatus(`Deleted trigger: ${trigger.sourceId} → ${trigger.targetId}`);
    }
  }
  
  _selectObject(object) {
    // Clear previous selection
    if (this.selected && this.selected.material && this.selected.material.emissive) {
      this.selected.material.emissive.setHex(0x000000);
    }
    
    this.selected = object;
    this.selectedType = object ? object.userData.type : null;
    
    if (this.selected && this.selected.material && this.selected.material.emissive) {
      this.selected.material.emissive.setHex(0x444444);
    }
    
    // Refresh UI to show/hide selection properties
    this._updateUI();
  }
  
  _applySelectedProperties() {
    if (!this.selected) return;
    
    // Get position inputs
    const posX = document.getElementById('selected-pos-x');
    const posY = document.getElementById('selected-pos-y');
    const posZ = document.getElementById('selected-pos-z');
    
    // Get rotation inputs
    const rotX = document.getElementById('selected-rot-x');
    const rotY = document.getElementById('selected-rot-y');
    const rotZ = document.getElementById('selected-rot-z');
    
    if (posX && posY && posZ) {
      // Update visual mesh position
      this.selected.position.set(
        parseFloat(posX.value),
        parseFloat(posY.value),
        parseFloat(posZ.value)
      );
      
      // Update data array position
      const index = this.selected.userData.index;
      if (this.selectedType === 'enemy' && this.enemies[index]) {
        this.enemies[index].position = [
          parseFloat(posX.value),
          parseFloat(posY.value),
          parseFloat(posZ.value)
        ];
      } else if (this.selectedType === 'npc' && this.npcs[index]) {
        this.npcs[index].position = [
          parseFloat(posX.value),
          parseFloat(posY.value),
          parseFloat(posZ.value)
        ];
      } else if (this.selectedType === 'light' && this.lights[index]) {
        this.lights[index].position = [
          parseFloat(posX.value),
          parseFloat(posY.value),
          parseFloat(posZ.value)
        ];
      } else if (this.selectedType === 'patrol' && this.patrolPoints[index]) {
        this.patrolPoints[index].position = [
          parseFloat(posX.value),
          parseFloat(posY.value),
          parseFloat(posZ.value)
        ];
        
        // Update the corresponding enemy or NPC's patrol point array
        const patrolData = this.patrolPoints[index];
        if (patrolData.entityType === 'enemy' && this.enemies[patrolData.enemyIndex]) {
          const enemy = this.enemies[patrolData.enemyIndex];
          if (enemy.patrolPoints && enemy.patrolPoints[patrolData.pointIndex]) {
            enemy.patrolPoints[patrolData.pointIndex][0] = parseFloat(posX.value);
            enemy.patrolPoints[patrolData.pointIndex][1] = parseFloat(posY.value);
            enemy.patrolPoints[patrolData.pointIndex][2] = parseFloat(posZ.value);
          }
        } else if (patrolData.entityType === 'npc' && this.npcs[patrolData.npcIndex]) {
          const npc = this.npcs[patrolData.npcIndex];
          if (npc.patrolPoints && npc.patrolPoints[patrolData.pointIndex]) {
            npc.patrolPoints[patrolData.pointIndex][0] = parseFloat(posX.value);
            npc.patrolPoints[patrolData.pointIndex][1] = parseFloat(posY.value);
            npc.patrolPoints[patrolData.pointIndex][2] = parseFloat(posZ.value);
          }
        }
      } else if (this.selectedType === 'collider' && this.colliders[index]) {
        this.colliders[index].position = [
          parseFloat(posX.value),
          parseFloat(posY.value),
          parseFloat(posZ.value)
        ];
      }
    }
    
    if (rotX && rotY && rotZ) {
      // Update visual mesh rotation (convert degrees to radians)
      this.selected.rotation.set(
        parseFloat(rotX.value) * Math.PI / 180,
        parseFloat(rotY.value) * Math.PI / 180,
        parseFloat(rotZ.value) * Math.PI / 180
      );
    }
    
    // Handle type-specific properties
    if (this.selectedType === 'enemy') {
      const enemyTypeSelect = document.getElementById('selected-enemy-type');
      const speedInput = document.getElementById('selected-speed');
      const chaseRangeInput = document.getElementById('selected-chase-range');
      
      const index = this.selected.userData.index;
      if (this.enemies[index]) {
        if (enemyTypeSelect) {
          this.enemies[index].type = enemyTypeSelect.value;
          this.enemies[index].modelUrl = this._getDefaultModelUrl(enemyTypeSelect.value);
          
          // Update visual color
          if (this.selected.material && this.selected.material.color) {
            this.selected.material.color.setHex(this._getEnemyColor(enemyTypeSelect.value));
          }
        }
        if (speedInput) {
          this.enemies[index].speed = parseFloat(speedInput.value);
        }
        if (chaseRangeInput) {
          this.enemies[index].chaseRange = parseFloat(chaseRangeInput.value);
        }
      }
    } else if (this.selectedType === 'npc') {
      const npcTypeSelect = document.getElementById('selected-npc-type');
      const speedInput = document.getElementById('selected-npc-speed');
      const scaleInput = document.getElementById('selected-npc-scale');
      
      const index = this.selected.userData.index;
      if (this.npcs[index]) {
        if (npcTypeSelect) {
          this.npcs[index].type = npcTypeSelect.value;
          this.npcs[index].modelUrl = this._getDefaultModelUrl(npcTypeSelect.value);
        }
        if (speedInput) {
          this.npcs[index].speed = parseFloat(speedInput.value);
        }
        if (scaleInput) {
          this.npcs[index].scale = parseFloat(scaleInput.value);
        }
      }
    } else if (this.selectedType === 'light') {
      const lightTypeSelect = document.getElementById('selected-light-type');
      
      const index = this.selected.userData.index;
      if (this.lights[index] && lightTypeSelect) {
        this.lights[index].type = lightTypeSelect.value;
      }
    } else if (this.selectedType === 'collider') {
      const colliderTypeSelect = document.getElementById('selected-collider-type');
      const materialTypeSelect = document.getElementById('selected-material-type');
      
      const index = this.selected.userData.index;
      const collider = this.colliders[index];
      
      if (collider) {
        let needsVisualUpdate = false;
        
        // Update collider type
        if (colliderTypeSelect && colliderTypeSelect.value !== collider.type) {
          collider.type = colliderTypeSelect.value;
          // Reset size array for new type
          if (collider.type === 'sphere') {
            collider.size = [1]; // radius
          } else if (collider.type === 'capsule') {
            collider.size = [0.5, 2]; // radius, height
          } else { // box
            collider.size = [2, 2, 2]; // width, height, depth
          }
          needsVisualUpdate = true;
        }
        
        // Update material type
        if (materialTypeSelect && materialTypeSelect.value !== collider.materialType) {
          collider.materialType = materialTypeSelect.value;
          needsVisualUpdate = true;
        }
        
        // Update size based on inputs
        const sizeInputs = [];
        for (let i = 0; i < 3; i++) {
          const input = document.getElementById(`selected-size-${i}`);
          if (input) {
            sizeInputs.push(parseFloat(input.value));
          }
        }
        
        if (sizeInputs.length > 0) {
          if (collider.type === 'sphere') {
            collider.size = [sizeInputs[0] || 1];
          } else if (collider.type === 'capsule') {
            collider.size = [sizeInputs[0] || 0.5, sizeInputs[1] || 2];
          } else { // box
            collider.size = [
              sizeInputs[0] || 1,
              sizeInputs[1] || 1,
              sizeInputs[2] || 1
            ];
          }
          needsVisualUpdate = true;
        }
        
        // Recreate collider visuals if anything changed
        if (needsVisualUpdate) {
          this._createColliderVisuals();
          // Re-select the updated collider mesh
          const updatedMesh = this.colliderMeshes[index];
          if (updatedMesh) {
            this._selectObject(updatedMesh);
          }
        }
      }
    } else if (this.selectedType === 'platform') {
      const platformTypeSelect = document.getElementById('selected-platform-type');
      const widthInput = document.getElementById('selected-platform-width');
      const heightInput = document.getElementById('selected-platform-height');
      const depthInput = document.getElementById('selected-platform-depth');
      const textureSelect = document.getElementById('selected-platform-texture');
      const colorInput = document.getElementById('selected-platform-color');
      
      const index = this.selected.userData.index;
      const platform = this.platforms[index];
      
      if (platform) {
        // Update platform type
        if (platformTypeSelect && platformTypeSelect.value !== platform.type) {
          platform.type = platformTypeSelect.value;
          
          // Add/update animation config when changing type
          if (platform.type !== 'static' && !platform.animation) {
            platform.animation = {
              type: platform.type === 'moving' ? 'path' : platform.type,
              speed: 2.0,
              path: platform.type === 'moving' ? [] : undefined,
              rotationAxis: platform.type === 'rotating' ? [0, 1, 0] : undefined,
              rotationSpeed: platform.type === 'rotating' ? 1.0 : undefined,
              disappearInterval: platform.type === 'disappearing' ? 3.0 : undefined,
              disappearDuration: platform.type === 'disappearing' ? 2.0 : undefined
            };
          } else if (platform.type === 'static') {
            delete platform.animation;
          }
        }
        
        // Update size
        if (widthInput) platform.size[0] = parseFloat(widthInput.value);
        if (heightInput) platform.size[1] = parseFloat(heightInput.value);
        if (depthInput) platform.size[2] = parseFloat(depthInput.value);
        
        // Update texture
        if (textureSelect) platform.texture = textureSelect.value;
        
        // Update color
        if (colorInput) {
          platform.color = parseInt(colorInput.value.replace('#', '0x'));
        }
        
        // Update animation settings if platform type supports it
        if (platform.animation) {
          if (platform.type === 'moving') {
            const speedInput = document.getElementById('anim-speed');
            if (speedInput) platform.animation.speed = parseFloat(speedInput.value);
          } else if (platform.type === 'rotating') {
            const axisSelect = document.getElementById('rotation-axis');
            const rotSpeedInput = document.getElementById('rotation-speed');
            if (axisSelect) {
              platform.animation.rotationAxis = axisSelect.value.split(',').map(parseFloat);
            }
            if (rotSpeedInput) {
              platform.animation.rotationSpeed = parseFloat(rotSpeedInput.value);
            }
          } else if (platform.type === 'disappearing') {
            const intervalInput = document.getElementById('disappear-interval');
            const durationInput = document.getElementById('disappear-duration');
            if (intervalInput) platform.animation.disappearInterval = parseFloat(intervalInput.value);
            if (durationInput) platform.animation.disappearDuration = parseFloat(durationInput.value);
          }
        }
        
        // Recreate platform visuals
        this._createPlatformVisuals();
        
        // Re-select the updated platform mesh
        const updatedMesh = this.platformMeshes[index];
        if (updatedMesh) {
          this._selectObject(updatedMesh);
        }
      }
    }
    
    // Recreate patrol connections if patrol point was moved
    if (this.selectedType === 'patrol') {
      this.patrolConnections.forEach(line => this.scene.remove(line));
      this.patrolConnections = [];
      this._createPatrolConnections();
    }
    
    this._updateStatus('Properties updated successfully');
  }

  // Real-time property updates as user types
  _onPropertyInputChange() {
    if (!this.selected) return;
    
    // This method updates the visual representation immediately as the user types
    // without applying to the data arrays (that happens on Apply button click)
    
    // Get position inputs
    const posX = document.getElementById('selected-pos-x');
    const posY = document.getElementById('selected-pos-y');
    const posZ = document.getElementById('selected-pos-z');
    
    // Get rotation inputs
    const rotX = document.getElementById('selected-rot-x');
    const rotY = document.getElementById('selected-rot-y');
    const rotZ = document.getElementById('selected-rot-z');
    
    // Update visual mesh position in real-time
    if (posX && posY && posZ) {
      const x = parseFloat(posX.value) || 0;
      const y = parseFloat(posY.value) || 0;
      const z = parseFloat(posZ.value) || 0;
      this.selected.position.set(x, y, z);
    }
    
    // Update visual mesh rotation in real-time (convert degrees to radians)
    if (rotX && rotY && rotZ) {
      const x = (parseFloat(rotX.value) || 0) * Math.PI / 180;
      const y = (parseFloat(rotY.value) || 0) * Math.PI / 180;
      const z = (parseFloat(rotZ.value) || 0) * Math.PI / 180;
      this.selected.rotation.set(x, y, z);
    }
    
    // Update collider size in real-time if this is a collider
    if (this.selectedType === 'collider') {
      const index = this.selected.userData.index;
      const collider = this.colliders[index];
      
      if (collider) {
        const sizeInputs = [];
        for (let i = 0; i < 3; i++) {
          const input = document.getElementById(`selected-size-${i}`);
          if (input && input.value !== '') {
            sizeInputs.push(parseFloat(input.value));
          }
        }
        
        if (sizeInputs.length > 0) {
          // Create a temporary size array to update visuals
          let tempSize;
          if (collider.type === 'sphere') {
            tempSize = [sizeInputs[0] || 1];
          } else if (collider.type === 'capsule') {
            tempSize = [sizeInputs[0] || 0.5, sizeInputs[1] || 2];
          } else { // box
            tempSize = [
              sizeInputs[0] || 1,
              sizeInputs[1] || 1,
              sizeInputs[2] || 1
            ];
          }
          
          // Update the visual mesh geometry to match the exact size (not scaling)
          this._updateColliderVisualSize(this.selected, collider.type, tempSize);
        }
      }
    }
    
    // Update patrol connections if this is a patrol point
    if (this.selectedType === 'patrol') {
      this.patrolConnections.forEach(line => this.scene.remove(line));
      this.patrolConnections = [];
      this._createPatrolConnections();
    }
  }

  // Helper method to update collider visual size without recreating the entire mesh
  _updateColliderVisualSize(mesh, type, size) {
    if (!mesh || !mesh.geometry) return;
    
    try {
      // Dispose of the old geometry to prevent memory leaks
      mesh.geometry.dispose();
      
      // Create new geometry with the correct dimensions (same as _createColliderVisuals)
      let newGeometry;
      if (type === 'box') {
        newGeometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
      } else if (type === 'sphere') {
        newGeometry = new THREE.SphereGeometry(size[0], 16, 12);
      } else if (type === 'capsule') {
        newGeometry = new THREE.CylinderGeometry(size[0], size[0], size[1], 16);
      } else {
        // Default to box
        newGeometry = new THREE.BoxGeometry(1, 1, 1);
      }
      
      // Replace the geometry
      mesh.geometry = newGeometry;
      
      // Reset scale to 1,1,1 since we're using the actual geometry size
      mesh.scale.set(1, 1, 1);
      
    } catch (error) {
      console.warn('Failed to update collider visual size:', error);
    }
  }
  
  _deleteSelected() {
    if (!this.selected) return;
    
    const index = this.selected.userData.index;
    
    switch (this.selectedType) {
      case 'enemy':
        this._deleteEnemy(index);
        break;
      case 'light':
        this._deleteLight(index);
        break;
      case 'patrol':
        this._deletePatrolPoint(index);
        break;
      case 'collider':
        this._deleteCollider(index);
        break;
    }
  }
  
  _deleteEnemy(index) {
    if (index >= 0 && index < this.enemies.length) {
      this.enemies.splice(index, 1);
      this._extractPatrolPoints(); // Update patrol points
      this._clearVisualRepresentations();
      this._createEnemyVisuals();
      this._createLightVisuals();
      this._createColliderVisuals();
      this._createPatrolPointVisuals();
      this._createPatrolConnections();
      this._updateUI();
      this.selected = null;
      this.selectedType = null;
    }
  }

  _deleteNpc(index) {
    if (index >= 0 && index < this.npcs.length) {
      this.npcs.splice(index, 1);
      this._extractPatrolPoints(); // Update patrol points
      this._clearVisualRepresentations();
      this._createNpcVisuals();
      this._createEnemyVisuals();
      this._createLightVisuals();
      this._createColliderVisuals();
      this._createPatrolPointVisuals();
      this._createPatrolConnections();
      this._updateUI();
      this.selected = null;
      this.selectedType = null;
    }
  }
  
  _deleteLight(index) {
    if (index >= 0 && index < this.lights.length) {
      this.lights.splice(index, 1);
      this._createLightVisuals();
      this._updateUI();
      this.selected = null;
      this.selectedType = null;
    }
  }
  
  _deletePatrolPoint(index) {
    if (index >= 0 && index < this.patrolPoints.length) {
      const point = this.patrolPoints[index];
      const enemy = this.enemies[point.enemyIndex];
      
      if (enemy && enemy.patrolPoints) {
        enemy.patrolPoints.splice(point.pointIndex, 1);
        this._extractPatrolPoints();
        this._clearVisualRepresentations();
        this._createEnemyVisuals();
        this._createLightVisuals();
        this._createColliderVisuals();
        this._createPatrolPointVisuals();
        this._createPatrolConnections();
        this._updateUI();
        this.selected = null;
        this.selectedType = null;
      }
    }
  }
  
  _getDefaultModelUrl(type) {
    const urls = {
      walker: 'assets/low_poly_female/scene.gltf',
      runner: 'assets/low_poly_male/scene.gltf',
      jumper: 'assets/low_poly_female/scene.gltf',
      flyer: 'assets/futuristic_flying_animated_robot_-_low_poly/scene.gltf',
      snake: 'assets/enemies/snake/scene.gltf',
      snake_boss: 'assets/enemies/snake_boss/Snake_Angry.gltf',
      mech_boss: 'assets/enemies/robot_boss/scene.gltf',
      crawler: 'assets/enemies/crawler/Crawler.gltf',
      yellow_bot: 'assets/npc/yellow_bot/scene.gltf',
      other_bot: 'assets/npc/other_bot/Mike.gltf'
    };
    return urls[type] || urls.walker;
  }
  
  _getDefaultSpeed(type) {
    const speeds = {
      walker: 2.4,
      runner: 4.0,
      jumper: 2.0,
      flyer: 2.5,
      snake: 1.5,
      snake_boss: 2.5,
      mech_boss: 1.5,
      crawler: 1.5
    };
    return speeds[type] || 2.0;
  }
  
  _saveLevel() {
    if (!this.currentLevel) return;
    
    // Update current level data
    this.currentLevel.enemies = [...this.enemies];
    this.currentLevel.npcs = [...this.npcs];
    this.currentLevel.lights = this.lights.map(light => light.type);
    this.currentLevel.colliders = [...this.colliders];
    this.currentLevel.platforms = [...this.platforms];
    this.currentLevel.interactiveObjects = [...this.interactiveObjects];
    this.currentLevel.triggers = [...this.triggers];
    this.currentLevel.meshAnimations = [...this.meshAnimations];
    this.currentLevel.placeableBlocks = [...this.placeableBlocks];
    
    // Generate levelData.js content
    const levelDataContent = this._generateLevelDataJS();
    
    // Create and download file
    const blob = new Blob([levelDataContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'levelData.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this._updateStatus('Level data saved! Replace src/game/levelData.js with the downloaded file.');
  }
  
  _generateLevelDataJS() {
    const levelsJSON = JSON.stringify(this.levels, null, 2);
    return `// Data-driven level definitions with GLTF geometry loading
export const levels = ${levelsJSON};`;
  }
  
  _updateStatus(message = '') {
    if (!this.statusElement) return;
    
    const currentLevel = this.currentLevel ? this.currentLevel.name : 'No Level';
    const mode = this.mode.charAt(0).toUpperCase() + this.mode.slice(1);
    
    this.statusElement.innerHTML = `
      <strong>Level Editor</strong><br>
      Level: ${currentLevel}<br>
      Mode: ${mode}<br>
      Enemies: ${this.enemies.length} | NPCs: ${this.npcs.length} | Lights: ${this.lights.length} | Patrol: ${this.patrolPoints.length}<br>
      Platforms: ${this.platforms.length} | Interactive: ${this.interactiveObjects.length} | Triggers: ${this.triggers.length} | Blocks: ${this.placeableBlocks.length}<br>
      ${message}
    `;
  }
  
  _applyMeshAnimation() {
    if (!this.selectedMesh) {
      alert('⚠️ Please select a mesh first');
      return;
    }
    
    const animationType = document.getElementById('mesh-animation-type')?.value || 'none';
    
    if (animationType === 'none') {
      alert('⚠️ Please select an animation type');
      return;
    }
    
    // Find existing animation for this mesh or create new one
    let animData = this.meshAnimations.find(a => a.meshName === this.selectedMesh.name);
    if (!animData) {
      animData = {
        meshName: this.selectedMesh.name,
        animationType: animationType,
        data: {}
      };
      this.meshAnimations.push(animData);
    }
    
    // Update animation type and data based on type
    animData.animationType = animationType;
    
    switch (animationType) {
      case 'moving':
        const speed = parseFloat(document.getElementById('mesh-anim-speed')?.value || '2');
        const loopBehavior = document.getElementById('mesh-loop-behavior')?.value || 'loop';
        
        // Check if path was initialized
        if (!animData.data.path || animData.data.path.length === 0) {
          alert('⚠️ Please initialize the path first (click "Initialize Path" button)');
          return;
        }
        
        animData.data = {
          speed: speed,
          path: animData.data.path, // Keep existing path
          loopBehavior: loopBehavior
        };
        break;
        
      case 'rotating':
        const axisStr = document.getElementById('mesh-rotation-axis')?.value || '0,1,0';
        const [ax, ay, az] = axisStr.split(',').map(Number);
        const rotSpeed = parseFloat(document.getElementById('mesh-rotation-speed')?.value || '1');
        animData.data = {
          axis: [ax, ay, az],
          speed: rotSpeed
        };
        break;
        
      case 'disappearing':
        const interval = parseFloat(document.getElementById('mesh-disappear-interval')?.value || '3');
        const duration = parseFloat(document.getElementById('mesh-disappear-duration')?.value || '2');
        animData.data = {
          visibleInterval: interval,
          invisibleDuration: duration
        };
        break;
    }
    
    this._updateUI();
    this._updateStatus(`✅ Animation "${animationType}" applied to mesh "${this.selectedMesh.name}"`);
    console.log('Mesh animation applied:', animData);
  }
  
  _addMeshWaypoint(position) {
    if (!this.selectedMesh) {
      this._updateStatus('⚠️ No mesh selected for waypoint');
      this.addingMeshWaypoint = false;
      return;
    }
    
    // Find the mesh animation
    let animData = this.meshAnimations.find(a => a.meshName === this.selectedMesh.name);
    if (!animData || animData.animationType !== 'moving') {
      this._updateStatus('⚠️ Please initialize the path first (click "Initialize Path" button)');
      this.addingMeshWaypoint = false;
      return;
    }
    
    if (!animData.data.path || animData.data.path.length === 0) {
      this._updateStatus('⚠️ Path not initialized - click "Initialize Path" button first');
      this.addingMeshWaypoint = false;
      return;
    }
    
    // Add waypoint
    const waypoint = [
      parseFloat(position[0].toFixed(2)),
      parseFloat(position[1].toFixed(2)),
      parseFloat(position[2].toFixed(2))
    ];
    
    animData.data.path.push(waypoint);
    
    // Update waypoint list display
    this._updateMeshWaypointList(animData);
    
    this._updateStatus(`✅ Waypoint ${animData.data.path.length} added (${animData.data.path.length - 1} points after start)`);
    this.addingMeshWaypoint = false;
    console.log('Waypoint added to mesh:', waypoint, 'Total points:', animData.data.path.length);
  }
  
  _initializeMeshPath() {
    if (!this.selectedMesh) {
      this._updateStatus('⚠️ No mesh selected');
      return;
    }
    
    const mesh = this.selectedMesh.mesh;
    const startPosition = [
      parseFloat(mesh.position.x.toFixed(2)),
      parseFloat(mesh.position.y.toFixed(2)),
      parseFloat(mesh.position.z.toFixed(2))
    ];
    
    // Find or create animation data for this mesh
    let animData = this.meshAnimations.find(a => a.meshName === this.selectedMesh.name);
    if (!animData) {
      animData = {
        meshName: this.selectedMesh.name,
        animationType: 'moving',
        data: {
          speed: 2.0,
          path: [startPosition],
          loopBehavior: 'loop'
        }
      };
      this.meshAnimations.push(animData);
    } else {
      // Reset path with current position
      animData.data.path = [startPosition];
      if (!animData.data.loopBehavior) {
        animData.data.loopBehavior = 'loop';
      }
    }
    
    // Update UI to show start position
    const startPosDisplay = document.getElementById('mesh-start-position');
    if (startPosDisplay) {
      startPosDisplay.innerHTML = `[${startPosition.join(', ')}]`;
      startPosDisplay.style.color = '#4CAF50';
    }
    
    // Enable waypoint button
    const waypointBtn = document.getElementById('mesh-add-waypoint-btn');
    if (waypointBtn) {
      waypointBtn.disabled = false;
      waypointBtn.style.opacity = '1';
      waypointBtn.style.cursor = 'pointer';
    }
    
    this._updateMeshWaypointList(animData);
    this._updateStatus(`✅ Path initialized for "${this.selectedMesh.name}" from position [${startPosition.join(', ')}]`);
    console.log('Mesh path initialized:', animData);
  }
  
  _updateMeshWaypointList(animData) {
    const waypointList = document.getElementById('mesh-waypoint-list');
    if (!waypointList) return;
    
    if (!animData || !animData.data.path || animData.data.path.length === 0) {
      waypointList.innerHTML = 'No waypoints yet - Initialize path first';
      return;
    }
    
    waypointList.innerHTML = animData.data.path.map((wp, index) => {
      const isStart = index === 0;
      const label = isStart ? '🏁 Start' : `${index}`;
      const bgColor = isStart ? '#1a4d1a' : '#1a1a1a';
      const canDelete = !isStart; // Can't delete start position
      
      return `
        <div style="margin: 3px 0; padding: 4px; background: ${bgColor}; border-left: 3px solid ${isStart ? '#4CAF50' : '#2196F3'}; border-radius: 2px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 10px;"><strong>${label}:</strong> [${wp.map(v => v.toFixed(1)).join(', ')}]</span>
          ${canDelete ? `
            <button onclick="window.editor._deleteMeshWaypoint('${animData.meshName}', ${index})" 
                    style="font-size: 9px; padding: 2px 5px; background: #f44336; color: white; border: none; border-radius: 2px; cursor: pointer;">
              Remove
            </button>
          ` : '<span style="font-size: 9px; color: #888;">Fixed</span>'}
        </div>
      `;
    }).join('');
    
    // Update loop behavior info
    const loopBehavior = animData.data.loopBehavior || 'loop';
    const loopInfo = document.createElement('div');
    loopInfo.style.cssText = 'margin-top: 5px; padding: 4px; background: #2a2a2a; border-radius: 2px; font-size: 9px; color: #aaa;';
    
    const loopDescriptions = {
      loop: '🔁 Will return to start position',
      pingpong: '↔️ Will reverse direction at endpoints',
      once: '⏹️ Will stop at final waypoint'
    };
    
    loopInfo.innerHTML = `<strong>Path:</strong> ${loopDescriptions[loopBehavior]}`;
    waypointList.appendChild(loopInfo);
  }
  
  _deleteMeshWaypoint(meshName, waypointIndex) {
    const animData = this.meshAnimations.find(a => a.meshName === meshName);
    if (!animData || !animData.data.path) return;
    
    // Don't allow deleting the start position (index 0)
    if (waypointIndex === 0) {
      this._updateStatus('⚠️ Cannot delete start position - use "Initialize Path" to reset');
      return;
    }
    
    animData.data.path.splice(waypointIndex, 1);
    this._updateMeshWaypointList(animData);
    this._updateUI();
    this._updateStatus(`✅ Waypoint ${waypointIndex} removed from "${meshName}"`);
  }
  
  _deleteMeshAnimation(meshName) {
    const index = this.meshAnimations.findIndex(a => a.meshName === meshName);
    if (index >= 0) {
      this.meshAnimations.splice(index, 1);
      this._updateUI();
      this._updateStatus(`✅ Animation removed from mesh "${meshName}"`);
      console.log('Mesh animation deleted:', meshName);
    }
  }
  
  _selectMesh(index) {
    if (index >= 0 && index < this.levelMeshes.length) {
      this.selectedMesh = this.levelMeshes[index];
      console.log('Selected mesh:', this.selectedMesh);
      this._updateUI();
      this._updateStatus(`Mesh selected: ${this.selectedMesh.name}`);
    }
  }

  _animate() {
    requestAnimationFrame(this._animate.bind(this));

    const delta = 0.016; // Approximately 60fps

    // Handle camera movement
    this._handleCameraMovement(delta);

    // Render
    this.renderer.render(this.scene, this.camera);
  }
}