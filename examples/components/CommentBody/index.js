import React from 'react';
import PropTypes from 'prop-types';

import styles from './CommentBody.scss';

const CommentBody = (props) => {
  const { text } = props;
  return (
    <div className={styles.commentBody}>
      {text}
    </div>
  );
};

CommentBody.propTypes = {
  text: PropTypes.string.isRequired,
};

export default React.memo(CommentBody);
