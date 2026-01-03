import Icon from './Icon';
import styles from './Loader.module.scss';

function Loader() {
  return (
    <div className={styles.loader}>
      <Icon name="spinner" />
    </div>
  );
}

export default Loader;
