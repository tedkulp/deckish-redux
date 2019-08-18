import React from 'react';

import Grid from '@material-ui/core/Grid';
import ConfigGridRow from './ConfigGridRow';

export default () => {
  return (
    <Grid container spacing={3}>
      <ConfigGridRow row={1} />
      <ConfigGridRow row={2} />
      <ConfigGridRow row={3} />
    </Grid>
  );
};
