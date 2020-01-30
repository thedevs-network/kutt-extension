import React from 'react';
import { withFormik, Field, Form, FormikHelpers } from 'formik';

import { SelectField, TextField } from '../components/Input';

interface FormValueProperties {
    domain: string;
    customurl: string;
    password: string;
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
const PopupForm = (props): JSX.Element => {
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
                Submit
            </button>
        </Form>
    );
};

export default withFormik({
    mapPropsToValues: () => {
        return {
            domain: '2', // default option value
            customurl: '',
            password: '',
        };
    },

    // Custom sync validation
    validate: (values: FormValueProperties) => {
        const errors = {};

        if (values.customurl && values.customurl.length < 3) {
            errors.customurl = 'Custom URL must be atleast 3 characters';
        }

        if (values.password && values.password.length < 3) {
            errors.password = 'Password must be atleast 3 characters';
        }

        return errors;
    },

    handleSubmit: (values: FormValueProperties, { setSubmitting }: FormikHelpers<FormValueProperties>) => {
        console.log(values);

        setSubmitting(false);
    },

    displayName: 'PopupForm',
})(PopupForm);
