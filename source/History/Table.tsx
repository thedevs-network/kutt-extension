import CopyToClipboard from 'react-copy-to-clipboard';
import {useEffect, useState} from 'react';
import clsx from 'clsx';

import {
  useShortenedLinks,
  ShortenedLinksActionTypes,
} from '../contexts/shortened-links-context';
import {MAX_HISTORY_ITEMS} from '../Background/constants';

import Icon from '../components/Icon';
import Modal from './Modal';

import styles from './Table.module.scss';

function Table() {
  const [shortenedLinksState, shortenedLinksDispatch] = useShortenedLinks();
  const [QRView, setQRView] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // reset copy message
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    timer = setTimeout(() => {
      setCopied(false);
      // reset selected id from context
    }, 1300);

    return (): void => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [copied]);

  function handleCopyToClipboard(selectedItemId: string): void {
    shortenedLinksDispatch({
      type: ShortenedLinksActionTypes.SET_CURRENT_SELECTED,
      payload: selectedItemId,
    });

    setCopied(true);
  }

  function handleQRCodeViewToggle(selectedItemId: string): void {
    shortenedLinksDispatch({
      type: ShortenedLinksActionTypes.SET_CURRENT_SELECTED,
      payload: selectedItemId,
    });

    setQRView(true);
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>
              Recent shortened links. (last {MAX_HISTORY_ITEMS} results)
            </h2>
          </div>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.theadRow}>
                <th className={clsx(styles.th, styles.thOriginal)}>
                  Original URL
                </th>
                <th className={clsx(styles.th, styles.thShort)}>Short URL</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {!(shortenedLinksState.total === 0) ? (
                shortenedLinksState.items.map((item) => {
                  return (
                    <tr key={item.id} className={styles.tr}>
                      <td className={clsx(styles.td, styles.tdOriginal)}>
                        <a
                          className={styles.link}
                          href={item.target}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                        >
                          {item.target}
                        </a>
                      </td>

                      <td className={clsx(styles.td, styles.tdShort)}>
                        {copied &&
                          shortenedLinksState.selected?.id === item.id && (
                            <div className={styles.copiedNotification}>
                              Copied to clipboard!
                            </div>
                          )}

                        <div className={styles.shortUrlWrapper}>
                          <a
                            className={styles.link}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                          >
                            {item.link}
                          </a>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <div className={styles.actionsWrapper}>
                          {/* // **** COPY TO CLIPBOARD **** // */}

                          {copied &&
                          shortenedLinksState.selected?.id === item.id ? (
                            <Icon name="tick" className={styles.actionIcon} />
                          ) : (
                            <CopyToClipboard
                              text={item.link}
                              onCopy={(): void => {
                                return handleCopyToClipboard(item.id);
                              }}
                            >
                              <Icon name="copy" className={styles.actionIcon} />
                            </CopyToClipboard>
                          )}

                          <Icon
                            onClick={(): void =>
                              handleQRCodeViewToggle(item.id)
                            }
                            className={styles.actionIcon}
                            name="qrcode"
                          />
                        </div>

                        {/* // **** QR CODE MODAL **** // */}
                        {QRView &&
                          shortenedLinksState.selected?.id === item.id && (
                            <Modal link={item.link} setModalView={setQRView} />
                          )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className={styles.emptyRow}>No URLs History</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Table;
