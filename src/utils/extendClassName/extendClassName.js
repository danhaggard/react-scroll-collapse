import cx from 'classnames';

function ExtendClassNameException(message) {
  this.message = message;
  this.name = 'ExtendClassNameException';
}

const checkDefaultProps = ({
  defaultClassName,
}) => {
  if (defaultClassName === undefined) {
    throw new ExtendClassNameException('Error - UI Components with an extended className interface must define the defaultClassName prop'); // eslint-disable-line max-len
  }
};

const extendClassName = (props) => {
  checkDefaultProps(props);
  const {
    appendClassName,
    className,
    cxToBoolProps,
    defaultClassName,
    ...rest
  } = props;
  const cxFunc = typeof cxToBoolProps === 'function' ? cxToBoolProps : (() => {});
  return {
    className: className || cx({
      [defaultClassName]: !!defaultClassName,
      [appendClassName]: !!appendClassName,
      ...cxFunc(rest),
    }),
    ...rest,
  };
};

export default extendClassName;
