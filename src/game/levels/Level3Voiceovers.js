// src/game/levels/Level3Voiceovers.js

/**
 * Level 3 Voiceover Configuration and Loader
 * Handles loading and playing voiceovers for Branden and Alex in Level 3
 */

export class Level3Voiceovers {
  constructor(game) {
    this.game = game;

    // Branden voiceover audio file mapping
    this.brandenVoiceoverMap = {
      'sir_knight': 'branden_sir_knight',
      'your_project': 'branden_your_project',
      'the_theme': 'branden_the_theme',
      'which_brings': 'branden_which_brings',
      'an_excellent': 'branden_an_excellent',
      'and_that': 'branded_and_that' // Note: typo in filename "branded" vs "branden"
    };

    // Alex voiceover audio file mapping
    this.alexVoiceoverMap = {
      '3_weeks': 'alex_3_weeks',
      'alright_team': 'alex_alright_team',
      'finally': 'alex_finally',
      'its_done': 'alex_its_done',
      'okay_deadline': 'alex_okay_deadline',
      'okay_okay': 'alex_okay_okay',
      'only_you': 'alex_only_you',
      'time_to': 'alex_time_to',
      'what_are_you': 'alex_what_are_you',
      'what_is': 'alex_what_is',
      'what_the': 'alex_what_the'
    };
  }

  /**
   * Load all Level 3 voiceover audio files
   */
  async loadAll() {
    if (!this.game.soundManager) {
      console.warn('⚠️ [Level3Voiceovers] SoundManager not available for loading voiceovers');
      return;
    }

    console.log('🎤 [Level3Voiceovers] Loading voiceovers...');

    await Promise.all([
      this._loadBrandenVoiceovers(),
      this._loadAlexVoiceovers()
    ]);

    console.log('✅ [Level3Voiceovers] All voiceovers loaded');
  }

  /**
   * Load Branden's voiceover audio files
   */
  async _loadBrandenVoiceovers() {
    const soundManager = this.game.soundManager;
    const basePath = 'assets/audio/ambient/';
    const promises = [];

    for (const [key, fileName] of Object.entries(this.brandenVoiceoverMap)) {
      const url = `${basePath}${fileName}.mp3`;
      promises.push(
        soundManager.load('sfx', key, url, false)
          .catch(err => console.error(`❌ Failed to load Branden voiceover: ${key}`, err))
      );
    }

    await Promise.all(promises);
    console.log('✅ [Level3Voiceovers] Branden voiceovers loaded');
  }

  /**
   * Load Alex's voiceover audio files
   */
  async _loadAlexVoiceovers() {
    const soundManager = this.game.soundManager;
    const basePath = 'assets/audio/ambient/';
    const promises = [];

    for (const [key, fileName] of Object.entries(this.alexVoiceoverMap)) {
      const url = `${basePath}${fileName}.mp3`;
      promises.push(
        soundManager.load('sfx', key, url, false)
          .catch(err => console.error(`❌ Failed to load Alex voiceover: ${key}`, err))
      );
    }

    await Promise.all(promises);
    console.log('✅ [Level3Voiceovers] Alex voiceovers loaded');
  }

  /**
   * Auto-detect and play voiceover based on dialogue text
   * @param {string} text - The dialogue text
   * @param {string} characterName - 'Branden' or 'Alex'
   * @returns {string|null} - The voiceover key that was detected, or null
   */
  detectAndPlay(text, characterName = 'Branden') {
    if (!this.game.soundManager) return null;

    const lowerText = text.toLowerCase();
    let voiceoverKey = null;

    if (characterName === 'Branden' || characterName === 'BRANDEN') {
      voiceoverKey = this._detectBrandenVoiceover(lowerText);
    } else if (characterName === 'Alex' || characterName === 'ALEX' || characterName === 'PLAYER') {
      // PLAYER is Alex in Level 3
      voiceoverKey = this._detectAlexVoiceover(lowerText);
    }

    if (voiceoverKey) {
      this.game.soundManager.playSFX(voiceoverKey);
      console.log(`🎤 [Level3Voiceovers] Playing ${characterName} voiceover: ${voiceoverKey}`);
      return voiceoverKey;
    }

    return null;
  }

  /**
   * Detect Branden voiceover from dialogue text
   */
  _detectBrandenVoiceover(lowerText) {
    if (lowerText.includes('sir knight') || lowerText.includes('eyes up')) {
      return 'sir_knight';
    } else if (lowerText.includes('your project') && lowerText.includes('consequence')) {
      return 'your_project';
    } else if (lowerText.includes('theme') && lowerText.includes('consequence')) {
      return 'the_theme';
    } else if (lowerText.includes('which brings')) {
      return 'which_brings';
    } else if (lowerText.includes('excellent')) {
      return 'an_excellent';
    } else if (lowerText.includes('and that')) {
      return 'and_that';
    }

    return null;
  }

  /**
   * Detect Alex voiceover from dialogue text
   */
  _detectAlexVoiceover(lowerText) {
    if (lowerText.includes('3 weeks') || lowerText.includes('three weeks')) {
      return '3_weeks';
    } else if (lowerText.includes('alright team')) {
      return 'alright_team';
    } else if (lowerText.includes('finally')) {
      return 'finally';
    } else if (lowerText.includes("it's done") || lowerText.includes('its done')) {
      return 'its_done';
    } else if (lowerText.includes('okay') && lowerText.includes('deadline')) {
      return 'okay_deadline';
    } else if (lowerText.includes('okay okay') || lowerText.includes('okay, okay')) {
      return 'okay_okay';
    } else if (lowerText.includes('only you')) {
      return 'only_you';
    } else if (lowerText.includes('time to')) {
      return 'time_to';
    } else if (lowerText.includes('what are you')) {
      return 'what_are_you';
    } else if (lowerText.includes('what is')) {
      return 'what_is';
    } else if (lowerText.includes('what the')) {
      return 'what_the';
    }

    return null;
  }

  /**
   * Dispose and cleanup
   */
  dispose() {
    console.log('🧹 [Level3Voiceovers] Disposing...');
    // Audio cleanup is handled by SoundManager
  }
}