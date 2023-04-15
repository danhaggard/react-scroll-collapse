import React from 'react';
import PropTypes from 'prop-types';
import { ofBoolTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import styles from './CommentBody.scss';

const CommentBody = (props) => {
  const { isOpened, onClick, onKeyDown, text } = props;
  return (
    <div
      tabIndex={isOpened ? 0 : undefined}
      role="button"
      onPointerDown={onClick}
      onKeyDown={onKeyDown}
      className={styles.commentBody}
    >
      {text}
    </div>
  );
};

CommentBody.defaultProps = {
  onClick: () => null,
  onKeyDown: () => null,
  isOpened: null,
};

CommentBody.propTypes = {
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  isOpened: ofBoolTypeOrNothing,
  text: PropTypes.string.isRequired,
};

CommentBody.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentBody'
};

export default React.memo(CommentBody);
