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

    this.root.innerHTML = `
      <div style="text-align:center">
        <h3 style="margin:0 0 16px 0">Menu</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button id="menu-resume" style="padding:8px 16px;cursor:pointer;border:none;border-radius:4px;background:#4CAF50;color:white;font-size:14px;">Resume</button>
          <button id="menu-toggle-shaders" style="padding:8px 16px;cursor:pointer;border:none;border-radius:4px;background:#2196F3;color:white;font-size:14px;">Toggle Shaders</button>
        </div>
        <div id="shader-status" style="margin-top:12px;font-size:12px;color:#aaa;">Shaders: ON</div>
      </div>
    `;
    
    this.root.querySelector('#menu-resume').addEventListener('click', (e) => {
      if (props && props.onResume) props.onResume();
    });

    this.root.querySelector('#menu-toggle-shaders').addEventListener('click', (e) => {
      if (props && props.onToggleShaders) {
        const newState = props.onToggleShaders();
        const statusEl = this.root.querySelector('#shader-status');
        if (statusEl) {
          statusEl.textContent = `Shaders: ${newState ? 'ON' : 'OFF'}`;
          statusEl.style.color = newState ? '#4CAF50' : '#ff6b6b';
        }
      }
    });
  }
}
