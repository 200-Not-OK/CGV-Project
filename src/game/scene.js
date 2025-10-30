import * as THREE from 'three';
 import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
 import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import keepWatchUrl from './lights/keep_watch.glb?url';
import { ShaderSystem } from './shaderSystem.js';

// Global variable to enable/disable star shadows
export const ENABLE_STAR_SHADOWS = false; // Set to true to enable star shadows

const gltfLoader = new GLTFLoader();
const SUN_EYE_URL = keepWatchUrl;
 const SUN_EYE_ROTATION_OFFSET = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
let sunEyeAsset = null;
let sunEyeAssetPromise = null;

function loadSunEyeAsset() {
  if (sunEyeAsset) return Promise.resolve(sunEyeAsset);
  if (sunEyeAssetPromise) return sunEyeAssetPromise;
  sunEyeAssetPromise = new Promise((resolve, reject) => {
    gltfLoader.load(
      SUN_EYE_URL,
      (gltf) => {
        sunEyeAsset = gltf;
        resolve(gltf);
      },
      undefined,
      (error) => {
        console.error('Failed to load sun eye model:', error);
        sunEyeAssetPromise = null;
        reject(error);
      }
    );
  });
  return sunEyeAssetPromise;
}

function convertToBasicMaterial(material) {
  if (!material) return material;
  if (Array.isArray(material)) {
    return material.map((mat) => convertToBasicMaterial(mat));
  }
  const basic = new THREE.MeshBasicMaterial({
    map: material.map || null,
    color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
    transparent: material.transparent || false,
    opacity: material.opacity !== undefined ? material.opacity : 1.0,
    side: material.side !== undefined ? material.side : THREE.FrontSide,
    alphaMap: material.alphaMap || null,
    depthTest: material.depthTest,
    depthWrite: material.depthWrite
  });
  basic.toneMapped = false;
  if (basic.map) {
    basic.map.colorSpace = THREE.SRGBColorSpace;
    basic.map.needsUpdate = true;
  }
  return basic;
}

async function createSunEyeInstance() {
  const gltf = await loadSunEyeAsset();
  const eyeScene = gltf.scene.clone(true);
  eyeScene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
      child.material = convertToBasicMaterial(child.material);
      child.frustumCulled = false;
    }
  });

  // Center model
  const box = new THREE.Box3().setFromObject(eyeScene);
  const center = new THREE.Vector3();
  box.getCenter(center);
  eyeScene.position.sub(center);

  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const targetDiameter = 1400; // apparent size for distant sun eye
  const scale = targetDiameter / maxDim;

  const rig = new THREE.Object3D();
  rig.add(eyeScene);
  rig.scale.setScalar(scale);
  rig.traverse((child) => {
    if (child.isMesh) {
      child.material.needsUpdate = true;
      child.frustumCulled = false;
    }
  });
  rig.frustumCulled = false;

  return { rig, mesh: eyeScene, diameter: targetDiameter };
}

export function createSceneAndRenderer() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Set to black initially, will be replaced by HDRI

  // Skybox rotation properties (creates twinkling effect)
  let skyboxRotation = 0;
  const skyboxRotationSpeed = 0.0004; // Very slow for subtle twinkling
  let skyboxMeshFar = null; // Far layer - blue nebulae
  let skyboxMeshNear = null; // Near layer - asteroid field
  // Expose handles for external sky switching
  scene.userData.sky = { far: null, near: null, preset: 'dark', light: null };
  scene.userData.sun = null;
  scene.userData.sunFill = null;
  scene.userData.sunTarget = null;
  scene.userData.sunEye = null;

  // Renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: false, // Disable for better FPS
    powerPreference: 'high-performance',
    stencil: false, // Disable stencil buffer
    depth: true
  });
  
  renderer.capabilities.maxTextures = 16;
  console.log('💡 Renderer capabilities - Max lights will be determined by shader compilation');
  
  // Make the canvas fill the viewport
  const updateSize = () => {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    renderer.setSize(w, h);
    if (renderer.domElement && renderer.domElement.style) {
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.left = '0px';
      renderer.domElement.style.top = '0px';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.zIndex = '1';
      renderer.domElement.style.pointerEvents = 'auto';
    }
  };
  updateSize();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0)); // Restore for crisp visuals
  document.body.appendChild(renderer.domElement);

  // Enable shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.6;

  // Initialize shader system
