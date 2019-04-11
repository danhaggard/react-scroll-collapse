import createProvider from '../provider';

const collapserProvider = createProvider(
  ['collapsers', 'items'],
  ({ id, parentScrollerId }) => ({
    parentCollapserId: id,
    parentScrollerId,
  }),
  'collapsers'
);

/*
import React from 'react';
import PropTypes from 'prop-types';
import childrenManager from '../ChildrenManager';
import registry from '../Registry';


const CollapserChildrenManager = childrenManager(['collapsers', 'items']);

const collapserProvider = (Context, Comp) => {

  class CollapserProvider extends CollapserChildrenManager {

    createChildContext = ({ id, parentScrollerId }) => ({
      parentCollapserId: id,
      parentScrollerId,
      ...this.childRegisterMethods,
    });

    render() {
      const childContext = this.createChildContext(this.props);
      return (
        <Context.Provider value={childContext}>
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

  return registry(Context, CollapserProvider, 'collapsers');
};

export default collapserProvider;
*/

export default collapserProvider;
