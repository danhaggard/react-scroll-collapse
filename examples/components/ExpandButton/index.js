import React from 'react';
import PropTypes from 'prop-types';
import forwardRefWrapper from '../../../src/utils/forwardRef';
import CommentTitle from '../CommentTitle';
import { ofFuncTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import styles from './ExpandButton.scss';

const ExpandButton = ({
  forwardRef,
  isOpened,
  onClick,
  onHamburgerClick,
  onKeyDown,
  style,
  title
}) => (
  <div
    className={styles.expandButton}
    key={title}
    onKeyDown={onKeyDown || undefined}
    onClick={onClick}
    ref={forwardRef}
    role={onKeyDown || onClick ? 'button' : undefined}
    style={style}
  >
    <CommentTitle onHamburgerClick={onHamburgerClick} title={title} isOpened={isOpened} />
  </div>
);

ExpandButton.defaultProps = {
  forwardRef: {},
  onHamburgerClick: null,
  onClick: null,
  onKeyDown: null,
  style: {},
  title: '',
};

ExpandButton.propTypes = {
  forwardRef: PropTypes.object,
  isOpened: PropTypes.bool.isRequired,
  onClick: ofFuncTypeOrNothing,
  onHamburgerClick: ofFuncTypeOrNothing,
  onKeyDown: ofFuncTypeOrNothing,
  style: PropTypes.object,
  title: PropTypes.string,
};

export default forwardRefWrapper(ExpandButton, 'forwardRef');
