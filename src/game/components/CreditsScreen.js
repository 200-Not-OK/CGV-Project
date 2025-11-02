import { UIComponent } from '../uiComponent.js';

/**
 * CreditsScreen
 * Displays a scrolling credits screen when all levels are completed
 */
export class CreditsScreen extends UIComponent {
  constructor(container = document.body, props = {}) {
    super(container, props);
    
    this.onClose = props.onClose || (() => {});
    this.creditsList = props.creditsList || this._getDefaultCredits();
    
    this._buildUI();
  }

  /**
   * Check if the credits have been watched in this session/save
   * @static
   * @returns {boolean} True if credits have been watched
   */
  static hasWatchedCredits() {
    try {
      const watched = localStorage.getItem('csplatformer_credits_watched');
      return watched === 'true';
    } catch (e) {
      console.warn('⚠️ Failed to check credits watch status:', e);
      return false;
    }
  }

  /**
   * Mark credits as watched
   * @static
   */
  static markCreditsAsWatched() {
    try {
      localStorage.setItem('csplatformer_credits_watched', 'true');
      console.log('🎬 Credits marked as watched');
    } catch (e) {
      console.warn('⚠️ Failed to save credits watch status:', e);
    }
  }

  /**
   * Reset credits watch status (for testing or new game)
   * @static
   */
  static resetCreditsWatchStatus() {
    try {
      localStorage.removeItem('csplatformer_credits_watched');
      console.log('🎬 Credits watch status reset');
    } catch (e) {
      console.warn('⚠️ Failed to reset credits watch status:', e);
    }
  }

  _getDefaultCredits() {
    return [
      { type: 'title', text: '🎮 CREDITS 🎮' },
      { type: 'space' },
      { type: 'section', text: 'DEVELOPMENT' },
      { type: 'credit', role: 'Developer', name: 'Sufyaan Mahomed 2564009' },
      { type: 'credit', role: 'Developer', name: 'Muhammad Hoosen 2552770' },
      { type: 'credit', role: 'Developer', name: 'Rameez Atif 2612521' },
      { type: 'credit', role: 'Developer', name: 'Muaaz Bayat 2555154' },
      { type: 'credit', role: 'Developer', name: 'Mohammed Huzaifah Bangie 2610990' },
      { type: 'credit', role: 'Developer', name: 'Arno Strauss 2613224' },
      { type: 'space' },
      { type: 'section', text: 'POWERED BY' },
      { type: 'credit', role: '', name: 'Three.js - 3D Graphics' },
      { type: 'credit', role: '', name: 'Cannon-es - Physics Engine' },
      { type: 'credit', role: '', name: 'Vite - Build Tool' },
      { type: 'space' },
      { type: 'section', text: 'VOICE ACTORS' },
      { type: 'credit', role: '', name: 'AI Pravesh' },
      { type: 'credit', role: '', name: 'AI Richard' },
      { type: 'credit', role: '', name: 'AI Branden' },
      { type: 'credit', role: '', name: 'AI Steve' },
      { type: 'space' },
      { type: 'section', text: 'SPECIAL THANKS' },
      { type: 'credit', role: 'Tutor', name: 'Tapiwa Mazarura' },
      { type: 'credit', role: '', name: 'Kay Lousberg : Dungeon Remastered Pack (1.1)' },
      { type: 'credit', role: '', name: 'Kay Lousberg : Adventurers Character Pack (1.0)' },
      { type: 'credit', role: '', name: 'Willy Decarpentrie : Mech Drone' },
      { type: 'credit', role: '', name: 'Kay Lousberg : Halloween Bits (1.0)' },
      { type: 'credit', role: '', name: 'Kay Lousberg :  City Builder Bits' },
      { type: 'credit', role: '', name: 'Kay Lousberg : Restaurant Bits' },
      { type: 'credit', role: '', name: 'Kay Lousberg : Medieval Hexagon Pack' },
      { type: 'credit', role: '', name: 'Fountain by Poly by Google [CC-BY]' },
      { type: 'credit', role: '', name: 'Hedge by Quaternius' },
      { type: 'credit', role: '', name: 'Cloister Garden by Bruno Oliveira' },
      { type: 'credit', role: '', name: 'The Big House by VR XRTIST [CC-BY]' },
      { type: 'credit', role: '', name: 'Casual Character by Quaternius' },
      { type: 'credit', role: '', name: 'Tree Assets by Ben Desai [CC-BY]' },
      { type: 'credit', role: '', name: 'Apartment 2 by Gabriele Romagnoli ' },
      { type: 'credit', role: '', name: 'Low-poly office by Quaternius' },
      { type: 'credit', role: '', name: 'Animated Men Pack by Quaternius' },
      { type: 'credit', role: '', name: 'Computer Classroom by stylo0' },
      { type: 'credit', role: '', name: 'Stairs Open Single by Kenney' },
      { type: 'space' },
      { type: 'space' },
      { type: 'end', text: 'Thank you for playing!' },
      { type: 'space' },
      { type: 'space' }
    ];
  }

