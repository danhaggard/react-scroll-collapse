/* eslint-disable max-len */
import React, { PureComponent } from 'react';

import shallowEqual from 'react-pure-render/shallowEqual';
import registerConsumer from './registerConsumer';
import { getIdKey, getParentIdKey } from '../utils/providerKeyManager';
import { isUndefNull } from '../../utils/selectorUtils';
import { ofObjectTypeOrNothing } from '../../utils/propTypeHelpers';


const extendClass = (subClassFactory, SuperClass) => {
  if (typeof subClassFactory !== 'function') {
    return SuperClass;
  }
  return subClassFactory(SuperClass);
};


/*
  createProvider

  Factory that produces context providers that track ancestor / descendant
  relationships.

  childTypeKeys: [str] - keys of type of child providers being tracked by
    this provider.

  parentTypeKeys: [str] - keys of type of parent providers being tracked by
    this provider.

  typeKey: str key of  the type of provider THIS provider is.

  Base the Base React class this factory will use to create the provider.
    Use this if you need to need to pass methods through the context
    to other provider types.  Define a contextMethods property on your base
    class to do this.  State will be injected as props to the immediate child
    but not passed into the context.

  wrapper: a HoC function that will wrap the passed Comp with additional logic
   specific to your provider.  Use this if you only need to inject props to the
   wrapped component - but don't need anything passed deeper into the content.
*/

/*
constructor(props, context) {
  super(props, context);
  console.log('Find parent class methods?', this.setNextContextProps);

  this.prevContextProps = {};
  this.nextContextProps = this.prevContextProps;
  this.compareContextProps = () => shallowEqual(this.prevContextProps, this.nextContextProps);
  this.setNextContextProps = () => (this.nextContextProps = this.prevContextProps);
}
*/

const createProvider = (
  typeKey,
  parentTypeKeys = [],
  childTypeKeys = [],
  subClassFactory = {},
  wrapper = null,
) => (Context, Comp) => {
  const Wrapped = wrapper ? wrapper(Comp) : Comp;
  class Provider extends PureComponent {

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

    // id = this.props[this.idKey];
    // id = providerIdStore(typeKey);

    defaultContextProps = {};

    prevContextProps = this.defaultContextProps;

    nextContextProps = this.prevContextProps;

    constructor(props, context) {
      super(props, context);
      this.setChildContext();
    }

    getId = () => this.props._reactScrollCollapse.id; // eslint_disable_line

    // deprecating
    mapParentIds = (props) => { // eslint-disable-line react/sort-comp
      const parentIdObj = {};

      // Adds its own id as a parent.
      if (childTypeKeys.length > 0) {
        parentIdObj[this.parentIdKey] = this.getId();
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

    // NEW
    getParentIdObj = (props) => {
      const parentIdObj = {};

      // Adds its own id as a parent.
      if (childTypeKeys.length > 0) {
        parentIdObj[typeKey] = this.getId();
      }

      // Adds the other parent ids as asked for the be provider.
      parentTypeKeys.forEach((key) => {
        const parentIdKey = getParentIdKey(key); // remove this and get it from the new props schema thingo
        if (!isUndefNull(props[parentIdKey])) {
          parentIdObj[key] = props[parentIdKey];
        }
      });
      return parentIdObj;
    }

    /*
      If it can't find it's own type as parent in props,
      but is a parent of something - then it is a root node.
    */
    checkIfRoot = () => !Object.keys(this.props).includes(this.parentIdKey)
      && childTypeKeys.length > 0;

    getRootNodes = ({ rootNodes }) => {
      if (this.checkIfRoot()) {
        return { ...rootNodes, [typeKey]: this.getId() };
      }
      return rootNodes;
    }

    getMergedContextMethods = (props) => {
      const blah = props.contextMethods
        ? { ...props.contextMethods, ...this.contextMethods }
        : this.contextMethods;
      return blah;
    };

    setMergedContextMethods = () => (this.mergedContextMethods = this.props.contextMethods
      ? { ...this.props.contextMethods, ...this.contextMethods }
      : this.contextMethods);

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
    addRootNodeId = ({ rootNodeId }) => {
      if (this.getId() === this.childContext.rootNodes[typeKey]) {
        this.childContext.rootNodeId = this.getId();
      } else {
        this.childContext.rootNodeId = rootNodeId;
      }
    }

    setChildContext = () => {
      this.setMergedContextMethods();
      this.childContext = {
        parents: this.getParentIdObj(this.props),
        ...this.mapParentIds(this.props),
        contextMethods: this.mergedContextMethods,
        contextProps: this.nextContextProps,
        rootNodes: this.getRootNodes(this.props),
      };
      this.addRootNodeId(this.props);
    };

    getProps = () => ({
      isRootNode: this.checkIfRoot(),
      [getIdKey(typeKey)]: this.getId(),
      providerType: typeKey,
      ...this.props,
      rootNodeId: this.childContext.rootNodeId,  // needs to replace rootnodeids of other provider types.
      ...this.state,
      contextMethods: this.mergedContextMethods,
      _reactScrollCollapse: {
        id: this.getId(),
        isRootNode: this.checkIfRoot(),
        parents: this.props._reactScrollCollapse.parents, // eslint-disable-line
        // methods: this.getMergedContextMethods(this.props),
        rootNodeId: this.childContext.rootNodeId,
        rootNodes: this.getRootNodes(this.props),
        type: typeKey,
      },
    });

    /*
    self = { // eslint-disable-line
      provider: {
        id: this.getId(),
        isRootNode: this.checkIfRoot(),
        parents: this.props._reactScrollCollapse.parents, // eslint-disable-line
        // methods: this.getMergedContextMethods(this.props),
        rootNodes: this.getRootNodes(this.props),
        type: typeKey,
      },
    };
    */
    compareContextProps = () => shallowEqual(this.prevContextProps, this.nextContextProps);

    setNextContextProps = () => (this.nextContextProps = this.prevContextProps);

    updateChildContext = () => {
      this.setNextContextProps();
      this.childContext.contextProps = this.nextContextProps;
    }

    render() {
      this.updateChildContext();
      const newProps = this.getProps();
      return childTypeKeys.length === 0 ? <Comp {...this.getProps()} /> : (
        <Context.Provider value={this.childContext}>
          <Wrapped
            {...this.getProps()}
            key={this.idKey}
            />
        </Context.Provider>
      );
    }

  }

  Provider.defaultProps = {
    contextMethods: null,
    rootNodes: null,
  };

  Provider.propTypes = {
    // contextMethods: ofObjectTypeOrNothing,
    // rootNodes: ofObjectTypeOrNothing,
  };

  Provider.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'Provider'
  };

  const ExtendedProvider = extendClass(subClassFactory, Provider);

  /*
    This provider might itself be a child - so we must register it.
  */
  return registerConsumer(Context, ExtendedProvider, typeKey, { ...subClassFactory.renderContext });
};


export default createProvider;
