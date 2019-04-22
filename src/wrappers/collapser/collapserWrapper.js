import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import { collapserWrapperActions } from '../../actions';
// import selectors from '../../selectors';
import { areAllChildItemsExpanded, allChildItemIdsSelector } from '../../selectors/selectorTest';

// const { allChildItemsSelector } = selectors.collapser;

export const collapserWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserRef');

  class CollapserController extends PureComponent {

    elem = React.createRef();

    areAllItemsExpanded = this.props.areAllItemsExpanded();

    static getDerivedStateFromProps(nextProps) {
      const { areAllItemsExpanded } = nextProps;
      return { areAllItemsExpanded: areAllItemsExpanded() };
    }

    state = {
      areAllItemsExpanded: this.props.areAllItemsExpanded()
    }

    componentDidMount() {
      const { collapserId, watchInitCollapser } = this.props;
      checkForRef(WrappedComponent, this.elem, 'collapserRef');
      watchInitCollapser(collapserId);
    }

    getOffSetTop = () => this.elem.current.offsetTop;

    expandCollapseAll = () => {
      const {
        allChildItems,
        collapserId,
        expandCollapseAll,
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
    // console.log('collapserWrapper mapStateToProps - collapserId', ownProps.collapserId);
    return {
      allChildItems: () => allChildItemIdsSelector(state, ownProps),
      areAllItemsExpanded: () => {
        console.log('calling areAllItemsExpanded - collapserId ', ownProps.collapserId);
        return areAllChildItemsExpanded(state, ownProps);
      },
    };
  };

  const CollapserControllerConnect = connect(
    mapStateToProps,
    collapserWrapperActions,
  )(CollapserController);

  return CollapserControllerConnect;
};

export default collapserWrapper;