  _buildUI() {
    Object.assign(this.root.style, {
      position: 'fixed',
      inset: '0',
      display: 'none',
      background: 'linear-gradient(180deg, rgba(0,0,0,.95), rgba(10,20,30,.95))',
      zIndex: 9998,
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    });

    // Container for scrolling credits
    this.creditsContainer = document.createElement('div');
    Object.assign(this.creditsContainer.style, {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px',
      animation: 'credits-scroll 35s linear forwards',
      scrollBehavior: 'smooth'
    });

    // Add animation
    if (!document.getElementById('credits-animation-style')) {
      const style = document.createElement('style');
      style.id = 'credits-animation-style';
      style.textContent = `
        @keyframes credits-scroll {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(calc(-100% - 100vh));
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Build credits content
    for (const item of this.creditsList) {
      const element = this._createCreditElement(item);
      if (element) this.creditsContainer.appendChild(element);
    }

    // Close button (always visible at top-right)
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ SKIP';
    Object.assign(closeBtn.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      padding: '10px 16px',
      background: 'rgba(81, 207, 102, 0.2)',
      border: '2px solid #51cf66',
      color: '#51cf66',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: '14px',
      transition: 'all 0.2s ease'
    });

    closeBtn.onmouseenter = () => {
      closeBtn.style.background = 'rgba(81, 207, 102, 0.4)';
      closeBtn.style.transform = 'scale(1.05)';
    };
    closeBtn.onmouseleave = () => {
      closeBtn.style.background = 'rgba(81, 207, 102, 0.2)';
      closeBtn.style.transform = 'scale(1)';
    };
    closeBtn.onclick = () => this.close();

    this.root.appendChild(this.creditsContainer);
    this.root.appendChild(closeBtn);
  }

  _createCreditElement(item) {
    const el = document.createElement('div');

    switch (item.type) {
      case 'title':
        Object.assign(el.style, {
          fontSize: '48px',
          fontWeight: 900,
          color: '#51cf66',
          textShadow: '0 0 20px rgba(81, 207, 102, 0.5)',
          marginTop: '40px',
          marginBottom: '40px',
          textAlign: 'center',
          letterSpacing: '3px'
        });
        el.textContent = item.text;
        break;

      case 'section':
        Object.assign(el.style, {
          fontSize: '24px',
          fontWeight: 700,
          color: '#a0ff00',
          textShadow: '0 0 15px rgba(160, 255, 0, 0.4)',
          marginTop: '36px',
          marginBottom: '16px',
          textAlign: 'center',
          letterSpacing: '2px',
          opacity: 0.9
        });
        el.textContent = item.text;
        break;

      case 'credit':
        Object.assign(el.style, {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
          textAlign: 'center'
        });

        if (item.role) {
          const role = document.createElement('div');
          Object.assign(role.style, {
            fontSize: '13px',
            color: '#aaa',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '4px'
          });
          role.textContent = item.role;
          el.appendChild(role);
        }

        const name = document.createElement('div');
        Object.assign(name.style, {
          fontSize: '18px',
          color: '#fff',
          fontWeight: item.role ? 600 : 400
        });
        name.textContent = item.name;
        el.appendChild(name);
        break;

      case 'end':
        Object.assign(el.style, {
          fontSize: '32px',
          fontWeight: 700,
          color: '#51cf66',
          textShadow: '0 0 15px rgba(81, 207, 102, 0.4)',
          marginTop: '60px',
          marginBottom: '20px',
          textAlign: 'center'
        });
        el.textContent = item.text;
        break;

      case 'space':
        Object.assign(el.style, {
          height: '40px'
        });
        break;

      default:
        return null;
    }

    return el;
  }

  show() {
    this.root.style.display = 'block';
    
    // Set flag to prevent pause menu from showing
    if (window.__GAME__) {
      window.__GAME__._creditsScreenActive = true;
      window.__GAME__._suppressPointerLockPause = true;
    }
    
    // Release pointer lock so cursor is visible for interaction
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    
    // Hide pause menu if it's visible
    if (window.__GAME__?.pauseMenu) {
      window.__GAME__.pauseMenu.style.display = 'none';
    }
    
    // Add key listener for ESC or SPACE to close
    // Use capture phase (true) to intercept before other handlers
    this._keyListener = (e) => {
      if (e.code === 'Escape' || e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.close();
      }
    };
    window.addEventListener('keydown', this._keyListener, true); // Capture phase
    
    // Auto-close after 35 seconds
    this._closeTimeout = setTimeout(() => {
      console.log('🎬 Credits timer (35s) ended, auto-closing');
      this.close();
    }, 35000);
    
    // Also listen for animation end as backup
    if (this.creditsContainer) {
      this._animationEndListener = () => {
        console.log('🎬 Credits animation ended, auto-closing');
        this.close();
      };
      this.creditsContainer.addEventListener('animationend', this._animationEndListener);
    }
  }

  close() {
    this.root.style.display = 'none';
    
    // Mark credits as watched
    CreditsScreen.markCreditsAsWatched();
    
    // Clear timeout if it exists
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
    }
    
    // Remove key listener
    if (this._keyListener) {
      window.removeEventListener('keydown', this._keyListener, true); // Capture phase
    }
    
    // Remove animation end listener
    if (this._animationEndListener && this.creditsContainer) {
      this.creditsContainer.removeEventListener('animationend', this._animationEndListener);
    }
    
    // Clear flag to allow pause menu again, but keep suppressing pointer lock briefly
    if (window.__GAME__) {
      window.__GAME__._creditsScreenActive = false;
      // Keep suppressing pointer lock for a moment so it doesn't immediately trigger pause menu
      window.__GAME__._suppressPointerLockPause = true;
      setTimeout(() => {
        if (window.__GAME__) {
          window.__GAME__._suppressPointerLockPause = false;
        }
      }, 100);
    }
    
    // Re-lock pointer when closing credits
    if (document.body && document.body.requestPointerLock) {
      document.body.requestPointerLock?.();
    }
    
    this.onClose?.();
  }

  dispose() {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
    }
    if (this._keyListener) {
      window.removeEventListener('keydown', this._keyListener, true); // Capture phase
    }
    if (this._animationEndListener && this.creditsContainer) {
      this.creditsContainer.removeEventListener('animationend', this._animationEndListener);
    }
    this.unmount();
  }
}
