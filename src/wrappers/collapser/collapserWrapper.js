import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing, ofObjectTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';

import { getNodeTargetArrayRoot, getCheckTreeStateRoot } from '../../selectors/rootNode';
import {
  nestedCollapserItemsRoot,
  nestedCollapserItemsExpandedRootEvery,
  setTreeIdsRecursively,
} from '../../selectors/collapser';

import {
  compareIntArrays,
  getCache,
  getRootNodeId,
} from '../utils';

import addLoggingDefaultsToComponent from '../../utils/logging/utils';

let renderCount = 0;

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    /*

    static getDerivedStateFromProps(props, state) {
      const {
        areAllItemsExpandedSelector,
        collapserId,
        nodeTargetArray,
        isRootNode,
        addToNodeTargetArray,
      } = props;
      let areAllItemsExpandedUpdate = state.areAllItemsExpanded;
      if (isRootNode) {
        state.cache.unlockCache();
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector.selector(
          nodeTargetArray,
          state.cache
        );
        state.cache.lockCache();
        if (nodeTargetArray.length > 0) {
          addToNodeTargetArray(null, collapserId);
        }
      } else {
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector.selector(
          [collapserId],
          state.cache
        );
      }
      return {
        areAllItemsExpanded: areAllItemsExpandedUpdate,
      };
    }
    */

    componentDidMount() {
      const {
        addToNodeTargetArray,
        collapserId,
        isRootNode,
        setTreeId,
        setTreeIdsSelector,
        toggleCheckTreeState,
        watchInitCollapser
      } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);

      /*
        On insertion of new node - we shouldn't check unrelated branches - so set this.
      */
      const addNodeValue = isRootNode ? null : collapserId;
      const rootNodeId = getRootNodeId(collapserId, this.props);
      addToNodeTargetArray(addNodeValue, rootNodeId);
      setTreeIdsSelector.selector(setTreeId);
      if (isRootNode) {
        toggleCheckTreeState(rootNodeId);
      }
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      const checkAgainstProps = ['rootNodeId', 'setTreeIds', 'setTreeId', 'allChildItemIds', 'nodeTargetArray',
        'areAllItemsExpandedSelector', 'setTreeIdsSelector'];

      const propsCondition = (prop, stateCheckValue) => {
        const left = !checkAgainstProps.includes(prop) && props[prop] !== nextProps[prop];
        const right = prop === 'nodeTargetArray' && !compareIntArrays(props[prop], nextProps[prop]) && stateCheckValue;
        return left || right;
      };

      const stateCondition = prop => (state[prop] !== nextState[prop]);
      const stateCheckValue = Object.keys(state).some(prop => stateCondition(prop));

      return Object.keys(props).some(prop => propsCondition(prop, stateCheckValue))
       || stateCheckValue;
    }
    */

    componentDidUpdate() {
      const { addToNodeTargetArray, collapserId, isRootNode, nodeTargetArray, toggleCheckTreeState } = this.props;
      const targetArray = nodeTargetArray.selector();
      const rootNodeId = getRootNodeId(collapserId, this.props);
      if (targetArray.includes(collapserId)) {
        addToNodeTargetArray(null, rootNodeId);
        toggleCheckTreeState(rootNodeId);

        // debugger;
      }
    }

    componentWillUnmount() {
      const { addToNodeTargetArray, collapserId, nodeTargetArray } = this.props;
      if (nodeTargetArray.selector().includes(collapserId)) {
        // addToNodeTargetArray(null, getRootNodeId(collapserId, this.props));
      }
    }

    expandCollapseAll = () => {
      const {
        allChildItemIds,
        areAllItemsExpanded,
        collapserId,
        expandCollapseAll,
        addToNodeTargetArray,
        watchCollapser,
        isRootNode,
        contextMethods,
      } = this.props;
      // const { areAllItemsExpanded } = this.state;
      /*
        This activates a saga that will ensure that all the onHeightReady
        callbacks of nested <Collapse> elements have fired - before dispatching
        a HEIGHT_READY action.  Previously scroller would wait for this.
      */
      watchCollapser(collapserId);
      if (contextMethods) {
        contextMethods.scrollToTop(this.elem.current);
      }
      // allChildItemIds.selector().forEach(itemId => expandCollapseAll(areAllItemsExpanded, itemId));
      const rootNodeId = getRootNodeId(collapserId, this.props);
      expandCollapseAll(areAllItemsExpanded, allChildItemIds.selector(), rootNodeId);
      if (!isRootNode) {
        addToNodeTargetArray(collapserId, getRootNodeId(collapserId, this.props), true);
      } else {
        addToNodeTargetArray(null, getRootNodeId(collapserId, this.props));
      }
    };

    render() {
      const {
        allChildItemIds,
        areAllItemsExpanded,
        expandCollapseAll,
        watchCollapser,
        watchInitCollapser,
        areAllItemsExpandedSelector,
        setTreeIdsSelector,
        nodeTargetArray,
        ...other
      } = this.props;
      /*
      console.log('collapserRender', this.props.collapserId);
      if (this.props.collapserId === 0) {
        renderCount += 1;
        console.log('root rendercount:', renderCount);
      }
      */
      return (
        <WrappedComponentRef
          {...other}
          ref={this.elem}
          expandCollapseAll={this.expandCollapseAll}
          areAllItemsExpanded={areAllItemsExpanded}
        />
      );
    }
  }

  CollapserController.defaultProps = {
    collapserId: null,
    contextMethods: null,
    parentCollapserId: null,
    parentScrollerId: null,
    rootNodes: {},
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: PropTypes.number,
    isRootNode: PropTypes.bool.isRequired,
    providerType: PropTypes.string.isRequired,
    rootNodes: PropTypes.object,

    /* provided by redux */
    addToNodeTargetArray: PropTypes.func.isRequired,
    areAllItemsExpandedSelector: PropTypes.func.isRequired, // includes nested
    allChildItemIds: PropTypes.func.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setTreeId: PropTypes.func.isRequired,
    setTreeIdsSelector: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,

    /* provided by scrollerProvider via context */
    contextMethods: ofObjectTypeOrNothing,
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
    Overall strategy is to prevent mapStateToProps from calling the selectors
    directly - because we only want the root node to check state at the
    beginning of each cycle.  So we pass in selector functions which then
    get called inside the component when required.

    However - the functions must be generated anew with each state change
    otherwise they will return stale values.  And if you pass in a
    new function then connect() will force an update to the component - using
    setState (I think in a componentDidUpdate method) - because the functions
    will always fail an identity check.

    This was mostly fine because I was preventing rendering with componentShouldUpdate

    BUT - turns out that you have a budget of 50 setStates in componentDidUpdate
    in a single render cycle.  If you use this component to nest to a depth
    of fifty - then one more call to setState in componentDidUpdate And
    react thinks you're in an infinite loop and hard fails.

    Part Solution is to use an object in which to store the selector functions.  We
    can update the functions with new state every time, but the object itself stays
    the same.  This prevents unecessary forced updates.

    But - if we do this for all values - then redux never thinks a change has
    happened at all - and the component is never updated.  Also child subscribers
    are never called either.

    Basically don't think this approach can work - it relied on being able to
    check state at each level of the tree inside the component -
    but that's a setState call by redux for every node all the way down, which
    hits the setState limit.
  */

  const countCache = {};
  // console.log('countCache', countCache);

  const mapStateToPropsFactory = () => {

    const setTreeIdsDummy = {};
    const allChildItemsDummy = {};
    const nodeTargetArrayDummy = {};
    let checkTreeStateCurrent = null;
    let checkTreeStateNext = null;
    return (state, ownProps) => {
      const cache = ownProps.contextMethods.collapser.getCache(ownProps);
      const {
        collapserId,
        isRootNode,
      } = ownProps;
      let areAllItemsExpanded;
      const nodeTargetArray = getNodeTargetArrayRoot(state)(ownProps.rootNodeId);

      if (isRootNode) {
        checkTreeStateNext = getCheckTreeStateRoot(state)(ownProps.rootNodeId);
      }

      /*
      if (isRootNode && checkTreeStateNext !== checkTreeStateCurrent) {
        if (!countCache[collapserId]) {
          countCache[collapserId] = {};
        }
        if (!countCache[collapserId][renderCount]) {
          countCache[collapserId][renderCount] = 1;
        } else {
          countCache[collapserId][renderCount] += 1;
        }
      }
      */
      if (isRootNode && checkTreeStateNext !== checkTreeStateCurrent) {
        cache.unlockCache();
        areAllItemsExpanded = nestedCollapserItemsExpandedRootEvery(
          state, { ...ownProps, nodeTargetArray }, cache
        );
        cache.lockCache();
        checkTreeStateCurrent = checkTreeStateNext;
      } else {
        areAllItemsExpanded = nestedCollapserItemsExpandedRootEvery(
          state, { ...ownProps, nodeTargetArray: [collapserId] }, cache
        );
      }

      setTreeIdsDummy.selector = action => setTreeIdsRecursively(
        state,
        ownProps.rootNodeId,
        action
      );
      nodeTargetArrayDummy.selector = () => getNodeTargetArrayRoot(state)(ownProps.rootNodeId);
      allChildItemsDummy.selector = () => nestedCollapserItemsRoot(state, ownProps);
      return {
        allChildItemIds: allChildItemsDummy,
        areAllItemsExpanded,
        nodeTargetArray: nodeTargetArrayDummy,
        setTreeIdsSelector: setTreeIdsDummy,
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
