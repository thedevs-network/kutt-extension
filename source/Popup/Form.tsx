import {useState, useRef, useEffect, type ChangeEvent} from 'react';
import {
  EMPTY_STRING,
  isEmpty,
  isNull,
  get,
} from '@abhijithvijayan/ts-utils';
import clsx from 'clsx';

import {useExtensionSettings} from '../contexts/extension-settings-context';
import {SHORTEN_URL} from '../Background/constants';
import messageUtil from '../util/mesageUtil';
import {getCurrentTab} from '../util/tabs';
import {
  RequestStatusActionTypes,
  useRequestStatus,
} from '../contexts/request-status-context';
import {isValidUrl} from '../util/link';
import {
  SuccessfulShortenStatusProperties,
  ShortUrlActionBodyProperties,
  ApiErroredProperties,
  ApiBodyProperties,
} from '../Background';

import Icon from '../components/Icon';
import styles from './Form.module.scss';

export enum CONSTANTS {
  DefaultDomainId = 'default',
}

function Form() {
  const extensionSettingsState = useExtensionSettings()[0];
  const requestStatusDispatch = useRequestStatus()[1];
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    domainOptions,
    host: {hostDomain},
  } = extensionSettingsState;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [formState, setFormState] = useState({
    domain:
      domainOptions
        .find(({id}) => id === CONSTANTS.DefaultDomainId)
        ?.value?.trim() || EMPTY_STRING,
    customurl: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<{
    customurl?: string;
    password?: string;
  }>({});

  const isFormValid: boolean =
    !formErrors.customurl &&
    !formErrors.password &&
    true;

  async function handleFormSubmit(): Promise<void> {
    // enable loading screen
    setIsSubmitting(true);

    // Get target link to shorten
    const tabs = await getCurrentTab();
    const target: string | null = get(tabs, '[0].url', null);
    const shouldSubmit: boolean = !isNull(target) && isValidUrl(target);

    if (!shouldSubmit) {
      setIsSubmitting(false);
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_REQUEST_STATUS,
        payload: {
          error: true,
          message: 'Not a valid URL',
        },
      });
      return;
    }

    const apiBody: ApiBodyProperties = {
      apikey: extensionSettingsState.apikey,
      target: target as unknown as string,
      ...(formState.customurl.trim() !== EMPTY_STRING && {
        customurl: formState.customurl.trim(),
      }),
      ...(!isEmpty(formState.password) && {password: formState.password}),
      reuse: extensionSettingsState.reuse,
      ...(formState.domain.trim() !== EMPTY_STRING && {
        domain: formState.domain.trim(),
      }),
    };

    const apiShortenUrlBody: ShortUrlActionBodyProperties = {
      apiBody,
      hostUrl: extensionSettingsState.host.hostUrl,
    };

    // shorten url in the background
    const response: SuccessfulShortenStatusProperties | ApiErroredProperties =
      await messageUtil.send(SHORTEN_URL, apiShortenUrlBody);

    // disable spinner
    setIsSubmitting(false);

    if (!response.error) {
      const {
        data: {link},
      } = response;
      // show shortened url
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_REQUEST_STATUS,
        payload: {
          error: false,
          message: link,
        },
      });
      // reset form fields (keep domain selection)
      setFormState((prev) => ({...prev, customurl: '', password: ''}));
      setFormErrors({});
    } else {
      // errored
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_REQUEST_STATUS,
        payload: {
          error: true,
          message: response.message,
        },
      });
    }
  }

  function handleCustomUrlInputChange(url: string): void {
    setFormState((prev) => ({...prev, customurl: url}));
    // ToDo: Remove special symbols

    if (url.length > 0 && url.length < 3) {
      setFormErrors((prev) => ({
        ...prev,
        customurl: 'Custom URL must be at-least 3 characters',
      }));
    } else {
      setFormErrors((prev) => ({...prev, customurl: undefined}));
    }
  }

  function handlePasswordInputChange(password: string): void {
    setFormState((prev) => ({...prev, password}));
    // ToDo: Remove special symbols

    if (password.length > 0 && password.length < 3) {
      setFormErrors((prev) => ({
        ...prev,
        password: 'Password must be at-least 3 characters',
      }));
    } else {
      setFormErrors((prev) => ({...prev, password: undefined}));
    }
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Domain
        </label>

        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            type="button"
            className={clsx(styles.dropdownTrigger, isDropdownOpen && styles.open)}
            onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
            disabled={isSubmitting}
          >
            <span className={clsx(styles.dropdownValue, formState.domain && styles.hasValue)}>
              {domainOptions.find(({value}) => value === formState.domain)?.option || 'Select domain'}
            </span>
            <Icon name="chevron-down" className={clsx(styles.dropdownIcon, isDropdownOpen && styles.open)} />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {domainOptions
                .filter(({disabled}) => !disabled)
                .map(({id, option, value}) => (
                  <button
                    type="button"
                    key={id}
                    className={clsx(
                      styles.dropdownItem,
                      formState.domain === value && styles.selected
                    )}
                    onClick={() => {
                      setFormState((prev) => ({...prev, domain: value}));
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formGroupRelative}>
        <label htmlFor="customurl" className={styles.labelAbsolute}>
          <span>{hostDomain}/</span>
        </label>

        <input
          id="customurl"
          name="customurl"
          type="text"
          value={formState.customurl}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => {
            handleCustomUrlInputChange(e.target.value.trim());
          }}
          disabled={isSubmitting}
          spellCheck="false"
          className={clsx(styles.input, formErrors.customurl && styles.inputError)}
        />

        <span className={styles.errorText}>{formErrors.customurl}</span>
      </div>

      <div className={styles.formGroupRelative}>
        <label htmlFor="password" className={styles.labelAbsolute}>
          <span>Password</span>
        </label>

        <div className={styles.passwordWrapper}>
          <div className={styles.passwordToggle}>
            <Icon
              onClick={(): void => {
                if (!isSubmitting) {
                  setShowPassword(!showPassword);
                }
              }}
              name={!showPassword ? 'eye-closed' : 'eye'}
              className={styles.passwordToggleIcon}
            />
          </div>

          <input
            id="password"
            name="password"
            type={!showPassword ? 'password' : 'text'}
            value={formState.password}
            spellCheck="false"
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              handlePasswordInputChange(e.target.value);
            }}
            disabled={isSubmitting}
            className={clsx(styles.input, formErrors.password && styles.inputError)}
          />
        </div>

        <span className={styles.errorText}>{formErrors.password}</span>
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        onClick={handleFormSubmit}
        className={styles.submitButton}
      >
        {!isSubmitting ? (
          <span>Create</span>
        ) : (
          <Icon className={styles.createIcon} name="spinner" />
        )}
      </button>
    </div>
  );
}

export default Form;
