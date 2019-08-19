import { get, isEqual } from 'lodash';
// eslint-disable-next-line no-unused-vars
import { createStore, action, computed } from 'easy-peasy';
// eslint-disable-next-line import/no-cycle
import { getNumberOfHeldKeys } from './stream_deck';

export const store = createStore({
  config: {},
  currentLayout: {},
  currentLayouts: [],
  currentScene: null,
  previousScene: null,
  currentHeldButtons: [],
  studioMode: false,
  previousKey: null,
  buttonState: Array(15).fill({}),

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
    if (getNumberOfHeldKeys() === 0) {
      state.currentHeldButtons = [];
    }
    // console.log('current keys:', state.currentHeldButtons);
  }),

  addToCurrentLayouts: action((state, payload) => {
    state.currentLayouts = [payload, ...state.currentLayouts];
  }),
  removeFromCurrentLayouts: action((state, payload) => {
    const idx = state.currentLayouts.findIndex(cl => isEqual(cl, payload));
    state.currentLayouts.splice(idx, 1);
  })
});

export const { getState, getActions, dispatch } = store;
export const actions = store.getActions;

export function addToCurrentLayouts(layout) {
  getActions().addToCurrentLayouts(layout);
}

export function removeFromCurrentLayouts(layout) {
  getActions().removeFromCurrentLayouts(layout);
}

//  TODO: This feels like we're going to need to start a new file for layout handling
export function getCurrentKey(stringKey) {
  let result = null;
  getState().currentLayouts.forEach(lo => {
    const foundKey = get(lo, stringKey);
    if (!result && foundKey) {
      result = foundKey;
    }
  });
  return result;
}

export function setCurrentLayout(layout) {
  getActions().setCurrentLayout(layout);
}

export function resetCurrentLayout() {
  getActions().setCurrentLayout();
}

export function setConfig(config) {
  getActions().setConfig(config);
}

export function setInitialScene(sceneName) {
  getActions().setInitialScene(sceneName);
}

export function setScene(sceneObj) {
  getActions().setScene(sceneObj);
}

export function setPreviewScene(sceneObj) {
  getActions().setPreviewScene(sceneObj);
}

export function setPreviousKey(key) {
  getActions().setPreviousKey(key);
}

export function clearPreviousKey() {
  getActions().clearPreviousKey();
}

export function updateCurrentScene(sceneObj) {
  getActions().updateCurrentScene(sceneObj);
}

export function setStudioMode(enabled) {
  getActions().setStudioMode(enabled);
}

export function setButton(idx, value) {
  getActions().setButton({ idx, value });
}

export function resetButton(idx) {
  getActions().setButton({ idx });
}

export function getCurrentScene() {
  return getState().currentScene;
}

export function getPreviousScene() {
  return getState().previousScene;
}

export function getStudioMode() {
  return getState().studioMode;
}

export function getPreviousKey() {
  return getState().previousKey;
}

export function getCurrentHeldButtons() {
  return getState().currentHeldButtons;
}

export function getButtonState() {
  return getState().buttonState;
}

export function getCurrentLayouts() {
  return getState().currentLayouts;
}

export function addHeldButton(key, currentScene, previousScene = undefined) {
  getActions().addHeldButton({ key, currentScene, previousScene });
}

export function clearHeldButtons() {
  getActions().clearHeldButtons();
}

export function removeHeldButton(key) {
  const foundObj = getState().currentHeldButtons.find(o => o.key === key);
  getActions().removeHeldButton(foundObj);
  return foundObj;
}
