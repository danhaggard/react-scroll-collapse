import { getOrNull, compose } from '../utils/selectorUtils';

/*
  -------------------------------- Common State -------------------------

  -------------------------------- TIER ZERO -----------------------------
  reactScrollCollapse
*/
export const getReactScrollCollapse = rootState => getOrNull(rootState, 'reactScrollCollapse');

/*
  -------------------------------- TIER ONE -----------------------------
  entities
  recurseNodeTarget
  scrollers ??
*/

export const getEntities = reactScrollCollapseObject => getOrNull(reactScrollCollapseObject, 'entities');

export const getEntitiesRoot = compose(getEntities, getReactScrollCollapse);
