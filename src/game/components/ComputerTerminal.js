import * as THREE from 'three';

export class ComputerTerminal {
  constructor(computerData, glitchManager, game) {
    this.computerData = computerData;
    this.glitchManager = glitchManager;
    this.game = game;
    this.interactionRadius = computerData.radius || 20.0;
    
    console.log('💻 Creating computer at:', computerData.position);
    
    // Create computer mesh
    this.mesh = this.createComputerMesh();
    
    // Position it
    this.mesh.position.set(...computerData.position);
    
    // State
    this.playerInRange = false;
    this.animationTime = 0;
    this.canActivate = false;
    
    console.log('💻 Computer created successfully!');
  }

  createComputerMesh() {
    // Main computer body
    const bodyGeometry = new THREE.BoxGeometry(3, 2, 1.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff0000, // Start red
      emissive: 0x330000
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // Glowing screen
    const screenGeometry = new THREE.PlaneGeometry(2, 1.5);
    const screenMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000, // Start red
      side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.8;
    screen.position.y = 0.3;
    
    // Rotating beacon on top
    const beaconGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 8);
    const beaconMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      emissive: 0xffff00
    });
    const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
    beacon.position.y = 1.5;
    
    // Add a point light
    const pointLight = new THREE.PointLight(0xffff00, 1, 15);
    beacon.add(pointLight);
    
    // Create a group for everything
    const computerGroup = new THREE.Group();
    computerGroup.add(body);
    computerGroup.add(screen);
    computerGroup.add(beacon);
    
    // Mark it as a computer
    computerGroup.userData.isComputer = true;
    
    return computerGroup;
  }

  isPlayerInRange(playerPosition) {
    const computerPos = this.mesh.position.clone();
    const playerPos = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
    const distance = computerPos.distanceTo(playerPos);
    
    const wasInRange = this.playerInRange;
    this.playerInRange = distance <= this.interactionRadius;
    this.canActivate = this.glitchManager.canActivateComputer();
    
    // Log when entering/exiting range for debugging
    if (this.playerInRange && !wasInRange) {
      console.log('🎯 Player entered computer range');
    } else if (!this.playerInRange && wasInRange) {
      console.log('🎯 Player left computer range');
    }
    
    return this.playerInRange;
  }

  interact() {
    console.log('💻 COMPUTER INTERACTION TRIGGERED!');
    
    if (!this.canActivate) {
      const collected = this.glitchManager.collectedLLMs.size;
      const required = this.glitchManager.requiredLLMs.length;
      const message = `Need ${required - collected} more LLMs to activate!`;
      console.log('❌', message);
      
      if (this.game.showMessage) {
        this.game.showMessage(message, 3000);
      }
      return { success: false, message: message };
    }
    
    const result = this.glitchManager.activateComputer();
    
    if (result.success) {
      console.log('🚀 Teleporting to:', result.level);
      
      if (this.game.showMessage) {
        this.game.showMessage(result.message, 3000);
      }
      
      // Load the glitched level
      setTimeout(() => {
        if (this.game.loadLevelByName) {
          this.game.loadLevelByName(result.level);
        } else {
          console.error('❌ loadLevelByName method not found!');
        }
      }, 2000);
    } else {
      if (this.game.showMessage) {
        this.game.showMessage(result.message, 3000);
      }
    }
    
    return result;
  }

  update(playerPosition) {
    this.animationTime += 0.02;
    
    // Rotate the beacon
    const beacon = this.mesh.children[2];
    if (beacon) {
      beacon.rotation.y = this.animationTime;
    }
    
    // Check if player is in range and can activate
    const wasInRange = this.playerInRange;
    this.isPlayerInRange(playerPosition);
    
    // Update colors based on activation status
    const screen = this.mesh.children[1];
    const body = this.mesh.children[0];
    
    if (screen && body) {
      if (this.canActivate) {
        // Ready - green and pulsing
        screen.material.color.setHex(0x00ff00);
        body.material.color.setHex(0x00aa00);
        
        // Pulsing effect when ready
        const pulse = Math.sin(this.animationTime * 4) * 0.2 + 0.8;
        screen.material.opacity = pulse;
      } else {
        // Not ready - red and dim
        screen.material.color.setHex(0xff0000);
        body.material.color.setHex(0xaa0000);
        screen.material.opacity = 0.7;
      }
    }
    
    // Handle interaction prompt
    if (this.playerInRange && this.game.ui) {
      const interactionPrompt = this.game.ui.get('interactionPrompt');
      if (interactionPrompt) {
        // Always update the prompt when in range
        if (this.canActivate) {
          interactionPrompt.show('ACCESS GLITCHED DIMENSIONS');
        } else {
          const collected = this.glitchManager.collectedLLMs.size;
          const required = this.glitchManager.requiredLLMs.length;
          interactionPrompt.show(`NEEDS ${required - collected} MORE LLMs`);
        }
        // Keep track that we're showing computer prompt
        this.currentInteractable = this;
        console.log('🖥️ Showing/updating computer interaction prompt');
      }
    } else if (this.game.ui && this.currentInteractable === this) {
      // Only hide if we were the ones showing it and player moved away
      const interactionPrompt = this.game.ui.get('interactionPrompt');
      if (interactionPrompt && interactionPrompt.isVisible) {
        const currentText = interactionPrompt.getText ? interactionPrompt.getText() : '';
        const isOurPrompt = currentText.includes('GLITCHED') || currentText.includes('LLMs');
        
        if (isOurPrompt) {
          console.log('🖥️ Hiding computer interaction prompt');
          interactionPrompt.hide();
          this.currentInteractable = null;
        }
      }
    }
  }
}