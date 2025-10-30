import * as THREE from 'three';
import { LightComponent } from '../lightComponent.js';

/**
 * Green Screen Detector for Level 1A
 * Detects green objects within a screen area defined by 4 corner coordinates
 * and creates animated white lights for confirmation
 */
export class GreenScreenDetector extends LightComponent {
    constructor(props = {}) {
        super(props);
        this.renderer = props.renderer || null;
        this.enabled = true;
        
        // 4 corner world positions defining the virtual screen
        this.screenCorners = [
            [35.484909425960545, 30.8651441500047, 22.4717848611322],    // Top-left
            [35.57087795590543, 10.134694229195324, 22.561146042872377], // Top-right
            [-35.69406646927268, 31.220272861220728, 22.531251308328468], // Bottom-left
            [-35.83602877147625, 9.826614275016725, 22.624876194995096]  // Bottom-right
        ];
        
        // Detection lights
        this.detectionLights = [];
        this.lastGreenCheck = 0;
        this.greenCheckInterval = 0.1; // Check every 100ms
        this.time = 0;
        
        // Screen plane properties
        this.screenPlane = null;
        this.screenBounds = null;
        this.screenNormal = null;
        this.screenCenter = null;
        
        // Detection settings
        this.sampleDensity = 0.2;
        this.greenLightCount = 12;
        this.greenLightRadius = 3.0;
    }

    async mount(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        scene.add(this.group);
        
        // Initialize screen plane
        this._initializeScreenPlane();
        
        console.log('🟢 Green Screen Detector mounted');
    }

    unmount(scene) {
        this._removeAllLights();
        if (this.group && this.group.parent) {
            this.group.parent.remove(this.group);
        }
        console.log('🟢 Green Screen Detector unmounted');
    }

    update(delta, camera = null) {
        if (!this.enabled || !this.scene || !camera) return;
        
        this.time += delta;
        
        // Check for green periodically
        if (this.time - this.lastGreenCheck >= this.greenCheckInterval) {
            this._checkForGreen(camera);
            this.lastGreenCheck = this.time;
        }
        
        // Update light animations
        this._updateLightAnimations(delta);
    }

    /**
     * Initialize the screen plane from the 4 corner coordinates
     */
    _initializeScreenPlane() {
        if (this.screenCorners.length !== 4) {
            console.warn('Screen corners must have exactly 4 points');
            return;
        }
        
        const corners = this.screenCorners.map(corner => new THREE.Vector3(...corner));
        
        // Calculate screen center
        this.screenCenter = new THREE.Vector3();
        corners.forEach(corner => this.screenCenter.add(corner));
        this.screenCenter.divideScalar(4);
        
        // Calculate screen normal
        const edge1 = corners[1].clone().sub(corners[0]);
        const edge2 = corners[2].clone().sub(corners[0]);
        this.screenNormal = edge1.cross(edge2).normalize();
        
        // Create screen plane
        this.screenPlane = new THREE.Plane().setFromCoplanarPoints(corners[0], corners[1], corners[2]);
        
        // Calculate screen bounds
        this.screenBounds = new THREE.Box3().setFromPoints(corners);
        this.screenBounds.expandByScalar(50); // Large expansion for detection
        
        console.log('🖥️ Screen plane initialized:', {
            center: this.screenCenter,
            normal: this.screenNormal
        });
    }

