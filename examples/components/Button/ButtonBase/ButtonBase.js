import React from 'react';
import PropTypes from 'prop-types';

import { ofChildrenType } from '../../../../src/utils/propTypeHelpers';


const ButtonBase = (props, ref) => {
  const {
    children,
    className,
    ...rest
  } = props;
  return (
    <button
      className={className}
      ref={ref}
      type="button"
      {...rest}
    >
      { children }
    </button>
  );
};

ButtonBase.propTypes = {
  children: ofChildrenType,
  className: PropTypes.string,
};

ButtonBase.defaultProps = {
  children: [],
  className: '',
};

export default ButtonBase;
