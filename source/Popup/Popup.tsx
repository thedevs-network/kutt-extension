import {isNull, EMPTY_STRING} from '@abhijithvijayan/ts-utils';
import type {JSX} from 'react';
import {useEffect} from 'react';

import {Kutt, UserSettingsResponseProperties} from '../Background';
import {openExtOptionsPage} from '../util/tabs';
import {isValidUrl} from '../util/link';

import {
  ExtensionSettingsActionTypes,
  DomainOptionsProperties,
  useExtensionSettings,
  HostProperties,
} from '../contexts/extension-settings-context';
import {
  RequestStatusActionTypes,
  useRequestStatus,
} from '../contexts/request-status-context';
import {getExtensionSettings} from '../util/settings';

import BodyWrapper from '../components/BodyWrapper';
import ResponseBody from './ResponseBody';
import PopupHeader from './Header';
import Loader from '../components/Loader';
import Form, {CONSTANTS} from './Form';

import styles from './Popup.module.scss';

function Popup(): JSX.Element {
  const [extensionSettingsState, extensionSettingsDispatch] =
    useExtensionSettings();
  const [requestStatusState, requestStatusDispatch] = useRequestStatus();
  const {reload: liveReloadFlag} = extensionSettingsState;

  // re-renders on `liveReloadFlag` change
  useEffect((): void => {
    async function getUserSettings(): Promise<void> {
      const {settings = {}} = await getExtensionSettings();

      // No API Key set
      if (
        !Object.prototype.hasOwnProperty.call(settings, 'apikey') ||
        (settings.apikey as string) === EMPTY_STRING
      ) {
        requestStatusDispatch({
          type: RequestStatusActionTypes.SET_REQUEST_STATUS,
          payload: {
            error: true,
            message: 'Extension requires an API Key to work',
          },
        });
        requestStatusDispatch({
          type: RequestStatusActionTypes.SET_LOADING,
          payload: false,
        });

        // Open options page
        setTimeout(() => openExtOptionsPage(), 1300);

        return;
      }

      let defaultHost: HostProperties = Kutt;

      // If `advanced` field is true
      if (
        Object.prototype.hasOwnProperty.call(settings, 'advanced') &&
        (settings.advanced as boolean)
      ) {
        // If `host` field is set
        if (
          Object.prototype.hasOwnProperty.call(settings, 'host') &&
          (settings.host as string)?.trim().length > 0 &&
          isValidUrl(settings.host as string)
        ) {
          defaultHost = {
            hostDomain:
              (settings.host as string)
                .replace('http://', EMPTY_STRING)
                .replace('https://', EMPTY_STRING)
                .replace('www.', EMPTY_STRING)
                .split(/[/?#]/)[0] || EMPTY_STRING,
            hostUrl: (settings.host as string).endsWith('/')
              ? (settings.host as string).slice(0, -1)
              : (settings.host as string),
          };
        }
      }

      // `history` field set - default to true for new users
      let historyEnabled = true;
      if (Object.prototype.hasOwnProperty.call(settings, 'history')) {
        historyEnabled = settings.history as boolean;
      }

      // options menu
      const defaultOptions: DomainOptionsProperties[] = [
        {
          id: EMPTY_STRING,
          option: '-- Choose Domain --',
          value: EMPTY_STRING,
          disabled: true,
        },
        {
          id: CONSTANTS.DefaultDomainId,
          option: defaultHost.hostDomain,
          value: defaultHost.hostDomain,
          disabled: false,
        },
      ];

      // `user` & `apikey` fields exist on storage
      if (
        Object.prototype.hasOwnProperty.call(settings, 'user') &&
        (settings.user as UserSettingsResponseProperties)
      ) {
        const {user}: {user: UserSettingsResponseProperties} = settings;

        let optionsList: DomainOptionsProperties[] = user.domains.map(
          ({id, address, homepage, banned}) => {
            return {
              id,
              option: homepage,
              value: address,
              disabled: banned,
            };
          }
        );

        // merge to beginning of array
        optionsList = defaultOptions.concat(optionsList);

        // update domain list
        extensionSettingsDispatch({
          type: ExtensionSettingsActionTypes.HYDRATE_EXTENSION_SETTINGS,
          payload: {
            apikey: (settings.apikey as string)?.trim(),
            domainOptions: optionsList,
            host: defaultHost,
            history: historyEnabled,
            reuse: (settings.reuse as boolean) || false,
          },
        });
      } else {
        // no `user` but `apikey` exist on storage
        extensionSettingsDispatch({
          type: ExtensionSettingsActionTypes.HYDRATE_EXTENSION_SETTINGS,
          payload: {
            apikey: (settings.apikey as string)?.trim(),
            domainOptions: defaultOptions,
            host: defaultHost,
            history: historyEnabled,
            reuse: (settings.reuse as boolean) || false,
          },
        });
      }

      // stop loader
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_LOADING,
        payload: false,
      });
    }

    getUserSettings();
  }, [liveReloadFlag, extensionSettingsDispatch, requestStatusDispatch]);

  return (
    <BodyWrapper>
      <div id="popup" className={styles.popup}>
        {!requestStatusState.loading ? (
          <>
            <PopupHeader />
            {!isNull(requestStatusState.error) && <ResponseBody />}
            <Form />
          </>
        ) : (
          <Loader />
        )}
      </div>
    </BodyWrapper>
  );
}

export default Popup;