    /**
     * Check for green objects - simple direct scene traversal
     * Now checks BOTH meshes AND lights!
     */
    _checkForGreen(camera) {
        if (!this.scene || !camera) return;
        
        let greenDetected = false;
        let greenPositions = [];
        let checkCount = 0;
        
        // Direct scene traversal - check ALL objects (meshes AND lights)
        this.scene.traverse((obj) => {
            let isGreen = false;
            
            // Check for green MESHES
            if (obj.isMesh && obj.material) {
                checkCount++;
                isGreen = this._isObjectGreen(obj);
            
            // ALSO check for green LIGHTS (but ignore our own detection lights)
            } else if (obj.isLight && !obj.userData.isDetectionLight) {
                checkCount++;
                isGreen = this._isLightGreen(obj);
            }
            
            if (isGreen) {
                const worldPos = new THREE.Vector3();
                obj.getWorldPosition(worldPos);
                
                greenDetected = true;
                greenPositions.push(worldPos);
                console.log('🟢 GREEN DETECTED:', obj.name || 'unnamed', 'at', worldPos, obj.isLight ? '(LIGHT)' : '(MESH)');
            }
        });
        
        // Log detection status every few checks
        if (checkCount > 0 && Math.random() < 0.1) {
            console.log(`🔍 Checked ${checkCount} objects, green detected: ${greenDetected}`);
        }
        
        // Update lights based on detection
        if (greenDetected && this.detectionLights.length === 0) {
            console.log('⚪ Creating white detection lights...');
            this._createDetectionLights();
        } else if (!greenDetected && this.detectionLights.length > 0) {
            console.log('🔴 No green detected, removing lights...');
            this._removeAllLights();
        }
        
        // Update light positions if green detected
        if (greenDetected && this.detectionLights.length > 0 && greenPositions.length > 0) {
            this._updateLightPositions(greenPositions);
        }
    }

    /**
     * Check if an object is green - VERY permissive with extensive logging
     */
    _isObjectGreen(obj) {
        if (!obj.material) return false;
        
        const name = (obj.name || '').toLowerCase();
        
        // Check mesh name first
        if (name.includes('green') || name.includes('screen') || name.includes('greenscreen') || 
            name.includes('chroma') || name.includes('key') || name.includes('matte')) {
            console.log('🟢 Found green by name:', name);
            return true;
        }
        
        // Get the actual material (handle arrays)
        let material = obj.material;
        if (Array.isArray(material)) {
            material = material[0];
        }
        
        if (!material) return false;
        
        // Try multiple ways to get color
        try {
            let color = null;
            let colorSource = 'none';
            
            // Method 1: Standard material color
            if (material.color) {
                if (material.color.isColor) {
                    color = material.color;
                    colorSource = 'color';
                } else if (typeof material.color === 'number') {
                    color = new THREE.Color(material.color);
                    colorSource = 'color_hex';
                } else if (material.color.r !== undefined) {
                    color = material.color;
                    colorSource = 'color_object';
                }
            }
            
            // Method 2: Shader uniforms
            if (!color && material.uniforms) {
                if (material.uniforms.uColor && material.uniforms.uColor.value) {
                    color = material.uniforms.uColor.value;
                    colorSource = 'uniform_uColor';
                } else if (material.uniforms.uBaseColor && material.uniforms.uBaseColor.value) {
                    color = material.uniforms.uBaseColor.value;
                    colorSource = 'uniform_uBaseColor';
                } else if (material.uniforms.color && material.uniforms.color.value) {
                    color = material.uniforms.color.value;
                    colorSource = 'uniform_color';
                }
            }
            
            // Method 3: Try accessing via getHexString or similar
            if (!color && material.color && typeof material.color.getHex === 'function') {
                try {
                    const hex = material.color.getHex();
                    color = new THREE.Color(hex);
                    colorSource = 'color_getHex';
                } catch (e) {}
            }
            
            // Now check if color is green
            if (color) {
                let r, g, b;
                
                if (color.isColor || color instanceof THREE.Color) {
                    r = color.r;
                    g = color.g;
                    b = color.b;
                } else if (color.r !== undefined) {
                    r = color.r;
                    g = color.g;
                    b = color.b;
                } else {
                    return false;
                }
                
                // EXTREMELY lenient: if green is ANY amount higher
                if (g > r || g > b) {
                    console.log(`🟢 Potential green detected (${colorSource}):`, {
                        name: name || 'unnamed',
                        r: r.toFixed(3),
                        g: g.toFixed(3),
                        b: b.toFixed(3),
                        hex: color instanceof THREE.Color ? color.getHexString() : 'N/A'
                    });
                    
                    // If green is even slightly dominant, consider it green
                    if (g > 0.01) {
                        return true;
                    }
                }
                
                // Check hex value directly (more reliable)
                try {
                    const hex = color instanceof THREE.Color ? color.getHex() : 
                                (typeof color === 'number' ? color : null);
                    if (hex !== null) {
                        // Check for any shade of green (0x00ff00 to 0x00ffff, and variations)
                        if ((hex >= 0x008000 && hex <= 0x00ffff) || 
                            (hex >= 0x80ff80 && hex <= 0x80ffff)) {
                            console.log(`🟢 Green detected by hex (${colorSource}):`, {
                                name: name || 'unnamed',
                                hex: '0x' + hex.toString(16)
                            });
                            return true;
                        }
                    }
                } catch (e) {}
            }
            
            // Check emissive color
            if (material.emissive) {
                let emissiveColor = null;
                if (material.emissive.isColor) {
                    emissiveColor = material.emissive;
                } else if (typeof material.emissive === 'number') {
                    emissiveColor = new THREE.Color(material.emissive);
                }
                
                if (emissiveColor) {
                    const r = emissiveColor.r;
                    const g = emissiveColor.g;
                    const b = emissiveColor.b;
                    
                    if (g > r || g > b) {
                        console.log(`🟢 Green detected by emissive:`, {
                            name: name || 'unnamed',
                            r: r.toFixed(3),
                            g: g.toFixed(3),
                            b: b.toFixed(3)
                        });
                        return true;
                    }
                }
            }
            
        } catch (e) {
            // Log errors for debugging
            if (Math.random() < 0.01) { // Log 1% of errors to avoid spam
                console.warn('Material check error for:', name || 'unnamed', e);
            }
        }
        
        return false;
    }
    
