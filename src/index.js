import Scroller from './containers/Scroller';

/*
  These are the two main public HoC wrapper functions used to control components
  using react-collapse.

  Create your component and then wrap in your export eg:

    export default collapserItemController(YourItemComponent);

  It should work with redux connected components as well:

    const YourConnectedCollapserComponent = connect(
      mapStateToProps,
      mapDispatchToProps,
    )(YourCollapserComponent);
    export default collapserController(YourConnectedCollapserComponent);

*/
export { collapserController } from './wrappers/collapser';

/*
  If you want to detach the ids from the redux actions then use these two,
  but remember to pass the id props from collapserIdentity into collapserWrapper
*/
export { collapserWrapper as collapserProvider } from './wrappers/collapser/collapserWrapper';
export { collapserIdentity } from './wrappers/collapser';

export { collapserItemController } from './wrappers/collapserItem';
export { collapserItemWrapper as collapserItemProvider } from './wrappers/collapserItem/collapserItemWrapper';
export { collapserItemIdentity } from './wrappers/collapserItem';
/*
  The reducers file is named as the state name space required ('reactScrollCollapse')
  so users can just import and add to their root reducer like so:

  const reducers = combineReducers({
    reactScrollCollapse,
  });
*/
export { reactScrollCollapse } from './reducers';
export { default as AnimatedFlexbox } from './components/AnimatedFlexbox';

export default Scroller;
