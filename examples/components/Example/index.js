import React from 'react';
import PropTypes from 'prop-types';
import { ofChildrenType } from '../../../src/utils/propTypeHelpers';
import styles from './Example.scss';

const Example = ({
  children,
  style,
  title,
  text
}) => (
  <div className={styles.example} style={style}>
    <div className={styles.header}>
      <h2>{ title }</h2>
      <p>{ text }</p>
    </div>
    { children }
  </div>
);

Example.defaultProps = {
  children: [],
  style: {},
};

Example.propTypes = {
  children: ofChildrenType,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default React.memo(Example);
