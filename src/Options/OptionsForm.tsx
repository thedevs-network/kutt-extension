import React, { useState } from 'react';
import { withFormik, Field, Form, FormikBag, FormikProps, FormikErrors } from 'formik';

import Icon from '../components/Icon';
import AutoSave from '../util/autoSave';
import messageUtil from '../util/mesageUtil';
import { CHECK_API_KEY } from '../Background/constants';
import { TextField, CheckBox } from '../components/Input';
import { updateExtensionSettings } from '../util/settings';
import { SuccessfulApiKeyCheckProperties, ApiErroredProperties } from '../Background';

export type OptionsFormValuesProperties = {
    apikey: string;
    autocopy: boolean;
    history: boolean;
};

type ProcessedRequestProperties = {
    error: boolean | null;
    message: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSave = (values: OptionsFormValuesProperties): Promise<any> => {
    // should always return a Promise
    return updateExtensionSettings(values); // update local settings
};

// Note: The default key-value pairs are not saved to storage without any first interaction
const InnerForm: React.FC<FormikProps<OptionsFormValuesProperties>> = props => {
    // ToDo: Replace `Saving` text with Spinning Loader
    const { isSubmitting, handleSubmit } = props;

    return (
        <Form onSubmit={handleSubmit} autoComplete="off" id="options__form">
            <div>
                <Field name="apikey" type="password" component={TextField} label="API Key" />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Icon name="spinner" /> : 'Validate'}
                </button>
            </div>
            <div>
                <Field name="autocopy" component={CheckBox} label="Auto Copy URL to Clipboard" />
            </div>
            <div>
                <Field name="history" component={CheckBox} label="Keep URLs History" />
            </div>
            <AutoSave
                onSave={onSave}
                render={({ isSaving }: { isSaving: boolean }): string | null => {
                    return isSaving ? 'Saving' : null;
                }}
            />
        </Form>
    );
};

// The type of props `OptionsForm` receives
type OptionsFormProperties = {
    defaultValues: OptionsFormValuesProperties;
};

// Wrap our form with the withFormik HoC
const OptionsForm = withFormik<OptionsFormProperties, OptionsFormValuesProperties>({
    // Transform outer props into form values
    mapPropsToValues: ({ defaultValues: { apikey, autocopy, history } }): OptionsFormValuesProperties => {
        return {
            apikey,
            autocopy,
            history,
        };
    },

    validate: (values: OptionsFormValuesProperties): FormikErrors<OptionsFormValuesProperties> => {
        const errors: FormikErrors<OptionsFormValuesProperties> = {};

        if (!values.apikey) {
            errors.apikey = 'API key missing';
        }
        // ToDo: restore before on production
        // else if (values.apikey && values.apikey.trim().length < 40) {
        //     errors.apikey = 'API key must be 40 characters';
        // } else if (values.apikey && values.apikey.trim().length > 40) {
        //     errors.apikey = 'API key cannot exceed 40 characters';
        // }

        return errors;
    },

    // for API Key validation only
    handleSubmit: async (
        values: OptionsFormValuesProperties,
        { setSubmitting }: FormikBag<OptionsFormProperties, OptionsFormValuesProperties>
    ) => {
        const response: SuccessfulApiKeyCheckProperties | ApiErroredProperties = await messageUtil.send(CHECK_API_KEY, {
            apikey: values.apikey.trim(),
        });

        if (!response.error) {
            // ToDo: show valid api key status
            console.log('Valid API Key');

            const { domains, email } = response.data;
            // Store user account information
            await updateExtensionSettings({ user: { domains, email } });
        } else {
            // ---- errored ---- //
            // Delete `user` field from settings
            await updateExtensionSettings({ user: null });

            console.log(response.message);
        }

        // enable validate button
        setSubmitting(false);
    },

    displayName: 'OptionsForm',
})(InnerForm);

export default OptionsForm;
