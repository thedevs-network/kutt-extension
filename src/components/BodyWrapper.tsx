import React from 'react';

type WrapperProperties = {
    children: React.ReactChild;
};

const BodyWrapper = ({ children }: WrapperProperties): JSX.Element => {
    // ToDo: get from props
    const isLoading = false;

    return (
        <>
            <div>{isLoading ? 'Loading...' : children}</div>
        </>
    );
};

export default BodyWrapper;
