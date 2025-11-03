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
  const skyboxRotationSpeed = 0.025; // Slower rotation for Level 3
  let skyboxMeshFar = null; // Far layer - blue nebulae
  let skyboxMeshNear = null; // Near layer - asteroid field
  // Expose handles for external sky switching
  scene.userData.sky = { far: null, near: null, preset: 'dark', light: null };
  scene.userData.sun = null;
  scene.userData.sunFill = null;
  scene.userData.sunTarget = null;
  scene.userData.sunEye = null;
  scene.userData.sunEyeBlinker = null;

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
        depthTest: false // Disable depth test to prevent near-plane artifacts
      });
      
      skyboxMeshFar = new THREE.Mesh(skyGeometryFar, skyMaterialFar);
      skyboxMeshFar.rotation.y = Math.PI;
      // Revert inversion to avoid polar seam artifacts
      skyboxMeshFar.rotation.x = 0;
      // Prevent culling and pin to camera position to avoid frustum edge artifacts
      skyboxMeshFar.frustumCulled = false;
      skyboxMeshFar.onBeforeRender = (_renderer, _scene, camera) => {
        try { skyboxMeshFar.position.copy(camera.position); } catch (_) {}
      };
      skyboxMeshFar.renderOrder = -10;
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
        depthTest: false, // Disable depth test to prevent near-plane artifacts
        blending: THREE.AdditiveBlending
      });
      
      skyboxMeshNear = new THREE.Mesh(skyGeometryNear, skyMaterialNear);
      skyboxMeshNear.rotation.y = Math.PI + 2.5;
      // Revert inversion on near layer
      skyboxMeshNear.rotation.x = 0;
      // Prevent culling and pin to camera position to avoid frustum edge artifacts
      skyboxMeshNear.frustumCulled = false;
      skyboxMeshNear.onBeforeRender = (_renderer, _scene, camera) => {
        try { skyboxMeshNear.position.copy(camera.position); } catch (_) {}
      };
      // TEMP: hide near layer to test artifact source
      skyboxMeshNear.visible = false;
      skyboxMeshNear.renderOrder = -9;
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
    // Only rotate skybox for Level 3, not for other levels
    const currentLevelId = scene?.userData?.levelId;
    if (currentLevelId !== 'level3') {
      // For non-Level3, make sure HDR skyboxes are hidden
      if (skyboxMeshFar) skyboxMeshFar.visible = false;
      if (skyboxMeshNear) skyboxMeshNear.visible = false;
      return; // Stop rotation for all levels except Level 3
    }
    
    // For Level 3, use the light preset skybox (not HDR)
    // Only rotate if the 'light' preset is active
    const sky = scene?.userData?.sky;
    const lightPreset = sky?.light;
    
    if (lightPreset && lightPreset.group) {
      // Light preset is active, don't show HDR meshes
      if (skyboxMeshFar) skyboxMeshFar.visible = false;
      if (skyboxMeshNear) skyboxMeshNear.visible = false;
      // Light preset rotation is handled in shaderSystem.js
    } else {
      // No light preset, show HDR with rotation
      if (skyboxMeshFar && skyboxMeshNear) {
        skyboxMeshFar.visible = true;
        skyboxMeshNear.visible = true;
        skyboxRotation += skyboxRotationSpeed * (deltaTime / 16.67);
        
        // Level 3 slow constant rotation
        skyboxMeshFar.rotation.y = Math.PI + skyboxRotation;
        skyboxMeshNear.rotation.y = Math.PI + 2.5 + (skyboxRotation * 0.75);
      }
    }
  };

  return { scene, renderer, updateSkybox, shaderSystem };
}

