import extendAndForwardRef from '../../../../src/utils/extendAndForwardRef';

import ButtonBase from './ButtonBase';
import styles from './ButtonBase.scss';

const ButtonBaseRef = extendAndForwardRef(ButtonBase, {
  defaultClassName: styles.button
});

export default ButtonBaseRef;
