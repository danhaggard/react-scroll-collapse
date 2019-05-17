/* eslint-disable max-len */


import React, { Component } from 'react';

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
const shouldLog = (props, state, id, log) => {
  if (!Object.keys(props).includes('isOpenedInit')) {
    console.log(log, id, props, state);
  }
};

const registerConsumerFactory = consumerFactory => (
  Context,
  Comp,
  typeKey
) => {

  class Registry extends Component {

    static getDerivedStateFromProps(props, state) {
      shouldLog(props, state, state.id, 'getDerivedStateFromProps - Registry - id, props, state');
      return state;
    }

    state = {
      id: providerIdStore(typeKey),
      mounted: false,
    }

    constructor(props) {
      super(props);
      const { id } = this.state;

      console.log('Registry this constructor', this);
      shouldLog(props, this.state, id, 'constructor - Registry - id, props, state');
      // console.log('constructor - Registry - id, props, state', this.state.id, props);
    }

    componentDidMount() {
      const { props, state } = this;
      shouldLog(props, this.state, state.id, 'componentDidMount - Registry - id, props, state');
      //console.log('componentDidMount - Registry - id, props, state', state.id, props, state);
      console.log('');
      if (state.id === 0) {
        this.setState(() => ({ mounted: true }));
      }

    }

    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      shouldLog(props, this.state, state.id, 'shouldComponentUpdate - Registry - id, props, state');
      // console.log('shouldComponentUpdate - Registry - id, props, state', state.id, props, state);
      return true;
    }

    componentDidUpdate() {
      const { props, state } = this;
      shouldLog(props, this.state, state.id, 'componentDidUpdate - Registry - id, props, state');
      // console.log('componentDidUpdate - Registry - id, props, state', state.id, props, state);
    }

    componentWillUnmount() {
      const { props, state } = this;
      shouldLog(props, this.state, state.id, 'componentWillUnmount - Registry - id, props, state');
      // console.log('componentWillUnmount - Registry - id, props, state', state.id, props, state);
      this.registerSelf(this.props, this.state);
    }

    registerSelf = (props, { id }) => {
      if (typeof props[typeKey] === 'function') {
        props[typeKey](id);
      }
    }

    render() {
      const { props, state } = this;
      shouldLog(props, this.state, state.id, 'render - Registry - id, props, state');
      // console.log('render - Registry - id, props, state', state.id, props, state);
      console.log('');
      const { id } = this.state;
      const newProps = { ...this.props, [getIdKey(typeKey)]: id };
      if (state.id === 0) {
        newProps.mounted = state.mounted;
      }
      return <Comp {...newProps} />;
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
