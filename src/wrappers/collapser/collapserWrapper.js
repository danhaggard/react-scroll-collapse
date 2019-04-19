import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';
import selectors from '../../selectors';

const {
  allChildItemsSelector,
  areAllItemsExpandedSelector,
  areSomeItemsExpandedSelector,
  areAllItemsExpandedSelectorTimer
} = selectors.collapser;

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    componentDidMount() {
      const { collapserId, watchInitCollapser } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
    }

    shouldComponentUpdate(nextProps) {

      /*

      shouldComponentUpdate used to prevent unecessary renders caused
      by the allChildItemsSelector returning an array of item objects.  If any
      item changes one of it's properties a re-render is forced on every item
      in the collapser.

      Using the entire item object made the reducers cleaner - and using just
      an array of ids had a similar problem because the selectors were creating
      arrays with distinct object ids even when equivlent.

      */


      const { props } = this;

      return Object.keys(props).some(
        (prop) => {
            if (prop !== 'allChildItems' && prop !== 'parentAreAllItemsExpanded' && props[prop] !== nextProps[prop]) {
              // console.log('should Update true: collapserId, prop, prev, next', this.props.collapserId, prop, props[prop], nextProps[prop]);
            }
            return (prop !== 'allChildItems' && prop !== 'parentAreAllItemsExpanded' && props[prop] !== nextProps[prop]);
        }
      );
      /*
      return Object.keys(props).some(
        prop => (prop !== 'allChildItems' && props[prop] !== nextProps[prop])
      );
      */

    }

    getOffSetTop = () => this.elem.current.offsetTop;

    getExpandCollapseCallback = (
      animationDelay,
      areAllItemsExpanded,
      areSomeItemsExpanded,
      collapseIfSomeExpanded,
      expandCollapseAll
    ) => {
      let currentDelay = 0;
      return (item) => {
        const innerCallback = () => expandCollapseAll(
          item,
          areAllItemsExpanded,
          item.id,
          areSomeItemsExpanded,
          collapseIfSomeExpanded
        );
        if (animationDelay) {
          setTimeout(innerCallback, currentDelay);
          currentDelay += animationDelay;
        } else {
          innerCallback();
        }
      };
    }

    expandCollapseAll = () => {
      const {
        allChildItems,
        animationDelay,
        areAllItemsExpanded,
        areSomeItemsExpanded,
        collapserId,
        collapseIfSomeExpanded,
        expandCollapseAll,
        parentScrollerId,
        setOffsetTop,
        watchCollapser,
      } = this.props;
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

      const callback = this.getExpandCollapseCallback(
        animationDelay,
        areAllItemsExpanded,
        areSomeItemsExpanded,
        collapseIfSomeExpanded,
        expandCollapseAll
      );
      allChildItems(collapserId).forEach(callback);

      /*
      let currentDelay = 0;

      allChildItems.forEach((item) => {
        setTimeout(
          () => expandCollapseAll(
            item,
            areAllItemsExpanded,
            item.id,
            areSomeItemsExpanded,
            collapseIfSomeExpanded
          ),
          currentDelay,
        );
        currentDelay += animationDelay;
      });
      */
    };

    render() {
      const {
        expandCollapseAll,
        setOffsetTop,
        watchCollapser,
        watchInitCollapser,
        allChildItems,
        areAllItemsExpanded,
        areSomeItemsExpanded,
        ...other
      } = this.props;
      // console.log('Collapser Wrapper Render Id, parentAreAllItemsExpanded', this.props.collapserId, this.props.parentAreAllItemsExpanded);
      return (
        <WrappedComponentRef
          {...other}
          ref={this.elem}
          expandCollapseAll={this.expandCollapseAll}
          areAllItemsExpanded={areAllItemsExpanded}
          areSomeItemsExpanded={areSomeItemsExpanded}
        />
      );
    }
  }

  CollapserController.defaultProps = {
    animationDelay: 0,
    collapseIfSomeExpanded: false,
    collapserId: null,
    parentCollapserId: null,
    parentScrollerId: null,
  };

  CollapserController.propTypes = {
    animationDelay: PropTypes.number,
    collapseIfSomeExpanded: PropTypes.bool,
    /* provided by collapserControllerWrapper */
    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: PropTypes.number,

    /* provided by redux */
    areAllItemsExpanded: PropTypes.bool.isRequired, // includes item children of nested collapsers
    areSomeItemsExpanded: PropTypes.bool.isRequired,
    allChildItems: PropTypes.array.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };
// 1.7, 1.5
  const areAllItemsExpandedTimer = areAllItemsExpandedSelector();
  const mapStateToProps = (state, ownProps) => {
    const { parentAreAllItemsExpanded, collapserId } = ownProps;
    let itemsSelector;
    // console.log('mapStateToProps parentAreAllItemsExpanded collapserId', parentAreAllItemsExpanded, collapserId);
    if (parentAreAllItemsExpanded) {
      itemsSelector = true;
    } else {
      itemsSelector = areAllItemsExpandedTimer(state)(ownProps.collapserId, parentAreAllItemsExpanded);
    }
    return {
      allChildItems: allChildItemsSelector()(state),
      // areAllItemsExpanded: areAllItemsExpandedSelectorTimer(state)(ownProps.collapserId, parentAreAllItemsExpanded),

      areAllItemsExpanded: itemsSelector,
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
