import React from 'react';

const StarYellow: React.FC = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="#ecc94b"
    stroke="#ecc94b"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="star_svg__feather star_svg__feather-star"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default React.memo(StarYellow);
