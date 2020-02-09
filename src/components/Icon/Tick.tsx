import React from 'react';

const Check: React.FC = () => {
    return (
        <svg
            viewBox="-5 -7 24 24"
            width={24}
            height={24}
            preserveAspectRatio="xMinYMin"
            className="check_svg__jam check_svg__jam-check"
        >
            <path d="M5.486 9.73a.997.997 0 01-.707-.292L.537 5.195A1 1 0 111.95 3.78l3.535 3.535L11.85.952a1 1 0 011.415 1.414L6.193 9.438a.997.997 0 01-.707.292z" />
        </svg>
    );
};

export default React.memo(Check);
