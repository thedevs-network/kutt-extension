import React from 'react';

const Clock: React.FC = () => {
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
      className="clock_svg__feather clock_svg__feather-clock"
    >
      <circle cx={12} cy={12} r={10} />
      <path d="M12 6v6l4 2" />
    </svg>
  );
};

export default React.memo(Clock);
