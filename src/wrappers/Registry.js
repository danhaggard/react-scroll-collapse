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

  class Registry extends Component {

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

  return consumerFactory(Context, Registry);
};

const registry = registryFactory(contextConsumerFactory);

export default registry;
