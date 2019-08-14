import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  cell: {
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '72px',
    height: '72px'
  }
}));

const ConfigGridCell = props => {
  const classes = useStyles();

  const col = props.col || 1;
  const row = props.row || 1;

  return (
    <Grid item xs={2}>
      <Paper className={classes.cell}>
        {row},{col}
      </Paper>
    </Grid>
  );
};

ConfigGridCell.propTypes = {
  col: PropTypes.number,
  row: PropTypes.number
};

export default ConfigGridCell;
