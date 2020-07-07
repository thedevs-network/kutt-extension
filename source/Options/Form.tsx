import React from 'react';
import tw, {css} from 'twin.macro';

const Form: React.FC = () => {
  return (
    <>
      <div tw="mt-4">
        <div tw="flex flex-col text-sm">
          <label htmlFor="title" tw="mb-2 font-bold">
            API Key
            <small tw="tracking-normal lowercase">
              <a href="#" tw="ml-2 text-blue-500 no-underline">
                get one?
              </a>
            </small>
          </label>
          <input tw="sm:text-base focus:border-indigo-400 focus:outline-none relative w-full py-2 pl-2 pr-12 text-sm placeholder-gray-400 bg-gray-200 border rounded" />
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
          htmlFor="checked"
          tw="flex justify-between items-center mt-3 cursor-pointer"
        >
          <span tw="text-sm">Keep History</span>

          <span tw="relative ml-3">
            <span tw="block w-10 h-6 bg-gray-400 rounded-full shadow-inner" />
            <span tw="focus-within:shadow-outline absolute inset-y-0 left-0 block w-4 h-4 mt-1 ml-1 transition-transform duration-300 ease-in-out bg-white rounded-full shadow">
              <input
                id="unchecked"
                type="checkbox"
                tw="absolute w-0 h-0 opacity-0"
              />
            </span>
          </span>
        </label>

        <label
          htmlFor="unchecked"
          tw="flex justify-between items-center mt-3 cursor-pointer"
        >
          <span tw="text-sm">Show Advanced Options</span>

          <span tw="relative ml-3">
            <span tw="block w-10 h-6 bg-gray-400 rounded-full shadow-inner" />
            <span tw="focus-within:shadow-outline absolute inset-y-0 left-0 block w-4 h-4 mt-1 ml-1 transition-transform duration-300 ease-in-out transform translate-x-full bg-purple-600 rounded-full shadow">
              <input
                id="checked"
                type="checkbox"
                tw="absolute w-0 h-0 opacity-0"
              />
            </span>
          </span>
        </label>

        <div tw="mt-4 invisible">
          <div tw="flex flex-col text-sm">
            <label htmlFor="title" tw="mb-2 font-bold">
              Custom Host
            </label>
            <input tw="sm:text-base focus:border-indigo-400 focus:outline-none relative w-full py-2 pl-2 pr-12 text-sm placeholder-gray-400 bg-gray-200 border rounded" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
