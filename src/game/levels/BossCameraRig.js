/**
 * BossCameraRig
 * Temporarily adjusts third-person camera settings for optimal boss fight framing.
 * Saves and restores original camera settings.
 */
export class BossCameraRig {
  /**
   * @param {any} thirdPersonCamera - Instance of ThirdPersonCamera
   * @param {Object} [opts]
   * @param {number} [opts.distance=20] - Camera distance from player
   * @param {number} [opts.pitch=0.3] - Camera pitch in radians (~17 degrees)
   * @param {number} [opts.heightOffset=2.0] - Height offset for look-at target
   */
  constructor(thirdPersonCamera, opts = {}) {
    this.camera = thirdPersonCamera;
    this.bossDistance = opts.distance ?? 20;
    this.bossPitch = opts.pitch ?? 0.3;
    this.bossHeightOffset = opts.heightOffset ?? 2.0;

    // Backup original settings
    this._savedDistance = null;
    this._savedPitch = null;
    this._savedHeightOffset = null;
    this._active = false;
  }

  /**
   * Activate boss camera settings
   */
  activate() {
    if (this._active || !this.camera) return;
    this._savedDistance = this.camera.distance;
    this._savedPitch = this.camera.pitch;
    this._savedHeightOffset = this.camera.heightOffset;

    this.camera.distance = this.bossDistance;
    this.camera.pitch = this.bossPitch;
    this.camera.heightOffset = this.bossHeightOffset;

    this._active = true;
  }

  /**
   * Restore original camera settings
   */
  deactivate() {
    if (!this._active || !this.camera) return;
    if (this._savedDistance !== null) this.camera.distance = this._savedDistance;
    if (this._savedPitch !== null) this.camera.pitch = this._savedPitch;
    if (this._savedHeightOffset !== null) this.camera.heightOffset = this._savedHeightOffset;

    this._savedDistance = null;
    this._savedPitch = null;
    this._savedHeightOffset = null;
    this._active = false;
  }

  /** Check if boss camera is active */
  isActive() {
    return this._active;
  }
}

