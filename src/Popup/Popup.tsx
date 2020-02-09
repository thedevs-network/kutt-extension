import React, { useEffect, useState } from 'react';

import { UserSettingsResponseProperties } from '../Background';
import { getExtensionSettings } from '../util/settings';
import BodyWrapper from '../components/BodyWrapper';
import Loader from '../components/Loader';
import PopupForm from './PopupForm';
import PopupHeader from './Header';
import PopupBody, { ProcessedRequestProperties } from './PopupBody';

import './styles.scss';

export type DomainOptionsProperties = {
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

const Popup: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [domainOptions, setDomainOptions] = useState<DomainOptionsProperties[]>([]);
    const [requestProcessed, setRequestProcessed] = useState<ProcessedRequestProperties>({ error: null, message: '' });

    useEffect((): void => {
        async function getUserSettings(): Promise<void> {
            const { settings = {} } = await getExtensionSettings();
            // ToDo: change kutt.it entry to custom host(if exist)
            const defaultOptions: DomainOptionsProperties[] = [
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

            // No API Key set
            if (!Object.prototype.hasOwnProperty.call(settings, 'apikey') || settings.apikey === '') {
                setRequestProcessed({ error: true, message: 'Extension requires an API Key to work' });
                setLoading(false);

                // ToDo: Open options page after slight delay
                return;
            }

            // `user` & `apikey` fields exist on storage
            if (Object.prototype.hasOwnProperty.call(settings, 'user') && settings.user) {
                const { user }: { user: UserSettingsResponseProperties } = settings;

                let optionsArray: DomainOptionsProperties[] = user.domains.map(({ id, address, homepage, banned }) => {
                    return {
                        id,
                        option: homepage,
                        value: address,
                        disabled: banned,
                    };
                });

                // merge to beginning of array
                optionsArray = defaultOptions.concat(optionsArray);
                setDomainOptions(optionsArray);
            } else {
                // no `user` but `apikey` exist on storage
                setDomainOptions(defaultOptions);
            }

            // ToDo: handle init operations(if any)
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
                        {(requestProcessed.error !== null && (
                            <PopupBody requestProcessed={requestProcessed} setRequestProcessed={setRequestProcessed} />
                        )) || (
                            <PopupForm
                                defaultDomainId="default"
                                domainOptions={domainOptions}
                                setRequestProcessed={setRequestProcessed}
                            />
                        )}
                    </>
                ) : (
                    <Loader />
                )}
            </div>
        </BodyWrapper>
    );
};

export default Popup;