    /**
     * Check if a light object is green
     */
    _isLightGreen(obj) {
        if (!obj.isLight) return false;
        
        if (!obj.color || !obj.color.isColor) {
            return false;
        }
        
        const color = obj.color;
        const r = color.r;
        const g = color.g;
        const b = color.b;
        
        // Is green the dominant color and "bright" enough?
        if (g > r && g > b && g > 0.1) {
            console.log(`🟢 Green LIGHT detected:`, {
                name: obj.name || 'unnamed',
                type: obj.type,
                r: r.toFixed(3),
                g: g.toFixed(3),
                b: b.toFixed(3),
                hex: color.getHexString()
            });
            return true;
        }
        
        // Also check hex value directly
        try {
            const hex = color.getHex();
            if ((hex >= 0x008000 && hex <= 0x00ffff) || 
                (hex >= 0x80ff80 && hex <= 0x80ffff)) {
                console.log(`🟢 Green LIGHT detected by hex:`, {
                    name: obj.name || 'unnamed',
                    type: obj.type,
                    hex: '0x' + hex.toString(16)
                });
                return true;
            }
        } catch (e) {}
        
        return false;
    }

    /**
     * Create white detection lights within screen area
     */
    _createDetectionLights() {
        this._removeAllLights();
        
        for (let i = 0; i < this.greenLightCount; i++) {
            const u = Math.random();
            const v = Math.random();
            const worldPos = this._screenUVToWorldPosition(u, v);
            
            if (worldPos) {
                const offset = new THREE.Vector3(
                    (Math.random() - 0.5) * this.greenLightRadius,
                    (Math.random() - 0.5) * this.greenLightRadius,
                    (Math.random() - 0.5) * this.greenLightRadius
                );
                
                const lightPos = worldPos.clone().add(offset);
                this._createLight(lightPos, i);
            }
        }
        
        console.log(`⚪ Created ${this.greenLightCount} white detection lights`);
    }

