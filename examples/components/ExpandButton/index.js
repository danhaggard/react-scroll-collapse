import React from 'react';
import PropTypes from 'prop-types';
import forwardRefWrapper from '../../../src/utils/forwardRef';
import CommentTitle from '../CommentTitle';
import style from './ExpandButton.scss';

const ExpandButton = ({
  forwardRef,
  isOpened,
  onClick,
  onKeyDown,
  title
}) => (
  <div
    className={style.expandButton}
    key={title}
    // onClick={onClick}
    // onKeyDown={onKeyDown}
    ref={forwardRef}
    // role="button"
    // tabIndex={0}
    // type="button"
  >
    <CommentTitle title={title} isOpened={isOpened} />
  </div>
);

ExpandButton.defaultProps = {
  forwardRef: {},
  onClick: () => undefined,
  onKeyDown: () => undefined,
  title: '',
};

ExpandButton.propTypes = {
  forwardRef: PropTypes.object,
  isOpened: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  title: PropTypes.string,
};

export default forwardRefWrapper(ExpandButton, 'forwardRef');
