import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

export class BasicLights extends LightComponent {
  constructor(props = {}) {
    super(props);
    this.dir = null;
    this.amb = null;
  }

  mount(scene) {
    // For LOW quality: Skip directional light, only use ambient
    // Check quality settings to determine if we should skip directional light
    const quality = this.props.quality || {};
    const isLowQuality = quality.pixelRatio <= 0.6 || quality.plantLightCount === 0;
    
    if (!isLowQuality) {
      // MEDIUM/HIGH quality: Create directional light
      this.dir = new THREE.DirectionalLight(this.props.color ?? 0xffffff, this.props.intensity ?? 0.1);
      const pos = this.props.direction ?? [10, 20, 10];
      this.dir.position.set(...pos);
      scene.add(this.dir);
    }

    // Always create ambient light (needed for LOW quality visibility)
    // Significantly increase intensity for LOW quality to illuminate entire map without point lights
    const ambientIntensity = isLowQuality 
      ? (this.props.ambientIntensity ?? 0.5) // Very bright ambient for LOW quality - illuminates entire map
      : (this.props.ambientIntensity ?? 0.05);
    
    this.amb = new THREE.AmbientLight(this.props.ambientColor ?? 0xe8e8e8, ambientIntensity);
    scene.add(this.amb);
    this._mounted = true;
  }

  unmount(scene) {
    if (this.dir) scene.remove(this.dir);
    if (this.amb) scene.remove(this.amb);
    this.dir = null;
    this.amb = null;
    this._mounted = false;
  }

  update(/*delta*/) {
    // static by default
  }
}
