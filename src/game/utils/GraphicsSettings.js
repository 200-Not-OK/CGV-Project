/**
 * GraphicsSettings Manager
 * Centralized control for all graphics settings
 * Handles: storage, loading, applying, listening for changes
 */

import * as THREE from 'three';

export class GraphicsSettings {
  constructor(game) {
    this.game = game;
    this.listeners = [];
    this.currentSettings = this.getDefaultSettings();
    
    // Load saved settings
    this.loadFromStorage();
    
    console.log('✅ GraphicsSettings manager initialized');
  }

  /**
   * Default settings (matches UI_PROPOSAL.md)
   */
  getDefaultSettings() {
    return {
      version: 1,
      preset: 'CUSTOM',
      
      rendering: {
        resolutionScale: 1.0,
        antiAlias: false,
        pixelPrecision: 'highp',
        updateThrottle: 0
      },
      
      shadows: {
        enabled: true,
        quality: 'MEDIUM',
        mapSize: 1024,
        type: 'PCFSoft',
        bias: -0.0001,
        distance: 100
      },
      
      shaders: {
        enhanced: true,
        complexity: 'FULL',
        toonEffect: 0.6,
        posterization: 5,
        hatchStrength: 0.22,
        grain: 0.035,
        saturation: 0.22,
        vibrance: 0.38,
        shadowLift: 0.08,
        rimIntensity: 0.18
      },
      
      environment: {
        skybox: true,
        skyQuality: 'MEDIUM',
        fog: true,
        fogDensity: 1.0,
        ambientBrightness: 1.0,
        environmentalLighting: true
      },
      
      lighting: {
        dynamicLights: true,
        maxCount: 3,
        intensity: 1.0,
        distance: 1.0
      },
      
      effects: {
        particles: true,
        quality: 'MEDIUM',
        count: 100,
        bloom: 1.0,
        fireflies: 12,
        flames: true,
        lightning: false
      },
      
      advanced: {
        frameRateTarget: 60,
        autoDowngrade: true,
        dynamicResolution: false,
        textureResolution: 'MEDIUM',
        drawDistance: 500
      }
    };
  }

  /**
   * Get quality tier presets
   */
  getPreset(tier) {
    const presets = {
      LOW: {
        preset: 'LOW',
        rendering: { resolutionScale: 0.5, antiAlias: false, pixelPrecision: 'mediump' },
        shadows: { enabled: false, quality: 'LOW', mapSize: 512 },
        shaders: { enhanced: false, complexity: 'OFF' },
        environment: { skyQuality: 'LOW', fog: true, fogDensity: 0.5 },
        lighting: { maxCount: 1, intensity: 0.8 },
        effects: { particles: false, quality: 'LOW', count: 30, flames: false, lightning: false },
        advanced: { frameRateTarget: 30 }
      },
      MEDIUM: {
        preset: 'MEDIUM',
        rendering: { resolutionScale: 0.75, antiAlias: false, pixelPrecision: 'highp' },
        shadows: { enabled: true, quality: 'MEDIUM', mapSize: 1024 },
        shaders: { enhanced: true, complexity: 'FULL' },
        environment: { skyQuality: 'MEDIUM', fog: true, fogDensity: 1.0 },
        lighting: { maxCount: 2, intensity: 1.0 },
        effects: { particles: true, quality: 'MEDIUM', count: 100, flames: true, lightning: false },
        advanced: { frameRateTarget: 60 }
      },
      HIGH: {
        preset: 'HIGH',
        rendering: { resolutionScale: 1.0, antiAlias: false, pixelPrecision: 'highp' },
        shadows: { enabled: true, quality: 'HIGH', mapSize: 2048 },
        shaders: { enhanced: true, complexity: 'FULL' },
        environment: { skyQuality: 'HIGH', fog: true, fogDensity: 1.0 },
        lighting: { maxCount: 3, intensity: 1.2 },
        effects: { particles: true, quality: 'HIGH', count: 200, flames: true, lightning: true },
        advanced: { frameRateTarget: 60 }
      }
    };
    return presets[tier] || this.getDefaultSettings();
  }

  /**
   * Apply a preset
   */
  applyPreset(tier) {
    const preset = this.getPreset(tier);
    this.currentSettings = this.deepMerge(this.currentSettings, preset);
    this.applyAllSettings();
    this.saveToStorage();
    this.notifyListeners('preset-changed', tier);
    console.log(`✅ Applied ${tier} quality preset`);
  }

