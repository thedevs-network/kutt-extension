import React from 'react';

const Tick: React.FC = () => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check_svg__feather check_svg__feather-check"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
};

export default React.memo(Tick);
