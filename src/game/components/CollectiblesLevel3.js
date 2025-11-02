import { UIComponent } from '../uiComponent.js';

export class CollectiblesLevel3 extends UIComponent {
  constructor(container, props = {}) {
    super(container, props);
    this.root.className = 'collectibles-ui-level3';
    
    // Level 3 only has potions and LLMs (no apples)
    this.collectibleTypes = props.collectibleTypes || {
      potions: { icon: '🧪', name: 'Health Potions', color: '#4caf50', lowColor: '#ff9800', emptyColor: '#f44336', emptyIcon: '💔' },
      llm_gpt: { icon: '🤖', name: 'GPT', color: '#10a37f', collectedColor: '#51cf66' },
      llm_claude: { icon: '🤖', name: 'Claude', color: '#d4af37', collectedColor: '#51cf66' },
      llm_gemini: { icon: '🤖', name: 'Gemini', color: '#8b5cf6', collectedColor: '#51cf66' }
    };
    
    // Initial values - no apples in Level 3
    this.collectibles = {
      potions: { count: props.potionsStart || 3 },
      llms: {
        gpt: { collected: 0, total: props.llmGptTotal || 0 },
        claude: { collected: 0, total: props.llmClaudeTotal || 0 },
        gemini: { collected: 0, total: props.llmGeminiTotal || 0 }
      }
    };
    
    this._createElements();
  }

  _createElements() {
    // Main container styling
    this.root.style.cssText = `
      position: absolute;
      left: 20px;
      top: 135px;
      font-family: "Comic Sans MS", "Comic Sans", cursive, system-ui;
      pointer-events: none;
      user-select: none;
    `;

    // Collectibles container
    this.collectiblesContainer = document.createElement('div');
    this.collectiblesContainer.style.cssText = `
      padding: 12px 14px;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 40, 0.8));
      border-radius: 15px;
      color: #ffffff;
      font-size: 14px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
      border: 2px solid rgba(255, 215, 0, 0.4);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      min-width: 180px;
    `;

    // Create sections for Level 3 (no apples)
    this.sections = {};
    this._createPotionSection();
    this._createLLMSection();

    this.root.appendChild(this.collectiblesContainer);
  }

