import React, { useEffect } from 'react';
import { get } from 'lodash';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';

import ConfigGrid from './components/ConfigGrid';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const theme = createMuiTheme({});

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

require('devtron').install();

export default props => {
  const classes = useStyles();

  useEffect(() => {
    const configLoadedHandler = (evt, arg) => {
      console.log('data', get(arg, 'data', {}));
    };

    ipcRenderer.on('config_loaded', configLoadedHandler);
    ipcRenderer.send('settings_ready');

    return () => {
      ipcRenderer.removeListener('config_loaded', configLoadedHandler);
    };
  }, []);

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <ConfigGrid />
          </Paper>
        </main>
      </ThemeProvider>
    </React.Fragment>
  );
};
