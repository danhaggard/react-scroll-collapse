import React, { PureComponent } from 'react';
import registerConsumer from './registerConsumer';
import { getIdKey, getParentIdKey } from './providerKeyManager';
import { isUndefNull } from '../selectors/utils';
/*
  createProvider

  Factory that produces context providers that track ancestor / descendant
  relationships.

  childTypeKeys: [str] - keys of type of child providers being tracked by
    this provider.

  parentTypeKeys: [str] - keys of type of parent providers being tracked by
    this provider.

  typeKey: str key of  the type of provider THIS provider is.

  Base = the Base React class this factory will use to create the provider.
    ChildrenManager is an alternative that tracks child state.
*/

const createProvider = (
  typeKey,
  parentTypeKeys,
  childTypeKeys,
  Base = PureComponent
) => (Context, Comp) => {
  class Provider extends Base {

    mapParentIds = (props) => {

      const idKey = getIdKey(typeKey);

      // Adds its own id as a parent.
      const parentIdObj = {
        [getParentIdKey(typeKey)]: props[idKey]
      };

      // Adds the other parent ids as asked for the be provider.
      parentTypeKeys.forEach((key) => {
        const parentIdKey = getParentIdKey(key);
        if (!isUndefNull(props[parentIdKey])) {
          parentIdObj[parentIdKey] = props[parentIdKey];
        }
      });
      return parentIdObj;
    };

    /*
      childContext  - create the context to be inserted into the context
      for children to consume.

      ...mapParentIds(props) - maps parentTypeKeys to idKeys and passes vals

      childRegisterMethods - children need to let the closest ancestors know
      they have been mounted so ancestors must pass callbacks through
      the context to do this.

      This property is not actually defined on this class - is currently
      inherited from Base.  Need to revist this.
    */

    childContext = {
      ...this.mapParentIds(this.props),
      ...this.childRegisterMethods,
    };

    render() {
      return childTypeKeys.length === 0 ? <Comp {...this.props} /> : (
        <Context.Provider value={this.childContext}>
          <Comp {...this.props} />
        </Context.Provider>
      );
    }

  }

  /*
    This provider might itself be a child - so we must register it.
  */
  return registerConsumer(Context, Provider, typeKey);
};


export default createProvider;
