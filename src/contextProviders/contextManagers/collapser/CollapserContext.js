/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { collapserContextActions } from '../../../actions';
import { getCollapserActiveChildrenRoot, getCollapserActiveChildrenLimitRoot } from '../../../selectors/collapser';
import { shallowEqualExceptArray } from '../../../utils/equalityUtils';
import { defaultMergeContextWithProps } from '../../utils/contextUtils';
import { setContextAttrs } from '../../../utils/objectUtils';


const collapserContext = (Base) => {

  class CollapserContext extends Base {

    constructor(props, context) {
      super(props, context);
      // setContextAttrs(this);
      this.setNextContextProps();
      this.setChildContext();
    }

    getNextContextProps = () => {
      const { activeChildren, activeChildrenLimit } = this.props;
      const newContextProps = {
        activeSiblings: activeChildren,
        activeSiblingLimit: activeChildrenLimit,
      };
      return newContextProps;
    }

    setNextContextProps = () => {
      this.nextContextProps = this.getNextContextProps();
    }

    checkIfActiveSibling = () => {
      const { _reactScrollCollapse: { id }, contextProps: { activeSiblings } } = this.props;
      if (this.checkIfRoot()) {
        return false;
      }
      return activeSiblings.includes(id);
    }

    noActiveSiblings = () => {
      const { contextProps: { activeSiblings } } = this.props;
      if (this.checkIfRoot()) {
        return false;
      }
      return activeSiblings.length === 0;
    }

    addSelfToActiveSiblings = (state) => {
      const {
        addActiveChildren,
        _reactScrollCollapse: { id, parents: { collapser: parentCollapserId } },
        isActiveSibling,
        removeActiveChildren
      } = this.props;
      const { activeChildren, contextProps: { activeSiblingLimit } } = this.props;
      if (this.checkIfRoot()) {
        removeActiveChildren(id, activeChildren);
      }
      if (!this.checkIfRoot() && state.areAllItemsExpanded) {
        removeActiveChildren(parentCollapserId, [id]);
      }
      if (!this.checkIfRoot() && !this.checkIfActiveSibling() && !state.areAllItemsExpanded) {
        addActiveChildren(parentCollapserId, [id], activeSiblingLimit);
        removeActiveChildren(id, activeChildren);
      } else if (!this.checkIfRoot() && this.checkIfActiveSibling()) {
        // removeActiveChildren(parentCollapserId, [id]);
      }
    }

    setActiveChildrenLimit = limit => this.props.setActiveChildrenLimit(
      this.getId(), limit
    );

    contextMethods = {
      collapser: {
        addSelfToActiveSiblings: this.addSelfToActiveSiblings,
        checkIfActiveSibling: this.checkIfActiveSibling,
        noActiveSiblings: this.noActiveSiblings,
        setActiveChildrenLimit: this.setActiveChildrenLimit,
      }
    };

  }

  CollapserContext.defaultProps = {};

  CollapserContext.propTypes = {};

  CollapserContext.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'CollapserContext'
  };

  const mapStateToPropsFactory = () => (state, props) => {
    const { _reactScrollCollapse: { id } } = props;
    const activeChildren = getCollapserActiveChildrenRoot(state)(id);
    const activeChildrenLimit = getCollapserActiveChildrenLimitRoot(state)(id);
    return {
      activeChildren,
      activeChildrenLimit
    };
  };

  const CollapserContextConnect = connect(
    mapStateToPropsFactory,
    collapserContextActions,
  )(CollapserContext);

  return CollapserContextConnect;
};


const contextRenderer = (Context, Comp, mergeContextProps) => {

  class ContextRender extends Component {

    shouldComponentUpdate(props) {
      const checked = this.equalCheck(props, shallowEqualExceptArray);
      return checked;
    }

    equalCheck = (props, equalityChecker) => {
      const [prevContextProps, prevProps] = this.splitProps(this.props);
      const [nextContextProps, nextProps] = this.splitProps(props);
      const equalProps = equalityChecker(prevProps, nextProps);
      const equalContext = equalityChecker(prevContextProps, nextContextProps);
      /*
      console.log('');
      console.log('equalProps, equalContext', equalProps, equalContext);
      console.log('prevContextProps, nextContextProps', prevContextProps, nextContextProps);
      console.log('prevProps, nextProps', prevProps, nextProps);
      */
      if (!equalProps || !equalContext) {
        return true;
      }
      return false;
    }

    splitProps = (props) => {
      const { contextProps, ...other } = props;
      return [contextProps, other];
    }

    addToProps = () => {
      const { contextMethods: { collapser } } = this.props;
      const newProps = { ...this.props };
      if (collapser && collapser.checkIfActiveSibling) {
        newProps.isActiveSibling = collapser.checkIfActiveSibling();
      }
      debugger;
      return newProps;
    }

    render() {
      return <Comp {...this.addToProps()} />;
    }

  }

  ContextRender.propTypes = {
    contextProps: PropTypes.object.isRequired,
    contextMethods: PropTypes.object.isRequired,
  };

  return props => (
    <Context.Consumer>
      { context => <ContextRender {...mergeContextProps(props, context)} /> }
    </Context.Consumer>
  );
};

collapserContext.renderContext = {
  mergeContextWithProps: defaultMergeContextWithProps,
  contextRenderer
};


export default collapserContext;
