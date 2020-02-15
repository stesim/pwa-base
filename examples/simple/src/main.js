import App from '../../../app.js';
import appDataStore from './app_data_store.js';
import AppController from './app_controller.js';
import UiRootComponent from './ui_root_component.js';

window.app = new App(
  'sw.js',
  appDataStore,
  (dataStore, appCommunication, uiCommunication) => new AppController(dataStore, appCommunication, uiCommunication),
  (dataStore, controllerCommunication) => new UiRootComponent(dataStore, controllerCommunication),
);

window.addEventListener('beforeunload', () => {
  app.unload();
});
