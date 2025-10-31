/**
 * BossFightIntegrationHelper
 * Convenience helpers for integrating the boss fight system with LobberBossEnemy.
 * This file provides example integration patterns and utilities.
 */

import { BossPlatform } from './BossPlatform.js';
import { BossFightController } from './BossFightController.js';
import { BossMissileSpawner } from './BossMissileSpawner.js';
import { BossCameraRig } from './BossCameraRig.js';

/**
 * Setup a complete boss fight system
 * @param {Object} params
 * @param {any} params.bossEnemy - Instance of LobberBossEnemy
 * @param {any} params.scene - THREE.Scene
 * @param {any} params.world - CANNON.World
 * @param {any} params.player - Player instance
 * @param {any} params.thirdPersonCamera - ThirdPersonCamera instance
 * @param {any} [params.gltfLoader] - GLTFLoader for missile asset
 * @param {Object} [params.options] - Override defaults
 * @returns {{ platform, spawner, controller, cameraRig, start, stop, cleanup }}
 */
export function setupBossFight(params) {
  const {
    bossEnemy,
    scene,
    world,
    player,
    thirdPersonCamera,
    gltfLoader,
    options = {},
  } = params;

  // IMPORTANT: Do not up-scale boss mesh here to avoid collider mismatch.
  // If you need a different scale, set it via enemy options so its collider can be created appropriately.

  // Create platform
  const platform = new BossPlatform({
    size: options.platformSize || [60, 2, 60],
    position: options.platformPosition || { x: 0, y: 0, z: 0 },
    color: options.platformColor || 0x555555,
  });
  platform.addTo(scene, world);

  // Create missile spawner
  const spawner = new BossMissileSpawner({
    scene,
    world,
    loader: gltfLoader,
    poolSize: options.missilePoolSize || 64,
    missileScale: options.missileScale || 1,
    markerRadius: options.markerRadius || 1.2,
    // Place markers on the top surface of the platform (centerY + height/2)
    groundY: (typeof platform.getTopY === 'function'
      ? platform.getTopY()
      : ((platform?.body?.position?.y ?? platform?.mesh?.position?.y ?? (options.platformPosition?.y ?? 0)) + ((options.platformSize?.[1] ?? 2) / 2))),
    missileStartHeight: options.missileStartHeight || 22,
    assetPath: 'assets/enemies/lobber_boss/rocket.gltf',
    explosionFx: options.explosionFx,
  });

  // Hook missile impacts to player damage (adjust to your damage system)
  if (options.onMissileImpact) {
    spawner.onImpact = (spots, damage) => {
      const playerPos = player.mesh?.position || { x: 0, y: 0, z: 0 };
      const aoeRadius = options.aoeRadius || 3.0;
      for (const spot of spots) {
        const dx = spot.x - playerPos.x;
        const dz = spot.z - playerPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < aoeRadius) {
          options.onMissileImpact(damage);
        }
      }
    };
  }

  // Create camera rig
  const cameraRig = new BossCameraRig(thirdPersonCamera, {
    distance: options.cameraDistance || 20,
    pitch: options.cameraPitch || 0.3,
    heightOffset: options.cameraHeightOffset || 2.0,
  });

  // Lightweight screen-space Boss HUD (top bar)
  function createBossHud(title = 'Boss') {
    let root = null, fill = null, text = null;
    const mount = () => {
      if (typeof document === 'undefined' || root) return;
      root = document.createElement('div');
      root.style.cssText = 'position:fixed;left:50%;top:24px;transform:translateX(-50%);z-index:9999;pointer-events:none;min-width:420px;max-width:60vw;';
      const bar = document.createElement('div');
      bar.style.cssText = 'background:rgba(0,0,0,.6);border:2px solid #aa3333;border-radius:10px;overflow:hidden;';
      const track = document.createElement('div');
      track.style.cssText = 'width:100%;height:18px;position:relative;background:linear-gradient(90deg,#330000,#220000);';
      fill = document.createElement('div');
      fill.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:100%;background:linear-gradient(90deg,#ff5555,#cc2222);box-shadow:0 0 10px rgba(255,85,85,.6) inset;transition:width .15s ease;';
      track.appendChild(fill);
      const labelWrap = document.createElement('div');
      labelWrap.style.cssText = 'margin-top:6px;text-align:center;font:700 14px system-ui,Segoe UI,Arial;color:#ffdede;text-shadow:0 1px 2px #000;';
      text = document.createElement('div');
      text.textContent = title.toUpperCase();
      labelWrap.appendChild(text);
      bar.appendChild(track);
      bar.appendChild(labelWrap);
      root.appendChild(bar);
      document.body.appendChild(root);
    };
    const unmount = () => {
      if (!root) return;
      if (root.parentNode) root.parentNode.removeChild(root);
      root = null; fill = null; text = null;
    };
    const update = (health, max) => {
      if (!fill || !root) return;
      const pct = Math.max(0, Math.min(1, (max > 0 ? health / max : 1)));
      fill.style.width = `${(pct * 100).toFixed(1)}%`;
    };
    const setTitle = (t) => { if (text) text.textContent = (t||'Boss').toUpperCase(); };
    return { mount, unmount, update, setTitle };
  }
  const hud = createBossHud('Lobber Boss');

  // Store mixer reference on mesh for controller to update
  if (bossEnemy.mixer && bossEnemy.mesh) {
    bossEnemy.mesh.userData.mixer = bossEnemy.mixer;
  }

  // Extract animation refs from LobberBossEnemy
  const animationRefs = {
    attack: bossEnemy.animations?.attack,
    die1: bossEnemy.animations?.die1,
    move: bossEnemy.animations?.move,
  };

  // Create fight controller
  const controller = new BossFightController({
    bossMesh: bossEnemy.mesh,
    bossBody: bossEnemy.body,
    playerRef: player,
    missileSpawner: spawner,
    platformRef: platform,
    timings: options.timings || {
      slamWindup: 1.0,
      vulnerable: 4.0,
      recover: 1.0,
      waves: 3,
    },
    scaling: options.scaling || {
      baseMissiles: 6,
      missilesScale: 6,
      baseFireInterval: 0.5,
      maxRateMultiplier: 2.0,
    },
    damageWindow: options.damageWindow,
    animationRefs,
    events: {
      onStateChange: (state) => {
        console.log(`[BossFight] State: ${state}`);
        if (options.onStateChange) options.onStateChange(state);
      },
      onSlam: () => {
        if (options.onSlam) options.onSlam();
      },
      onLand: () => {
        if (options.onLand) options.onLand();
      },
      onTakeoff: () => {
        if (options.onTakeoff) options.onTakeoff();
      },
    },
  });

  // Sync boss health
  if (bossEnemy.health !== undefined) {
    controller.maxHealth = bossEnemy.health;
    controller.health = bossEnemy.health;
  }

  const start = () => {
    cameraRig.activate();
    controller.start();
    hud.mount();
  };

  const stop = () => {
    controller.stop();
    cameraRig.deactivate();
    hud.unmount();
  };

  const cleanup = () => {
    stop();
    spawner.dispose();
    platform.dispose(scene, world);
  };

  return {
    platform,
    spawner,
    controller,
    cameraRig,
    hud,
    start,
    stop,
    cleanup,
  };
}

