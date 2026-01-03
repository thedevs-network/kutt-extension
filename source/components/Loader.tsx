import type {JSX} from 'react';
import Icon from './Icon';
import styles from './Loader.module.scss';

function Loader(): JSX.Element {
  return (
    <div className={styles.loader}>
      <Icon name="spinner" />
    </div>
  );
}

export default Loader;
