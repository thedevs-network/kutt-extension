import React from 'react';

import BodyWrapper from '../components/BodyWrapper';
import PopupForm from './PopupForm';

const Popup = (): JSX.Element => {
    return (
        <BodyWrapper>
            <PopupForm defaultDomainId="1" />
        </BodyWrapper>
    );
};

export default Popup;
