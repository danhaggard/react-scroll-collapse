import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { collapserWrapperActions, collapserContextActions } from '../../actions';
import { isUndefNull } from '../../utils/selectorUtils';
import { cleanHoCProps } from '../../utils/hocUtils/cleanHoCProps';

import { getNodeTargetArrayRoot, getRootUnmountArrayRoot } from '../../selectors/rootNode';
import {
  getCollapserCollapsersRoot,
  nestedCollapserItemsRoot,
  setTreeIdsRecursively,
} from '../../selectors/collapser';
import { setContextAttrs } from '../../utils/objectUtils';

import addLoggingDefaultsToComponent from '../../utils/logging/utils';


export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    /*
      After mounting a bunch of nodes we need to check state - but this method
      only does that on mount of first render of the current root node.  Otherwise
      it just logs the children mounted and the state check is initiated from
      componentDidUpdate.

      Children mount first so they are added to the targetArray of nodes
      needing to be checked.

      WHen we hit the root node we check state.

      treeIds are naively regenerated on every mount.  Need to test doing this
      after root mount only.

      Also - the nodeTargetArray is reset - but not sure why it's before
      the check tree state.  On mount it probably doesn't matter anyway.
    */

    constructor(props, context) {
      super(props, context);
      setContextAttrs(this);
      const {
        areAllItemsExpanded,
        areAllItemsExpandedWorker,
        setActiveChildLimit,
      } = props;
      this.state = { areAllItemsExpanded };
      if (!isUndefNull(setActiveChildLimit)
        && setActiveChildLimit !== CollapserController.defaultProps.setActiveChildLimit) {
        this.methods.collapser.setActiveChildrenLimit(setActiveChildLimit);
      }
      areAllItemsExpandedWorker.addEventListener('message', this.handleAllItemsExpandedWorkerMessage);
    }

    componentDidMount() {
      /*
        Make sure users pass a ref to a DOM node.
      */
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      this.setCacheOnMount();
    }

    componentWillUnmount() {
      const { areAllItemsExpandedWorker } = this.props;
      areAllItemsExpandedWorker.addEventListener('message', this.handleAllItemsExpandedWorkerMessage);
    }

    /*
            0
          /   \
         1     4
       /   \  /  \
      2    3 5    6

      Given the above tree.  The mount order will be:
        2, 3, 1, 5, 6, 4, 0

      So we init the largestValueFromPrevMountCycle to be 1 less than the rootNode.
      If any componentId > 0 mounts - we know the mounting cycle has begun and will
      continue till the root node 0 mounts.

      While we are mounting we record the highest id to mount in the current
      cycle.  This get sets as the next value for: largestValueFromPrevMountCycle
      i.e. 6 -as any mountings on a new render will start from the bottom and
      work their way up to the top which will be node 7.
    */
    setCacheOnMount() {
      const { props: { cache, _reactScrollCollapse: { isRootNode } }, id } = this;
      const {
        largestValueFromPrevMountCycle,
        mounting,
        largestValueFromThisMountCycle
      } = cache.getMountInfo();

      const mountingStarted = id - largestValueFromPrevMountCycle > 1;
      const mountingFinished = !mountingStarted && mounting;
      /* a root node mounted without children */
      if (!mountingStarted && !mountingFinished && !mounting
        && isRootNode) {
        // cache.setMountInfo({ largestValueFromPrevMountCycle: id });
        // You'd think checking tree state here is need - but it causes
        // state mismatch currently.  TODO ionvestigate.
        // this.initiateTreeStateCheck();
        return;
      }

      if (mountingStarted) {
        cache.setMountInfo({ mounting: mountingStarted });
      }

      if (mounting && id > largestValueFromThisMountCycle) {
        cache.setMountInfo({ largestValueFromThisMountCycle: id });
      }

      if (mountingFinished) {
        cache.setMountInfo({
          largestValueFromPrevMountCycle: largestValueFromThisMountCycle,
        });
      }

      if (mountingFinished) {
        console.log('checking tree after mount - id, cache', id, cache);
        this.initiateTreeStateCheck(true);
        cache.setMountInfo({
          mounting: false,
        });
      }

      if (mountingStarted && !mounting && !isRootNode) {
        setTimeout(this.checkForSingleNodeMount, 100);
      }
    }

    setExpandedState = () => {
      const { props: { cache }, id } = this;
      const { areAllItemsExpanded } = this.state;
      const cachedValue = cache.getResultValue(id);
      if (areAllItemsExpanded !== cachedValue) {
        this.setState(() => ({
          areAllItemsExpanded: cachedValue
        }));
      }
    }

    expandCollapseAll = () => {
      const { id, rootNodeId } = this;
      const {
        addToNodeTargetArray,
        expandCollapseAll,
        selectors,
      } = this.props;
      const { areAllItemsExpanded } = this.state;

      /*
        Will need a whole object to manage autoscroll once we add more
        configurability.
      */
      if (this.methods.scroller) {
        this.methods.scroller.scrollToTop(this.elem.current);
      }
      /*
        Adding the current collapserId to the targetNodes - tells the
        tree state selector where in the tree to go.

        NOTE: must dispatch relevant redux actions before checking tree state.
        mapStateToProps will fire immediately and update the cache that
        the selector uses.
      */
      addToNodeTargetArray(id, rootNodeId, true);
      expandCollapseAll(areAllItemsExpanded, selectors.allChildItemIds(), rootNodeId);

      if (this.methods.collapser) {
        this.methods.collapser.addSelfToActiveSiblings(this.state);
      }

      this.initiateTreeStateCheck();
    };

    initiateTreeStateCheck = (setTreeId = false) => {
      const { areAllItemsExpandedWorker, cache } = this.props;
      const cacheClone = cache.getCache();
      const currentReduxState = cache.getCurrentReduxState();
      areAllItemsExpandedWorker.postMessage([
        currentReduxState,
        {
          cacheClone,
          id: this.id,
          isOpenedInit: this.props.isOpenedInit,
          rootNodeId: this.rootNodeId,
          setTreeId,
        }]);
    }

    handleAllItemsExpandedWorkerMessage = (e) => {
      const { cache } = this.props;
      if (!e) {
        return;
      }
      if (this.isRootNode) {
        cache.setCache(e.data);
      }
      this.setExpandedState(this.props);
    }

    isActiveSibling = () => this.methods.collapser.checkIfActiveSibling();

    noActiveSiblings = () => this.methods.collapser.noActiveSiblings();

    cleanProps = props => cleanHoCProps(
      props,
      {
        ...collapserWrapperActions,
        ...collapserContextActions,
      },
      [
        'activeChildren',
        'activeChildrenLimit',
        'areAllItemsExpandedWorker',
        'cache',
        'contextProps',
        'rootNodeId',
        'selectors',
        // 'setActiveChildLimit',
        '_reactScrollCollapseParents'
      ]
    );

    checkForSingleNodeMount = () => {
      const { props: { cache }, id } = this;
      const {
        mounting,
        largestValueFromPrevMountCycle
      } = cache.getMountInfo();
      if (mounting && id - largestValueFromPrevMountCycle > 1) {
        /*
          assume no more are mounting for now - have no idea ohw long to wait. ?
          Don't update largestValueFromPrevMountCycle because other the next node
          value will be only +1 the current and won't initiate a mount sequence.
        */
        console.log('checking tree after mount && mount timeout - id, cache', id, cache);
        this.initiateTreeStateCheck(true);
        cache.setMountInfo({
          mounting: false,
        });
      }

    }

    render() {
      // console.log('collapser render id, props.contextProps', this.id, this.props, this);
      // const { expandCollapseAll, selectors, ...other } = this.props;
      const { areAllItemsExpanded } = this.state;
      const cleanProps = this.cleanProps(this.props);
      return (
        <WrappedComponentRef
          {...cleanProps}
          isActiveSibling={this.isActiveSibling(this.props)}
          noActiveSiblings={this.noActiveSiblings(this.props)}
          ref={this.elem}
          expandCollapseAll={this.expandCollapseAll}
          areAllItemsExpanded={areAllItemsExpanded}
        />
      );
    }
  }

  CollapserController.defaultProps = {
    setActiveChildLimit: 1,
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    cache: PropTypes.object.isRequired,

    /* provided by redux */
    addToNodeTargetArray: PropTypes.func.isRequired,
    areAllItemsExpanded: PropTypes.bool.isRequired,
    expandCollapseAll: PropTypes.func.isRequired,
    selectors: PropTypes.object.isRequired, // includes nested
    setTreeId: PropTypes.func.isRequired,
    toggleCheckTreeState: PropTypes.func.isRequired,
    _reactScrollCollapse: PropTypes.object.isRequired,

    /* provided by scrollerProvider via context */
    areAllItemsExpandedWorker: PropTypes.object.isRequired,

    /* provided by user */
    setActiveChildLimit: PropTypes.number,
  };

  addLoggingDefaultsToComponent(
    CollapserController,
    'CollapserController',
    [
      ['nodeTargetArray', 'deepEquals'],
      ['areAllItemsExpandedSelector', 'function'],
      ['setTreeIdsSelector', 'function'],
      ['allChildItemIds', 'function'],
    ]
  );


  /*
    Overall strategy is to prevent mapStateToProps from calling most selectors
    directly because they are expensive calls - and we want to maintain tight
    control over how they are called.  So they are passed in as functions to props
    and the component calls them when required.  On each call of mapStateToProps
    - new selector functions are generated with fresh props and state injected
    into them.

    These functions would ordinarily cause redux to see a change in value,
    and thus trigger an update to the component on every dispatch -
    because they are new functions every time mapStateToProps is called.

    So we created a selectors object with a closure - which is mutated with
    the new selector functions.  The identity of this object never changes
    and never causes unecesary component updates.

    areAllItemsExpanded is different.  Previously I was passing in this as a
    selector function as well and actually relying on the selector functions
    failing the identity check to force the component update on every call of
    mapStateToProps.  I would then use a combination of getDerivedStateFromProps
    and shouldComponentUpdate, to determine when component updates would happen.

    This was bad because redux is calling setState on every component instance,
    on every change of redux state - but in many cases WITHOUT causing a render
    in the Collapser instance because renders were being blocked by
    componentShouldUpdate.  On a tree with a nesting depth > 50 - the redux
    calls to setState would exceed 50 in a single render cycle and so react
    would think it was in a infinite setState loop and terminate.

    Next I tried areAllItemsExpanded simply passing a true false value -
    and is responsible for triggering component updates.  In addition the
    component would dispatch an action that would toggle some state that
    would tell mapStateToProps to check the tree state again.

    This was better but required the mapStateToProps func doing some nasty
    conditional logic to check if it was a root node, if it was a mounting
    scenario etc...

    Now using a webworker which allows the component to just select
    state exactly when it wants.  The tradeoff is that I have to
    copy redux state into the cache so it can be passed to the webworker.
    Required because with redux not triggering renders, redux state in the
    component is stale.
  */

  /*
    first render init logic.  Sets the init value as the isOpenedInit.
    Needs more thought - as that's actually a value for a collapserItem.

    Could have a general init value passed to the collapser - and child items
    can individually overide if desired.  Need to think of how.
  */
  const initAreAllItemsExpanded = (cache, collapserId, isOpenedInit) => {
    let areAllItemsExpanded = cache.getResultValue(collapserId);
    if (areAllItemsExpanded === null && isOpenedInit !== null) {
      cache.addResult(collapserId, isOpenedInit, []);
      areAllItemsExpanded = cache.getResultValue(collapserId);
    }
    return areAllItemsExpanded;
  };

  const mapStateToPropsFactory = () => {
    const selectors = {};

    let areAllItemsExpanded = null;

    return (state, props) => {
      const { _reactScrollCollapse: { id, rootNodeId } } = props;
      const { cache, isOpenedInit } = props;
      selectors.allChildItemIds = () => nestedCollapserItemsRoot(state, props);
      selectors.childCollapsers = () => getCollapserCollapsersRoot(state)(id);
      selectors.nodeTargetArray = () => getNodeTargetArrayRoot(state)(rootNodeId);
      selectors.unmountArray = () => getRootUnmountArrayRoot(state)(rootNodeId);
      selectors.setTreeIds = action => setTreeIdsRecursively(
        state,
        rootNodeId,
        action
      );

      /*
        Sneaking most recent redux state into the component without a re-render
        cache is initiated for the root component and passed a prop by the
        collapserProvider to all children of the root - so they share
        the same cache obj.
      */
      cache.setCurrentReduxState(state);

      /*
        Set the cache with initial values before anything has rendered / mounted.
        This is the only place to do this since this is derived state - otherwise
        you get undefined prop errors that I don't want to typecheck away.

        We only do this once to prevent further changes - as we rely on setstate
        after first render.
      */
      if (areAllItemsExpanded === null) {
        areAllItemsExpanded = initAreAllItemsExpanded(cache, id, isOpenedInit);
      }
      return {
        areAllItemsExpanded,
        selectors,
      };
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToPropsFactory,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
