import React from 'react';

const Refresh: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-refresh-ccw"
      viewBox="0 0 24 24"
    >
      <path d="M1 4L1 10 7 10" />
      <path d="M23 20L23 14 17 14" />
      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
    </svg>
  );
};

export default React.memo(Refresh);
