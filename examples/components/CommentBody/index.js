import React from 'react';
import PropTypes from 'prop-types';

import styles from './CommentBody.scss';

const CommentBody = (props) => {
  const { isOpened, onClick, text } = props;
  return (
    <div tabIndex={isOpened ? 0 : undefined} role="button" onClick={onClick} className={styles.commentBody}>
      {text}
    </div>
  );
};

CommentBody.propTypes = {
  text: PropTypes.string.isRequired,
};

CommentBody.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentBody'
};

export default React.memo(CommentBody);
