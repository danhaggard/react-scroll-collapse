import React from 'react';

export const defaultMergeContextWithProps = (props, context = {}) => {
  const { parents, ...other } = context;
  const _reactScrollCollapse = {  // eslint-disable-line
    parents,
  };
  return {
    ...context, ...props, //  _reactScrollCollapse
  };
};

export const defaultContextRendererFactory = (Context, Comp, mergeContextWithProps) => React.memo(
  props => (
    <Context.Consumer>
      { context => <Comp {...mergeContextWithProps(props, context)} /> }
    </Context.Consumer>
  )
);


export const mergeContextWithPropsConsumerFactory = (
  Context,
  Comp,
  mergeContextWithProps,
  contextRendererFactory,
) => contextRendererFactory(Context, Comp, mergeContextWithProps);


export default mergeContextWithPropsConsumerFactory;
