import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

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
  const _currentIndex = useStoreState(state => state.currentIndex);
  const setCurrentIndex = useStoreActions(actions => actions.setCurrentIndex);
  // const clearCurrentIndex = useStoreActions(actions => actions.clearCurrentIndex);

  col = col || 1;
  row = row || 1;

  return (
    <Grid item xs={2} onClick={() => setCurrentIndex(`${row},${col}`)}>
      <Paper className={classes.cell}>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        {row},{col}
      </Paper>
    </Grid>
  );
};

ConfigGridCell.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired
};

export default ConfigGridCell;
