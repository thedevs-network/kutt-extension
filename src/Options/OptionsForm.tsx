import React from 'react';
import { withFormik, Field, Form, FormikHelpers, FormikProps, FormikErrors } from 'formik';

import { TextField } from '../components/Input';

interface FormValuesProperties {
    apikey: string;
}

const InnerForm: React.FC<FormikProps<FormValuesProperties>> = props => {
    const { isSubmitting, handleSubmit } = props;

    return (
        <Form onSubmit={handleSubmit} autoComplete="off">
            <Field name="apikey" type="password" component={TextField} label="API Key" />

            <button type="submit" disabled={isSubmitting}>
                Save
            </button>
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
        };
    },

    // Custom sync validation
    validate: (values: FormValuesProperties) => {
        const errors: FormikErrors<FormValuesProperties> = {};

        if (!values.apikey) {
            errors.apikey = 'API key missing';
        } else if (values.apikey && values.apikey.trim().length < 40) {
            errors.apikey = 'API key must be 40 characters';
        } else if (values.apikey && values.apikey.trim().length > 40) {
            errors.apikey = 'API key cannot exceed 40 characters';
        }

        return errors;
    },

    handleSubmit: (values: FormValuesProperties, { setSubmitting }: FormikHelpers<FormValuesProperties>) => {
        console.log(values);

        setSubmitting(false);
    },

    displayName: 'OptionsForm',
})(InnerForm);

export default OptionsForm;
