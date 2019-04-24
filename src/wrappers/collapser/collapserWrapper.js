import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';
// import selectors from '../../selectors';
import {
  areAllChildItemsExpanded,
  allChildItemIdsSelector,
  recurseToNodeGetAllChildItemsExpanded,
  recurseNodeTargetSelector,
} from '../../selectors/selectorTest';

import simpleCache from '../../selectors/simpleCache';

// const { allChildItemsSelector } = selectors.collapser;

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    static getDerivedStateFromProps(props, state) {
      const {
        areAllItemsExpandedTarget,
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
        areAllItemsExpandedUpdate = areAllItemsExpandedTarget(newTarget);
        simpleCache.lockCache();
      } else {
        areAllItemsExpandedUpdate = areAllItemsExpandedTarget(collapserId);
      }
      console.log('getDerivedStateFromProps collapaserId, areAllItemsExpandedUpdate, state.areAllItemsExpanded', collapserId, areAllItemsExpandedUpdate, state.areAllItemsExpanded);

      // areAllItemsExpandedUpdate = areAllItemsExpanded();

      return {
        areAllItemsExpanded: areAllItemsExpandedUpdate,
        derivedStateFromPropsCount: state.derivedStateFromPropsCount + 1,
        // notifyClick: false,
      };
    }

    constructor(props, context) {
      super(props, context);
      //console.log('constructor collapserId', props.collapserId);
      this.state = {
        areAllItemsExpanded: null,
        notifyClick: false,
        //notifiedByChild: false,
        //notifiedParentFromCallback: false,
        derivedStateFromPropsCount: 0,
      };
    }

    componentDidMount() {
      const { collapserId, watchInitCollapser } = this.props;
      //console.log('componentDidMount collapserId', collapserId);

      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
      //console.log('');
    }

    shouldComponentUpdate(nextProps, nextState) {
      // console.log('shouldComponentUpdate collapserId', nextProps.collapserId);

      /*

      shouldComponentUpdate used to prevent unecessary renders caused
      by the allChildItemsSelector returning an array of item objects.  If any
      item changes one of it's properties a re-render is forced on every item
      in the collapser.

      Using the entire item object made the reducers cleaner - and using just
      an array of ids had a similar problem because the selectors were creating
      arrays with distinct object ids even when equivlent.

      */
      const { props, state } = this;
      const condition = prop => (prop !== 'recurseNodeTarget' && prop !== 'notifiedByChild' && prop !== 'areAllItemsExpanded' && prop !== 'allChildItems' && prop !== 'areAllItemsExpandedTarget' && props[prop] !== nextProps[prop]);
      // const condition2 = prop => (prop !== 'areAllItemsExpanded' && prop !== 'allChildItems' && state[prop] !== nextState[prop]);
      const condition3 = prop => (prop !== 'derivedStateFromPropsCount' && prop !== 'notifiedParentFromCallback' && prop !== 'notifiedByChild' && state[prop] !== nextState[prop]);
      let shouldUpdate = false;
      Object.keys(props).some(
        (prop) => {
          if (condition(prop)) {
          // console.log('should Update true prop: collapserId, prop, prev, next', props.collapserId, prop, props[prop], nextProps[prop]);
          shouldUpdate = true;
          }

        }
      );
      Object.keys(state).some(
        (prop) => {
          if (condition3(prop)) {
          // console.log('should Update true FRPM STATE: props.collapserId, prop, prev, next', props.collapserId, prop, state[prop], nextState[prop]);
          shouldUpdate = true;
        }
      });
      // console.log('returning from shouldUPdate:', shouldUpdate);
      //console.log('');
      return shouldUpdate;


      /*
      return Object.keys(props).some(
        prop => (prop !== 'allChildItems' && props[prop] !== nextProps[prop])
      );
      */
    }

    /*
    componentDidUpdate() {
      const { notifyClick } = this.state;
      const { areAllItemsExpandedTarget, collapserId } = this.props;
      if (notifyClick) {
        simpleCache.unlockCache();
        console.log('notify click detected, collapserId', collapserId);
        const areAllItemsExpanded = areAllItemsExpandedTarget(collapserId);
        simpleCache.lockCache();
        this.setState(() => ({
          areAllItemsExpanded,
          notifyClick: false,
        }));
      }
    }
*/
    getOffSetTop = () => this.elem.current.offsetTop;

    expandCollapseAll = () => {
      const {
        allChildItems,
        collapserId,
        expandCollapseAll,
        notifyParentCollapser,
        parentCollapserId,
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

      const allChild = allChildItems();
      //console.log('collapserId, allChild', collapserId, allChild);
      allChildItems().forEach(([nextCollapserId, itemIdArray]) => itemIdArray.forEach(
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
        allChildItems,
        ...other
      } = this.props;
      const { areAllItemsExpanded } = this.state;
      //console.log('render collapserId', this.props.collapserId);
      //console.log('');
      this.derivedStateFromPropsCount += 1;
      // console.log('');
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
    allChildItems: PropTypes.func.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    setRecurseNodeTarget: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {
    // console.log('mapStateToProps collapserId', ownProps.collapserId);
    const areAllItemsExpanded = () => areAllChildItemsExpanded(state, ownProps);

    const areAllItemsExpandedTarget = targetNodeId => recurseToNodeGetAllChildItemsExpanded(
      state, { ...ownProps, targetNodeId }
    );


    return {
      allChildItems: () => allChildItemIdsSelector(state, ownProps),
      areAllItemsExpanded,
      areAllItemsExpandedTarget,
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
