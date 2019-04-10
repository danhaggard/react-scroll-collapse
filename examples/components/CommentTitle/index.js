import React from 'react';
import PropTypes from 'prop-types';
import styles from './CommentTitle.scss';

const CommentTitle = (props) => {
  const { title, isOpened } = props;
  const button = isOpened ? '-' : '+';
  return (
    <div className={styles.commentTitle}>
      <span>{button}</span>
      <span>{title}</span>
    </div>
  );
};

CommentTitle.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default CommentTitle;
