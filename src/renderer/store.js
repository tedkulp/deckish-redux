import { createStore, action, computed } from 'easy-peasy';
import { get } from 'lodash';
import logger from 'redux-logger';

const getButtonAtIndex = (state, currentIndex) => {
  return get(state.configData, currentIndex);
};

export const store = createStore(
  {
    configData: {},
    setConfigData: action((state, payload) => {
      state.configData = payload;
    }),
    currentIndex: undefined,
    currentButton: computed(state => getButtonAtIndex(state, state.currentIndex)),
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
