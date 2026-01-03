import {isNull, isUndefined} from '@abhijithvijayan/ts-utils';
import {useState, useEffect, ChangeEvent} from 'react';
import clsx from 'clsx';

import {useExtensionSettings} from '../contexts/extension-settings-context';
import {updateExtensionSettings} from '../util/settings';
import {CHECK_API_KEY} from '../Background/constants';
import messageUtil from '../util/mesageUtil';
import {isValidUrl} from '../util/link';
import {
  SuccessfulApiKeyCheckProperties,
  AuthRequestBodyProperties,
  ApiErroredProperties,
  ErrorStateProperties,
  Kutt,
} from '../Background';

import Icon from '../components/Icon';

import styles from './Form.module.scss';

type OptionsFormValuesProperties = {
  apikey: string;
  history: boolean;
  advanced: boolean;
  host: string;
};

type FormErrors = {
  apikey?: string;
  host?: string;
};

type FormValidity = {
  apikey?: boolean;
  host?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSave = (values: OptionsFormValuesProperties): Promise<any> => {
  // should always return a Promise
  return updateExtensionSettings(values); // update local settings
};

function Form() {
  const extensionSettingsState = useExtensionSettings()[0];
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [errored, setErrored] = useState<ErrorStateProperties>({
    error: null,
    message: '',
  });

  const [formValues, setFormValues] = useState<OptionsFormValuesProperties>({
    apikey: extensionSettingsState.apikey,
    history: extensionSettingsState.history,
    advanced: extensionSettingsState.advanced,
    host:
      (extensionSettingsState.advanced &&
        extensionSettingsState.host.hostUrl) ||
      '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formValidity, setFormValidity] = useState<FormValidity>({});

  const isFormValid: boolean =
    ((isUndefined(formValidity.apikey) || formValidity.apikey) &&
      formValues.apikey.trim().length === 40 &&
      isUndefined(formErrors.apikey) &&
      (((isUndefined(formValidity.host) || formValidity.host) &&
        isUndefined(formErrors.host)) ||
        !formValues.advanced)) ||
    false;

  // on component mount -> save `settings` object
  useEffect(() => {
    onSave({
      ...formValues,
      ...(formValues.advanced === false && {host: ''}),
    });
  }, [formValues]);

  function handleApiKeyInputChange(apikey: string): void {
    setFormValues((prev) => ({...prev, apikey}));
    // ToDo: Remove special symbols

    if (!(apikey.trim().length > 0)) {
      setFormErrors((prev) => ({...prev, apikey: 'API key missing'}));
      setFormValidity((prev) => ({...prev, apikey: false}));
    } else if (apikey && apikey.trim().length < 40) {
      setFormErrors((prev) => ({...prev, apikey: 'API key must be 40 characters'}));
      setFormValidity((prev) => ({...prev, apikey: false}));
    } else if (apikey && apikey.trim().length > 40) {
      setFormErrors((prev) => ({...prev, apikey: 'API key cannot exceed 40 characters'}));
      setFormValidity((prev) => ({...prev, apikey: false}));
    } else {
      setFormErrors((prev) => {
        const {apikey: _, ...rest} = prev;
        return rest;
      });
      setFormValidity((prev) => ({...prev, apikey: true}));
    }
  }

  function handleHostUrlInputChange(host: string): void {
    if (!formValues.advanced) {
      setFormErrors((prev) => ({...prev, host: 'Enable Advanced Options first'}));
      setFormValidity((prev) => ({...prev, host: false}));
      return;
    }

    setFormValues((prev) => ({...prev, host}));

    if (!(host.trim().length > 0)) {
      setFormErrors((prev) => ({...prev, host: 'Custom URL cannot be empty'}));
      setFormValidity((prev) => ({...prev, host: false}));
      return;
    }

    if (!isValidUrl(host.trim()) || host.trim().length < 10) {
      setFormErrors((prev) => ({...prev, host: 'Please enter a valid url'}));
      setFormValidity((prev) => ({...prev, host: false}));
    } else {
      setFormErrors((prev) => {
        const {host: _, ...rest} = prev;
        return rest;
      });
      setFormValidity((prev) => ({...prev, host: true}));
    }
  }

  async function handleApiKeyVerification(): Promise<void> {
    setSubmitting(true);
    // request API validation request
    const apiKeyValidationBody: AuthRequestBodyProperties = {
      apikey: formValues.apikey.trim(),
      hostUrl:
        (formValues.advanced &&
          formValues.host.trim().length > 0 &&
          formValues.host.trim()) ||
        Kutt.hostUrl,
    };

    // API call
    const response: SuccessfulApiKeyCheckProperties | ApiErroredProperties =
      await messageUtil.send(CHECK_API_KEY, apiKeyValidationBody);

    if (!response.error) {
      // set top-level status
      setErrored({error: false, message: 'Valid API Key'});

      // Store user account information
      const {domains, email} = response.data;
      await updateExtensionSettings({user: {domains, email}});
    } else {
      // ---- errored ---- //
      setErrored({error: true, message: response.message});

      // Delete `user` field from settings
      await updateExtensionSettings({user: null});
    }

    // enable validate button
    setSubmitting(false);

    setTimeout(() => {
      // Reset status
      setErrored({error: null, message: ''});
    }, 1000);
  }

  return (
    <>
      <div className={styles.formSection}>
        <div className={styles.inputGroup}>
          <label htmlFor="apikey" className={styles.label}>
            API Key
            <small>
              <a
                href={`${
                  (formValues.advanced && formValues.host) ||
                  Kutt.hostUrl
                }/login`}
                target="blank"
                rel="nofollow noopener noreferrer"
                className={styles.labelLink}
              >
                get one?
              </a>
            </small>
          </label>

          <div className={styles.inputWrapper}>
            <div className={styles.inputIconWrapper}>
              <Icon
                className={styles.inputIcon}
                onClick={(): void => setShowApiKey(!showApiKey)}
                name={!showApiKey ? 'eye-closed' : 'eye'}
              />
            </div>

            <input
              id="apikey"
              name="apikey"
              type={!showApiKey ? 'password' : 'text'}
              value={formValues.apikey}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                handleApiKeyInputChange(e.target.value.trim());
              }}
              spellCheck="false"
              className={clsx(
                styles.input,
                !isUndefined(formValidity.apikey) &&
                  !formValidity.apikey &&
                  styles.inputError
              )}
            />
          </div>

          <span className={styles.errorText}>{formErrors.apikey}</span>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={submitting || !isFormValid}
          onClick={handleApiKeyVerification}
          className={styles.validateButton}
        >
          <span className={styles.validateText}>Validate</span>

          <Icon
            name={
              submitting
                ? 'spinner'
                : (!isNull(errored.error) &&
                    ((!errored.error && 'tick') || 'cross')) ||
                  'zap'
            }
            className={styles.validateIcon}
          />
        </button>
      </div>

      <div className={styles.toggleSection}>
        <label htmlFor="history" className={styles.toggleLabel}>
          <span className={styles.toggleText}>Keep History</span>

          <span className={styles.toggleWrapper}>
            <span className={styles.toggleTrack} />
            <span
              className={clsx(
                styles.toggleKnob,
                formValues.history && styles.active
              )}
            >
              <input
                id="history"
                name="history"
                type="checkbox"
                checked={formValues.history}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                  setFormValues((prev) => ({...prev, history: e.target.checked}));
                }}
                className={styles.toggleInput}
              />
            </span>
          </span>
        </label>

        <label htmlFor="advanced" className={styles.toggleLabel}>
          <span className={styles.toggleText}>Show Advanced Options</span>

          <span className={styles.toggleWrapper}>
            <span className={styles.toggleTrack} />
            <span
              className={clsx(
                styles.toggleKnob,
                formValues.advanced && styles.active
              )}
            >
              <input
                id="advanced"
                name="advanced"
                type="checkbox"
                checked={formValues.advanced}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                  setFormValues((prev) => ({...prev, advanced: e.target.checked}));
                }}
                className={styles.toggleInput}
              />
            </span>
          </span>
        </label>

        <div className={clsx(styles.advancedSection, !formValues.advanced && styles.hidden)}>
          <div className={styles.inputGroup}>
            <label htmlFor="host" className={styles.label}>
              Custom Host
            </label>

            <div className={styles.inputWrapper}>
              <input
                id="host"
                name="host"
                type="text"
                value={formValues.host}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                  handleHostUrlInputChange(e.target.value.trim());
                }}
                spellCheck="false"
                className={clsx(
                  styles.input,
                  !isUndefined(formValidity.host) &&
                    !formValidity.host &&
                    styles.inputError
                )}
              />
            </div>

            <span className={styles.errorText}>{formErrors.host}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form;
