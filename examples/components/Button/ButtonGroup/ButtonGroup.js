import React from 'react';
import PropTypes from 'prop-types';
import ButtonLarge from '../ButtonLarge';
import ButtonSmall from '../ButtonSmall';

import { ofChildrenTypeOrNothing, ofFuncTypeOrNothing } from '../../../../src/utils/propTypeHelpers';

const button = small => (small ? ButtonSmall : ButtonLarge);

const ButtonGroup = (props, ref) => {
  const {
    children,
    className,
    leftClick,
    rightClick,
    leftText,
    rightText,
    small,
    ...rest
  } = props;
  const Button = button(small);
  return (
    <div
      className={className}
      ref={ref}
      {...rest}
    >
      {
        children || (
          <>
            <Button onClick={leftClick}>
              { leftText }
            </Button>
            <Button onClick={rightClick}>
              { rightText }
            </Button>
          </>
        )
      }
    </div>
  );
};

ButtonGroup.defaultProps = {
  children: null,
  className: '',
  leftClick: null,
  rightClick: null,
  leftText: '',
  rightText: '',
  small: false,
};

ButtonGroup.propTypes = {
  leftClick: ofFuncTypeOrNothing,
  rightClick: ofFuncTypeOrNothing,
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  small: PropTypes.bool,
  children: ofChildrenTypeOrNothing,
  className: PropTypes.string,
};

ButtonGroup.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'ButtonGroup'
};

export default ButtonGroup;