// Lightweight preset switcher for per-level sky
export function setSkyPreset(scene, renderer, preset = 'dark') {
  if (!scene) return;
  
  console.log(`🌌 setSkyPreset called with preset: "${preset}"`);
  
  // Safety: never apply Level 3 'light' preset outside Level 3
  try {
    if (preset === 'light' && (!scene.userData || scene.userData.levelId !== 'level3')) {
      console.warn('⚠️ Attempted to set light preset outside Level 3, forcing dark preset');
      preset = 'dark';
    }
  } catch (_) {}
  
  // ALWAYS get fresh sky object or create new one - don't trust existing data
  if (!scene.userData) {
    scene.userData = {};
  }
  if (!scene.userData.sky) {
    scene.userData.sky = {};
  }
  const sky = scene.userData.sky;
  
  // Remove previous sun/light objects if any
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
    if (sky.far && sky.far.parent) {
      sky.far.visible = false;
      scene.remove(sky.far);
    }
    if (sky.near && sky.near.parent) {
      sky.near.visible = false;
      scene.remove(sky.near);
    }
    if (sky.light) {
      const lightEntry = sky.light;
      if (lightEntry.group && lightEntry.group.parent) {
        scene.remove(lightEntry.group);
      }
    }
    if (sky.panorama && sky.panorama.parent) {
      scene.remove(sky.panorama);
    }
    sky.far = null;
    sky.near = null;
    sky.light = null;
    sky.panorama = null;
  }
  scene.environment = null;
  // Clear any lingering HDR background from previous levels to prevent it from being restored by graphics settings
  if (scene.userData.hdrBackground) {
    delete scene.userData.hdrBackground;
  }
  if (scene.userData.hdrEnvironment) {
    delete scene.userData.hdrEnvironment;
  }
  // Force clear any existing background texture/mesh before setting new one
  scene.background = null;
  if (preset === 'light') {
    const sunDir = new THREE.Vector3(0.6, 0.8, 0.2).normalize();

    const skyGroup = new THREE.Group();

    const gradientGeom = new THREE.SphereGeometry(2200, 256, 128);
    const gradientMaterial = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x5fb7ff) },
        bottomColor: { value: new THREE.Color(0x9bd6ee) },
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

    const cloudsGeom = new THREE.SphereGeometry(2000, 256, 128);
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
        uSoftness: { value: 0.08 },
        uSunDir: { value: sunDir.clone() },
        uToonSteps: { value: 3.0 },
        uEdgeWidth: { value: 0.015 },
        uEdgeDark: { value: 0.25 },
        uScale: { value: 5.0 }
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
        uniform float uToonSteps;
        uniform float uEdgeWidth;
        uniform float uEdgeDark;
        uniform float uScale;
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
        
        mat3 rotY(float a){
          float c = cos(a), s = sin(a);
          return mat3(c,0.0,s, 0.0,1.0,0.0, -s,0.0,c);
        }
        mat3 rotX(float a){
          float c = cos(a), s = sin(a);
          return mat3(1.0,0.0,0.0, 0.0,c,-s, 0.0,s,c);
        }

        void main(){
          // Sample clouds in direction space to avoid UV seam
          vec3 dir = normalize(vDir);
          float t = uTime * 0.05;
          mat3 R = rotY(t);
          vec3 pd = normalize(R * dir);
          float base = fbm(pd * uScale);
          float detail = fbm(pd * (uScale * 2.0) + vec3(0.23, 0.71, 0.37));
          float raw = mix(base, detail, 0.55);
          float clouds = smoothstep(uCoverage - uSoftness, uCoverage + uSoftness, raw);

          // Toon quantization: 2-3 bands
          float steps = max(uToonSteps, 1.0);
          float q = floor(clouds * steps + 1e-5) / steps;

          // Seamless edge detection using small rotations
          float dAng = 0.006;
          vec3 dYawP = rotY(dAng) * dir;
          vec3 dYawN = rotY(-dAng) * dir;
          vec3 dPitP = rotX(dAng) * dir;
          vec3 dPitN = rotX(-dAng) * dir;
          float nYawP = mix(fbm(normalize(R * dYawP) * uScale), fbm(normalize(R * dYawP) * (uScale*2.0) + vec3(0.23,0.71,0.37)), 0.55);
          float nYawN = mix(fbm(normalize(R * dYawN) * uScale), fbm(normalize(R * dYawN) * (uScale*2.0) + vec3(0.23,0.71,0.37)), 0.55);
          float nPitP = mix(fbm(normalize(R * dPitP) * uScale), fbm(normalize(R * dPitP) * (uScale*2.0) + vec3(0.23,0.71,0.37)), 0.55);
          float nPitN = mix(fbm(normalize(R * dPitN) * uScale), fbm(normalize(R * dPitN) * (uScale*2.0) + vec3(0.23,0.71,0.37)), 0.55);
          float grad = length(vec2(nYawP - nYawN, nPitP - nPitN));
          float edge = smoothstep(uEdgeWidth, 0.0, grad);

          // Sun highlight
          float sunHighlight = pow(max(dot(dir, normalize(uSunDir)), 0.0), 8.0);

          // Compose color with toon bands
          vec3 color = mix(uSkyTint, uCloudColor, q);
          color += vec3(1.0, 0.92, 0.76) * sunHighlight * 0.25;
          // Darken edges for drawn outline look
          color = mix(color, color * (1.0 - uEdgeDark), edge);

          float alpha = clamp(q * 0.9 + sunHighlight * 0.15, 0.0, 1.0);
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
        rotationSpeed: 0.01 // Slower rotation for Level 3 sky
      };
      sky.preset = 'light';
    }
    scene.background = new THREE.Color(0x8fd4ff); // Light blue background with white clouds for Level 3
    // Disable all shadows for this light preset per request
    if (renderer && renderer.shadowMap) {
      renderer.shadowMap.enabled = false;
    }
    if (renderer) {
      renderer.toneMappingExposure = 0.68; // softer cartoon exposure
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
      const ambient = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(ambient);
      scene.userData.ambientFill = ambient;
    } catch (e) { /* ignore visual sun errors */ }
    return;
  }
  // default dark - set black background
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

