import React from 'react';

import BodyWrapper from '../components/BodyWrapper';
import Form from './Form';

const Popup: React.FC = () => {
  return (
    <BodyWrapper>
      <div id="popup">
        <Form />
      </div>
    </BodyWrapper>
  );
};

export default Popup;
