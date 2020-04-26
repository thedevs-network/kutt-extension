import React, {useEffect} from 'react';
import {
  withFormik,
  Field,
  Form,
  FormikBag,
  FormikProps,
  FormikErrors,
} from 'formik';

import Icon from '../components/Icon';
import {
  Kutt,
  SuccessfulApiKeyCheckProperties,
  ApiErroredProperties,
  GetUserSettingsBodyProperties,
} from '../Background';
import {isValidUrl} from '../util/tabs';
import messageUtil from '../util/mesageUtil';
import {ExtensionConfigProperties} from './Options';
import {CHECK_API_KEY} from '../Background/constants';
import {TextField, CheckBox} from '../components/Input';
import {updateExtensionSettings} from '../util/settings';

export type OptionsFormValuesProperties = {
  apikey: string;
  history: boolean;
  advanced: boolean;
  customhost: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSave = (values: OptionsFormValuesProperties): Promise<any> => {
  // should always return a Promise
  return updateExtensionSettings(values); // update local settings
};

// Note: The default key-value pairs are not saved to storage without any first interaction
const InnerForm: React.FC<FormikProps<OptionsFormValuesProperties>> = (
  props
) => {
  const {
    isSubmitting,
    handleSubmit,
    setFieldValue,
    setStatus,
    status,
    values,
  } = props;

  // on component mount -> set `settings` object
  useEffect(() => {
    // Reset `customhost` field on `advanced` untick
    if (values.advanced === false) {
      setFieldValue('customhost', '');
    }

    onSave({...values, ...(values.advanced === false && {customhost: ''})});
  }, [values, setFieldValue]);

  // run on component update
  useEffect(() => {
    setStatus({error: null, message: ''});
  }, [setStatus]);

  return (
    <Form onSubmit={handleSubmit} autoComplete="off" id="options__form">
      <div>
        <Field
          name="apikey"
          type="password"
          component={TextField}
          label="API Key"
        />
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {/* eslint-disable-next-line no-nested-ternary */}
          {isSubmitting ? (
            <Icon name="spinner" className="icon" />
          ) : status && status.error !== null ? (
            (status && !status.error && (
              <Icon name="tick" className="icon" />
            )) || <Icon name="cross" />
          ) : (
            <Icon name="zap" className="icon" />
          )}
          Validate
        </button>
      </div>

      <Field name="history" component={CheckBox} label="Keep URLs History" />

      <div>
        <Field
          name="advanced"
          component={CheckBox}
          label="Show advanced options"
        />
        <div>
          {values.advanced && (
            <Field
              name="customhost"
              type="text"
              component={TextField}
              label="Custom Host"
            />
          )}
        </div>
      </div>
    </Form>
  );
};

// The type of props `OptionsForm` receives
type OptionsFormProperties = {
  extensionConfig: ExtensionConfigProperties;
};

// Wrap our form with the withFormik HoC
const OptionsForm = withFormik<
  OptionsFormProperties,
  OptionsFormValuesProperties
>({
  // Transform outer props into form values
  mapPropsToValues: ({
    extensionConfig: {apikey, history, advanced, customhost},
  }: OptionsFormProperties): OptionsFormValuesProperties => {
    return {
      apikey: apikey.trim(),
      history,
      advanced,
      customhost: customhost.trim(),
    };
  },

  validate: (
    values: OptionsFormValuesProperties
  ): FormikErrors<OptionsFormValuesProperties> => {
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

    if (values.advanced && values.customhost.trim().length <= 0) {
      errors.customhost = 'Custom URL cannot be empty';
    }

    if (values.customhost.trim().length > 0) {
      if (
        !isValidUrl(values.customhost.trim()) ||
        values.customhost.trim().length < 10
      ) {
        errors.customhost = 'Please enter a valid url';
      }
    }

    return errors;
  },

  // for API Key validation only
  handleSubmit: async (
    {apikey, customhost}: OptionsFormValuesProperties,
    {
      setSubmitting,
      setStatus,
    }: FormikBag<OptionsFormProperties, OptionsFormValuesProperties>
  ) => {
    // request API validation request
    const apiKeyValidationBody: GetUserSettingsBodyProperties = {
      apikey: apikey.trim(),
      hostUrl: customhost.trim().length > 0 ? customhost.trim() : Kutt.hostUrl,
    };
    const response:
      | SuccessfulApiKeyCheckProperties
      | ApiErroredProperties = await messageUtil.send(
      CHECK_API_KEY,
      apiKeyValidationBody
    );

    if (!response.error) {
      // set top-level status
      setStatus({error: false, message: 'Valid API Key'});

      // Store user account information
      const {domains, email} = response.data;
      await updateExtensionSettings({user: {domains, email}});
    } else {
      // ---- errored ---- //
      setStatus({error: true, message: response.message});

      // Delete `user` field from settings
      await updateExtensionSettings({user: null});
    }

    setTimeout(() => {
      // Reset status
      setStatus({error: null, message: ''});

      // enable validate button
      setSubmitting(false);
    }, 1000);
  },

  displayName: 'OptionsForm',
})(InnerForm);

export default OptionsForm;
