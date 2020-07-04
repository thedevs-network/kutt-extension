import React from 'react';
import 'twin.macro';

const Form: React.FC = () => {
  return (
    <>
      <div tw="flex flex-col w-full max-w-sm p-4 mx-auto bg-white border border-gray-200 shadow">
        <div tw="flex flex-col mb-4">
          <label
            htmlFor="domain"
            tw="sm:text-sm mb-1 text-xs tracking-wide text-gray-600"
          >
            Domain:
          </label>

          <div tw="relative">
            <select tw="sm:text-base focus:border-indigo-400 focus:outline-none relative w-full px-2 py-2 text-sm placeholder-gray-400 border rounded">
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
            htmlFor="customurl"
            tw="sm:text-sm mb-1 text-xs tracking-wide text-gray-600"
          >
            customDomain/
          </label>

          <div tw="relative">
            <input
              name="customurl"
              type="text"
              value=""
              tw="sm:text-base focus:border-indigo-400 focus:outline-none relative w-full px-2 py-2 text-sm placeholder-gray-400 border rounded"
            />
          </div>
        </div>

        <div tw="flex flex-col mb-4">
          <label
            htmlFor="password"
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
              name="password"
              type="password"
              value=""
              tw="sm:text-base focus:border-indigo-400 focus:outline-none relative w-full py-2 pl-2 pr-12 text-sm placeholder-gray-400 border border-red-500 rounded"
            />
          </div>

          <span tw="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            Invalid username field !
          </span>
        </div>

        <button
          type="submit"
          disabled={true}
          tw="block w-full px-2 py-2 mt-4 mb-1 text-base font-semibold text-white bg-purple-700 rounded"
        >
          Create
        </button>
      </div>
    </>
  );
};
export default Form;
