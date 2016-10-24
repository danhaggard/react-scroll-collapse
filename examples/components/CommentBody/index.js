import React, {PropTypes} from 'react';
import styles from './CommentBody.scss';

const CommentBody = (props) => {
  const {text} = props;
  return (
    <div className={styles.commentBody}>
      {text}
    </div>
  );
};

CommentBody.propTypes = {
  text: PropTypes.string,
};

export default CommentBody;
