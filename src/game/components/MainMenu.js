import { UIComponent } from '../uiComponent.js';

/**
 * MainMenu
 * Main menu screen displayed at game startup
 * Allows player to start game or access settings
 */
export class MainMenu extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'main-menu';
    this.onStart = props.onStart || (() => {});
    this.onSettings = props.onSettings || (() => {});

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
      overflow: hidden;
    `;

    this._createElements();
  }

  _createElements() {
    // Add styles to document if not already there
    if (!document.querySelector('#main-menu-styles')) {
      const style = document.createElement('style');
      style.id = 'main-menu-styles';
      style.textContent = `
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

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
          }
        }

        .main-menu-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 50px;
          animation: slideInDown 1s ease-out;
        }

        .main-menu-title {
          font-size: 72px;
          font-weight: 900;
          color: #ffd700;
          text-shadow: 
            0 0 30px rgba(255, 215, 0, 0.8),
            0 0 60px rgba(255, 100, 0, 0.6),
            4px 4px 8px rgba(0, 0, 0, 0.9);
          letter-spacing: 3px;
          animation: slideInDown 1s ease-out 0.2s both;
          margin: 0;
          font-family: Arial Black, sans-serif;
        }

        .main-menu-subtitle {
          font-size: 18px;
          color: #aaa;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          letter-spacing: 2px;
          animation: slideInDown 1s ease-out 0.4s both;
          margin: -40px 0 0 0;
          font-family: Arial, sans-serif;
        }

        .main-menu-buttons {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: slideInUp 1s ease-out 0.6s both;
        }

        .menu-button {
          padding: 18px 60px;
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
          background: linear-gradient(135deg, #2a2a3e, #1a1a2e);
          border: 2px solid #ffd700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: Arial, sans-serif;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          user-select: none;
          min-width: 300px;
        }

        .menu-button:hover {
          background: linear-gradient(135deg, #3a3a4e, #2a2a3e);
          box-shadow: 
            0 0 30px rgba(255, 215, 0, 0.6),
            0 4px 15px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-4px);
        }

        .menu-button:active {
          transform: translateY(-2px);
          box-shadow: 
            0 0 20px rgba(255, 215, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .menu-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .menu-button.start-button {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .menu-version {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-size: 12px;
          color: #666;
          font-family: monospace;
          animation: slideInUp 1s ease-out 1s both;
        }

        .menu-background-accent {
          position: fixed;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
          pointer-events: none;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .accent-1 {
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .accent-2 {
          bottom: -100px;
          right: -100px;
          animation-delay: 2s;
        }
      `;
      document.head.appendChild(style);
    }

    // Background accents
    const accent1 = document.createElement('div');
    accent1.className = 'menu-background-accent accent-1';
    this.root.appendChild(accent1);

    const accent2 = document.createElement('div');
    accent2.className = 'menu-background-accent accent-2';
    this.root.appendChild(accent2);

    // Main container
    const menuContainer = document.createElement('div');
    menuContainer.className = 'main-menu-container';

    // Title
    const title = document.createElement('h1');
    title.className = 'main-menu-title';
    title.textContent = 'REALM QUEST';
    menuContainer.appendChild(title);

    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.className = 'main-menu-subtitle';
    subtitle.textContent = 'ADVENTURE AWAITS';
    menuContainer.appendChild(subtitle);

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'main-menu-buttons';

    // Start button
    this.startButton = document.createElement('button');
    this.startButton.className = 'menu-button start-button';
    this.startButton.textContent = 'START GAME';
    this.startButton.addEventListener('click', () => {
      console.log('🎮 Start button clicked');
      this.onStart();
    });
    buttonsContainer.appendChild(this.startButton);

    // Settings button
    this.settingsButton = document.createElement('button');
    this.settingsButton.className = 'menu-button';
    this.settingsButton.textContent = 'SETTINGS';
    this.settingsButton.addEventListener('click', () => {
      console.log('⚙️ Settings button clicked');
      this.onSettings();
    });
    buttonsContainer.appendChild(this.settingsButton);

    menuContainer.appendChild(buttonsContainer);
    this.root.appendChild(menuContainer);

    // Version info
    const version = document.createElement('div');
    version.className = 'menu-version';
    version.textContent = 'v1.0.0 | © 2025';
    this.root.appendChild(version);

    console.log('🎮 MainMenu elements created');
  }

  /**
   * Show the menu
   */
  show() {
    if (this.root) {
      this.root.style.display = 'flex';
      this.root.style.opacity = '1';
      this.root.style.pointerEvents = 'auto';
    }
  }

  /**
   * Hide the menu with fade-out effect
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

  /**
   * Disable buttons during loading
   */
  disableButtons() {
    this.startButton.disabled = true;
    this.settingsButton.disabled = true;
  }

  /**
   * Enable buttons
   */
  enableButtons() {
    this.startButton.disabled = false;
    this.settingsButton.disabled = false;
  }

  mount() {
    console.log('🎮 MainMenu mounted');
    super.mount();
    // Start hidden - will be shown in _initializeLevel()
    this.root.style.display = 'none';
  }

  unmount() {
    console.log('🎮 MainMenu unmounted');
    super.unmount();
  }

  update(props = {}) {
    if (props.onStart) this.onStart = props.onStart;
    if (props.onSettings) this.onSettings = props.onSettings;
  }
}
