import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {ExtensionSettingsProvider} from '../contexts/extension-settings-context';
import {RequestStatusProvider} from '../contexts/request-status-context';
import Options from './Options';

import '../styles/main.scss';

const container = document.getElementById('options-root');
if (!container) {
  throw new Error('Could not find options-root container');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <ExtensionSettingsProvider>
      <RequestStatusProvider>
        <Options />
      </RequestStatusProvider>
    </ExtensionSettingsProvider>
  </StrictMode>
);
