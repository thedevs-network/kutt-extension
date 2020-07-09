import {useFormState} from 'react-use-form-state';
import tw, {css} from 'twin.macro';
import React, {useState} from 'react';

import {useExtensionSettings} from '../contexts/extension-settings-context';

import Icon from '../components/Icon';

type Props = {
  handleFormSubmit: (props: {
    domain: string;
    customurl: string;
    password: string;
  }) => Promise<void>;
};

export enum CONSTANTS {
  DefaultDomainId = 'default',
}

const Form: React.FC<Props> = ({handleFormSubmit}) => {
  const extensionSettingsState = useExtensionSettings()[0];
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
      <div tw="flex flex-col w-full max-w-sm p-4 mx-auto bg-white border border-gray-200 shadow select-none">
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
            tw="sm:text-sm block text-xs tracking-wide cursor-pointer text-gray-600 absolute top-0 bottom-0 left-0 right-0"
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
            <div tw="absolute top-0 right-0 flex w-10 mt-6 border border-transparent">
              <Icon
                tw="z-10 flex items-center justify-center w-full h-full text-gray-600 rounded-tl rounded-bl cursor-pointer"
                onClick={(): void => setShowPassword(!showPassword)}
                name={!showPassword ? 'eye-closed' : 'eye'}
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

        <button
          type="submit"
          disabled={!isFormValid}
          onClick={(): void => {
            handleFormSubmit(formState.values);
          }}
          css={[
            tw`block w-full px-2 py-3 mb-1 text-xs font-semibold text-white bg-purple-700 rounded`,

            css`
              background: linear-gradient(
                to right,
                rgb(126, 87, 194),
                rgb(98, 0, 234)
              );
            `,
          ]}
        >
          Create
        </button>
      </div>
    </>
  );
};
export default Form;
