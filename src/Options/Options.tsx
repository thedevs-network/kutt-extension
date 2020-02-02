import React from 'react';

import BodyWrapper from '../components/BodyWrapper';
import OptionsForm from './OptionsForm';

const Options: React.FC = () => {
    return (
        <BodyWrapper>
            <div>
                <OptionsForm />
            </div>
        </BodyWrapper>
    );
};

export default Options;
