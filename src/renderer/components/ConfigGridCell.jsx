import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { useStoreActions, useStoreState } from 'easy-peasy';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { getButtonAtIndex } from '../model';

const useStyles = makeStyles(_theme => ({
  cell: {
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '72px',
    height: '72px'
  }
}));

const ConfigGridCell = ({ col, row }) => {
  const classes = useStyles();
  const state = useStoreState(st => st);
  const setCurrentIndex = useStoreActions(actions => actions.setCurrentIndex);

  col = col || 1;
  row = row || 1;

  const currentIndex = `${col},${row}`;

  return (
    <Grid item xs={2} onClick={() => setCurrentIndex(currentIndex)}>
      <Paper className={classes.cell}>{get(getButtonAtIndex(state, currentIndex), 'name')}</Paper>
    </Grid>
  );
};

ConfigGridCell.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired
};

export default ConfigGridCell;
