import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import forwardRefWrapper from '../../utils/forwardRef';
import { checkForRef } from '../../utils/errorUtils';
import { ofObjectTypeOrNothing } from '../../utils/propTypeHelpers';

import { itemWrapperActions } from '../../actions';
import { getItemExpandedRoot } from '../../selectors/collapserItem';

/*
  collapserItemWrapper is an HoC that is to be used to wrap components which make use
  of react-collapse components.

  It provides the wrapped component with the props:
    isOpened: boolean - which can be used as the <Collapse> isOpened prop.
    onHeightReady: function - which should be passed into the  <Collapse>
      onHeightReady prop.
    expandCollapse: function - which can be used as an event callback to trigger
      change of state.
*/

export const collapserItemWrapper = (WrappedComponent) => {

  const WrappedComponentRef = forwardRefWrapper(WrappedComponent, 'collapserItemRef');

  class CollapserItemController extends PureComponent {

    elem = React.createRef();

    componentDidMount() {
      checkForRef(WrappedComponent, this.elem, 'collapserItemRef');
    }

    expandCollapse = () => {
      const {
        addToNodeTargetArray,
        contextMethods,
        itemId,
        expandCollapse: expandCollapseAction,
        parentCollapserId,
        rootNodes,
        watchCollapser,
      } = this.props;
      watchCollapser(parentCollapserId);
      if (contextMethods) {
        contextMethods.scrollToTop(this.elem.current);
      }
      expandCollapseAction(itemId, parentCollapserId);
      addToNodeTargetArray(parentCollapserId, rootNodes.collapser);
    };

    onHeightReady = () => {
      const { itemId, heightReady, parentCollapserId } = this.props;
      heightReady(parentCollapserId, itemId);
    };

    render() {
      const {
        contextMethods,
        isOpened,
        heightReady,
        expandCollapse,
        watchCollapser,
        ...other
      } = this.props;
      return (
        <WrappedComponentRef
          {...other}
          isOpened={isOpened}
          expandCollapse={this.expandCollapse}
          onHeightReady={this.onHeightReady}
          ref={this.elem}
        />
      );
    }
  }

  CollapserItemController.defaultProps = {
    contextMethods: null,
    parentScrollerId: null,
    rootNodes: {},
  };

  CollapserItemController.propTypes = {
    addToNodeTargetArray: PropTypes.func.isRequired,
    isOpened: PropTypes.bool.isRequired,
    itemId: PropTypes.number.isRequired,
    parentCollapserId: PropTypes.number.isRequired,
    parentScrollerId: PropTypes.number,
    heightReady: PropTypes.func.isRequired,
    expandCollapse: PropTypes.func.isRequired,
    rootNodes: PropTypes.object,
    watchCollapser: PropTypes.func.isRequired,

    /* provided by scrollerProvider via context */
    contextMethods: ofObjectTypeOrNothing,
  };

  const mapStateToProps = (state, ownProps) => ({
    isOpened: getItemExpandedRoot(state)(ownProps.itemId),
  });

  const CollapserItemControllerConnect = connect(
    mapStateToProps,
    itemWrapperActions,
  )(CollapserItemController);

  return CollapserItemControllerConnect;
};

export default collapserItemWrapper;
