import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {ExtensionSettingsProvider} from '../contexts/extension-settings-context';
import {RequestStatusProvider} from '../contexts/request-status-context';
import Popup from './Popup';

import '../styles/main.scss';

const container = document.getElementById('popup-root');
if (!container) {
  throw new Error('Could not find popup-root container');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <ExtensionSettingsProvider>
      <RequestStatusProvider>
        <Popup />
      </RequestStatusProvider>
    </ExtensionSettingsProvider>
  </StrictMode>
);
