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

  // Debug function to pickup all chests in current level
  window.debugPickupAllChests = () => {
    if (!game.collectiblesManager) {
      console.error('❌ CollectiblesManager not found');
      return;
    }
    const currentLevel = game?.currentLevelId || game?.level?.data?.id || 'unknown';
    console.log(`🐛 DEBUG: Attempting to pickup all chests in level: ${currentLevel}`);
    return game.collectiblesManager.debugPickupAllChests();
  };

  // Convenience functions for specific levels
  window.debugPickupLevel3Chests = () => {
    const currentLevel = game?.currentLevelId || game?.level?.data?.id;
    if (currentLevel !== 'level3') {
      console.warn(`⚠️ Current level is ${currentLevel}, not level3. Use debugPickupAllChests() for current level.`);
      return;
    }
    return window.debugPickupAllChests();
  };

  window.debugPickupLevel1GlitchedChests = () => {
    const currentLevel = game?.currentLevelId || game?.level?.data?.id;
    if (currentLevel !== 'level1_glitched') {
      console.warn(`⚠️ Current level is ${currentLevel}, not level1_glitched. Use debugPickupAllChests() for current level.`);
      return;
    }
    return window.debugPickupAllChests();
  };

  window.debugPickupLevel2GlitchedChests = () => {
    const currentLevel = game?.currentLevelId || game?.level?.data?.id;
    if (currentLevel !== 'level2_glitched') {
      console.warn(`⚠️ Current level is ${currentLevel}, not level2_glitched. Use debugPickupAllChests() for current level.`);
      return;
    }
    return window.debugPickupAllChests();
  };

  console.log('🐛 Debug functions available:');
  console.log('  - debugPickupAllChests() - Pickup all chests in current level');
  console.log('  - debugPickupLevel3Chests() - Pickup all chests in level3 (must be in level3)');
  console.log('  - debugPickupLevel1GlitchedChests() - Pickup all chests in level1_glitched (must be in that level)');
  console.log('  - debugPickupLevel2GlitchedChests() - Pickup all chests in level2_glitched (must be in that level)');
  console.log('');
  console.log('📦 Chest counts by level:');
  console.log('  - level3: LLM chests (GPT, Claude, Gemini)');
  console.log('  - level1_glitched: 7 chests (4 potions + 3 LLMs)');
  console.log('  - level2_glitched: 2 chests (2 apples)');

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
