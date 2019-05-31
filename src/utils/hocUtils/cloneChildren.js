import React from 'react'


export const cloneChildren = (children, props) => { // eslint-disable-line
  if (React.Children.only(children)) {
    React.cloneElement(children, props);
  }
  return React.Children.map(children, (child => React.cloneElement(child, props)));
};
