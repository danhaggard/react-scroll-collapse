/* eslint-disable max-len */

import React, { PureComponent } from 'react';
import registerConsumer from './registerConsumer';
import { getIdKey, getParentIdKey } from './providerKeyManager';
import { isUndefNull } from '../utils/selectorUtils';
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
  parentTypeKeys = [],
  childTypeKeys = [],
  Base = PureComponent
) => (Context, Comp) => {
  class Provider extends Base {

    /*
      To ensure all nodes get access to parent context while getting an
      opportunity to modify this context - without having to manually
      specify consumers, the following strategy is employed.

      By calling: createProvider(Component)

      props => Consumer(Registry(Provider((Component({ ...props, ...context})))))

      You end up roughly with:

      props => Consumer(Registry(Provider((Component({ ...props, ...context})))))

      Or:

      props => (
        <Consumer>
          {
            childContext => (
              <Registry>
                <Provider>
                  <Component {...childContext} {...props}>
                </Provider>
              <Registry>
            )
          }
        </Consumer>
      )

      (Leaving out the React Context object for clarity - but its in their too)

      So all providers are automatically consuming context as
      props from their parent.

      So if you want to add context that all nested consumers get:
        make sure each provider is looking for the same context as a prop
        from above and merges that with it's own contribution.

      Then pass that merged value into the childContext attr:  this
      is what gets passed as a prop to the nested child PROVIDERS and they can
      then use it to pass to their wrapped component.

      But you MUST ALSO - as the provider instance pass your modified context
      as a prop to the component you are immediately wrapping!

      Another way to view it - you wrap <Component> and place it as a child of
      Parent:

       (parentContext)::<Parent>
        -> <Consumer {...parentContext, ...propsFromParent} />
          -> <Provider {...propsFromParentMergedWithParentContext, ...childContext }>::(childContext)
            -> <Component {...allParentStuffMergedWithChildContext} >
                 Back to Top --> -->:
                   (childContext -> parentContext)::<Parent {...propsFromComponent} />
               </Component>
       <Parent />
    */

    idKey = getIdKey(typeKey);

    parentIdKey = getParentIdKey(typeKey);

    id = this.props[this.idKey];

    mapParentIds = (props) => {
      const parentIdObj = {};

      // Adds its own id as a parent.
      if (childTypeKeys.length > 0) {
        parentIdObj[this.parentIdKey] = this.id;
      }

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
      If it can't find it's own type as parent in props,
      but is a parent of something - then it is a root node.
    */
    checkIfRoot = () => !Object.keys(this.props).includes(this.parentIdKey)
      && childTypeKeys.length > 0;

    getRootNodes = () => {
      const rootNodes = {
        ...this.props.rootNodes,
      };
      if (this.checkIfRoot()) {
        rootNodes[typeKey] = this.id;
      }
      return rootNodes;
    }

    mergedContextMethods = this.props.contextMethods
      ? { ...this.props.contextMethods, ...this.contextMethods }
      : this.contextMethods;

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
      contextMethods: this.mergedContextMethods,
      rootNodes: this.getRootNodes(),
    }

    render() {
      return childTypeKeys.length === 0 ? <Comp {...this.props} {...this.state} /> : (
        <Context.Provider value={this.childContext}>
          <Comp
            contextMethods={this.mergedContextMethods}
            isRootNode={this.checkIfRoot()}
            providerType={typeKey}
            {...this.props}
            {...this.state}
            key={this.idKey}
            />
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
