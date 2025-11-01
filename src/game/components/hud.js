import { UIComponent } from '../uiComponent.js';

export class HUD extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'game-hud';
    
    // Modern HUD styling with cartoonish elements
    this.root.style.position = 'absolute';
    this.root.style.left = '20px';
    this.root.style.top = '20px';
    this.root.style.fontFamily = '"Comic Sans MS", "Comic Sans", cursive, system-ui';
    this.root.style.pointerEvents = 'none';
    this.root.style.userSelect = 'none';

    // Current health values for smooth animations
    this.currentHealth = 100;
    this.maxHealth = 100;
    this.displayHealth = 100;

    this._createElements();
    this.setProps(props);
    this.removeLowHealthEffect();
  }

  _createElements() {
    // Create health container with cartoonish styling
    this.healthContainer = document.createElement('div');
    this.healthContainer.style.cssText = `
      background: linear-gradient(145deg, #2a5298, #1e3a8a);
      border: 3px solid #60a5fa;
      border-radius: 20px;
      padding: 12px 16px;
      box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.3),
        inset 0 2px 0 rgba(255, 255, 255, 0.2);
      position: relative;
      min-width: 200px;
      backdrop-filter: blur(5px);
    `;
    
    // Create heart icon
    this.heartIcon = document.createElement('div');
    this.heartIcon.style.cssText = `
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-right: 8px;
      vertical-align: middle;
      font-size: 20px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    `;
    this.heartIcon.innerHTML = '❤️';
    
    // Create health bar background
    this.healthBarBg = document.createElement('div');
    this.healthBarBg.style.cssText = `
      background: linear-gradient(to right, #7f1d1d, #991b1b);
      border: 2px solid #dc2626;
      border-radius: 15px;
      height: 20px;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
      margin: 4px 0;
    `;
    
    // Create health bar fill
    this.healthBarFill = document.createElement('div');
    this.healthBarFill.style.cssText = `
      background: linear-gradient(to right, #ef4444, #dc2626, #f87171);
      height: 100%;
      width: 100%;
      border-radius: 13px;
      transition: width 0.3s ease-out;
      position: relative;
      overflow: hidden;
    `;
    
    // Create health bar shine effect
    this.healthBarShine = document.createElement('div');
    this.healthBarShine.style.cssText = `
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 30%, 
        rgba(255, 255, 255, 0.6) 50%, 
        rgba(255, 255, 255, 0.3) 70%, 
        transparent 100%);
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      animation: shine 3s infinite linear;
    `;
    
    // Create health text
    this.healthText = document.createElement('div');
    this.healthText.style.cssText = `
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-shadow: 
        2px 2px 0 #000000,
        -2px -2px 0 #000000,
        2px -2px 0 #000000,
        -2px 2px 0 #000000,
        0 2px 4px rgba(0, 0, 0, 0.5);
      margin-top: 4px;
      letter-spacing: 1px;
    `;
    
    // Add CSS animation for shine effect
    if (!document.getElementById('hud-animations')) {
      const style = document.createElement('style');
      style.id = 'hud-animations';
      style.textContent = `
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes lowHealthPulse {
          0%, 100% { 
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3),
                        inset 0 2px 0 rgba(255, 255, 255, 0.2);
          }
          50% { 
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5),
                        inset 0 2px 0 rgba(255, 255, 255, 0.2),
                        0 0 20px rgba(239, 68, 68, 0.3);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Assemble the health HUD
    this.healthBarFill.appendChild(this.healthBarShine);
    this.healthBarBg.appendChild(this.healthBarFill);
    
    const healthHeader = document.createElement('div');
    healthHeader.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    `;
    
    const healthLabel = document.createElement('span');
    healthLabel.style.cssText = `
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    `;
    healthLabel.textContent = 'HEALTH';
    
    healthHeader.appendChild(this.heartIcon);
    healthHeader.appendChild(healthLabel);
    
    this.healthContainer.appendChild(healthHeader);
    this.healthContainer.appendChild(this.healthBarBg);
    this.healthContainer.appendChild(this.healthText);
    
    this.root.appendChild(this.healthContainer);
    
    // Create node counter container (initially hidden, appears after talking to Richard)
    // Note: We position this relative to the Collectibles UI so it always appears BELOW it.
    this.nodeContainer = document.createElement('div');
    this.nodeContainer.style.cssText = `
      background: linear-gradient(145deg, #2a5298, #1e3a8a);
      border: 3px solid #60a5fa;
      border-radius: 20px;
      padding: 12px 16px;
      box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.3),
        inset 0 2px 0 rgba(255, 255, 255, 0.2);
      position: absolute;
      left: 20px;
      backdrop-filter: blur(5px);
      min-width: 150px;
      z-index: 10;
    `;
    
    this.nodeText = document.createElement('div');
    this.nodeText.style.cssText = `
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-shadow: 
        2px 2px 0 #000000,
        -2px -2px 0 #000000,
        2px -2px 0 #000000,
        -2px 2px 0 #000000,
        0 2px 4px rgba(0, 0, 0, 0.5);
      letter-spacing: 1px;
    `;
    this.nodeText.textContent = 'Nodes: 0/2';
    
  this.nodeContainer.appendChild(this.nodeText);
  this.nodeContainer.style.display = 'none';
  // Append to the HUD container's parent (so we can freely position it relative to the page)
  (this.container || document.body).appendChild(this.nodeContainer);
    
  // Reposition on window resize (in case layout changes)
  window.addEventListener('resize', () => this.positionNodeBelowCollectibles());
    
    // Initialize node count
    this.nodeCount = 0;
    this.totalNodes = 2;
  }

  // Show or hide node counter
  showNodeCounter(show) {
    if (!this.nodeContainer) return;
    this.nodeContainer.style.display = show ? 'block' : 'none';
    if (show) {
      // Ensure it's placed below collectibles when shown
      this.positionNodeBelowCollectibles();
    }
  }

  // Position the node counter immediately below the collectibles UI box
  positionNodeBelowCollectibles(spacing = 10) {
    try {
      const collectiblesEl = document.querySelector('.collectibles-ui');
      if (collectiblesEl && this.nodeContainer) {
        const rect = collectiblesEl.getBoundingClientRect();
        const top = Math.round(window.scrollY + rect.bottom + spacing);
        // Align left edge with collectibles (collectibles is at left: 20px already)
        this.nodeContainer.style.top = `${top}px`;
        this.nodeContainer.style.left = `${collectiblesEl.style.left || '20px'}`;
      } else if (this.nodeContainer) {
        // Fallback: place it under the health HUD
        const healthTop = parseInt(this.root.style.top || '20', 10);
        const fallbackTop = healthTop + (this.healthContainer?.offsetHeight || 100) + 60;
        this.nodeContainer.style.top = `${fallbackTop}px`;
        this.nodeContainer.style.left = this.root.style.left || '20px';
      }
    } catch (e) {
      // Safe fallback if any error occurs
      this.nodeContainer.style.top = '220px';
      this.nodeContainer.style.left = '20px';
    }
  }

  setProps(props) {
    super.setProps(props);
    if (props && props.health !== undefined) {
      this.updateHealthDisplay(props.health, props.maxHealth || 100);
    }
  }

  updateHealthDisplay(health, maxHealth) {
    this.currentHealth = health;
    this.maxHealth = maxHealth;
    
    // Calculate health percentage
    const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));
    
    // Update health bar width with smooth animation
    this.healthBarFill.style.width = `${healthPercent}%`;
    
    // Update health text
    this.healthText.textContent = `${Math.round(health)} / ${Math.round(maxHealth)}`;
    
    // Update heart icon and container styling based on health
    if (healthPercent <= 25) {
      // Critical health - red pulsing effect
      this.heartIcon.innerHTML = '💔';
      this.healthContainer.style.animation = 'lowHealthPulse 1s infinite ease-in-out';
      this.healthBarFill.style.background = 'linear-gradient(to right, #dc2626, #b91c1c, #ef4444)';
    } else if (healthPercent <= 50) {
      // Low health - warning state
      this.heartIcon.innerHTML = '💔';
      this.healthContainer.style.animation = 'pulse 2s infinite ease-in-out';
      this.healthBarFill.style.background = 'linear-gradient(to right, #ea580c, #dc2626, #f97316)';
    } else {
      // Healthy - normal state
      this.heartIcon.innerHTML = '❤️';
      this.healthContainer.style.animation = 'none';
      this.healthBarFill.style.background = 'linear-gradient(to right, #ef4444, #dc2626, #f87171)';
    }
    
    // Add screen edge glow effect for very low health
    if (healthPercent <= 15) {
      this.addLowHealthEffect();
    } else {
      this.removeLowHealthEffect();
    }
  }

  addLowHealthEffect() {
    // Avoid duplicates from previous HUD instances
    if (document.getElementById('low-health-overlay')) return;

    if (!this.lowHealthOverlay) {
      const overlay = document.createElement('div');
      overlay.id = 'low-health-overlay'; // <-- fixed id
      overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        z-index: 1;
        box-shadow: inset 0 0 100px rgba(220, 38, 38, 0.3);
        animation: lowHealthScreen 1.5s infinite ease-in-out;
      `;

      // Ensure the animation is present
      if (!document.getElementById('screen-effects')) {
        const style = document.createElement('style');
        style.id = 'screen-effects';
        style.textContent = `
          @keyframes lowHealthScreen {
            0%, 100% { box-shadow: inset 0 0 100px rgba(220, 38, 38, 0.2); }
            50%      { box-shadow: inset 0 0 100px rgba(220, 38, 38, 0.4); }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(overlay);
      this.lowHealthOverlay = overlay;
    }
  }


removeLowHealthEffect() {
  // Remove the instance reference if present
  if (this.lowHealthOverlay && this.lowHealthOverlay.parentNode) {
    this.lowHealthOverlay.parentNode.removeChild(this.lowHealthOverlay);
  }
  // Also remove any stale overlay left by previous HUD instances
  const stale = document.getElementById('low-health-overlay');
  if (stale && stale.parentNode) {
    stale.parentNode.removeChild(stale);
  }
  this.lowHealthOverlay = null;
}


  updateCollectibles(apples, totalApples, potions) {
    // Update apples with color coding
    this.applesCollected = apples || 0;
    this.totalApples = totalApples || 10;
    this.appleText.textContent = `Apples: ${this.applesCollected} / ${this.totalApples}`;
    
    // Change apple display color based on progress
    const appleProgress = this.applesCollected / this.totalApples;
    if (appleProgress >= 1.0) {
      this.appleText.style.color = '#4caf50'; // Green when complete
      this.appleIcon.textContent = '🏆'; // Trophy when all collected
    } else if (appleProgress >= 0.5) {
      this.appleText.style.color = '#ff9800'; // Orange when halfway
    } else {
      this.appleText.style.color = '#ffeb3b'; // Yellow when starting
    }
    
    // Update health potions
    this.healthPotions = potions !== undefined ? potions : this.healthPotions;
    this.potionText.textContent = `Health Potions: ${this.healthPotions}`;
    
    // Change potion display based on count
    if (this.healthPotions === 0) {
      this.potionText.style.color = '#f44336'; // Red when empty
      this.potionIcon.textContent = '💔';
    } else if (this.healthPotions <= 1) {
      this.potionText.style.color = '#ff9800'; // Orange when low
      this.potionIcon.textContent = '🧪';
    } else {
      this.potionText.style.color = '#4caf50'; // Green when good
      this.potionIcon.textContent = '🧪';
    }
  }

  // Method to collect an apple (example usage)
  collectApple() {
    this.applesCollected = Math.min(this.applesCollected + 1, this.totalApples);
    this.updateCollectibles(this.applesCollected, this.totalApples, this.healthPotions);
  }

  // Method to add a health potion to inventory
  addPotion() {
    this.healthPotions++;
    this.updateCollectibles(this.applesCollected, this.totalApples, this.healthPotions);
    console.log(`🧪 Added potion! Total: ${this.healthPotions}`);
  }

  // Method to use a health potion
  useHealthPotion() {
    if (this.healthPotions > 0) {
      this.healthPotions--;
      this.updateCollectibles(this.applesCollected, this.totalApples, this.healthPotions);
      return true; // Successfully used potion
    }
    return false; // No potions available
  }

  updateNodeCount(count, total = 2) {
    this.nodeCount = count;
    this.totalNodes = total;
    this.nodeText.textContent = `Nodes: ${count}/${total}`;
    
    // Change color based on progress
    if (count >= total) {
      this.nodeText.style.color = '#4caf50'; // Green when complete
    } else if (count >= total / 2) {
      this.nodeText.style.color = '#ff9800'; // Orange when halfway
    } else {
      this.nodeText.style.color = '#ffeb3b'; // Yellow when starting
    }
  }

  update(delta, ctx) {
    // ctx can contain game state like player health/score
    if (ctx && ctx.player) {
      const hp = Math.round(ctx.player.health ?? 100);
      const maxHp = Math.round(ctx.player.maxHealth ?? 100);
      this.updateHealthDisplay(hp, maxHp);
    }
    
    // Smooth health number animation
    if (this.displayHealth !== this.currentHealth) {
      const diff = this.currentHealth - this.displayHealth;
      const step = diff * delta * 3; // Smooth transition speed
      this.displayHealth += step;
      
      if (Math.abs(diff) < 0.1) {
        this.displayHealth = this.currentHealth;
      }
    }
  }
}
