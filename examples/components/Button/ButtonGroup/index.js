import extendAndForwardRef from '../../../../src/utils/extendAndForwardRef';

import ButtonGroup from './ButtonGroup';
import styles from './ButtonGroup.scss';

const ButtonGroupRef = extendAndForwardRef(ButtonGroup, {
  defaultClassName: styles.buttonGroup
});

export default ButtonGroupRef;
