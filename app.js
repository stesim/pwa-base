import CommunicationChannel from './communication_channel.js';

function logError(error) {
  alert(`App: ${error}`);
}

export default class App {
  constructor(serviceWorkerPath, dataStore, controllerFactory, uiRootFactory) {
    this._dataStore = dataStore;
    this._uiControllerCommunication = new CommunicationChannel();
    this._appControllerCommunication = new CommunicationChannel();
    this._controllerComm = this._appControllerCommunication.endpoint1;
    this._controllerComm.subscribe(message => this._onControllerMessage(message));
    this._appController = null;
    this._uiRoot = null;
    this._uiRootDomElement = null;
    this._serviceWorker = null;

    navigator.serviceWorker
      .register(serviceWorkerPath)
      .then(registration => {
        this._serviceWorker = registration;
        this._onServiceWorkerLoaded()
        return Promise.resolve(controllerFactory(
          this._dataStore,
          this._appControllerCommunication.endpoint2,
          this._uiControllerCommunication.endpoint2));
      })
      .then(appController => {
        this._appController = appController;
        return Promise.resolve(uiRootFactory(
          this._dataStore,
          this._uiControllerCommunication.endpoint1));
      })
      .then(uiRoot => {
        this._uiRoot = uiRoot;
        this._uiRootDomElement = this._uiRoot.$render();
        document.body.appendChild(this._uiRootDomElement);
      })
      .then(() => this._checkIfUpdateIsWaitingForInstallation())
      .catch(error => alert(`Failed to initialize app.\n\n${error.stack}`));
  }

  unload() {
    this._controllerComm.publish({type: 'unload'});
    document.body.removeChild(this._uiRootDomElement);
    this._uiRoot.$detach();

    this._dataStore = null;
    this._uiControllerCommunication = null;
    this._appControllerCommunication = null;
    this._controllerComm = null;
    this._appController = null;
    this._uiRoot = null;
    this._uiRootDomElement = null;
    this._serviceWorker = null;
  }

  _onControllerMessage(message) {
    switch (message.type) {
      // TODO(stesim): implement check-for-update
      // case 'check-for-update': {
      //   break;
      // }
      case 'activate-update': {
        if (this._serviceWorker.waiting) {
          this._serviceWorker.waiting.postMessage('skip-waiting');
        } else {
          logError('cannot activate update; none is pending');
        }
        break;
      }
      case 'clear-cache': {
        this._serviceWorker.active.postMessage('clear-cache');
        break;
      }
      default: {
        logError(`unsupported message type: ${message.type}`);
      }
    }
  }

  _checkIfUpdateIsWaitingForInstallation() {
    const notifyController = () => {
      this._controllerComm.publish({type: 'update-available'});
    };

    const registration = this._serviceWorker;
    if (registration.waiting) {
      notifyController();
    } else {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' &&
              navigator.serviceWorker.controller) {
            notifyController();
          }
        });
      });
    }
  }

  _onServiceWorkerLoaded() {
    navigator.serviceWorker
      .addEventListener('message', evt => this._processServiceWorkerMessage(evt.data));
  }

  _processServiceWorkerMessage(message) {
    switch (message) {
      case 'reload':
        window.location.reload();
        break;
      default:
        return false;
    }
    return true;
  }
}
