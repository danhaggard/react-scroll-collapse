import React from 'react';
import PropTypes from 'prop-types';

import CommentTitle from '../CommentTitle';


const ExpanderButton = ({
  isOpened,
  onClick,
  onKeyDown,
  title
}) => (
  <div onClick={onClick} onKeyDown={onKeyDown} role="button" tabIndex={0} type="button">
    <CommentTitle title={title} isOpened={isOpened} />
  </div>
);

ExpanderButton.defaultProps = {
  onClick: () => undefined,
  onKeyDown: () => undefined,
  title: '',
};

ExpanderButton.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  title: PropTypes.string,
};

export default ExpanderButton;
