import { UIComponent } from '../uiComponent.js';

/**
 * TriggerPrompt
 * Displays interaction prompt when player is near a trigger
 * Shows POI text and E key prompt
 */
export class TriggerPrompt extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'trigger-prompt';

    this.root.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      user-select: none;
      z-index: 1000;
      display: none;
    `;

    console.log('🎯 TriggerPrompt component created');
    console.log('📦 Container info:', {
      containerExists: !!container,
      containerType: container?.tagName || 'unknown',
      containerId: container?.id || 'no-id'
    });
    this._createElements();
  }

  _createElements() {
    // Main container with animation
    this.promptContainer = document.createElement('div');
    this.promptContainer.style.cssText = `
      text-align: center;
      animation: popIn 0.3s ease-out;
    `;

    // Add animation keyframes to document if not already there
    if (!document.querySelector('#trigger-prompt-styles')) {
      const style = document.createElement('style');
      style.id = 'trigger-prompt-styles';
      style.textContent = `
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .trigger-prompt-glow {
          animation: pulse 1s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
      console.log('✅ TriggerPrompt styles added to document');
    }

    // POI text
    this.poiText = document.createElement('div');
    this.poiText.style.cssText = `
      font-size: 24px;
      font-weight: bold;
      color: #ffd700;
      text-shadow: 
        0 0 10px rgba(255, 215, 0, 0.8),
        0 0 20px rgba(255, 100, 0, 0.4),
        2px 2px 4px rgba(0, 0, 0, 0.8);
      margin-bottom: 12px;
      letter-spacing: 1px;
      font-family: 'Arial', sans-serif;
    `;
    this.promptContainer.appendChild(this.poiText);

    // Interaction instruction
    this.keyPrompt = document.createElement('div');
    this.keyPrompt.style.cssText = `
      font-size: 18px;
      color: #ffffff;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: 'Arial', sans-serif;
    `;
    this.promptContainer.appendChild(this.keyPrompt);

    // E key button
    const keyButton = document.createElement('div');
    keyButton.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      border: 2px solid #45a049;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      font-family: 'Courier New', monospace;
    `;
    keyButton.textContent = 'E';
    this.keyPrompt.appendChild(keyButton);

    const instructionText = document.createElement('span');
    instructionText.textContent = 'to interact';
    this.keyPrompt.appendChild(instructionText);

    this.root.appendChild(this.promptContainer);
    console.log('✅ TriggerPrompt DOM elements created');
  }

  /**
   * Show trigger prompt
   * @param {Object} trigger - Trigger object with poiText and other data
   */
  show(trigger) {
    if (!trigger) return;

    console.log('🎯 TriggerPrompt.show() called with trigger:', trigger.id);
    console.log('📊 Root element info:', {
      rootInDOM: !!this.root.parentNode,
      rootDisplay: this.root.style.display,
      rootZIndex: this.root.style.zIndex,
      rootPosition: this.root.style.position,
      containerExists: !!this.promptContainer
    });
    
    this.poiText.textContent = trigger.poiText || 'Interact';
    this.promptContainer.classList.add('trigger-prompt-glow');
    this.root.style.display = 'block';
    
    console.log('✅ TriggerPrompt displayed, new display value:', this.root.style.display);
  }

  /**
   * Hide trigger prompt
   */
  hide() {
    console.log('❌ TriggerPrompt.hide() called');
    this.promptContainer.classList.remove('trigger-prompt-glow');
    this.root.style.display = 'none';
  }

  /**
   * Override mount to add debugging
   */
  mount() {
    console.log('📌 TriggerPrompt.mount() called');
    super.mount();
    console.log('📌 TriggerPrompt mounted, root in DOM:', !!this.root.parentNode);
    console.log('📌 Root visibility:', this.root.style.display);
  }

  update(props = {}) {
    // Update any dynamic properties if needed
    this.setProps(props);
  }
}
