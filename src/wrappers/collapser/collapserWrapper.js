import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';

import createCache from '../../caching/recursionCache';
import providerCaches from '../../caching/providerCaches';

import { getRootNodeRoot, getRootNodeRecurseNodeTargetRoot, getNodeTargetArrayRoot } from '../../selectors/rootNode';
import {
  nestedCollapserItemsRoot,
  nestedCollapserItemsExpandedRootEvery,
  getCollapserCollapsersRoot,
  setTreeIdsRecursively,
} from '../../selectors/collapser';


export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    static getDerivedStateFromProps(props, state) {
      console.log('getDerivedStateFromProps - CollapserController - collapserId, props, state', props.collapserId, props, state);
      const {
        areAllItemsExpandedSelector,
        collapserId,
        getNodeTargetArray,
        recurseNodeTarget,
        isRootNode,
        // rootNodeState,
        setTreeIdsSelector,
        setTreeId,
      } = props;
      let areAllItemsExpandedUpdate = state.areAllItemsExpanded;
      // const { recurseNodeTarget } = rootNodeState;

      if (isRootNode) {
        let newTarget = recurseNodeTarget === null ? [-1] : [recurseNodeTarget];
        const nodeTargetArray = getNodeTargetArray();
        if (nodeTargetArray.length > 0) {
          newTarget = nodeTargetArray
        }
        state.cache.unlockCache();
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector(newTarget, state.cache);
        state.cache.lockCache();
      } else {
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector([collapserId], state.cache);
      }
      return {
        areAllItemsExpanded: areAllItemsExpandedUpdate,
      };
    }

    constructor(props) {
      super(props);
      console.log('CollapserController this constructor', this);

      console.log('constructor - CollapserController - collapserId, props', props.collapserId, props);
    }

    getRootNodeId = () => { // eslint-disable-line react/sort-comp
      const {
        isRootNode,
        collapserId,
        rootNodes,
        providerType
      } = this.props;
      return isRootNode ? collapserId : rootNodes[providerType];
    }

    getCache = () => { // eslint-disable-line react/sort-comp
      const { isRootNode, providerType } = this.props;
      const rootNodeId = this.getRootNodeId();
      const providerCache = providerCaches[providerType];
      if (isRootNode) {
        providerCache[rootNodeId] = createCache();
      }
      return providerCache[rootNodeId];
    }

    state = {
      areAllItemsExpanded: null,
      cache: this.getCache(),
    };

    componentDidMount() {
      const {
        addToNodeTargetArray,
        collapserId,
        isRootNode,
        watchInitCollapser
      } = this.props;
      const { props, state } = this;
      console.log('componentDidMount - CollapserController - collapserId, props, state', props.collapserId, props, state);

      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);

      /*
        On insertion of new node - we shouldn't check unrelated branches - so set this.
      */
      const addNodeValue = isRootNode ? null : collapserId;
      addToNodeTargetArray(addNodeValue, this.getRootNodeId());
      props.setTreeIdsSelector(props.setTreeId);
    }

    whyUpdate = (state, nextState, component, id, checkAgainst = []) => {
      Object.keys(state).forEach((key) => {
        if (!checkAgainst.includes(key) && state[key] !== nextState[key]) {
          console.log(`whyUpdate:  ${component} - id: ${id}, key: ${key}, value: ${state[key]}, nextValue: ${nextState[key]}`);
        }
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      console.log('shouldComponentUpdate - CollapserController - collapserId, props, state', props.collapserId, props, state);
      const checkAgainstProps = ['rootNodeId', 'setTreeIds', 'rootNodeState', 'recurseNodeTarget', 'getNodeTargetArray', 'allChildItemIds', 'areAllItemsExpandedSelector', 'setTreeIdsSelector'];
      this.whyUpdate(props, nextProps, 'CollapserController - props', props.collapserId, checkAgainstProps);
      this.whyUpdate(state, nextState, 'CollapserController - state', props.collapserId);

      const propsCondition = prop => (
        !checkAgainstProps.includes(prop) && props[prop] !== nextProps[prop]);
      const stateCondition = prop => (state[prop] !== nextState[prop]);
      return Object.keys(props).some(prop => propsCondition(prop))
       || Object.keys(state).some(prop => stateCondition(prop));
    }

    componentDidUpdate() {
      const {
        addToNodeTargetArray,
        collapserId,
        isRootNode,
      } = this.props;
      const { props, state } = this;
      console.log('componentDidUpdate - CollapserController - collapserId, props, state', props.collapserId, props, state);

      if (isRootNode) {
        addToNodeTargetArray(null, this.getRootNodeId());
      }
    }

    componentWillUnmount() {
      const { props, state } = this;
      console.log('componentWillUnmount - CollapserController - collapserId, props, state', props.collapserId, props, state);
    }

    getOffSetTop = () => this.elem.current.offsetTop;

    expandCollapseAll = () => {
      const {
        allChildItemIds,
        collapserId,
        expandCollapseAll,
        parentScrollerId,
        setOffsetTop,
        setRecurseNodeTarget,
        watchCollapser,
      } = this.props;
      const { areAllItemsExpanded } = this.state;
      /*
        This activates a saga that will ensure that all the onHeightReady
        callbacks of nested <Collapse> elements have fired - before dispatching
        a HEIGHT_READY action.  Previously scroller would wait for this.
      */
      watchCollapser(collapserId);

      /*
        setOffsetTop: defines a callback for the saga to call that allows
        the saga to obtain the offsetTop value of the backing instance of this
        component and dispatch that to the redux store.
      */
      setOffsetTop(
        this.getOffSetTop,
        parentScrollerId,
        collapserId,
      );
      allChildItemIds().forEach(itemId => expandCollapseAll(areAllItemsExpanded, itemId));
      setRecurseNodeTarget(collapserId, this.getRootNodeId());
    };

    render() {
      const { props, state } = this;
      console.log('render - CollapserController - collapserId, props, state', props.collapserId, props, state);
      console.log('');

      const {
        expandCollapseAll,
        setOffsetTop,
        watchCollapser,
        watchInitCollapser,
        allChildItemIds,
        ...other
      } = this.props;
      const { areAllItemsExpanded } = this.state;

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
    areAllItemsExpandedSelector: PropTypes.func.isRequired, // includes nested
    allChildItemIds: PropTypes.func.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    setRecurseNodeTarget: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {

    const areAllItemsExpandedSelector = (
      targetNodeArray,
      collapserCache
    ) => nestedCollapserItemsExpandedRootEvery(
      state, { ...ownProps, targetNodeArray }, collapserCache
    );

    /*
    const areAllItemsExpandedSelector = (
      targetNodeId,
      collapserCache
    ) => nestedCollapserItemsExpandedRootEvery(
      state, { ...ownProps, targetNodeId }, collapserCache
    );
    */
    //const childCollapsers = getCollapserCollapsersRoot(state)(ownProps.collapserId);
    //console.log('%c CollapserController - mapStateToProps, collapserId, childCollapsers!', 'color: green; font-weight: bold;', ownProps.collapserId, childCollapsers);
    //console.log('CollapserController - mapStateToProps, collapserId, childCollapsers', ownProps.collapserId, childCollapsers);
    return {
      allChildItemIds: () => nestedCollapserItemsRoot(state, ownProps),
      areAllItemsExpandedSelector,
      setTreeIdsSelector: action => setTreeIdsRecursively(state, ownProps.rootNodeId, action),
      getNodeTargetArray: () => getNodeTargetArrayRoot(state)(ownProps.rootNodeId),
      recurseNodeTarget: getRootNodeRecurseNodeTargetRoot(state)(ownProps.rootNodeId),
      // rootNodeState: getRootNodeRoot(state)(ownProps.rootNodeId)
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
