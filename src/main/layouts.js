import { first, get, includes, isArray, isObject, isEmpty, clone } from 'lodash';
import { reaction } from 'mobx';
import Promise from 'bluebird';

import {
  setConfig,
  setButton,
  resetButton,
  getCurrentHeldButtons,
  getButtonState,
  getCurrentLayouts,
  getCurrentScene
} from './state';
import { streamDeck, convertKey } from './stream_deck';
import { getSceneName, getScene } from './obs';
import { generateImage } from './image';
import ConfigFile from './config-file';

/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */

const configFile = new ConfigFile();
let subscribed = false;

export function getConfigFile() {
  return configFile;
}

export async function load() {
  const layouts = configFile.load().get();

  const nestedLoop = async (obj, parent = null, grandparent = null) => {
    return Promise.map(Object.entries(obj), async entry => {
      if (isObject(entry[1])) {
        return nestedLoop(entry[1], obj, parent);
      }

      if (obj.type && obj.type === 'image') {
        if (!obj.text) {
          if (grandparent && grandparent.name) {
            obj.text = grandparent.name;
          }
        }
        const generatedImage = await generateImage(obj);
        obj.image = generatedImage;
      }
    });
  };

  await nestedLoop(layouts);
  setConfig(layouts);

  const updateActualButtons = async (newVal, oldVal) => {
    return Promise.map(newVal, async (val, idx) => {
      if (!isEmpty(val)) {
        if (val.type === 'color') {
          streamDeck.fillColor(idx, ...val.color);
        } else if (val.type === 'image') {
          if (oldVal[idx] && val !== oldVal[idx] && val.image) {
            // eslint-disable-line eqeqeq
            streamDeck.fillImage(idx, val.image);
          }
        }
      } else {
        streamDeck.clearKey(idx);
      }
    });
  };

  const sendSetButton = (idx, key, propName = 'inactive') => {
    const img = get(key, `visual.${propName}`);
    if (img) {
      return setButton(idx, img);
    }
  };

  const updateIndividualButtonState = (key, idx) => {
    resetButton(idx);

    if (key && key.visual) {
      const currentScene = getScene();
      const currentSceneName = getSceneName();

      switch (key.type) {
        case 'switch':
        case 'toggle':
        case 'momentary':
          return sendSetButton(
            idx,
            key,
            key.sceneName === currentSceneName ? 'active' : 'inactive'
          );

        case 'toggleSource':
          Object.entries(key.scenes).forEach(ent => {
            // eslint-disable-next-line prefer-const
            let [sourceName, sceneNames] = ent;
            if (!isArray(sceneNames)) sceneNames = [sceneNames];
            if (includes(sceneNames, currentSceneName)) {
              const foundSceneItem = currentScene.sources.find(
                sceneItem => sceneItem.name === sourceName
              );
              if (foundSceneItem) {
                return sendSetButton(idx, key, foundSceneItem.render ? 'active' : 'inactive');
              }
            }
          });
          break;

        case 'bindKey':
          let foundKey = false;

          (getCurrentHeldButtons() || []).slice().forEach(k => {
            if (k && key.key === k.key && key.modifiers === k.modifiers) {
              foundKey = true;
              return sendSetButton(idx, key, 'active');
            }
          });

          if (!foundKey) {
            return sendSetButton(idx, key, 'inactive');
          }
          break;

        default:
          return sendSetButton(idx, key, 'inactive');
      }
    }
  };

  const updateButtonState = layout => {
    const previousButtonState = clone(getButtonState());

    for (let idx = 0; idx < 15; idx += 1) {
      const { row, col } = convertKey(idx);
      const key = layout && layout[`${col + 1},${row + 1}`];
      updateIndividualButtonState(key, idx);
    }

    return updateActualButtons(getButtonState(), previousButtonState);
  };

  if (!subscribed) {
    reaction(() => getCurrentLayouts(), currentLayouts => updateButtonState(first(currentLayouts)));

    reaction(() => getCurrentScene(), _ => updateButtonState(first(getCurrentLayouts())));

    reaction(() => getCurrentHeldButtons(), _ => updateButtonState(first(getCurrentLayouts())));

    subscribed = true;
  }

  updateButtonState(first(getCurrentLayouts()));
}

export default {
  load,
  getConfigFile
};
