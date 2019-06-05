import React from 'react';
import PropTypes from 'prop-types';
import forwardRefWrapper from '../../../src/utils/forwardRef';
import CommentTitle from '../CommentTitle';
import style from './ExpandButton.scss';

const ExpandButton = ({
  forwardRef,
  isOpened,
  onHamburgerClick,
  onKeyDown,
  title
}) => (
  <div
    className={style.expandButton}
    key={title}
    ref={forwardRef}
  >
    <CommentTitle onHamburgerClick={onHamburgerClick} title={title} isOpened={isOpened} />
  </div>
);

ExpandButton.defaultProps = {
  forwardRef: {},
  onHamburgerClick: () => undefined,
  onKeyDown: () => undefined,
  title: '',
};

ExpandButton.propTypes = {
  forwardRef: PropTypes.object,
  isOpened: PropTypes.bool.isRequired,
  onHamburgerClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  title: PropTypes.string,
};

export default forwardRefWrapper(ExpandButton, 'forwardRef');
