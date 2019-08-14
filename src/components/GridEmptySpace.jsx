import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';

const HIDDEN = 'hidden';

/**
 * Hacky solution to deal with missing grid offset
 */

const useStyles = makeStyles(theme => {
  return {
    root: {
      [theme.breakpoints.up('xs')]: {
        display: p => (p.xs === HIDDEN ? 'none' : 'flex')
      },
      [theme.breakpoints.up('sm')]: {
        display: p => (p.sm === HIDDEN ? 'none' : 'flex')
      },
      [theme.breakpoints.up('md')]: {
        display: p => (p.md === HIDDEN ? 'none' : 'flex')
      },
      [theme.breakpoints.up('lg')]: {
        display: p => (p.lg === HIDDEN ? 'none' : 'flex')
      },
      [theme.breakpoints.up('xl')]: {
        display: p => (p.xl === HIDDEN ? 'none' : 'flex')
      }
    }
  };
});

const GridEmptySpace = props => {
  const classes = useStyles();
  return <Grid item {...props} classes={classes} />;
};

export default GridEmptySpace;
