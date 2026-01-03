import {memo} from 'react';

import styles from './Header.module.scss';

function Header() {
  return (
    <>
      <header className={styles.header}>
        <img
          className={styles.logo}
          width="32"
          height="32"
          src="../assets/logo.png"
          alt="logo"
        />

        <h1 className={styles.title}>Kutt</h1>
      </header>
    </>
  );
}

export default memo(Header);
