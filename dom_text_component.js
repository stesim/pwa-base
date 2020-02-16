import Component from './component.js';

export default class DomTextComponent extends Component {
  constructor(text) {
    super();
    this._domNode = document.createTextNode(text);
  }

  $render() {
    return this._domNode;
  }
}