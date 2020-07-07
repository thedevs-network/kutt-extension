import React from 'react';
import 'twin.macro';

import BodyWrapper from '../components/BodyWrapper';
import Footer from './Footer';
import Form from './Form';

const Options: React.FC = () => {
  return (
    <>
      <BodyWrapper>
        <div
          id="options"
          tw="h-screen flex justify-center px-6 py-8 bg-gray-200"
        >
          <div tw="md:rounded-lg max-w-lg px-16 py-10 my-6 mx-12 bg-white">
            <header tw="flex items-center justify-center pb-4">
              <img
                tw="w-8 h-8"
                width="32"
                height="32"
                src="assets/logo.png"
                alt="logo"
              />

              <h1 tw="font-medium text-3xl ml-1 text-center mb-0">Kutt</h1>
            </header>

            <Form />

            <Footer />
          </div>
        </div>
      </BodyWrapper>
    </>
  );
};

export default Options;
