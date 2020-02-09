import React from 'react';

const ArrowLeft: React.FC = () => {
    return (
        <svg
            viewBox="-5 -5 24 24"
            width={24}
            height={24}
            preserveAspectRatio="xMinYMin"
            className="arrow-left_svg__jam arrow-left_svg__jam-arrow-left"
        >
            <path d="M3.414 7.657l3.95 3.95A1 1 0 015.95 13.02L.293 7.364a.997.997 0 010-1.414L5.95.293a1 1 0 111.414 1.414l-3.95 3.95H13a1 1 0 010 2H3.414z" />
        </svg>
    );
};

export default React.memo(ArrowLeft);
