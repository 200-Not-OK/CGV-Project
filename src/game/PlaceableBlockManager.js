import * as THREE from 'three';
import { PlaceableBlock } from './components/PlaceableBlock.js';

/**
 * Manages all placeable blocks in a level
 * Handles spawning, updating, and providing interface for player interaction
 */
export class PlaceableBlockManager {
  constructor(scene, physicsWorld) {
    this.scene = scene;
    this.physicsWorld = physicsWorld;
    
    // Storage for all blocks
    this.blocks = new Map(); // id -> PlaceableBlock instance
  }
  
  /**
   * Load blocks from level data
   */
  async loadBlocks(levelData) {
    if (!levelData.placeableBlocks || !Array.isArray(levelData.placeableBlocks)) {
      console.log('No placeable blocks to load');
      return;
    }
    
    console.log(`📦 Loading ${levelData.placeableBlocks.length} placeable blocks...`);
    
    for (const blockData of levelData.placeableBlocks) {
      try {
        const block = new PlaceableBlock(blockData, this.scene, this.physicsWorld);
        block.create();
        
        this.blocks.set(blockData.id, block);
        console.log(`✅ Loaded block: ${blockData.id} at [${blockData.position.join(', ')}]`);
      } catch (error) {
        console.error(`Failed to load block ${blockData.id}:`, error);
      }
    }
    
    console.log(`✅ Loaded ${this.blocks.size} placeable blocks`);
  }
  
  /**
   * Update all blocks
   */
  update(delta) {
    for (const block of this.blocks.values()) {
      block.update(delta);
    }
  }
  
  /**
   * Get a block by ID
   */
  getBlock(id) {
    return this.blocks.get(id);
  }
  
  /**
   * Get all blocks
   */
  getAllBlocks() {
    return Array.from(this.blocks.values());
  }
  
  /**
   * Check if there's a block at a given position (within range)
   * Used by player for pickup detection
   */
  getBlockNearPosition(position, maxDistance = 2.5) {
    for (const block of this.blocks.values()) {
      if (block.isHeld()) continue; // Skip blocks already being held
      
      const distance = block.getPosition().distanceTo(position);
      if (distance <= maxDistance) {
        return block;
      }
    }
    return null;
  }
  
  /**
   * Get block using raycast (for player pickup detection)
   * 
   * This uses a cone-based detection instead of strict distance:
   * - Within 10m: can detect
   * - Looking at block (within 120 degree cone): can pickup
   * - Within 3m: pickup if looking roughly at it
   */
  getBlockFromRaycast(origin, direction, maxDistance = 20.0) {
    let closestBlock = null;
    let closestDistance = Infinity;
    let bestDot = -1;
    
    // Dynamic distance threshold based on how close player is
    const pickupRange = 3.0;
    
    for (const block of this.blocks.values()) {
      if (block.isHeld()) continue; // Skip blocks already being held
      
      const blockPos = block.getPosition();
      const toBlock = new THREE.Vector3().subVectors(blockPos, origin);
      const distance = toBlock.length();
      
      console.log(`  📦 Checking block ${block.id} at ${blockPos.x.toFixed(1)}, ${blockPos.y.toFixed(1)}, ${blockPos.z.toFixed(1)}, distance: ${distance.toFixed(2)}m`);
      
      // First pass: reject blocks too far away (beyond detection range)
      if (distance > maxDistance) {
        console.log(`    ❌ Too far (beyond detection)`);
        continue;
      }
      
      // Check if block is roughly in the direction we're looking
      const toBlockNorm = toBlock.clone().normalize();
      const dot = direction.dot(toBlockNorm);
      const angle = Math.acos(THREE.MathUtils.clamp(dot, -1, 1)) * 180 / Math.PI;
      
      console.log(`    📐 Dot: ${dot.toFixed(3)}, angle: ${angle.toFixed(1)}°`);
      
      // Determine pickup eligibility based on distance and angle
      let canPickup = false;
      
      if (distance <= pickupRange) {
        // Within pickup range - can pickup if looking roughly at it (90 degree cone)
        if (dot > 0.0) { // Looking roughly in the direction of the block
          canPickup = true;
          console.log(`    ✅ Within pickup range and looking at it`);
        } else {
          console.log(`    ❌ Within range but looking away`);
        }
      } else if (distance <= 6.0) {
        // Medium range - need to be more aligned (60 degree cone)
        if (dot > 0.5) {
          canPickup = true;
          console.log(`    ✅ Medium range and well aligned`);
        } else {
          console.log(`    ❌ Medium range but not aligned enough`);
        }
      } else {
        // Far away - need perfect alignment (30 degree cone)
        if (dot > 0.866) {
          canPickup = true;
          console.log(`    ✅ Far but perfectly aligned`);
        } else {
          console.log(`    ❌ Too far and not aligned`);
        }
      }
      
      if (canPickup && distance < closestDistance) {
        console.log(`    🎯 Selected as pickup candidate!`);
        closestBlock = block;
        closestDistance = distance;
        bestDot = dot;
      }
    }
    
    return closestBlock;
  }
  
  /**
   * Remove a block by ID
   */
  removeBlock(id) {
    const block = this.blocks.get(id);
    if (block) {
      block.destroy();
      this.blocks.delete(id);
      return true;
    }
    return false;
  }
  
  /**
   * Clear all blocks
   */
  clear() {
    console.log(`🧹 Clearing ${this.blocks.size} placeable blocks...`);
    for (const block of this.blocks.values()) {
      block.destroy();
    }
    this.blocks.clear();
  }
  
  /**
   * Dispose of all blocks and cleanup
   */
  dispose() {
    this.clear();
  }
}
