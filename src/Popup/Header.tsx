import React from 'react';

import Icon from '../components/Icon';
import messageUtil from '../util/mesageUtil';
import { UserConfigProperties } from './Popup';
import { openExtOptionsPage } from '../util/tabs';
import { CHECK_API_KEY } from '../Background/constants';
import { updateExtensionSettings } from '../util/settings';
import { SuccessfulApiKeyCheckProperties, ApiErroredProperties } from '../Background';

async function fetchUserDomains({ apikey }: UserConfigProperties, setLoading: SetLoadingProperties): Promise<void> {
    // show loading screen
    setLoading(true);

    // request API
    const response: SuccessfulApiKeyCheckProperties | ApiErroredProperties = await messageUtil.send(CHECK_API_KEY, {
        apikey,
    });

    if (!response.error) {
        // ---- success ---- //
        // ToDo: Change refresh button to Tick icon

        // Store user account information
        const { domains, email } = response.data;
        await updateExtensionSettings({ user: { domains, email } });
    } else {
        // ---- errored ---- //
        console.log(response.message);

        // Delete `user` field from settings
        await updateExtensionSettings({ user: null });
    }

    setLoading(false);
}

type SetLoadingProperties = React.Dispatch<React.SetStateAction<boolean>>;

type HeaderProperties = {
    userConfig: UserConfigProperties;
    setLoading: SetLoadingProperties;
};

const Header: React.FC<HeaderProperties> = ({ userConfig, setLoading }) => {
    return (
        <>
            <header id="header">
                <div className="logo__holder">
                    <img src="assets/logo.png" alt="logo" style={{ width: '22px', height: '22px' }} />
                </div>
                <div className="action__buttons--holder">
                    <button
                        type="button"
                        className="icon"
                        onClick={(): Promise<void> => {
                            return fetchUserDomains(userConfig, setLoading);
                        }}
                    >
                        <Icon name="refresh" />
                    </button>
                    <button type="button" className="icon" onClick={openExtOptionsPage}>
                        <Icon name="settings" />
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;
