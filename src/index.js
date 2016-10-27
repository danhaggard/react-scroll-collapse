import Scroller from './containers/Scroller';

/*
  These are the two main public HoC wrapper functions used to control components
  using react-collapse.

  Create your component and then wrap in your export eg:

    export default collapserItemController(YourItemComponent);

  It should work with redux connected components ass well:

    const YourConnectedCollapserComponent = connect(
      mapStateToProps,
      mapDispatchToProps,
    )(YourCollapserComponent);
    export default collapserController(YourConnectedCollapserComponent);

*/
export {collapserController} from './wrappers/collapser';
export {collapserItemController} from './wrappers/collapserItem';

/*
  The reducers file is named as the state name space required ('reactScrollCollapse')
  so users can just import and add to their root reducer like so:

  const reducers = combineReducers({
    reactScrollCollapse,
  });
*/
export {reactScrollCollapse} from './reducers';

/* root sagas func name: reactScrollCollapseSagas */
export {reactScrollCollapseSagas} from './sagas';
export {reactScrollCollapseMiddleWare} from './middleware';
export default Scroller;
