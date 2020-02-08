import React from 'react';

import { ProcessRequestProperties } from './Popup';

export type ProcessedRequestProperties = {
    error: boolean | null;
    message: string;
};

type PopupBodyProperties = {
    requestProcessed: ProcessedRequestProperties;
    setRequestProcessed: ProcessRequestProperties;
};

const PopupBody: React.FC<PopupBodyProperties> = ({ requestProcessed: { message }, setRequestProcessed }) => {
    return (
        <>
            <div>
                <button
                    type="button"
                    onClick={(): void => {
                        return setRequestProcessed({ error: null, message: '' });
                    }}
                >
                    Go Back
                </button>
                <p>{message}</p>
            </div>
        </>
    );
};

export default PopupBody;
