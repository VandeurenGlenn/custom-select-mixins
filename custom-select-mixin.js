'use strict';
import PropertyMixin from './../backed/mixins/property-mixin.js';
import merge from './../lodash-es/merge.js';

export default base => {
  return class CustomSelectMixin extends PropertyMixin(base) {
    static get observedAttributes() {
      return ['selected'];
    }

    constructor(options = {}) {
      const properties = {
        selected: {
          value: 0,
          reflect: true,
          observer: '__selectedObserver__'
        }
      }
      if (options.properties) merge(options.properties, properties);
      else options.properties = properties;
      super(options);
    }

    get root() {
      return this.shadowRoot || this;
    }

    get slotted() {
      return this.shadowRoot ? this.shadowRoot.querySelector('slot') : this;
    }

    get _assignedNodes() {
      return 'assignedNodes' in this.slotted ? this.slotted.assignedNodes() : this.children;
    }

    /**
    * @return {String}
    */
    get attrForSelected() {
     return this.getAttribute('attr-for-selected') || 'name';
    }

    set attrForSelected(value) {
     this.setAttribute('attr-for-selected', value);
    }

    connectedCallback() {
      super.connectedCallback();
      this.slotchange = this.slotchange.bind(this);
      this.slotted.addEventListener('slotchange', this.slotchange);
    }

    slotchange() {
      if (this.selected) {
        this.__selectedObserver__({value: this.selected})
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        // check if value is number
        if (!isNaN(newValue)) {
          newValue = Number(newValue);
        }
        this[name] = newValue;
      }
    }

    /**
     * @param {string|number|HTMLElement} selected
     */
    select(selected) {
      this.selected = selected;
    }

    next(string) {
      const index = this._assignedNodes.indexOf(this.currentSelected);
      if (index !== -1 && index >= 0 && this._assignedNodes.length > index &&
          (index + 1) <= this._assignedNodes.length - 1) {
        this.selected = this._assignedNodes[index + 1]
      }
    }

    previous() {
      const index = this._assignedNodes.indexOf(this.currentSelected);
      if (index !== -1 && index >= 0 && this._assignedNodes.length > index &&
          (index - 1) >= 0) {
        this.selected = this._assignedNodes[index - 1]
      }
    }

    _updateSelected(selected) {
      selected.classList.add('custom-selected');
      if (this.currentSelected && this.currentSelected !== selected) {
        this.currentSelected.classList.remove('custom-selected');
      }
      this.currentSelected = selected;
    }

    /**
     * @param {string|number|HTMLElement} change.value
     */
    __selectedObserver__(value) {
      switch (typeof this.selected) {
        case 'object':
          this._updateSelected(this.selected)
          break;
        case 'string':
          for (const child of this._assignedNodes) {
            if (child.nodeType === 1) {
              if (child.getAttribute(this.attrForSelected) === this.selected) {
                return this._updateSelected(child);
              }
            }
          }
          if (this.currentSelected) {
            this.currentSelected.classList.remove('custom-selected');
          }
          break;
        default:
          // set selected by index
          const child = this._assignedNodes[this.selected];
          if (child && child.nodeType === 1) {
            this._updateSelected(child);
          // remove selected even when nothing found, better to return nothing
          } else if (this.currentSelected) {
            this.currentSelected.classList.remove('custom-selected');
          }
      }
    }
  }
}
