// main.js
import { Game } from './game/game.js';
import { LevelCompleteOverlay } from './game/components/LevelCompleteOverlay.js';
import { levels as LEVELS } from './game/levelData.js'; // if default export, change accordingly

window.addEventListener('load', () => {
  const game = new Game();

  window.__GAME__ = game;
  window.togglePhysicsDebug = () =>
    game.physicsWorld.enableDebugRenderer(!game.physicsWorld.isDebugEnabled());
  window.toggleCombatDebug = () => game.combatSystem?.toggleDebug?.();
  
  // Performance monitoring debug commands
  window.showPerformance = () => game.performanceMonitor?.logStats();
  window.showDetailedPerformance = () => game.performanceMonitor?.logDetailedStats();
  window.togglePerformanceDisplay = () => game.performanceMonitor?.toggleStatsDisplay();
  window.performanceReport = () => game.performanceMonitor?.printOptimizationReport();

  // Build overlay with only the two levels requested
  const LVLS = Array.isArray(LEVELS) ? LEVELS : (LEVELS?.levels ?? []);
  const availableLevels = (LVLS || []).filter(l => ['Intro Level', 'Level 3'].includes(l.id));

  const overlay = new LevelCompleteOverlay({
    availableLevels,
    onReplay: () => {
      const id = game?.level?.data?.id;
      if (id) {
        // Lock cursor when loading new level
        if (document.pointerLockElement) {
          try { document.exitPointerLock(); } catch (e) { /* ignore */ }
        }
        game.loadLevel(game.levelManager.currentIndex);
      }
      game?.input?.setEnabled?.(true);
    },
    onSelect: (id) => {
      const idx = (LVLS || []).findIndex(l => l.id === id);
      if (idx >= 0) {
        // Lock cursor when loading new level
        if (document.pointerLockElement) {
          try { document.exitPointerLock(); } catch (e) { /* ignore */ }
        }
        game.loadLevel(idx);
      }
      game?.input?.setEnabled?.(true);
    }
  });

  // React to completion from either DOM custom event or internal bus
 window.addEventListener('level:complete', async (event) => {
  // Get level ID from event detail or game instance
  const levelId = event.detail?.levelId || game?.currentLevelId || game?.level?.data?.id;
  
  // 🚫 Skip victory sequence for level2_glitched
  if (levelId === 'level2_glitched') {
    console.log('🚫 Victory sequence skipped for level2_glitched in main.js');
    return; // Exit early, no victory screen
  }

  console.log('🏁 Level complete in main.js for level:', levelId);

  // Hide node counter UI when level completes
  const hud = game?.ui?.get('hud');
  if (hud && hud.showNodeCounter) {
    hud.showNodeCounter(false);
  }

  // Pause input while showing the UI
  game?.input?.setEnabled?.(false);

  // (a) trigger the level-complete cinematic if present and wait for it to finish
  if (game?.level?.cinematicsManager) {
    console.log('⏳ Waiting for level complete cinematic to finish...');
    await game.level.cinematicsManager.playCinematic('onLevelComplete');
    console.log('✅ Cinematic finished');
  }

  // (b) play success VO (can play during or after cinematic)
  if (game?.soundManager?.sfx?.['vo-success']) {
    game.playVoiceover('vo-success', 6000);
  }

  // (c) Show victory overlay after 8 second delay
  console.log('⏱️ Waiting 8 seconds before showing victory overlay...');
  await new Promise(resolve => setTimeout(resolve, 8000));
  console.log('🏆 Showing victory overlay');
  
  // Unlock cursor so user can interact with buttons
  if (document.pointerLockElement) {
    try { document.exitPointerLock(); } catch (e) { /* ignore */ }
  }
  
  game._showVictoryOverlay?.();
  game?.input?.setEnabled?.(true);
});

  if (game?.events?.on) {
    game.events.on('level:complete', () => {
      window.dispatchEvent(new CustomEvent('level:complete'));
    });
  }
});
