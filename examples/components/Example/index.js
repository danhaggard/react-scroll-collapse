import React from 'react';
import PropTypes from 'prop-types';
import { ofChildrenType } from '../../../src/utils/propTypeHelpers';
import styles from './Example.scss';

const Example = ({ children, title, text }) => (
  <div className={styles.example}>
    <div className={styles.header}>
      <h2>{ title }</h2>
      <p>{ text }</p>
    </div>
    { children }
  </div>
);

Example.defaultProps = {
  children: [],
};

Example.propTypes = {
  children: ofChildrenType,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default React.memo(Example);