  /**
   * Update a single setting
   */
  updateSetting(path, value) {
    this.setSetting(path, value);
    this.applySetting(path, value);
    this.saveToStorage();
    this.notifyListeners('setting-changed', { path, value });
  }

  /**
   * Deep merge settings object
   */
  deepMerge(target, source) {
    const result = JSON.parse(JSON.stringify(target));
    const merge = (tgt, src) => {
      for (const key in src) {
        if (src[key] !== null && typeof src[key] === 'object' && !Array.isArray(src[key])) {
          tgt[key] = merge(tgt[key] || {}, src[key]);
        } else {
          tgt[key] = src[key];
        }
      }
      return tgt;
    };
    return merge(result, source);
  }

  /**
   * Set setting value (doesn't apply or save yet)
   */
  setSetting(path, value) {
    const parts = path.split('.');
    let obj = this.currentSettings;
    for (let i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
  }

  /**
   * Get setting value
   */
  getSetting(path) {
    const parts = path.split('.');
    let obj = this.currentSettings;
    for (const part of parts) {
      obj = obj[part];
    }
    return obj;
  }

  /**
   * Apply all current settings to game systems
   */
  applyAllSettings() {
    console.log('🎨 Applying all graphics settings...');
    
    // Apply rendering settings
    this.applyRenderingSettings();
    
    // Apply shadow settings
    this.applyShadowSettings();
    
    // Apply shader settings
    this.applyShaderSettings();
    
    // Apply environment settings
    this.applyEnvironmentSettings();
    
    // Apply lighting settings
    this.applyLightingSettings();
    
    // Apply effects settings
    this.applyEffectsSettings();
    
    console.log('✅ All graphics settings applied');
  }

  /**
   * Apply individual setting
   */
  applySetting(path, value) {
    const section = path.split('.')[0];
    
    switch (section) {
      case 'rendering':
        this.applyRenderingSettings();
        break;
      case 'shadows':
        this.applyShadowSettings();
        break;
      case 'shaders':
        this.applyShaderSettings();
        break;
      case 'environment':
        this.applyEnvironmentSettings();
        break;
      case 'lighting':
        this.applyLightingSettings();
        break;
      case 'effects':
        this.applyEffectsSettings();
        break;
      case 'advanced':
        this.applyAdvancedSettings();
        break;
    }
  }

  /**
   * Apply rendering settings
   */
  applyRenderingSettings() {
    const { renderer } = this.game;
    const s = this.currentSettings.rendering;
    
    if (!renderer) return;
    
    // Resolution scale
    renderer.setPixelRatio(s.resolutionScale);
    
    // Precision (would need re-init for real effect, but we can log it)
    if (s.pixelPrecision !== 'highp') {
      console.log(`💡 Pixel precision set to ${s.pixelPrecision} (requires renderer restart)`);
    }
    
    console.log(`✅ Rendering: Resolution ${s.resolutionScale}x, Precision ${s.pixelPrecision}`);
  }

  /**
   * Apply shadow settings
   */
  applyShadowSettings() {
    const { renderer, scene, shaderSystem } = this.game;
    const s = this.currentSettings.shadows;
    
    if (!renderer || !scene) return;
    
    // Shadow enabled
    renderer.shadowMap.enabled = s.enabled;
    
    if (!s.enabled) {
      console.log('✅ Shadows: Disabled');
      return;
    }
    
    // Shadow type
    const typeMap = {
      'BasicShadow': THREE.BasicShadowMap,
      'PCF': THREE.PCFShadowMap,
      'PCFSoft': THREE.PCFSoftShadowMap
    };
    renderer.shadowMap.type = typeMap[s.type] || THREE.PCFSoftShadowMap;
    
    // Find shadow light and update
    let shadowLight = null;
    scene.traverse((obj) => {
      if (obj.isLight && obj.castShadow && !shadowLight) {
        shadowLight = obj;
      }
    });
    
    if (shadowLight) {
      shadowLight.shadow.mapSize.width = s.mapSize;
      shadowLight.shadow.mapSize.height = s.mapSize;
      shadowLight.shadow.bias = s.bias;
      shadowLight.shadow.camera.far = s.distance;
    }
    
    console.log(`✅ Shadows: ${s.type}, Size ${s.mapSize}x${s.mapSize}, Distance ${s.distance}m`);
  }

  /**
   * Apply shader settings
   */
  applyShaderSettings() {
    const { shaderSystem } = this.game;
    const s = this.currentSettings.shaders;
    
    if (!shaderSystem) return;
    
    // Enhanced shaders
    const isCurrentlyEnabled = shaderSystem.isEnabled();
    if (s.enhanced && !isCurrentlyEnabled) {
      shaderSystem.toggleShaders();
      console.log('✅ Shaders: Enabled');
    } else if (!s.enhanced && isCurrentlyEnabled) {
      shaderSystem.toggleShaders();
      console.log('✅ Shaders: Disabled');
    }
    
    // Apply toon settings
    const toonSettings = {
      posterizeLevels: s.posterization,
      toonDiffuseSteps: s.posterization,
      toonSoftness: 0.18,
      hatchStrength: s.hatchStrength,
      hatchScale: 2.2,
      hatchContrast: 1.2,
      boilStrength: s.hatchStrength * 0.2,
      grainStrength: s.grain,
      saturationBoost: s.saturation,
      vibrance: s.vibrance,
      shadowLift: s.shadowLift,
      exposure: 1.0,
      rimIntensity: s.rimIntensity
    };
    
    shaderSystem.applyToonSettings(toonSettings);
    console.log(`✅ Shaders: Toon=${s.toonEffect}x, Hatch=${s.hatchStrength}`);
  }

  /**
   * Apply environment settings
   */
  applyEnvironmentSettings() {
    const { scene, shaderSystem } = this.game;
    const s = this.currentSettings.environment;
    
    if (!scene || !shaderSystem) return;
    
    // Fog
    if (s.fog) {
      const fogColor = 0x000510;
      const fogStart = 30 * (1 / s.fogDensity);
      const fogEnd = 150 * (1 / s.fogDensity);
      
      if (!scene.fog) {
        scene.fog = new THREE.Fog(fogColor, fogStart, fogEnd);
      } else {
        scene.fog.near = fogStart;
        scene.fog.far = fogEnd;
      }
      console.log(`✅ Environment: Fog enabled, Density ${s.fogDensity}x`);
    } else {
      scene.fog = null;
      console.log('✅ Environment: Fog disabled');
    }
    
    // Ambient brightness (multiplier on ambient light)
    let ambientLight = null;
    scene.traverse((obj) => {
      if (obj.isLight && obj.isAmbientLight) {
        ambientLight = obj;
      }
    });
    
    if (ambientLight) {
      ambientLight.intensity = Math.max(0.05, s.ambientBrightness * 0.05);
      console.log(`✅ Environment: Ambient brightness ${s.ambientBrightness}x`);
    }
  }

  /**
   * Apply lighting settings
   */
  applyLightingSettings() {
    const { lightManager, scene } = this.game;
    const s = this.currentSettings.lighting;
    
    if (!lightManager) {
      console.log('⚠️ LightManager not available');
      return;
    }
    
    // Update light manager quality settings
    const qualitySettings = this.game.gpuDetector?.getQualitySettings() || {};
    qualitySettings.plantLightCount = s.maxCount;
    qualitySettings.plantLightIntensity = s.intensity * 10;
    qualitySettings.plantLightDistance = s.distance * 100;
    
    lightManager.setQualitySettings(qualitySettings);
    console.log(`✅ Lighting: ${s.maxCount} lights, Intensity ${s.intensity}x, Distance ${s.distance}x`);
  }

  /**
   * Apply effects settings
   */
  applyEffectsSettings() {
    const { lightManager } = this.game;
    const s = this.currentSettings.effects;
    
    if (!lightManager) return;
    
    // Note: Effect toggles would require re-loading the level
    // For now, we just log what would happen
    console.log(`✅ Effects: Particles ${s.particles ? 'ON' : 'OFF'}, Count ${s.count}%, Bloom ${s.bloom}x`);
    
    if (!s.flames) {
      console.log('⚠️ Flames disabled (requires level reload)');
    }
    if (!s.lightning && s.lightning !== false) {
      console.log('⚠️ Lightning setting changed (requires level reload)');
    }
  }

  /**
   * Apply advanced settings
   */
  applyAdvancedSettings() {
    const s = this.currentSettings.advanced;
    console.log(`✅ Advanced: FPS Target ${s.frameRateTarget}, Auto-downgrade ${s.autoDowngrade ? 'ON' : 'OFF'}`);
  }

  /**
   * Save settings to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('graphics-settings', JSON.stringify(this.currentSettings));
      console.log('💾 Graphics settings saved to localStorage');
    } catch (e) {
      console.warn('⚠️ Failed to save graphics settings:', e.message);
    }
  }

  /**
   * Load settings from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('graphics-settings');
      if (saved) {
        const loaded = JSON.parse(saved);
        this.currentSettings = this.deepMerge(this.currentSettings, loaded);
        console.log('✅ Graphics settings loaded from localStorage');
        return true;
      }
    } catch (e) {
      console.warn('⚠️ Failed to load graphics settings:', e.message);
    }
    return false;
  }

  /**
   * Reset to defaults
   */
  resetToDefaults() {
    this.currentSettings = this.getDefaultSettings();
    this.applyAllSettings();
    this.saveToStorage();
    this.notifyListeners('reset-to-defaults');
    console.log('🔄 Graphics settings reset to defaults');
  }

  /**
   * Export settings as JSON
   */
  exportSettings() {
    return JSON.stringify(this.currentSettings, null, 2);
  }

  /**
   * Import settings from JSON
   */
  importSettings(json) {
    try {
      const imported = JSON.parse(json);
      this.currentSettings = this.deepMerge(this.currentSettings, imported);
      this.applyAllSettings();
      this.saveToStorage();
      this.notifyListeners('settings-imported');
      console.log('✅ Settings imported successfully');
      return true;
    } catch (e) {
      console.error('❌ Failed to import settings:', e.message);
      return false;
    }
  }

  /**
   * Listen for setting changes
   */
  listen(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(eventType, data) {
    this.listeners.forEach((callback) => {
      try {
        callback({ eventType, data, settings: this.currentSettings });
      } catch (e) {
        console.error('Error in settings listener:', e);
      }
    });
  }

  /**
   * Get all current settings as object
   */
  getAll() {
    return JSON.parse(JSON.stringify(this.currentSettings));
  }

  /**
   * Get settings as readable text
   */
  getSettingsReport() {
    return `
📊 Graphics Settings Report
===========================

RENDERING
---------
  Resolution Scale: ${this.currentSettings.rendering.resolutionScale}x
  Anti-Aliasing: ${this.currentSettings.rendering.antiAlias ? 'ON' : 'OFF'}
  Pixel Precision: ${this.currentSettings.rendering.pixelPrecision}

SHADOWS
-------
  Enabled: ${this.currentSettings.shadows.enabled ? 'YES' : 'NO'}
  Quality: ${this.currentSettings.shadows.quality}
  Map Size: ${this.currentSettings.shadows.mapSize}x${this.currentSettings.shadows.mapSize}
  Type: ${this.currentSettings.shadows.type}
  Bias: ${this.currentSettings.shadows.bias}
  Distance: ${this.currentSettings.shadows.distance}m

SHADERS
-------
  Enhanced: ${this.currentSettings.shaders.enhanced ? 'ON' : 'OFF'}
  Toon Effect: ${this.currentSettings.shaders.toonEffect}x
  Posterization: ${this.currentSettings.shaders.posterization}
  Hatching: ${this.currentSettings.shaders.hatchStrength}x
  Grain: ${this.currentSettings.shaders.grain}x
  Saturation: ${this.currentSettings.shaders.saturation}x

ENVIRONMENT
-----------
  Skybox: ${this.currentSettings.environment.skybox ? 'ON' : 'OFF'}
  Fog: ${this.currentSettings.environment.fog ? 'ON' : 'OFF'}
  Fog Density: ${this.currentSettings.environment.fogDensity}x
  Ambient Brightness: ${this.currentSettings.environment.ambientBrightness}x

LIGHTING
--------
  Dynamic Lights: ${this.currentSettings.lighting.dynamicLights ? 'YES' : 'NO'}
  Max Light Count: ${this.currentSettings.lighting.maxCount}
  Intensity: ${this.currentSettings.lighting.intensity}x
  Distance: ${this.currentSettings.lighting.distance}x

EFFECTS
-------
  Particles: ${this.currentSettings.effects.particles ? 'ON' : 'OFF'}
  Particle Count: ${this.currentSettings.effects.count}%
  Bloom: ${this.currentSettings.effects.bloom}x
  Flames: ${this.currentSettings.effects.flames ? 'YES' : 'NO'}
  Lightning: ${this.currentSettings.effects.lightning ? 'YES' : 'NO'}

ADVANCED
--------
  FPS Target: ${this.currentSettings.advanced.frameRateTarget}
  Auto-Downgrade: ${this.currentSettings.advanced.autoDowngrade ? 'YES' : 'NO'}
  `;
  }
}
