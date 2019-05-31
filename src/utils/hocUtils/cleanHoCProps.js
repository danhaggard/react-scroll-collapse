import { filterObject } from '../objectUtils';

export const cleanHoCPropso = (props, defaultProps, propTypes) => {
  // debugger;
  const newProps = {};
  const defaultKeys = Object.keys(defaultProps);
  const reduxKeys = Object.keys(propTypes);
  Object.keys(props).forEach((key) => {
    if (defaultKeys.includes(key) || !reduxKeys.includes(key)) {
      newProps[key] = props[key];
    }
  });
  return newProps;
};

export const cleanHoCProps = (props, propTypes) => {
  // debugger;
  const blah = filterObject(props, propTypes);
  return blah;
};
