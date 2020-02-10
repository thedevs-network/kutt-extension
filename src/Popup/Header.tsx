import React, { useState } from 'react';

import Icon from '../components/Icon';
import messageUtil from '../util/mesageUtil';
import { UserConfigProperties } from './Popup';
import { openExtOptionsPage } from '../util/tabs';
import { CHECK_API_KEY } from '../Background/constants';
import { updateExtensionSettings } from '../util/settings';
import { SuccessfulApiKeyCheckProperties, ApiErroredProperties } from '../Background';

async function fetchUserDomains({
    userConfig: { apikey },
    setLoading,
    setErrored,
}: {
    userConfig: UserConfigProperties;
    setLoading: SetLoadingProperties;
    setErrored: SetErroredProperties;
}): Promise<void> {
    // show loading spinner
    setLoading(true);

    // request API
    const response: SuccessfulApiKeyCheckProperties | ApiErroredProperties = await messageUtil.send(CHECK_API_KEY, {
        apikey,
    });

    // stop spinner
    setLoading(false);

    if (!response.error) {
        // ---- success ---- //
        setErrored({ error: false, message: 'Fetching domains successful' });

        // Store user account information
        const { domains, email } = response.data;
        await updateExtensionSettings({ user: { domains, email } });
    } else {
        // ---- errored ---- //
        setErrored({ error: true, message: response.message });

        // Delete `user` field from settings
        await updateExtensionSettings({ user: null });
    }

    setTimeout(() => {
        // Reset status
        setErrored({ error: null, message: '' });
    }, 1000);
}

type SetLoadingProperties = React.Dispatch<React.SetStateAction<boolean>>;

type ErrorProperties = {
    error: boolean | null;
    message: string;
};

type SetErroredProperties = React.Dispatch<React.SetStateAction<ErrorProperties>>;

type HeaderProperties = {
    userConfig: UserConfigProperties;
};

const Header: React.FC<HeaderProperties> = ({ userConfig }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errored, setErrored] = useState<ErrorProperties>({ error: null, message: '' });

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
                            return fetchUserDomains({ userConfig, setLoading, setErrored });
                        }}
                    >
                        {/* eslint-disable no-nested-ternary */}
                        <Icon
                            name={
                                loading
                                    ? 'spinner'
                                    : errored && errored.error !== null
                                    ? (errored && !errored.error && 'tick') || 'cross'
                                    : 'refresh'
                            }
                        />
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
