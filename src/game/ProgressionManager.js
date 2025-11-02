/**
 * ProgressionManager
 * Manages level progression, locking, and unlocking
 * Stores completed levels in localStorage for persistence
 */
export class ProgressionManager {
  constructor() {
    this.STORAGE_KEY = 'csplatformer_progress';
    this.completedLevels = [];
    this.unlockedLevels = ['hub', 'level1']; // Hub and Level 1 always unlocked
    
    // Load progress from localStorage
    this._loadProgress();
  }

  /**
   * Load progress from localStorage
   * @private
   */
  _loadProgress() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.completedLevels = data.completedLevels || [];
        
        console.log('📂 Loaded progress from localStorage:', {
          completedLevels: this.completedLevels,
          unlockedLevels: this.unlockedLevels
        });

        // Update unlockedLevels based on completed levels
        this._updateUnlockedLevels();
      } else {
        console.log('📂 No saved progress found. Starting fresh.');
        this._saveProgress();
      }
    } catch (error) {
      console.warn('⚠️ Failed to load progress:', error);
      this._saveProgress();
    }
  }

  /**
   * Save progress to localStorage
   * @private
   */
  _saveProgress() {
    try {
      const data = {
        completedLevels: this.completedLevels,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log('💾 Progress saved to localStorage');
    } catch (error) {
      console.warn('⚠️ Failed to save progress:', error);
    }
  }

  /**
   * Update unlocked levels based on completed levels
   * Level progression: Level 1 unlocked → Complete Level 1 → Level 2 unlocked → etc.
   * @private
   */
  _updateUnlockedLevels() {
    // Always include hub and level1
    this.unlockedLevels = ['hub', 'level1'];

    // If level1 is completed, unlock level2
    if (this.completedLevels.includes('level1')) {
      this.unlockedLevels.push('level2');

      // If level2 is completed, unlock level3
      if (this.completedLevels.includes('level2')) {
        this.unlockedLevels.push('level3');
      }
    }

    console.log('🔓 Updated unlocked levels:', this.unlockedLevels);
  }

  /**
   * Check if a level is unlocked
   * @param {string} levelId - Level ID to check
   * @returns {boolean} True if level is unlocked
   */
  isLevelUnlocked(levelId) {
    return this.unlockedLevels.includes(levelId);
  }

  /**
   * Check if a level is completed
   * @param {string} levelId - Level ID to check
   * @returns {boolean} True if level is completed
   */
  isLevelCompleted(levelId) {
    return this.completedLevels.includes(levelId);
  }

  /**
   * Mark a level as completed and unlock the next level
   * @param {string} levelId - Level ID to mark as completed
   */
  completeLevel(levelId) {
    if (!this.completedLevels.includes(levelId)) {
      this.completedLevels.push(levelId);
      console.log(`✅ Level completed: ${levelId}`);
      
      // Update unlocked levels
      this._updateUnlockedLevels();
      
      // Save progress
      this._saveProgress();

      return true;
    }

    return false;
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    this.completedLevels = [];
    this.unlockedLevels = ['hub', 'level1'];
    this._saveProgress();
    console.log('🔄 Progress reset');
  }

  /**
   * Get progression status
   * @returns {Object} Current progression state
   */
  getStatus() {
    return {
      completedLevels: [...this.completedLevels],
      unlockedLevels: [...this.unlockedLevels]
    };
  }
}
