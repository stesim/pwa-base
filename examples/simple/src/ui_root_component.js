import Component from '../../../component.js';
import { addDataStoreListener, removeDataStoreListener } from '../../../data_store.js';
import render from '../../../render.js';
import mapVariable from '../../../map_variable.js';

export default class UiRootComponent extends Component {
  constructor(dataStore, controllerCommunication) {
    super({
      numClicks: dataStore.numClicks,
    });

    this._data = dataStore;
    this._storeListener = this._onDataStoreChanged.bind(this);
    addDataStoreListener(this._data, this._storeListener);

    this._comm = controllerCommunication;
  }

  _onDataStoreChanged(key, value) {
    if (key === 'numClicks') {
      this._setVariable(key, value);
    }
  }

  _buttonClicked() {
    this._comm.publish({type: 'click'});
  }

  $detach() {
    removeDataStoreListener(this._data, this._storeListener);
  }

  $render() {
    return render({
      type: 'div',
      children: [
        {type: 'button', textContent: 'Click me!', onclick: () => this._buttonClicked()},
        {type: 'span', textContent: mapVariable(this._variables.numClicks, numClicks => `Button was clicked ${numClicks} times.`)},
      ],
    });
  }
}