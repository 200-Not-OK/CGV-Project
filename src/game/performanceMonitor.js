/**
 * PerformanceMonitor - Real-time performance tracking and diagnostics
 * Tracks FPS, frame times, render stats, and provides debugging tools
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      physicsTime: 0,
      renderTime: 0,
      updateTime: 0,
      drawCalls: 0,
      triangles: 0,
      geometries: 0,
      textures: 0,
      programs: 0,
      memory: 0
    };

    this.history = {
      fps: [],
      frameTime: [],
      physicsTime: [],
      renderTime: []
    };

    this.maxHistoryLength = 60; // Keep last 60 frames for averaging
    this.frameStart = 0;
    this.physicsStart = 0;
    this.renderStart = 0;
    this.updateStart = 0;

    // Performance stats display
    this.statsElement = null;
    this.showStats = false;

    // Performance warnings
    this.fpsThreshold = 30;
    this.frameTimeThreshold = 33; // 33ms = 30 FPS
  }

  /**
   * Start frame timing
   */
  startFrame() {
    this.frameStart = performance.now();
  }

  /**
   * Start physics timing
   */
  startPhysics() {
    this.physicsStart = performance.now();
  }

  /**
   * End physics timing
   */
  endPhysics() {
    if (this.physicsStart) {
      this.metrics.physicsTime = performance.now() - this.physicsStart;
    }
  }

  /**
   * Start update timing
   */
  startUpdate() {
    this.updateStart = performance.now();
  }

  /**
   * End update timing
   */
  endUpdate() {
    if (this.updateStart) {
      this.metrics.updateTime = performance.now() - this.updateStart;
    }
  }

  /**
   * Start render timing
   */
  startRender() {
    this.renderStart = performance.now();
  }

  /**
   * End render timing
   */
  endRender() {
    if (this.renderStart) {
      this.metrics.renderTime = performance.now() - this.renderStart;
    }
  }

  /**
   * End frame timing and collect renderer stats
   */
  endFrame(renderer) {
    // Calculate frame time
    this.metrics.frameTime = performance.now() - this.frameStart;
    this.metrics.fps = 1000 / this.metrics.frameTime;

    // Collect renderer stats
    if (renderer && renderer.info) {
      this.metrics.drawCalls = renderer.info.render.calls;
      this.metrics.triangles = renderer.info.render.triangles;
      this.metrics.geometries = renderer.info.memory.geometries;
      this.metrics.textures = renderer.info.memory.textures;
      this.metrics.programs = renderer.info.programs?.length || 0;
    }

    // Collect memory stats (if available)
    if (performance.memory) {
      this.metrics.memory = performance.memory.usedJSHeapSize / (1024 * 1024); // MB
    }

    // Update history
    this._updateHistory();

    // Update display if enabled
    if (this.showStats && this.statsElement) {
      this._updateStatsDisplay();
    }

    // Check for performance warnings
    this._checkPerformanceWarnings();
  }

  /**
   * Update performance history
   */
  _updateHistory() {
    this.history.fps.push(this.metrics.fps);
    this.history.frameTime.push(this.metrics.frameTime);
    this.history.physicsTime.push(this.metrics.physicsTime);
    this.history.renderTime.push(this.metrics.renderTime);

    // Keep only last N frames
    if (this.history.fps.length > this.maxHistoryLength) {
      this.history.fps.shift();
      this.history.frameTime.shift();
      this.history.physicsTime.shift();
      this.history.renderTime.shift();
    }
  }

  /**
   * Get average FPS over history
   */
  getAverageFPS() {
    if (this.history.fps.length === 0) return 0;
    const sum = this.history.fps.reduce((a, b) => a + b, 0);
    return sum / this.history.fps.length;
  }

  /**
   * Get average frame time over history
   */
  getAverageFrameTime() {
    if (this.history.frameTime.length === 0) return 0;
    const sum = this.history.frameTime.reduce((a, b) => a + b, 0);
    return sum / this.history.frameTime.length;
  }

  /**
   * Get performance summary
   */
  getSummary() {
    return {
      currentFPS: Math.round(this.metrics.fps),
      averageFPS: Math.round(this.getAverageFPS()),
      frameTime: this.metrics.frameTime.toFixed(2) + 'ms',
      physicsTime: this.metrics.physicsTime.toFixed(2) + 'ms',
      renderTime: this.metrics.renderTime.toFixed(2) + 'ms',
      updateTime: this.metrics.updateTime.toFixed(2) + 'ms',
      drawCalls: this.metrics.drawCalls,
      triangles: this.metrics.triangles.toLocaleString(),
      geometries: this.metrics.geometries,
      textures: this.metrics.textures,
      programs: this.metrics.programs,
      memory: this.metrics.memory ? this.metrics.memory.toFixed(2) + ' MB' : 'N/A'
    };
  }

  /**
   * Print stats to console
   */
  logStats() {
    console.group('🎯 Performance Metrics');
    console.table(this.getSummary());
    console.groupEnd();
  }

  /**
   * Print detailed breakdown
   */
  logDetailedStats() {
    const summary = this.getSummary();
    const breakdown = {
      'Frame Time': summary.frameTime,
      'Physics': summary.physicsTime,
      'Update': summary.updateTime,
      'Render': summary.renderTime,
      'Other': (this.metrics.frameTime - this.metrics.physicsTime - this.metrics.updateTime - this.metrics.renderTime).toFixed(2) + 'ms'
    };

    console.group('🎯 Performance Metrics - Detailed');
    console.log('📊 FPS:', summary.currentFPS, '(avg:', summary.averageFPS + ')');
    console.log('⏱️ Frame Time Breakdown:');
    console.table(breakdown);
    console.log('🎨 Render Stats:');
    console.table({
      'Draw Calls': summary.drawCalls,
      'Triangles': summary.triangles,
      'Geometries': summary.geometries,
      'Textures': summary.textures,
      'Programs': summary.programs
    });
    if (summary.memory !== 'N/A') {
      console.log('💾 Memory:', summary.memory);
    }
    console.groupEnd();
  }

  /**
   * Check for performance warnings
   */
  _checkPerformanceWarnings() {
    if (this.metrics.fps < this.fpsThreshold) {
      console.warn(`⚠️ Low FPS: ${Math.round(this.metrics.fps)} (threshold: ${this.fpsThreshold})`);
    }

    if (this.metrics.frameTime > this.frameTimeThreshold) {
      console.warn(`⚠️ High frame time: ${this.metrics.frameTime.toFixed(2)}ms (threshold: ${this.frameTimeThreshold}ms)`);
    }

    if (this.metrics.drawCalls > 1000) {
      console.warn(`⚠️ High draw calls: ${this.metrics.drawCalls} (consider batching)`);
    }
  }

  /**
   * Create on-screen stats display
   */
  createStatsDisplay() {
    if (this.statsElement) return;

    this.statsElement = document.createElement('div');
    this.statsElement.id = 'performance-stats';
    this.statsElement.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 5px;
      z-index: 10000;
      min-width: 200px;
      line-height: 1.5;
      pointer-events: none;
      user-select: none;
    `;
    document.body.appendChild(this.statsElement);
  }

  /**
   * Update on-screen stats display
   */
  _updateStatsDisplay() {
    if (!this.statsElement) return;

    const summary = this.getSummary();
    const fpsColor = summary.currentFPS < this.fpsThreshold ? '#ff0000' : 
                     summary.currentFPS < 50 ? '#ffaa00' : '#00ff00';

    this.statsElement.innerHTML = `
      <div style="color: ${fpsColor}; font-weight: bold; font-size: 14px;">
        FPS: ${summary.currentFPS} (avg: ${summary.averageFPS})
      </div>
      <div style="margin-top: 5px;">
        Frame: ${summary.frameTime}
      </div>
      <div style="font-size: 10px; color: #888;">
        ├─ Physics: ${summary.physicsTime}<br>
        ├─ Update: ${summary.updateTime}<br>
        └─ Render: ${summary.renderTime}
      </div>
      <div style="margin-top: 5px; border-top: 1px solid #333; padding-top: 5px;">
        Draw Calls: ${summary.drawCalls}<br>
        Triangles: ${summary.triangles}<br>
        Geometries: ${summary.geometries}<br>
        Textures: ${summary.textures}
      </div>
      ${summary.memory !== 'N/A' ? `<div style="margin-top: 5px;">Memory: ${summary.memory}</div>` : ''}
    `;
  }

  /**
   * Toggle stats display
   */
  toggleStatsDisplay() {
    this.showStats = !this.showStats;
    
    if (this.showStats) {
      this.createStatsDisplay();
      console.log('📊 Performance stats display enabled');
    } else if (this.statsElement) {
      this.statsElement.style.display = 'none';
      console.log('📊 Performance stats display disabled');
    }

    if (this.showStats && this.statsElement) {
      this.statsElement.style.display = 'block';
    }
  }

  /**
   * Remove stats display
   */
  dispose() {
    if (this.statsElement) {
      this.statsElement.remove();
      this.statsElement = null;
    }
  }

  /**
   * Get performance grade
   */
  getPerformanceGrade() {
    const avgFPS = this.getAverageFPS();
    
    if (avgFPS >= 60) return { grade: 'A', color: '#00ff00', text: 'Excellent' };
    if (avgFPS >= 50) return { grade: 'B', color: '#88ff00', text: 'Good' };
    if (avgFPS >= 40) return { grade: 'C', color: '#ffaa00', text: 'Fair' };
    if (avgFPS >= 30) return { grade: 'D', color: '#ff6600', text: 'Poor' };
    return { grade: 'F', color: '#ff0000', text: 'Critical' };
  }

  /**
   * Get optimization suggestions
   */
  getOptimizationSuggestions() {
    const suggestions = [];

    if (this.metrics.drawCalls > 1000) {
      suggestions.push('⚠️ High draw calls - Consider using InstancedMesh or geometry merging');
    }

    if (this.metrics.triangles > 500000) {
      suggestions.push('⚠️ High triangle count - Consider using LOD or reducing mesh complexity');
    }

    if (this.metrics.textures > 50) {
      suggestions.push('⚠️ Many textures loaded - Consider using texture atlases');
    }

    if (this.metrics.physicsTime > 10) {
      suggestions.push('⚠️ Slow physics - Consider using spatial partitioning or reducing physics bodies');
    }

    if (this.metrics.renderTime > 15) {
      suggestions.push('⚠️ Slow rendering - Check shadow quality, post-processing, or shader complexity');
    }

    if (suggestions.length === 0) {
      suggestions.push('✅ Performance looks good!');
    }

    return suggestions;
  }

  /**
   * Print optimization report
   */
  printOptimizationReport() {
    const grade = this.getPerformanceGrade();
    const suggestions = this.getOptimizationSuggestions();

    console.group('🎯 Performance Report');
    console.log(`Grade: ${grade.grade} - ${grade.text}`);
    console.log(`Average FPS: ${Math.round(this.getAverageFPS())}`);
    console.log('\nOptimization Suggestions:');
    suggestions.forEach(s => console.log(s));
    console.groupEnd();
  }
}
