import React from 'react';

const forwardRefWrapper = (Component, refProp) => {
  const forwardRef = (props, ref) => {
    const newProps = {
      ...props,
      [refProp]: ref
    };
    return <Component {...newProps} />;
  };
  const name = Component.displayName || Component.name;
  forwardRef.displayName = name;
  const ForwardRefComponent = React.forwardRef(forwardRef);
  ForwardRefComponent.displayName = name;
  return ForwardRefComponent;
};

export default forwardRefWrapper;
