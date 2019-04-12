import React from 'react';

export const mergeContextWithPropsConsumerFactory = (Context, Comp) => props => (
  <Context.Consumer>
    { context => <Comp {...context} {...props} /> }
  </Context.Consumer>
);

export default mergeContextWithPropsConsumerFactory;
