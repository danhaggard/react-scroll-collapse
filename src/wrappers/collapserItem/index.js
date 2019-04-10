import { collapserItemWrapper } from './collapserItemWrapper';
import { collapserItemControllerWrapper } from './collapserItemControllerWrapper';

export const collapserItemController = wrappedComponent => collapserItemControllerWrapper(
  collapserItemWrapper(wrappedComponent)
);

export default collapserItemController;
