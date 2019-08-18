/* eslint-disable import/no-cycle */
import { get, isArray } from 'lodash';
import robot from 'robotjs';

import {
  getCurrentScene,
  setPreviousKey,
  clearPreviousKey,
  addToCurrentLayouts,
  removeFromCurrentLayouts,
  getCurrentKey,
  addHeldButton,
  removeHeldButton,
  getPreviousKey
} from './state';
import {
  setScene,
  setPreviousScene,
  toggleSceneItem,
  toggleStudioMode,
  transitionToProgram
} from './obs';
import { convertKeyToStringKey } from './stream_deck';

export const handleUp = keyIndex => {
  const stringKey = convertKeyToStringKey(keyIndex);
  const foundKey = getCurrentKey(stringKey);

  console.log('up', get(foundKey, 'name', '').toString());
  if (foundKey) {
    const removedKey = removeHeldButton(foundKey);
    switch (foundKey.type) {
      case 'bindKey':
        // clearHeldButtons();
        if (foundKey.key) {
          robot.keyToggle(foundKey.key, 'up', foundKey.modifiers ? foundKey.modifiers.slice() : []);
        }
        break;

      case 'momentary':
        if (foundKey.sceneName) {
          if (!foundKey.returnSceneName || foundKey.returnSceneName === '[previousScene]') {
            if (removedKey.previousScene) {
              setScene(removedKey.previousScene);
            } else {
              setPreviousScene();
            }
          } else {
            setScene(foundKey.returnSceneName);
          }
        }
        if (foundKey.layout) {
          // resetCurrentLayout();
          removeFromCurrentLayouts(foundKey.layout);
        }
        clearPreviousKey();
        break;

      case 'previewTransition':
        transitionToProgram();
        break;

      case 'switch':
        if (foundKey.sceneName) {
          setScene(foundKey.sceneName);
        }
        break;

      case 'toggle':
        if (foundKey === getPreviousKey()) {
          if (!foundKey.returnSceneName || foundKey.returnSceneName === '[previousScene]') {
            setPreviousScene();
          } else {
            setScene(foundKey.returnSceneName);
          }
          clearPreviousKey();
        } else {
          setScene(foundKey.sceneName);
        }
        break;

      case 'toggleSceneSource':
        if (foundKey.sceneName && foundKey.sourceName) {
          toggleSceneItem(foundKey.sceneName, foundKey.sourceName);
        }
        break;

      case 'toggleSource':
        Object.entries(foundKey.scenes).forEach(entry => {
          let scenes = entry[1];
          if (entry[1] && !isArray(entry[1])) {
            scenes = [entry[1]];
          }
          if (scenes.find(s => s === getCurrentScene().name)) {
            toggleSceneItem(getCurrentScene().name, entry[0]);
          }
        });
        break;

      case 'toggleStudio':
        toggleStudioMode();
        break;

      default:
        break;
    }
    setPreviousKey(foundKey);
  }
};

export const handleDown = keyIndex => {
  const stringKey = convertKeyToStringKey(keyIndex);
  const foundKey = getCurrentKey(stringKey);

  console.log('down', get(foundKey, 'name', '').toString());
  if (foundKey) {
    addHeldButton(foundKey, foundKey.sceneName, getCurrentScene().name);
    switch (foundKey.type) {
      case 'bindKey':
        if (foundKey.key) {
          robot.keyToggle(
            foundKey.key,
            'down',
            foundKey.modifiers ? foundKey.modifiers.slice() : []
          );
        }
        break;

      case 'momentary':
        if (foundKey.sceneName) {
          setScene(foundKey.sceneName);
        }
        if (foundKey.layout) {
          // setCurrentLayout(foundKey.layout);
          addToCurrentLayouts(foundKey.layout);
        }
        break;

      default:
        break;
    }
  }
};
