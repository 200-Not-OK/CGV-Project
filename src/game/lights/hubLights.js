import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

export class HubLights extends LightComponent {
  constructor(props = {}) {
    super(props);
    this.amb = null;
    this.dir = null;
  }

  mount(scene) {
    // Hub level uses ambient lighting
    const ambientIntensity = this.props.intensity ?? 0.8;
    const ambientColor = this.props.color ?? 0xffffff;
    
    this.amb = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(this.amb);

    // Add soft directional light for depth and dimension
    const dirLightIntensity = this.props.dirIntensity ?? 0.4;
    const dirLightColor = this.props.dirColor ?? 0xffffff;
    
    this.dir = new THREE.DirectionalLight(dirLightColor, dirLightIntensity);
    // Position the light from above and to the side
    this.dir.position.set(50, 80, 50);
    this.dir.target.position.set(0, 0, 0);
    scene.add(this.dir);
    scene.add(this.dir.target);
    
    this._mounted = true;
  }

  unmount(scene) {
    if (this.amb) scene.remove(this.amb);
    if (this.dir) {
      scene.remove(this.dir);
      scene.remove(this.dir.target);
    }
    this.amb = null;
    this.dir = null;
    this._mounted = false;
  }

  update(/*delta*/) {
    // static by default
  }
}
