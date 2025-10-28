import { UIComponent } from '../uiComponent.js';

export class SmallMenu extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'game-smallmenu';
    this.root.style.position = 'absolute';
    this.root.style.left = '50%';
    this.root.style.top = '50%';
    this.root.style.transform = 'translate(-50%, -50%)';
    this.root.style.background = 'rgba(20,20,20,0.95)';
    this.root.style.padding = '20px';
    this.root.style.borderRadius = '8px';
    this.root.style.color = 'white';
    this.root.style.pointerEvents = 'auto';
    this.root.style.minWidth = '200px';

    // Ensure default is OFF unless explicitly provided
    this._shadersOn = (props && typeof props.initialShadersOn === 'boolean') ? props.initialShadersOn : false;

    this.root.innerHTML = `
      <div style="text-align:center">
        <h3 style="margin:0 0 16px 0">Menu</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button id="menu-resume" style="padding:8px 16px;cursor:pointer;border:none;border-radius:4px;background:#4CAF50;color:white;font-size:14px;">Resume</button>
          <button id="menu-toggle-shaders" style="padding:8px 16px;cursor:pointer;border:none;border-radius:4px;background:#2196F3;color:white;font-size:14px;">Toggle Shaders</button>
        </div>
        <div id="shader-status" style="margin-top:12px;font-size:12px;color:#aaa;">Shaders: ${this._shadersOn ? 'ON' : 'OFF'}</div>
      </div>
    `;
    
    const resumeBtn = this.root.querySelector('#menu-resume');
    const toggleBtn = this.root.querySelector('#menu-toggle-shaders');
    const statusEl = this.root.querySelector('#shader-status');

    // ensure initial color matches initial state
    if (statusEl) {
      statusEl.textContent = `Shaders: ${this._shadersOn ? 'ON' : 'OFF'}`;
      statusEl.style.color = this._shadersOn ? '#4CAF50' : '#ff6b6b';
    }

    resumeBtn.addEventListener('click', (e) => {
      if (props && props.onResume) props.onResume();
    });

    toggleBtn.addEventListener('click', (e) => {
      let newState;
      if (props && typeof props.onToggleShaders === 'function') {
        // If the caller returns the new state, use it. Otherwise toggle local state.
        const result = props.onToggleShaders();
        if (typeof result === 'boolean') {
          newState = result;
        } else {
          this._shadersOn = !this._shadersOn;
          newState = this._shadersOn;
        }
      } else {
        // no prop handler — just toggle internal state
        this._shadersOn = !this._shadersOn;
        newState = this._shadersOn;
      }

      if (statusEl) {
        statusEl.textContent = `Shaders: ${newState ? 'ON' : 'OFF'}`;
        statusEl.style.color = newState ? '#4CAF50' : '#ff6b6b';
      }
    });
  }
}
