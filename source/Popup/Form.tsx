import {useState, type ChangeEvent} from 'react';
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
  const {
    domainOptions,
    host: {hostDomain},
  } = extensionSettingsState;

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
    setIsSubmitting(true);

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
      reuse: false,
      ...(formState.domain.trim() !== EMPTY_STRING && {
        domain: formState.domain.trim(),
      }),
    };

    const apiShortenUrlBody: ShortUrlActionBodyProperties = {
      apiBody,
      hostUrl: extensionSettingsState.host.hostUrl,
    };

    const response: SuccessfulShortenStatusProperties | ApiErroredProperties =
      await messageUtil.send(SHORTEN_URL, apiShortenUrlBody);

    setIsSubmitting(false);

    if (!response.error) {
      const {
        data: {link},
      } = response;
      requestStatusDispatch({
        type: RequestStatusActionTypes.SET_REQUEST_STATUS,
        payload: {
          error: false,
          message: link,
        },
      });
    } else {
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
        <label htmlFor="domain" className={styles.label}>
          Domain
        </label>

        <div className={styles.selectWrapper}>
          <select
            id="domain"
            name="domain"
            value={formState.domain}
            onChange={(e) =>
              setFormState((prev) => ({...prev, domain: e.target.value}))
            }
            disabled={isSubmitting}
            className={styles.select}
          >
            {domainOptions.map(({id, option, value, disabled = false}) => (
              <option
                className={styles.selectOption}
                value={value}
                disabled={disabled}
                key={id}
              >
                {option}
              </option>
            ))}
          </select>
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
