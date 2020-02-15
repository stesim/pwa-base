export default class AppController {
  constructor(dataStore, appCommunication, uiCommunication) {
    this._data = dataStore;

    this._appComm = appCommunication;
    this._appComm.subscribe(message => this._onAppMessage(message));

    this._uiComm = uiCommunication;
    this._uiComm.subscribe(message => this._onUiMessage(message));
  }

  _onAppMessage(message) {
    switch (message.type) {
      case 'update-available': {
        const applyUpdate = confirm('An update is available. Do you want to activate it?');
        if (applyUpdate) {
          this._appComm.publish({type: 'activate-update'});
        }
        break;
      }
    }
  }

  _onUiMessage(message) {
    switch (message.type) {
      case 'click': {
        ++this._data.numClicks;
        break;
      }
    }
  }
}