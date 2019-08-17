import electron, { webContents } from 'electron';
import path from 'path';
import fs from 'fs';

function parseDataFile(filePath, defaults) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
  try {
    console.log(filePath);
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

class ConfigFile {
  constructor(
    opts = {
      configName: 'layout'
    }
  ) {
    console.log('setting opts to', opts);
    this.opts = opts;
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, `${opts.configName}.json`);
  }

  load() {
    console.log('opts is', this.opts, this);
    this.data = parseDataFile(this.path, this.opts.defaults);

    if (this.data === this.opts.defaults) {
      // eslint-disable-line eqeqeq
      this.data = parseDataFile(path.join(__dirname, '..', '..', 'assets', 'default-layout.json'));
    }

    this.sendToAllRenderers();
    return this;
  }

  // This will just return the property on the `data` object
  get(key = null) {
    if (key) return this.data[key];

    return this.data;
  }

  // ...and this will set it
  set(key, val) {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  sendToRenderer(wc) {
    wc.send('config_loaded', {
      data: this.data
    });
  }

  sendToAllRenderers() {
    webContents.getAllWebContents().forEach(wc => {
      this.sendToRenderer(wc);
    });
  }
}

// expose the class
export default ConfigFile;
