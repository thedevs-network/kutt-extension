import React, { useEffect, useState } from 'react';

import { UserSettingsResponseProperties, DomainEntryProperties } from '../Background';
import { getExtensionSettings } from '../util/settings';
import BodyWrapper from '../components/BodyWrapper';
import Loader from '../components/Loader';
import PopupForm from './PopupForm';
import PopupHeader from './Header';

import './styles.scss';

export type DomainOptionsProperties = {
    option: string;
    value: string;
    id: string;
    disabled: boolean;
};

const Popup: React.FC = () => {
    const [domainOptions, setDomainOptions] = useState<DomainOptionsProperties[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect((): void => {
        async function getUserSettings(): Promise<void> {
            const { settings = {} } = await getExtensionSettings();

            if (Object.prototype.hasOwnProperty.call(settings, 'user')) {
                if (settings.user) {
                    const { user }: { user: UserSettingsResponseProperties } = settings;

                    let optionsArray: DomainOptionsProperties[] = user.domains.map(
                        ({ id, address, homepage, banned }) => {
                            return {
                                id,
                                option: homepage,
                                value: address,
                                disabled: banned,
                            };
                        }
                    );

                    // ToDo: change kutt.it entry to custom host(if exist)
                    const defaultOptions = [
                        {
                            id: '',
                            option: '-- Choose Domain --',
                            value: '',
                            disabled: true,
                        },
                        {
                            id: 'default',
                            option: 'kutt.it',
                            value: 'https://kutt.it',
                            disabled: false,
                        },
                    ];

                    // merge to beginning of array
                    optionsArray = defaultOptions.concat(optionsArray);

                    setDomainOptions(optionsArray);
                }

                // ToDo: Handle no-user state
            }

            // ToDo: handle init operations
            setLoading(false);
        }

        getUserSettings();
    }, []);

    return (
        <BodyWrapper>
            <div id="popup">
                {!loading ? (
                    <>
                        <PopupHeader />
                        <PopupForm domainOptions={domainOptions} defaultDomainId="default" />
                    </>
                ) : (
                    <Loader />
                )}
            </div>
        </BodyWrapper>
    );
};

export default Popup;
