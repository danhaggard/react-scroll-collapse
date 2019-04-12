import React, { Component } from 'react';

import providerIdStore from './providerCounter';

import { mergeContextWithPropsConsumerFactory } from '../utils/contextUtils';

/*
  registerConsumer

  - gives the descendent an id, calls any childRegisterMethods to let ancestors
  know what they want, as passed down by ancestors that it should care about
  (designated by its key)

  providerTypeKey - is the provider type key of the provider being registered.
    it will look in its props for ancestor sent methods it should call on
    mount and unmount.

    Currently it just looks for a single function to call which it expects
    will toggle adding and removing its id from parent state that tracks
    nested children.

    TODO: make it an array of methods.
*/

const registerConsumerFactory = consumerFactory => (
  Context,
  Comp,
  providerTypeKey
) => {

  class Registry extends Component {

    state = {
      id: providerIdStore(providerTypeKey),
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

  /*
    This subscribes the wrapped child provider in a context consumer wrapper.
    So that it  can receive word from its ancestors above.

    consumerFactory is passed in a dep - so logic can be changed.
  */
  return consumerFactory(Context, Registry);
};

/*
  mergeContextWithPropsConsumerFactory - merges props and context into props
  and passed them in - might be bad?  Namespace conflicts - but also
  not sure of how react deals.
*/
const registerConsumer = registerConsumerFactory(mergeContextWithPropsConsumerFactory);

export default registerConsumer;
