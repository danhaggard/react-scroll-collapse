import React, { Component } from 'react';

import getNextId from './store';


export const contextConsumerFactory = (Context, Comp) => props => (
  <Context.Consumer>
    { context => <Comp {...context} {...props} /> }
  </Context.Consumer>
);

const registryFactory = consumerFactory => (
  Context,
  Comp,
  registerMethod,
  storeKey
) => {

  const Consumer = consumerFactory(Context, Comp);

  class RegistryInner extends Component {

    state = {
      id: getNextId(storeKey),
    }

    componentDidMount() {
      this.registerSelf(this.props, this.state);
    }

    componentWillUnmount() {
      this.registerSelf(this.props, this.state);
    }

    registerSelf = (props, { id }) => {
      if (typeof props[registerMethod] === 'function') {
        props[registerMethod](id);
      }
    }

    render() {
      const { id } = this.state;
      return <Consumer {...this.props} id={id} />;
    }
  }

  return RegistryInner;
};

const registryOuter = registryFactory(contextConsumerFactory);

export default registryOuter;
