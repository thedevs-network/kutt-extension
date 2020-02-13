import React from 'react';
import { withFormik, Field, Form, FormikBag, FormikProps, FormikErrors } from 'formik';

import messageUtil from '../util/mesageUtil';
import { UserConfigProperties, ProcessRequestProperties } from './Popup';
import { getCurrentTab } from '../util/tabs';

import { SHORTEN_URL } from '../Background/constants';
import { SelectField, TextField } from '../components/Input';
import { ApiBodyProperties, SuccessfulShortenStatusProperties, ApiErroredProperties } from '../Background';

type PopupFormValuesProperties = {
    password: string;
    customurl: string;
    domain: string;
};

const InnerForm: React.FC<PopupFormProperties & FormikProps<PopupFormValuesProperties>> = props => {
    const {
        isSubmitting,
        handleSubmit,
        userConfig: { domainOptions },
    } = props;

    return (
        <>
            {!isSubmitting ? (
                <Form onSubmit={handleSubmit} autoComplete="off" className="popup__form">
                    <div>
                        <h4>Domain:</h4>
                        <Field name="domain" type="text" component={SelectField} options={domainOptions} />
                    </div>
                    <div>
                        <h4>kutt.it/</h4>
                        <Field name="customurl" type="text" component={TextField} />
                    </div>
                    <div>
                        <h4>Password:</h4>
                        <Field name="password" type="password" component={TextField} />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        Create
                    </button>
                </Form>
            ) : null}
        </>
    );
};

// The type of props `PopupForm` receives
type PopupFormProperties = {
    defaultDomainId: string;
    userConfig: UserConfigProperties;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setRequestProcessed: ProcessRequestProperties;
};

// Wrap our form with the withFormik HoC
const PopupForm = withFormik<PopupFormProperties, PopupFormValuesProperties>({
    // Transform outer props into default form values
    mapPropsToValues: ({
        defaultDomainId,
        userConfig: { domainOptions },
    }: PopupFormProperties): PopupFormValuesProperties => {
        // find default item to select in options menu
        const defaultItem = domainOptions.find(({ id }) => {
            return id === defaultDomainId;
        });

        return {
            password: '',
            customurl: '',
            domain: defaultItem && defaultItem.value ? defaultItem.value.trim() : '', // empty string will map to disabled entry
        };
    },

    // Custom sync validation
    validate: (values: PopupFormValuesProperties): FormikErrors<PopupFormValuesProperties> => {
        const errors: FormikErrors<PopupFormValuesProperties> = {};
        // ToDo: Remove special symbols from password & customurl fields

        // password validation
        if (values.password && values.password.trim().length < 3) {
            errors.password = 'Password must be atleast 3 characters';
        }
        // custom url validation
        if (values.customurl && values.customurl.trim().length < 3) {
            errors.customurl = 'Custom URL must be atleast 3 characters';
        }

        return errors;
    },

    handleSubmit: async (
        values: PopupFormValuesProperties,
        {
            props: {
                setLoading,
                setRequestProcessed,
                userConfig: { apikey },
            },
        }: FormikBag<PopupFormProperties, PopupFormValuesProperties>
    ) => {
        // enable loading screen
        setLoading(true);

        // Get target link to shorten
        const tabs = await getCurrentTab();
        const target: string | null = (tabs.length > 0 && tabs[0].url) || null;

        if (!target || !target.startsWith('http')) {
            setLoading(false);
            // No valid target
            return setRequestProcessed({ error: true, message: 'Not a valid URL' });
        }

        const { customurl, password, domain } = values;
        const apiBody: ApiBodyProperties = {
            apikey,
            target,
            ...(customurl.trim() !== '' && { customurl: customurl.trim() }), // add this key only if field is not empty
            ...(password.trim() !== '' && { password: password.trim() }),
            reuse: false,
            ...(domain.trim() !== '' && { domain: domain.trim() }),
        };

        // shorten url in the background
        const response: SuccessfulShortenStatusProperties | ApiErroredProperties = await messageUtil.send(
            SHORTEN_URL,
            apiBody
        );

        // disable spinner
        setLoading(false);

        if (!response.error) {
            const {
                data: { link },
            } = response;

            // show shortened url
            setRequestProcessed({ error: false, message: link });
        } else {
            // errored
            setRequestProcessed({ error: true, message: response.message });
        }
    },

    displayName: 'PopupForm',
})(InnerForm);

export default PopupForm;
