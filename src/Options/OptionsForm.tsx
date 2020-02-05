import React from 'react';
import { withFormik, Field, Form, FormikHelpers, FormikProps, FormikErrors } from 'formik';

import messageUtil from '../lib/mesageUtil';
import { TextField, CheckBox } from '../components/Input';
import { CHECK_API_KEY } from '../Background/constants';

interface FormValuesProperties {
    apikey: string;
}

const InnerForm: React.FC<FormikProps<FormValuesProperties>> = props => {
    const { isSubmitting, handleSubmit } = props;

    return (
        <Form onSubmit={handleSubmit} autoComplete="off">
            <Field name="apikey" type="password" component={TextField} label="API Key" />

            <button type="submit" disabled={isSubmitting}>
                Validate
            </button>

            <Field name="autocopy" component={CheckBox} label="Auto Copy URL to Clipboard" />
            <Field name="history" component={CheckBox} label="Keep URLs History" />
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

    // Custom sync validation
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

    handleSubmit: async (values: FormValuesProperties, { setSubmitting }: FormikHelpers<FormValuesProperties>) => {
        console.log(values);

        setSubmitting(false);

        // ToDo:
        try {
            console.log('options: sending message');
            await messageUtil.send(CHECK_API_KEY, { apikey: values.apikey.trim() });
        } catch (err) {
            console.log(err);
        }
        // 2. show valid api key status
        // 3. Throw error (if error exists)
        // 4. else -> show no internet message
    },

    displayName: 'OptionsForm',
})(InnerForm);

export default OptionsForm;
