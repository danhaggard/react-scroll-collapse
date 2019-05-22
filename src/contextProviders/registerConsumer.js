/* eslint-disable max-len */


import React, { PureComponent } from 'react';

import providerIdStore from './providerCounter';
import { getIdKey } from './providerKeyManager';
import { mergeContextWithPropsConsumerFactory } from '../utils/contextUtils';

/*
  registerConsumer

  - gives the descendent an id, calls any childRegisterMethods to let ancestors
  know what they want, as passed down by ancestors that it should care about
  (designated by its key)

  typeKey - is the provider type key of the provider being registered.
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
  typeKey
) => {

  class Registry extends PureComponent {

    id = providerIdStore(typeKey);

    render() {
      const newProps = { ...this.props, [getIdKey(typeKey)]: this.id };
      return <Comp {...newProps} />;
    }
  }

  /*
    This subscribes the wrapped child provider in a context consumer wrapper.
    So that it  can receive word from its ancestors above.

    consumerFactory is passed in a dep - so logic can be changed.
  */

  Registry.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'Registry'
  };

  return consumerFactory(Context, Registry);
};

/*
  mergeContextWithPropsConsumerFactory - merges props and context into props
  and passed them in - might be bad?  Namespace conflicts - but also
  not sure of how react deals.
*/
const registerConsumer = registerConsumerFactory(mergeContextWithPropsConsumerFactory);

export default registerConsumer;
