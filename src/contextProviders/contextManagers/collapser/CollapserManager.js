import React, { PureComponent } from 'react';
import createCache from '../../../caching/recursionCache';
import providerCaches from '../../../caching/providerCaches';
import providerWorkers from '../../../caching/providerWorkers';

const getRootNodeId = ({
  collapserId,
  isRootNode,
  providerType,
  rootNodes,
}) => (isRootNode ? collapserId : rootNodes[providerType]);

const collapserManager = (Comp) => {
  class CollapserManager extends PureComponent {

    getCreateCache = (props, rootNodeId) => {
      const { isRootNode, providerType } = props;
      const providerCache = providerCaches[providerType];
      if (isRootNode) {
        providerCache[rootNodeId] = createCache(rootNodeId);
      }
      return providerCache[rootNodeId];
    }

    getCache = (props, rootNodeId) => {
      if (!this.cache) {
        this.cache = this.getCreateCache(props, rootNodeId);
      }
      this.cache.unlockCache();
      return this.cache;
    }

    getWorker = (props, rootNodeId) => {
      const { providerType } = props;
      const workerCache = providerWorkers[providerType];
      return workerCache.getWorker(rootNodeId);
    }

    render() {
      const { rootNodeId } = this.props;
      return (
        <Comp
          {...this.props}
          areAllItemsExpandedWorker={this.getWorker(this.props, rootNodeId)}
          cache={this.getCache(this.props, rootNodeId)}
          // rootNodeId={rootNodeId}
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
