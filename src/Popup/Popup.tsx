import React, {useEffect, useState} from 'react';

import PopupBody, {ProcessedRequestProperties} from './PopupBody';
import {Kutt, UserSettingsResponseProperties} from '../Background';
import {
  getExtensionSettings,
  migrateSettings,
  getPreviousSettings,
} from '../util/settings';
import BodyWrapper from '../components/BodyWrapper';
import Loader from '../components/Loader';
import PopupForm from './PopupForm';
import PopupHeader from './Header';

import './styles.scss';
import {openExtOptionsPage, isValidUrl} from '../util/tabs';

type HostProperties = {
  hostDomain: string;
  hostUrl: string;
};

type DomainOptionsProperties = {
  option: string;
  value: string;
  id: string;
  disabled: boolean;
};

export type ProcessRequestProperties = React.Dispatch<
  React.SetStateAction<{
    error: boolean | null;
    message: string;
  }>
>;

export type UserConfigProperties = {
  apikey: string;
  domainOptions: DomainOptionsProperties[];
  host: HostProperties;
};

export type SetPageReloadFlagProperties = React.Dispatch<
  React.SetStateAction<boolean>
>;

const Popup: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pageReloadFlag, setPageReloadFlag] = useState<boolean>(false);
  const [userConfig, setUserConfig] = useState<UserConfigProperties>({
    apikey: '',
    domainOptions: [],
    host: Kutt,
  });
  const [requestProcessed, setRequestProcessed] = useState<
    ProcessedRequestProperties
  >({error: null, message: ''});

  // re-renders on `pageReloadFlag` change
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
        setRequestProcessed({
          error: true,
          message: 'Extension requires an API Key to work',
        });
        setLoading(false);

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
          id: 'default',
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

        let optionsArray: DomainOptionsProperties[] = user.domains.map(
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
        optionsArray = defaultOptions.concat(optionsArray);

        // update domain list
        setUserConfig({
          apikey: settings.apikey.trim(),
          domainOptions: optionsArray,
          host: defaultHost,
        });
      } else {
        // no `user` but `apikey` exist on storage
        setUserConfig({
          apikey: settings.apikey.trim(),
          domainOptions: defaultOptions,
          host: defaultHost,
        });
      }

      setLoading(false);
    }

    getUserSettings();
  }, [pageReloadFlag]);

  return (
    <BodyWrapper>
      <div id="popup">
        {!loading ? (
          <>
            <PopupHeader
              userConfig={userConfig}
              pageReloadFlag={pageReloadFlag}
              setPageReloadFlag={setPageReloadFlag}
            />

            {requestProcessed.error !== null && (
              <PopupBody requestProcessed={requestProcessed} />
            )}

            <PopupForm
              defaultDomainId="default"
              userConfig={userConfig}
              setLoading={setLoading}
              setRequestProcessed={setRequestProcessed}
            />
          </>
        ) : (
          <Loader />
        )}
      </div>
    </BodyWrapper>
  );
};

export default Popup;
