import React, {useEffect} from 'react';
import 'twin.macro';

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

const Options: React.FC = () => {
  const extensionSettingsDispatch = useExtensionSettings()[1];
  const [requestStatusState, requestStatusDispatch] = useRequestStatus();

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
              .split(/[/?#]/)[0], // extract domain
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
      };

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
        <div
          id="options"
          tw="h-screen flex justify-center px-6 py-8 bg-gray-200 select-none"
        >
          <div tw="md:rounded-lg max-w-lg px-16 py-10 my-6 mx-12 bg-white">
            <Header />

            {!requestStatusState.loading ? (
              <Form />
            ) : (
              <div tw="h-64">
                <Loader />
              </div>
            )}

            <Footer />
          </div>
        </div>
      </BodyWrapper>
    </>
  );
};

export default Options;
