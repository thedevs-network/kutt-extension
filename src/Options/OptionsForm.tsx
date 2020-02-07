import React from 'react';
import { withFormik, Field, Form, FormikHelpers, FormikProps, FormikErrors } from 'formik';

import AutoSave from '../util/autoSave';
import messageUtil from '../util/mesageUtil';
import { updateExtensionSettings } from '../util/optionsPageHelpers';
import { CHECK_API_KEY } from '../Background/constants';
import { TextField, CheckBox } from '../components/Input';
import { SuccessfulApiKeyCheckProperties, ApiErroredProperties } from '../Background';

type FormValuesProperties = {
    apikey: string;
    autocopy: boolean;
    history: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSave = (values: FormValuesProperties): Promise<any> => {
    // should always return a Promise
    return updateExtensionSettings(values); // update local settings
};

const InnerForm: React.FC<FormikProps<FormValuesProperties>> = props => {
    const { isSubmitting, handleSubmit } = props;

    return (
        <Form onSubmit={handleSubmit} autoComplete="off">
            <div>
                <Field name="apikey" type="password" component={TextField} label="API Key" />
                <button type="submit" disabled={isSubmitting}>
                    Validate
                </button>
            </div>

            <Field name="autocopy" component={CheckBox} label="Auto Copy URL to Clipboard" />
            <Field name="history" component={CheckBox} label="Keep URLs History" />
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
interface OptionsFormProperties {} // eslint-disable-line @typescript-eslint/no-empty-interface

// Wrap our form with the withFormik HoC
const OptionsForm = withFormik<OptionsFormProperties, FormValuesProperties>({
    // Transform outer props into form values
    mapPropsToValues: props => {
        return {
            apikey: '',
            autocopy: false,
            history: true,
        };
    },

    validate: (values: FormValuesProperties) => {
        const errors: FormikErrors<FormValuesProperties> = {};

        if (!values.apikey) {
            errors.apikey = 'API key missing';
        }
        // ToDo: restore later
        // else if (values.apikey && values.apikey.trim().length < 40) {
        //     errors.apikey = 'API key must be 40 characters';
        // } else if (values.apikey && values.apikey.trim().length > 40) {
        //     errors.apikey = 'API key cannot exceed 40 characters';
        // }

        return errors;
    },

    // for API Key validation only
    handleSubmit: async (values: FormValuesProperties, { setSubmitting }: FormikHelpers<FormValuesProperties>) => {
        const response: SuccessfulApiKeyCheckProperties | ApiErroredProperties = await messageUtil.send(CHECK_API_KEY, {
            apikey: values.apikey.trim(),
        });

        if (!response.error) {
            // ToDo: show valid api key status
            console.log('Valid API Key');
            // ToDo: Store user information
            console.log(response.data);
        } else {
            // errored
            console.log(response.message);
        }

        // enable validate button
        setSubmitting(false);
    },

    displayName: 'OptionsForm',
})(InnerForm);

export default OptionsForm;
