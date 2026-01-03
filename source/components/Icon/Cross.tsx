import React from 'react';

const Cross: React.FC = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="x_svg__feather x_svg__feather-x"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default React.memo(Cross);
