import React from 'react';
import PropTypes from 'prop-types';
import childrenManager from './ChildrenManager';
import registry from './Registry';


const provider = (childStateKeys, createParentIdObj, providerTypeKey) => (Context, Comp) => {
  const ProviderChildrenManager = childrenManager(childStateKeys);
  class Provider extends ProviderChildrenManager {

    createChildContext = idObj => ({
      ...createParentIdObj(idObj),
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

  Provider.propTypes = {
    parentScrollerId: PropTypes.number.isRequired,
  };

  return registry(Context, Provider, providerTypeKey);
};


export default provider;
