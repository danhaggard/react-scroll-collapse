/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { ofBoolTypeOrNothing } from '../utils/propTypeHelpers';
import providerWorkers from '../caching/providerWorkers';

class CollapserContext extends PureComponent {

  constructor(props, context) {
    super(props, context);
    const {
      cache,
      collapserId,
      // isRootNode,
      // rootNodeId,
      // toggleCheckTreeState
    } = props;
    if (isRootNode) {

      this.worker = new Worker();

      this.worker.addEventListener('message', (e) => { // eslint-disable-line no-restricted-globals
        if (!e) {
          return;
        }
        console.log('toggling checkstate from didMount - id: ', collapserId);
        console.log('Message received from worker', e);
        cache.setCache(e.data);
        // toggleCheckTreeState(rootNodeId);
      });
    }
  }

  constructor(props, context) {
    super(props, context);
    this.contextMethods = {
      collapser: {
        getElem: this.getElem,
        getRef: this.getRef,
        scrollToTop: this.scrollToTop,
        setScrollTop: this.setScrollTop,
      }
    };
  }

}

CollapserContext.defaultProps = {
  isOpenedInit: null,
};

CollapserContext.propTypes = {
  isOpenedInit: ofBoolTypeOrNothing,

};

CollapserContext.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CollapserContext'
};

export default CollapserContext;
