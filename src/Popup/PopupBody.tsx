import React from 'react';

export type ProcessedRequestProperties = {
    error: boolean | null;
    message: string;
};

type PopupBodyProperties = {
    requestProcessed: ProcessedRequestProperties;
};

const PopupBody: React.FC<PopupBodyProperties> = ({ requestProcessed: { message } }) => {
    return (
        <>
            <div>
                <p>{message}</p>
            </div>
        </>
    );
};

export default PopupBody;
