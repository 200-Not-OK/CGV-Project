import { UIComponent } from '../uiComponent.js';

/**
 * GraphicsSettingsMenu
 * Standalone graphics settings menu for main menu system
 * Provides simplified access to all graphics settings without the overlay UI
 */
export class GraphicsSettingsMenu extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'graphics-settings-menu';
    this.graphicsSettings = props.graphicsSettings || null;
    this.onBack = props.onBack || (() => {});

    this.root.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      pointer-events: auto;
      user-select: none;
      overflow: auto;
    `;

    this._createElements();
  }

  _createElements() {
    // Add styles to document if not already there
    if (!document.querySelector('#graphics-settings-menu-styles')) {
      const style = document.createElement('style');
      style.id = 'graphics-settings-menu-styles';
      style.textContent = `
        .graphics-settings-container {
          background: rgba(20, 20, 35, 0.9);
          border: 2px solid #9c27b0;
          border-radius: 12px;
          padding: 40px;
          max-width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 0 40px rgba(156, 39, 176, 0.4);
          animation: slideInDown 0.8s ease-out;
        }

        .graphics-settings-title {
          font-size: 48px;
          font-weight: bold;
          color: #9c27b0;
          text-shadow: 0 0 20px rgba(156, 39, 176, 0.6);
          margin: 0 0 30px 0;
          text-align: center;
          letter-spacing: 2px;
          font-family: Arial Black, sans-serif;
        }

        .graphics-tab-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 25px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .graphics-tab-btn {
          padding: 10px 16px;
          background: rgba(100, 50, 150, 0.6);
          border: 2px solid #9c27b0;
          color: #ddd;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          font-size: 13px;
        }

        .graphics-tab-btn:hover {
          background: rgba(156, 39, 176, 0.8);
          box-shadow: 0 0 10px rgba(156, 39, 176, 0.6);
        }

        .graphics-tab-btn.active {
          background: #9c27b0;
          color: white;
          box-shadow: 0 0 15px rgba(156, 39, 176, 0.8);
        }

        .graphics-tab-content {
          display: none;
        }

        .graphics-tab-content.active {
          display: block;
        }

        .graphics-group {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(156, 39, 176, 0.2);
        }

        .graphics-group:last-child {
          border-bottom: none;
        }

        .graphics-group-title {
          font-size: 16px;
          font-weight: bold;
          color: #9c27b0;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .graphics-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          color: #ccc;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }

        .graphics-slider {
          width: 120px;
          height: 6px;
          cursor: pointer;
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(156, 39, 176, 0.3);
        }

        .graphics-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #9c27b0, #e91e63);
          border: 2px solid #9c27b0;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(156, 39, 176, 0.6);
        }

        .graphics-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #9c27b0, #e91e63);
          border: 2px solid #9c27b0;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(156, 39, 176, 0.6);
        }

        .graphics-slider::-moz-range-track {
          background: none;
          border: none;
        }

        .graphics-value {
          min-width: 60px;
          text-align: right;
          color: #9c27b0;
          font-weight: bold;
        }

        .graphics-toggle {
          width: 50px;
          height: 26px;
          background: rgba(156, 39, 176, 0.3);
          border: 2px solid #9c27b0;
          border-radius: 13px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .graphics-toggle.on {
          background: #9c27b0;
        }

        .graphics-toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          transition: left 0.3s ease;
        }

        .graphics-toggle.on .graphics-toggle-knob {
          left: 26px;
        }

        .graphics-buttons-group {
          display: flex;
          gap: 8px;
        }

        .graphics-quality-btn {
          padding: 8px 12px;
          background: rgba(100, 50, 150, 0.5);
          border: 1px solid #9c27b0;
          color: #ccc;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
          font-size: 12px;
        }

        .graphics-quality-btn:hover {
          background: rgba(156, 39, 176, 0.6);
          color: white;
        }

        .graphics-quality-btn.active {
          background: #9c27b0;
          color: white;
          box-shadow: 0 0 8px rgba(156, 39, 176, 0.8);
        }

        .graphics-buttons-footer {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(156, 39, 176, 0.2);
        }

        .graphics-button {
          padding: 12px 24px;
          background: #9c27b0;
          border: 2px solid #9c27b0;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: Arial, sans-serif;
        }

        .graphics-button:hover {
          background: #7b1fa2;
          box-shadow: 0 0 15px rgba(156, 39, 176, 0.6);
        }

        .graphics-button.back-button {
          background: rgba(100, 50, 150, 0.6);
        }

        .graphics-button.back-button:hover {
          background: rgba(156, 39, 176, 0.8);
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Main container
    const container = document.createElement('div');
    container.className = 'graphics-settings-container';

    // Title
    const title = document.createElement('h1');
    title.className = 'graphics-settings-title';
    title.textContent = 'GRAPHICS SETTINGS';
    container.appendChild(title);

    // Tab buttons
    const tabs = ['rendering', 'shadows', 'shaders', 'environment', 'lighting', 'effects', 'advanced'];
    const tabButtonsContainer = document.createElement('div');
    tabButtonsContainer.className = 'graphics-tab-buttons';

    tabs.forEach((tab, index) => {
      const btn = document.createElement('button');
      btn.className = 'graphics-tab-btn' + (index === 0 ? ' active' : '');
      btn.dataset.tab = tab;
      btn.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.switchTab(tab);
      });
      tabButtonsContainer.appendChild(btn);
    });
    container.appendChild(tabButtonsContainer);

    // Tabs content container
    const tabsContent = document.createElement('div');
    tabsContent.className = 'graphics-tabs-content';

    // Create tabs with actual settings
    const settings = this.graphicsSettings?.currentSettings || {};
    
    tabs.forEach((tab, index) => {
      const tabContent = document.createElement('div');
      tabContent.className = 'graphics-tab-content' + (index === 0 ? ' active' : '');
      tabContent.dataset.tab = tab;

      if (tab === 'rendering' && settings.rendering) {
        tabContent.appendChild(this._createRenderingTab(settings.rendering));
      } else if (tab === 'shadows' && settings.shadows) {
        tabContent.appendChild(this._createShadowsTab(settings.shadows));
      } else if (tab === 'shaders' && settings.shaders) {
        tabContent.appendChild(this._createShadersTab(settings.shaders));
      } else if (tab === 'environment' && settings.environment) {
        tabContent.appendChild(this._createEnvironmentTab(settings.environment));
      } else if (tab === 'lighting' && settings.lighting) {
        tabContent.appendChild(this._createLightingTab(settings.lighting));
      } else if (tab === 'effects' && settings.effects) {
        tabContent.appendChild(this._createEffectsTab(settings.effects));
      } else if (tab === 'advanced' && settings.advanced) {
        tabContent.appendChild(this._createAdvancedTab(settings.advanced));
      } else {
        tabContent.innerHTML = '<p style="color: #888;">No settings available</p>';
      }

      tabsContent.appendChild(tabContent);
    });
    container.appendChild(tabsContent);

    // Buttons footer
    const buttonsFooter = document.createElement('div');
    buttonsFooter.className = 'graphics-buttons-footer';

    const backButton = document.createElement('button');
    backButton.className = 'graphics-button back-button';
    backButton.textContent = 'BACK';
    backButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.hide();
      this.onBack();
    });
    buttonsFooter.appendChild(backButton);

    container.appendChild(buttonsFooter);
    this.root.appendChild(container);

    console.log('🎨 GraphicsSettingsMenu elements created');
  }

  /**
   * Create Rendering tab content
   */
  _createRenderingTab(renderingSettings) {
    const group = document.createElement('div');
    group.className = 'graphics-group';

    const title = document.createElement('div');
    title.className = 'graphics-group-title';
    title.textContent = 'RENDERING';
    group.appendChild(title);

    // Resolution Scale
    const resItem = document.createElement('div');
    resItem.className = 'graphics-item';
    resItem.innerHTML = `
      <span>Resolution Scale</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <input type="range" min="0.5" max="1.5" step="0.25" value="${renderingSettings.resolutionScale}" class="graphics-slider">
        <span class="graphics-value">${(renderingSettings.resolutionScale * 100).toFixed(0)}%</span>
      </div>
    `;
    const resSlider = resItem.querySelector('input');
    const resValue = resItem.querySelector('.graphics-value');
    resSlider.addEventListener('input', (e) => {
      resValue.textContent = (e.target.value * 100).toFixed(0) + '%';
      this.graphicsSettings?.updateSetting('rendering.resolutionScale', parseFloat(e.target.value));
    });
    group.appendChild(resItem);

    // Anti-Alias
    const aaItem = document.createElement('div');
    aaItem.className = 'graphics-item';
    aaItem.innerHTML = `
      <span>Anti-Aliasing</span>
      <div class="graphics-toggle ${renderingSettings.antiAlias ? 'on' : ''}">
        <div class="graphics-toggle-knob"></div>
      </div>
    `;
    const aaToggle = aaItem.querySelector('.graphics-toggle');
    aaToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      aaToggle.classList.toggle('on');
      this.graphicsSettings?.updateSetting('rendering.antiAlias', aaToggle.classList.contains('on'));
    });
    group.appendChild(aaItem);

    return group;
  }

  /**
   * Create Shadows tab content
   */
  _createShadowsTab(shadowSettings) {
    const group = document.createElement('div');
    group.className = 'graphics-group';

    const title = document.createElement('div');
    title.className = 'graphics-group-title';
    title.textContent = 'SHADOWS';
    group.appendChild(title);

    // Shadow Enable
    const enableItem = document.createElement('div');
    enableItem.className = 'graphics-item';
    enableItem.innerHTML = `
      <span>Enable Shadows</span>
      <div class="graphics-toggle ${shadowSettings.enabled ? 'on' : ''}">
        <div class="graphics-toggle-knob"></div>
      </div>
    `;
    const enableToggle = enableItem.querySelector('.graphics-toggle');
    enableToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      enableToggle.classList.toggle('on');
      this.graphicsSettings?.updateSetting('shadows.enabled', enableToggle.classList.contains('on'));
    });
    group.appendChild(enableItem);

    // Shadow Quality
    const qualityItem = document.createElement('div');
    qualityItem.className = 'graphics-item';
    qualityItem.innerHTML = `<span>Quality</span>`;
    const buttonsGroup = document.createElement('div');
    buttonsGroup.className = 'graphics-buttons-group';
    ['LOW', 'MEDIUM', 'HIGH'].forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'graphics-quality-btn' + (shadowSettings.quality === q ? ' active' : '');
      btn.textContent = q;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('[data-tab="shadows"] .graphics-quality-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.graphicsSettings?.updateSetting('shadows.quality', q);
      });
      buttonsGroup.appendChild(btn);
    });
    qualityItem.appendChild(buttonsGroup);
    group.appendChild(qualityItem);

    return group;
  }

  /**
   * Create Shaders tab content
   */
  _createShadersTab(shaderSettings) {
    const group = document.createElement('div');
    group.className = 'graphics-group';

    const title = document.createElement('div');
    title.className = 'graphics-group-title';
    title.textContent = 'SHADERS';
    group.appendChild(title);

    // Enhanced Shaders
    const enhItem = document.createElement('div');
    enhItem.className = 'graphics-item';
    enhItem.innerHTML = `
      <span>Enhanced Shaders</span>
      <div class="graphics-toggle ${shaderSettings.enhanced ? 'on' : ''}">
        <div class="graphics-toggle-knob"></div>
      </div>
    `;
    const enhToggle = enhItem.querySelector('.graphics-toggle');
    enhToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      enhToggle.classList.toggle('on');
      this.graphicsSettings?.updateSetting('shaders.enhanced', enhToggle.classList.contains('on'));
    });
    group.appendChild(enhItem);

    // Saturation
    const satItem = document.createElement('div');
    satItem.className = 'graphics-item';
    satItem.innerHTML = `
      <span>Saturation</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <input type="range" min="0" max="1" step="0.1" value="${shaderSettings.saturation}" class="graphics-slider">
        <span class="graphics-value">${(shaderSettings.saturation * 100).toFixed(0)}%</span>
      </div>
    `;
    const satSlider = satItem.querySelector('input');
    const satValue = satItem.querySelector('.graphics-value');
    satSlider.addEventListener('input', (e) => {
      satValue.textContent = (e.target.value * 100).toFixed(0) + '%';
      this.graphicsSettings?.updateSetting('shaders.saturation', parseFloat(e.target.value));
    });
    group.appendChild(satItem);

    return group;
  }

  /**
   * Create Environment tab content
   */
  _createEnvironmentTab(envSettings) {
    const group = document.createElement('div');
    group.className = 'graphics-group';

    const title = document.createElement('div');
    title.className = 'graphics-group-title';
    title.textContent = 'ENVIRONMENT';
    group.appendChild(title);

    // Skybox
    const skyItem = document.createElement('div');
    skyItem.className = 'graphics-item';
    skyItem.innerHTML = `
      <span>Skybox</span>
      <div class="graphics-toggle ${envSettings.skybox ? 'on' : ''}">
        <div class="graphics-toggle-knob"></div>
      </div>
    `;
    const skyToggle = skyItem.querySelector('.graphics-toggle');
    skyToggle.style.pointerEvents = 'none';
    skyToggle.style.opacity = '0.5';
    skyItem.querySelector('span').textContent = 'Skybox (Always On)';
    group.appendChild(skyItem);

    // Ambient Brightness
    const ambItem = document.createElement('div');
    ambItem.className = 'graphics-item';
    ambItem.innerHTML = `
      <span>Ambient Brightness</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <input type="range" min="0.5" max="2" step="0.1" value="${envSettings.ambientBrightness}" class="graphics-slider">
        <span class="graphics-value">${(envSettings.ambientBrightness * 100).toFixed(0)}%</span>
      </div>
    `;
    const ambSlider = ambItem.querySelector('input');
    const ambValue = ambItem.querySelector('.graphics-value');
    ambSlider.addEventListener('input', (e) => {
      ambValue.textContent = (e.target.value * 100).toFixed(0) + '%';
      this.graphicsSettings?.updateSetting('environment.ambientBrightness', parseFloat(e.target.value));
    });
    group.appendChild(ambItem);

    return group;
  }

  /**
   * Create Lighting tab content
   */
  _createLightingTab(lightingSettings) {
    const group = document.createElement('div');
    group.className = 'graphics-group';

    const title = document.createElement('div');
    title.className = 'graphics-group-title';
    title.textContent = 'LIGHTING';
    group.appendChild(title);

    // Dynamic Lights
    const dynItem = document.createElement('div');
    dynItem.className = 'graphics-item';
    dynItem.innerHTML = `
      <span>Dynamic Lights</span>
      <div class="graphics-toggle ${lightingSettings.dynamicLights ? 'on' : ''}">
        <div class="graphics-toggle-knob"></div>
      </div>
    `;
    const dynToggle = dynItem.querySelector('.graphics-toggle');
    dynToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dynToggle.classList.toggle('on');
      this.graphicsSettings?.updateSetting('lighting.dynamicLights', dynToggle.classList.contains('on'));
    });
    group.appendChild(dynItem);

    // Light Intensity
    const intItem = document.createElement('div');
    intItem.className = 'graphics-item';
    intItem.innerHTML = `
      <span>Light Intensity</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <input type="range" min="0.5" max="2" step="0.1" value="${lightingSettings.intensity}" class="graphics-slider">
        <span class="graphics-value">${(lightingSettings.intensity * 100).toFixed(0)}%</span>
      </div>
    `;
    const intSlider = intItem.querySelector('input');
    const intValue = intItem.querySelector('.graphics-value');
    intSlider.addEventListener('input', (e) => {
      intValue.textContent = (e.target.value * 100).toFixed(0) + '%';
      this.graphicsSettings?.updateSetting('lighting.intensity', parseFloat(e.target.value));
    });
    group.appendChild(intItem);

    return group;
  }

  /**
   * Create Effects tab content
   */
  _createEffectsTab(effectsSettings) {
    const group = document.createElement('div');
    group.className = 'graphics-group';

    const title = document.createElement('div');
    title.className = 'graphics-group-title';
    title.textContent = 'EFFECTS';
    group.appendChild(title);

    // Particles
    const partItem = document.createElement('div');
    partItem.className = 'graphics-item';
    partItem.innerHTML = `
      <span>Particles</span>
      <div class="graphics-toggle ${effectsSettings.particles ? 'on' : ''}">
        <div class="graphics-toggle-knob"></div>
      </div>
    `;
    const partToggle = partItem.querySelector('.graphics-toggle');
    partToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      partToggle.classList.toggle('on');
      this.graphicsSettings?.updateSetting('effects.particles', partToggle.classList.contains('on'));
    });
    group.appendChild(partItem);

    // Bloom
    const bloomItem = document.createElement('div');
    bloomItem.className = 'graphics-item';
    bloomItem.innerHTML = `
      <span>Bloom</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <input type="range" min="0" max="2" step="0.1" value="${effectsSettings.bloom}" class="graphics-slider">
        <span class="graphics-value">${(effectsSettings.bloom * 100).toFixed(0)}%</span>
      </div>
    `;
    const bloomSlider = bloomItem.querySelector('input');
    const bloomValue = bloomItem.querySelector('.graphics-value');
    bloomSlider.addEventListener('input', (e) => {
      bloomValue.textContent = (e.target.value * 100).toFixed(0) + '%';
      this.graphicsSettings?.updateSetting('effects.bloom', parseFloat(e.target.value));
    });
    group.appendChild(bloomItem);

    return group;
  }

  /**
   * Create Advanced tab content
   */
  _createAdvancedTab(advancedSettings) {
    const group = document.createElement('div');
    group.className = 'graphics-group';

    const title = document.createElement('div');
    title.className = 'graphics-group-title';
    title.textContent = 'ADVANCED';
    group.appendChild(title);

    // Frame Rate Target
    const fpsItem = document.createElement('div');
    fpsItem.className = 'graphics-item';
    fpsItem.innerHTML = `
      <span>Target Frame Rate</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <input type="range" min="30" max="144" step="15" value="${advancedSettings.frameRateTarget}" class="graphics-slider">
        <span class="graphics-value">${advancedSettings.frameRateTarget} FPS</span>
      </div>
    `;
    const fpsSlider = fpsItem.querySelector('input');
    const fpsValue = fpsItem.querySelector('.graphics-value');
    fpsSlider.addEventListener('input', (e) => {
      fpsValue.textContent = e.target.value + ' FPS';
      this.graphicsSettings?.updateSetting('advanced.frameRateTarget', parseInt(e.target.value));
    });
    group.appendChild(fpsItem);

    // Draw Distance
    const drawItem = document.createElement('div');
    drawItem.className = 'graphics-item';
    drawItem.innerHTML = `
      <span>Draw Distance</span>
      <div style="display: flex; gap: 10px; align-items: center;">
        <input type="range" min="100" max="1000" step="100" value="${advancedSettings.drawDistance}" class="graphics-slider">
        <span class="graphics-value">${advancedSettings.drawDistance}m</span>
      </div>
    `;
    const drawSlider = drawItem.querySelector('input');
    const drawValue = drawItem.querySelector('.graphics-value');
    drawSlider.addEventListener('input', (e) => {
      drawValue.textContent = e.target.value + 'm';
      this.graphicsSettings?.updateSetting('advanced.drawDistance', parseInt(e.target.value));
    });
    group.appendChild(drawItem);

    return group;
  }

  /**
   * Switch between tabs
   */
  switchTab(tabName) {
    // Deactivate all tabs
    this.root.querySelectorAll('.graphics-tab-content').forEach((tab) => {
      tab.classList.remove('active');
    });
    this.root.querySelectorAll('.graphics-tab-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    // Activate selected tab
    const tabContent = this.root.querySelector(`.graphics-tab-content[data-tab="${tabName}"]`);
    if (tabContent) {
      tabContent.classList.add('active');
    }

    const tabBtn = Array.from(this.root.querySelectorAll('.graphics-tab-btn')).find(
      (b) => b.dataset.tab === tabName
    );
    if (tabBtn) {
      tabBtn.classList.add('active');
    }
  }

  /**
   * Show the menu
   */
  show() {
    if (this.root) {
      this.root.style.display = 'flex';
      this.root.style.opacity = '1';
      this.root.style.pointerEvents = 'auto';
      this.root.style.cursor = 'auto';
      // Exit pointer lock if active
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      // Ensure body cursor is visible
      document.body.style.cursor = 'auto';
    }
  }

  /**
   * Hide the menu with fade-out effect
   */
  hide(duration = 500) {
    if (!this.root) return;

    this.root.style.transition = `opacity ${duration}ms ease-out`;
    this.root.style.opacity = '0';
    this.root.style.pointerEvents = 'none';

    setTimeout(() => {
      if (this.root) {
        this.root.style.display = 'none';
        this.root.style.opacity = '1';
        this.root.style.transition = '';
      }
    }, duration);
  }

  /**
   * Mount component
   */
  mount() {
    console.log('🎨 GraphicsSettingsMenu mounted');
    super.mount();
    // Start hidden - only show when explicitly called
    this.root.style.display = 'none';
  }

  /**
   * Unmount component
   */
  unmount() {
    console.log('🎨 GraphicsSettingsMenu unmounted');
    super.unmount();
  }
}
