import {useFormState} from 'react-use-form-state';
import React, {useState} from 'react';
import tw, {css} from 'twin.macro';

import {useExtensionSettings} from '../contexts/extension-settings-context';
import {isValidUrl} from '../util/tabs';

import Icon from '../components/Icon';

const Form: React.FC = () => {
  const [
    extensionSettingsState,
    extensionSettingsDispatch,
  ] = useExtensionSettings();
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const [
    formState,
    {
      text: textProps,
      checkbox: checkboxProps,
      password: passwordProps,
      label: labelProps,
    },
  ] = useFormState<{
    apikey: string;
    history: boolean;
    advanced: boolean;
    host: string;
  }>(
    {
      apikey: extensionSettingsState.apikey,
      history: extensionSettingsState.history,
      advanced: extensionSettingsState.advanced,
      host:
        (extensionSettingsState.advanced &&
          extensionSettingsState.host.hostUrl) ||
        '',
    },
    {
      withIds: true, // enable automatic creation of id and htmlFor props
    }
  );

  const {
    errors: formStateErrors,
    values: formStateValues,
    validity: formStateValidity,
    setField: setFormStateField,
    setFieldError: setFormStateFieldError,
  } = formState;

  console.log(formState.values);

  function handleApiKeyInputChange(apikey: string): void {
    setFormStateField('apikey', apikey);
    // ToDo: Remove special symbols

    if (!(apikey.trim().length > 0)) {
      setFormStateFieldError('apikey', 'API key missing');
    } else if (apikey && apikey.trim().length < 40) {
      setFormStateFieldError('apikey', 'API key must be 40 characters');
    } else if (apikey && apikey.trim().length > 40) {
      setFormStateFieldError('apikey', 'API key cannot exceed 40 characters');
    }
  }

  function handleHostUrlInputChange(host: string): void {
    if (!formStateValues.advanced) {
      setFormStateFieldError('host', 'Enable Advanced Options first');

      return;
    }

    setFormStateField('host', host);

    if (!(host.trim().length > 0)) {
      setFormStateFieldError('host', 'Custom URL cannot be empty');

      return;
    }

    if (!isValidUrl(host.trim()) || host.trim().length < 10) {
      setFormStateFieldError('host', 'Please enter a valid url');
    }
  }

  return (
    <>
      <div tw="mt-4">
        <div tw="flex flex-col text-sm">
          <label {...labelProps('apikey')} tw="mb-2 font-bold">
            API Key
            <small tw="tracking-normal lowercase">
              {/* ToDo: */}
              <a href="#" tw="ml-2 text-blue-500 no-underline">
                get one?
              </a>
            </small>
          </label>

          <div tw="relative">
            <div tw="absolute top-0 right-0 flex w-10 h-full border border-transparent">
              <Icon
                tw="z-10 cursor-pointer flex items-center justify-center w-full h-full text-gray-600 rounded-tl rounded-bl"
                onClick={(): void => setShowApiKey(!showApiKey)}
                name={!showApiKey ? 'eye-closed' : 'eye'}
              />
            </div>

            <input
              {...passwordProps('apikey')}
              type={!showApiKey ? 'password' : 'text'}
              onChange={({
                target: {value},
              }: React.ChangeEvent<HTMLInputElement>): void => {
                // NOTE: overriding onChange to show errors
                handleApiKeyInputChange(value.trim());
              }}
              spellCheck="false"
              css={[
                tw`sm:text-base focus:border-indigo-400 focus:outline-none relative w-full py-2 pl-2 pr-12 text-sm placeholder-gray-400 bg-gray-200 border rounded`,

                formStateValidity.apikey !== undefined &&
                  !formStateValidity.apikey &&
                  tw`border-red-500`,
              ]}
            />
          </div>

          <span tw="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            {formStateErrors.apikey}
          </span>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={!true}
          onClick={(): void => {
            //
          }}
          css={[
            tw`hover:bg-blue-700 focus:outline-none block px-4 py-2 mt-3 mb-1 text-xs font-semibold text-center text-white bg-purple-700 rounded shadow-lg`,

            css`
              background: linear-gradient(
                to right,
                rgb(126, 87, 194),
                rgb(98, 0, 234)
              );
            `,
          ]}
        >
          Validate
        </button>
      </div>

      <div tw="flex flex-col mt-6">
        <label
          {...labelProps('history')}
          tw="flex justify-between items-center mt-3 cursor-pointer"
        >
          <span tw="text-sm">Keep History</span>

          <span tw="relative ml-3">
            <span tw="block w-10 h-6 bg-gray-400 rounded-full shadow-inner" />
            <span
              css={[
                tw`focus-within:shadow-outline absolute inset-y-0 left-0 block w-4 h-4 mt-1 ml-1 transition-transform duration-300 ease-in-out rounded-full shadow`,

                !formStateValues.history
                  ? tw`bg-white`
                  : tw`transform translate-x-full bg-purple-600`,
              ]}
            >
              <input
                {...checkboxProps('history')}
                tw="absolute w-0 h-0 opacity-0"
              />
            </span>
          </span>
        </label>

        <label
          {...labelProps('advanced')}
          tw="flex justify-between items-center mt-3 cursor-pointer"
        >
          <span tw="text-sm">Show Advanced Options</span>

          <span tw="relative ml-3">
            <span tw="block w-10 h-6 bg-gray-400 rounded-full shadow-inner" />
            <span
              css={[
                tw`focus-within:shadow-outline absolute inset-y-0 left-0 block w-4 h-4 mt-1 ml-1 transition-transform duration-300 ease-in-out rounded-full shadow`,

                !formStateValues.advanced
                  ? tw`bg-white`
                  : tw`transform translate-x-full bg-purple-600`,
              ]}
            >
              <input
                {...checkboxProps('advanced')}
                tw="absolute w-0 h-0 opacity-0"
              />
            </span>
          </span>
        </label>

        <div css={[tw`mt-4`, !formStateValues.advanced && tw`invisible`]}>
          <div tw="flex flex-col text-sm">
            <label {...labelProps('host')} tw="mb-2 font-bold">
              Custom Host
            </label>

            <div tw="relative">
              <input
                {...textProps('host')}
                onChange={({
                  target: {value},
                }: React.ChangeEvent<HTMLInputElement>): void => {
                  // NOTE: overriding onChange to show errors
                  handleHostUrlInputChange(value.trim());
                }}
                spellCheck="false"
                css={[
                  tw`sm:text-base focus:border-indigo-400 focus:outline-none relative w-full py-2 pl-2 pr-12 text-sm placeholder-gray-400 bg-gray-200 border rounded`,

                  formStateValidity.host !== undefined &&
                    !formStateValidity.host &&
                    tw`border-red-500`,
                ]}
              />
            </div>

            <span tw="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
              {formStateErrors.host}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
