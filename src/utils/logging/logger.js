import React from 'react';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import notifier from './customNotifier';

const notifiers = {
  1: notifier
};

// const getNotifier = (logType) => {};

const whyUpdate = (logType = 1) => {
  if (logType === 0) {
    whyDidYouRender(React);
  }

  if (logType === 1) {
    whyDidYouRender(React, { notifier: notifiers[1] });
  }
};


const checkEnvironment = (loggerFunc) => {
  if (process.env.NODE_ENV !== 'production') {
    return loggerFunc;
  }
  return () => '';
};


export default checkEnvironment(whyUpdate);