const shaderSystem = new ShaderSystem(renderer, scene);

  // Load THREE separate HDRI textures for true parallax depth
  const rgbeLoader = new RGBELoader();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // Track loading progress
  let loadedCount = 0;
const totalTextures = 2; // Only 2 layers for better FPS

  // FAR LAYER - Blue Nebulae (furthest, slowest rotation)
  rgbeLoader.load(
    'assets/HDR_blue_nebulae-1 (1).hdr',
    (textureFar) => {
      textureFar.needsUpdate = true;
      textureFar.minFilter = THREE.LinearFilter; // Faster filtering
      textureFar.magFilter = THREE.LinearFilter;
      textureFar.generateMipmaps = false; // Skip mipmaps for performance
      
      const skyGeometryFar = new THREE.SphereGeometry(700, 24, 12); // Low-poly for maximum FPS
      const skyMaterialFar = new THREE.MeshBasicMaterial({
        map: textureFar,
        side: THREE.BackSide,
        fog: false,
        transparent: false,
        depthWrite: false, // Don't write depth to allow layering
        depthTest: true // MUST test depth so castle/objects occlude skybox
      });
      
      skyboxMeshFar = new THREE.Mesh(skyGeometryFar, skyMaterialFar);
      skyboxMeshFar.rotation.y = Math.PI;
      skyboxMeshFar.renderOrder = -3; // Render first
      scene.add(skyboxMeshFar);
      scene.userData.sky.far = skyboxMeshFar;
      
      loadedCount++;
      if (loadedCount === totalTextures) {
        pmremGenerator.dispose();
        console.log('🌌 Dual-layer HDRI skybox with rotation (twinkling effect)');
        console.log('💫 Far: Blue Nebulae | Near: Asteroid Field');
        console.log('✨ Slow rotation for star twinkling');
      }
    },
    undefined,
    (error) => console.error('Error loading far HDR:', error)
  );

  // NEAR LAYER - Asteroid Field (closest, faster parallax rotation)
  rgbeLoader.load(
    'assets/HDR_asteroid_field.hdr',
    (textureNear) => {
      textureNear.needsUpdate = true;
      textureNear.minFilter = THREE.LinearFilter; // Faster filtering
      textureNear.magFilter = THREE.LinearFilter;
      textureNear.generateMipmaps = false; // Skip mipmaps for performance
      
      const skyGeometryNear = new THREE.SphereGeometry(350, 24, 12); // Low-poly for maximum FPS
      const skyMaterialNear = new THREE.MeshBasicMaterial({
        map: textureNear,
        side: THREE.BackSide,
        fog: false,
        transparent: true,
        opacity: 0.35,
        depthWrite: false, // Don't write depth to allow layering
        depthTest: true, // MUST test depth so castle/objects occlude skybox
        blending: THREE.AdditiveBlending
      });
      
      skyboxMeshNear = new THREE.Mesh(skyGeometryNear, skyMaterialNear);
      skyboxMeshNear.rotation.y = Math.PI + 2.5;
      skyboxMeshNear.renderOrder = -2; // Render after far layer
      scene.add(skyboxMeshNear);
      scene.userData.sky.near = skyboxMeshNear;
      
      loadedCount++;
      if (loadedCount === totalTextures) {
        pmremGenerator.dispose();
        console.log('🌌 Dual-layer HDRI skybox with rotation (twinkling effect)');
        console.log('💫 Far: Blue Nebulae | Near: Asteroid Field');
        console.log('✨ Slow rotation for star twinkling');
      }
    },
    undefined,
    (error) => console.error('Error loading near HDR:', error)
  );

  console.log('💡 Ambient light disabled for darker scene');
  
  // Add dedicated directional light for CHARACTER SHADOWS on ground
  const shadowLight = new THREE.DirectionalLight(0xfff4e6, 0.0);
  shadowLight.position.set(150, 50, 50);
  // Do not allow this helper light to cast any shadows
  shadowLight.castShadow = false;
  
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  shadowLight.shadow.camera.near = 0.5;
  shadowLight.shadow.camera.far = 500;
  shadowLight.shadow.camera.left = -100;
  shadowLight.shadow.camera.right = 100;
  shadowLight.shadow.camera.top = 100;
  shadowLight.shadow.camera.bottom = -100;
  shadowLight.shadow.bias = -0.0001;
  shadowLight.shadow.normalBias = 0.02;
  
  scene.add(shadowLight);
  console.log('🌅 Shadow light added for character ground shadows');

  // Resize handler
  window.addEventListener('resize', () => {
    updateSize();
  });

  // Update function for skybox animation
  // Update function for skybox rotation (creates twinkling stars effect)
  const updateSkybox = (deltaTime) => {
    if (skyboxMeshFar && skyboxMeshNear) {
      skyboxRotation += skyboxRotationSpeed * (deltaTime / 16.67);
      
      skyboxMeshFar.rotation.y = Math.PI + (skyboxRotation * 0.1);
      skyboxMeshNear.rotation.y = Math.PI + 2.5 + (skyboxRotation * 0.5);
    }
  };

  return { scene, renderer, updateSkybox, shaderSystem };
}

