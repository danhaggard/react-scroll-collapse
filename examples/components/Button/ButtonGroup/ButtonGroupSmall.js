import React from 'react';
import ButtonGroup from '.';
import styles from './ButtonGroup.scss';

const ButtonGroupSmall = props => <ButtonGroup {...props} appendClassName={styles.small} />;

export default React.memo(ButtonGroupSmall);
