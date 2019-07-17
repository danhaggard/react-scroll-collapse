import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { collapserContextActions } from '../../../actions';
import { getCollapserActiveChildrenRoot, getCollapserActiveChildrenLimitRoot } from '../../../selectors/collapser';
import { shallowEqualExceptArray } from '../../../utils/equalityUtils';
import { defaultMergeContextWithProps } from '../../utils/contextUtils';
import { compareIntArrays } from '../../../utils/arrayUtils';
import { createSubscriberRegistry } from '../../../utils/objectUtils';

import createCache from '../../../caching/recursionCache';
import providerCaches from '../../../caching/providerCaches';
import providerWorkers from '../../../caching/providerWorkers';

const collapserContext = (Base) => {

  class CollapserContext extends Base {

    defaultContextProps = {
      activeSiblings: [],
      activeSiblingLimit: null,
    }

    onFlexRestRegistry = createSubscriberRegistry();

    constructor(props, context) {
      super(props, context);
      this.setNextContextProps();
      this.setChildContext();
      this.setReactScrollCollapse();
    }

    /*
      Because the state for the active nodes is an array it causes rerenders
      so have added a array checker to shallow comparison.
    */
    shouldComponentUpdate = nextProps => !shallowEqualExceptArray(this.props, nextProps);

    /*
      Here we are getting information as parent about its children,
      and passing that to its children - received as info about it's siblings.
      Hence the mapping from 'activeChildren', for instance, to 'activeSiblings'.

      Care is being taken here to ensure the generation of a new object
      only if there is a genuine change in state.  Otherwise we reuse the existing
      object container and rely on shallow equality to prevent uneeded renders.

      messy tho - clean.
    */
    getNextContextProps = () => {
      const {
        activeSiblings: prevActiveSiblings,
        activeSiblingLimit: prevActiveSiblingLimit
      } = this.nextContextProps;
      const { activeChildren, activeChildrenLimit } = this.props;
      const nextActiveSiblings = compareIntArrays(prevActiveSiblings, activeChildren)
        ? prevActiveSiblings : activeChildren;
      if (nextActiveSiblings !== prevActiveSiblings
        || prevActiveSiblingLimit !== activeChildrenLimit) {
        return {
          activeSiblings: nextActiveSiblings,
          activeSiblingLimit: activeChildrenLimit,
        };
      }
      return this.nextContextProps;
    }

    setNextContextProps = () => {
      if (this.nextContextProps === null) {
        this.nextContextProps = this.defaultContextProps;
      }
      this.nextContextProps = this.getNextContextProps();
    }

    checkIfActiveSibling = () => {
      if (this.checkIfRoot()) {
        return false;
      }
      const { _reactScrollCollapse: { id }, contextProps: { activeSiblings } } = this.props;
      return activeSiblings.includes(id);
    }

    noActiveSiblings = () => {
      if (this.checkIfRoot()) {
        return false;
      }
      const { contextProps: { activeSiblings } } = this.props;
      return activeSiblings.length === 0;
    }

    /*
      This is currently adding the called to the active state.  There can be more
      than one child in the active state - depending on what defautls are set

      Ultimately what this odes in UI terms depends on how this is mapped to styles.

      Was going for a specific effect - but this needs to be detached from the
      state prop.
    */
    addSelfToActiveSiblings = (state) => {
      const { parents } = this._reactScrollCollapse;
      if (!parents) {
        // cant have siblings if you dont have parents!
        return;
      }
      const {
        addActiveChildren,
        _reactScrollCollapse: { id },
        // isActiveSibling,
        removeActiveChildren
      } = this.props;
      /*
        I  think because this is call back - the parents aren't available from
        props after first render. So get them from this.
      */

      const { collapser: parentCollapserId } = this._reactScrollCollapse.parents;
      const { activeChildren, contextProps: { activeSiblingLimit } } = this.props;
      /*
        So clicking on the root collapser removes every child from the active state.
        in flexbox terms amountst to them going back to equal width.
      */
      if (this.checkIfRoot()) {
        removeActiveChildren(id, activeChildren);
      }
      // So you go back to normal size if you get clicked while fully expanded.
      // This is rmeoving the collapser from it's parents active set.
      if (!this.checkIfRoot() && state.areAllItemsExpanded) {
        removeActiveChildren(parentCollapserId, [id]);
      }
      // but you can get add if yr not already in active state and expanded.
      // Has the effect of giving flex width to expanding elements.
      if (!this.checkIfRoot() && !this.checkIfActiveSibling() && !state.areAllItemsExpanded) {
        addActiveChildren(parentCollapserId, [id], activeSiblingLimit);
        removeActiveChildren(id, activeChildren);
      } else if (!this.checkIfRoot() && this.checkIfActiveSibling()) {
        // removeActiveChildren(parentCollapserId, [id]);
      }
    }

    /*
      Allows you to set a limt on how many children can be active at a time.
    */
    setActiveChildrenLimit = limit => this.props.setActiveChildrenLimit(
      this.getId(), limit
    );

    initiateTreeStateCheck = (setTreeId = false) => {
      const areAllItemsExpandedWorker = this.getWorker();
      const { isOpenedInit } = this.props;

      /*
        This rootNodeId check is handling an edge case where a collapser
        has no parent and is not a child of a scroller.
        In that scenario the context render has not been sent all info by
        a parent provider.
      */
      let { rootNodeId } = this.props;
      if (this.checkIfRoot()) {
        rootNodeId = this.getId();
      }

      if (rootNodeId === undefined && !this.checkIfRoot()) {
        throw new Error('No rootNodeId found');
      }

      const cacheClone = this.cache.getCache();
      const currentReduxState = this.cache.getCurrentReduxState();
      const orphanNodeCacheClone = this.cache.orphanNodeCache.getCache();
      areAllItemsExpandedWorker.postMessage([
        currentReduxState,
        {
          cacheClone,
          orphanNodeCacheClone,
          id: this.getId(),
          isOpenedInit,
          rootNodeId,
          setTreeId,
        }]);
    }

    /* former collapserManager methods */
    getCreateCache = () => { // eslint-disable-line
      const { isRootNode, rootNodeId, type } = this._reactScrollCollapse;
      const providerCache = providerCaches[type];
      if (isRootNode) {
        providerCache[rootNodeId] = createCache(rootNodeId);
      }
      return providerCache[rootNodeId];
    }

    getCache = () => {
      if (!this.cache) {
        this.cache = this.getCreateCache();
      }
      this.cache.unlockCache();
      return this.cache;
    }

    getWorker = () => {
      const { rootNodeId, type } = this._reactScrollCollapse;
      const workerCache = providerWorkers[type];
      return workerCache.getWorker(rootNodeId);
    }

    registerMountWithCache = (() => {
      const cache = this.getCache();
      const { orphanNodeCache } = cache;
      const {
        _reactScrollCollapse: { id },
        // _reactScrollCollapseParents: { collapser }
      } = this.props;
      orphanNodeCache.registerIncomingMount(id);
    })();

    /* end former collapserManager methods */

    // onFlexRest = () => this.onFlexRestRegistry.forEach(subscriber => subscriber());
    onFlexRest = () => {
      const {
        _reactScrollCollapse: { id },
        // _reactScrollCollapseParents: { collapser }
      } = this.props;
      // console.log(`onFlexRest called id: ${id}, registry: `, this.onFlexRestRegistry.getRegistry());
      // this.checkIfActiveSibling()
      this.onFlexRestRegistry.forEach(subscriber => subscriber());
    }

    addToOnFlexRest = this.onFlexRestRegistry.add;

    getFlexRegistry = this.onFlexRestRegistry.getRegistry;

    removeFromFlexRest = this.onFlexRestRegistry.remove;

    contextMethods = {
      collapser: {
        areAllItemsExpandedWorker: this.getWorker(),
        cache: this.cache,
        addSelfToActiveSiblings: this.addSelfToActiveSiblings.bind(this),
        checkIfActiveSibling: this.checkIfActiveSibling.bind(this),
        initiateTreeStateCheck: this.initiateTreeStateCheck.bind(this),
        noActiveSiblings: this.noActiveSiblings.bind(this),
        setActiveChildrenLimit: this.setActiveChildrenLimit.bind(this),

        onFlexRest: this.onFlexRest.bind(this),
        addToOnFlexRest: this.addToOnFlexRest.bind(this),
        removeFromFlexRest: this.removeFromFlexRest.bind(this),
        getFlexRegistry: this.getFlexRegistry.bind(this),
      }
    };

  }

  CollapserContext.defaultProps = {};

  CollapserContext.propTypes = {};

  CollapserContext.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'CollapserContext'
  };

  const mapStateToPropsFactory = () => (state, props) => {
    const { _reactScrollCollapse: { id } } = props;
    const activeChildren = getCollapserActiveChildrenRoot(state)(id);
    const activeChildrenLimit = getCollapserActiveChildrenLimitRoot(state)(id);
    return {
      activeChildren,
      activeChildrenLimit
    };
  };

  const CollapserContextConnect = connect(
    mapStateToPropsFactory,
    collapserContextActions,
  )(CollapserContext);

  return CollapserContextConnect;
};


