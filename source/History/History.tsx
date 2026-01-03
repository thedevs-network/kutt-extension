import type {JSX} from 'react';
import {useEffect, useState} from 'react';

import {
  useShortenedLinks,
  ShortenedLinksActionTypes,
} from '../contexts/shortened-links-context';
import {
  HostProperties,
  useExtensionSettings,
} from '../contexts/extension-settings-context';
import {
  useRequestStatus,
  RequestStatusActionTypes,
} from '../contexts/request-status-context';
import messageUtil from '../util/mesageUtil';
import {FETCH_URLS_HISTORY} from '../Background/constants';
import {getExtensionSettings} from '../util/settings';
import {
  SuccessfulUrlsHistoryFetchProperties,
  AuthRequestBodyProperties,
  ApiErroredProperties,
  ErrorStateProperties,
  Kutt,
} from '../Background';
import {isValidUrl} from '../util/link';

import BodyWrapper from '../components/BodyWrapper';
import Loader from '../components/Loader';
import Header from '../Options/Header';
import Table from './Table';

import styles from './History.module.scss';

function History(): JSX.Element {
  const [, shortenedLinksDispatch] = useShortenedLinks();
  const [, extensionSettingsDispatch] = useExtensionSettings();
  const [requestStatusState, requestStatusDispatch] = useRequestStatus();
  const [errored, setErrored] = useState<ErrorStateProperties>({
    error: null,
    message: '',
  });
  const [hostUrl, setHostUrl] = useState<string>(Kutt.hostUrl);

  useEffect(() => {
    async function getUrlsHistoryStats(): Promise<void> {
      // ********************************* //
      // **** GET EXTENSIONS SETTINGS **** //
      // ********************************* //
      const {settings = {}} = await getExtensionSettings();
      const advancedSettings: boolean =
        (settings?.advanced as boolean) || false;

      const defaultHost: HostProperties =
        (advancedSettings &&
          (settings?.host as string) &&
          isValidUrl(settings.host as string) && {
            hostDomain:
              (settings.host as string)
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
      };

      setHostUrl(defaultExtensionConfig.host.hostUrl);

      // extensionSettingsDispatch({
      //   type: ExtensionSettingsActionTypes.HYDRATE_EXTENSION_SETTINGS,
      //   payload: defaultExtensionConfig,
      // });

      if (defaultExtensionConfig.history) {
        // ****************************************************** //
        // **************** FETCH URLS HISTORY ****************** //
        // ****************************************************** //
        const urlsHistoryFetchRequetBody: AuthRequestBodyProperties = {
          apikey: defaultExtensionConfig.apikey,
          hostUrl: defaultExtensionConfig.host.hostUrl,
        };

        // call api
        const response:
          | SuccessfulUrlsHistoryFetchProperties
          | ApiErroredProperties = await messageUtil.send(
          FETCH_URLS_HISTORY,
          urlsHistoryFetchRequetBody
        );

        if (!response.error) {
          setErrored({error: false, message: 'Fetch successful'});

          shortenedLinksDispatch({
            type: ShortenedLinksActionTypes.HYDRATE_SHORTENED_LINKS,
            payload: {
              items: response.data.data,
              total: response.data.total,
            },
          });
        } else {
          setErrored({error: true, message: response.message});
        }
      } else {
        setErrored({
          error: true,
          message: 'History page disabled. Please enable it from settings.',
        });
      }

      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_LOADING,
        payload: false,
      });
    }

    getUrlsHistoryStats();
  }, [
    extensionSettingsDispatch,
    requestStatusDispatch,
    shortenedLinksDispatch,
  ]);

  return (
    <BodyWrapper>
      <div id="history" className={styles.historyPage}>
        <div className={styles.historyContent}>
          <Header subtitle="Recent Links" hostUrl={hostUrl} />

          {}
          {!requestStatusState.loading ? (
            !errored.error ? (
              <Table />
            ) : (
              <h2 className={styles.errorMessage}>{errored.message}</h2>
            )
          ) : (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}
        </div>
      </div>
    </BodyWrapper>
  );
}

export default History;
