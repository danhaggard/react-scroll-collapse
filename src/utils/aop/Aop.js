/*
  Modified version of: http://fredrik.appelberg.me/2010/05/07/aop-js/
*/

const getWrappedName = (advice, originalFn) => `aop.${advice.name}(${originalFn.name})`;

const Aop = {
  around(fnName, advice, nsArg) {
    const ns = nsArg;
    /*
      fnName: string of the function,
      advice: the function that does the wrapping.
      ns: the namespace in which you can find the function.
    */

    const originalFn = ns[fnName];
    // 1) First we store the original function

    function adviceWrapper(...args) {
      // 2) We replace the original function in it's namespace...
      // 3) ...with a wrapper around the advice function, which
      // 4) accepts the same args being passed to the original;
      /* 5) Calls the advice function, using the same execution
            context the original fn was called in by passing 'this'
            as first param of call */
      // Passed a targetObject to the advice with fn: origFunc and args: args
      return advice.call(this, {
        args: [...args],
        fn: originalFn
      });
    }

    // 6 - give the adviceWrapper the name of the original function.
    Object.defineProperty(adviceWrapper, 'name', { value: getWrappedName(advice, originalFn) });

    ns[fnName] = adviceWrapper;
  },

  /*
    targetInfo = {
      fn: the original function that got wrapped,
      args: [the original args that were passed to the original func]
    }

    The targetInfo obj is created by the Aop.around function - which is why we
    can rely on those methods being there.

    next() - just needs to:
      1) call the original function
      2) pass in the original args passed into the original func
      3) Doing so with the exzecution context in which next is called.
  */

  next(targetInfo) {
    return targetInfo.fn.apply(this, targetInfo.args);
  }

};

Aop.before = function before(fnName, advice, ns) {
  Aop.around(fnName,
    function adviceWrapper(targetInfo) {
      advice.apply(this, targetInfo.args);
      return Aop.next(targetInfo);
    },
    ns);
};

Aop.after = function after(fnName, advice, ns) {
  Aop.around(fnName,
    function adviceWrapper(targetInfo) {
      const ret = Aop.next(targetInfo);
      advice.apply(this, targetInfo.args);
      return ret;
    },
    ns);
};

export default Aop;
