import { observable } from 'mobx';
import { get } from 'lodash';
import { getNumberOfHeldKeys } from './stream_deck';

export const state = observable({
  config: {},
  currentLayout: {},
  currentLayouts: [],
  currentScene: null,
  previousScene: null,
  currentHeldButtons: [],
  studioMode: false,
  previousKey: null,
  buttonState: Array(15).fill({})
});

export function addToCurrentLayouts(layout) {
  state.currentLayouts = [layout, ...state.currentLayouts];
}

export function removeFromCurrentLayouts(layout) {
  state.currentLayouts = state.currentLayouts.filter(lo => lo !== layout);
}

//  TODO: This feels like we're going to need to start a new file for layout handling
export function getCurrentKey(stringKey) {
  let result = null;
  state.currentLayouts.forEach(lo => {
    const foundKey = get(lo, stringKey);
    if (!result && foundKey) {
      result = foundKey;
    }
  });
  return result;
}

export function setCurrentLayout(layout) {
  state.currentLayout = layout;
}

export function resetCurrentLayout() {
  state.currentLayout = state.config;
  state.currentLayouts = [state.config];
}

export function setConfig(config) {
  state.config = config;
  resetCurrentLayout();
}

export function setInitialScene(sceneName) {
  state.currentScene = sceneName;
  state.previousScene = sceneName;
}

export function setScene(sceneObj) {
  const currentScene = state.currentScene;
  if (!state.studioMode) {
    state.currentScene = sceneObj;
    state.previousScene = currentScene;
  }
}

export function setPreviewScene(sceneObj) {
  const currentScene = state.currentScene;
  if (state.studioMode) {
    state.currentScene = sceneObj;
    state.previousScene = currentScene;
  }
}

export function setPreviousKey(key) {
  state.previousKey = key;
}

export function clearPreviousKey() {
  state.previousKey = null;
}

export function updateCurrentScene(sceneObj) {
  state.currentScene = sceneObj;
}

export function setStudioMode(enabled) {
  state.studioMode = !!enabled;
}

export function setButton(idx, value) {
  state.buttonState[idx] = value;
}

export function resetButton(idx) {
  state.buttonState[idx] = {};
}

// path would be like: '1,1.layout.1,1' if it was nested, '1,1' otherwise
// export function updateButtonImage(path, image, type = 'inactive') {
//   set(state, `config.${idx}.visual.${type}.image`, image);
// }

export function addHeldButton(key, currentScene, previousScene = undefined) {
  const objToAdd = {
    currentScene,
    key,
    previousScene
  };
  state.currentHeldButtons = [...state.currentHeldButtons, objToAdd];
  console.log('current keys:', state.currentHeldButtons);
}

export function clearHeldButtons() {
  state.currentHeldButtons = [];
}

export function removeHeldButton(key) {
  const foundObj = state.currentHeldButtons.find(o => o.key === key);
  state.currentHeldButtons.remove(foundObj);
  if (getNumberOfHeldKeys() === 0) {
    clearHeldButtons();
  }
  console.log('current keys:', state.currentHeldButtons);
  return foundObj;
}
