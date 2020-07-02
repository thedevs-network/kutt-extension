import {ThemeProvider} from 'styled-components';
import ReactDOM from 'react-dom';
import React from 'react';

// Common styles
import '../styles/main.scss';

import Options from './Options';

// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved,  @typescript-eslint/no-var-requires
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/base/_variables.scss');
// Require sass variables using sass-extract-loader and specify the plugin

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Options />
  </ThemeProvider>,
  document.getElementById('options-root')
);
