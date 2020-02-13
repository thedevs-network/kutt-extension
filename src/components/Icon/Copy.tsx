import React from 'react';

const Copy: React.FC = () => {
    return (
        <svg
            viewBox="-2 -2 30 30"
            width={20}
            height={20}
            fill="none"
            strokeWidth="2"
            stroke="#b9b9b9"
            strokeLinecap="round"
            strokeLinejoin="round"
            preserveAspectRatio="xMinYMin"
        >
            <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
    );
};

export default React.memo(Copy);
