import { extendClassName } from './aop';
import forwardRef from './forwardRefNew';

const extendAndForwardRef = (Component, extendDefaultProps = {}) => {
  const ComponentWithRef = forwardRef(Component);
  ComponentWithRef.defaultProps = {
    ...ComponentWithRef.defaultProps,
    ...extendDefaultProps
  };

  if (extendDefaultProps.defaultClassName) {
    extendClassName(ComponentWithRef);
  }

  return ComponentWithRef;
};

export default extendAndForwardRef;
