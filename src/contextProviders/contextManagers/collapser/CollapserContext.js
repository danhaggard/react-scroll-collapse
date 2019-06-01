/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { collapserContextActions } from '../../../actions';
import { getCollapserActiveChildrenRoot, getCollapserActiveChildrenLimitRoot } from '../../../selectors/collapser';
import { shallowEqualExceptArray } from '../../../utils/equalityUtils';
import { defaultMergeContextWithProps } from '../../utils/contextUtils';
import { compareIntArrays } from '../../../utils/arrayUtils';


const collapserContext = (Base) => {

  class CollapserContext extends Base {

    defaultContextProps = {
      activeSiblings: [],
      activeSiblingLimit: null,
    }

    constructor(props, context) {
      super(props, context);
      // setContextAttrs(this);
      this.setNextContextProps();
      this.setChildContext();
      this.setReactScrollCollapse();
    }

    /*
      Because the state for the active nodes is an array it causes rerenders
      so have added a array checker to shallow comparison.
    */
    shouldComponentUpdate(nextProps) {
      const checked = this.equalCheck(this.props, nextProps, shallowEqualExceptArray);
      // console.log(`CollapserContext - shouldComponentUpdate - id: ${this.props._reactScrollCollapse.id} result,  props, nextProps`, checked, this.props, nextProps);
      return checked;
    }

    equalCheck = (props, nextProps, equalityChecker) => {
      const equalProps = equalityChecker(props, nextProps);
      if (!equalProps) {
        return true;
      }
      return false;
    }

    getNextContextProps = () => {
      const {
        activeSiblings: prevActiveSiblings,
        activeSiblingLimit: prevActiveSiblingLimit
      } = this.nextContextProps;
      const { activeChildren, activeChildrenLimit } = this.props;
      const nextActiveSiblings = compareIntArrays(prevActiveSiblings, activeChildren)
        ? prevActiveSiblings : activeChildren;
      if (nextActiveSiblings !== prevActiveSiblings
        || prevActiveSiblingLimit !== activeChildrenLimit) {
        return {
          activeSiblings: nextActiveSiblings,
          activeSiblingLimit: activeChildrenLimit,
        };
      }
      return this.nextContextProps;
    }

    setNextContextProps = () => {
      if (this.nextContextProps === null) {
        this.nextContextProps = this.defaultContextProps;
      }
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
        _reactScrollCollapse: { id },
        isActiveSibling,
        removeActiveChildren
      } = this.props;
      /*
        I  think because this is call back - the parents aren't available from
        props after first render. So get them from this.
      */
      const { collapser: parentCollapserId } = this._reactScrollCollapse.parents;
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
        addSelfToActiveSiblings: this.addSelfToActiveSiblings.bind(this),
        checkIfActiveSibling: this.checkIfActiveSibling.bind(this),
        noActiveSiblings: this.noActiveSiblings.bind(this),
        setActiveChildrenLimit: this.setActiveChildrenLimit.bind(this),
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
      // console.log('ContextRender - shouldComponentUpdate - result,  props, nextProps', checked, this.props, props);
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
      return newProps;
    }

    render() {
      // console.log('ContextRender - render - props', this.props);
      return <Comp {...this.addToProps()} />;
    }

  }

  ContextRender.propTypes = {
    contextProps: PropTypes.object.isRequired,
    contextMethods: PropTypes.object.isRequired,
  };

  ContextRender.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'ContextRender'
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
