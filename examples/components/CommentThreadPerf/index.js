import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';
// import styles from './Simple.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType } from '../../../src/utils/propTypeHelpers';

import { generateCommentThreadData, getRandomInt } from '../../utils';

class CommentThread extends PureComponent { // eslint-disable-line react/no-multi-comp

  state = (() => {
    const {
      children,
      comment,
      count,
      depth,
      title
    } = this.props.nodeData;
    return {
      comment,
      count,
      depth,
      title,
      localChildren: children,
    };
  })();

  generateChildData = (count, depth) => generateCommentThreadData(
    this.props,
    count,
    depth,
  );

  addChildren = children => state => ({
    ...state,
    count: state.count + children.length,
    localChildren: [...state.localChildren, ...children],
  });

  removeChild = state => ({
    ...state,
    localChildren: state.localChildren.slice(0, -2),
  });

  insertThread = () => {
    const { minChildren, maxChildren } = this.props;
    const { count, depth } = this.state;
    const numNewChildren = getRandomInt(minChildren, maxChildren);
    const newChildren = [...Array(numNewChildren).keys()].map(
      i => this.generateChildData(count + i, depth + 1)
    );
    this.setState(this.addChildren(newChildren));
  };

  removeThread = () => this.setState(this.removeChild);

  render() {
    const {
      areAllItemsExpanded,
      children,
      expandCollapseAll,
      collapserRef,
      collapserId,
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      isRootNode,
      style,
    } = this.props;
    const { comment, localChildren, title } = this.state;
    const idStr = collapserId.toString();
    const newTitle = ` Collapser ${idStr} -- ${title || 'row: 0 - node: 0'}`;
    return (
      <div
        className={`${styles.commentThread} ${!isRootNode && styles.hover}`}
        ref={collapserRef}
        style={{ ...style }}
      >
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onClick={expandCollapseAll}
          title={newTitle}
        />
        <CommentWithButtons
          isOpenedInit={false}
          addToThread={this.insertThread}
          childThreads={localChildren.length}
          deleteThread={this.removeThread}
          text={comment}
        />
        { children }
        {
          localChildren.map(childNodeData => (
            <WrappedCommentThread
              key={childNodeData.key}
              nodeData={childNodeData}
              {...{
                minChildren,
                minDepth,
                maxChildren,
                maxDepth,
              }}
            />
          ))
        }
      </div>
    );
  }
}

CommentThread.defaultProps = {
  areAllItemsExpanded: null,
  children: [],
  maxChildren: 1,
  maxDepth: 1,
  minChildren: 1,
  minDepth: 1,
  style: {},
};

CommentThread.propTypes = {
  children: ofChildrenType,
  collapserId: PropTypes.number.isRequired,
  areAllItemsExpanded: ofBoolTypeOrNothing,
  expandCollapseAll: PropTypes.func.isRequired,
  collapserRef: PropTypes.object.isRequired,
  nodeData: PropTypes.object.isRequired,
  maxChildren: PropTypes.number,
  maxDepth: PropTypes.number,
  minChildren: PropTypes.number,
  minDepth: PropTypes.number,
  isRootNode: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: 'CommentThreadPerf'
};

const WrappedCommentThread = collapserController(CommentThread);

export default WrappedCommentThread;
