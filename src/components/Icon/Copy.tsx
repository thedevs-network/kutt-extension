import React from 'react';

const Copy: React.FC = () => {
    return (
        <svg
            viewBox="-3 -2 24 24"
            width={24}
            height={24}
            preserveAspectRatio="xMinYMin"
            className="files_svg__jam files_svg__jam-files"
        >
            <path d="M6 15H2a2 2 0 01-2-2V2a2 2 0 012-2h8a2 2 0 012 2v3h3l3 3v10a2 2 0 01-2 2H8a2 2 0 01-2-2v-3zm0-2V7a2 2 0 012-2h2V2H2v11h4zm8.172-6H8v11h8V8.828L14.172 7z" />
        </svg>
    );
};

export default React.memo(Copy);
