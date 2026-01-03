import CopyToClipboard from 'react-copy-to-clipboard';
import type {JSX} from 'react';
import {useState, useEffect} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import clsx from 'clsx';

import {useRequestStatus} from '../contexts/request-status-context';
import {removeProtocol} from '../util/link';
import Icon from '../components/Icon';

import styles from './ResponseBody.module.scss';

export type ProcessedRequestProperties = {
  error: boolean | null;
  message: string;
};

function ResponseBody(): JSX.Element {
  const [{error, message}] = useRequestStatus();
  const [copied, setCopied] = useState<boolean>(false);
  const [QRView, setQRView] = useState<boolean>(false);

  // reset copy message
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    timer = setTimeout(() => {
      setCopied(false);
    }, 1300);

    return (): void => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [copied]);

  return (
    <>
      <div className={styles.popupBody}>
        {!error ? (
          <>
            <Icon
              className={clsx(styles.icon, styles.qrIcon)}
              name="qrcode"
              onClick={(): void => setQRView(!QRView)}
            />

            {!copied ? (
              <CopyToClipboard
                text={message}
                onCopy={(): void => setCopied(true)}
              >
                <Icon
                  className={clsx(styles.icon, styles.copyIcon)}
                  name="copy"
                />
              </CopyToClipboard>
            ) : (
              <Icon
                className={clsx(styles.icon, styles.copyIcon)}
                name="tick"
              />
            )}

            <CopyToClipboard
              text={message}
              onCopy={(): void => setCopied(true)}
            >
              <h1 className={styles.link}>{removeProtocol(message)}</h1>
            </CopyToClipboard>
          </>
        ) : (
          <p className={styles.errorMessage}>{message}</p>
        )}
      </div>

      {!error && QRView && (
        <div className={styles.qrCodeContainer}>
          <QRCodeSVG size={128} value={message} />
        </div>
      )}
    </>
  );
}

export default ResponseBody;
