import React from 'react';
import { whyDidYouUpdate } from 'why-did-you-update';

const notifier = (groupByComponent, collapseComponentGroups, displayName, diffs) => {
  diffs.forEach(({
    name,
    prev,
    next,
    type
  }) => {
    // Use the diff and notify the user somehow
    console.log('name, prev, next, type', name, prev, next, type);
  });
};

const notifiers = {
  1: notifier
};

// const getNotifier = (logType) => {};

const whyUpdate = (logType = 0) => {
  if (logType === 0) {
    whyDidYouUpdate(React);
  }

  if (logType === 1) {
    whyDidYouUpdate(React, { notifier: notifiers[1] });
  }
};


const checkEnvironment = (loggerFunc) => {
  if (process.env.NODE_ENV !== 'production') {
    return loggerFunc;
  }
  return dummy => '';
};


export default checkEnvironment(whyUpdate);
