import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';

import recursionCacheFactory from '../../caching/recursionCache';
import { getRecurseNodeTargetRoot } from '../../selectors/common';
import {
  nestedCollapserItemsRoot,
  nestedCollapserItemsExpandedRootEvery,
} from '../../selectors/collapser';

const cache = recursionCacheFactory();

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

      let areAllItemsExpandedUpdate = state.areAllItemsExpanded;
      const newTarget = recurseNodeTarget === null ? -1 : recurseNodeTarget;

      if (collapserId === 1) {
        cache.unlockCache();
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector(newTarget);
        cache.lockCache();
      } else {
        areAllItemsExpandedUpdate = areAllItemsExpandedSelector(collapserId);
      }
      return {
        areAllItemsExpanded: areAllItemsExpandedUpdate,
      };
    }

    state = {
      areAllItemsExpanded: null,
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
    areAllItemsExpandedSelector: PropTypes.func.isRequired, // includes nested
    allChildItemIds: PropTypes.func.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    setRecurseNodeTarget: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {

    const areAllItemsExpandedSelector = targetNodeId => nestedCollapserItemsExpandedRootEvery(
      state, { ...ownProps, targetNodeId }, cache
    );

    return {
      allChildItemIds: () => nestedCollapserItemsRoot(state, ownProps),
      areAllItemsExpandedSelector,
      recurseNodeTarget: getRecurseNodeTargetRoot(state, ownProps),
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
