import React from 'react';
import { withFormik, Field, Form, FormikHelpers, FormikProps, FormikErrors } from 'formik';

import { SelectField, TextField } from '../components/Input';
import messageUtil from '../util/mesageUtil';
import { SHORTEN_URL } from '../Background/constants';
import { ShortenUrlBodyProperties } from '../Background';

interface FormValuesProperties {
    password: string;
    customurl: string;
    domain: string;
}

// ToDo: Fetch from API
const domainOptions = [
    {
        option: '-- Choose Domain --',
        value: '',
        disabled: true,
    },
    {
        option: 'https://kutt.it',
        value: '1',
    },
    {
        option: 'https://example.com',
        value: '2',
    },
];

const InnerForm: React.FC<FormikProps<FormValuesProperties>> = props => {
    const { isSubmitting, handleChange, handleBlur, handleSubmit } = props;

    return (
        <Form onSubmit={handleSubmit} autoComplete="off">
            <Field
                name="domain"
                type="text"
                component={SelectField}
                label="Domain"
                options={domainOptions}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <Field
                name="customurl"
                type="text"
                component={TextField}
                label="Custom URL"
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <Field name="password" type="password" component={TextField} label="Password" />

            <button type="submit" disabled={isSubmitting}>
                Create
            </button>
        </Form>
    );
};

// The type of props `PopupForm` receives
interface PopupFormProperties {
    defaultDomainId: string;
}

// Wrap our form with the withFormik HoC
const PopupForm = withFormik<PopupFormProperties, FormValuesProperties>({
    // Transform outer props into form values
    mapPropsToValues: props => {
        return {
            password: '',
            customurl: '',
            domain: props.defaultDomainId, // default option value
        };
    },

    // Custom sync validation
    validate: (values: FormValuesProperties) => {
        const errors: FormikErrors<FormValuesProperties> = {};

        if (values.password && values.password.length < 3) {
            errors.password = 'Password must be atleast 3 characters';
        }

        if (values.customurl && values.customurl.length < 3) {
            errors.customurl = 'Custom URL must be atleast 3 characters';
        }

        return errors;
    },

    handleSubmit: async (values: FormValuesProperties, { setSubmitting }: FormikHelpers<FormValuesProperties>) => {
        console.log(values);
        setSubmitting(false);

        const data: ShortenUrlBodyProperties = {
            // ToDo: get target link from browser.tabs
            target: 'https://long-url.com',
            reuse: false,
            ...values,
        };

        try {
            await messageUtil.send(SHORTEN_URL, data);
        } catch (err) {
            console.log(err);
        }
    },

    displayName: 'PopupForm',
})(InnerForm);

export default PopupForm;
