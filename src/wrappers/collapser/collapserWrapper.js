import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';

import {
  allChildItemIdsSelector,
  allChildItemsExpandedSelector,
  recurseNodeTargetSelector,
} from '../../selectors/selectorTest';

import simpleCache from '../../selectors/simpleCache';


export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    static getDerivedStateFromProps(props, state) {
      const {
        areAllItemsExpandedSelector,
        collapserId,
        recurseNodeTarget,
      } = props;
      // console.log('getDerivedStateFromProps collapserId, derivedStateFromPropsCount', collapserId, state.derivedStateFromPropsCount);
      // console.log('getDerivedStateFromProps collapaserId, state.notifyClick', collapserId, state.notifyClick);

      let areAllItemsExpandedUpdate = state.areAllItemsExpanded;
      let newTarget = recurseNodeTarget;
      if (recurseNodeTarget === null || (collapserId === 0 && state.derivedStateFromPropsCount <= 1)) {
        newTarget = -1;
      }
      if (collapserId === 0) {
        simpleCache.unlockCache();
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector(newTarget);
        simpleCache.lockCache();
      } else {
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector(collapserId);
      }
      console.log('getDerivedStateFromProps collapaserId, areAllItemsExpandedUpdate, state.areAllItemsExpanded', collapserId, areAllItemsExpandedUpdate, state.areAllItemsExpanded);

      return {
        areAllItemsExpanded: areAllItemsExpandedUpdate,
        derivedStateFromPropsCount: state.derivedStateFromPropsCount + 1,
      };
    }

    state = {
      areAllItemsExpanded: null,
      derivedStateFromPropsCount: 0,
    };

    componentDidMount() {
      const { collapserId, watchInitCollapser } = this.props;
      //console.log('componentDidMount collapserId', collapserId);

      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
      //console.log('');
    }

    shouldComponentUpdate(nextProps, nextState) {
      const { props, state } = this;
      const checkAgainstProps = ['recurseNodeTarget', 'recurseNodeTarget', 'allChildItemIds', 'areAllItemsExpandedSelector'];
      const propsCondition = prop => (
        !checkAgainstProps.includes(prop) && props[prop] !== nextProps[prop]);

      const stateCondition = prop => (
        prop !== 'derivedStateFromPropsCount'
        && state[prop] !== nextState[prop]);

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
      allChildItemIds().forEach(([nextCollapserId, itemIdArray]) => itemIdArray.forEach(
        itemId => expandCollapseAll(areAllItemsExpanded, itemId, nextCollapserId)
      ));
      setRecurseNodeTarget(collapserId);
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
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: PropTypes.number,

    /* provided by redux */
    areAllItemsExpanded: PropTypes.func.isRequired, // includes item children of nested collapsers
    allChildItemIds: PropTypes.func.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    setRecurseNodeTarget: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {

    const areAllItemsExpandedSelector = targetNodeId => allChildItemsExpandedSelector(
      state, { ...ownProps, targetNodeId }
    );

    return {
      allChildItemIds: () => allChildItemIdsSelector(state, ownProps),
      areAllItemsExpandedSelector,
      recurseNodeTarget: recurseNodeTargetSelector(state, ownProps),
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
