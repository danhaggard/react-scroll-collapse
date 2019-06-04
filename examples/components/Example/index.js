import React from 'react';
import PropTypes from 'prop-types';
import { ofChildrenType } from '../../../src/utils/propTypeHelpers';
import styles from './Example.scss';

const Example = ({
  children,
  style,
  title,
  text,
  showHeader,
}) => (
  <div className={styles.example} style={style}>
    {
      showHeader && (
        <div className={styles.header}>
          <h2>{ title }</h2>
          <p>{ text }</p>
        </div>
      )
    }
    { children }
  </div>
);

Example.defaultProps = {
  children: [],
  showHeader: true,
  style: {},
};

Example.propTypes = {
  children: ofChildrenType,
  showHeader: PropTypes.bool,
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default React.memo(Example);
