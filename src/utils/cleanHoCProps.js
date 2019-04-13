const cleanHoCProps = (props, defaultProps, propTypes) => {
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

export default cleanHoCProps;
