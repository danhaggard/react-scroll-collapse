/* eslint-disable max-len */

import React, { Component } from 'react';
import registerConsumer from './registerConsumer';
import { getIdKey, getParentIdKey } from './providerKeyManager';
import { isUndefNull } from '../utils/selectorUtils';
/*
  createProvider

  Factory that produces context providers that track ancestor / descendant
  relationships.

  childTypeKeys: [str] - keys of type of child providers being tracked by
    this provider.

  parentTypeKeys: [str] - keys of type of parent providers being tracked by
    this provider.

  typeKey: str key of  the type of provider THIS provider is.

  Base = the Base React class this factory will use to create the provider.
    ChildrenManager is an alternative that tracks child state.
*/

const shouldLog = (props, state, id, log) => {
  if (!Object.keys(props).includes('isOpenedInit')) {
    console.log(log, id, props, state);
  }
};

const createProvider = (
  typeKey,
  parentTypeKeys = [],
  childTypeKeys = [],
  Base = Component
) => (Context, Comp) => {
  class Provider extends Base {

    static getDerivedStateFromProps(props, state) {
      shouldLog(props, state, props.collapserId, 'getDerivedStateFromProps - Provider - id, props, state');
      // console.log('getDerivedStateFromProps - Provider - collapserId, props, state', props.collapserId, props, state);
      return state;
    }

    state = {
      id: this.props[getParentIdKey(typeKey)],
    }

    constructor(props) {
      super(props);
      console.log('Provider this constructor', this);

      shouldLog(props, this.state, props.collapserId, 'constructor - Provider - id, props, state');
      // console.log('constructor - Provider - collapserId, props, state', props.collapserId, props);
    }

    componentDidMount() {
      const { props, state } = this;
      shouldLog(props, this.state, props.collapserId, 'componentDidMount - Provider - id, props, state');
      // console.log('componentDidMount - Provider - collapserId, props, state', props.collapserId, props, state);
      // console.log('');

    }

    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      shouldLog(props, this.state, props.collapserId, 'shouldComponentUpdate - Provider - id, props, state');
      // console.log('shouldComponentUpdate - Provider - collapserId, props, state', props.collapserId, props, state);
      return true;
    }

    componentDidUpdate() {
      const { props, state } = this;
      shouldLog(props, this.state, props.collapserId, 'componentDidUpdate - Provider - id, props, state');
      // console.log('componentDidUpdate - Provider - collapserId, props, state', props.collapserId, props, state);
    }

    componentWillUnmount() {
      const { props, state } = this;
      shouldLog(props, this.state, props.collapserId, 'componentWillUnmount - Provider - id, props, state');
      // console.log('componentWillUnmount - Provider - collapserId, props, state', props.collapserId, props, state);
      // this.registerSelf(this.props, this.state);
    }

    idKey = getIdKey(typeKey);

    parentIdKey = getParentIdKey(typeKey);

    id = this.props[this.idKey];


    mapParentIds = (props) => {

      const parentIdObj = {};

      // Adds its own id as a parent.
      if (childTypeKeys.length > 0) {
        parentIdObj[this.parentIdKey] = this.id;
      }

      // Adds the other parent ids as asked for the be provider.
      parentTypeKeys.forEach((key) => {
        const parentIdKey = getParentIdKey(key);
        if (!isUndefNull(props[parentIdKey])) {
          parentIdObj[parentIdKey] = props[parentIdKey];
        }
      });
      return parentIdObj;
    };

    /*
      If it can't find it's own type as parent in props,
      but is a parent of something - then it is a root node.
    */
    checkIfRoot = () => !Object.keys(this.props).includes(this.parentIdKey)
      && childTypeKeys.length > 0;

    getRootNodes = () => {
      const rootNodes = {
        ...this.props.rootNodes,
      };
      if (this.checkIfRoot()) {
        rootNodes[typeKey] = this.id;
      }
      return rootNodes;
    }
    /*
      childContext  - create the context to be inserted into the context
      for children to consume.

      ...mapParentIds(props) - maps parentTypeKeys to idKeys and passes vals

      childRegisterMethods - children need to let the closest ancestors know
      they have been mounted so ancestors must pass callbacks through
      the context to do this.

      This property is not actually defined on this class - is currently
      inherited from Base.  Need to revist this.
    */

    childContext = {
      ...this.mapParentIds(this.props),
      ...this.childRegisterMethods,
      rootNodes: this.getRootNodes(),
    }

    render() {
      const { props, state } = this;
      shouldLog(props, this.state, props.collapserId, 'render - Provider - id, props, state');
      // console.log('render - Provider - collapserId, props, state', props.collapserId, props, state);

      const newContext = props.collapserId === 0
        ? { ...this.childContext, mounted: this.props.mounted } : this.childContext;
      const newProps = { ...props };
      delete newProps.mounted;
      console.log('render - Provider - collapserId, newContext, newProps', props.collapserId, newContext, newProps);
      console.log('');

      return childTypeKeys.length === 0 ? <Comp {...this.props} /> : (
        <Context.Provider value={newContext}>
          <Comp
            isRootNode={this.checkIfRoot()}
            providerType={typeKey}
            {...newProps}
            key={this.idKey}
            />
        </Context.Provider>
      );
    }

  }

  /*
    This provider might itself be a child - so we must register it.
  */
  return registerConsumer(Context, Provider, typeKey);
};


export default createProvider;
