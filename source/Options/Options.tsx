import {useEffect, useState} from 'react';

import {getExtensionSettings} from '../util/settings';
import {
  HostProperties,
  useExtensionSettings,
  ExtensionSettingsActionTypes,
} from '../contexts/extension-settings-context';
import {
  useRequestStatus,
  RequestStatusActionTypes,
} from '../contexts/request-status-context';
import {isValidUrl} from '../util/link';
import {Kutt} from '../Background';

import BodyWrapper from '../components/BodyWrapper';
import Loader from '../components/Loader';
import Header from './Header';
import Footer from './Footer';
import Form from './Form';

import styles from './Options.module.scss';

function Options() {
  const [, extensionSettingsDispatch] = useExtensionSettings();
  const [requestStatusState, requestStatusDispatch] = useRequestStatus();
  const [hostUrl, setHostUrl] = useState<string>(Kutt.hostUrl);

  useEffect(() => {
    async function getSavedSettings(): Promise<void> {
      const {settings = {}} = await getExtensionSettings();
      const advancedSettings: boolean =
        (settings?.advanced as boolean) || false;

      const defaultHost: HostProperties =
        (advancedSettings &&
          (settings?.host as string) &&
          isValidUrl(settings.host as string) && {
            hostDomain: (settings.host as string)
              .replace('http://', '')
              .replace('https://', '')
              .replace('www.', '')
              .split(/[/?#]/)[0] || '', // extract domain
            hostUrl: (settings.host as string).endsWith('/')
              ? (settings.host as string).slice(0, -1)
              : (settings.host as string), // slice `/` at the end
          }) ||
        Kutt;

      // inject existing keys (if field doesn't exist, use default)
      const defaultExtensionConfig = {
        apikey: (settings?.apikey as string)?.trim() || '',
        history: (settings?.history as boolean) || false,
        advanced:
          defaultHost.hostUrl.trim() !== Kutt.hostUrl && advancedSettings, // disable `advanced` if customhost is not set
        host: defaultHost,
        reuse: (settings?.reuse as boolean) || false,
      };

      setHostUrl(defaultExtensionConfig.host.hostUrl);

      extensionSettingsDispatch({
        type: ExtensionSettingsActionTypes.HYDRATE_EXTENSION_SETTINGS,
        payload: defaultExtensionConfig,
      });
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_LOADING,
        payload: false,
      });
    }

    getSavedSettings();
  }, [extensionSettingsDispatch, requestStatusDispatch]);

  return (
    <>
      <BodyWrapper>
        <div id="options" className={styles.optionsPage}>
          <div className={styles.optionsContainer}>
            <Header hostUrl={hostUrl} />

            {!requestStatusState.loading ? (
              <Form />
            ) : (
              <div className={styles.loaderContainer}>
                <Loader />
              </div>
            )}

            <Footer />
          </div>
        </div>
      </BodyWrapper>
    </>
  );
}

export default Options;
