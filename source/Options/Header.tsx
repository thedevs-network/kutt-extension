import React from 'react';
import 'twin.macro';

const Header: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default React.memo(Header);
