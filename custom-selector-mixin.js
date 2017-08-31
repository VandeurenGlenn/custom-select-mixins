import CustomSelectMixin from './custom-select-mixin.js';

export default base => {
  return class CustomSelectorMixin extends CustomSelectMixin(base) {
    constructor(options) {
      super(options);
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
      this.selected = attr ? attr : target;
      this.dispatchEvent(new CustomEvent('selected', { detail: this.selected }));
    }
  }
}
