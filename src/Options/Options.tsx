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
    });

    useEffect(() => {
        async function getSavedSettings(): Promise<void> {
            const { settings = {} } = await getExtensionSettings();

            // inject existing keys (if field doesn't exist, use default)
            const defaultFormValues: OptionsFormValuesProperties = {
                apikey: settings.apikey || defaultValues.apikey,
                autocopy: Object.prototype.hasOwnProperty.call(settings, 'autocopy')
                    ? settings.autocopy
                    : defaultValues.autocopy,
                history: Object.prototype.hasOwnProperty.call(settings, 'history')
                    ? settings.history
                    : defaultValues.history,
            };

            setDefaultValues(defaultFormValues);
            setLoading(false);
        }

        getSavedSettings();
    }, [defaultValues.apikey, defaultValues.autocopy, defaultValues.history]);

    return (
        <BodyWrapper>
            <div id="options">{!loading ? <OptionsForm defaultValues={defaultValues} /> : <Loader />}</div>
        </BodyWrapper>
    );
};

export default Options;
