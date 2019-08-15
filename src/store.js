import { createStore, action } from 'easy-peasy';
import logger from 'redux-logger';

export const store = createStore(
  {
    configData: {},
    setConfigData: action((state, payload) => {
      console.log(state);
      state.configData = payload;
    }),
    currentIndex: undefined,
    setCurrentIndex: action((state, payload) => {
      state.currentIndex = payload;
    }),
    clearCurrentIndex: action((state, _payload) => {
      state.currentIndex = undefined;
    })
  },
  {
    middleware: [logger]
  }
);

export default {
  store
};
