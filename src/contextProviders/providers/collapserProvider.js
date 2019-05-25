import { COLLAPSERS, ITEMS, SCROLLERS } from '../constants';
import createProvider from '../createProvider';
import CollapserManager from '../CollapserManager';

const collapserProvider = createProvider(
  COLLAPSERS, // your provider type
  [SCROLLERS], // parent provider types
  [COLLAPSERS, ITEMS], // child provider types
  CollapserManager
);

export default collapserProvider;

/*

  If you want to use ChildrenManager to track who is nested under whom
  Then create a ChildrenManager class and pass it in as the last arg to
  createProvider.  It uses React.Component by default.  ChildrenManager
  just extends Component with state logic.

  import childrenManager from '../ChildrenManager';
  const childStateKeys = ['collapsers', 'items'];
  const ChildrenManager = childrenManager(childStateKeys);

  const collapserProvider = createProvider(
    COLLAPSERS, // your provider type
    [SCROLLERS], // parent provider types
    [COLLAPSERS, ITEMS], // child provider types
    ChildrenManager
  );
*/
