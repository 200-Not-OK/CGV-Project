export class GlitchManager {
  constructor(game = null) {
    this.game = game; // Add reference to game
    this.currentLevel = 'level3';
    this.collectedLLMs = new Set();
    this.glitchedLevelsCompleted = {
      level1_glitched: false,
      level2_glitched: false
    };
    
    // Configurable requirements
    this.requiredLLMs = ['llm_gpt', 'llm_claude', 'llm_gemini'];
    this.requiredGlitchedCollectibles = {
      level1_glitched: 2,
      level2_glitched: 2
    };
    
    console.log('🔄 GlitchManager initialized');
  }

  // ADD THIS METHOD to collect LLMs
  collectLLM(llmType) {
    const fullLLMId = `llm_${llmType}`;
    if (!this.collectedLLMs.has(fullLLMId)) {
      this.collectedLLMs.add(fullLLMId);
      console.log(`🤖 GlitchManager: Collected ${fullLLMId}. Total: ${this.collectedLLMs.size}/${this.requiredLLMs.length}`);
      
      // Debug: log what we have vs what we need
      console.log('📊 Current LLM status:');
      console.log('✅ Collected:', Array.from(this.collectedLLMs));
      console.log('🎯 Required:', this.requiredLLMs);
      console.log('❌ Missing:', this.requiredLLMs.filter(llm => !this.collectedLLMs.has(llm)));
      
      return true;
    }
    return false;
  }

  canActivateComputer() {
    const hasAll = this.requiredLLMs.every(llm => this.collectedLLMs.has(llm));
    console.log(`🔍 Computer activation check: ${hasAll} (collected: ${this.collectedLLMs.size}/${this.requiredLLMs.length})`);
    
    // Debug output
    if (!hasAll) {
      const missing = this.requiredLLMs.filter(llm => !this.collectedLLMs.has(llm));
      console.log(`❌ Missing LLMs: ${missing.join(', ')}`);
    }
    
    return hasAll;
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
  console.log('🎯 Next glitched level:', nextLevel);
  
  if (nextLevel) {
    // Don't change currentLevel here - let the game handle level transitions
    return { 
      success: true, 
      level: nextLevel,
      message: `ACCESS GRANTED! Teleporting to ${nextLevel.replace('_glitched', ' Glitched')}!` 
    };
  }
  
  return { success: false, message: "All glitched levels completed!" };
}

getNextGlitchedLevel() {
  // Reset completion status for testing (you can remove this later)
  // this.glitchedLevelsCompleted.level1_glitched = false;
  // this.glitchedLevelsCompleted.level2_glitched = false;
  
  if (!this.glitchedLevelsCompleted.level1_glitched) {
    return 'level1_glitched';
  } else if (!this.glitchedLevelsCompleted.level2_glitched) {
    return 'level2_glitched';
  }
  return null;
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