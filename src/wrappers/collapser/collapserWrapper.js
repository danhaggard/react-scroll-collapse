import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';
import selectors from '../../selectors';

const { allChildItemsSelector, areAllItemsExpandedSelector } = selectors.collapser;

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends Component {

    elem = React.createRef();

    /*
      allChildItems, areAllItemsExpanded are passed into the expandCollapseAll
      callback at render - to ensure allChildItems have been initialised in redux..

      allChildItems starts out as an empty array on first render because the
      child collapsers haven't initialised yet.

      If the expandCollapse part of this callBack is defined in mapDispatchToProps
      using own props - e.g.: {
        expandCollapseAll: () => expandedCollapseAll(ownProps.allChildItems,
          ownProps.areAllItemsExpanded),
        }
      ...it will only use the props values as supplied on the first render - i.e.
      the empty array for allChildItems.  So instead - those values are passed into
      the function in render - which are gauranteed to be up to date.

      The tradeoff is that this causes double render on init.  I don't see any
      way around this.
    */

    componentDidMount() {
      const { collapserId, watchInitCollapser } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
    }

    shouldComponentUpdate(nextProps) {

      /*

      shouldComponentUpdate used to prevent unecessary renders caused
      by the allChildItemsSelector returning an array of item objects.  If any
      item changes one of it's properties a re-render is forced on the entire
      collapser.

      Using the entire item object made the reducers cleaner - and using just
      an array of ids had a similar problem because the selectors were creating
      arrays with distinct object ids even when equivlent.

      */


      const { props } = this;

      return Object.keys(props).some(
        prop => (prop !== 'allChildItems' && props[prop] !== nextProps[prop])
      );

      /*
        Don't update if prev child items were zero.  Prevents a re-render
        of child items on first mount where collapsers are nested.

      if (!shouldUpdate && allChildItems.length === 0) {
        return false;
      }
      */

      /*
        Only do a full render of the collapser if an item Id has changed.

      return !isEqual(allChildItems.map(item => item.id),
        nextProps.allChildItems.map(item => item.id));
      */
    }

    getOffSetTop = () => this.elem.current.offsetTop;

    expandCollapseAll = () => {
      const {
        allChildItems,
        areAllItemsExpanded,
        collapserId,
        expandCollapseAll,
        parentScrollerId,
        setOffsetTop,
        watchCollapser,
      } = this.props;
      /*
        This activates a saga that will ensure that all the onHeightReady
        callbacks of nested <Collapse> elements have fired - before the Scroller
        related sagas will be allowed to initiate the scrolling.
      */
      watchCollapser(collapserId);

      /*
        setOffsetTop: defines a callback for the saga to call that allows
        the saga to obtain the offsetTop value of the backing instance of this
        component and dispatch that to the redux store.  The saga grabs the
        offsetTop val once the onHeightReady callback has been
        called for every wrapped <Collapse> element in the Collapser.
      */

      setOffsetTop(
        this.getOffSetTop,
        parentScrollerId,
        collapserId,
      );
      allChildItems.forEach((item) => {
        expandCollapseAll(item, areAllItemsExpanded, item.id);
      });
    };

    render() {
      const {
        expandCollapseAll,
        setOffsetTop,
        watchCollapser,
        watchInitCollapser,
        allChildItems,
        areAllItemsExpanded,
        ...other
      } = this.props;

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
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: PropTypes.number.isRequired,

    /* provided by redux */
    areAllItemsExpanded: PropTypes.bool.isRequired, // includes item children of nested collapsers
    allChildItems: PropTypes.array.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };

  const mapStateToProps = (state, ownProps) => ({
    allChildItems: allChildItemsSelector(state)(ownProps.collapserId),
    areAllItemsExpanded: areAllItemsExpandedSelector(state)(ownProps.collapserId),
  });

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