// Lightweight preset switcher for per-level sky
export function setSkyPreset(scene, renderer, preset = 'dark') {
  if (!scene) return;
  const sky = scene.userData && scene.userData.sky ? scene.userData.sky : null;
  // Remove previous sun if any
  if (scene.userData && scene.userData.sun) {
    try { scene.remove(scene.userData.sun); } catch (e) { /* ignore */ }
    scene.userData.sun = null;
  }
  if (scene.userData && scene.userData.sunFill) {
    try { scene.remove(scene.userData.sunFill); } catch (e) { /* ignore */ }
    scene.userData.sunFill = null;
  }
  if (scene.userData && scene.userData.sunTarget) {
    try { scene.remove(scene.userData.sunTarget); } catch (e) { /* ignore */ }
    scene.userData.sunTarget = null;
  }
  if (scene.userData && scene.userData.topFillLight) {
    try { scene.remove(scene.userData.topFillLight); } catch (e) { /* ignore */ }
    scene.userData.topFillLight = null;
  }
  if (scene.userData && scene.userData.ambientFill) {
    try { scene.remove(scene.userData.ambientFill); } catch (e) { /* ignore */ }
    scene.userData.ambientFill = null;
  }
  if (scene.userData && scene.userData.sunEye) {
    try { const g = scene.userData.sunEye.group; if (g && g.parent) scene.remove(g); } catch (e) { /* ignore */ }
    scene.userData.sunEye = null;
  }
  // Remove custom HDR sky meshes if switching to simple color
  if (sky) {
    if (sky.far && sky.far.parent) scene.remove(sky.far);
    if (sky.near && sky.near.parent) scene.remove(sky.near);
    if (sky.light) {
      const lightEntry = sky.light;
      if (lightEntry.group && lightEntry.group.parent) {
        scene.remove(lightEntry.group);
      }
    }
    sky.far = null;
    sky.near = null;
    sky.light = null;
  }
  scene.environment = null;
  if (preset === 'light') {
    const sunDir = new THREE.Vector3(0.6, 0.8, 0.2).normalize();

    const skyGroup = new THREE.Group();

    const gradientGeom = new THREE.SphereGeometry(2200, 48, 24);
    const gradientMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x5fb7ff) },
        bottomColor: { value: new THREE.Color(0xa0e7ff) },
        hazeColor: { value: new THREE.Color(0xf5faff) },
        sunDir: { value: sunDir.clone() }
      },
      vertexShader: `
        varying vec3 vDir;
        void main(){
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vDir;
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 hazeColor;
        uniform vec3 sunDir;
        const float PI = 3.14159265;
        void main(){
          float h = clamp(vDir.y * 0.5 + 0.5, 0.0, 1.0);
          vec3 base = mix(bottomColor, topColor, pow(h, 1.35));
          float haze = smoothstep(0.15, 0.85, h);
          vec3 color = mix(base, hazeColor, haze * 0.4);
          float sunGlow = pow(max(dot(normalize(vDir), normalize(sunDir)), 0.0), 12.0);
          color += vec3(1.0, 0.93, 0.75) * sunGlow * 0.8;
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
    const gradientMesh = new THREE.Mesh(gradientGeom, gradientMaterial);
    gradientMesh.renderOrder = -6;
    gradientMesh.frustumCulled = false;
    skyGroup.add(gradientMesh);

    const cloudsGeom = new THREE.SphereGeometry(2000, 72, 36);
    const cloudsMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      uniforms: {
        uTime: { value: 0.0 },
        uCloudColor: { value: new THREE.Color(0xffffff) },
        uSkyTint: { value: new THREE.Color(0x8fc9ff) },
        uCoverage: { value: 0.5 },
        uSoftness: { value: 0.2 },
        uSunDir: { value: sunDir.clone() }
      },
      vertexShader: `
        varying vec3 vDir;
        void main(){
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vDir;
        uniform float uTime;
        uniform vec3 uCloudColor;
        uniform vec3 uSkyTint;
        uniform float uCoverage;
        uniform float uSoftness;
        uniform vec3 uSunDir;
        const float PI = 3.14159265;

        float hash(vec3 p){
          return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
        }

        float noise(vec3 p){
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float n000 = hash(i + vec3(0.0, 0.0, 0.0));
          float n100 = hash(i + vec3(1.0, 0.0, 0.0));
          float n010 = hash(i + vec3(0.0, 1.0, 0.0));
          float n110 = hash(i + vec3(1.0, 1.0, 0.0));
          float n001 = hash(i + vec3(0.0, 0.0, 1.0));
          float n101 = hash(i + vec3(1.0, 0.0, 1.0));
          float n011 = hash(i + vec3(0.0, 1.0, 1.0));
          float n111 = hash(i + vec3(1.0, 1.0, 1.0));
          float nx00 = mix(n000, n100, f.x);
          float nx10 = mix(n010, n110, f.x);
          float nx01 = mix(n001, n101, f.x);
          float nx11 = mix(n011, n111, f.x);
          float nxy0 = mix(nx00, nx10, f.y);
          float nxy1 = mix(nx01, nx11, f.y);
          return mix(nxy0, nxy1, f.z);
        }

        float fbm(vec3 p){
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main(){
          vec3 dir = normalize(vDir);
          vec2 uv = vec2(atan(dir.z, dir.x) / (2.0 * PI) + 0.5, dir.y * 0.5 + 0.5);
          vec2 flow = uv + vec2(uTime * 0.02, uTime * -0.015);
          float base = fbm(vec3(flow * 3.0, uTime * 0.12));
          float detail = fbm(vec3(flow * 6.0 + vec2(0.23, 0.71), uTime * 0.2));
          float clouds = mix(base, detail, 0.55);
          clouds = smoothstep(uCoverage - uSoftness, uCoverage + uSoftness, clouds);
          float sunHighlight = pow(max(dot(dir, normalize(uSunDir)), 0.0), 10.0);
          vec3 color = mix(uSkyTint, uCloudColor, clouds);
          color += vec3(1.0, 0.92, 0.76) * sunHighlight * 0.4;
          float alpha = clamp(clouds * 0.85 + sunHighlight * 0.25, 0.0, 1.0);
          gl_FragColor = vec4(color, alpha);
        }
      `
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeom, cloudsMaterial);
    cloudsMesh.renderOrder = -5;
    cloudsMesh.frustumCulled = false;
    skyGroup.add(cloudsMesh);

    scene.add(skyGroup);
    if (sky) {
      sky.light = {
        group: skyGroup,
        gradientMaterial,
        cloudMaterial: cloudsMaterial,
        rotationSpeed: 0.035
      };
      sky.preset = 'light';
    }
    scene.background = new THREE.Color(0x8fd4ff);
    // Disable all shadows for this light preset per request
    if (renderer && renderer.shadowMap) {
      renderer.shadowMap.enabled = false;
    }
    if (renderer) {
      renderer.toneMappingExposure = 0.95; // brighter toon exposure
    }
    // Add sun directional light and load eyeball model
    try {
      const sunGroup = new THREE.Group();
      const sunDistance = 800;
      sunGroup.position.copy(sunDir.clone().multiplyScalar(sunDistance));
      sunGroup.frustumCulled = false;

      const sunLight = new THREE.DirectionalLight(0xffe6b0, 7.2);
      sunLight.position.set(0, 0, 0);
       // Force no shadows from sun
       sunLight.castShadow = false;

      const target = new THREE.Object3D();
      target.position.set(0, 0, 0);
      scene.add(target);
      sunLight.target = target;
       sunGroup.add(sunLight);

      sunGroup.userData = { isSun: true };
      scene.add(sunGroup);
       scene.userData.sun = sunGroup;
       scene.userData.sunLight = sunLight;
      scene.userData.sunTarget = target;
      scene.userData.sunEye = {
        group: sunGroup,
        rig: null,
        mesh: null,
        direction: sunDir.clone(),
        distance: sunDistance,
        rotationOffset: SUN_EYE_ROTATION_OFFSET.clone(),
        radius: 0,
        lookOffset: new THREE.Vector3()
      };

      createSunEyeInstance()
        .then(({ rig, mesh, diameter }) => {
          if (!scene.userData || scene.userData.sun !== sunGroup || !scene.userData.sunEye) return;
          const sunData = scene.userData.sunEye;
          rig.position.set(0, 0, 0);
          rig.frustumCulled = false;
          sunGroup.add(rig);
         // Make the eye look toward the scene origin by default
         try { rig.lookAt(new THREE.Vector3(0, 0, 0)); } catch (e) {}
          sunData.rig = rig;
          sunData.mesh = mesh;
          sunData.radius = diameter * 0.5;
          if (sunData.rotationOffset) {
            sunData.rig.quaternion.multiply(sunData.rotationOffset);
          }
        })
        .catch((error) => {
          console.warn('Sun eye model failed to attach:', error);
        });

      // Add a global top-down cartoon fill light (no shadows)
      const topFill = new THREE.DirectionalLight(0xffffff, 1.1);
      topFill.position.set(0, 1000, 0);
      topFill.castShadow = false;
      const topTarget = new THREE.Object3D();
      topTarget.position.set(0, 0, 0);
      scene.add(topTarget);
      topFill.target = topTarget;
      scene.add(topFill);
      scene.userData.topFillLight = topFill;
      // Mild ambient to lift darkest areas
      const ambient = new THREE.AmbientLight(0xffffff, 0.22);
      scene.add(ambient);
      scene.userData.ambientFill = ambient;
    } catch (e) { /* ignore visual sun errors */ }
    return;
  }
  // default dark
  scene.background = new THREE.Color(0x000000);
  if (sky) sky.preset = 'dark';
   // Restore shadows for non-light preset
   if (renderer && renderer.shadowMap) {
     renderer.shadowMap.enabled = true;
   }
  if (renderer) {
    renderer.toneMappingExposure = 0.6;
  }
}

// Hide all lights except the eyeball sun for Level 3 light preset
export function enforceOnlySunLight(scene) {
  if (!scene || !scene.userData) return;
  const keepSun = scene.userData.sunLight || null;
  const keepTop = scene.userData.topFillLight || null;
  const keepAmbient = scene.userData.ambientFill || null;
  scene.traverse((obj) => {
    if (obj.isLight) {
      if (obj !== keepSun && obj !== keepTop && obj !== keepAmbient) {
        if (typeof obj.intensity === 'number') obj.intensity = 0;
        obj.visible = false;
        obj.castShadow = false;
      } else {
        obj.visible = true;
      }
    }
  });
}
