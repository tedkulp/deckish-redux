import { get } from 'lodash';
import { createStore } from 'easy-peasy';
import listen from 'listate';
import { forwardToRenderer, replayActionMain } from 'electron-redux';
// eslint-disable-next-line import/no-cycle
import mainModel from './model';
import rendererModel from '../renderer/model';

export const store = createStore(
  {
    ...mainModel,
    ...rendererModel
  },
  {
    middleware: [forwardToRenderer]
  }
);

replayActionMain(store);

listen(store, {
  filter: state => get(state, 'currentIndex'),
  handle: data => {
    console.log(data.current);
  }
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

export function addScene(scene) {
  getActions().addScene(scene);
}

export function clearScenes() {
  getActions().clearScenes();
}

export function setScenes(scenes) {
  getActions().setScenes(scenes);
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
