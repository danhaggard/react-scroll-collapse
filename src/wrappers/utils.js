export const whyUpdate = (state, nextState, component, id, checkAgainst = []) => {
  Object.keys(state).forEach((key) => {
    if (!checkAgainst.includes(key) && state[key] !== nextState[key]) {
      if (id === 1) {
        // debugger;
      }
      console.log(`whyUpdate:  ${component} - id: ${id}, key: ${key}, value: ${state[key]}, nextValue: ${nextState[key]}`); // eslint-disable-line
    }
  });
};

export const shouldLogProvider = (props, state, id, log) => {
  if (!Object.keys(props).includes('isOpenedInit')) {
    console.log(log, id, props, state); // eslint-disable-line
  }
};
