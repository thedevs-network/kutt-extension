import React, {useEffect} from 'react';
import tw, {css} from 'twin.macro';

import {openExtOptionsPage, isValidUrl} from '../util/tabs';
import {Kutt, UserSettingsResponseProperties} from '../Background';

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
import ResponseBody from './ResponseBody';
import PopupHeader from './Header';
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
      // ----- Ref: https://github.com/thedevs-network/kutt-extension/issues/78 ----- //
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

      if ((key as string).trim().length > 0) {
        // map it to `settings.apikey`
        migrationSettings.apikey = key;
        performMigration = true;
      }
      if (
        (host as string).trim().length > 0 &&
        (userOptions.devMode as boolean)
      ) {
        // map `host` to `settings.host`
        migrationSettings.host = host;
        // set `advanced` to true
        migrationSettings.advanced = true;
        performMigration = true;
      }
      if (userOptions.keepHistory as boolean) {
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
        (settings.apikey as string) === ''
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
        (settings.advanced as boolean)
      ) {
        // If `host` field is set
        if (
          Object.prototype.hasOwnProperty.call(settings, 'host') &&
          (settings.host as string)?.trim().length > 0 &&
          isValidUrl(settings.host as string)
        ) {
          defaultHost = {
            hostDomain: (settings.host as string)
              .replace('http://', '')
              .replace('https://', '')
              .replace('www.', '')
              .split(/[/?#]/)[0], // extract domain
            hostUrl: (settings.host as string).endsWith('/')
              ? (settings.host as string).slice(0, -1)
              : (settings.host as string), // slice `/` at the end
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
      <div
        id="popup"
        css={[
          tw`text-lg`,
          css`
            min-height: 350px;
            min-width: 270px;
          `,
        ]}
      >
        {!requestStatusState.loading ? (
          <>
            <PopupHeader />
            {requestStatusState.error !== null && <ResponseBody />}
            <Form />
          </>
        ) : (
          <Loader />
        )}
      </div>
    </BodyWrapper>
  );
};

export default Popup;
