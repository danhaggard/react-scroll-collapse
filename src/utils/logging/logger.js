import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import customNotifier from './customNotifier';

const notifiers = {
  0: whyDidYouRender.defaultNotifier,
  1: customNotifier
};

// const getNotifier = (logType) => {};

const whyUpdate = (logType = 0) => {
  whyDidYouRender(React, {
    exclude: [/^AnimatedFlexbox/],
    logOnDifferentValues: false,
    notifier: notifiers[logType],
    trackHooks: false,
  });
};


const checkEnvironment = (loggerFunc) => {
  if (process.env.NODE_ENV !== 'production') {
    return loggerFunc;
  }
  return () => '';
};


export default checkEnvironment(whyUpdate);
