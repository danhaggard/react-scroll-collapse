import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ofBoolTypeOrNothing, ofNumberTypeOrNothing } from '../../utils/propTypeHelpers';
import cleanHoCProps from '../../utils/cleanHoCProps';

import actions from '../../actions';

const propTypeCache = {
  addItem: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,

  /*
    isOpenedInit: overrides the default isOpened status.
  */
  isOpenedInit: ofBoolTypeOrNothing,
  itemId: ofNumberTypeOrNothing,
  parentCollapserId: ofNumberTypeOrNothing,
  parentScrollerId: ofNumberTypeOrNothing,
};

export const collapserItemControllerWrapper = (CollapserItemController) => {

  class WrappedCollapserItemController extends Component {

    constructor(props) {
      super(props);

      /*
        create state slice for this collapserItem in redux store.
      */
      this.addItem();
    }

    componentWillUnmount() {
      const { itemId, parentCollapserId, removeItem } = this.props;
      removeItem(parentCollapserId, itemId);
    }

    addItem() {
      const {
        addItem,
        itemId,
        isOpenedInit,
        parentCollapserId
      } = this.props;
      const item = {
        id: itemId,
        expanded: isOpenedInit,
      };
      addItem(parentCollapserId, item, itemId);
    }

    render() {
      const {
        itemId,
        parentCollapserId,
      } = this.props;
      if (itemId >= 0 && parentCollapserId >= 0) {
        return (
          <CollapserItemController
            {...cleanHoCProps(
              this.props,
              WrappedCollapserItemController.defaultProps,
              ...propTypeCache
            )}
          />
        );
      }
      return <div />;
    }
  }

  WrappedCollapserItemController.defaultProps = {
    isOpenedInit: null,
    itemId: null,
    parentCollapserId: null,
    parentScrollerId: null,
  };

  WrappedCollapserItemController.propTypes = propTypeCache;

  const mapDispatchToProps = {
    addItem: actions.addItem,
    removeItem: actions.removeItem,
  };

  return connect(undefined, mapDispatchToProps)(WrappedCollapserItemController);
};

export default collapserItemControllerWrapper;
