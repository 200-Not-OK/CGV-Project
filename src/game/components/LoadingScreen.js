import { UIComponent } from '../uiComponent.js';

/**
 * LoadingScreen
 * Displays a full-screen loading overlay while level content is being loaded and initialized
 */
export class LoadingScreen extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'loading-screen';

    this.root.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      pointer-events: auto;
      user-select: none;
    `;

    this._createElements();
  }

  _createElements() {
    // Add styles to document if not already there
    if (!document.querySelector('#loading-screen-styles')) {
      const style = document.createElement('style');
      style.id = 'loading-screen-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .loading-spinner {
          animation: spin 2s linear infinite;
        }

        .loading-text {
          animation: fadeIn 0.8s ease-in-out;
        }

        .loading-dot {
          animation: pulse 1.4s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    // Main loading container
    const container = document.createElement('div');
    container.style.cssText = `
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    `;

    // Spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.cssText = `
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 215, 0, 0.2);
      border-top: 4px solid #ffd700;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    `;

    // Loading text
    const textContainer = document.createElement('div');
    textContainer.className = 'loading-text';
    textContainer.style.cssText = `
      font-family: Arial, sans-serif;
      font-size: 24px;
      font-weight: bold;
      color: #ffd700;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
      letter-spacing: 2px;
    `;

    this.statusText = document.createElement('div');
    this.statusText.textContent = 'LOADING';
    this.statusText.style.cssText = `
      margin-bottom: 10px;
    `;
    textContainer.appendChild(this.statusText);

    // Animated dots
    const dotsContainer = document.createElement('div');
    dotsContainer.style.cssText = `
      font-size: 20px;
      color: #ffd700;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    `;

    this.dots = [];
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'loading-dot';
      dot.textContent = '●';
      dot.style.cssText = `
        opacity: ${0.6 + i * 0.15};
        animation-delay: ${i * 0.3}s;
      `;
      dotsContainer.appendChild(dot);
      this.dots.push(dot);
    }
    textContainer.appendChild(dotsContainer);

    // Progress bar
    this.progressBar = document.createElement('div');
    this.progressBar.style.cssText = `
      width: 300px;
      height: 8px;
      background: rgba(255, 215, 0, 0.1);
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(255, 215, 0, 0.3);
      margin-top: 20px;
    `;

    this.progressFill = document.createElement('div');
    this.progressFill.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, #ffd700, #ffed4e);
      width: 0%;
      transition: width 0.3s ease;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
    `;
    this.progressBar.appendChild(this.progressFill);

    // Progress text
    this.progressText = document.createElement('div');
    this.progressText.style.cssText = `
      color: #aaa;
      font-size: 12px;
      margin-top: 12px;
      font-family: monospace;
      min-height: 16px;
    `;

    container.appendChild(spinner);
    container.appendChild(textContainer);
    container.appendChild(this.progressBar);
    container.appendChild(this.progressText);

    this.root.appendChild(container);

    // Start hidden - only show when explicitly called
    this.root.style.display = 'none';
  }

  /**
   * Update loading status
   * @param {string} message - Status message to display
   * @param {number} progress - Progress percentage (0-100)
   */
  setStatus(message = 'LOADING', progress = 0) {
    if (this.statusText) {
      this.statusText.textContent = message;
    }
    if (this.progressFill && typeof progress === 'number') {
      this.progressFill.style.width = Math.min(100, Math.max(0, progress)) + '%';
    }
    if (this.progressText) {
      this.progressText.textContent = `${Math.round(progress)}%`;
    }
  }

  /**
   * Show the loading screen
   */
  show() {
    if (this.root) {
      this.root.style.display = 'flex';
    }
  }

  /**
   * Hide the loading screen with fade-out effect
   * @param {number} duration - Fade duration in milliseconds (default: 300)
   */
  hide(duration = 300) {
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
    console.log('📺 LoadingScreen mounted');
    super.mount();
  }

  unmount() {
    console.log('📺 LoadingScreen unmounted');
    super.unmount();
  }

  update(props = {}) {
    if (props.status !== undefined || props.progress !== undefined) {
      this.setStatus(props.status, props.progress);
    }
  }
}
