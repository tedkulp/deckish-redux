import React, { useEffect } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { useStoreActions } from 'easy-peasy';

import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';

import ConfigGrid from './ConfigGrid';
import Drawer from './Drawer';

const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles(theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  }
}));

export default _props => {
  const classes = useStyles();
  const setConfigData = useStoreActions(actions => actions.setConfigData);

  useEffect(() => {
    const configLoadedHandler = (_evt, arg) => {
      setConfigData(get(arg, 'data', {}));
    };

    ipcRenderer.on('config_loaded', configLoadedHandler);
    ipcRenderer.send('settings_ready');

    return () => {
      ipcRenderer.removeListener('config_loaded', configLoadedHandler);
    };
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <ConfigGrid />
          <Drawer />
        </Paper>
      </main>
    </React.Fragment>
  );
};
