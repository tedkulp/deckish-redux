/* eslint-disable import/no-cycle */
import OBSWebSocket from 'obs-websocket-js';
import {
  getCurrentScene,
  getPreviousScene,
  setScene as setSceneInState,
  setPreviewScene,
  setStudioMode,
  setInitialScene,
  updateCurrentScene,
  getStudioMode,
  setScenes
} from './state';

export const obs = new OBSWebSocket();

const hostname = 'localhost:4444';
let reconnecting = false;

const reconnectToOBS = () => {
  return obs
    .connect({
      address: hostname
    })
    .then(() => {
      reconnecting = false;
    })
    .then(() => obs.send('GetStudioModeStatus'))
    .then(data => {
      setStudioMode(data.studioMode);
    })
    .then(() => obs.send('GetCurrentScene'))
    .then(data => {
      if (data['scene-name']) data.name = data['scene-name'];
      setSceneInState(data);
    })
    .then(() => obs.send('GetSceneList'))
    .then(sceneList => {
      setScenes(sceneList.scenes);
    })
    .then(() => console.log('[obs-websocket] Connected'))
    .catch(_err => {
      console.log("[obs-websocket] Can't connect, attempting to reconnect in 5 seconds.");
      setTimeout(reconnectToOBS, 5000);
    });
};

const connectToOBS = () => {
  obs
    .connect({
      address: hostname
    })
    .then(() => {
      reconnecting = false;
    })
    .then(() => obs.send('GetStudioModeStatus'))
    .then(data => {
      setStudioMode(data.studioMode);
    })
    .then(() => obs.send('GetCurrentScene'))
    .then(currentSceneObj => {
      setInitialScene(currentSceneObj);
    })
    .then(() => obs.send('GetSceneList'))
    .then(sceneList => {
      setScenes(sceneList.scenes);
    })
    .then(() => console.log('[obs-websocket] Connected'))
    .catch(_err => {
      console.log("[obs-websocket] Can't connect, attempting to reconnect in 5 seconds.");
      setTimeout(connectToOBS, 5000);
    });
};

connectToOBS();

// TODO: Add some verbose flag or something
obs.on('SwitchScenes', data => {
  if (data['scene-name']) data.name = data['scene-name'];

  setSceneInState(data);
});

obs.on('PreviewSceneChanged', data => {
  if (data['scene-name']) data.name = data['scene-name'];

  setPreviewScene(data);
});

obs.on('StudioModeSwitched', data => {
  setStudioMode(data.newState);
});

obs.on('ScenesChanged', () => {
  obs.send('GetSceneList').then(sceneList => {
    setScenes(sceneList.scenes);
  });
});

obs.on('SceneItemVisibilityChanged', data => {
  if (data['scene-name']) data.name = data['scene-name'];
  obs
    .send('GetCurrentScene')
    .then(currentSceneObj => {
      updateCurrentScene(currentSceneObj);
    })
    .catch(err => console.error(err));
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
  return getCurrentScene() || {};
}

export function getSceneName() {
  return getScene().name || getScene()['scene-name'];
}

const getPrevious = () => {
  return getPreviousScene() || {};
};

const getPreviousSceneName = () => {
  return getPrevious().name || getPrevious()['scene-name'];
};

export function setScene(sceneName) {
  if (getStudioMode()) {
    obs
      .send('SetPreviewScene', {
        'scene-name': sceneName
      })
      .catch(err => console.error(err));
  } else {
    obs
      .send('SetCurrentScene', {
        'scene-name': sceneName
      })
      .catch(err => console.error(err));
  }
}

export function setPreviousScene() {
  setScene(getPreviousSceneName());
}

export function toggleSceneItem(sceneName, sceneItemName) {
  obs
    .send('GetSceneItemProperties', {
      'scene-name': sceneName,
      item: sceneItemName
    })
    .then(resp => {
      obs
        .send('SetSceneItemProperties', {
          item: sceneItemName,
          visible: !resp.visible,
          'scene-name': sceneName
        })
        .catch(ex => {
          console.log('toggleSceneItem/SetSceneItemProperties caused error: ', ex);
        });
    })
    .catch(ex => {
      console.log('toggleSceneItem/GetSceneItemProperties caused error: ', ex);
    });
}

export function toggleStudioMode() {
  return obs.send('ToggleStudioMode').catch(ex => {
    console.log('ToggleStudioMode caused error: ', ex);
  });
}

export function transitionToProgram() {
  return obs.send('TransitionToProgram').catch(ex => {
    console.log('TransitionToProgram caused error: ', ex);
  });
}

export default {
  obs,
  getScene,
  getSceneName,
  setScene,
  toggleSceneItem,
  setPreviousScene
};
