import * as THREE from 'three';
import { LightComponent } from './lightComponent.js';

export class LightManager {
  constructor(scene, qualitySettings = null) {
    this.scene = scene;
    this._instances = new Map();
    this.qualitySettings = qualitySettings; // Store quality settings for all lights
  }

  async add(key, ComponentClass, props = {}) {
    if (this._instances.has(key)) return this._instances.get(key);

    const moduleName = ComponentClass?.name;
    if (this._isFeatureDisabled(moduleName)) {
      console.log(`💡 Skipping ${moduleName} due to quality settings`);
      return null;
    }

    // Inject quality settings into props if available
    const finalProps = this.qualitySettings 
      ? { ...props, quality: props.quality || this.qualitySettings }
      : props;
    
    const inst = new ComponentClass(finalProps);
    if (!(inst instanceof LightComponent)) {
      // allow either subclassing LightComponent or a plain object with mount/unmount
    }
    if (inst.mount) {
      await inst.mount(this.scene);
    }
    this._instances.set(key, inst);
    return inst;
  }
  
  // Update quality settings for all existing lights
  setQualitySettings(qualitySettings) {
    this.qualitySettings = qualitySettings;
    console.log(`LightManager: Quality set to`, qualitySettings);
  }

  remove(key) {
    const inst = this._instances.get(key);
    if (!inst) return;
    inst.unmount && inst.unmount(this.scene);
    this._instances.delete(key);
  }

  clear() {
    for (const [k, inst] of this._instances) {
      inst.unmount && inst.unmount(this.scene);
    }
    this._instances.clear();
  }

  update(delta) {
    for (const inst of this._instances.values()) {
      inst.update && inst.update(delta);
    }
  }
  
  // Get all light instances for shadow management
  getAll() {
    return Object.fromEntries(this._instances);
  }

  _isFeatureDisabled(moduleName) {
    if (!moduleName || !this.qualitySettings || !this.qualitySettings.lightFeatureFlags) {
      return false;
    }

    const featureMap = {
      TechLights: 'techLights',
      FlameParticles: 'flameParticles',
      BinaryShader: 'binaryScreens',
      RedLightning: 'redLightning'
    };

    const flagKey = featureMap[moduleName];
    if (!flagKey) return false;
    return this.qualitySettings.lightFeatureFlags[flagKey] === false;
  }
}
