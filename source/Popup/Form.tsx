import {get, isNull} from '@abhijithvijayan/ts-utils';
import {useFormState} from 'react-use-form-state';
import tw, {css, styled} from 'twin.macro';
import React, {useState} from 'react';

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

export enum CONSTANTS {
  DefaultDomainId = 'default',
}

const StyledValidateButton = styled.button`
  ${tw`focus:outline-none hover:text-gray-200 inline-flex items-center justify-center w-full px-3 py-1 mb-1 text-xs font-semibold text-center text-white duration-300 ease-in-out rounded shadow-lg`}

  background: linear-gradient(to right,rgb(126, 87, 194),rgb(98, 0, 234));
  min-height: 36px;

  .create__icon {
    ${tw`inline-flex px-0 bg-transparent`}

    svg {
      ${tw`transition-transform duration-300 ease-in-out`}

      stroke: currentColor;
      stroke-width: 2;
    }
  }
`;

const Form: React.FC = () => {
  const extensionSettingsState = useExtensionSettings()[0];
  const requestStatusDispatch = useRequestStatus()[1];
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    domainOptions,
    host: {hostDomain},
  } = extensionSettingsState;

  const [
    formState,
    {
      text: textProps,
      password: passwordProps,
      select: selectProps,
      label: labelProps,
    },
  ] = useFormState<{
    domain: string;
    customurl: string;
    password: string;
  }>(
    {
      domain:
        domainOptions
          .find(({id}) => {
            return id === CONSTANTS.DefaultDomainId;
          })
          ?.value?.trim() || '', // empty string will map to disabled entry
    },
    {
      withIds: true, // enable automatic creation of id and htmlFor props
    }
  );
  const {
    errors: formStateErrors,
    validity: formStateValidity,
    setField: setFormStateField,
    setFieldError: setFormStateFieldError,
  } = formState;

  const isFormValid: boolean =
    ((formStateValidity.customurl === undefined ||
      formStateValidity.customurl) &&
      (formStateValidity.password === undefined ||
        formStateValidity.password) &&
      formStateErrors.customurl === undefined &&
      formStateErrors.password === undefined) ||
    false;

  async function handleFormSubmit({
    customurl,
    password,
    domain,
  }: {
    domain: string;
    customurl: string;
    password: string;
  }): Promise<void> {
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
      target: (target as unknown) as string,
      ...(customurl.trim() !== '' && {customurl: customurl.trim()}), // add key only if field is not empty
      ...(password.trim() !== '' && {password: password.trim()}),
      reuse: false,
      ...(domain.trim() !== '' && {domain: domain.trim()}),
    };

    const apiShortenUrlBody: ShortUrlActionBodyProperties = {
      apiBody,
      hostUrl: extensionSettingsState.host.hostUrl,
    };
    // shorten url in the background
    const response:
      | SuccessfulShortenStatusProperties
      | ApiErroredProperties = await messageUtil.send(
      SHORTEN_URL,
      apiShortenUrlBody
    );

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
    setFormStateField('customurl', url);
    // ToDo: Remove special symbols

    if (url.length > 0 && url.length < 3) {
      setFormStateFieldError(
        'customurl',
        'Custom URL must be atleast 3 characters'
      );
    }
  }

  function handlePasswordInputChange(password: string): void {
    setFormStateField('password', password);
    // ToDo: Remove special symbols

    if (password.length > 0 && password.length < 3) {
      setFormStateFieldError(
        'password',
        'Password must be atleast 3 characters'
      );
    }
  }

  return (
    <>
      <div tw="flex flex-col w-full max-w-sm p-4 mx-auto bg-white select-none">
        <div tw="flex flex-col mb-4">
          <label
            {...labelProps('domain')}
            tw="sm:text-sm mb-1 text-xs tracking-wide text-gray-600"
          >
            Domain
          </label>

          <div tw="relative">
            <select
              {...selectProps('domain')}
              css={[
                tw`sm:text-base focus:border-indigo-400 focus:outline-none relative w-full px-2 py-2 text-sm placeholder-gray-400 bg-gray-200 border rounded`,
              ]}
            >
              {domainOptions.map(({id, option, value, disabled = false}) => {
                return (
                  <option
                    tw="bg-gray-200 "
                    value={value}
                    disabled={disabled}
                    key={id}
                  >
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div tw="flex flex-col mb-3 relative">
          <label
            {...labelProps('customurl')}
            tw="sm:text-sm absolute top-0 bottom-0 left-0 right-0 z-10 block text-xs tracking-wide text-gray-600 cursor-pointer"
          >
            <span>{hostDomain}/</span>
          </label>

          <input
            {...textProps('customurl')}
            onChange={({
              target: {value},
            }: React.ChangeEvent<HTMLInputElement>): void => {
              // NOTE: overriding onChange to show errors
              handleCustomUrlInputChange(value.trim());
            }}
            spellCheck="false"
            css={[
              tw`focus:outline-none sm:text-base focus:border-indigo-400 w-full px-2 py-2 text-sm placeholder-gray-400 bg-gray-200 border rounded`,

              css`
                margin-top: 1.2rem;
              `,

              formStateValidity.customurl !== undefined &&
                !formStateValidity.customurl &&
                tw`border-red-500`,
            ]}
          />

          <span tw="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            {formStateErrors.customurl}
          </span>
        </div>

        <div tw="flex flex-col mb-3 relative">
          <label
            {...labelProps('password')}
            tw="sm:text-sm absolute top-0 bottom-0 left-0 right-0 z-10 block text-xs tracking-wide text-gray-600 cursor-pointer"
          >
            <span>Password</span>
          </label>

          <div tw="relative">
            <div
              css={[
                tw`absolute top-0 right-0 flex w-10 mt-6 border border-transparent`,

                css`
                  margin-top: 1.75rem;
                `,
              ]}
            >
              <Icon
                onClick={(): void => setShowPassword(!showPassword)}
                name={!showPassword ? 'eye-closed' : 'eye'}
                css={[
                  tw`z-10 flex items-center justify-center w-full h-full rounded-tl rounded-bl cursor-pointer`,

                  css`
                    color: rgb(187, 187, 187);
                  `,
                ]}
              />
            </div>

            <input
              {...passwordProps('password')}
              type={!showPassword ? 'password' : 'text'}
              spellCheck="false"
              onChange={({
                target: {value},
              }: React.ChangeEvent<HTMLInputElement>): void => {
                // NOTE: overriding onChange to show errors
                handlePasswordInputChange(value.trim());
              }}
              css={[
                tw`focus:outline-none sm:text-base focus:border-indigo-400 w-full px-2 py-2 text-sm placeholder-gray-400 bg-gray-200 border rounded`,

                css`
                  margin-top: 1.2rem;
                `,

                formStateValidity.password !== undefined &&
                  !formStateValidity.password &&
                  tw`border-red-500`,
              ]}
            />
          </div>

          <span tw="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            {formStateErrors.password}
          </span>
        </div>

        <StyledValidateButton
          type="submit"
          disabled={!isFormValid || isSubmitting}
          onClick={(): void => {
            handleFormSubmit(formState.values);
          }}
        >
          {!isSubmitting ? (
            <span>Create</span>
          ) : (
            <Icon className="icon create__icon" name="spinner" />
          )}
        </StyledValidateButton>
      </div>
    </>
  );
};
export default Form;
