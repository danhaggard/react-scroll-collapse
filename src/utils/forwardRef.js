/*
  eslint-disable react/forbid-foreign-prop-types
*/
/*
  Is compatible with: transform-react-remove-prop-types babel plugin.
*/
import React from 'react';

const cleanStatic = (ComponentArg) => {
  const CleanComponent = ComponentArg;

  /*
    Store static properties to be attached to forwardRef components.
  */
  const { propTypes, defaultProps } = CleanComponent;

  /*
    Prevents React console warning about forwardRef not supporting
    propTypes or defaultProps.

    Allows us to treat render functions passed to forwardRef as
    components for linting purposes (that we've supplied propTypes etc).
  */
  delete CleanComponent.propTypes;
  delete CleanComponent.defaultProps;
  return {
    CleanComponent,
    propTypes,
    defaultProps
  };
};

const forwardRefWrapper = (Component) => {
  const { CleanComponent, propTypes, defaultProps } = cleanStatic(Component);
  const ComponentWithRef = React.forwardRef(CleanComponent);
  ComponentWithRef.propTypes = propTypes;
  ComponentWithRef.defaultProps = defaultProps;
  return ComponentWithRef;
};

export default forwardRefWrapper;
