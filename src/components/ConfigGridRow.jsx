import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import ConfigGridCell from './ConfigGridCell';
import GridEmptySpace from './GridEmptySpace';

const ConfigGridRow = props => {
  const row = props.row || 1;

  return (
    <Grid item xs={12} container spacing={3}>
      <GridEmptySpace xs={1} />
      <ConfigGridCell col={1} row={row} />
      <ConfigGridCell col={2} row={row} />
      <ConfigGridCell col={3} row={row} />
      <ConfigGridCell col={4} row={row} />
      <ConfigGridCell col={5} row={row} />
      <GridEmptySpace xs={1} />
    </Grid>
  );
};

ConfigGridRow.propTypes = {
  row: PropTypes.number
};

export default ConfigGridRow;
