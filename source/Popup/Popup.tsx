import React, {useEffect} from 'react';

import {openExtOptionsPage, getCurrentTab, isValidUrl} from '../util/tabs';
import {
  Kutt,
  SuccessfulShortenStatusProperties,
  UserSettingsResponseProperties,
  ShortUrlActionBodyProperties,
  ApiErroredProperties,
  ApiBodyProperties,
} from '../Background';
import {SHORTEN_URL} from '../Background/constants';
import messageUtil from '../util/mesageUtil';

import ResponseBody from './ResponseBody';
import PopupHeader from './Header';

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
import {
  getExtensionSettings,
  getPreviousSettings,
  migrateSettings,
} from '../util/settings';

import BodyWrapper from '../components/BodyWrapper';
import Loader from '../components/Loader';
import Form, {CONSTANTS} from './Form';

const Popup: React.FC = () => {
  const [
    extensionSettingsState,
    extensionSettingsDispatch,
  ] = useExtensionSettings();
  const [requestStatusState, requestStatusDispatch] = useRequestStatus();
  const {reload: liveReloadFlag} = extensionSettingsState;

  // re-renders on `liveReloadFlag` change
  useEffect((): void => {
    async function getUserSettings(): Promise<void> {
      // -----------------------------------------------------------------------------//
      // -----------------------------------------------------------------------------//
      // -----            // ToDo: remove in next major release //              ----- //
      // ----- Ref: https://github.com/abhijithvijayan/kutt-extension/issues/78 ----- //
      // -----------------------------------------------------------------------------//
      // -----------------------------------------------------------------------------//

      const {
        // old keys from extension v3.x.x
        key = '',
        host = '',
        userOptions = {
          autoCopy: false,
          devMode: false,
          keepHistory: false,
          pwdForUrls: false,
        },
      } = await getPreviousSettings();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const migrationSettings: any = {};
      let performMigration = false;

      if (key.trim().length > 0) {
        // map it to `settings.apikey`
        migrationSettings.apikey = key;
        performMigration = true;
      }
      if (host.trim().length > 0 && userOptions.devMode) {
        // map `host` to `settings.customhost`
        migrationSettings.customhost = host;
        // set `advanced` to true
        migrationSettings.advanced = true;
        performMigration = true;
      }
      if (userOptions.keepHistory) {
        // set `settings.history` to true
        migrationSettings.history = true;
        performMigration = true;
      }
      if (performMigration) {
        // perform migration
        await migrateSettings(migrationSettings);
      }

      // -----------------------------------------------------------------------------//
      // -----------------------------------------------------------------------------//
      // -----------------------------------------------------------------------------//
      // -----------------------------------------------------------------------------//
      // -----------------------------------------------------------------------------//
      // -----------------------------------------------------------------------------//

      // ToDo: set types: refer https://kutt.it/jITyIU
      const {settings = {}} = await getExtensionSettings();

      // No API Key set
      if (
        !Object.prototype.hasOwnProperty.call(settings, 'apikey') ||
        settings.apikey === ''
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
        setTimeout(() => {
          return openExtOptionsPage();
        }, 1300);

        return;
      }

      let defaultHost: HostProperties = Kutt;

      // If `advanced` field is true
      if (
        Object.prototype.hasOwnProperty.call(settings, 'advanced') &&
        settings.advanced
      ) {
        // If `customhost` field is set
        if (
          Object.prototype.hasOwnProperty.call(settings, 'customhost') &&
          settings.customhost.trim().length > 0 &&
          isValidUrl(settings.customhost)
        ) {
          defaultHost = {
            hostDomain: settings.customhost
              .replace('http://', '')
              .replace('https://', '')
              .replace('www.', '')
              .split(/[/?#]/)[0], // extract domain
            hostUrl: settings.customhost.endsWith('/')
              ? settings.customhost.slice(0, -1)
              : settings.customhost, // slice `/` at the end
          };
        }
      }

      // options menu
      const defaultOptions: DomainOptionsProperties[] = [
        {
          id: '',
          option: '-- Choose Domain --',
          value: '',
          disabled: true,
        },
        {
          id: CONSTANTS.DefaultDomainId,
          option: defaultHost.hostDomain,
          value: defaultHost.hostUrl,
          disabled: false,
        },
      ];

      // `user` & `apikey` fields exist on storage
      if (
        Object.prototype.hasOwnProperty.call(settings, 'user') &&
        settings.user
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
          type: ExtensionSettingsActionTypes.SET_EXTENSION_SETTINGS,
          payload: {
            apikey: settings.apikey.trim(),
            domainOptions: optionsList,
            host: defaultHost,
          },
        });
      } else {
        // no `user` but `apikey` exist on storage
        extensionSettingsDispatch({
          type: ExtensionSettingsActionTypes.SET_EXTENSION_SETTINGS,
          payload: {
            apikey: settings.apikey.trim(),
            domainOptions: defaultOptions,
            host: defaultHost,
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

  async function handleFormSubmit({
    customurl,
    password,
  }: {
    domain: string;
    customurl: string;
    password: string;
  }): Promise<void> {
    // enable loading screen
    requestStatusDispatch({
      type: RequestStatusActionTypes.SET_LOADING,
      payload: true,
    });

    // Get target link to shorten
    const tabs = await getCurrentTab();
    const target: string | null = (tabs.length > 0 && tabs[0].url) || null;

    if (!target || !isValidUrl(target)) {
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_LOADING,
        payload: false,
      });

      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_REQUEST_STATUS,
        payload: {
          error: true,
          message: 'Not a valid URL',
        },
      });

      return;
    }

    const apiBody: ApiBodyProperties = {
      apikey: extensionSettingsState.apikey,
      target,
      ...(customurl.trim() !== '' && {customurl: customurl.trim()}), // add this key only if field is not empty
      ...(password.trim() !== '' && {password: password.trim()}),
      reuse: false,
      // ToDo: restore when https://github.com/thedevs-network/kutt/issues/287 is resolved
      // ...(domain.trim() !== '' && { domain: domain.trim() }),
    };

    const apiShortenUrlBody: ShortUrlActionBodyProperties = {
      apiBody,
      hostUrl: extensionSettingsState.host.hostUrl,
    };
    // shorten url in the background
    const response:
      | SuccessfulShortenStatusProperties
      | ApiErroredProperties = await messageUtil.send(
      SHORTEN_URL,
      apiShortenUrlBody
    );

    // disable spinner
    requestStatusDispatch({
      type: RequestStatusActionTypes.SET_LOADING,
      payload: false,
    });

    if (!response.error) {
      const {
        data: {link},
      } = response;
      const trimmedLink: string = link.replace('https://', '');

      // show shortened url
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_REQUEST_STATUS,
        payload: {
          error: false,
          message: trimmedLink,
        },
      });
    } else {
      // errored
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_REQUEST_STATUS,
        payload: {
          error: true,
          message: response.message,
        },
      });
    }
  }

  return (
    <BodyWrapper>
      <div id="popup">
        {!requestStatusState.loading ? (
          <>
            <PopupHeader />
            {requestStatusState.error !== null && <ResponseBody />}
            <Form handleFormSubmit={handleFormSubmit} />
          </>
        ) : (
          <Loader />
        )}
      </div>
    </BodyWrapper>
  );
};

export default Popup;
