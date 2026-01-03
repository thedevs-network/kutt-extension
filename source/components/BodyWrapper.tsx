import type {ReactNode} from 'react';
import styles from './BodyWrapper.module.scss';

type WrapperProperties = {
  children: ReactNode;
};

function BodyWrapper({children}: WrapperProperties) {
  return <div className={styles.wrapper}>{children}</div>;
}

export default BodyWrapper;
