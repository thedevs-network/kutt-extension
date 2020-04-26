import React, {useState, useEffect} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

import Icon from '../components/Icon';
import {removeProtocol} from '../util/link';

export type ProcessedRequestProperties = {
  error: boolean | null;
  message: string;
};

type PopupBodyProperties = {
  requestProcessed: ProcessedRequestProperties;
};

const PopupBody: React.FC<PopupBodyProperties> = ({
  requestProcessed: {message, error},
}) => {
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
        {!error ? (
          <>
            <Icon
              className="icon qr__icon"
              name="qrcode"
              onClick={(): void => {
                return setQRView(!QRView);
              }}
            />
            {!copied ? (
              <CopyToClipboard
                text={message}
                onCopy={(): void => {
                  return setCopied(true);
                }}
              >
                <Icon className="icon copy__icon" name="copy" />
              </CopyToClipboard>
            ) : (
              <Icon className="icon check__icon" name="tick" />
            )}
            <CopyToClipboard
              text={message}
              onCopy={(): void => {
                return setCopied(true);
              }}
            >
              <h1 className="link">{removeProtocol(message)}</h1>
            </CopyToClipboard>
          </>
        ) : (
          <p>{message}</p>
        )}
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
