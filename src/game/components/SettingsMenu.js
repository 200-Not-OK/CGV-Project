import { UIComponent } from '../uiComponent.js';

/**
 * SettingsMenu
 * Settings menu screen for game configuration
 */
export class SettingsMenu extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'settings-menu';
    this.onBack = props.onBack || (() => {});
    this.onOpenAdvancedGraphics = props.onOpenAdvancedGraphics || (() => {});

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
    if (!document.querySelector('#settings-menu-styles')) {
      const style = document.createElement('style');
      style.id = 'settings-menu-styles';
      style.textContent = `
        .settings-container {
          background: rgba(20, 20, 35, 0.9);
          border: 2px solid #ffd700;
          border-radius: 12px;
          padding: 40px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
          animation: slideInDown 0.8s ease-out;
        }

        .settings-title {
          font-size: 48px;
          font-weight: bold;
          color: #ffd700;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          margin: 0 0 30px 0;
          text-align: center;
          letter-spacing: 2px;
          font-family: Arial Black, sans-serif;
        }

        .settings-group {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }

        .settings-group:last-of-type {
          border-bottom: none;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          color: #ccc;
          font-family: Arial, sans-serif;
        }

        .setting-label {
          font-size: 16px;
          font-weight: 600;
          color: #ddd;
        }

        .setting-value {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .slider-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        input[type="range"] {
          width: 150px;
          height: 6px;
          cursor: pointer;
          background: linear-gradient(to right, #ffd700 0%, #ffd700 50%, #333 50%, #333 100%);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: 2px solid #ffd700;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: 2px solid #ffd700;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
        }

        .toggle-button {
          padding: 8px 16px;
          background: #333;
          border: 2px solid #ffd700;
          color: #ffd700;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          font-family: Arial, sans-serif;
        }

        .toggle-button:hover {
          background: #444;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }

        .toggle-button.active {
          background: #ffd700;
          color: #000;
        }

        .settings-buttons {
          display: flex;
          gap: 15px;
          margin-top: 40px;
          justify-content: center;
        }

        .settings-button {
          padding: 14px 40px;
          font-size: 18px;
          font-weight: bold;
          border: 2px solid #ffd700;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #2a2a3e, #1a1a2e);
          color: #ffd700;
        }

        .settings-button:hover {
          background: linear-gradient(135deg, #3a3a4e, #2a2a3e);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          transform: translateY(-2px);
        }

        .settings-button:active {
          transform: translateY(0);
        }

        .back-button {
          flex: 1;
        }

        .reset-button {
          flex: 1;
          border-color: #ff6b6b;
          color: #ff6b6b;
        }

        .reset-button:hover {
          box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
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
    container.className = 'settings-container';

    // Title
    const title = document.createElement('h1');
    title.className = 'settings-title';
    title.textContent = 'SETTINGS';
    container.appendChild(title);

    // Graphics settings group
    const graphicsGroup = document.createElement('div');
    graphicsGroup.className = 'settings-group';

    const graphicsTitle = document.createElement('div');
    graphicsTitle.style.cssText = 'font-size: 18px; font-weight: bold; color: #ffd700; margin-bottom: 15px;';
    graphicsTitle.textContent = 'GRAPHICS';
    graphicsGroup.appendChild(graphicsTitle);

    // Brightness
    const brightnessItem = document.createElement('div');
    brightnessItem.className = 'setting-item';
    brightnessItem.innerHTML = `
      <span class="setting-label">Brightness</span>
      <div class="setting-value">
        <div class="slider-container">
          <input type="range" min="50" max="150" value="100" class="brightness-slider">
          <span class="brightness-value">100%</span>
        </div>
      </div>
    `;
    const brightnessSlider = brightnessItem.querySelector('.brightness-slider');
    const brightnessValue = brightnessItem.querySelector('.brightness-value');
    brightnessSlider.addEventListener('input', (e) => {
      brightnessValue.textContent = e.target.value + '%';
      console.log('☀️ Brightness changed to:', e.target.value);
    });
    graphicsGroup.appendChild(brightnessItem);

    // Advanced Graphics Settings button
    const advancedGraphicsItem = document.createElement('div');
    advancedGraphicsItem.className = 'setting-item';
    advancedGraphicsItem.style.cssText = 'justify-content: center; margin-top: 20px;';
    const advancedGraphicsBtn = document.createElement('button');
    advancedGraphicsBtn.style.cssText = `
      background: #9c27b0;
      color: white;
      border: 2px solid #9c27b0;
      padding: 10px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      transition: all 0.3s ease;
    `;
    advancedGraphicsBtn.textContent = '⚙️ Advanced Graphics Settings';
    advancedGraphicsBtn.addEventListener('mouseover', () => {
      advancedGraphicsBtn.style.background = '#7b1fa2';
      advancedGraphicsBtn.style.boxShadow = '0 0 15px rgba(156, 39, 176, 0.6)';
    });
    advancedGraphicsBtn.addEventListener('mouseout', () => {
      advancedGraphicsBtn.style.background = '#9c27b0';
      advancedGraphicsBtn.style.boxShadow = 'none';
    });
    advancedGraphicsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log('⚙️ Opening Advanced Graphics Settings from SettingsMenu');
      // Call callback to let game.js handle the transition
      if (this.onOpenAdvancedGraphics) {
        this.onOpenAdvancedGraphics();
      }
    });
    advancedGraphicsItem.appendChild(advancedGraphicsBtn);
    graphicsGroup.appendChild(advancedGraphicsItem);

    container.appendChild(graphicsGroup);

    // Audio settings group
    const audioGroup = document.createElement('div');
    audioGroup.className = 'settings-group';

    const audioTitle = document.createElement('div');
    audioTitle.style.cssText = 'font-size: 18px; font-weight: bold; color: #ffd700; margin-bottom: 15px;';
    audioTitle.textContent = 'AUDIO';
    audioGroup.appendChild(audioTitle);

    // Master Volume (moved to audio section)
    const volumeItem = document.createElement('div');
    volumeItem.className = 'setting-item';
    volumeItem.innerHTML = `
      <span class="setting-label">Master Volume</span>
      <div class="setting-value">
        <div class="slider-container">
          <input type="range" min="0" max="100" value="70" class="volume-slider">
          <span class="volume-value">70%</span>
        </div>
      </div>
    `;
    const volumeSlider = volumeItem.querySelector('.volume-slider');
    const volumeValue = volumeItem.querySelector('.volume-value');
    volumeSlider.addEventListener('input', (e) => {
      volumeValue.textContent = e.target.value + '%';
      console.log('🔊 Volume changed to:', e.target.value);
    });
    audioGroup.appendChild(volumeItem);

    // Music Volume
    const musicItem = document.createElement('div');
    musicItem.className = 'setting-item';
    musicItem.innerHTML = `
      <span class="setting-label">Music Volume</span>
      <div class="setting-value">
        <div class="slider-container">
          <input type="range" min="0" max="100" value="80" class="music-slider">
          <span class="music-value">80%</span>
        </div>
      </div>
    `;
    const musicSlider = musicItem.querySelector('.music-slider');
    const musicValue = musicItem.querySelector('.music-value');
    musicSlider.addEventListener('input', (e) => {
      musicValue.textContent = e.target.value + '%';
      console.log('🎵 Music volume changed to:', e.target.value);
    });
    audioGroup.appendChild(musicItem);

    // SFX Volume
    const sfxItem = document.createElement('div');
    sfxItem.className = 'setting-item';
    sfxItem.innerHTML = `
      <span class="setting-label">SFX Volume</span>
      <div class="setting-value">
        <div class="slider-container">
          <input type="range" min="0" max="100" value="80" class="sfx-slider">
          <span class="sfx-value">80%</span>
        </div>
      </div>
    `;
    const sfxSlider = sfxItem.querySelector('.sfx-slider');
    const sfxValue = sfxItem.querySelector('.sfx-value');
    sfxSlider.addEventListener('input', (e) => {
      sfxValue.textContent = e.target.value + '%';
      console.log('🔊 SFX volume changed to:', e.target.value);
    });
    audioGroup.appendChild(sfxItem);

    container.appendChild(audioGroup);

    // Buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'settings-buttons';

    const backButton = document.createElement('button');
    backButton.className = 'settings-button back-button';
    backButton.textContent = 'BACK';
    backButton.addEventListener('click', () => {
      console.log('← Back from settings');
      this.onBack();
    });
    buttonsContainer.appendChild(backButton);

    const resetButton = document.createElement('button');
    resetButton.className = 'settings-button reset-button';
    resetButton.textContent = 'RESET TO DEFAULT';
    resetButton.addEventListener('click', () => {
      console.log('🔄 Resetting to default settings');
      volumeSlider.value = 70;
      volumeValue.textContent = '70%';
      brightnessSlider.value = 100;
      brightnessValue.textContent = '100%';
      musicSlider.value = 80;
      musicValue.textContent = '80%';
      sfxSlider.value = 80;
      sfxValue.textContent = '80%';
      shadowToggle.textContent = 'ON';
      shadowToggle.classList.add('active');
      shadowsEnabled = true;
    });
    buttonsContainer.appendChild(resetButton);

    container.appendChild(buttonsContainer);
    this.root.appendChild(container);

    console.log('⚙️ SettingsMenu elements created');
  }

  /**
   * Show the settings menu
   */
  show() {
    if (this.root) {
      this.root.style.display = 'flex';
      this.root.style.opacity = '1';
      this.root.style.pointerEvents = 'auto';
    }
  }

  /**
   * Hide the settings menu with fade-out effect
   * @param {number} duration - Fade duration in milliseconds
   */
  hide(duration = 500) {
    if (!this.root) return;

    this.root.style.transition = `opacity ${duration}ms ease-out`;
    this.root.style.opacity = '0';
    this.root.style.pointerEvents = 'none';

    setTimeout(() => {
      if (this.root) {
        this.root.style.display = 'none';
        this.root.style.opacity = '1'; // Reset for next use
        this.root.style.transition = '';
      }
    }, duration);
  }

  mount() {
    console.log('⚙️ SettingsMenu mounted');
    super.mount();
    // Start hidden - only show when explicitly called
    this.root.style.display = 'none';
  }

  unmount() {
    console.log('⚙️ SettingsMenu unmounted');
    super.unmount();
  }

  update(props = {}) {
    if (props.onBack) this.onBack = props.onBack;
  }
}
