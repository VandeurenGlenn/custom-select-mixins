import merge from '../../backed/src/utils/merge.js';
import SelectMixin from './select-mixin.js';

export default base => {
  return class SelectorMixin extends SelectMixin(base) {

  static get properties() {
      return merge(super.properties, {
        selected: {
          value: 0,
          observer: '__selectedObserver__'
        }
      });
    }
    constructor() {
      super();
    }
    connectedCallback() {
      super.connectedCallback()
      this._onClick = this._onClick.bind(this);
      this.addEventListener('click', this._onClick);
    }
    disconnectedCallback() {
      this.removeEventListener('click', this._onClick);
    }
    _onClick(event) {
      const target = event.path[0];
      const attr = target.getAttribute(this.attrForSelected);
      if (target.localName !== this.localName) {
        this.selected = attr ? attr : target;
        this.dispatchEvent(new CustomEvent('selected', { detail: this.selected }));
      }
    }
  }
}
