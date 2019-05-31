import React, { PureComponent } from 'react';
import createCache from '../../../caching/recursionCache';
import providerCaches from '../../../caching/providerCaches';
import providerWorkers from '../../../caching/providerWorkers';
import { setContextAttrs } from '../../../utils/objectUtils';


const collapserManager = (Comp) => {
  class CollapserManager extends PureComponent {

    setAttrs = (() => setContextAttrs(this))();

    getCreateCache = () => {
      const { isRootNode, rootNodeId, type } = this;
      const providerCache = providerCaches[type];
      if (isRootNode) {
        providerCache[rootNodeId] = createCache(rootNodeId);
      }
      return providerCache[rootNodeId];
    }

    getCache = () => {
      if (!this.cache) {
        this.cache = this.getCreateCache();
      }
      this.cache.unlockCache();
      return this.cache;
    }

    getWorker = () => {
      const { rootNodeId, type } = this;
      const workerCache = providerWorkers[type];
      return workerCache.getWorker(rootNodeId);
    }

    render() {
      return (
        <Comp
          {...this.props}
          areAllItemsExpandedWorker={this.getWorker()}
          cache={this.getCache()}
        />
      );
    }
  }

  CollapserManager.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'CollapserManager'
  };

  return CollapserManager;
};

export default collapserManager;
