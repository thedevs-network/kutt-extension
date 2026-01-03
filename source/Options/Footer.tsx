import {memo} from 'react';
import clsx from 'clsx';

import {detectBrowser} from '../util/browser';
import {StoreLinks} from '../Background';

import Icon from '../components/Icon';

import styles from './Footer.module.scss';

function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.ratingSection}>
          <span className={clsx(styles.dividerLine, styles.left)} />
          <a
            href={
              detectBrowser() === 'firefox'
                ? StoreLinks.firefox
                : StoreLinks.chrome
            }
            target="_blank"
            rel="nofollow noopener noreferrer"
            className={styles.ratingLink}
          >
            <div className={styles.starsContainer}>
              <Icon className={clsx(styles.starIcon, styles.gray)} name="star-white" />
              <Icon className={clsx(styles.starIcon, styles.gray)} name="star-white" />
              <Icon className={clsx(styles.starIcon, styles.gray)} name="star-white" />
              <Icon className={clsx(styles.starIcon, styles.gray)} name="star-white" />
              <Icon className={clsx(styles.starIcon, styles.gray)} name="star-white" />
            </div>
            <p className={styles.ratingText}>Rate on Store</p>
          </a>
          <span className={clsx(styles.dividerLine, styles.right)} />
        </div>

        <div className={styles.linksSection}>
          <a
            href="https://kutt.it"
            target="blank"
            rel="nofollow noopener noreferrer"
            className={clsx(styles.linkItem, styles.narrow)}
          >
            Kutt.it
          </a>
          <span className={styles.linkDivider} />
          <a
            href={'https://git.io/Jn5hS'}
            target="blank"
            rel="nofollow noopener noreferrer"
            className={clsx(styles.linkItem, styles.wide)}
          >
            Report an issue
          </a>
          <span className={styles.linkDivider} />
          <a
            href="https://github.com/thedevs-network/kutt-extension"
            target="blank"
            rel="nofollow noopener noreferrer"
            className={clsx(styles.linkItem, styles.narrow)}
          >
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

export default memo(Footer);
