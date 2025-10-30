import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

export class PointLight extends LightComponent {
  constructor(props = {}) {
    super(props);
    this.light = null;
  }

  mount(scene) {
    // Configure point light properties
    const color = this.props.color ?? 0xffffff;           // Light color (default: white)
    const intensity = this.props.intensity ?? 1.0;         // Light intensity (default: 1.0)
    const distance = this.props.distance ?? 0;             // 0 = infinite range, or set max distance
    const decay = this.props.decay ?? 2;                   // Physical light decay factor
    
    // Create the point light
    this.light = new THREE.PointLight(color, intensity, distance, decay);
    
    // Set position (required for point lights)
    const pos = this.props.position ?? [0, 0, 0];
    this.light.position.set(...pos);
    
    // Optional: Enable shadows
    if (this.props.castShadow !== false) {
      this.light.castShadow = true;
      this.light.shadow.mapSize.width = this.props.shadowMapSize ?? 512;
      this.light.shadow.mapSize.height = this.props.shadowMapSize ?? 512;
      // Use light distance for shadow far, or a reasonable default
      const shadowFar = this.props.shadowFar ?? (distance > 0 ? distance * 1.5 : 100);
      this.light.shadow.camera.near = this.props.shadowNear ?? 0.5;
      this.light.shadow.camera.far = shadowFar;
    }
    
    // Optional: Add visual helper sphere to see light position (useful for debugging)
    if (this.props.showHelper !== false && this.props.showHelper === true) {
      const helperGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const helperMaterial = new THREE.MeshBasicMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 1.0
      });
      const helperMesh = new THREE.Mesh(helperGeometry, helperMaterial);
      helperMesh.position.copy(this.light.position);
      scene.add(helperMesh);
      this.helperMesh = helperMesh;
      console.log('💡 PointLight helper sphere added at position:', pos);
    }
    
    scene.add(this.light);
    this._mounted = true;
    
    // Debug logging
    console.log('💡 PointLight mounted:', {
      position: pos,
      color: `0x${color.toString(16)}`,
      intensity: intensity,
      distance: distance,
      decay: decay,
      castShadow: this.light.castShadow,
      effectiveRange: distance > 0 ? `~${distance} units` : 'infinite'
    });
  }

  unmount(scene) {
    if (this.light) {
      scene.remove(this.light);
      this.light.dispose(); // Clean up if needed
    }
    if (this.helperMesh) {
      scene.remove(this.helperMesh);
      this.helperMesh.geometry.dispose();
      this.helperMesh.material.dispose();
      this.helperMesh = null;
    }
    this.light = null;
    this._mounted = false;
  }

  update(/*delta*/) {
    // Static light by default - no animation needed
    // Override if you want pulsing or moving lights
  }
}

