import React from 'react';

const Cross: React.FC = () => {
    return (
        <svg
            viewBox="-6 -6 24 24"
            width={24}
            height={24}
            preserveAspectRatio="xMinYMin"
            className="close_svg__jam close_svg__jam-close"
        >
            <path d="M7.314 5.9l3.535-3.536A1 1 0 109.435.95L5.899 4.485 2.364.95A1 1 0 10.95 2.364l3.535 3.535L.95 9.435a1 1 0 101.414 1.414l3.535-3.535 3.536 3.535a1 1 0 101.414-1.414L7.314 5.899z" />
        </svg>
    );
};

export default React.memo(Cross);
