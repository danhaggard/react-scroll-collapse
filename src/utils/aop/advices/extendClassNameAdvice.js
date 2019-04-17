import Aop from '../Aop';
import extendClassNameUtil from '../../extendClassName';


const extendClassName = (targetArg) => {
  const target = {
    ...targetArg
  };
  target.args[0] = extendClassNameUtil(target.args[0]);
  return Aop.next(target);
};

export default extendClassName;
