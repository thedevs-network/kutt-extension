import React from 'react';

const ArrowLeft: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M19 12H6m6-7l-7 7 7 7" />
    </svg>
  );
};

export default React.memo(ArrowLeft);
