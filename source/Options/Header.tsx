import type {JSX} from 'react';
import {memo} from 'react';

import {Kutt} from '../Background';

import styles from './Header.module.scss';

type Props = {
  subtitle?: string;
  hostUrl?: string;
};

function Header({
  subtitle = 'Extension Settings',
  hostUrl = Kutt.hostUrl,
}: Props): JSX.Element {
  return (
    <header className={styles.header}>
      <a
        href={hostUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logoContainer}
      >
        <img
          className={styles.logo}
          width="40"
          height="40"
          src="../assets/logo.png"
          alt="logo"
        />
        <h1 className={styles.title}>Kutt</h1>
      </a>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
}

export default memo(Header);