export function disposeSky(scene, renderer) {
  try {
    console.log('🧹 Disposing ALL skybox resources...');
    
    const sky = scene.userData?.sky;
    
    // Remove and dispose sky meshes (far, near, light groups, panorama)
    if (sky?.mesh) {
      scene.remove(sky.mesh);
      if (sky.mesh.geometry) sky.mesh.geometry.dispose();
      if (sky.mesh.material) {
        if (Array.isArray(sky.mesh.material)) {
          sky.mesh.material.forEach(m => m.dispose());
        } else {
          sky.mesh.material.dispose();
        }
      }
    }
    
    if (sky?.far) {
      if (sky.far.parent) scene.remove(sky.far);
      if (sky.far.geometry) sky.far.geometry.dispose();
      if (sky.far.material) {
        if (Array.isArray(sky.far.material)) {
          sky.far.material.forEach(m => m.dispose());
        } else {
          sky.far.material.dispose();
        }
      }
    }
    
    if (sky?.near) {
      if (sky.near.parent) scene.remove(sky.near);
      if (sky.near.geometry) sky.near.geometry.dispose();
      if (sky.near.material) {
        if (Array.isArray(sky.near.material)) {
          sky.near.material.forEach(m => m.dispose());
        } else {
          sky.near.material.dispose();
        }
      }
    }
    
    if (sky?.light && sky.light.group) {
      if (sky.light.group.parent) scene.remove(sky.light.group);
      sky.light.group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }
    
    if (sky?.panorama) {
      if (sky.panorama.parent) scene.remove(sky.panorama);
      if (sky.panorama.geometry) sky.panorama.geometry.dispose();
      if (sky.panorama.material) {
        if (Array.isArray(sky.panorama.material)) {
          sky.panorama.material.forEach(m => m.dispose());
        } else {
          sky.panorama.material.dispose();
        }
      }
    }
    
    if (sky?.envTexture && sky.envTexture.dispose) {
      sky.envTexture.dispose();
    }
    
    // CRITICAL: Clear scene background texture
    if (scene.background) {
      if (scene.background.isTexture && scene.background.dispose) {
        console.log('🧹 Disposing scene.background texture');
        scene.background.dispose();
      }
      scene.background = null;
    }

    // Clear stored HDR textures
    if (scene.userData?.hdrBackground) {
      if (scene.userData.hdrBackground.dispose) {
        console.log('🧹 Disposing hdrBackground texture');
        scene.userData.hdrBackground.dispose();
      }
      scene.userData.hdrBackground = null;
    }

    if (scene.userData?.hdrEnvironment) {
      if (scene.userData.hdrEnvironment.dispose) {
        console.log('🧹 Disposing hdrEnvironment texture');
        scene.userData.hdrEnvironment.dispose();
      }
      scene.userData.hdrEnvironment = null;
    }

    // Clear environment/reflection map
    if (scene.environment) {
      if (scene.environment.dispose) {
        console.log('🧹 Disposing scene.environment');
        scene.environment.dispose();
      }
      scene.environment = null;
    }

    // Reset sky userData completely
    if (scene.userData) {
      scene.userData.sky = null;
    }

    // Flush renderer texture cache
    if (renderer?.initTexture) {
      renderer.initTexture(null);
    }
    
    console.log('✅ Skybox disposal complete');
  } catch (e) {
    console.warn('⚠️ disposeSky failed:', e);
  }
}


/**
 * Load a panorama sky texture for a level
 * Supports both HDR (.hdr) and regular image formats (.jpg, .png, etc.)
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {THREE.WebGLRenderer} renderer - The renderer
 * @param {string} textureUrl - URL to the panorama texture
 * @param {object} options - Optional settings (radius, rotation, etc.)
 * @returns {Promise} Resolves when sky is loaded
 */
