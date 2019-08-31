# custom-select-mixins

```js
import CustomSelectorMixin from 'custom-select-mixins';
import {define} from './node_modules/backed/src/utils/define.js';

class CustomSelector extends CustomSelectorMixin(HTMLElement) {
  constructor() {
    super();
  }
}

define(CustomSelector); // or customElements.define('custom-selector', CustomSelector)
```