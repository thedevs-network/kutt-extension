import React from 'react';

import BodyWrapper from '../components/BodyWrapper';
import OptionsForm from './OptionsForm';

const Options: React.FC = () => {
    return (
        <BodyWrapper>
            <div id="options">
                <OptionsForm />
            </div>
        </BodyWrapper>
    );
};

export default Options;
