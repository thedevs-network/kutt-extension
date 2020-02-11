import React, { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Icon from '../components/Icon';
import { ProcessRequestProperties } from './Popup';

export type ProcessedRequestProperties = {
    error: boolean | null;
    message: string;
};

type PopupBodyProperties = {
    requestProcessed: ProcessedRequestProperties;
    setRequestProcessed: ProcessRequestProperties;
};

const PopupBody: React.FC<PopupBodyProperties> = ({ requestProcessed: { message, error }, setRequestProcessed }) => {
    const [copied, setCopied] = useState<boolean>(false);

    // reset copy message
    useEffect(() => {
        setTimeout(() => {
            setCopied(false);
        }, 1300);
    }, [copied]);

    return (
        <>
            <div>
                {!error && (
                    <button
                        type="button"
                        onClick={(): void => {
                            return setRequestProcessed({ error: null, message: '' });
                        }}
                    >
                        <Icon name="arrowleft" />
                    </button>
                )}
                <p>{message}</p>
                {/* // ToDo: show only on successful url shortening */}
                {!error && (
                    <div>
                        <CopyToClipboard
                            text={message}
                            onCopy={(): void => {
                                return setCopied(true);
                            }}
                        >
                            {!copied ? (
                                <button type="button">
                                    <Icon name="copy" />
                                </button>
                            ) : (
                                <Icon name="tick" />
                            )}
                        </CopyToClipboard>
                    </div>
                )}
            </div>
        </>
    );
};

export default PopupBody;
