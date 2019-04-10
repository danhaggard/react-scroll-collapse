import { collapserWrapper } from './collapserWrapper';
import { collapserControllerWrapper } from './collapserControllerWrapper';

export const collapserController = wrappedComponent => collapserControllerWrapper(
  collapserWrapper(wrappedComponent)
);

export default collapserController;
