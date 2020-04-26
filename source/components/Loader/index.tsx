import React from 'react';

import './styles.scss';
import Icon from '../Icon';

const Loader: React.FC = (props) => {
  return (
    <div id="loader" {...props}>
      <Icon name="spinner" />
    </div>
  );
};

export default Loader;
