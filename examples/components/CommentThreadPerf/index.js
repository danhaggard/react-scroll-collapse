import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';
// import styles from './Simple.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType, ofNumberTypeOrNothing } from '../../../src/utils/propTypeHelpers';

import { generateCommentThreadData, getRandomInt } from '../../utils';

const insertAtIndex = (arr1, arr2, index = null) => {
  if (index === 0 || index === null) {
    return [...arr2, ...arr1];
  }
  if (index >= arr1.length) {
    return [...arr1, ...arr2];
  }
  return [...arr1.slice(0, index), ...arr2, ...arr1.slice(index, -1)];
};


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

  addChildren = (children, insertChildAtIndex = null) => state => ({
    ...state,
    count: state.count + children.length,
    localChildren: insertAtIndex(state.localChildren, children, insertChildAtIndex),
    // localChildren: [...state.localChildren, ...children],
  });

  removeChild = state => ({
    ...state,
    localChildren: state.localChildren.slice(0, -1),
  });

  insertThread = () => {
    const { minChildren, maxChildren, insertChildAtIndex } = this.props;
    const { count, depth } = this.state;
    const numNewChildren = getRandomInt(minChildren, maxChildren) - 1;
    const newChildren = [...Array(numNewChildren).keys()].map(
      i => this.generateChildData(count + i, depth + 1)
    );
    this.setState(this.addChildren(newChildren, insertChildAtIndex));
  };

  removeThread = () => this.setState(this.removeChild);

  render() {
    const {
      areAllItemsExpanded,
      children,
      childIsOpenedInit,
      expandCollapseAll,
      collapserRef,
      collapserId,
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      isOpenedInit,
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
          isOpenedInit={isOpenedInit}
          addToThread={this.insertThread}
          childThreads={localChildren.length}
          deleteThread={this.removeThread}
          text={comment}
        />
        { children }
        {
          localChildren.map(childNodeData => (
            <WrappedCommentThread
              isOpenedInit={childIsOpenedInit}
              childIsOpenedInit={childIsOpenedInit}
              key={childNodeData.key}
              nodeData={childNodeData}
              {...{
                minChildren: minChildren - 1,
                minDepth,
                maxChildren: maxChildren - 1,
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
  insertChildAtIndex: null,
  maxChildren: 1,
  maxDepth: 1,
  minChildren: 1,
  minDepth: 1,
  style: {},
};

CommentThread.propTypes = {
  areAllItemsExpanded: ofBoolTypeOrNothing,
  children: ofChildrenType,
  collapserId: PropTypes.number.isRequired,
  collapserRef: PropTypes.object.isRequired,
  expandCollapseAll: PropTypes.func.isRequired,
  insertChildAtIndex: ofNumberTypeOrNothing,
  isRootNode: PropTypes.bool.isRequired,
  nodeData: PropTypes.object.isRequired,
  maxChildren: PropTypes.number,
  maxDepth: PropTypes.number,
  minChildren: PropTypes.number,
  minDepth: PropTypes.number,
  style: PropTypes.object,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: 'CommentThreadPerf'
};

const WrappedCommentThread = collapserController(CommentThread);

export default WrappedCommentThread;
