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
  collapserImmediateItemsExpandedRootEvery,
  getImmediateChildItemsRoot,
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


    constructor(props, context) {
      super(props, context);
      setContextAttrs(this);
      this.areAllItemsExpandedWorker = this.methods.collapser.areAllItemsExpandedWorker;
      this.checkIfActiveSibling = this.methods.collapser.checkIfActiveSibling;

      this.subscribeToExpandAll = this.methods.collapser.subscribeToExpandAll;
      this.unsubscribeFromExpandAll = this.methods.collapser.unsubscribeFromExpandAll;
      this.getExpandAllRegistry = this.methods.collapser.getExpandAllRegistry;


      this.cache = this.methods.collapser.cache;

      const { areAllItemsExpanded, setActiveChildLimit } = props;
      this.state = { areAllItemsExpanded };

      /*
        just sets the user provided value for this props.

        Move to the context.
      */
      if (!isUndefNull(setActiveChildLimit)
        && setActiveChildLimit !== CollapserController.defaultProps.setActiveChildLimit) {
        this.methods.collapser.setActiveChildrenLimit(setActiveChildLimit);
      }
      this.areAllItemsExpandedWorker.addEventListener('message', this.handleAllItemsExpandedWorkerMessage);

    }

    componentDidMount() {

      /*
        Make sure users pass a ref to a DOM node.
      */
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      this.setCacheOnMount();
    }

    componentWillUnmount() {
      const { id } = this;
      this.areAllItemsExpandedWorker.removeEventListener('message', this.handleAllItemsExpandedWorkerMessage);
      this.cache.deleteRecursionCacheEntry(id);
    }

    /*
            0
          /   \
         1     4
       /   \  /  \
      2    3 5    6

      Given the above tree.  The mount order will be:
        2, 3, 1, 5, 6, 4, 0  - in order traversal.

        great refresher pages on trees.
        // https://www.freecodecamp.org/news/all-you-need-to-know-about-tree-data-structures-bceacb85490c/


      SetCacheOnMount intialises the mounting related state that it needs to keep track

      It needs to know when the current mounting cycle is finishing so it can then
      check if the tree ides need to be set because a node has orphaned.

      I used a contstructor of a HoC higher up in the heirarchy.

      It is sent information about mounting of nodes in normal sort order.
      Mount orrder is in-order traversal - which doesn't work for my algo for
      orphan detection.  And gets this info before the collapsers mount.

      Thus it can see in advance how many new child coming down the pipe.

      The cache handles tracking once we've hit the mount node.

      So we only rebuild the tree if there is an orphan and only once per
      render cycle.
    */
    setCacheOnMount() {
      const { props: { _reactScrollCollapse: { isRootNode, parents } }, id } = this;
      const parentId = parents && parents.collapser;
      const { orphanNodeCache } = this.cache;
      const finishedMounting = orphanNodeCache.registerActualMount(id, parentId);
      if (finishedMounting) {
        const [orphaned] = orphanNodeCache.checkPendingNodes(
          id, parentId
        );

        if (isRootNode) {
          this.initiateTreeStateCheck();
        }

        /*
          Cache is cleaned of previous info about the tree - so it can
          refresh it's state.  initiateTreeStateCheck does the areAllItemsExpanded
          selection.  Passing true tells it to rebuld the tree while it's going
          down there.  Nasty couple again - but efficient.
        */
        if (orphaned && !isRootNode) {
          orphanNodeCache.initCache();
          this.initiateTreeStateCheck(true);
        }
      }
    }

    /*
      Went from firing an action for every collapser to the store,
      to making a it a single action - and now to local state.
      I don't wonder which is the most efficient.
    */
    setExpandedState = () => {
      const { id } = this;
      const { areAllItemsExpanded } = this.state;
      const cachedValue = this.cache.getResultValue(id);
      if (areAllItemsExpanded !== cachedValue) {
        this.setState(() => ({
          areAllItemsExpanded: cachedValue
        }));
      }
    }

    doOnExpandAll = (areAllItemsExpanded, childSelector, expand = true, scroll = true) => () => {
      const { rootNodeId } = this;
      const { expandCollapseAll } = this.props;
      if (expand) {
        expandCollapseAll(areAllItemsExpanded, childSelector, rootNodeId);
      }
      if (this.methods.scroller && scroll) {
        this.methods.scroller.scrollToTop(this.elem.current);
      }
      this.unsubscribeFromExpandAll(this.expandAllSubscriberId);
    }

    expandCollapseAll = () => {
      const { id, rootNodeId } = this;
      /*
        nodeTargetArray is an array of ids to which the treeStateChecker
        will bee line before checking every node underneath.  In this case it
        will be the instance of the component that fired the hanlder.
      */
      const {
        addToNodeTargetArray,
        expandCollapseAll,
        susbcribeToExpandAll,
        selectors: { allChildItemIds: allChildItemIdsSelector }
      } = this.props;
      const { areAllItemsExpanded } = this.state;
      const isActiveSibling = this.checkIfActiveSibling();
      const allChildItemIds = allChildItemIdsSelector();

      /*
        Adding the current collapserId to the targetNodes - tells the
        tree state selector where in the tree to go.

        NOTE: must dispatch relevant redux actions before checking tree state.
        mapStateToProps will fire immediately and update the cache that
        the selector uses.
      */
      addToNodeTargetArray(id, rootNodeId, true);
      if (this.methods.collapser) {
        this.methods.collapser.addSelfToActiveSiblings(this.state);
      }

      if (!areAllItemsExpanded && rootNodeId !== id && !isActiveSibling && susbcribeToExpandAll) {
        /*
          Expanding Everything - wait for width before scroll and expand.
        */
        this.expandAllSubscriberId = this.subscribeToExpandAll(
          this.doOnExpandAll(areAllItemsExpanded, allChildItemIds)
        );
      } else {
        if (this.methods.scroller) {
          this.methods.scroller.scrollToTop(this.elem.current);
        }
        expandCollapseAll(areAllItemsExpanded, allChildItemIds, rootNodeId);
      }
      this.initiateTreeStateCheck();
    };

    expandCollapseItems = () => {
      const { id, rootNodeId } = this;
      const {
        addToNodeTargetArray,
        expandCollapseAll,
        selectors: {
          childItemIds: childItemIdsSelector,
          allChildItemsExpanded: allChildItemsExpandedSelector,
          childCollapsers: childCollapsersSelector,
        },
        susbcribeToExpandAll,
      } = this.props;
      const isActiveSibling = this.checkIfActiveSibling();
      const allChildItemsExpanded = allChildItemsExpandedSelector();
      const childItemIds = childItemIdsSelector();
      const childCollapsers = childCollapsersSelector();
      // TODO: investigate why childCollapsers passed as nodeTargetArray
      // doesn't work.
      childCollapsers.forEach((childId, i) => {
        const clearTargets = i === 0;
        addToNodeTargetArray(childId, rootNodeId, clearTargets);
      });

      if (this.methods.collapser) {
        this.methods.collapser.addSelfToActiveSiblings(this.state);
      }
      if (!allChildItemsExpanded && rootNodeId !== id && !isActiveSibling && susbcribeToExpandAll) {
        this.expandAllSubscriberId = this.subscribeToExpandAll(
          this.doOnExpandAll(allChildItemsExpanded, childItemIds)
        );
      } else {
        if (this.methods.scroller) {
          this.methods.scroller.scrollToTop(this.elem.current);
        }
        expandCollapseAll(allChildItemsExpanded, childItemIds, rootNodeId);
      }
      // second false stops it from flipping values of children of targetNodes
      this.initiateTreeStateCheck(false, false);
    };

    /*
      The callback from the webworker.  Receive its' updated state.
    */
    handleAllItemsExpandedWorkerMessage = (e) => {
      const { orphanNodeCacheClone, recursionCacheClone } = e.data;
      if (!e) {
        return;
      }
      if (this.isRootNode) {
        /*
          Have to do a careful merge here because by the time this
          listener is fired, the copy of the orphanNodeCache sent to the
          web worker is out of date with respect to the info relating
          to node mounting, but has the latest information about
          orphaned nodes.

          That's another reason why these need to be split into separate
          caches.
        */
        const newOrphanCache = {
          ...this.cache.orphanNodeCache.getCache(),
          activeForks: orphanNodeCacheClone.activeForks,
          checkedParents: orphanNodeCacheClone.checkedParents,
          largestActiveFork: orphanNodeCacheClone.largestActiveFork,
          lowestActiveFork: orphanNodeCacheClone.lowestActiveFork,
          orphanNodes: orphanNodeCacheClone.orphanNodes,
          rangeUpperBound: orphanNodeCacheClone.rangeUpperBound,
        };
        this.cache.orphanNodeCache.setCache(newOrphanCache);
        this.cache.setCache(recursionCacheClone);
      }
      this.setExpandedState(this.props);
    }

    /*
      Methods managed by the context.
    */

    initiateTreeStateCheck = (
      setTreeId,
      flipChildValues
    ) => this.methods.collapser.initiateTreeStateCheck(
      setTreeId,
      flipChildValues
    );

    isActiveSibling = () => this.methods.collapser.checkIfActiveSibling();

    noActiveSiblings = () => this.methods.collapser.noActiveSiblings();

    /*
      Props are mostlye clean now - but still some ot pull.
    */
    cleanProps = props => cleanHoCProps(
      props,
      {
        ...collapserWrapperActions,
        ...collapserContextActions,
      },
      [
        'contextProps',
        'rootNodeId',
        'selectors',
        'setActiveChildLimit',
        '_reactScrollCollapseParents'
      ]
    );

    render() {
      const { areAllItemsExpanded } = this.state;
      const cleanProps = this.cleanProps(this.props);
      return (
        <WrappedComponentRef
          {...cleanProps}
          isActiveSibling={this.isActiveSibling(this.props)}
          noActiveSiblings={this.noActiveSiblings(this.props)}
          ref={this.elem}
          expandCollapseAll={this.expandCollapseAll}
          expandCollapseItems={this.expandCollapseItems}
          areAllItemsExpanded={areAllItemsExpanded}
        />
      );
    }
  }

  CollapserController.defaultProps = {
    setActiveChildLimit: 1,
    susbcribeToExpandAll: false,
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */

    /* provided by redux */
    addToNodeTargetArray: PropTypes.func.isRequired,
    areAllItemsExpanded: PropTypes.bool.isRequired,
    expandCollapseAll: PropTypes.func.isRequired,

    /*
      If all items have been set to be open on first render,
      set isOpenedInit to true to prevent a render flash.
    */
    isOpenedInit: PropTypes.bool.isRequired,
    selectors: PropTypes.object.isRequired, // includes nested
    setTreeId: PropTypes.func.isRequired,
    toggleCheckTreeState: PropTypes.func.isRequired,
    _reactScrollCollapse: PropTypes.object.isRequired,

    /* provided by scrollerProvider via context */

    /* provided by user */
    setActiveChildLimit: PropTypes.number,
    susbcribeToExpandAll: PropTypes.bool,
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
      const { _reactScrollCollapse: { id, rootNodeId, methods: { collapser: { cache } } } } = props;
      const { isOpenedInit } = props;
      selectors.allChildItemIds = () => nestedCollapserItemsRoot(state, props);
      selectors.childCollapsers = () => getCollapserCollapsersRoot(state)(id);
      selectors.childItemIds = () => getImmediateChildItemsRoot(state)(id);
      selectors.allChildItemsExpanded = () => collapserImmediateItemsExpandedRootEvery(state)(id);
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
