import {ThemeProvider} from 'styled-components';
import React from 'react';
import ReactDOM from 'react-dom';

// Common styles
import '../styles/main.scss';

import {ExtensionSettingsProvider} from '../contexts/extension-settings-context';
import {RequestStatusProvider} from '../contexts/request-status-context';
import Popup from './Popup';

// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved,  @typescript-eslint/no-var-requires, node/no-missing-require
const theme = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/base/_variables.scss');
// Require sass variables using sass-extract-loader and specify the plugin

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ExtensionSettingsProvider>
      <RequestStatusProvider>
        <Popup />
      </RequestStatusProvider>
    </ExtensionSettingsProvider>
  </ThemeProvider>,
  document.getElementById('popup-root')
);
