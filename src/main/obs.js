import OBSWebSocket from 'obs-websocket-js';
import store from './store';

export const obs = new OBSWebSocket();

const hostname = 'localhost:4444';
let reconnecting = false;

const reconnectToOBS = () => {
  return obs.connect({
      address: hostname
    })
    .then(() => {
      reconnecting = false
    })
    .then(() => obs.send('GetStudioModeStatus'))
    .then(data => {
      store.dispatch({
        type: 'SET_STUDIO_MODE',
        value: data.studioMode
      });
    })
    .then(() => obs.send('GetCurrentScene'))
    .then(data => {
      if (data['scene-name'])
        data.name = data['scene-name'];

      store.dispatch({
        type: 'SET_SCENE',
        value: data
      });
    })
    .then(() => console.log('[obs-websocket] Connected'))
    .catch(_err => {
      console.log('[obs-websocket] Can\'t connect, attempting to reconnect in 5 seconds.');
      setTimeout(reconnectToOBS, 5000);
    });
}

const connectToOBS = () => {
  obs.connect({
      address: hostname
    })
    .then(() => {
      reconnecting = false
    })
    .then(() => obs.send('GetStudioModeStatus'))
    .then(data => {
      store.dispatch({
        type: 'SET_STUDIO_MODE',
        value: data.studioMode
      });
    })
    .then(() => obs.send('GetCurrentScene'))
    .then(currentSceneObj => {
      store.dispatch({
        type: 'SET_INITIAL_SCENE',
        value: currentSceneObj
      });
    })
    .then(() => console.log('[obs-websocket] Connected'))
    .catch(_err => {
      console.log('[obs-websocket] Can\'t connect, attempting to reconnect in 5 seconds.');
      setTimeout(connectToOBS, 5000);
    });
}

connectToOBS();

// TODO: Add some verbose flag or something
obs.on('SwitchScenes', data => {
  if (data['scene-name']) data.name = data['scene-name'];
  store.dispatch({
    type: 'SET_SCENE',
    value: data
  });
});

obs.on('PreviewSceneChanged', data => {
  if (data['scene-name']) data.name = data['scene-name'];
  store.dispatch({
    type: 'SET_PREVIEW_SCENE',
    value: data
  });
});

obs.on('StudioModeSwitched', data => {
  store.dispatch({
    type: 'SET_STUDIO_MODE',
    value: data.newState
  });
});

obs.on('SceneItemVisibilityChanged', data => {
  if (data['scene-name']) data.name = data['scene-name'];
  obs.send('GetCurrentScene').then(currentSceneObj => {
    store.dispatch({
      type: 'UPDATE_CURRENT_SCENE',
      value: currentSceneObj
    });
  }).catch(err => console.error(err));
});

obs.on('ConnectionClosed', _err => {
  if (!reconnecting) {
    console.log('[obs-websocket] Connection closed, attempting to reconnect.');
    reconnectToOBS();
    reconnecting = true;
  }
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
  console.error('socket error:', err);
});

export function getScene() {
  return store.getState().currentScene || {};
};

export function getSceneName() {
  return getScene().name || getScene()['scene-name'];
};

const getPreviousScene = () => {
  return store.getState().previousScene || {};
};

const getPreviousSceneName = () => {
  return getPreviousScene().name || getPreviousScene()['scene-name'];
};

export function setScene(sceneName) {
  if (store.getState().studioMode) {
    obs.send('SetPreviewScene', {
        'scene-name': sceneName
      })
      .catch(err => console.error(err));
  } else {
    obs.send('SetCurrentScene', {
        'scene-name': sceneName
      })
      .catch(err => console.error(err));
  }
};

export function setPreviousScene() {
  setScene(getPreviousSceneName());
};

export function toggleSceneItem(sceneName, sceneItemName) {
  obs.send('GetSceneItemProperties', {
    'scene-name': sceneName,
    item: sceneItemName,
  }).then(resp => {
    obs.send('SetSceneItemProperties', {
      item: sceneItemName,
      visible: !resp.visible,
      'scene-name': sceneName,
    });
  });
};

export default {
  obs,
  getScene,
  getSceneName,
  setScene,
  toggleSceneItem,
  setPreviousScene,
};
