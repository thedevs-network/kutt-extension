import React from 'react';

type WrapperProperties = {
  children: React.ReactChild;
};

const BodyWrapper: React.FC<WrapperProperties> = ({children}) => {
  // ToDo: get from props
  const isLoading = false;

  return (
    <>
      <div>{isLoading ? 'Loading...' : children}</div>
    </>
  );
};

export default BodyWrapper;