/*
  ContextRender - used in place of the default context renderer.

  To prevent unecesary renders on the context needed more than shallow checking
  on the array value for the active siblings.

  Also handles logic for mergin context info regarding siblings from the parent
  to it's immediate children.
*/
const contextRenderer = (Context, Comp, mergeContextProps) => {

  class ContextRender extends Component {

    shouldComponentUpdate(props) {
      const checked = this.equalCheck(props, shallowEqualExceptArray);
      return checked;
    }

    equalCheck = (props, equalityChecker) => {
      const [prevContextProps, prevProps] = this.splitProps(this.props);
      const [nextContextProps, nextProps] = this.splitProps(props);
      const equalProps = equalityChecker(prevProps, nextProps);
      const equalContext = equalityChecker(prevContextProps, nextContextProps);
      if (!equalProps || !equalContext) {
        return true;
      }
      return false;
    }

    splitProps = (props) => {
      const { contextProps, ...other } = props;
      return [contextProps, other];
    }

    addToProps = () => {
      /*
        When collapser not nested in a scroller - contextMethods wont have
        been inited yet.
      */
      const { contextMethods } = this.props;
      if (!contextMethods) {
        return this.props;
      }
      const { collapser } = contextMethods;
      const newProps = { ...this.props };
      if (collapser && collapser.checkIfActiveSibling) {
        newProps.isActiveSibling = collapser.checkIfActiveSibling();
      }
      return newProps;
    }

    render() {
      return <Comp {...this.addToProps()} />;
    }

  }

  ContextRender.defaultProps = {
    contextProps: {},
    contextMethods: {},
  };

  ContextRender.propTypes = {
    contextProps: PropTypes.object,
    contextMethods: PropTypes.object,
  };

  ContextRender.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'ContextRender'
  };

  return props => (
    <Context.Consumer>
      { context => <ContextRender {...mergeContextProps(props, context)} /> }
    </Context.Consumer>
  );
};

collapserContext.renderContext = {
  mergeContextWithProps: defaultMergeContextWithProps,
  contextRenderer
};


export default collapserContext;
