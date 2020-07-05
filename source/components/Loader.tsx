import React from 'react';
import tw, {css} from 'twin.macro';

import Icon from './Icon';

const Loader: React.FC = (props) => {
  return (
    <div
      css={[
        tw`fixed flex items-center justify-center h-full`,

        css`
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `,
      ]}
      {...props}
    >
      <Icon name="spinner" />
    </div>
  );
};

export default Loader;
