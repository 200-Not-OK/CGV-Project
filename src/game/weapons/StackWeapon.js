import * as THREE from 'three';
import { StackBlock } from './StackBlock.js';

export class StackWeapon {
  constructor(player, scene, physicsWorld) {
    this.player = player;
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    
    // Stack management
    this.blocks = [];           // Array of StackBlock instances
    this.maxBlocks = 3;
    this.blockHeight = 0.5;     // Height of each block
    this.blockWidth = 1.0;      // Width of each block
    this.blockDepth = 1.0;      // Depth of each block
    
    // Input bindings
    this.placeKey = 'KeyX';     // X to place block
    this.popKey = 'KeyZ';       // Z to pop top block
    
    // Cooldown
    this.lastPlaceTime = 0;
    this.placeCooldown = 0.3;   // seconds
    
    this.enabled = false;
  }
  
  mount() {
    this.enabled = true;
    console.log('🎮 StackWeapon mounted - X to place, Z to pop');
  }
  
  unmount() {
    this.enabled = false;
    this.clear(); // Clear all blocks when weapon disabled
  }
  
  handleInput(input) {
    if (!this.enabled || !input || !input.isKey) return;
    
    // Place block (X key)
    if (input.isKey(this.placeKey)) {
      this.placeBlock();
    }
    
    // Pop block (Z key)
    if (input.isKey(this.popKey)) {
      this.popBlock();
    }
  }
  
  placeBlock() {
    // Cooldown check
    const now = Date.now();
    if (now - this.lastPlaceTime < this.placeCooldown * 1000) return;
    
    // Max blocks check
    if (this.blocks.length >= this.maxBlocks) {
      console.log(`❌ Max stack (${this.maxBlocks}) reached!`);
      return;
    }
    
    // Calculate position - stack blocks vertically below the player
    const playerPos = this.player.getPosition();
    
    // Position blocks centered under player at ground level
    const blockX = Math.round(playerPos.x); // Snap to grid
    const blockZ = Math.round(playerPos.z); // Snap to grid
    
    // Stack height calculation: each new block goes BELOW the previous
    // blocks[0] is at the bottom, blocks[n] is at the top
    const stackBottomY = playerPos.y - 1.5; // Start below player
    const blockY = stackBottomY - (this.blocks.length * this.blockHeight);
    
    const blockPosition = new THREE.Vector3(blockX, blockY, blockZ);
    
    // Create block
    const block = new StackBlock(blockPosition, this.scene, this.physicsWorld, this.player);
    this.blocks.push(block);
    
    this.lastPlaceTime = now;
    console.log(`✅ Block placed at (${blockX}, ${blockY.toFixed(2)}, ${blockZ}) - Stack: ${this.blocks.length}/${this.maxBlocks}`);
    
    // Optional: Play sound
    if (this.player.game?.soundManager) {
      this.player.game.soundManager.playSFX('jump', 0.3);
    }
    
    // Push player upward
    this.pushPlayerUp();
  }
  
  pushPlayerUp() {
    if (!this.player.body) return;
    
    // Apply upward impulse to player
    const pushForce = 15;
    this.player.body.velocity.y = Math.max(this.player.body.velocity.y, pushForce);
    
    console.log(`⬆️ Player pushed upward - velocity Y: ${this.player.body.velocity.y.toFixed(2)}`);
  }
  
  popBlock() {
    if (this.blocks.length === 0) {
      console.log('❌ No blocks to pop!');
      return;
    }
    
    // Remove and animate top block (last in array)
    const topBlock = this.blocks.pop();
    topBlock.pop(0.2); // 0.2s pop animation
    
    console.log(`🗑️ Block popped - Stack: ${this.blocks.length}/${this.maxBlocks}`);
    
    // Optional: Play sound
    if (this.player.game?.soundManager) {
      this.player.game.soundManager.playSFX('jump', 0.4);
    }
  }
  
  clear() {
    this.blocks.forEach(block => block.destroy());
    this.blocks = [];
    console.log('🧹 Stack cleared');
  }
  
  update(delta) {
    // Update all blocks
    this.blocks.forEach(block => block.update(delta));
  }
  
  getStackHeight() {
    return this.blocks.length * this.blockHeight;
  }
  
  getStackCount() {
    return this.blocks.length;
  }
}
