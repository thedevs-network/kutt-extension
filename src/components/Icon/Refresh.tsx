import React from 'react';

const Refresh: React.FC = () => {
    return (
        <svg
            viewBox="-1.5 -2.5 24 24"
            width={24}
            height={24}
            preserveAspectRatio="xMinYMin"
            className="refresh_svg__jam refresh_svg__jam-refresh"
        >
            <path d="M17.83 4.194l.42-1.377a1 1 0 111.913.585l-1.17 3.825a1 1 0 01-1.248.664l-3.825-1.17a1 1 0 11.585-1.912l1.672.511A7.381 7.381 0 003.185 6.584l-.26.633a1 1 0 11-1.85-.758l.26-.633A9.381 9.381 0 0117.83 4.194zM2.308 14.807l-.327 1.311a1 1 0 11-1.94-.484l.967-3.88a1 1 0 011.265-.716l3.828.954a1 1 0 01-.484 1.941l-1.786-.445a7.384 7.384 0 0013.216-1.792 1 1 0 111.906.608 9.381 9.381 0 01-5.38 5.831 9.386 9.386 0 01-11.265-3.328z" />
        </svg>
    );
};

export default React.memo(Refresh);
