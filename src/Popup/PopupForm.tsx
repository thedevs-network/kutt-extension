import React from 'react';
import { withFormik, Field, Form, FormikHelpers, FormikProps, FormikErrors } from 'formik';

import Loader from '../components/Loader';
import messageUtil from '../util/mesageUtil';
import { DomainOptionsProperties } from './Popup';
import { getCurrentTab } from '../util/tabs';

import { SHORTEN_URL } from '../Background/constants';
import { SelectField, TextField } from '../components/Input';
import { ShortenUrlBodyProperties, SuccessfulShortenStatusProperties, ApiErroredProperties } from '../Background';

type FormValuesProperties = {
    password: string;
    customurl: string;
    domain: string;
};

const InnerForm: React.FC<FormikProps<FormValuesProperties>> = props => {
    // ToDo: type
    const { isSubmitting, handleSubmit, domainOptions } = props;

    return (
        <>
            {isSubmitting ? (
                <>
                    <div className="popup__loader">
                        <Loader />
                    </div>
                </>
            ) : (
                <Form onSubmit={handleSubmit} autoComplete="off" id="popup__form">
                    <div>
                        <Field
                            name="domain"
                            type="text"
                            component={SelectField}
                            label="Domain"
                            options={domainOptions}
                        />
                    </div>
                    <div>
                        <Field name="customurl" type="text" component={TextField} label="Custom URL" />
                    </div>
                    <div>
                        <Field name="password" type="password" component={TextField} label="Password" />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        Create
                    </button>
                </Form>
            )}
        </>
    );
};

// The type of props `PopupForm` receives
type PopupFormProperties = {
    defaultDomainId: string;
    domainOptions: DomainOptionsProperties[];
};

// Wrap our form with the withFormik HoC
const PopupForm = withFormik<PopupFormProperties, FormValuesProperties>({
    // Transform outer props into default form values
    mapPropsToValues: props => {
        const defaultItem = props.domainOptions.find(({ id }) => {
            return id === 'default';
        });

        return {
            password: '',
            customurl: '',
            domain: defaultItem && defaultItem.value ? defaultItem.value.trim() : '',
        };
    },

    // Custom sync validation
    validate: (values: FormValuesProperties) => {
        const errors: FormikErrors<FormValuesProperties> = {};
        // ToDo: Remove special symbols from password & customurl fields

        if (values.password && values.password.trim().length < 3) {
            errors.password = 'Password must be atleast 3 characters';
        }

        if (values.customurl && values.customurl.trim().length < 3) {
            errors.customurl = 'Custom URL must be atleast 3 characters';
        }

        return errors;
    },

    handleSubmit: async (values: FormValuesProperties, { setSubmitting }: FormikHelpers<FormValuesProperties>) => {
        // Get target link to shorten
        const tabs = await getCurrentTab();
        const target: string | null = (tabs.length > 0 && tabs[0].url) || null;

        if (!target || !target.startsWith('http')) {
            // ToDo: handle no valid target
            console.log('Not a valid URL');

            return;
        }

        const { customurl, password, domain } = values;
        const apiBody: ShortenUrlBodyProperties = {
            target,
            ...(customurl.trim() !== '' && { customurl: customurl.trim() }), // add this key if field is not empty
            ...(password.trim() !== '' && { password: password.trim() }),
            reuse: false,
            ...(domain.trim() !== '' && { domain: domain.trim() }),
        };

        // shorten url in the background
        const response: SuccessfulShortenStatusProperties | ApiErroredProperties = await messageUtil.send(
            SHORTEN_URL,
            apiBody
        );

        if (!response.error) {
            const { data } = response;
            // ToDo: Show Shortened Link data on DOM
            console.log(data);
        } else {
            // errored
            console.log(response.message);
        }

        // enable submit button
        setSubmitting(false);
    },

    displayName: 'PopupForm',
})(InnerForm);

export default PopupForm;
