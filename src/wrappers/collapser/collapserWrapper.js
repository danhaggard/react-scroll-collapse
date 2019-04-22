import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofBoolTypeOrNothing, ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';
// import selectors from '../../selectors';
import {
  areAllChildItemsExpanded,
  allChildItemIdsSelector,
  areAllItemsExpandedStateSelectorRoot,
  notifiedByChildSelectorSelectorRoot,
} from '../../selectors/selectorTest';

// const { allChildItemsSelector } = selectors.collapser;

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    static getDerivedStateFromProps(props, state) {
      const {
        areAllItemsExpanded,
        collapserId,
        notifiedByChild,
        notifyParentCollapser,
        parentAreAllItemsExpanded,
        parentCollapserId,
        setAllChildItemsExpanded
      } = props;

      let areAllItemsExpandedUpdate = state.areAllItemsExpanded;
      const parentAreAllItemsExpandedValue = parentAreAllItemsExpanded();
      const notifiedByChildValue = notifiedByChild();
      const { notifiedParentFromCallback } = state;
      let newNotifiedParentFromCallback = notifiedParentFromCallback;
      //console.log('getDerivedStateFromProps -parentAreAllItemsExpanded, state.areAllItemsExpanded', props.collapserId, parentAreAllItemsExpandedValue, state.areAllItemsExpanded);
      //console.log('props.collapserId, parentCollapsaerId', props.collapserId,parentCollapserId);

      const notifiedByChildChange = state.notifiedByChild !== notifiedByChildValue;
      //console.log('props.collapserId, notifiedByChildChange', props.collapserId, notifiedByChildChange);
      //console.log('props.collapserId, notifiedParentFromCallback', props.collapserId, notifiedParentFromCallback);

      if (
        (parentAreAllItemsExpandedValue === null && state.areAllItemsExpanded === null)
        || (parentAreAllItemsExpandedValue === null && notifiedByChildChange === true)
        || (parentAreAllItemsExpandedValue === null && notifiedParentFromCallback === null)
      ) {
        areAllItemsExpandedUpdate = areAllItemsExpanded();
        newNotifiedParentFromCallback = false;
      }

      if (parentAreAllItemsExpandedValue === true) {
        areAllItemsExpandedUpdate = parentAreAllItemsExpandedValue;
      }

      if (
        (parentAreAllItemsExpandedValue === false && state.areAllItemsExpanded === false && notifiedByChildChange === true)
        || (parentAreAllItemsExpandedValue === false && notifiedParentFromCallback === true && notifiedByChildChange === false)
        || (parentAreAllItemsExpandedValue === false && notifiedParentFromCallback === false && state.areAllItemsExpanded === true && notifiedByChildChange === false)
      ) {
        areAllItemsExpandedUpdate = areAllItemsExpanded();
      }

      if (
        parentCollapserId !== null && notifiedParentFromCallback === true && parentAreAllItemsExpandedValue === false
      ) {
        //console.log('getDerivedStateFromProps, setting newNotifiedParentFromCallback to false - props.collapserId, notifiedParentFromCallback', props.collapserId, notifiedParentFromCallback);

        newNotifiedParentFromCallback = false;
      }

      if (state.areAllItemsExpanded !== areAllItemsExpandedUpdate) {
        setAllChildItemsExpanded(collapserId, areAllItemsExpandedUpdate);
      }

      if (
        (state.areAllItemsExpanded !== areAllItemsExpandedUpdate
        && parentCollapserId !== null
        && parentAreAllItemsExpandedValue !== true
        && notifiedParentFromCallback === false)
        || (notifiedByChildChange === true && parentCollapserId !== null)
      ) {
        //console.log('getDerivedStateFromProps - notifying parent props.collapserId', props.collapserId, props.parentCollapserId);

        notifyParentCollapser(parentCollapserId);
      }
      //console.log('getDerivedStateFromProps - props.collapserId, areAllItemsExpandedUpdate', props.collapserId, areAllItemsExpandedUpdate);
      // console.log('getDerivedStateFromProps - props, state update', props, state, areAllItemsExpandedUpdate);
      // console.log('getDerivedStateFromProps - parentAreAllItemsExpanded', parentAreAllItemsExpanded());
      //console.log('');
      return {
        areAllItemsExpanded: areAllItemsExpandedUpdate,
        notifiedByChild: notifiedByChildValue,
        notifiedParentFromCallback: newNotifiedParentFromCallback,
      };
    }

    state = {
      // areAllItemsExpanded: this.props.parentAreAllItemsExpanded() || this.props.areAllItemsExpanded(),
      areAllItemsExpanded: null,
      notifiedByChild: false,
      notifiedParentFromCallback: false,
    }

    componentDidMount() {
      const { collapserId, watchInitCollapser } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
    }

    shouldComponentUpdate(nextProps, nextState) {
      // console.log('should Update called collapserId', nextProps.collapserId);

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
      const condition = prop => (prop !== 'notifiedByChild' && prop !== 'areAllItemsExpanded' && prop !== 'allChildItems' && prop !== 'parentAreAllItemsExpanded' && props[prop] !== nextProps[prop]);
      // const condition2 = prop => (prop !== 'areAllItemsExpanded' && prop !== 'allChildItems' && state[prop] !== nextState[prop]);
      const condition3 = prop => (prop !== 'notifiedParentFromCallback' && prop !== 'notifiedByChild' && state[prop] !== nextState[prop]);
      let shouldUpdate = false;
      Object.keys(props).some(
        (prop) => {
          if (condition(prop)) {
          //console.log('should Update true prop: collapserId, prop, prev, next', props.collapserId, prop, props[prop], nextProps[prop]);
          shouldUpdate = true;
          }

        }
      );
      Object.keys(state).some(
        (prop) => {
          if (condition3(prop)) {
          //console.log('should Update true FRPM STATE: prop, prev, next', props.collapserId, prop, state[prop], nextState[prop]);
          shouldUpdate = true;
        }
      });
      // console.log('returning from shouldUPdate:', shouldUpdate);

      return shouldUpdate


      /*
      return Object.keys(props).some(
        prop => (prop !== 'allChildItems' && props[prop] !== nextProps[prop])
      );
      */
    }

    /*
    componentDidUpdate(prevProps, prevState) {
      const { parentCollapserId, notifiedByChild, notifyParentCollapser } = this.props;
      const { areAllItemsExpanded } = this.state;
      if (prevState.areAllItemsExpanded !== areAllItemsExpanded && parentCollapserId !== null) {
        // notifyParentCollapser(parentCollapserId);
      }
      if (prevProps.notifiedByChild !== notifiedByChild && parentCollapserId !== null) {
        // notifyParentCollapser(parentCollapserId);
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
      allChildItems().forEach(([nextCollapserId, itemIdArray]) => itemIdArray.forEach(
        itemId => expandCollapseAll(areAllItemsExpanded, itemId, nextCollapserId)
      ));

      if (parentCollapserId !== null) {
        notifyParentCollapser(parentCollapserId);
        //console.log('expandCollapseAll - notifying parent props.collapserId', collapserId, parentCollapserId);
        this.setState(() => ({ notifiedParentFromCallback: true }));
      }

      if (parentCollapserId === null) {
        //console.log('expandCollapseAll - notifying SELF props.collapserId', collapserId, parentCollapserId);
        this.setState(() => ({ notifiedParentFromCallback: null }));
      }
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
      //console.log('render', this.props.collapserId);
      //console.log('');
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
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => {

    const areAllItemsExpanded = () => {
      //console.log('calling areAllItemsExpanded - collapserId ', ownProps.collapserId);
      return areAllChildItemsExpanded(state, ownProps);
    };

    const parentAreAllItemsExpanded = () => {
      if (ownProps.collapserId !== null) {
        return areAllItemsExpandedStateSelectorRoot(
          state, { collapserId: ownProps.parentCollapserId }
        );
      }
      return () => null;
    };

    const notifiedByChild = () => notifiedByChildSelectorSelectorRoot(state, ownProps);

    return {
      allChildItems: () => allChildItemIdsSelector(state, ownProps),
      areAllItemsExpanded,
      parentAreAllItemsExpanded,
      /*
      parentAreAllItemsExpandedProp: areAllItemsExpandedStateSelectorRoot(
        state, { collapserId: ownProps.parentCollapserId }
      )
      */
      notifiedByChild,

    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
