import React from 'react';

import BodyWrapper from '../components/BodyWrapper';
import PopupForm from './PopupForm';
import PopupHeader from './Header';

import './styles.scss';

const Popup: React.FC = () => {
    return (
        <BodyWrapper>
            <div>
                <PopupHeader />
                <PopupForm defaultDomainId="1" />
            </div>
        </BodyWrapper>
    );
};

export default Popup;
