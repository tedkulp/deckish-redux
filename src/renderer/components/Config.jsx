import React from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { makeStyles } from '@material-ui/core/styles';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';

import ConfigGrid from './ConfigGrid';
import Drawer from './Drawer';

const useStyles = makeStyles(theme => ({
  breadcrumb: {
    // marginLeft: theme.spacing(6),
    marginBottom: theme.spacing(2)
  },
  layout: {
    // width: 'auto',
    // marginLeft: theme.spacing(2),
    // marginRight: theme.spacing(2),
    // [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
    width: 600,
    marginLeft: 'auto',
    marginRight: 'auto'
    // }
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
  const editingLayoutNames = useStoreState(state => state.editingLayoutNames);
  const setEditingLayoutNames = useStoreActions(actions => actions.setEditingLayoutNames);

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Breadcrumbs aria-label="breadcrumb" separator=">" className={classes.breadcrumb}>
            {editingLayoutNames.map((name, idx) => (
              <Button
                onClick={() => setEditingLayoutNames(editingLayoutNames.slice(0, idx + 1))}
                key={`breadcrumb-${name}`}
              >
                {name}
              </Button>
            ))}
          </Breadcrumbs>
          <ConfigGrid />
          <Drawer />
        </Paper>
      </main>
    </React.Fragment>
  );
};
