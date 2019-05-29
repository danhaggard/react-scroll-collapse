import React from 'react';

export const defaultMergeContextWithProps = (props, context) => ({
  ...context, ...props
});

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
