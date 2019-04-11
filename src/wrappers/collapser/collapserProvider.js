import React, { Component } from 'react';
import PropTypes from 'prop-types';
import childrenManager from '../ChildrenManager';

import registry from '../Registry';

const CollapserChildrenManager = childrenManager(['collapsers', 'items']);

const collapserProvider = (Context, Comp) => {
  class CollapserProvider extends Component {

    state = {
      collapsers: [],
      items: [],
    }

    createChildContext = ({ id, parentScrollerId }, { registerCollapser, registerItem }) => ({
      parentCollapserId: id,
      parentScrollerId,
      registerCollapser,
      registerItem,
    });

    addEntity = (key, id) => this.setState(prevState => ({ [key]: [...prevState[key], id] }));

    removeEntity = (key, id) => this.setState(prevState => prevState[key].filter(
      val => val !== id
    ));

    addRemoveEntity = (key, id) => {
      const { state } = this.state;
      if (state[key].includes(id)) {
        return this.removeEntity(key, id);
      }
      return this.addEntity(key, id);
    }

    registerCollapser = childId => this.addRemoveEntity('items', childId);

    registerItem = childId => this.addRemoveEntity('collapsers', childId);

    render() {
      return (
        <Context.Provider value={this.createChildContext(this.props, this)}>
          <Comp {...this.props} />
        </Context.Provider>
      );
    }
  }

  CollapserProvider.propTypes = {
    id: PropTypes.number.isRequired,
    parentScrollerId: PropTypes.number.isRequired,
    registerCollapser: PropTypes.func.isRequired
  };

  return registry(Context, CollapserProvider, 'registerCollapser', 'collapsers', ['collapsers', 'items']);
};

export default collapserProvider;
