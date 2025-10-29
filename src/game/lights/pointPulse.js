import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

export class PointPulse extends LightComponent {
  constructor(props = {}) {
    super(props);
    this.light = null;
    this.time = 0;
    this.quality = props.quality || { enableComplexShaders: true };
  }

  mount(scene) {
    // For LOW quality: Skip point light creation (no point lights)
    const isLowQuality = this.quality.pixelRatio <= 0.6 || this.quality.plantLightCount === 0;
    
    if (isLowQuality) {
      // LOW quality: Don't create point light - objects glow themselves
      console.log('💡 PointPulse skipped for LOW quality (no point lights)');
      this._mounted = true;
      return;
    }
    
    const color = this.props.color ?? 0xffaa33;
    
    // Adjust intensity and distance based on quality - OPTIMIZED for range
    let intensity = this.props.intensity ?? 1.5; // Increased default
    let distance = this.props.distance ?? 40;    // Doubled default range!
    let decay = 2.0;
    
    if (!this.quality.enableComplexShaders) {
      // MEDIUM quality: Keep good range but efficient decay
      intensity *= 0.8;  // Only reduce by 20% (was 30%)
      distance *= 1.0;   // Keep full distance!
      decay = 2.5;       // Higher decay = less GPU cost
    } else {
      decay = 1.8;       // Gradual falloff for quality
    }
    
    this.light = new THREE.PointLight(color, intensity, distance, decay);
    const pos = this.props.position ?? [0, 4, 0];
    this.light.position.set(...pos);
    scene.add(this.light);
    this._mounted = true;
    
    console.log(`💡 PointPulse created: intensity=${intensity.toFixed(2)}, distance=${distance.toFixed(1)}, decay=${decay}`);
  }

  unmount(scene) {
    if (this.light) scene.remove(this.light);
    this.light = null;
    this._mounted = false;
  }

  update(delta) {
    if (!this.light) return;
    this.time += delta;
    const speed = this.props.speed ?? 2.0;
    const base = this.props.intensity ?? 1.0;
    this.light.intensity = base * (0.6 + 0.4 * Math.sin(this.time * speed));
  }
}
