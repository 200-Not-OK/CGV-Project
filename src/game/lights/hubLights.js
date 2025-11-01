import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

export class HubLights extends LightComponent {
  constructor(props = {}) {
    super(props);
    this.amb = null;
  }

  mount(scene) {
    // Hub level uses only ambient lighting
    const ambientIntensity = this.props.intensity ?? 0.8;
    const ambientColor = this.props.color ?? 0xffffff;
    
    this.amb = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(this.amb);
    this._mounted = true;
  }

  unmount(scene) {
    if (this.amb) scene.remove(this.amb);
    this.amb = null;
    this._mounted = false;
  }

  update(/*delta*/) {
    // static by default
  }
}
