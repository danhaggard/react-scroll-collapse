const pubsub = (thatArg = {}) => {
  const that = thatArg;

  const topics = {};
  const tokenMap = {};

  let subUid = -1;

  that.publish = (topic, args) => {
    if (!topics[topic]) {
      return false;
    }

    const subscribers = topics[topic];
    Object.keys(subscribers).forEach((key => subscribers[key](...args)));
    return that;
  };

  that.subscribe = (topic, func) => {
    if (!topics[topic]) {
      topics[topic] = {};
    }
    subUid += 1;
    const token = (subUid).toString();
    topics[topic][token] = func;
    tokenMap[token] = topic;

    return token;
  };

  that.unsubscribe = (token) => {
    const topic = tokenMap[token];

    if (topic) {
      delete tokenMap[token];
      delete topics[topic][token];
    }
  };

  that.topics = topics;
  that.tokenMap = tokenMap;
  return that;
};

export default pubsub;
