import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { collapserControllerActions, collapserContextActions } from '../../actions';
import { cleanHoCProps } from '../../utils/hocUtils/cleanHoCProps';
import { setContextAttrs } from '../../utils/objectUtils';

export const collapserControllerWrapper = (CollapserController) => {

  class WrappedCollapserController extends Component {

    constructor(props) {
      super(props);
      /* grab the context attrs under props._reactScrollCollapse and attach */
      setContextAttrs(this);
      this.addCollapser();
    }

    // Currently moved this func to collapserWrapper.

    componentWillUnmount() {
      const {
        props: { removeCollapser },
        parentScrollerId,
        parentCollapserId,
        id,
        isRootNode
      } = this;
      removeCollapser(parentScrollerId, parentCollapserId, id, isRootNode);
    }


    addCollapser() {
      const {
        props: { addCollapser },
        parentScrollerId,
        parentCollapserId,
        id,
        isRootNode
      } = this;
      addCollapser(parentScrollerId, parentCollapserId, id, isRootNode);
    }

    render() {
      const newProps = cleanHoCProps(
        this.props,
        { ...collapserControllerActions, ...collapserContextActions }
      );
      return (
        <CollapserController
          {...newProps}
        />
      );
    }
  }

  WrappedCollapserController.defaultProps = {};

  WrappedCollapserController.propTypes = {
    _reactScrollCollapse: PropTypes.object.isRequired,
    addCollapser: PropTypes.func.isRequired,
    removeCollapser: PropTypes.func.isRequired,
  };

  WrappedCollapserController.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'WrappedCollapserController'
  };

  return connect(undefined, collapserControllerActions)(WrappedCollapserController);
};

export default collapserControllerWrapper;
