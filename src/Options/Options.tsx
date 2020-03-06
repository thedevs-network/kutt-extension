import React, { useEffect, useState } from 'react';

import { getExtensionSettings } from '../util/settings';
import BodyWrapper from '../components/BodyWrapper';
import Loader from '../components/Loader';
import OptionsForm, { OptionsFormValuesProperties } from './OptionsForm';

const Options: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [defaultValues, setDefaultValues] = useState<OptionsFormValuesProperties>({
        apikey: '',
        autocopy: true,
        history: false,
        advanced: false,
        customhost: '',
    });

    useEffect(() => {
        async function getSavedSettings(): Promise<void> {
            const { settings = {} } = await getExtensionSettings();
            const customHost: string = settings.customhost || defaultValues.customhost;
            const advancedSettings: boolean = settings.advanced || defaultValues.advanced;

            // inject existing keys (if field doesn't exist, use default)
            const defaultFormValues: OptionsFormValuesProperties = {
                apikey: settings.apikey || defaultValues.apikey,
                autocopy: Object.prototype.hasOwnProperty.call(settings, 'autocopy')
                    ? settings.autocopy
                    : defaultValues.autocopy,
                history: Object.prototype.hasOwnProperty.call(settings, 'history')
                    ? settings.history
                    : defaultValues.history,
                advanced: customHost.trim().length > 0 ? advancedSettings : defaultValues.advanced, // disable `advance` if customhost is not set
                customhost: advancedSettings === true ? customHost : defaultValues.customhost, // drop customhost value if `advanced` is false
            };

            setDefaultValues(defaultFormValues);
            setLoading(false);
        }

        getSavedSettings();
    }, [
        defaultValues.apikey,
        defaultValues.autocopy,
        defaultValues.history,
        defaultValues.advanced,
        defaultValues.customhost,
    ]); // dependencies

    return (
        <BodyWrapper>
            <div id="options">{!loading ? <OptionsForm defaultValues={defaultValues} /> : <Loader />}</div>
        </BodyWrapper>
    );
};

export default Options;
