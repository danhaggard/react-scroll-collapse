
export const isUndefNull = val => val === null || val === undefined;

// ensure state slice and attribute exist - else return null;
export const getOrDefault = (state, attr, defaultValue = null) => {
  if (isUndefNull(state)) {
    // return now to prevent access of state[attr]
    return defaultValue;
  }
  if (!isUndefNull(state[attr])) {
    return state[attr];
  }
  return defaultValue;
};

export const getOrArray = (state, attr) => getOrDefault(state, attr, []);
export const getOrNull = (state, attr) => getOrDefault(state, attr);
export const getOrObject = (state, attr) => getOrDefault(state, attr, {});



/*
  -------------------------------- TIER ZERO -----------------------------
  reactScrollCollapse
*/
export const getReactScrollCollapse = state => getOrNull(state, 'reactScrollCollapse');

/*
  -------------------------------- TIER ONE -----------------------------
  entities
  recurseNodeTarget
  scrollers ??
*/
export const getEntities = state => getOrNull(state, 'entities');

export const getRecurseNodeTarget = state => getOrNull(state, 'recurseNodeTarget');
