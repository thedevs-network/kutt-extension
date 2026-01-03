import {QRCodeSVG} from 'qrcode.react';
import {Dispatch, SetStateAction} from 'react';

import styles from './Modal.module.scss';

type Props = {
  link: string;
  setModalView: Dispatch<SetStateAction<boolean>>;
};

function Modal({link, setModalView}: Props) {
  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.qrCodeWrapper}>
            <QRCodeSVG size={196} value={link} />
          </div>

          <div className={styles.buttonWrapper}>
            <button
              onClick={(): void => setModalView(false)}
              className={styles.closeButton}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
