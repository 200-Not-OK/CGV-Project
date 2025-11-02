import { UIComponent } from '../uiComponent.js';

/**
 * SplashScreen
 * Full-screen splash screen shown during initial game startup
 * Displays logo and loads assets while showing loading progress
 */
export class SplashScreen extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'splash-screen';

    this.root.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0a0a15 0%, #1a1a2e 50%, #16213e 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      pointer-events: auto;
      user-select: none;
      overflow: hidden;
    `;

    this._createElements();
  }

  _createElements() {
    // Add styles to document if not already there
    if (!document.querySelector('#splash-screen-styles')) {
      const style = document.createElement('style');
      style.id = 'splash-screen-styles';
      style.textContent = `
        @keyframes splashFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes splashPulseGlow {
          0%, 100% {
            text-shadow: 
              0 0 30px rgba(255, 215, 0, 0.8),
              0 0 60px rgba(255, 100, 0, 0.6),
              4px 4px 8px rgba(0, 0, 0, 0.9);
          }
          50% {
            text-shadow: 
              0 0 50px rgba(255, 215, 0, 1),
              0 0 80px rgba(255, 100, 0, 0.8),
              4px 4px 8px rgba(0, 0, 0, 0.9);
          }
        }

        @keyframes splashSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes splashSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .splash-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          animation: splashFadeIn 0.6s ease-in;
        }

        .splash-logo {
          font-size: 72px;
          font-weight: 900;
          color: #ffd700;
          text-shadow: 
            0 0 30px rgba(255, 215, 0, 0.8),
            0 0 60px rgba(255, 100, 0, 0.6),
            4px 4px 8px rgba(0, 0, 0, 0.9);
          letter-spacing: 3px;
          animation: splashPulseGlow 3s ease-in-out infinite;
          margin: 0;
          font-family: Arial Black, sans-serif;
        }

        .splash-tagline {
          font-size: 18px;
          color: #aaa;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          letter-spacing: 2px;
          animation: splashSlideUp 0.8s ease-out 0.3s backwards;
          margin: -20px 0 0 0;
          font-family: Arial, sans-serif;
        }

        .splash-loading-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          margin-top: 30px;
          animation: splashSlideUp 0.8s ease-out 0.6s backwards;
        }

        .splash-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 215, 0, 0.2);
          border-top: 3px solid #ffd700;
          border-radius: 50%;
          animation: splashSpin 1.5s linear infinite;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
        }

        .splash-status {
          font-size: 14px;
          color: #ccc;
          font-family: Arial, sans-serif;
          min-height: 20px;
          letter-spacing: 1px;
        }

        .splash-progress {
          width: 250px;
          height: 6px;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 3px;
          overflow: hidden;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .splash-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ffd700, #ffed4e);
          width: 0%;
          transition: width 0.3s ease;
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }

        .splash-hint {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
          animation: splashSlideUp 0.8s ease-out 1s backwards;
          max-width: 300px;
          font-family: Arial, sans-serif;
        }
      `;
      document.head.appendChild(style);
    }

    // Main splash container
    const container = document.createElement('div');
    container.className = 'splash-container';

    // Logo - same as main menu
    const logo = document.createElement('h1');
    logo.className = 'splash-logo';
    logo.textContent = 'THE EDGE';
    container.appendChild(logo);

    // Tagline - same as main menu
    const tagline = document.createElement('p');
    tagline.className = 'splash-tagline';
    tagline.textContent = 'CONQUER THE EDGE';
    container.appendChild(tagline);

    // Loading section
    const loadingSection = document.createElement('div');
    loadingSection.className = 'splash-loading-section';

    // Spinner
    const spinner = document.createElement('div');
    spinner.className = 'splash-spinner';
    loadingSection.appendChild(spinner);

    // Status text
    this.statusText = document.createElement('div');
    this.statusText.className = 'splash-status';
    this.statusText.textContent = 'Initializing...';
    loadingSection.appendChild(this.statusText);

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'splash-progress';

    this.progressFill = document.createElement('div');
    this.progressFill.className = 'splash-progress-fill';
    progressBar.appendChild(this.progressFill);
    loadingSection.appendChild(progressBar);

    container.appendChild(loadingSection);

    // Hint text
    const hint = document.createElement('p');
    hint.className = 'splash-hint';
    hint.textContent = '✦ Loading assets and initializing engine ✦';
    container.appendChild(hint);

    this.root.appendChild(container);

    // Start visible
    this.root.style.display = 'flex';
  }

  /**
   * Update splash screen status
   */
  setStatus(message = 'Initializing...', progress = 0) {
    if (this.statusText) {
      this.statusText.textContent = message;
    }
    if (this.progressFill && typeof progress === 'number') {
      const percent = Math.min(100, Math.max(0, progress));
      this.progressFill.style.width = percent + '%';
    }
  }

  /**
   * Show the splash screen
   */
  show() {
    if (this.root) {
      this.root.style.display = 'flex';
      this.root.style.opacity = '1';
      this.root.style.pointerEvents = 'auto';
    }
  }

  /**
   * Hide the splash screen with fade-out effect
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

  mount() {
    console.log('🎨 SplashScreen mounted');
    super.mount();
  }

  unmount() {
    console.log('🎨 SplashScreen unmounted');
    super.unmount();
  }
}
