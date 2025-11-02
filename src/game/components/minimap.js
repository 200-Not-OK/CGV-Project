// src/ui/components/minimap.js
import * as THREE from 'three';
import { UIComponent } from '../uiComponent.js';

export class Minimap extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);

    // Root styling
    this.root.className = 'game-minimap';
    this.root.style.position = 'absolute';
    this.root.style.right = props.right || '12px';
    this.root.style.bottom = props.bottom || '12px';
    this.root.style.top = props.top || 'auto';
    this.root.style.width = props.width || '200px';
    this.root.style.height = props.height || '200px';
    this.root.style.background = 'rgba(0,0,0,0.8)';
    this.root.style.color = 'white';
    this.root.style.padding = '8px';
    this.root.style.fontSize = '12px';
    this.root.style.pointerEvents = 'auto';
    this.root.style.border = '2px solid rgba(255,255,255,0.3)';
    this.root.style.borderRadius = '4px';

    // Title
    this.title = document.createElement('div');
    this.title.textContent = 'Map';
    this.title.style.textAlign = 'center';
    this.title.style.marginBottom = '4px';
    this.title.style.fontWeight = 'bold';
    this.root.appendChild(this.title);

    // Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = 184;  // inner width (root has padding/border)
    this.canvas.height = 160;
    this.canvas.style.width = '100%';
    this.canvas.style.height = 'auto';
    this.canvas.style.imageRendering = 'crisp-edges';
    this.root.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    // State
    this.levelData = null;
    this.levelAABBs = null; // optional static AABBs by meshName
    this.bounds = null;
    this.worldWidth = 1;
    this.worldHeight = 1;
    this.baseScale = 1;

    // zoom < 1 shows more world, > 1 zooms in (relative to fitted world)
    this.zoom = typeof props.zoom === 'number' ? props.zoom : 0.5;

    // Mesh AABB live cache (meshName -> {minX,maxX,minZ,maxZ})
    this._meshAabbCache = new Map();

    // Debug options
    this.debug = {
      showBoundsRect: false,
      logContributorsOnce: false,
    };

    
  
  }

  /* --------------------------
      Public API
  --------------------------- */

  setLevelData(levelData) {
    this.levelData = levelData || null;
    this.levelAABBs = levelData?.meshAABBs || null;
    this._meshAabbCache.clear();
    this.calculateBounds();
  }

  /* --------------------------
      Bounds and transforms
  --------------------------- */

  calculateBounds() {
    const colliders = this.levelData?.colliders;
    const scene = this._getScene();

    let bounds = null;

    // Do not let these huge, merged meshes define the map extents.
    // They can still be drawn; we only exclude them from bounds.
    const NAME_BOUNDS_BLACKLIST = /^(Walls|Floor|Elevated_Ground)$/i;

    // Any single AABB larger than this (X-Z area) is ignored for bounds.
    const MAX_SINGLE_AREA = 1_000_000;

    const aabbArea = (a) =>
      a ? Math.max(0, a.maxX - a.minX) * Math.max(0, a.maxZ - a.minZ) : 0;

    // Keep a list for optional one-shot logging
    const contributors = [];

    if (Array.isArray(colliders)) {
      for (const collider of colliders) {
        // Skip completely if explicitly hidden from the minimap
        this.ctx.strokeStyle = 'rgba(44, 50, 60, 1)';
        if (collider?.minimap === false)
        {
          this.ctx.strokeStyle = 'rgba(20, 20, 30, 1)';
          continue;
        }

        // New: allow collider to opt out of *bounds* only
        if (collider?.minimapBounds === false) continue;

        let aabb = null;

        // Box: {position:[x,y,z], size:[w,h,d], rotation:[degX,degY,degZ]?}
        if (collider?.position && collider?.size) {
          aabb = this._aabbFromBox(collider.position, collider.size, collider.rotation);
        }
        // Mesh by name
        else if (collider?.type === 'mesh' || collider?.meshName) {
          aabb = this._aabbFromMeshName(collider.meshName, scene);
        }
        // Sphere
        else if (collider?.type === 'sphere' && collider?.position && typeof collider.radius === 'number') {
          aabb = this._aabbFromSphere(collider.position, collider.radius);
        }
        // Cylinder
        else if (collider?.type === 'cylinder' && collider?.position && typeof collider.radius === 'number') {
          aabb = this._aabbFromCylinder(collider.position, collider.radius, collider.height ?? 0);
        }

        if (!aabb) continue;

        // Exclude by name from contributing to bounds
        const name = (collider.meshName || '').toString();
        if (NAME_BOUNDS_BLACKLIST.test(name)) continue;

        // Exclude absurdly large pieces from bounds
        if (aabbArea(aabb) > MAX_SINGLE_AREA) continue;

        contributors.push({ id: collider.id, name, aabb });
        bounds = this._mergeAABB(bounds, aabb);
      }
    }

    // Fallback if nothing contributed
    if (!bounds) {
      const box = scene ? new THREE.Box3().setFromObject(scene) : null;
      if (box && isFinite(box.min.x) && isFinite(box.min.z)) {
        bounds = { minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z };
      } else {
        bounds = { minX: -50, maxX: 50, minZ: -50, maxZ: 50 };
      }
    }

    this.bounds = bounds;
    this.worldWidth = Math.max(1e-3, bounds.maxX - bounds.minX);
    this.worldHeight = Math.max(1e-3, bounds.maxZ - bounds.minZ);

    // Fit whole world in canvas with padding
    const padding = 10;
    const scaleX = (this.canvas.width - padding * 2) / this.worldWidth;
    const scaleY = (this.canvas.height - padding * 2) / this.worldHeight;
    this.baseScale = Math.max(1e-6, Math.min(scaleX, scaleY));

    if (this.debug.logContributorsOnce) {
      this.debug.logContributorsOnce = false;
      const list = contributors
        .slice()
        .sort((a, b) => (a.aabb.minX - b.aabb.minX) || (a.aabb.minZ - b.aabb.minZ))
        .map(c => `${c.id || '?'} -> ${c.name || '(box/sphere)'} [${c.aabb.minX.toFixed(1)}, ${c.aabb.minZ.toFixed(1)} – ${c.aabb.maxX.toFixed(1)}, ${c.aabb.maxZ.toFixed(1)}]`);
      console.log('[Minimap] Bounds contributors:', list);
      console.log('[Minimap] Final bounds:', this.bounds);
    }
  }

  worldToMap(x, z, playerX, playerZ) {
    if (!this.bounds) return { x: 0, y: 0 };
    const s = this.baseScale * this.zoom;
    const relX = (x - playerX) * s;
    const relZ = (z - playerZ) * s;
    return {
      x: this.canvas.width / 2 + relX,
      y: this.canvas.height / 2 + relZ
    };
  }

  /* --------------------------
      Update and draw
  --------------------------- */

  update(delta, ctx) {
    if (!ctx) return;

    const player = ctx.playerModel;
    if (!player?.position) return;

    // Allow live scene access for mesh AABBs
    const scene = ctx.game?.scene || this._getScene();

    const playerX = player.position.x;
    const playerZ = player.position.z;

    // Clear
    this.ctx.fillStyle = 'rgba(20, 20, 30, 1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Optional: draw overall fitted bounds rectangle for debugging
    if (this.debug.showBoundsRect && this.bounds) {
      const tl = this.worldToMap(this.bounds.minX, this.bounds.minZ, playerX, playerZ);
      const br = this.worldToMap(this.bounds.maxX, this.bounds.maxZ, playerX, playerZ);
      this.ctx.strokeStyle = '#00ffff';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    }

    // Colliders (draw everything that is not minimap:false)
    if (Array.isArray(this.levelData?.colliders)) {
      for (const collider of this.levelData.colliders) {
        if (collider?.minimap === false) continue;
        this._drawCollider(collider, playerX, playerZ, scene);
      }
    }

    // Enemies
    if (ctx.enemies && Array.isArray(ctx.enemies)) {
      this.ctx.fillStyle = '#ff4444';
      for (const enemy of ctx.enemies) {
        if (!this._isActiveEnemy(enemy)) continue;
        const p = (typeof enemy?.getMinimapPosition === 'function'
                    ? enemy.getMinimapPosition()
                    : (enemy?.mesh?.position || enemy?.body?.position));
        if (!p) continue;
        const mp = this.worldToMap(p.x, p.z, playerX, playerZ);
        if (this._onScreen(mp.x, mp.y)) {
          this.ctx.beginPath();
          this.ctx.arc(mp.x, mp.y, 4, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    // Collectibles
    if (Array.isArray(ctx.collectibles)) {
      this.ctx.fillStyle = '#ffaa00';
      for (const col of ctx.collectibles) {
        const p = col?.mesh?.position;
        if (!p) continue;
        const mp = this.worldToMap(p.x, p.z, playerX, playerZ);
        if (this._onScreen(mp.x, mp.y)) {
          this.ctx.beginPath();
          this.ctx.arc(mp.x, mp.y, 3, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    // Platforms (only if you passed ctx.platforms)
if (Array.isArray(ctx.platforms)) {
  this.ctx.strokeStyle = 'rgba(44, 50, 60, 1)';
  this.ctx.lineWidth = 2;
  const scene = ctx.game?.scene || this._getScene();
  for (const p of ctx.platforms) {
    const obj = p?.mesh || p;       // support either shape
    if (!obj) continue;
    const box = new THREE.Box3().setFromObject(obj);
    const tl = this.worldToMap(box.min.x, box.min.z, playerX, playerZ);
    const br = this.worldToMap(box.max.x, box.max.z, playerX, playerZ);
    const w = br.x - tl.x, h = br.y - tl.y;
    if (this._onScreen(tl.x + w * 0.5, tl.y + h * 0.5)) {
      this.ctx.strokeRect(tl.x, tl.y, w, h);
    }
  }
}


    // Player dot at center
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    this.ctx.fillStyle = '#00ff00';
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  /* --------------------------
      Drawing helpers
  --------------------------- */

  _drawCollider(collider, playerX, playerZ, scene) {
    let a = null;

    if (collider?.position && collider?.size) {
      a = this._aabbFromBox(collider.position, collider.size, collider.rotation);
    } else if (collider?.type === 'mesh' || collider?.meshName) {
      a = this._aabbFromMeshName(collider.meshName, scene);
    } else if (collider?.type === 'sphere' && collider?.position && typeof collider.radius === 'number') {
      a = this._aabbFromSphere(collider.position, collider.radius);
    } else if (collider?.type === 'cylinder' && collider?.position && typeof collider.radius === 'number') {
      a = this._aabbFromCylinder(collider.position, collider.radius, collider.height ?? 0);
    }

    if (!a) return;

    const tl = this.worldToMap(a.minX, a.minZ, playerX, playerZ);
    const br = this.worldToMap(a.maxX, a.maxZ, playerX, playerZ);
    const w = br.x - tl.x;
    const h = br.y - tl.y;

    if (tl.x > this.canvas.width || br.x < 0 || tl.y > this.canvas.height || br.y < 0) return;

    const kind = collider?.materialType || collider?.type || 'other';
    const defaults = {
      fill:
        kind === 'wall'   ? 'rgba(100, 100, 120, 0.8)' :
        kind === 'ground' ? 'rgba(60, 70, 80, 0.6)'   :
                            'rgba(80, 80, 100, 0.7)',
      stroke: (kind === 'wall') ? 'rgba(150, 150, 170, 0.5)' : null,
      lineWidth: (kind === 'wall') ? 1 : 0,
    };
    const fill = (collider.minimapFill ?? defaults.fill);
    const stroke = (collider.minimapStroke ?? defaults.stroke);
    const lw = (collider.minimapLineWidth ?? defaults.lineWidth);

    if (fill && fill !== 'transparent') {
      this.ctx.fillStyle = fill;
      this.ctx.fillRect(tl.x, tl.y, w, h);
    }
    if (stroke && stroke !== 'transparent' && lw > 0) {
      this.ctx.strokeStyle = stroke;
      this.ctx.lineWidth = lw;
      this.ctx.strokeRect(tl.x, tl.y, w, h);
    }
  }

  _onScreen(x, y) {
    return x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height;
  }

  /* --------------------------
      AABB helpers
  --------------------------- */

  _aabbFromBox(position, size, rotation) {
    // Rotation-aware XZ AABB (rotation around Y in degrees)
    const [x, , z] = position;
    const [w, , d] = size;
    const yaw = ((rotation?.[1] ?? 0) * Math.PI) / 180; // degrees → radians (Y)

    const hw = w / 2, hd = d / 2;
    const corners = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];

    const c = Math.cos(yaw), s = Math.sin(yaw);
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

    for (const [cx, cz] of corners) {
      const rx = cx * c - cz * s + x;
      const rz = cx * s + cz * c + z;
      if (rx < minX) minX = rx; if (rx > maxX) maxX = rx;
      if (rz < minZ) minZ = rz; if (rz > maxZ) maxZ = rz;
    }
    return { minX, maxX, minZ, maxZ };
  }

  _aabbFromSphere(position, radius) {
    const [x, , z] = position;
    const r = Math.abs(radius);
    return { minX: x - r, maxX: x + r, minZ: z - r, maxZ: z + r };
  }

  _aabbFromCylinder(position, radius /* height unused */, /* height */) {
    const [x, , z] = position;
    const r = Math.abs(radius);
    return { minX: x - r, maxX: x + r, minZ: z - r, maxZ: z + r };
  }

  _mergeAABB(a, b) {
    if (!b) return a || null;
    if (!a) return { ...b };
    return {
      minX: Math.min(a.minX, b.minX),
      maxX: Math.max(a.maxX, b.maxX),
      minZ: Math.min(a.minZ, b.minZ),
      maxZ: Math.max(a.maxZ, b.maxZ)
    };
  }

  /* --------------------------
      Mesh AABB (live, cached)
  --------------------------- */

  _aabbFromMeshName(meshName, scene) {
    // Prefer live scene Box3 so scale/rotation are correct
    const live = this._aabbFromSceneMesh(meshName, scene);
    if (live) return live;

    // Fallback to static precomputed AABBs provided in level data
    if (!meshName || !this.levelAABBs) return null;
    const entry = this.levelAABBs[meshName];
    if (!entry?.position || !entry?.size) return null;
    return this._aabbFromBox(entry.position, entry.size, entry.rotation);
  }

  _aabbFromSceneMesh(meshName, scene) {
    
    if (!meshName || !scene) return null;

    const obj = scene.getObjectByName(meshName);
    if (!obj) return null;

    const box = new THREE.Box3().setFromObject(obj); // world space
    if (!box || !isFinite(box.min.x) || !isFinite(box.min.z)) return null;

    return { minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z };
  }

  _getScene() {
    // Fallback hook if ctx.game.scene was not provided
    return (typeof window !== 'undefined' && window.game && window.game.scene)
      ? window.game.scene
      : null;
  }

  /* --------------------------
      Optional utilities
  --------------------------- */

  // Call once to print which colliders defined bounds and the final numbers.
  logBoundsContributorsNextUpdate() {
    this.debug.logContributorsOnce = true;
  }
  _isActiveEnemy(e) {
    if (!e) return false;

    // Standard flags you likely set on death/disposal:
    const disposed = e.disposed || e.isDisposed || false;
    const deadFlag = (e.isDead === true) || (e.alive === false);
    const hpOK = (typeof e.health === 'number') ? (e.health > 0) : true;

    // Mesh presence/visibility (if you hide or remove on death)
    const mesh = e.mesh || null;
    const attached = !!(mesh && mesh.parent);      // removed from scene?
    const visible = (mesh?.visible !== false);     // default true

    // Optional explicit API on enemies:
    if (typeof e.isActiveOnMinimap === 'function') {
      try { return !!e.isActiveOnMinimap(); } catch (_) {}
    }

    return !disposed && !deadFlag && hpOK && attached && visible;
  }
}
