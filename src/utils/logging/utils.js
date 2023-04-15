import { globalOptionDefaults } from './const';

const addLoggingDefaultsToComponent = globalDefaults => (
  ComponentArg,
  customName,
  ignoreArray,
) => {
  const Component = ComponentArg;
  const ignoreProps = {};
  ignoreArray.forEach(([prop, diffType]) => {
    const pathString = `.${prop}`;
    const ignoreObject = {
      diffType,
      pathString
    };
    ignoreProps[pathString] = ignoreObject;
  });
  const options = {
    ...globalDefaults,
    customName,
    ignoreProps
  };

  Component.whyDidYouRender = options;
};

export default addLoggingDefaultsToComponent(globalOptionDefaults);
