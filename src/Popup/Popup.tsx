import React from 'react';

import BodyWrapper from '../components/BodyWrapper';
import PopupForm from './PopupForm';

type FormValuesProperties = {
    domain: string;
    customurl?: string;
    password?: string;
};

const Popup = (): JSX.Element => {
    return (
        <BodyWrapper>
            <PopupForm />
        </BodyWrapper>
    );
};

export default Popup;
