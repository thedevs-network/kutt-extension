import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {ExtensionSettingsProvider} from '../contexts/extension-settings-context';
import {RequestStatusProvider} from '../contexts/request-status-context';
import {ShortenedLinksProvider} from '../contexts/shortened-links-context';
import History from './History';

import './styles.scss';

const container = document.getElementById('history-root');
if (!container) {
  throw new Error('Could not find history-root container');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <ExtensionSettingsProvider>
      <RequestStatusProvider>
        <ShortenedLinksProvider>
          <History />
        </ShortenedLinksProvider>
      </RequestStatusProvider>
    </ExtensionSettingsProvider>
  </StrictMode>
);
