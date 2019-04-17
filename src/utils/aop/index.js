import Aop from './Aop';

import { extendClassNameAdvice } from './advices';

export const wrapComponent = (advice, Component) => Aop.around('render', advice, Component);
export const extendClassName = Component => wrapComponent(extendClassNameAdvice, Component);
