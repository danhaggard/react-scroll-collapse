import React, {PropTypes} from 'react';
import styles from './CommentTitle.scss';

const CommentTitle = (props) => {
  const {title, userName, isOpened} = props;
  const button = isOpened ? '-' : '+';
  return (
    <div className={styles.commentTitle}>
      <span>{button}</span>
      <span>{title}</span>
      <span>{userName}</span>
    </div>
  );
};

CommentTitle.propTypes = {
  title: PropTypes.string,
  userName: PropTypes.string,
  isOpened: PropTypes.bool,
};

export default CommentTitle;
