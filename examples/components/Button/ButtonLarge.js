import React from 'react';

import Button from './ButtonBase';
import styles from './ButtonBase/ButtonBase.scss';

const ButtonLarge = props => <Button {...props} appendClassName={styles.large} />;

export default React.memo(ButtonLarge);
