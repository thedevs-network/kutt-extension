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
            <div className="popup__body">
                {!error && (
                    <div>
                        <button
                            className="icon__button"
                            type="button"
                            onClick={(): void => {
                                return setQRView(!QRView);
                            }}
                        >
                            <Icon className="qr__icon" name="qrcode" />
                        </button>

                        <CopyToClipboard
                            text={message}
                            onCopy={(): void => {
                                return setCopied(true);
                            }}
                        >
                            {!copied ? (
                                <button className="icon__button" type="button">
                                    <Icon className="copy__icon" name="copy" />
                                </button>
                            ) : (
                                <button type="button">
                                    <Icon name="tick" />
                                </button>
                            )}
                        </CopyToClipboard>
                    </div>
                )}

                <p>{message}</p>
            </div>

            {!error && QRView && (
                <div className="qr__holder">
                    <QRCode size={128} value={message} />
                </div>
            )}
        </>
    );
};

export default PopupBody;
