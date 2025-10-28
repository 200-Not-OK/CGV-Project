import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { levels as LEVELS_DATA } from '../game/levelData.js';

export class CinematicEditor {
  constructor() {
    this.levelsData = LEVELS_DATA;
    this.currentLevelIndex = 0;
    this.currentLevel = null;
    this.levelGeometry = null;
    
    // Sequence data
    this.cinematics = {
      onLevelStart: { sequence: [] },
      onLevelComplete: { sequence: [] },
      onEnemyDefeat: { sequence: [] }
    };
    this.currentCinematicType = 'onLevelStart';
    this.selectedStepIndex = -1;
    
    // Visual markers
    this.cameraMarkers = [];
    this.cameraPaths = [];
    
    // Editor camera
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);
    this.cameraYaw = 0;
    this.cameraPitch = 0;
    this.sensitivity = 0.003;
    
    // Input state
    this.keys = {};
    this.mouseDown = false;
    this.lastMouse = { x: 0, y: 0 };
    
    // Preview state
    this.isPlaying = false;
    this.isPaused = false;
    
    // Initialize
    this._initScene();
    this._initUI();
    this._bindEvents();
    this._setupCamera();
    
    // Load first level
    this.loadLevel(0);
  }
  
  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a2a2a);
    
    // Create renderer
    const canvas = document.getElementById('canvas');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    this.renderer.shadowMap.enabled = true;
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 20, 0x444444, 0x222222);
    this.scene.add(gridHelper);
    
    // Axes helper
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
    
    // Basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Start render loop
    this._animate();
  }
  
  _setupCamera() {
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(0, 0, 0);
    this._updateCameraRotation();
    this._updateCameraPosition();
  }
  
  _updateCameraRotation() {
    const euler = new THREE.Euler(this.cameraPitch, this.cameraYaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(euler);
  }
  
  _updateCameraPosition() {
    const status = document.getElementById('status-overlay');
    const pos = this.camera.position;
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(this.camera.quaternion);
    const lookAt = new THREE.Vector3().addVectors(pos, dir);
    
    status.innerHTML = `Camera: [${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}]<br>Look: [${lookAt.x.toFixed(1)}, ${lookAt.y.toFixed(1)}, ${lookAt.z.toFixed(1)}]`;
  }
  
  _initUI() {
    this._updateLevelSelector();
    this._updateTimeline();
    this._updateStepProperties();
  }
  
  _updateLevelSelector() {
    const select = document.getElementById('level-select');
    select.innerHTML = this.levelsData.map((level, i) => 
      `<option value="${i}">${level.name || level.id}</option>`
    ).join('');
    select.value = this.currentLevelIndex;
  }
  
  _bindEvents() {
    // UI Events
    document.getElementById('level-select').addEventListener('change', (e) => {
      this.loadLevel(parseInt(e.target.value));
    });
    
    document.getElementById('cinematic-type').addEventListener('change', (e) => {
      this.currentCinematicType = e.target.value;
      this._updateTimeline();
      this._updateStepProperties();
    });
    
    document.getElementById('btn-capture').addEventListener('click', () => {
      this.captureCameraPosition();
    });
    
    document.getElementById('btn-add-step').addEventListener('click', () => {
      this.showAddStepDialog();
    });
    
    document.getElementById('btn-delete').addEventListener('click', () => {
      this.deleteSelectedStep();
    });
    
    document.getElementById('btn-export').addEventListener('click', () => {
      this.showExportModal();
    });
    
    // Timeline controls
    document.getElementById('btn-play').addEventListener('click', () => this.play());
    document.getElementById('btn-pause').addEventListener('click', () => this.pause());
    document.getElementById('btn-stop').addEventListener('click', () => this.stop());
    
    // Export modal
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      document.getElementById('export-modal').classList.remove('active');
    });
    
    document.getElementById('btn-copy').addEventListener('click', () => {
      this.copyToClipboard();
    });
    
    document.getElementById('btn-download').addEventListener('click', () => {
      this.downloadJSON();
    });
    
    // Canvas events
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', (e) => this._onMouseDown(e));
    canvas.addEventListener('mousemove', (e) => this._onMouseMove(e));
    canvas.addEventListener('mouseup', () => this._onMouseUp());
    canvas.addEventListener('wheel', (e) => this._onMouseWheel(e));
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Keyboard events
    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', (e) => this._onKeyUp(e));
    
    // Resize
    window.addEventListener('resize', () => this._onResize());
  }
  
  _onMouseDown(e) {
    this.mouseDown = true;
    this.lastMouse = { x: e.clientX, y: e.clientY };
  }
  
  _onMouseMove(e) {
    if (this.mouseDown && e.buttons === 2) { // Right click
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      
      this.cameraYaw -= dx * this.sensitivity;
      this.cameraPitch -= dy * this.sensitivity;
      this.cameraPitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.cameraPitch));
      
      this._updateCameraRotation();
    }
    
    this.lastMouse = { x: e.clientX, y: e.clientY };
  }
  
  _onMouseUp() {
    this.mouseDown = false;
  }
  
  _onMouseWheel(e) {
    e.preventDefault();
    const zoomAmount = -e.deltaY * 0.01;
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(this.camera.quaternion);
    this.camera.position.add(direction.multiplyScalar(zoomAmount));
    this._updateCameraPosition();
  }
  
  _onKeyDown(e) {
    this.keys[e.code] = true;
  }
  
  _onKeyUp(e) {
    this.keys[e.code] = false;
    
    if (e.code === 'Delete' && this.selectedStepIndex >= 0) {
      this.deleteSelectedStep();
    }
  }
  
  _onResize() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  }
  
  _animate() {
    requestAnimationFrame(() => this._animate());
    
    // Camera movement
    const speed = this.keys['ShiftLeft'] ? 1.0 : 0.3;
    const moveVec = new THREE.Vector3(0, 0, 0);
    
    if (this.keys['KeyW']) moveVec.z -= speed;
    if (this.keys['KeyS']) moveVec.z += speed;
    if (this.keys['KeyA']) moveVec.x -= speed;
    if (this.keys['KeyD']) moveVec.x += speed;
    if (this.keys['KeyQ']) moveVec.y += speed;
    if (this.keys['KeyE']) moveVec.y -= speed;
    
    if (moveVec.lengthSq() > 0) {
      moveVec.applyQuaternion(this.camera.quaternion);
      this.camera.position.add(moveVec);
      this._updateCameraPosition();
    }
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
  
  async loadLevel(index) {
    this.currentLevelIndex = index;
    this.currentLevel = this.levelsData[index];
    
    // Clear existing geometry
    if (this.levelGeometry) {
      this.scene.remove(this.levelGeometry);
      if (this.levelGeometry.geometry) this.levelGeometry.geometry.dispose();
      if (this.levelGeometry.material) {
        if (Array.isArray(this.levelGeometry.material)) {
          this.levelGeometry.material.forEach(m => m.dispose());
        } else {
          this.levelGeometry.material.dispose();
        }
      }
    }
    
    // Load level geometry
    if (this.currentLevel.gltfUrl) {
      const loader = new GLTFLoader();
      try {
        const gltf = await loader.loadAsync(this.currentLevel.gltfUrl);
        this.levelGeometry = gltf.scene;
        this.scene.add(this.levelGeometry);
      } catch (e) {
        console.warn('Failed to load level GLTF:', e);
      }
    }
    
    // Load existing cinematics
    if (this.currentLevel.cinematics) {
      this.cinematics = { ...this.cinematics, ...this.currentLevel.cinematics };
    }
    
    this._updateLevelSelector();
    this._updateTimeline();
    this._updateVisualMarkers();
  }
  
  captureCameraPosition() {
    const position = this.camera.position.toArray();
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(this.camera.quaternion);
    const lookAt = new THREE.Vector3().addVectors(this.camera.position, dir.multiplyScalar(20));
    
    const step = {
      type: 'cut',
      position: position,
      lookAt: lookAt.toArray(),
      fov: this.camera.fov
    };
    
    this.addStep(step);
  }
  
  addStep(step) {
    const sequence = this.cinematics[this.currentCinematicType].sequence;
    if (!sequence) {
      this.cinematics[this.currentCinematicType] = { sequence: [step] };
    } else {
      sequence.push(step);
    }
    this._updateTimeline();
    this._updateVisualMarkers();
  }
  
  deleteSelectedStep() {
    if (this.selectedStepIndex < 0) return;
    const sequence = this.cinematics[this.currentCinematicType].sequence;
    sequence.splice(this.selectedStepIndex, 1);
    this.selectedStepIndex = -1;
    this._updateTimeline();
    this._updateVisualMarkers();
    this._updateStepProperties();
  }
  
  selectStep(index) {
    this.selectedStepIndex = index;
    this._updateTimeline();
    this._updateStepProperties();
  }
  
  _updateTimeline() {
    const sequence = this.cinematics[this.currentCinematicType].sequence || [];
    const container = document.querySelector('.timeline-content');
    
    // Render timeline ruler
    const pixelsPerSecond = 50; // 50px per second
    container.innerHTML = '<div class="timeline-ruler" style="width: 100%; height: 20px;"></div>';
    
    let totalDuration = 0;
    
    // Calculate total duration
    sequence.forEach(step => {
      if (step.duration) totalDuration += step.duration;
      else if (step.ms) totalDuration += step.ms;
      else if (step.type === 'cut' || step.type === 'wait' || step.type === 'caption') totalDuration += 2000;
      else totalDuration += 1000;
    });
    
    // Render steps
    let currentTime = 0;
    sequence.forEach((step, index) => {
      const duration = step.duration || step.ms || (step.type === 'cut' || step.type === 'wait' || step.type === 'caption' ? 2000 : 1000);
      const left = (currentTime / 1000) * pixelsPerSecond;
      const width = (duration / 1000) * pixelsPerSecond;
      
      const stepEl = document.createElement('div');
      stepEl.className = `timeline-step type-${step.type} ${index === this.selectedStepIndex ? 'selected' : ''}`;
      stepEl.style.left = `${left}px`;
      stepEl.style.width = `${width}px`;
      stepEl.innerHTML = `<span class="step-label">${step.type}</span>`;
      stepEl.addEventListener('click', () => this.selectStep(index));
      
      container.appendChild(stepEl);
      currentTime += duration;
    });
    
    // Update info
    document.getElementById('timeline-info').textContent = 
      `${sequence.length} steps, ${(totalDuration / 1000).toFixed(1)}s total`;
    
    // Set container width
    const maxWidth = Math.max((totalDuration / 1000) * pixelsPerSecond, 800);
    container.style.width = `${maxWidth}px`;
  }
  
  _updateStepProperties() {
    const container = document.getElementById('step-properties');
    
    if (this.selectedStepIndex < 0) {
      container.innerHTML = '<p style="color: #666; font-size: 13px;">Select a step to edit properties</p>';
      return;
    }
    
    const sequence = this.cinematics[this.currentCinematicType].sequence;
    const step = sequence[this.selectedStepIndex];
    
    let html = `<h4 style="margin-bottom: 12px; color: #4a9eff;">Step: ${step.type}</h4>`;
    
    // Render properties based on step type
    if (step.position) {
      html += `
        <div class="form-group">
          <label>Position</label>
          <div class="vector-input">
            <input type="number" id="prop-pos-x" value="${step.position[0]}" step="0.1">
            <input type="number" id="prop-pos-y" value="${step.position[1]}" step="0.1">
            <input type="number" id="prop-pos-z" value="${step.position[2]}" step="0.1">
          </div>
        </div>
      `;
    }
    
    if (step.lookAt) {
      html += `
        <div class="form-group">
          <label>Look At</label>
          <div class="vector-input">
            <input type="number" id="prop-look-x" value="${step.lookAt[0]}" step="0.1">
            <input type="number" id="prop-look-y" value="${step.lookAt[1]}" step="0.1">
            <input type="number" id="prop-look-z" value="${step.lookAt[2]}" step="0.1">
          </div>
        </div>
      `;
    }
    
    if (step.fov) {
      html += `
        <div class="form-group">
          <label>FOV</label>
          <input type="number" id="prop-fov" value="${step.fov}" step="1">
        </div>
      `;
    }
    
    if (step.duration) {
      html += `
        <div class="form-group">
          <label>Duration (ms)</label>
          <input type="number" id="prop-duration" value="${step.duration}">
        </div>
      `;
    }
    
    if (step.ms) {
      html += `
        <div class="form-group">
          <label>Duration (ms)</label>
          <input type="number" id="prop-ms" value="${step.ms}">
        </div>
      `;
    }
    
    if (step.text) {
      html += `
        <div class="form-group">
          <label>Text</label>
          <textarea id="prop-text">${step.text}</textarea>
        </div>
      `;
    }
    
    container.innerHTML = html;
    
    // Bind update events
    this._bindPropertyUpdateEvents(step);
  }
  
  _bindPropertyUpdateEvents(step) {
    const inputs = document.querySelectorAll('#step-properties input, #step-properties textarea');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        const id = input.id.replace('prop-', '').split('-');
        
        if (id[0] === 'pos') {
          step.position[id[1]] = parseFloat(input.value);
        } else if (id[0] === 'look') {
          step.lookAt[id[1]] = parseFloat(input.value);
        } else if (id[0] === 'fov') {
          step.fov = parseFloat(input.value);
        } else if (id[0] === 'duration') {
          step.duration = parseInt(input.value);
        } else if (id[0] === 'ms') {
          step.ms = parseInt(input.value);
        } else if (id[0] === 'text') {
          step.text = input.value;
        }
        
        this._updateTimeline();
        this._updateVisualMarkers();
      });
    });
  }
  
  _updateVisualMarkers() {
    // Clear existing markers
    this.cameraMarkers.forEach(marker => this.scene.remove(marker));
    this.cameraPaths.forEach(path => this.scene.remove(path));
    this.cameraMarkers = [];
    this.cameraPaths = [];
    
    const sequence = this.cinematics[this.currentCinematicType].sequence || [];
    
    // Create markers for each camera position
    const positions = [];
    sequence.forEach(step => {
      if (step.position) {
        positions.push(new THREE.Vector3(...step.position));
      }
    });
    
    positions.forEach((pos, i) => {
      // Sphere marker
      const geometry = new THREE.SphereGeometry(0.5, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: i === this.selectedStepIndex ? 0x4a9eff : 0xffffff });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(pos);
      this.scene.add(sphere);
      this.cameraMarkers.push(sphere);
      
      // Draw path to next position
      if (i < positions.length - 1) {
        const points = [pos, positions[i + 1]];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x888888, opacity: 0.5, transparent: true });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.cameraPaths.push(line);
      }
    });
  }
  
  showAddStepDialog() {
    const stepTypes = ['cut', 'move', 'wait', 'caption', 'orbit', 'fadeIn', 'fadeOut', 'playVO', 'shake', 'takeCamera', 'releaseCamera'];
    const options = stepTypes.map(type => `<option value="${type}">${type}</option>`).join('');
    
    const type = prompt(`Add step:\n${options}`, 'cut');
    if (!type) return;
    
    const step = this._createDefaultStep(type);
    this.addStep(step);
    this.selectedStepIndex = this.cinematics[this.currentCinematicType].sequence.length - 1;
    this._updateTimeline();
    this._updateStepProperties();
  }
  
  _createDefaultStep(type) {
    const defaults = {
      takeCamera: { type: 'takeCamera' },
      releaseCamera: { type: 'releaseCamera' },
      cut: { 
        type: 'cut',
        position: [0, 5, 10],
        lookAt: [0, 0, 0],
        fov: 50
      },
      move: {
        type: 'move',
        position: [0, 5, 10],
        lookAt: [0, 0, 0],
        duration: 2000
      },
      wait: { type: 'wait', ms: 1000 },
      caption: { type: 'caption', text: 'Enter text here', ms: 2500 },
      fadeIn: { type: 'fadeIn', ms: 600 },
      fadeOut: { type: 'fadeOut', ms: 600 },
      orbit: {
        type: 'orbit',
        center: [0, 0, 0],
        radius: 10,
        startDeg: 0,
        endDeg: 90,
        height: 5,
        duration: 3000
      },
      shake: { type: 'shake', seconds: 0.5, magnitude: 0.1 },
      playVO: { type: 'playVO', vo: 'vo-name', block: true }
    };
    
    return defaults[type] || { type };
  }
  
  play() {
    this.isPlaying = true;
    this.isPaused = false;
    // Preview would integrate with CinematicsManager here
    alert('Preview playback not yet implemented. Export and test in-game.');
  }
  
  pause() {
    this.isPaused = true;
  }
  
  stop() {
    this.isPlaying = false;
    this.isPaused = false;
  }
  
  showExportModal() {
    const json = JSON.stringify({
      [this.currentCinematicType]: this.cinematics[this.currentCinematicType]
    }, null, 2);
    
    document.getElementById('export-json').textContent = json;
    document.getElementById('export-modal').classList.add('active');
  }
  
  copyToClipboard() {
    const json = JSON.stringify({
      [this.currentCinematicType]: this.cinematics[this.currentCinematicType]
    }, null, 2);
    
    navigator.clipboard.writeText(json);
    alert('Copied to clipboard!');
  }
  
  downloadJSON() {
    const json = JSON.stringify({
      [this.currentCinematicType]: this.cinematics[this.currentCinematicType]
    }, null, 2);
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinematic-${this.currentCinematicType}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

