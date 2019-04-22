import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';
import selectors from '../../selectors';
import { areAllChildItemsExpanded, allChildItemIdsSelector } from '../../selectors/selectorTest';

const { allChildItemsSelector } = selectors.collapser;

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
        prop => (prop !== 'allChildItems' && props[prop] !== nextProps[prop])
      );

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
      allChildItems.forEach(([nextCollapserId, itemIdArray]) => itemIdArray.forEach(
        itemId => expandCollapseAll(areAllItemsExpanded, itemId, nextCollapserId)
      ));
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
    parentScrollerId: null,
  };

  CollapserController.propTypes = {
    /* provided by collapserControllerWrapper */
    collapserId: ofNumberTypeOrNothing,
    parentCollapserId: ofNumberTypeOrNothing,
    parentScrollerId: PropTypes.number,

    /* provided by redux */
    areAllItemsExpanded: PropTypes.bool.isRequired, // includes item children of nested collapsers
    allChildItems: PropTypes.array.isRequired, // array of collapserItem ids
    expandCollapseAll: PropTypes.func.isRequired,
    setOffsetTop: PropTypes.func.isRequired,
    watchCollapser: PropTypes.func.isRequired,
    watchInitCollapser: PropTypes.func.isRequired,
  };


  const mapStateToProps = (state, ownProps) => {
    return {
      allChildItems: allChildItemIdsSelector(state, ownProps),
      areAllItemsExpanded: areAllChildItemsExpanded(state, ownProps),
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
