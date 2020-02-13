import React from 'react';

const QRCode: React.FC = () => {
    return (
        <svg
            viewBox="-2 -2 30 30"
            width={20}
            height={20}
            fill="#b9b9b9"
            preserveAspectRatio="xMinYMin"
            className="qr-code_svg__jam qr-code_svg__jam-qr-code"
        >
            <path d="M13 18h3a2 2 0 002-2v-3a1 1 0 012 0v3a4 4 0 01-4 4H4a4 4 0 01-4-4v-3a1 1 0 012 0v3a2 2 0 002 2h3a1 1 0 010 2h6a1 1 0 010-2zM2 7a1 1 0 11-2 0V4a4 4 0 014-4h3a1 1 0 110 2H4a2 2 0 00-2 2v3zm16 0V4a2 2 0 00-2-2h-3a1 1 0 010-2h3a4 4 0 014 4v3a1 1 0 01-2 0z" />
        </svg>
    );
};

export default React.memo(QRCode);
