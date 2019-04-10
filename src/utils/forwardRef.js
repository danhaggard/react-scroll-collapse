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

  return React.forwardRef(forwardRef);
};

export default forwardRefWrapper;
