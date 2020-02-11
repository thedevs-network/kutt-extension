import React, { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

import Icon from '../components/Icon';

export type ProcessedRequestProperties = {
    error: boolean | null;
    message: string;
};

type PopupBodyProperties = {
    requestProcessed: ProcessedRequestProperties;
};

const PopupBody: React.FC<PopupBodyProperties> = ({ requestProcessed: { message, error } }) => {
    const [copied, setCopied] = useState<boolean>(false);
    const [QRView, setQRView] = useState<boolean>(false);

    // reset copy message
    useEffect(() => {
        setTimeout(() => {
            setCopied(false);
        }, 1300);
    }, [copied]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {!error && (
                    <div>
                        <button
                            type="button"
                            onClick={(): void => {
                                return setQRView(!QRView);
                            }}
                        >
                            <Icon name="qrcode" />
                        </button>

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

                <p>{message}</p>
            </div>

            {!error && QRView && (
                <div>
                    <QRCode size={128} value={message} />
                </div>
            )}
        </>
    );
};

export default PopupBody;
