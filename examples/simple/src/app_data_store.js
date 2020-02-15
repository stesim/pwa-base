import { createDataStore } from '../../../data_store.js';

const store = createDataStore('PWA_Example', {
  startTime: Date.now(),
  numClicks: 0,
});

export default store;
