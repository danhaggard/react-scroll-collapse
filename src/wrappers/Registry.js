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
  providerTypeKey
) => {

  // const Consumer = consumerFactory(Context, Comp);

  class RegistryInner extends Component {

    state = {
      id: getNextId(providerTypeKey),
    }

    componentDidMount() {
      this.registerSelf(this.props, this.state);
    }

    componentWillUnmount() {
      this.registerSelf(this.props, this.state);
    }

    registerSelf = (props, { id }) => {
      if (typeof props[providerTypeKey] === 'function') {
        props[providerTypeKey](id);
      }
    }

    render() {
      const { id } = this.state;
      return <Comp {...this.props} id={id} />;
    }
  }
  const Consumer = consumerFactory(Context, RegistryInner);
  return Consumer;
};

const registryOuter = registryFactory(contextConsumerFactory);

export default registryOuter;
