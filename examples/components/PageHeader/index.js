import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from '../Button/ButtonGroup';

import styles from './PageHeader.scss';

const PageHeader = ({ leftClick, rightClick }) => (
  <header className={styles.header}>
    <h1 className={styles.pageTitle}>react-scroll-collapse - Examples</h1>
    <div className={styles.codelink}>
      <a href="https://github.com/danhaggard/react-scroll-collapse">View code on Github</a>
    </div>
    <ButtonGroup
      leftClick={leftClick}
      rightClick={rightClick}
      leftText="Prev Example"
      rightText="Next Example"
    />
  </header>
);

PageHeader.propTypes = {
  leftClick: PropTypes.func.isRequired,
  rightClick: PropTypes.func.isRequired,
};

export default React.memo(PageHeader);
