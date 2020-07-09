import React, {useState} from 'react';
import tw, {styled} from 'twin.macro';

import {updateExtensionSettings} from '../util/settings';
import {CHECK_API_KEY} from '../Background/constants';
import {
  ExtensionSettingsActionTypes,
  useExtensionSettings,
} from '../contexts/extension-settings-context';
import {openExtOptionsPage} from '../util/tabs';
import messageUtil from '../util/mesageUtil';
import {
  SuccessfulApiKeyCheckProperties,
  GetUserSettingsBodyProperties,
  ApiErroredProperties,
  ErrorStateProperties,
} from '../Background';

import Icon from '../components/Icon';

const StyledIcon = styled(Icon)`
  ${tw`hover:opacity-75 bg-transparent shadow-none`}

  height: 34px;
  width: 34px;
  color: rgb(187, 187, 187);
`;

const Header: React.FC = () => {
  const [
    extensionSettingsState,
    extensionSettingsDispatch,
  ] = useExtensionSettings();
  const [loading, setLoading] = useState<boolean>(false);
  const [errored, setErrored] = useState<ErrorStateProperties>({
    error: null,
    message: '',
  });

  async function fetchUserDomains(): Promise<void> {
    // show loading spinner
    setLoading(true);

    const apiKeyValidationBody: GetUserSettingsBodyProperties = {
      apikey: extensionSettingsState.apikey,
      hostUrl: extensionSettingsState.host.hostUrl,
    };
    // request API
    const response:
      | SuccessfulApiKeyCheckProperties
      | ApiErroredProperties = await messageUtil.send(
      CHECK_API_KEY,
      apiKeyValidationBody
    );

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
      setErrored({error: null, message: ''});
    }, 1000);
  }

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
            className="icon"
            title="Refresh"
            name={
              loading
                ? 'spinner'
                : (errored.error !== null &&
                    ((!errored.error && 'tick') || 'cross')) ||
                  'refresh'
            }
            onClick={fetchUserDomains}
          />
          <StyledIcon
            className="icon"
            name="settings"
            title="Settings"
            onClick={openExtOptionsPage}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
