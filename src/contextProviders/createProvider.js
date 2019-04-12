import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import registerConsumer from './registerConsumer';

/*
  createProvider

  Factory that produces context providers that track ancestor / descendant
  relationships.

  childStateKeys: [str] - keys of type of child providers being tracked by
    this provider as children.

  createParentIdObj: func - maps react props to keys that
    will be inserted into the context.  For example:

    collapserProvider uses:

    ({ id, parentScrollerId }) => ({
      parentCollapserId: id,
      parentScrollerId,
    }),

    It passes it's own id - received as a prop to the context as parentCollapserId,
    and passes parentScrollerId as is.

  providerTypeKey: str key of  the type of provider THIS provider is.

  Base = the Base React class this factory will use to create the provider.
    ChildrenManager is an alternative that tracks child state.
*/

const createProvider = (
  childStateKeys,
  createParentIdObj,
  providerTypeKey,
  Base = PureComponent
) => (Context, Comp) => {
  class Provider extends Base {


    /*
      createChildContext  - create the context to be inserted into the context
      for children to consume.

      ...createParentIdObj(props) - includes the relevant information
      that children need to know about their ancestors.

      childRegisterMethods - children need to let the closest ancestors know
      they have been mounted so ancestors must pass callbacks through
      the context to do this.

      This property is not actually defined on this class - is currently
      inherited from Base.  Need to revist this.
    */
    createChildContext = props => ({
      ...createParentIdObj(props),
      ...this.childRegisterMethods,
    });

    childContext = this.createChildContext(this.props);

    render() {
      return (
        <Context.Provider value={this.childContext}>
          <Comp {...this.props} />
        </Context.Provider>
      );
    }
  }

  Provider.propTypes = {
    parentScrollerId: PropTypes.number.isRequired,
  };

  /*
    This provider might itself be a child - so we must register it.
  */
  return registerConsumer(Context, Provider, providerTypeKey);
};


export default createProvider;
