/**
 * Quality Controls - Test different quality settings with keyboard shortcuts
 * Allows high-end PC users to preview how the game looks on low-end devices
 */

import { QualityPresets } from './gpuDetector.js';

export class QualityControls {
    constructor(game) {
        this.game = game;
        this.currentTier = game.gpuDetector?.tier || 'MEDIUM';
        this.tiers = ['LOW', 'MEDIUM', 'HIGH'];
        this.currentIndex = this.tiers.indexOf(this.currentTier);
        
        this.isReloading = false;
        this.ui = null;
        
        this.setupKeyboardControls();
        this.createUI();
        this.updateUI();
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            // Shift+Q: Cycle quality tiers
            if (e.shiftKey && e.code === 'KeyQ') {
                e.preventDefault();
                this.cycleTier();
            }
            
            // Shift+1: Force LOW
            if (e.shiftKey && e.code === 'Digit1') {
                e.preventDefault();
                this.setTier('LOW');
            }
            
            // Shift+2: Force MEDIUM
            if (e.shiftKey && e.code === 'Digit2') {
                e.preventDefault();
                this.setTier('MEDIUM');
            }
            
            // Shift+3: Force HIGH
            if (e.shiftKey && e.code === 'Digit3') {
                e.preventDefault();
                this.setTier('HIGH');
            }
            
            // Shift+B: Run benchmark
            if (e.shiftKey && e.code === 'KeyB') {
                e.preventDefault();
                this.runBenchmark();
            }
        });
    }

    createUI() {
        // Create quality indicator UI (hidden by default)
        this.ui = document.createElement('div');
        this.ui.id = 'quality-controls';
        this.ui.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            min-width: 250px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            display: none;
        `;

        document.body.appendChild(this.ui);
    }

    updateUI() {
        if (!this.ui) return;

        const settings = QualityPresets[this.currentTier];
        const tierColor = {
            'LOW': '#ff6b6b',
            'MEDIUM': '#ffd93d',
            'HIGH': '#6bcf7f'
        }[this.currentTier];

        this.ui.innerHTML = `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2);">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">
                    🎮 Quality Preview
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.6);">
                    GPU: ${this.game.gpuDetector?.info.renderer.substring(0, 40) || 'Unknown'}...
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 5px;">
                    Current Tier:
                </div>
                <div style="font-size: 16px; font-weight: bold; color: ${tierColor};">
                    ${this.currentTier}
                </div>
            </div>
            
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; font-size: 10px;">
                <div style="margin-bottom: 3px;">✨ Fireflies: ${settings.plantInstanceCounts.fireflies}</div>
                <div style="margin-bottom: 3px;">🍃 Leaves: ${settings.plantInstanceCounts.leaves}</div>
                <div style="margin-bottom: 3px;">🌸 Petals: ${settings.plantInstanceCounts.petals}</div>
                <div style="margin-bottom: 3px;">💡 Lights/Plant: ${settings.plantLightCount || 3}</div>
                <div style="margin-bottom: 3px;">🔥 Particles: ${settings.enableParticles ? 'ON' : 'OFF'}</div>
                <div style="margin-bottom: 3px;">🎨 Shaders: ${settings.enableComplexShaders ? 'Complex' : 'Simple'}</div>
                <div>📊 Resolution: ${(settings.pixelRatio * 100).toFixed(0)}%</div>
            </div>
            
            <div style="font-size: 10px; color: rgba(255,255,255,0.5); line-height: 1.5;">
                <div style="margin-bottom: 2px;"><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 3px;">Shift+Q</kbd> Cycle Quality</div>
                <div style="margin-bottom: 2px;"><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 3px;">Shift+1/2/3</kbd> Force LOW/MED/HIGH</div>
                <div style="margin-bottom: 2px;"><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 3px;">Shift+B</kbd> Benchmark</div>
                <div style="margin-bottom: 2px;"><kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 3px;">Shift+H</kbd> Toggle UI</div>
            </div>
            
            ${this.isReloading ? '<div style="margin-top: 10px; color: #ffd93d;">⏳ Reloading lights...</div>' : ''}
        `;

        // Add toggle UI visibility
        window.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.code === 'KeyH') {
                e.preventDefault();
                this.ui.style.display = this.ui.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    cycleTier() {
        this.currentIndex = (this.currentIndex + 1) % this.tiers.length;
        this.currentTier = this.tiers[this.currentIndex];
        this.applyTier();
    }

    setTier(tier) {
        if (!this.tiers.includes(tier)) {
            console.error(`Invalid tier: ${tier}`);
            return;
        }

        this.currentTier = tier;
        this.currentIndex = this.tiers.indexOf(tier);
        this.applyTier();
    }

    async applyTier() {
        if (this.isReloading) {
            console.warn('Already reloading, please wait...');
            return;
        }

        console.log(`\n${'='.repeat(50)}`);
        console.log(`🎮 SWITCHING TO ${this.currentTier} QUALITY`);
        console.log(`${'='.repeat(50)}`);

        this.isReloading = true;
        this.updateUI();

        const newSettings = QualityPresets[this.currentTier];
        
        // Update renderer settings
        this.game.renderer.setPixelRatio(newSettings.pixelRatio);
        
        // Update light manager quality
        this.game.lights.setQualitySettings(newSettings);
        
        // Update GPU detector tier (for consistency)
        if (this.game.gpuDetector) {
            this.game.gpuDetector.tier = this.currentTier;
        }
        
        // Store current quality settings
        this.game.qualitySettings = newSettings;

        console.log(`⚙️ Quality Settings Updated:`, newSettings);

        // CRITICAL: Save player position before reloading
        const playerPosition = this.game.player ? this.game.player.getPosition().clone() : null;
        const playerVelocity = this.game.player?.body?.velocity ? {
            x: this.game.player.body.velocity.x,
            y: this.game.player.body.velocity.y,
            z: this.game.player.body.velocity.z
        } : null;
        console.log('💾 Saved player position:', playerPosition);
        
        // Clear ALL existing lights
        console.log('🗑️ Clearing existing lights...');
        this.game.lights.clear();
        
        // Reload lights WITHOUT resetting player position
        if (this.game.level && this.game.level.data) {
            const currentLevelIndex = this.game.levelManager.currentIndex;
            console.log(`🔄 Reloading lights for level ${currentLevelIndex} with new quality settings...`);
            
            try {
                // Just reload the lights, not the entire level
                await this.game.applyLevelLights(this.game.level.data);
                
                // Restore player position if it was saved
                if (playerPosition) {
                    this.game.player.setPosition(playerPosition);
                    // Reset velocity to prevent weird physics
                    if (this.game.player.body && playerVelocity) {
                        this.game.player.body.velocity.set(playerVelocity.x, playerVelocity.y, playerVelocity.z);
                    }
                    console.log('✅ Player position restored:', playerPosition);
                }
                
                console.log(`✅ Lights reloaded with ${this.currentTier} quality`);
                
                // Log the actual instance counts for verification
                console.log(`🌿 Verifying light quality:`, {
                    fireflies: newSettings.plantInstanceCounts?.fireflies || 'N/A',
                    leaves: newSettings.plantInstanceCounts?.leaves || 'N/A',
                    petals: newSettings.plantInstanceCounts?.petals || 'N/A',
                    moss: newSettings.plantInstanceCounts?.moss || 'N/A'
                });
            } catch (error) {
                console.error('❌ Error reloading lights:', error);
            }
        } else {
            console.log('ℹ️ No active level to reload. New quality will apply to next level.');
        }

        this.isReloading = false;
        this.updateUI();

        console.log(`${'='.repeat(50)}\n`);

        // Show notification
        this.showNotification(`Quality: ${this.currentTier}`);
    }

    async runBenchmark() {
        if (!this.game.gpuDetector) {
            console.error('GPU Detector not available');
            return;
        }

        console.log('\n🏃 Running performance benchmark...');
        this.showNotification('Running benchmark...', 3000);

        try {
            const results = await this.game.gpuDetector.benchmark(
                this.game.scene,
                this.game.activeCamera,
                this.game.renderer
            );

            console.log(`📊 Benchmark Results:
  FPS: ${results.fps.toFixed(1)}
  Avg Frame Time: ${results.avgFrameTime.toFixed(2)}ms
  Recommended Tier: ${results.tier}
            `);

            // Show results notification
            this.showNotification(
                `Benchmark: ${results.fps.toFixed(1)} FPS\nRecommended: ${results.tier}`,
                5000
            );

            // Ask if user wants to apply recommended tier
            if (results.tier !== this.currentTier) {
                console.log(`💡 Recommended tier (${results.tier}) differs from current (${this.currentTier})`);
                this.showNotification(
                    `Recommend ${results.tier} quality\nPress Shift+Q to switch`,
                    5000
                );
            }
        } catch (error) {
            console.error('Benchmark failed:', error);
            this.showNotification('Benchmark failed', 2000);
        }
    }

    showNotification(message, duration = 2000) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
            white-space: pre-line;
            text-align: center;
            animation: fadeIn 0.3s ease-out;
        `;

        // Add fade-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            }
        `;
        document.head.appendChild(style);

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 300);
        }, duration);
    }

    destroy() {
        if (this.ui) {
            document.body.removeChild(this.ui);
        }
    }

    // Get comparison data for all tiers
    getComparisonData() {
        const comparison = {};
        
        this.tiers.forEach(tier => {
            const settings = QualityPresets[tier];
            comparison[tier] = {
                plantInstanceCounts: settings.plantInstanceCounts,
                enableParticles: settings.enableParticles,
                enableComplexShaders: settings.enableComplexShaders,
                pixelRatio: settings.pixelRatio,
                maxLights: settings.maxLights,
                shadowMapSize: settings.shadowMapSize
            };
        });

        console.table(comparison);
        return comparison;
    }
}

// Helper function to initialize quality controls
export function initQualityControls(game) {
    const controls = new QualityControls(game);
    
    // Expose globally for console access
    window.qualityControls = controls;
    
    console.log(`
╔════════════════════════════════════════════════════╗
║        🎮 QUALITY PREVIEW CONTROLS ENABLED         ║
╚════════════════════════════════════════════════════╝

🎯 Auto-Detected Quality: ${controls.currentTier}
   (Based on your GPU: ${controls.game.gpuDetector?.info.renderer.substring(0, 50) || 'Unknown'}...)

Keyboard Shortcuts:
  Shift+H      - Show/Hide Quality UI (currently hidden)
  Shift+Q      - Cycle through LOW → MEDIUM → HIGH
  Shift+1      - Force LOW quality (iGPU preview)
  Shift+2      - Force MEDIUM quality
  Shift+3      - Force HIGH quality (dedicated GPU)
  Shift+B      - Run performance benchmark

Console Commands:
  qualityControls.setTier('LOW')      - Switch to LOW
  qualityControls.setTier('MEDIUM')   - Switch to MEDIUM
  qualityControls.setTier('HIGH')     - Switch to HIGH
  qualityControls.runBenchmark()      - Run benchmark
  qualityControls.getComparisonData() - View settings table

💡 Tip: Press Shift+H to show the quality UI panel
    `);

    return controls;
}

