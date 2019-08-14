import { app, BrowserWindow, Tray, Menu } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

import * as path from 'path';

// import { state } from './main/state';
import { load } from './main/layouts';

load();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode)
  enableLiveReload({
    strategy: 'react-hmr'
  });

let tray = null;

const createMainWindow = async () => {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 1280,
    height: 720
  });

  // and load the index.html of the app.
  window.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    window.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  window.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  return window;
};

function createTray() {
  tray = new Tray(path.join(__dirname, '..', 'assets', 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click() {
        createMainWindow();
      }
    },
    {
      label: 'Reload Configuration',
      click() {
        load();
      }
    },
    {
      label: 'Exit',
      click() {
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Deckish');
  tray.setContextMenu(contextMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createTray();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    mainWindow = await createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
