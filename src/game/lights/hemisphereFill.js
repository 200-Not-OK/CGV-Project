import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

export class HemisphereFill extends LightComponent {
  constructor(props = {}) {
    super(props);
    this.light = null;
    this.quality = props.quality || {};
  }

  mount(scene) {
    // Check if LOW quality - significantly increase intensity for overall map illumination
    const isLowQuality = this.quality.pixelRatio <= 0.6 || this.quality.plantLightCount === 0;
    const intensity = isLowQuality 
      ? (this.props.intensity ?? 0.3) // Much brighter for LOW quality to light entire map
      : (this.props.intensity ?? 0.01);
    
    this.light = new THREE.HemisphereLight(
      this.props.skyColor ?? 0xb1e1ff, 
      this.props.groundColor ?? 0x444444, 
      intensity
    );
    scene.add(this.light);
    this._mounted = true;
  }

  unmount(scene) {
    if (this.light) scene.remove(this.light);
    this.light = null;
    this._mounted = false;
  }
}
