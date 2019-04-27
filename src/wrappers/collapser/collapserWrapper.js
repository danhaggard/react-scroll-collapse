import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';

import createCache from '../../caching/recursionCache';
import providerCaches from '../../caching/providerCaches';

import { getRootNodeRoot } from '../../selectors/rootNode';
import {
  nestedCollapserItemsRoot,
  nestedCollapserItemsExpandedRootEvery,
} from '../../selectors/collapser';


export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    static getDerivedStateFromProps(props, state) {
      const {
        areAllItemsExpandedSelector,
        collapserId,
        isRootNode,
        rootNodeState,
      } = props;
      let areAllItemsExpandedUpdate = state.areAllItemsExpanded;
      const { recurseNodeTarget } = rootNodeState;
      const newTarget = recurseNodeTarget === null ? -1 : recurseNodeTarget;

      if (isRootNode) {
        state.cache.unlockCache();
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector(newTarget, state.cache);
        state.cache.lockCache();
      } else {
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector(collapserId, state.cache);
      }
      return {
        areAllItemsExpanded: areAllItemsExpandedUpdate,
      };
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
      const { collapserId, watchInitCollapser } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
    }

    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      const checkAgainstProps = ['recurseNodeTarget', 'allChildItemIds', 'areAllItemsExpandedSelector'];
      const propsCondition = prop => (
        !checkAgainstProps.includes(prop) && props[prop] !== nextProps[prop]);
      const stateCondition = prop => (state[prop] !== nextState[prop]);
      return Object.keys(props).some(prop => propsCondition(prop))
       || Object.keys(state).some(prop => stateCondition(prop));
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
      targetNodeId,
      collapserCache
    ) => nestedCollapserItemsExpandedRootEvery(
      state, { ...ownProps, targetNodeId }, collapserCache
    );

    return {
      allChildItemIds: () => nestedCollapserItemsRoot(state, ownProps),
      areAllItemsExpandedSelector,
      rootNodeState: getRootNodeRoot(state)(ownProps.rootNodeId)
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
