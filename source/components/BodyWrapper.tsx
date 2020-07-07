import React from 'react';
import 'twin.macro';

type WrapperProperties = {
  children: React.ReactChild;
};

const BodyWrapper: React.FC<WrapperProperties> = ({children}) => {
  // ToDo: get from props
  const isLoading = false;

  return (
    <>
      <div tw="w-full">{isLoading ? 'Loading...' : children}</div>
    </>
  );
};

export default BodyWrapper;
