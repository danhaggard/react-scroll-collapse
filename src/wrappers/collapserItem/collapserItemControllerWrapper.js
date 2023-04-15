import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ofBoolTypeOrNothing } from '../../utils/propTypeHelpers';
import { cleanHoCProps } from '../../utils/hocUtils/cleanHoCProps';
import { itemControllerActions } from '../../actions';
import { setContextAttrs } from '../../utils/objectUtils';


export const collapserItemControllerWrapper = (CollapserItemController) => {

  class WrappedCollapserItemController extends Component {

    constructor(props) {
      super(props);
      setContextAttrs(this);
      this.addItem();
    }

    componentWillUnmount() {
      const { id, parentCollapserId, props: { removeItem } } = this;
      removeItem(parentCollapserId, id);
    }

    addItem() {
      const { addItem, isOpenedInit } = this.props;
      const { id, parentCollapserId } = this;
      if (isOpenedInit !== null) {
        addItem(parentCollapserId, id, isOpenedInit);
      } else {
        addItem(parentCollapserId, id);
      }
    }

    render() {
      return (
        <CollapserItemController
          {...cleanHoCProps(
            this.props,
            itemControllerActions
          )}
        />
      );
    }
  }

  WrappedCollapserItemController.defaultProps = {
    isOpenedInit: null,
  };

  WrappedCollapserItemController.propTypes = {
    _reactScrollCollapse: PropTypes.object.isRequired,

    // provided by redux dispatchToProps
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,

    //  isOpenedInit: overrides the default isOpened status. provided by user
    isOpenedInit: ofBoolTypeOrNothing,
  };

  WrappedCollapserItemController.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'WrappedCollapserItemController'
  };

  return connect(undefined, itemControllerActions)(WrappedCollapserItemController);
};

export default collapserItemControllerWrapper;
