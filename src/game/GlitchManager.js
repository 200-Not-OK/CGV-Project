export class GlitchManager {
  constructor() {
    this.currentLevel = 'level3';
    this.collectedLLMs = new Set();
    this.glitchedLevelsCompleted = {
      level1_glitched: false,
      level2_glitched: false
    };
    
    // Configurable requirements
    this.requiredLLMs = ['llm_gpt', 'llm_claude', 'llm_gemini']; // Change this array as needed
    this.requiredGlitchedCollectibles = {
      level1_glitched: 2, // Number of collectibles needed in level1_glitched
      level2_glitched: 2  // Number of collectibles needed in level2_glitched
    };
    
    console.log('🔄 GlitchManager initialized');
  }

  canActivateComputer() {
    const hasAll = this.requiredLLMs.every(llm => this.collectedLLMs.has(llm));
    console.log(`🔍 Computer activation: ${hasAll} (collected: ${this.collectedLLMs.size}/${this.requiredLLMs.length})`);
    return hasAll;
  }

  getNextGlitchedLevel() {
    if (!this.glitchedLevelsCompleted.level1_glitched) {
      return 'level1_glitched';
    } else if (!this.glitchedLevelsCompleted.level2_glitched) {
      return 'level2_glitched';
    }
    return null;
  }

  activateComputer() {
    console.log('🖥️ Activating computer...');
    
    if (!this.canActivateComputer()) {
      const collected = this.collectedLLMs.size;
      const required = this.requiredLLMs.length;
      return { 
        success: false, 
        message: `Need more LLMs! Found ${collected}/${required}` 
      };
    }

    const nextLevel = this.getNextGlitchedLevel();
    if (nextLevel) {
      this.currentLevel = nextLevel;
      return { 
        success: true, 
        level: nextLevel,
        message: `Teleporting to ${nextLevel.replace('_glitched', '')}!` 
      };
    }
    
    return { success: false, message: "All glitched levels completed!" };
  }

  completeGlitchedLevel(levelId) {
    this.glitchedLevelsCompleted[levelId] = true;
    console.log(`✅ Completed glitched level: ${levelId}`);
    
    // Check if both glitched levels are done
    if (this.isLevel3Complete()) {
      this.currentLevel = 'level3';
      console.log('🎉 All glitched levels completed!');
    }
  }

  isLevel3Complete() {
    return this.glitchedLevelsCompleted.level1_glitched && 
           this.glitchedLevelsCompleted.level2_glitched;
  }

  // Method to update requirements
  setRequirements(llms, level1Collectibles, level2Collectibles) {
    this.requiredLLMs = llms || this.requiredLLMs;
    this.requiredGlitchedCollectibles.level1_glitched = level1Collectibles || this.requiredGlitchedCollectibles.level1_glitched;
    this.requiredGlitchedCollectibles.level2_glitched = level2Collectibles || this.requiredGlitchedCollectibles.level2_glitched;
  }
}