/**
 * Graphics Settings UI Component
 * Complete UI menu with tabs, sliders, toggles, and real-time controls
 */

export class GraphicsSettingsUI {
  constructor(graphicsSettings, performanceMonitor) {
    this.settings = graphicsSettings;
    this.performanceMonitor = performanceMonitor;
    this.isOpen = false;
    this.currentTab = 'rendering';
    this.container = null;
    this.elements = {};
    
    // Listen for settings changes
    this.settings.listen((event) => this.onSettingsChanged(event));
    
    console.log('✅ GraphicsSettingsUI initialized');
  }

  /**
   * Create and mount the UI
   */
  create() {
    // Main container
    this.container = document.createElement('div');
    this.container.id = 'graphics-settings-ui';
    this.container.className = 'graphics-settings-panel';
    this.container.innerHTML = `
      <div class="graphics-settings-header">
        <h2>⚙️ Graphics Settings</h2>
        <button class="settings-close-btn">✕</button>
      </div>
      
      <div class="settings-tabs">
        <button class="tab-btn active" data-tab="rendering">Rendering</button>
        <button class="tab-btn" data-tab="shadows">Shadows</button>
        <button class="tab-btn" data-tab="shaders">Shaders</button>
        <button class="tab-btn" data-tab="environment">Environment</button>
        <button class="tab-btn" data-tab="lighting">Lighting</button>
        <button class="tab-btn" data-tab="effects">Effects</button>
        <button class="tab-btn" data-tab="advanced">Advanced</button>
      </div>
      
      <div class="settings-content">
        <!-- Rendering Tab -->
        <div class="settings-tab rendering-tab" data-tab="rendering">
          <div class="settings-section">
            <h3>Resolution & Performance</h3>
            
            <div class="setting-item">
              <label>Resolution Scale</label>
              <div class="slider-container">
                <input type="range" min="0.25" max="2.0" step="0.25" class="setting-slider" data-setting="rendering.resolutionScale">
                <span class="value-display">1.0x</span>
              </div>
              <small>Render quality. Lower = faster, Higher = better visuals</small>
            </div>
            
            <div class="setting-item">
              <label>Anti-Aliasing</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="rendering.antiAlias">
                <span class="toggle-slider"></span>
              </div>
              <small>Smooth jagged edges (performance cost varies)</small>
            </div>
            
            <div class="setting-item">
              <label>Pixel Precision</label>
              <select class="setting-select" data-setting="rendering.pixelPrecision">
                <option value="lowp">Low (Fast)</option>
                <option value="mediump">Medium</option>
                <option value="highp" selected>High (Best)</option>
              </select>
              <small>Requires renderer restart for full effect</small>
            </div>
          </div>
        </div>
        
        <!-- Shadows Tab -->
        <div class="settings-tab shadows-tab" data-tab="shadows">
          <div class="settings-section">
            <h3>Shadow Settings</h3>
            
            <div class="setting-item">
              <label>Shadows Enabled</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="shadows.enabled" checked>
                <span class="toggle-slider"></span>
              </div>
              <small>Enable/disable all shadow rendering</small>
            </div>
            
            <div class="setting-item">
              <label>Shadow Quality</label>
              <div class="button-group">
                <button class="quality-btn" data-setting="shadows.quality" data-value="LOW">Low</button>
                <button class="quality-btn active" data-setting="shadows.quality" data-value="MEDIUM">Medium</button>
                <button class="quality-btn" data-setting="shadows.quality" data-value="HIGH">High</button>
              </div>
            </div>
            
            <div class="setting-item">
              <label>Shadow Map Resolution</label>
              <div class="button-group">
                <button class="quality-btn" data-setting="shadows.mapSize" data-value="512">512</button>
                <button class="quality-btn active" data-setting="shadows.mapSize" data-value="1024">1024</button>
                <button class="quality-btn" data-setting="shadows.mapSize" data-value="2048">2048</button>
              </div>
              <small>Higher = sharper shadows, higher memory cost</small>
            </div>
            
            <div class="setting-item">
              <label>Shadow Type</label>
              <select class="setting-select" data-setting="shadows.type">
                <option value="BasicShadow">Basic</option>
                <option value="PCF">PCF</option>
                <option value="PCFSoft" selected>PCF Soft</option>
              </select>
            </div>
            
            <div class="setting-item">
              <label>Shadow Distance: <span class="value-display">100m</span></label>
              <input type="range" min="50" max="200" step="10" class="setting-slider" data-setting="shadows.distance">
            </div>
          </div>
        </div>
        
        <!-- Shaders Tab -->
        <div class="settings-tab shaders-tab" data-tab="shaders">
          <div class="settings-section">
            <h3>Shader Effects</h3>
            
            <div class="setting-item">
              <label>Enhanced Shaders</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="shaders.enhanced" checked>
                <span class="toggle-slider"></span>
              </div>
              <small>Enable advanced material rendering</small>
            </div>
            
            <div class="setting-item">
              <label>Toon Effect Strength: <span class="value-display">0.6x</span></label>
              <input type="range" min="0" max="1" step="0.1" class="setting-slider" data-setting="shaders.toonEffect">
            </div>
            
            <div class="setting-item">
              <label>Posterization Levels: <span class="value-display">5</span></label>
              <input type="range" min="2" max="16" step="1" class="setting-slider" data-setting="shaders.posterization">
              <small>Color banding effect</small>
            </div>
            
            <div class="setting-item">
              <label>Hatch Strength: <span class="value-display">0.22x</span></label>
              <input type="range" min="0" max="0.5" step="0.02" class="setting-slider" data-setting="shaders.hatchStrength">
            </div>
            
            <div class="setting-item">
              <label>Grain: <span class="value-display">0.035x</span></label>
              <input type="range" min="0" max="0.1" step="0.005" class="setting-slider" data-setting="shaders.grain">
            </div>
            
            <div class="setting-item">
              <label>Saturation: <span class="value-display">0.22x</span></label>
              <input type="range" min="0" max="1" step="0.05" class="setting-slider" data-setting="shaders.saturation">
            </div>
            
            <div class="setting-item">
              <label>Vibrance: <span class="value-display">0.38x</span></label>
              <input type="range" min="0" max="1" step="0.05" class="setting-slider" data-setting="shaders.vibrance">
            </div>
          </div>
        </div>
        
        <!-- Environment Tab -->
        <div class="settings-tab environment-tab" data-tab="environment">
          <div class="settings-section">
            <h3>World Environment</h3>
            
            <div class="setting-item">
              <label>Skybox</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="environment.skybox" checked>
                <span class="toggle-slider"></span>
              </div>
            </div>
            
            <div class="setting-item">
              <label>Skybox Quality</label>
              <div class="button-group">
                <button class="quality-btn" data-setting="environment.skyQuality" data-value="LOW">Low</button>
                <button class="quality-btn active" data-setting="environment.skyQuality" data-value="MEDIUM">Medium</button>
                <button class="quality-btn" data-setting="environment.skyQuality" data-value="HIGH">High</button>
              </div>
            </div>
            
            <div class="setting-item">
              <label>Fog</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="environment.fog" checked>
                <span class="toggle-slider"></span>
              </div>
            </div>
            
            <div class="setting-item">
              <label>Fog Density: <span class="value-display">1.0x</span></label>
              <input type="range" min="0.1" max="2" step="0.1" class="setting-slider" data-setting="environment.fogDensity">
            </div>
            
            <div class="setting-item">
              <label>Ambient Brightness: <span class="value-display">1.0x</span></label>
              <input type="range" min="0.5" max="2" step="0.1" class="setting-slider" data-setting="environment.ambientBrightness">
            </div>
          </div>
        </div>
        
        <!-- Lighting Tab -->
        <div class="settings-tab lighting-tab" data-tab="lighting">
          <div class="settings-section">
            <h3>Dynamic Lighting</h3>
            
            <div class="setting-item">
              <label>Dynamic Lights</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="lighting.dynamicLights" checked>
                <span class="toggle-slider"></span>
              </div>
            </div>
            
            <div class="setting-item">
              <label>Max Light Count: <span class="value-display">3</span></label>
              <input type="range" min="1" max="5" step="1" class="setting-slider" data-setting="lighting.maxCount">
              <small>More lights = better lighting but lower performance</small>
            </div>
            
            <div class="setting-item">
              <label>Light Intensity: <span class="value-display">1.0x</span></label>
              <input type="range" min="0.5" max="2" step="0.1" class="setting-slider" data-setting="lighting.intensity">
            </div>
            
            <div class="setting-item">
              <label>Light Distance: <span class="value-display">1.0x</span></label>
              <input type="range" min="0.5" max="3" step="0.1" class="setting-slider" data-setting="lighting.distance">
            </div>
          </div>
        </div>
        
        <!-- Effects Tab -->
        <div class="settings-tab effects-tab" data-tab="effects">
          <div class="settings-section">
            <h3>Particle Effects & Visuals</h3>
            
            <div class="setting-item">
              <label>Particles</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="effects.particles" checked>
                <span class="toggle-slider"></span>
              </div>
            </div>
            
            <div class="setting-item">
              <label>Particle Quality</label>
              <div class="button-group">
                <button class="quality-btn" data-setting="effects.quality" data-value="LOW">Low</button>
                <button class="quality-btn active" data-setting="effects.quality" data-value="MEDIUM">Medium</button>
                <button class="quality-btn" data-setting="effects.quality" data-value="HIGH">High</button>
              </div>
            </div>
            
            <div class="setting-item">
              <label>Particle Count: <span class="value-display">100%</span></label>
              <input type="range" min="0" max="200" step="10" class="setting-slider" data-setting="effects.count">
            </div>
            
            <div class="setting-item">
              <label>Bloom Effect: <span class="value-display">1.0x</span></label>
              <input type="range" min="0" max="2" step="0.1" class="setting-slider" data-setting="effects.bloom">
            </div>
            
            <div class="setting-item">
              <label>Fireflies: <span class="value-display">12</span></label>
              <input type="range" min="0" max="30" step="1" class="setting-slider" data-setting="effects.fireflies">
            </div>
            
            <div class="setting-item">
              <label>Flames</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="effects.flames" checked>
                <span class="toggle-slider"></span>
              </div>
              <small>Requires level reload</small>
            </div>
            
            <div class="setting-item">
              <label>Lightning</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="effects.lightning">
                <span class="toggle-slider"></span>
              </div>
              <small>Requires level reload</small>
            </div>
          </div>
        </div>
        
        <!-- Advanced Tab -->
        <div class="settings-tab advanced-tab" data-tab="advanced">
          <div class="settings-section">
            <h3>Advanced Settings</h3>
            
            <div class="setting-item">
              <label>Target FPS: <span class="value-display">60</span></label>
              <input type="range" min="30" max="120" step="10" class="setting-slider" data-setting="advanced.frameRateTarget">
            </div>
            
            <div class="setting-item">
              <label>Auto-Downgrade on Low FPS</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="advanced.autoDowngrade" checked>
                <span class="toggle-slider"></span>
              </div>
              <small>Automatically reduce quality if FPS drops</small>
            </div>
            
            <div class="setting-item">
              <label>Dynamic Resolution</label>
              <div class="toggle-switch">
                <input type="checkbox" class="setting-toggle" data-setting="advanced.dynamicResolution">
                <span class="toggle-slider"></span>
              </div>
              <small>Adjust resolution based on performance</small>
            </div>
            
            <div class="setting-item">
              <label>Texture Quality</label>
              <select class="setting-select" data-setting="advanced.textureResolution">
                <option value="LOW">Low</option>
                <option value="MEDIUM" selected>Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            
            <div class="setting-item">
              <label>Draw Distance: <span class="value-display">500m</span></label>
              <input type="range" min="100" max="1000" step="50" class="setting-slider" data-setting="advanced.drawDistance">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Performance Monitor -->
      <div class="performance-monitor">
        <div class="perf-stat">FPS: <span class="fps-value">60</span></div>
        <div class="perf-stat">GPU: <span class="gpu-value">Unknown</span></div>
        <div class="perf-stat">Memory: <span class="memory-value">0MB</span></div>
      </div>
      
      <!-- Quick Presets -->
      <div class="settings-presets">
        <button class="preset-btn preset-low">Low Quality</button>
        <button class="preset-btn preset-medium">Medium Quality</button>
        <button class="preset-btn preset-high">High Quality</button>
      </div>
      
      <!-- Action Buttons -->
      <div class="settings-actions">
        <button class="btn btn-reset">Reset to Defaults</button>
        <button class="btn btn-apply">Apply Settings</button>
      </div>
    `;
    
    document.body.appendChild(this.container);
    this.setupEventListeners();
    this.switchTab('rendering'); // Initialize first tab to show
    this.updateAllDisplays();
    this.hide(); // Start hidden
    
    console.log('✅ Graphics settings UI created');
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Close button
    this.container.querySelector('.settings-close-btn').addEventListener('click', () => this.toggle());
    
    // Tab switching - stop propagation to prevent pointer lock
    this.container.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.switchTab(e.target.dataset.tab);
      });
    });
    
    // Slider inputs - stop propagation
    this.container.querySelectorAll('.setting-slider').forEach((slider) => {
      slider.addEventListener('input', (e) => {
        e.stopPropagation();
        this.onSliderChange(e);
      });
    });
    
    // Toggle inputs - stop propagation
    this.container.querySelectorAll('.setting-toggle').forEach((toggle) => {
      toggle.addEventListener('change', (e) => {
        e.stopPropagation();
        this.onToggleChange(e);
      });
    });
    
    // Select inputs - stop propagation
    this.container.querySelectorAll('.setting-select').forEach((select) => {
      select.addEventListener('change', (e) => {
        e.stopPropagation();
        this.onSelectChange(e);
      });
    });
    
    // Quality buttons - stop propagation
    this.container.querySelectorAll('.quality-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onQualityButtonClick(e);
      });
    });
    
    // Preset buttons - stop propagation
    this.container.querySelectorAll('.preset-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onPresetClick(e);
      });
    });
    
    // Action buttons - stop propagation
    this.container.querySelector('.btn-reset').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Reset all settings to defaults?')) {
        this.settings.resetToDefaults();
        this.updateAllDisplays();
      }
    });
    
    this.container.querySelector('.btn-apply').addEventListener('click', (e) => {
      e.stopPropagation();
      this.settings.saveToStorage();
      console.log('✅ Settings applied and saved');
    });
    
    // Stop propagation on the entire settings panel for ALL events
    // This ensures clicking ANYWHERE on the UI doesn't trigger game interactions
    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
    }, true); // Use capture phase to catch all clicks
    
    this.container.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    }, true);
    
    this.container.addEventListener('mouseup', (e) => {
      e.stopPropagation();
    }, true);
    
    this.container.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, true);
  }

  /**
   * Switch between tabs
   */
  switchTab(tabName) {
    // Deactivate all tabs
    this.container.querySelectorAll('.settings-tab').forEach((tab) => {
      tab.style.display = 'none';
    });
    this.container.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    
    // Activate selected tab content
    const tabContent = this.container.querySelector(`.settings-tab[data-tab="${tabName}"]`);
    if (tabContent) {
      tabContent.style.display = 'block';
    }
    
    // Activate selected tab button
    const tabBtn = Array.from(this.container.querySelectorAll('.tab-btn')).find(b => b.dataset.tab === tabName);
    if (tabBtn) {
      tabBtn.classList.add('active');
    }
    
    this.currentTab = tabName;
  }

  /**
   * Handle slider changes
   */
  onSliderChange(e) {
    const setting = e.target.dataset.setting;
    const value = parseFloat(e.target.value);
    
    // Update display
    const display = e.target.nextElementSibling;
    if (display && display.classList.contains('value-display')) {
      display.textContent = this.formatValue(value, setting);
    }
    
    // Also update parent display if exists
    const label = e.target.closest('.setting-item').querySelector('label .value-display');
    if (label) {
      label.textContent = this.formatValue(value, setting);
    }
    
    // Apply setting
    this.settings.updateSetting(setting, value);
  }

  /**
   * Handle toggle changes
   */
  onToggleChange(e) {
    const setting = e.target.dataset.setting;
    const value = e.target.checked;
    this.settings.updateSetting(setting, value);
  }

  /**
   * Handle select changes
   */
  onSelectChange(e) {
    const setting = e.target.dataset.setting;
    const value = e.target.value;
    this.settings.updateSetting(setting, value);
  }

  /**
   * Handle quality button clicks
   */
  onQualityButtonClick(e) {
    const setting = e.target.dataset.setting;
    const value = e.target.dataset.value;
    
    // Update active state
    e.target.parentElement.querySelectorAll('.quality-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Apply setting
    const numValue = isNaN(value) ? value : parseInt(value);
    this.settings.updateSetting(setting, numValue);
  }

  /**
   * Handle preset buttons
   */
  onPresetClick(e) {
    const presetMap = {
      'preset-low': 'LOW',
      'preset-medium': 'MEDIUM',
      'preset-high': 'HIGH'
    };
    
    const preset = Object.keys(presetMap).find((key) => e.target.classList.contains(key));
    if (preset) {
      this.settings.applyPreset(presetMap[preset]);
      this.updateAllDisplays();
    }
  }

  /**
   * Format value for display
   */
  formatValue(value, setting) {
    if (setting.includes('Distance')) return `${Math.round(value)}m`;
    if (setting.includes('mapSize')) return `${value}x${value}`;
    if (setting.includes('count')) return `${value}%`;
    if (setting.includes('fireflies')) return `${Math.round(value)}`;
    if (setting.includes('posterization') || setting.includes('Levels')) return `${Math.round(value)}`;
    if (setting.includes('frameRateTarget')) return `${Math.round(value)} FPS`;
    
    // Default: round to 2 decimals with x suffix
    return `${value.toFixed(2)}x`;
  }

  /**
   * Update all UI displays to match current settings
   */
  updateAllDisplays() {
    // Update sliders
    this.container.querySelectorAll('.setting-slider').forEach((slider) => {
      const setting = slider.dataset.setting;
      const value = this.settings.getSetting(setting);
      slider.value = value;
      
      // Update display
      const display = slider.nextElementSibling;
      if (display && display.classList.contains('value-display')) {
        display.textContent = this.formatValue(value, setting);
      }
    });
    
    // Update toggles
    this.container.querySelectorAll('.setting-toggle').forEach((toggle) => {
      const setting = toggle.dataset.setting;
      const value = this.settings.getSetting(setting);
      toggle.checked = value;
    });
    
    // Update selects
    this.container.querySelectorAll('.setting-select').forEach((select) => {
      const setting = select.dataset.setting;
      const value = this.settings.getSetting(setting);
      select.value = value;
    });
    
    // Update quality buttons
    this.container.querySelectorAll('.quality-btn').forEach((btn) => {
      const setting = btn.dataset.setting;
      const value = btn.dataset.value;
      const currentValue = this.settings.getSetting(setting);
      
      if (currentValue === value || currentValue === parseInt(value)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update performance stats
    this.updatePerformanceStats();
  }

  /**
   * Update performance monitor
   */
  updatePerformanceStats() {
    if (!this.performanceMonitor) return;
    
    const fpsElement = this.container.querySelector('.fps-value');
    const memoryElement = this.container.querySelector('.memory-value');
    const gpuElement = this.container.querySelector('.gpu-value');
    
    if (fpsElement) {
      fpsElement.textContent = Math.round(this.performanceMonitor.fps || 60);
    }
    
    if (memoryElement && this.performanceMonitor.memory) {
      memoryElement.textContent = `${(this.performanceMonitor.memory / 1024 / 1024).toFixed(0)}MB`;
    }
    
    if (gpuElement && this.performanceMonitor.gpuInfo) {
      gpuElement.textContent = this.performanceMonitor.gpuInfo;
    }
  }

  /**
   * Handle settings changed event
   */
  onSettingsChanged(event) {
    // Update displays if settings were changed
    this.updatePerformanceStats();
  }

  /**
   * Show the UI
   */
  show() {
    if (this.container) {
      this.container.style.display = 'block';
      this.isOpen = true;
      // Exit pointer lock when opening settings
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      console.log('👀 Graphics settings UI shown');
    }
  }

  /**
   * Hide the UI
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isOpen = false;
      console.log('🙈 Graphics settings UI hidden');
    }
  }

  /**
   * Toggle visibility
   */
  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Add CSS styles to document
   */
  static injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Graphics Settings UI */
      .graphics-settings-panel {
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 450px;
        max-height: 85vh;
        background: rgba(10, 10, 20, 0.95);
        border: 2px solid #00ffff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1);
        color: #e0e0e0;
        font-family: 'Courier New', monospace;
        z-index: 10000;
        display: none;
        overflow-y: auto;
      }
      
      .graphics-settings-panel::-webkit-scrollbar {
        width: 8px;
      }
      
      .graphics-settings-panel::-webkit-scrollbar-track {
        background: rgba(0, 255, 255, 0.1);
        border-radius: 4px;
      }
      
      .graphics-settings-panel::-webkit-scrollbar-thumb {
        background: rgba(0, 255, 255, 0.5);
        border-radius: 4px;
      }
      
      .graphics-settings-panel::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 255, 255, 0.8);
      }
      
      .graphics-settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0, 255, 255, 0.3);
      }
      
      .graphics-settings-header h2 {
        margin: 0;
        font-size: 18px;
        color: #00ffff;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
      
      .settings-close-btn {
        background: none;
        border: none;
        color: #00ffff;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
      }
      
      .settings-close-btn:hover {
        background: rgba(0, 255, 255, 0.2);
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
      }
      
      /* Tabs */
      .settings-tabs {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        margin-bottom: 15px;
        max-height: 80px;
        overflow-y: auto;
      }
      
      .tab-btn {
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        color: #a0a0b0;
        padding: 8px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'Courier New', monospace;
        transition: all 0.2s;
      }
      
      .tab-btn:hover {
        background: rgba(0, 255, 255, 0.2);
        color: #00ffff;
      }
      
      .tab-btn.active {
        background: rgba(0, 255, 255, 0.3);
        border-color: #00ffff;
        color: #00ffff;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
      }
      
      /* Content */
      .settings-content {
        margin-bottom: 15px;
        min-height: 300px;
      }
      
      .settings-tab {
        display: none;
      }
      
      .settings-section {
        margin-bottom: 15px;
      }
      
      .settings-section h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #00ffff;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        padding-bottom: 8px;
      }
      
      .setting-item {
        margin-bottom: 12px;
      }
      
      .setting-item label {
        display: block;
        font-size: 13px;
        margin-bottom: 6px;
        color: #d0d0d8;
      }
      
      .setting-item small {
        display: block;
        font-size: 11px;
        color: #808090;
        margin-top: 4px;
      }
      
      /* Sliders */
      .slider-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .setting-slider {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: linear-gradient(to right, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.4));
        outline: none;
        -webkit-appearance: none;
      }
      
      .setting-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #00ffff;
        cursor: pointer;
        box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
      }
      
      .setting-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #00ffff;
        cursor: pointer;
        border: none;
        box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
      }
      
      .value-display {
        color: #00ffff;
        font-weight: bold;
        min-width: 50px;
        text-align: right;
      }
      
      /* Toggles */
      .toggle-switch {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      
      .setting-toggle {
        -webkit-appearance: none;
        appearance: none;
        width: 40px;
        height: 22px;
        background: rgba(0, 255, 255, 0.2);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 11px;
        cursor: pointer;
        position: relative;
        transition: all 0.2s;
      }
      
      .setting-toggle:checked {
        background: rgba(0, 255, 255, 0.4);
        border-color: #00ffff;
      }
      
      .setting-toggle::after {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #00ffff;
        top: 1px;
        left: 1px;
        transition: all 0.2s;
        box-shadow: 0 0 6px rgba(0, 255, 255, 0.6);
      }
      
      .setting-toggle:checked::after {
        left: 21px;
      }
      
      /* Select */
      .setting-select {
        width: 100%;
        padding: 8px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        color: #00ffff;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .setting-select:hover {
        border-color: #00ffff;
        box-shadow: 0 0 8px rgba(0, 255, 255, 0.2);
      }
      
      .setting-select option {
        background: #0a0a14;
        color: #00ffff;
      }
      
      /* Button Groups */
      .button-group {
        display: flex;
        gap: 6px;
      }
      
      .quality-btn {
        flex: 1;
        padding: 8px 12px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        color: #a0a0b0;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'Courier New', monospace;
        transition: all 0.2s;
      }
      
      .quality-btn:hover {
        background: rgba(0, 255, 255, 0.2);
        color: #00ffff;
      }
      
      .quality-btn.active {
        background: rgba(0, 255, 255, 0.3);
        border-color: #00ffff;
        color: #00ffff;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
      }
      
      /* Performance Monitor */
      .performance-monitor {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding: 10px;
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.2);
        border-radius: 4px;
        margin-bottom: 12px;
        font-size: 12px;
      }
      
      .perf-stat {
        text-align: center;
        color: #a0a0b0;
      }
      
      .perf-stat .fps-value,
      .perf-stat .memory-value,
      .perf-stat .gpu-value {
        color: #00ffff;
        font-weight: bold;
      }
      
      /* Presets */
      .settings-presets {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .preset-btn {
        padding: 10px 12px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        color: #a0a0b0;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'Courier New', monospace;
        transition: all 0.2s;
      }
      
      .preset-btn:hover {
        background: rgba(0, 255, 255, 0.2);
        color: #00ffff;
        border-color: #00ffff;
      }
      
      /* Actions */
      .settings-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      
      .btn {
        padding: 12px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        color: #00ffff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .btn:hover {
        background: rgba(0, 255, 255, 0.2);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        border-color: #00ffff;
      }
      
      .btn:active {
        transform: scale(0.98);
      }
      
      /* Responsive */
      @media (max-width: 1024px) {
        .graphics-settings-panel {
          width: 90%;
          right: 5%;
          left: 5%;
          transform: translateY(-50%);
        }
      }
      
      @media (max-width: 600px) {
        .graphics-settings-panel {
          width: calc(100% - 20px);
          right: 10px;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    `;
    document.head.appendChild(style);
  }
}
