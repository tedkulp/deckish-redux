// import watch from 'redux-watch';
import { first, get, includes, isArray, isObject, isEmpty, clone } from 'lodash';
import { reaction } from 'mobx';
// import util from 'util';
import Promise from 'bluebird';

// import store from './store';
import { state, setConfig, setButton, resetButton } from './state';
import { streamDeck, convertKey } from './stream_deck';
import { getSceneName, getScene } from './obs';
import { generateImage } from './image';
import ConfigFile from './config-file';

/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */

const configFile = new ConfigFile();
let subscribed = false;

export async function load() {
  const layouts = configFile.load().get();

  const nestedLoop = async (obj, parent = null, grandparent = null) => {
    return Promise.map(Object.entries(obj), async entry => {
      if (isObject(entry[1])) {
        return await nestedLoop(entry[1], obj, parent);
      } else {
        if (obj.type && obj.type === 'image') {
          if (!obj.text) {
            if (grandparent && grandparent.name) {
              obj.text = grandparent.name;
            }
          }
          const generatedImage = await generateImage(obj);
          obj['image'] = generatedImage;
        }
      }
    });
  };

  await nestedLoop(layouts);
  setConfig(layouts);

  // console.log(util.inspect(layouts, { depth: null, showHidden: false }));

  const updateActualButtons = async (newVal, oldVal) => {
    return Promise.map(newVal, async (val, idx) => {
      if (!isEmpty(val)) {
        if (val.type === 'color') {
          streamDeck.fillColor(idx, ...val.color);
        } else if (val.type === 'image') {
          if (oldVal[idx] && val != oldVal[idx] && val.image) {
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

          get(state, 'currentHeldButtons', [])
            .slice()
            .forEach(k => {
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
    const previousButtonState = clone(state.buttonState);

    for (let idx = 0; idx < 15; idx += 1) {
      const { row, col } = convertKey(idx);
      const key = layout && layout[`${col + 1},${row + 1}`];
      updateIndividualButtonState(key, idx);
    }

    return updateActualButtons(state.buttonState, previousButtonState);
  };

  if (!subscribed) {
    reaction(
      () => state.currentLayouts,
      currentLayouts => updateButtonState(first(currentLayouts))
    );

    reaction(() => state.currentScene, _ => updateButtonState(first(state.currentLayouts)));

    reaction(() => state.currentHeldButtons, _ => updateButtonState(first(state.currentLayouts)));

    subscribed = true;
  }

  updateButtonState(first(state.currentLayouts));
}

export default {
  load
};
