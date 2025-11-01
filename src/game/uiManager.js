import { UIComponent } from './uiComponent.js';

export class UIManager {
  constructor(root = document.getElementById('app')) {
    this.root = root || document.body;
    this.components = new Map(); // key -> component instance
  }

  // Register a component factory. factory should be a class (subclass of UIComponent) or a function returning an instance.
  add(key, factoryOrInstance, props) {
    console.log(`📝 UIManager.add("${key}", ...) called`);
    
    if (this.components.has(key)) {
      console.log(`⚠️ Component "${key}" already exists, returning existing instance`);
      return this.components.get(key);
    }
    
    let inst;
    if (typeof factoryOrInstance === 'function') {
      console.log(`  Creating new instance of ${factoryOrInstance.name}`);
      inst = new factoryOrInstance(this.root, props);
    } else {
      inst = factoryOrInstance;
      if (props && inst.setProps) inst.setProps(props);
    }
    
    if (inst.mount) {
      console.log(`  Calling mount() on ${key}`);
      inst.mount();
      // Ensure the component root accepts pointer events so interactive elements work
      // BUT respect if the component specifically set pointerEvents to 'none'
      try { 
        if (inst.root && inst.root.style && inst.root.style.pointerEvents !== 'none') {
          inst.root.style.pointerEvents = 'auto';
        }
      } catch (e) { /* ignore */ }
    }
    
    this.components.set(key, inst);
    console.log(`✅ Component "${key}" added successfully`);
    return inst;
  }

  get(key) {
    return this.components.get(key);
  }

  remove(key) {
    const inst = this.components.get(key);
    if (!inst) return;
    if (inst.unmount) inst.unmount();
    this.components.delete(key);
  }

  clear() {
    for (const k of Array.from(this.components.keys())) this.remove(k);
  }

  update(delta, ctx) {
    for (const inst of this.components.values()) {
      if (inst.update) inst.update(delta, ctx);
    }
  }

  // Debug method to list all components
  listComponents() {
    console.log('📋 All UI Components:');
    for (const [key, component] of this.components.entries()) {
      console.log(`  - ${key}:`, component, `visible: ${component.root.style.display !== 'none'}`);
    }
  }

  // Update trigger prompt based on active trigger
  updateTriggerPrompt(trigger) {
    const triggerPrompt = this.get('triggerPrompt');
    console.log('📱 UIManager.updateTriggerPrompt called:', {
      hasTriggerPrompt: !!triggerPrompt,
      trigger: trigger?.id || 'none'
    });
    
    if (!triggerPrompt) {
      console.warn('⚠️ TriggerPrompt component not found in UIManager');
      return;
    }

    if (trigger) {
      console.log('📱 Calling triggerPrompt.show() for:', trigger.id);
      triggerPrompt.show(trigger);
    } else {
      console.log('📱 Calling triggerPrompt.hide()');
      triggerPrompt.hide();
    }
  }
}
