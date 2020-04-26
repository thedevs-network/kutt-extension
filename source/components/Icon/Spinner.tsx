import React from 'react';

import './styles.scss';

const Spinner: React.FC = () => {
  return (
    <>
      <svg
        id="spinner"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="#b8b8b8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="feather feather-loader"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L12 6" />
        <path d="M12 18L12 22" />
        <path d="M4.93 4.93L7.76 7.76" />
        <path d="M16.24 16.24L19.07 19.07" />
        <path d="M2 12L6 12" />
        <path d="M18 12L22 12" />
        <path d="M4.93 19.07L7.76 16.24" />
        <path d="M16.24 7.76L19.07 4.93" />
      </svg>
    </>
  );
};

export default React.memo(Spinner);