    /**
     * Create a single white detection light
     */
    _createLight(position, index) {
        const whiteLight = new THREE.PointLight(0xffffff, 5, 25);
        whiteLight.position.copy(position);
        whiteLight.castShadow = false;
        
        // Tag this light so we don't detect our own detection lights
        whiteLight.userData.isDetectionLight = true;
        
        whiteLight.userData.originalIntensity = 5;
        whiteLight.userData.animationTime = Math.random() * Math.PI * 2;
        whiteLight.userData.basePosition = position.clone();
        whiteLight.userData.orbitRadius = Math.random() * this.greenLightRadius;
        whiteLight.userData.orbitSpeed = 0.5 + Math.random() * 1.0;
        
        this.group.add(whiteLight);
        this.detectionLights.push(whiteLight);
    }

    /**
     * Convert screen UV to world position
     */
    _screenUVToWorldPosition(u, v) {
        if (!this.screenCorners || this.screenCorners.length !== 4) return null;
        
        const corners = this.screenCorners.map(corner => new THREE.Vector3(...corner));
        
        const topLeft = corners[0];
        const topRight = corners[1];
        const top = topLeft.clone().lerp(topRight, u);
        
        const bottomLeft = corners[2];
        const bottomRight = corners[3];
        const bottom = bottomLeft.clone().lerp(bottomRight, u);
        
        return top.lerp(bottom, v);
    }

    /**
     * Update light positions based on detected green
     */
    _updateLightPositions(greenPositions) {
        if (greenPositions.length === 0) return;
        
        this.detectionLights.forEach((light) => {
            if (light && light.userData) {
                const lightPos = light.position;
                let nearestGreen = null;
                let minDistance = Infinity;
                
                greenPositions.forEach(greenPos => {
                    const distance = lightPos.distanceTo(greenPos);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestGreen = greenPos;
                    }
                });
                
                if (nearestGreen) {
                    const targetPos = nearestGreen.clone();
                    const currentPos = lightPos.clone();
                    const newPos = currentPos.lerp(targetPos, 0.1);
                    light.userData.basePosition.copy(newPos);
                }
            }
        });
    }

    /**
     * Update light animations
     */
    _updateLightAnimations(delta) {
        this.detectionLights.forEach((light) => {
            if (light && light.userData) {
                light.userData.animationTime += delta;
                
                // Pulse animation
                const pulse = Math.sin(light.userData.animationTime * 3) * 0.5 + 0.5;
                const minIntensity = 3;
                const maxIntensity = 8;
                light.intensity = minIntensity + (maxIntensity - minIntensity) * pulse;
                
                // Keep white
                light.color.setHex(0xffffff);
                
                // Slight orbital motion
                const orbitX = Math.cos(light.userData.animationTime * light.userData.orbitSpeed) * light.userData.orbitRadius * 0.5;
                const orbitY = Math.sin(light.userData.animationTime * light.userData.orbitSpeed * 0.7) * light.userData.orbitRadius * 0.3;
                const orbitZ = Math.sin(light.userData.animationTime * light.userData.orbitSpeed * 1.3) * light.userData.orbitRadius * 0.2;
                
                const newPos = light.userData.basePosition.clone().add(new THREE.Vector3(orbitX, orbitY, orbitZ));
                light.position.copy(newPos);
            }
        });
    }

    /**
     * Remove all detection lights and unhide original green objects
     */
    _removeAllLights() {
        this.detectionLights.forEach(light => {
            if (light && light.parent) {
                light.parent.remove(light);
            }
        });
        this.detectionLights = [];
        
        // Unhide all the original green objects
        this.hiddenGreenObjects.forEach(obj => {
            if (obj) {
                obj.visible = true;
            }
        });
        console.log(`👁️ Restored ${this.hiddenGreenObjects.length} green object(s) to visibility`);
        this.hiddenGreenObjects = []; // Clear the list
    }
}