  _createPotionSection() {
    const config = this.collectibleTypes.potions;
    
    this.sections.potions = document.createElement('div');
    this.sections.potions.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-weight: bold;
      padding: 4px 0;
    `;
    
    this.potionIcon = document.createElement('span');
    this.potionIcon.textContent = config.icon;
    this.potionIcon.style.cssText = `
      font-size: 16px;
      margin-right: 10px;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.6));
      transition: all 0.3s ease;
    `;
    
    this.potionText = document.createElement('span');
    this.potionText.textContent = `${config.name}: ${this.collectibles.potions.count}`;
    this.potionText.style.cssText = `
      color: ${config.color};
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      transition: color 0.3s ease;
    `;
    
    this.sections.potions.appendChild(this.potionIcon);
    this.sections.potions.appendChild(this.potionText);
    this.collectiblesContainer.appendChild(this.sections.potions);
  }

  _createLLMSection() {
    const section = document.createElement('div');
    section.style.cssText = `
      margin-bottom: 5px;
      padding: 4px 0;
    `;
    
    // LLM section header
    const header = document.createElement('div');
    header.style.cssText = `
      font-weight: bold;
      margin-bottom: 10px;
      color: #ffffff;
      text-align: center;
      font-size: 14px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      padding-bottom: 5px;
    `;
    header.textContent = 'AI MODELS';
    section.appendChild(header);
    
    // LLM items container
    this.llmContainer = document.createElement('div');
    this.llmContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      gap: 8px;
    `;
    
    // Create individual LLM items
    this.llmItems = {};
    
    ['gpt', 'claude', 'gemini'].forEach(llmType => {
      const config = this.collectibleTypes[`llm_${llmType}`];
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        padding: 6px 4px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        min-height: 50px;
      `;
      
      const icon = document.createElement('span');
      icon.textContent = config.icon;
      icon.style.cssText = `
        font-size: 16px;
        margin-bottom: 4px;
        filter: grayscale(100%) brightness(0.7);
        transition: all 0.3s ease;
      `;
      
      const name = document.createElement('span');
      name.textContent = config.name;
      name.style.cssText = `
        font-size: 11px;
        color: ${config.color};
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        transition: color 0.3s ease;
        font-weight: bold;
        margin-bottom: 2px;
      `;
      
      const count = document.createElement('span');
      count.textContent = '0';
      count.style.cssText = `
        font-size: 10px;
        color: #888;
        transition: color 0.3s ease;
      `;
      
      item.appendChild(icon);
      item.appendChild(name);
      item.appendChild(count);
      
      this.llmContainer.appendChild(item);
      
      this.llmItems[llmType] = { item, icon, name, count, config };
    });
    
    section.appendChild(this.llmContainer);
    this.collectiblesContainer.appendChild(section);
    this.sections.llms = section;
    
    // Update initial LLM display
    this._updateLLMDisplay();
  }

  // Public methods for updating collectibles
  addPotion() {
    this.collectibles.potions.count++;
    this._updatePotionDisplay();
    this._playCollectAnimation(this.potionIcon);
    console.log(`🧪 Added potion! Total: ${this.collectibles.potions.count}`);
    return true;
  }

  useHealthPotion() {
    if (this.collectibles.potions.count > 0) {
      this.collectibles.potions.count--;
      this._updatePotionDisplay();
      this._playCollectAnimation(this.potionIcon);
      return true;
    }
    return false;
  }

  addHealthPotion(count = 1) {
    this.collectibles.potions.count += count;
    this._updatePotionDisplay();
    this._playCollectAnimation(this.potionIcon);
  }

  // LLM collection method
  collectLLM(llmType) {
    console.log(`🔍 [CollectiblesLevel3] collectLLM called with: ${llmType}`);
    console.log(`🔍 [CollectiblesLevel3] Current state BEFORE:`, JSON.parse(JSON.stringify(this.collectibles.llms)));
    
    if (['gpt', 'claude', 'gemini'].includes(llmType)) {
      this.collectibles.llms[llmType].collected++;
      this._updateLLMDisplay();
      this._playLLMCollectAnimation(llmType);
      
      console.log(`🔍 [CollectiblesLevel3] Current state AFTER:`, JSON.parse(JSON.stringify(this.collectibles.llms)));
      console.log(`🤖 Collected LLM ${llmType.toUpperCase()}! Total: ${this.collectibles.llms[llmType].collected}`);
      return true;
    }
    console.warn(`⚠️ [CollectiblesLevel3] Invalid LLM type: ${llmType}`);
    return false;
  }

  // Set LLM totals (for level initialization)
  setLLMTotals(totals) {
    if (totals.gpt !== undefined) this.collectibles.llms.gpt.total = totals.gpt;
    if (totals.claude !== undefined) this.collectibles.llms.claude.total = totals.claude;
    if (totals.gemini !== undefined) this.collectibles.llms.gemini.total = totals.gemini;
    this._updateLLMDisplay();
  }

  _updatePotionDisplay() {
    const config = this.collectibleTypes.potions;
    const count = this.collectibles.potions.count;
    
    this.potionText.textContent = `${config.name}: ${count}`;
    
    if (count === 0) {
      this.potionText.style.color = config.emptyColor;
      this.potionIcon.textContent = config.emptyIcon;
      this.potionIcon.style.animation = 'lowWarning 1s infinite ease-in-out';
    } else if (count <= 1) {
      this.potionText.style.color = config.lowColor;
      this.potionIcon.textContent = config.icon;
      this.potionIcon.style.animation = 'lowWarning 2s infinite ease-in-out';
    } else {
      this.potionText.style.color = config.color;
      this.potionIcon.textContent = config.icon;
      this.potionIcon.style.animation = 'none';
    }
  }

  // Update LLM display
  _updateLLMDisplay() {
    ['gpt', 'claude', 'gemini'].forEach(llmType => {
      const llm = this.collectibles.llms[llmType];
      const item = this.llmItems[llmType];
      
      if (item) {
        // Update count display
        item.count.textContent = `${llm.collected}${llm.total > 0 ? `/${llm.total}` : ''}`;
        
        // Update colors and effects based on collection status
        if (llm.collected > 0) {
          item.icon.style.filter = 'none';
          item.icon.style.color = item.config.collectedColor;
          item.name.style.color = item.config.collectedColor;
          item.count.style.color = '#4caf50';
          item.count.style.fontWeight = 'bold';
          item.item.style.background = 'rgba(76, 175, 80, 0.2)';
          item.item.style.border = '1px solid rgba(76, 175, 80, 0.4)';
          item.item.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
        } else {
          item.icon.style.filter = 'grayscale(100%) brightness(0.7)';
          item.icon.style.color = item.config.color;
          item.name.style.color = item.config.color;
          item.count.style.color = '#888';
          item.count.style.fontWeight = 'normal';
          item.item.style.background = 'rgba(255, 255, 255, 0.1)';
          item.item.style.border = '1px solid transparent';
          item.item.style.boxShadow = 'none';
        }
        
        // Special effect if all are collected
        const allCollected = Object.values(this.collectibles.llms).every(llm => llm.collected > 0);
        if (allCollected) {
          this.llmContainer.style.animation = 'allLLMsCollected 2s ease-in-out';
          setTimeout(() => {
            this.llmContainer.style.animation = 'none';
          }, 2000);
        }
      }
    });
  }

  _playCollectAnimation(iconElement) {
    iconElement.style.animation = 'collectPulse 0.5s ease-out';
    setTimeout(() => {
      iconElement.style.animation = 'none';
    }, 500);
  }

  // Special animation for LLM collection
  _playLLMCollectAnimation(llmType) {
    const item = this.llmItems[llmType];
    if (item) {
      item.item.style.animation = 'llmCollectPulse 1s ease-out';
      item.icon.style.animation = 'llmIconSpin 1s ease-out';
      
      setTimeout(() => {
        item.item.style.animation = 'none';
        item.icon.style.animation = 'none';
      }, 1000);
    }
  }

  // Get current collectible data (for saving/persistence)
  getCollectiblesData() {
    return {
      potions: { ...this.collectibles.potions },
      llms: {
        gpt: { ...this.collectibles.llms.gpt },
        claude: { ...this.collectibles.llms.claude },
        gemini: { ...this.collectibles.llms.gemini }
      }
    };
  }

  // Set collectible data (for loading/restoring)
  setCollectiblesData(data) {
    if (data.potions) {
      this.collectibles.potions = { ...this.collectibles.potions, ...data.potions };
      this._updatePotionDisplay();
    }
    if (data.llms) {
      if (data.llms.gpt) this.collectibles.llms.gpt = { ...this.collectibles.llms.gpt, ...data.llms.gpt };
      if (data.llms.claude) this.collectibles.llms.claude = { ...this.collectibles.llms.claude, ...data.llms.claude };
      if (data.llms.gemini) this.collectibles.llms.gemini = { ...this.collectibles.llms.gemini, ...data.llms.gemini };
      this._updateLLMDisplay();
    }
  }

  update(delta, ctx) {
    // Auto-update from context if provided
    if (ctx && ctx.collectibles) {
      this.setCollectiblesData(ctx.collectibles);
    }
  }

  // Get LLM collection stats
  getLLMStats() {
    return {
      totalCollected: Object.values(this.collectibles.llms).reduce((sum, llm) => sum + llm.collected, 0),
      totalPossible: Object.values(this.collectibles.llms).reduce((sum, llm) => sum + llm.total, 0),
      gpt: this.collectibles.llms.gpt.collected,
      claude: this.collectibles.llms.claude.collected,
      gemini: this.collectibles.llms.gemini.collected,
      allCollected: Object.values(this.collectibles.llms).every(llm => llm.collected > 0)
    };
  }

  // Level 3 specific method to check if all LLMs are collected (for win condition)
  areAllLLMsCollected() {
    return Object.values(this.collectibles.llms).every(llm => llm.collected >= llm.total);
  }
}

// Add CSS animations for Level 3
const style = document.createElement('style');
style.textContent = `
  @keyframes llmCollectPulse {
    0% { transform: scale(1); background: rgba(76, 175, 80, 0.2); }
    50% { transform: scale(1.2); background: rgba(76, 175, 80, 0.5); box-shadow: 0 0 20px rgba(76, 175, 80, 0.8); }
    100% { transform: scale(1); background: rgba(76, 175, 80, 0.2); }
  }
  
  @keyframes llmIconSpin {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.5); }
    100% { transform: rotate(360deg) scale(1); }
  }
  
  @keyframes allLLMsCollected {
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
  }
  
  @keyframes collectPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.5); }
    100% { transform: scale(1); }
  }
  
  @keyframes lowWarning {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(style);