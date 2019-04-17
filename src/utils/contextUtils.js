import React from 'react';

export const mergeContextWithPropsConsumerFactory = (Context, Comp) => React.memo(
  props => (
    <Context.Consumer>
      { context => <Comp {...context} {...props} /> }
    </Context.Consumer>
  )
);

export default mergeContextWithPropsConsumerFactory;
