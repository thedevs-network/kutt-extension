import {memo} from 'react';

import styles from './Header.module.scss';

type Props = {
  subtitle?: string;
};

function Header({subtitle = 'Extension Settings'}: Props) {
  return (
    <header className={styles.header}>
      <a
        href="https://kutt.it"
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
