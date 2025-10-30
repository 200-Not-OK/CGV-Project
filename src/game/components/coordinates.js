import { UIComponent } from '../uiComponent.js';

export class Coordinates extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'coordinates-display';
    
    // Coordinates display styling
    this.root.style.position = 'fixed';
    this.root.style.bottom = '20px';
    this.root.style.left = '20px';
    this.root.style.color = '#00ffff';
    this.root.style.fontFamily = 'Consolas, "Courier New", monospace';
    this.root.style.fontSize = '14px';
    this.root.style.fontWeight = 'bold';
    this.root.style.background = 'rgba(0, 0, 0, 0.8)';
    this.root.style.padding = '10px 14px';
    this.root.style.borderRadius = '6px';
    this.root.style.pointerEvents = 'none';
    this.root.style.zIndex = '10000';
    this.root.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 1)';
    this.root.style.border = '1px solid #00ffff';
    this.root.style.lineHeight = '1.6';
    
    this._createElements();
    this.setProps(props);
  }
  
  _createElements() {
    // Player coordinates display
    this.playerCoordsLabel = document.createElement('div');
    this.playerCoordsLabel.textContent = 'Player:';
    this.playerCoordsLabel.style.color = '#00ffff';
    this.playerCoordsLabel.style.marginBottom = '4px';
    this.root.appendChild(this.playerCoordsLabel);
    
    this.playerCoordsDisplay = document.createElement('div');
    this.playerCoordsDisplay.textContent = 'X: 0.00, Y: 0.00, Z: 0.00';
    this.playerCoordsDisplay.style.color = '#ffffff';
    this.playerCoordsDisplay.style.fontSize = '13px';
    this.playerCoordsDisplay.style.marginLeft = '10px';
    this.root.appendChild(this.playerCoordsDisplay);
    
    // Free camera coordinates display
    this.cameraCoordsLabel = document.createElement('div');
    this.cameraCoordsLabel.textContent = 'Free Cam:';
    this.cameraCoordsLabel.style.color = '#ffff00';
    this.cameraCoordsLabel.style.marginTop = '8px';
    this.cameraCoordsLabel.style.marginBottom = '4px';
    this.root.appendChild(this.cameraCoordsLabel);
    
    this.cameraCoordsDisplay = document.createElement('div');
    this.cameraCoordsDisplay.textContent = 'X: 0.00, Y: 0.00, Z: 0.00';
    this.cameraCoordsDisplay.style.color = '#ffffff';
    this.cameraCoordsDisplay.style.fontSize = '13px';
    this.cameraCoordsDisplay.style.marginLeft = '10px';
    this.root.appendChild(this.cameraCoordsDisplay);
  }
  
  update(delta, ctx) {
    // Update player coordinates
    if (ctx && ctx.playerModel && ctx.playerModel.position) {
      const pos = ctx.playerModel.position;
      this.playerCoordsDisplay.textContent = 
        `X: ${pos.x.toFixed(2)}, Y: ${pos.y.toFixed(2)}, Z: ${pos.z.toFixed(2)}`;
    } else if (ctx && ctx.game && ctx.game.player) {
      // Fallback: try getPosition method
      const player = ctx.game.player;
      if (player.getPosition) {
        const pos = player.getPosition();
        this.playerCoordsDisplay.textContent = 
          `X: ${pos.x.toFixed(2)}, Y: ${pos.y.toFixed(2)}, Z: ${pos.z.toFixed(2)}`;
      } else if (player.mesh && player.mesh.position) {
        const pos = player.mesh.position;
        this.playerCoordsDisplay.textContent = 
          `X: ${pos.x.toFixed(2)}, Y: ${pos.y.toFixed(2)}, Z: ${pos.z.toFixed(2)}`;
      }
    }
    
    // Update free camera coordinates
    if (ctx && ctx.game && ctx.game.freeCameraObject) {
      const cam = ctx.game.freeCameraObject;
      if (cam.position) {
        const pos = cam.position;
        this.cameraCoordsDisplay.textContent = 
          `X: ${pos.x.toFixed(2)}, Y: ${pos.y.toFixed(2)}, Z: ${pos.z.toFixed(2)}`;
      }
    }
  }
  
  setProps(props) {
    super.setProps(props);
    
    // Allow customization of position
    if (props.position) {
      const { top, right, bottom, left } = props.position;
      if (top !== undefined) this.root.style.top = `${top}px`;
      if (right !== undefined) this.root.style.right = `${right}px`;
      if (bottom !== undefined) this.root.style.bottom = `${bottom}px`;
      if (left !== undefined) this.root.style.left = `${left}px`;
    }
  }
}

