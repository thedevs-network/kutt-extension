import {isNull, isUndefined} from '@abhijithvijayan/ts-utils';
import type {JSX} from 'react';
import {useState, useEffect, useRef, ChangeEvent} from 'react';
import clsx from 'clsx';

import {useExtensionSettings} from '../contexts/extension-settings-context';
import {
  updateExtensionSettings,
  clearExtensionSettings,
} from '../util/settings';
import {CHECK_API_KEY} from '../Background/constants';
import messageUtil from '../util/messageUtil';
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
  reuse: boolean;
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
const onSave = (values: OptionsFormValuesProperties): Promise<any> =>
  // should always return a Promise
  updateExtensionSettings(values); // update local settings
function Form(): JSX.Element {
  const extensionSettingsState = useExtensionSettings()[0];
  const hostInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
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
    reuse: extensionSettingsState.reuse,
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
    setFormValues((prev) => {
      return {...prev, apikey};
    });
    // ToDo: Remove special symbols

    if (!(apikey.trim().length > 0)) {
      setFormErrors((prev) => {
        return {...prev, apikey: 'API key missing'};
      });
      setFormValidity((prev) => {
        return {...prev, apikey: false};
      });
    } else if (apikey && apikey.trim().length < 40) {
      setFormErrors((prev) => {
        return {...prev, apikey: 'API key must be 40 characters'};
      });
      setFormValidity((prev) => {
        return {...prev, apikey: false};
      });
    } else if (apikey && apikey.trim().length > 40) {
      setFormErrors((prev) => {
        return {...prev, apikey: 'API key cannot exceed 40 characters'};
      });
      setFormValidity((prev) => {
        return {...prev, apikey: false};
      });
    } else {
      setFormErrors((prev) => {
        const {apikey: _, ...rest} = prev;
        return rest;
      });
      setFormValidity((prev) => {
        return {...prev, apikey: true};
      });
    }
  }

  function handleHostUrlInputChange(host: string): void {
    if (!formValues.advanced) {
      setFormErrors((prev) => {
        return {...prev, host: 'Enable Advanced Options first'};
      });
      setFormValidity((prev) => {
        return {...prev, host: false};
      });
      return;
    }

    setFormValues((prev) => {
      return {...prev, host};
    });

    if (!(host.trim().length > 0)) {
      setFormErrors((prev) => {
        return {...prev, host: 'Custom URL cannot be empty'};
      });
      setFormValidity((prev) => {
        return {...prev, host: false};
      });
      return;
    }

    if (!isValidUrl(host.trim()) || host.trim().length < 10) {
      setFormErrors((prev) => {
        return {...prev, host: 'Please enter a valid url'};
      });
      setFormValidity((prev) => {
        return {...prev, host: false};
      });
    } else {
      setFormErrors((prev) => {
        const {host: _, ...rest} = prev;
        return rest;
      });
      setFormValidity((prev) => {
        return {...prev, host: true};
      });
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
    }, 3000);
  }

  async function handleResetSettings(): Promise<void> {
    await clearExtensionSettings();
    setShowResetConfirm(false);
    // Reload the page to reflect cleared settings
    window.location.reload();
  }

  return (
    <>
      <div className={styles.formSection}>
        <div className={styles.inputGroup}>
          <label htmlFor="apikey" className={styles.label}>
            API Key
            <span className={styles.labelLinkWrapper}>
              <a
                href={`${
                  (formValues.advanced && formValues.host) || Kutt.hostUrl
                }/login`}
                target="blank"
                rel="nofollow noopener noreferrer"
                className={styles.labelLink}
              >
                get one?
              </a>
              <span className={styles.tooltip}>
                Get your API key from your Kutt account settings page
              </span>
            </span>
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

      <div className={styles.validateSection}>
        <button
          type="button"
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

        {!isNull(errored.error) && (
          <div
            className={clsx(
              styles.validationFeedback,
              errored.error ? styles.error : styles.success
            )}
          >
            <Icon
              className={styles.feedbackIcon}
              name={errored.error ? 'cross' : 'tick'}
            />
            <span className={styles.feedbackMessage}>{errored.message}</span>
          </div>
        )}
      </div>

      <div className={styles.toggleSection}>
        <label htmlFor="history" className={styles.toggleLabel}>
          <span className={styles.toggleTextWithInfo}>
            <span className={styles.toggleText}>Show Recent Links</span>
            <span className={styles.infoIcon}>
              <Icon name="info" />
              <span className={styles.tooltip}>
                Enables the History page to view your recent shortened links
              </span>
            </span>
          </span>

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
                  setFormValues((prev) => {
                    return {...prev, history: e.target.checked};
                  });
                }}
                className={styles.toggleInput}
              />
            </span>
          </span>
        </label>

        <label htmlFor="reuse" className={styles.toggleLabel}>
          <span className={styles.toggleTextWithInfo}>
            <span className={styles.toggleText}>Reuse Existing URLs</span>
            <span className={styles.infoIcon}>
              <Icon name="info" />
              <span className={styles.tooltip}>
                Returns the existing short link if the same URL was shortened
                before
              </span>
            </span>
          </span>

          <span className={styles.toggleWrapper}>
            <span className={styles.toggleTrack} />
            <span
              className={clsx(
                styles.toggleKnob,
                formValues.reuse && styles.active
              )}
            >
              <input
                id="reuse"
                name="reuse"
                type="checkbox"
                checked={formValues.reuse}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                  setFormValues((prev) => {
                    return {...prev, reuse: e.target.checked};
                  });
                }}
                className={styles.toggleInput}
              />
            </span>
          </span>
        </label>

        <label htmlFor="advanced" className={styles.toggleLabel}>
          <span className={styles.toggleTextWithInfo}>
            <span className={styles.toggleText}>Show Advanced Options</span>
            <span className={styles.infoIcon}>
              <Icon name="info" />
              <span className={styles.tooltip}>
                Configure a custom self-hosted Kutt instance URL
              </span>
            </span>
          </span>

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
                  setFormValues((prev) => {
                    return {...prev, advanced: e.target.checked};
                  });
                  if (e.target.checked) {
                    setTimeout(() => hostInputRef.current?.focus(), 350);
                  }
                }}
                className={styles.toggleInput}
              />
            </span>
          </span>
        </label>

        <div
          className={clsx(
            styles.advancedSection,
            !formValues.advanced && styles.hidden
          )}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="host" className={styles.label}>
              <span className={styles.labelWithInfo}>
                Custom Host
                <span className={styles.infoIcon}>
                  <Icon name="info" />
                  <span className={styles.tooltip}>
                    URL of your self-hosted Kutt instance (e.g.,
                    https://kutt.example.com)
                  </span>
                </span>
              </span>
            </label>

            <div className={styles.inputWrapper}>
              <input
                ref={hostInputRef}
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

      <div className={styles.resetSection}>
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className={styles.resetButton}
        >
          Reset All Settings
        </button>
        <span className={styles.resetHint}>
          This will clear all your settings and reload the extension
        </span>
      </div>

      {showResetConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowResetConfirm(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowResetConfirm(false);
          }}
          role="button"
          tabIndex={0}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="button"
            tabIndex={0}
          >
            <div className={styles.modalHeader}>
              <Icon name="info" className={styles.modalIcon} />
              <span className={styles.modalTitle}>Reset Settings?</span>
            </div>
            <p className={styles.modalText}>
              This will permanently delete your API key and all preferences. You
              will need to reconfigure the extension.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetSettings}
                className={styles.modalConfirmButton}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Form;
