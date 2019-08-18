import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { StoreProvider } from 'easy-peasy';
import { createMuiTheme } from '@material-ui/core/styles';

import Config from './components/Config';
import { store } from './store';

const theme = createMuiTheme({});

require('devtron').install();

export default _props => {
  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <Config />
      </ThemeProvider>
    </StoreProvider>
  );
};
