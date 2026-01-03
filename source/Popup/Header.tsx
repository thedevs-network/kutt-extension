import {isNull, EMPTY_STRING} from '@abhijithvijayan/ts-utils';
import {useState} from 'react';
import clsx from 'clsx';

import {openExtOptionsPage, openHistoryPage} from '../util/tabs';
import {updateExtensionSettings} from '../util/settings';
import {CHECK_API_KEY} from '../Background/constants';
import {
  ExtensionSettingsActionTypes,
  useExtensionSettings,
} from '../contexts/extension-settings-context';
import messageUtil from '../util/mesageUtil';
import {
  SuccessfulApiKeyCheckProperties,
  AuthRequestBodyProperties,
  ApiErroredProperties,
  ErrorStateProperties,
} from '../Background';

import Icon from '../components/Icon';
import styles from './Header.module.scss';

function Header() {
  const [extensionSettingsState, extensionSettingsDispatch] =
    useExtensionSettings();
  const [loading, setLoading] = useState<boolean>(false);
  const [errored, setErrored] = useState<ErrorStateProperties>({
    error: null,
    message: EMPTY_STRING,
  });

  async function fetchUserDomains(): Promise<void> {
    setLoading(true);

    const apiKeyValidationBody: AuthRequestBodyProperties = {
      apikey: extensionSettingsState.apikey,
      hostUrl: extensionSettingsState.host.hostUrl,
    };

    const response: SuccessfulApiKeyCheckProperties | ApiErroredProperties =
      await messageUtil.send(CHECK_API_KEY, apiKeyValidationBody);

    setLoading(false);

    if (!response.error) {
      setErrored({error: false, message: 'Fetching domains successful'});
      const {domains, email} = response.data;
      await updateExtensionSettings({user: {domains, email}});
    } else {
      setErrored({error: true, message: response.message});
      await updateExtensionSettings({user: null});
    }

    extensionSettingsDispatch({
      type: ExtensionSettingsActionTypes.RELOAD_EXTENSION_SETTINGS,
      payload: !extensionSettingsState.reload,
    });

    setTimeout(() => {
      setErrored({error: null, message: EMPTY_STRING});
    }, 1000);
  }

  const iconToShow = loading
    ? 'spinner'
    : (!isNull(errored.error) && (!errored.error ? 'tick' : 'cross')) ||
      'refresh';

  return (
    <header className={styles.header}>
      <a
        href={extensionSettingsState.host.hostUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logoLink}
      >
        <img
          className={styles.logo}
          width="32"
          height="32"
          src="../assets/logo.png"
          alt="logo"
        />
      </a>

      <div className={styles.actions}>
        <Icon
          onClick={fetchUserDomains}
          name={iconToShow}
          title="Refresh"
          className={clsx('icon', styles.styledIcon)}
        />
        {extensionSettingsState.history && (
          <Icon
            onClick={openHistoryPage}
            name="clock"
            className={clsx('icon', styles.styledIcon)}
            title="History"
          />
        )}
        <Icon
          onClick={openExtOptionsPage}
          name="settings"
          className={clsx('icon', styles.styledIcon)}
          title="Settings"
        />
      </div>
    </header>
  );
}

export default Header;
