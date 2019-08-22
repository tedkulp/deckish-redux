import { isEqual } from 'lodash';
import { action } from 'easy-peasy';

// eslint-disable-next-line import/no-cycle
// import { getNumberOfHeldKeys } from './stream_deck';

export default {
  config: {},
  currentLayout: {},
  currentLayouts: [],
  currentScene: null,
  previousScene: null,
  currentHeldButtons: [],
  studioMode: false,
  previousKey: null,
  buttonState: Array(15).fill({}),
  scenes: [],

  addScene: action((state, payload) => {
    state.scenes.push(payload);
  }),
  clearScenes: action((state, _payload) => {
    state.scenes = [];
  }),
  setScenes: action((state, payload) => {
    state.scenes = payload;
  }),

  clearPreviousKey: action((state, _payload) => {
    state.previousKey = null;
  }),
  resetButton: action((state, payload) => {
    state.buttonState[payload.idx] = {};
  }),
  resetCurrentLayout: action((state, _payload) => {
    state.currentLayout = state.config;
    state.currentLayouts = [state.config];
  }),

  setButton: action((state, payload) => {
    state.buttonState[payload.idx] = payload.value;
  }),
  setConfig: action((state, payload) => {
    state.config = payload;
    state.currentLayout = state.config;
    state.currentLayouts = [state.config];
  }),
  setCurrentLayout: action((state, payload) => {
    state.currentLayout = payload;
  }),
  setInitialScene: action((state, payload) => {
    state.currentScene = payload;
    state.previousScene = payload;
  }),
  setPreviousKey: action((state, payload) => {
    state.previousKey = payload;
  }),
  setPreviewScene: action((state, payload) => {
    const { currentScene, studioMode } = state;
    if (studioMode) {
      state.currentScene = payload;
      state.previousScene = currentScene;
    }
  }),
  setScene: action((state, payload) => {
    const { currentScene, studioMode } = state;
    if (!studioMode) {
      state.currentScene = payload;
      state.previousScene = currentScene;
    }
  }),
  setStudioMode: action((state, payload) => {
    state.studioMode = !!payload;
  }),

  updateCurrentScene: action((state, payload) => {
    state.currentScene = payload;
  }),

  addHeldButton: action((state, payload) => {
    state.currentHeldButtons = [...state.currentHeldButtons, payload];
    // console.log('current keys:', state.currentHeldButtons);
  }),
  clearHeldButtons: action((state, _payload) => {
    state.currentHeldButtons = [];
  }),
  removeHeldButton: action((state, payload) => {
    const idx = state.currentHeldButtons.findIndex(b => isEqual(b, payload));
    state.currentHeldButtons.splice(idx, 1);
    // if (getNumberOfHeldKeys() === 0) {
    //   state.currentHeldButtons = [];
    // }
    // console.log('current keys:', state.currentHeldButtons);
  }),

  addToCurrentLayouts: action((state, payload) => {
    state.currentLayouts = [payload, ...state.currentLayouts];
  }),
  removeFromCurrentLayouts: action((state, payload) => {
    const idx = state.currentLayouts.findIndex(cl => isEqual(cl, payload));
    state.currentLayouts.splice(idx, 1);
  })
};
