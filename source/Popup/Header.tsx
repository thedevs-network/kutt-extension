import {isNull, EMPTY_STRING} from '@abhijithvijayan/ts-utils';
import React, {useState} from 'react';
import tw, {styled} from 'twin.macro';

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

const StyledIcon = styled(Icon)`
  ${tw`hover:opacity-75 bg-transparent shadow-none`}

  color: rgb(187, 187, 187);
`;

const Header: React.FC = () => {
  const [extensionSettingsState, extensionSettingsDispatch] =
    useExtensionSettings();
  const [loading, setLoading] = useState<boolean>(false);
  const [errored, setErrored] = useState<ErrorStateProperties>({
    error: null,
    message: EMPTY_STRING,
  });

  async function fetchUserDomains(): Promise<void> {
    // show loading spinner
    setLoading(true);

    const apiKeyValidationBody: AuthRequestBodyProperties = {
      apikey: extensionSettingsState.apikey,
      hostUrl: extensionSettingsState.host.hostUrl,
    };

    // request API
    const response: SuccessfulApiKeyCheckProperties | ApiErroredProperties =
      await messageUtil.send(CHECK_API_KEY, apiKeyValidationBody);

    // stop spinner
    setLoading(false);

    if (!response.error) {
      // ---- success ---- //
      setErrored({error: false, message: 'Fetching domains successful'});

      // Store user account information
      const {domains, email} = response.data;
      await updateExtensionSettings({user: {domains, email}});
    } else {
      // ---- errored ---- //
      setErrored({error: true, message: response.message});

      // Delete `user` field from settings
      await updateExtensionSettings({user: null});
    }

    // hot reload page(read from localstorage and update state)
    extensionSettingsDispatch({
      type: ExtensionSettingsActionTypes.RELOAD_EXTENSION_SETTINGS,
      payload: !extensionSettingsState.reload,
    });

    setTimeout(() => {
      // Reset status
      setErrored({error: null, message: EMPTY_STRING});
    }, 1000);
  }

  const iconToShow = loading
    ? 'spinner'
    : (!isNull(errored.error) && (!errored.error ? 'tick' : 'cross')) ||
      'refresh';

  return (
    <>
      <header tw="flex items-center justify-between p-4 select-none">
        <div>
          <img
            tw="w-8 h-8"
            width="32"
            height="32"
            src="assets/logo.png"
            alt="logo"
          />
        </div>

        <div tw="flex">
          <StyledIcon
            onClick={fetchUserDomains}
            name={iconToShow}
            title="Refresh"
            className="icon"
          />
          {extensionSettingsState.history && (
            <StyledIcon
              onClick={openHistoryPage}
              name="clock"
              className="icon"
              title="History"
            />
          )}
          <StyledIcon
            onClick={openExtOptionsPage}
            name="settings"
            className="icon"
            title="Settings"
          />
        </div>
      </header>
    </>
  );
};

export default Header;
