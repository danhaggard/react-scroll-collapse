import React from 'react';
import Button from './ButtonBase';
import styles from './ButtonBase/ButtonBase.scss';

const ButtonSmall = props => <Button {...props} appendClassName={styles.small} />;

export default React.memo(ButtonSmall);
