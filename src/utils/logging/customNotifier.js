import { diffTypes } from './const';

const moreInfoUrl = 'http://bit.ly/wdyr02';
const moreInfoHooksUrl = 'http://bit.ly/wdyr3';

const diffTypesDescriptions = {
  [diffTypes.different]: 'different objects.',
  [diffTypes.deepEquals]: 'different objects that are equal by value.',
  [diffTypes.date]: 'different date objects with the same value.',
  [diffTypes.regex]: 'different regular expressions with the same value.',
  [diffTypes.reactElement]: 'different React elements with the same displayName.',
  [diffTypes.function]: 'different functions with the same name.'
};

let inHotReload = false;

const childPaths = ['', '.props', '.props.children', '.props.children.props'];

const rejectedRootPaths = [];

const cleanIgnoredReasonArray = (
  ignoreProps,
  reasons,
  ignoreChildren
) => reasons.filter((reason) => {
  if (ignoreChildren && (childPaths.includes(reason.pathString))) {
    return false;
  }
  if (rejectedRootPaths.includes(reason.pathString)) {
    return false;
  }
  const inIgnore = reason.pathString in ignoreProps;
  const isDiffType = inIgnore && reason.diffType === ignoreProps[reason.pathString].diffType;
  if (isDiffType) {
    rejectedRootPaths.push(reason.pathString);
    return false;
  }
  const rejectedRootPathIsSubstring = Object.keys(ignoreProps).some(
    (rootPath) => {
      const isSubString = reason.pathString.includes(rootPath);
      const rootRejected = rejectedRootPaths.includes(rootPath);
      const reject = isSubString && rootRejected;
      if (reject) {
        rejectedRootPaths.push(reason.pathString);
      }
      return reject;
    }
  );
  return !rejectedRootPathIsSubstring;
});

const removeIgnoredReasons = (ignoreProps, reasonObj, ignoreChildren) => {
  const reason = reasonObj;
  Object.keys(reason).forEach((key) => {
    let reasonVal = reason[key];
    if (Array.isArray(reasonVal)) {
      reasonVal = cleanIgnoredReasonArray(ignoreProps, reasonVal, ignoreChildren);
    }
    reason[key] = reasonVal;
  });
  return reason;
};

function shouldLog(reason, Component, options) {
  if (inHotReload) {
    return false;
  }

  if (options.logOnDifferentValues) {
    return true;
  }

  if (Component.whyDidYouRender && Component.whyDidYouRender.logOnDifferentValues) {
    return true;
  }

  const hasDifferentValues = ((
    reason.propsDifferences
    && reason.propsDifferences.some(diff => diff.diffType === diffTypes.different)
  ) || (
    reason.stateDifferences
    && reason.stateDifferences.some(diff => diff.diffType === diffTypes.different)
  ) || (
    reason.hookDifferences
    && reason.hookDifferences.some(diff => diff.diffType === diffTypes.different)
  ));


  return !hasDifferentValues;
}

function logDifference({
  Component, displayName, hookName, prefixMessage, diffObjType, differences, values, options
}) {
  if (differences && differences.length > 0) {
    options.consoleLog({ [displayName]: Component }, `${prefixMessage} of ${diffObjType} changes:`);
    differences.forEach((difference) => {
      const {
        pathString,
        diffType,
        prevValue,
        nextValue
      } = difference;
      options.consoleGroup(
        `%c${diffObjType === 'hook' ? `[hook ${hookName} result]` : `${diffObjType}.`}%c${pathString}%c`,
        `color:${options.diffNameColor};`, `color:${options.diffPathColor};`, 'color:default;'
      );
      options.consoleLog(
        `${diffTypesDescriptions[diffType]} (more info at ${hookName ? moreInfoHooksUrl : moreInfoUrl})`,
      );
      options.consoleLog({ [`prev ${pathString}`]: prevValue }, '!==', { [`next ${pathString}`]: nextValue });
      options.consoleLog('Difference Object: ', difference);
      options.consoleGroupEnd();
    });
  } else if (differences) {
    options.consoleLog(
      { [displayName]: Component },
      `${prefixMessage} the ${diffObjType} object itself changed but it's values are all equal.`,
      diffObjType === 'props'
        ? 'This could of been avoided by making the component pure, or by preventing it\'s father from re-rendering.'
        : 'This usually means this component called setState when no changes in it\'s state actually occurred.',
      `more info at ${moreInfoUrl}`
    );
    options.consoleLog(`prev ${diffObjType}:`, values.prev, ' !== ', values.next, `:next ${diffObjType}`);
  }
}

export default function defaultNotifier(updateInfo) {
  const {
    Component, displayName, hookName, prevProps, prevState,
    prevHook, nextProps, nextState, nextHook, options
  } = updateInfo;

  let { reason } = updateInfo;
  if (Component.whyDidYouRender && Component.whyDidYouRender.ignoreProps) {
    options.ignoreProps = Component.whyDidYouRender.ignoreProps;
    options.ignoreChildren = Component.whyDidYouRender.ignoreChildren;
    reason = removeIgnoredReasons(options.ignoreProps, reason, options.ignoreChildren);
  }

  if (!shouldLog(reason, Component, options)) {
    return;
  }

  options.consoleGroup(`%c${displayName}`, `color: ${options.titleColor};`);

  let prefixMessage = 'Re-rendered because';

  if (reason.propsDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'props',
      differences: reason.propsDifferences,
      values: { prev: prevProps, next: nextProps },
      options
    });
    prefixMessage = 'And because';
  }

  if (reason.stateDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'state',
      differences: reason.stateDifferences,
      values: { prev: prevState, next: nextState },
      options
    });
  }

  if (reason.hookDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'hook',
      differences: reason.hookDifferences,
      values: { prev: prevHook, next: nextHook },
      hookName,
      options
    });
  }

  if (!reason.propsDifferences && !reason.stateDifferences && !reason.hookDifferences) {
    options.consoleLog(
      { [displayName]: Component },
      'Re-rendered although props and state objects are the same.',
      'This usually means there was a call to this.forceUpdate() inside the component.',
      `more info at ${moreInfoUrl}`
    );
  }

  options.consoleGroupEnd();
}

export function createDefaultNotifier(hotReloadBufferMs) {
  if (hotReloadBufferMs) {
    if (module && module.hot && module.hot.addStatusHandler) {
      module.hot.addStatusHandler((status) => {
        if (status === 'idle') {
          inHotReload = true;
          setTimeout(() => {
            inHotReload = false;
          }, hotReloadBufferMs);
        }
      });
    }
  }

  return defaultNotifier;
}