export function loadPanoramaSky(scene, renderer, textureUrl, options = {}) {
  if (!scene || !textureUrl) {
    console.warn('⚠️ loadPanoramaSky: Missing scene or textureUrl');
    return Promise.reject(new Error('Missing scene or textureUrl'));
  }

  return new Promise((resolve, reject) => {
    console.log(`🌌 loadPanoramaSky: Loading "${textureUrl}"`);
    
    // FORCE fresh sky object - don't trust existing data
    if (!scene.userData) {
      scene.userData = {};
    }
    
    // Completely reset sky object
    scene.userData.sky = {
      far: null,
      near: null,
      preset: null,
      light: null,
      panorama: null
    };

    const sky = scene.userData.sky;
    
    // Clean up any existing sky meshes from scene (they shouldn't exist, but be safe)
    const objectsToRemove = [];
    scene.traverse((obj) => {
      if (obj.userData && (obj.userData.isSkyMesh || obj.userData.isSky || obj.userData.isPanoramaSky)) {
        objectsToRemove.push(obj);
      }
    });
    objectsToRemove.forEach(obj => {
      if (obj.parent) obj.parent.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose && m.dispose());
        } else if (obj.material.dispose) {
          obj.material.dispose();
        }
      }
    });

    // Dispose of old background texture if it exists
    if (scene.background) {
      if (scene.background.isTexture && scene.background.dispose) {
        console.log('🧹 Disposing old scene.background texture');
        scene.background.dispose();
      }
      scene.background = null;
    }

    // Dispose of old stored textures
    if (scene.userData.hdrBackground) {
      if (scene.userData.hdrBackground.dispose) {
        console.log('🧹 Disposing old hdrBackground');
        scene.userData.hdrBackground.dispose();
      }
      scene.userData.hdrBackground = null;
    }

    if (scene.userData.hdrEnvironment) {
      if (scene.userData.hdrEnvironment.dispose) {
        console.log('🧹 Disposing old hdrEnvironment');
        scene.userData.hdrEnvironment.dispose();
      }
      scene.userData.hdrEnvironment = null;
    }

    // Clear environment map
    if (scene.environment) {
      if (scene.environment.dispose) {
        console.log('🧹 Disposing old scene.environment');
        scene.environment.dispose();
      }
      scene.environment = null;
    }

    // Clear sky references
    sky.far = null;
    sky.near = null;
    sky.light = null;
    sky.panorama = null;

    // Determine if it's an HDR file or regular image
    const isHDR = textureUrl.toLowerCase().endsWith('.hdr');
    const radius = options.radius || 1000;
    const rotation = options.rotation || 0;

    if (isHDR) {
      // Load HDR using RGBELoader and set as scene background (no sky mesh)
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load(
        textureUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture; // Use background instead of geometry to avoid artifacts
          sky.panorama = null;
          sky.preset = 'panorama';
          // Store HDR textures for graphics settings toggle
          scene.userData.hdrBackground = texture;
          if (options.useAsEnvironment !== false && renderer) {
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();
            scene.userData.hdrEnvironment = pmremGenerator.fromEquirectangular(texture).texture;
            scene.environment = scene.userData.hdrEnvironment;
            pmremGenerator.dispose();
          }
          console.log('🌌 Panorama sky (HDR) set as scene.background:', textureUrl);
          resolve(null);
        },
        undefined,
        (error) => {
          console.error('❌ Error loading panorama HDR:', error);
          reject(error);
        }
      );
    } else {
      // Load regular image and set as scene background (no sky mesh)
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        textureUrl,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.background = texture; // Use background instead of geometry to avoid artifacts
          sky.panorama = null;
          sky.preset = 'panorama';
          // Store image textures for graphics settings toggle
          scene.userData.hdrBackground = texture;
          if (options.useAsEnvironment !== false && renderer) {
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();
            scene.userData.hdrEnvironment = pmremGenerator.fromEquirectangular(texture).texture;
            scene.environment = scene.userData.hdrEnvironment;
            pmremGenerator.dispose();
          }
          console.log('🌌 Panorama sky (image) set as scene.background:', textureUrl);
          resolve(null);
        },
        undefined,
        (error) => {
          console.error('❌ Error loading panorama image:', error);
          reject(error);
        }
      );
    }
  });
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

// Disable all shadow casting/receiving across the scene (Level 3 toon look)
export function disableAllShadows(scene) {
  if (!scene) return;
  scene.traverse((obj) => {
    if (obj.isLight) {
      obj.castShadow = false;
    }
    if (obj.isMesh) {
      obj.castShadow = false;
      obj.receiveShadow = false;
    }
  });
}
