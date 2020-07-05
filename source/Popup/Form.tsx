import {useFormState} from 'react-use-form-state';
import tw from 'twin.macro';
import React from 'react';

const Form: React.FC = () => {
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
  }>(null, {
    withIds: true, // enable automatic creation of id and htmlFor props
  });
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

  async function handleSubmit(): Promise<void> {
    console.log('submitted', formState.values);
  }

  return (
    <>
      <div tw="flex flex-col w-full max-w-sm p-4 mx-auto bg-white border border-gray-200 shadow">
        <div tw="flex flex-col mb-4">
          <label
            {...labelProps('domain')}
            tw="sm:text-sm mb-1 text-xs tracking-wide text-gray-600"
          >
            Domain:
          </label>

          <div tw="relative">
            <select
              {...selectProps('domain')}
              tw="sm:text-base focus:border-indigo-400 focus:outline-none relative w-full px-2 py-2 text-sm placeholder-gray-400 border rounded"
            >
              <option value="select" selected>
                -- Choose Domain --
              </option>
              <option value="bug">report a bug</option>
              <option value="feature">Request a feature</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
        </div>

        <div tw="flex flex-col mb-4">
          <label
            {...labelProps('customurl')}
            tw="sm:text-sm mb-1 text-xs tracking-wide text-gray-600"
          >
            customDomain/
          </label>

          <div tw="relative">
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
                tw`sm:text-base focus:border-indigo-400 focus:outline-none relative w-full py-2 pl-2 pr-12 text-sm placeholder-gray-400 border rounded`,
                formStateValidity.customurl !== undefined &&
                  !formStateValidity.customurl &&
                  tw`border-red-500`,
              ]}
            />
          </div>

          <span tw="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            {formStateErrors.customurl}
          </span>
        </div>

        <div tw="flex flex-col mb-4">
          <label
            {...labelProps('password')}
            spellCheck="false"
            tw="sm:text-sm mb-1 text-xs tracking-wide text-gray-600"
          >
            Password:
          </label>

          <div tw="relative">
            <div tw="absolute top-0 right-0 flex w-10 h-full border border-transparent">
              <div tw="z-10 flex items-center justify-center w-full h-full text-lg text-gray-600 bg-gray-100 rounded-tl rounded-bl">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  tw="w-5 h-5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <input
              {...passwordProps('password')}
              onChange={({
                target: {value},
              }: React.ChangeEvent<HTMLInputElement>): void => {
                // NOTE: overriding onChange to show errors
                handlePasswordInputChange(value.trim());
              }}
              css={[
                tw`sm:text-base focus:border-indigo-400 focus:outline-none relative w-full py-2 pl-2 pr-12 text-sm placeholder-gray-400 border rounded`,
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
          onClick={handleSubmit}
          tw="block w-full px-2 py-2 mt-4 mb-1 text-base font-semibold text-white bg-purple-700 rounded"
        >
          Create
        </button>
      </div>
    </>
  );
};
export default Form;
