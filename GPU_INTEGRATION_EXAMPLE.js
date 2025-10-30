/**
 * GPU Quality System - Integration Example
 * Drop this code into your game.js constructor to enable automatic quality detection
 */

// ============================================
// STEP 1: Add import at the top of game.js
// ============================================
import { initGPUDetector, getGPUDetector } from './utils/gpuDetector.js';

// ============================================
// STEP 2: In your Game constructor, after creating renderer
// ============================================
export class Game {
  constructor() {
    // ... existing code ...
    const { scene, renderer, shaderSystem } = createSceneAndRenderer();
    this.scene = scene;
    this.renderer = renderer;
    this.shaderSystem = shaderSystem;

    // NEW: Initialize GPU detector and get quality settings
    console.log('🔍 Detecting GPU capabilities...');
    this.gpuDetector = initGPUDetector(this.renderer);
    this.qualitySettings = this.gpuDetector.getQualitySettings();
    
    console.log(`🎮 GPU Detected: ${this.gpuDetector.info.renderer}`);
    console.log(`⚙️ Quality Tier: ${this.gpuDetector.tier}`);
    console.log(`📊 Quality Settings:`, this.qualitySettings);

    // NEW: Apply quality settings to renderer
    this.renderer.setPixelRatio(this.qualitySettings.pixelRatio);
    
    // Optional: Adjust antialiasing based on quality
    // Note: This requires recreating the renderer, so it's better to do this
    // in scene.js when creating the renderer initially
    
    // ... rest of existing initialization ...
    this.physicsWorld = new PhysicsWorld(this.scene, {
      useAccurateCollision: false,
      debugMode: false
    });

    this.input = new InputManager(window);
    this.levelManager = new LevelManager(this.scene, this.physicsWorld, this);
    
    // ... more existing code ...
    
    // MODIFIED: Pass quality settings to LightManager
    // Change this line:
    // this.lights = new LightManager(this.scene);
    // To:
    this.lights = new LightManager(this.scene, this.qualitySettings);

    // ... rest of existing code ...
  }

  // ============================================
  // STEP 3: Optional - Add quality change method
  // ============================================
  
  /**
   * Change quality settings at runtime
   * @param {string} tier - 'LOW', 'MEDIUM', or 'HIGH'
   */
  changeQuality(tier) {
    const { QualityPresets } = require('./utils/gpuDetector.js');
    const newQuality = QualityPresets[tier];
    
    if (!newQuality) {
      console.error(`Invalid quality tier: ${tier}`);
      return;
    }

    console.log(`🎮 Changing quality to ${tier}...`);
    this.qualitySettings = newQuality;
    this.lights.setQualitySettings(newQuality);
    this.renderer.setPixelRatio(newQuality.pixelRatio);
    
    // Note: Existing lights won't update automatically
    // You'll need to recreate them if you want them to use new settings
    console.log(`⚠️ Existing lights not updated. Reload level to apply changes.`);
  }

  // ============================================
  // STEP 4: Optional - Add benchmark method
  // ============================================
  
  /**
   * Run performance benchmark to verify quality settings
   */
  async runBenchmark() {
    console.log('🏃 Running performance benchmark...');
    const results = await this.gpuDetector.benchmark(
      this.scene,
      this.activeCamera,
      this.renderer
    );
    
    console.log(`📊 Benchmark Results:
      FPS: ${results.fps.toFixed(1)}
      Avg Frame Time: ${results.avgFrameTime.toFixed(2)}ms
      Recommended Tier: ${results.tier}
    `);
    
    // Auto-apply if tier changed
    if (results.tier !== this.gpuDetector.tier) {
      console.log(`⚡ GPU tier changed from ${this.gpuDetector.tier} to ${results.tier}`);
      this.qualitySettings = this.gpuDetector.getQualitySettings();
      this.lights.setQualitySettings(this.qualitySettings);
    }
    
    return results;
  }

  // ============================================
  // STEP 5: Optional - Add FPS monitoring
  // ============================================
  
  /**
   * Monitor FPS and auto-downgrade quality if needed
   */
  monitorPerformance() {
    let fpsHistory = [];
    const FPS_CHECK_INTERVAL = 5000; // Check every 5 seconds
    const LOW_FPS_THRESHOLD = 25;
    const FPS_SAMPLE_SIZE = 60;
    
    setInterval(() => {
      if (this.performanceMonitor && this.performanceMonitor.fps) {
        fpsHistory.push(this.performanceMonitor.fps);
        
        if (fpsHistory.length > FPS_SAMPLE_SIZE) {
          fpsHistory.shift();
        }
        
        // Calculate average FPS
        const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
        
        // Auto-downgrade if FPS is consistently low
        if (avgFPS < LOW_FPS_THRESHOLD) {
          if (this.gpuDetector.tier === 'MEDIUM') {
            console.warn(`⚠️ Low FPS detected (${avgFPS.toFixed(1)}). Downgrading to LOW quality.`);
            this.changeQuality('LOW');
            fpsHistory = []; // Reset history
          } else if (this.gpuDetector.tier === 'HIGH') {
            console.warn(`⚠️ Low FPS detected (${avgFPS.toFixed(1)}). Downgrading to MEDIUM quality.`);
            this.changeQuality('MEDIUM');
            fpsHistory = []; // Reset history
          }
        }
      }
    }, FPS_CHECK_INTERVAL);
  }
}

// ============================================
// EXAMPLE: Using in a level
// ============================================

class Level {
  async initializeLights(lightManager) {
    // Add lights normally - they'll automatically use quality settings!
    
    // Plant lights will automatically adjust:
    // - LOW: 4 roots, 8 petals, 12 leaves, 30 moss, 10 fireflies
    // - MEDIUM: 6 roots, 12 petals, 18 leaves, 80 moss, 20 fireflies
    // - HIGH: 8 roots, 16 petals, 24 leaves, 150 moss, 35 fireflies
    await lightManager.add('plant1', LightModules.CastleBioluminescentPlant, {
      position: [10, 0, 20]
    });

    // Flame particles will adjust particle count:
    // - LOW: 20 particles
    // - MEDIUM/HIGH: 50 particles
    await lightManager.add('flame1', LightModules.FlameParticles, {
      position: [0, 2, 0],
      height: 2.0
    });

    // You can still override quality for specific lights
    await lightManager.add('hero-plant', LightModules.CastleBioluminescentPlant, {
      position: [0, 0, 0],
      quality: {
        plantInstanceCounts: {
          roots: 8,
          petals: 16,
          leaves: 24,
          moss: 150,
          fireflies: 35
        },
        plantFireflySize: 40.0,
        enableComplexShaders: true
      }
    });
  }
}

// ============================================
// TESTING
// ============================================

// Open browser console and run:
// game.runBenchmark()           // Run performance test
// game.changeQuality('LOW')      // Force LOW quality
// game.changeQuality('MEDIUM')   // Force MEDIUM quality
// game.changeQuality('HIGH')     // Force HIGH quality
// getGPUDetector()              // Get detector info

