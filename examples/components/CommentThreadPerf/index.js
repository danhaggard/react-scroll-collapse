import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { ofNumberTypeOrNothing, ofBoolTypeOrNothing, ofChildrenType } from '../../../src/utils/propTypeHelpers';

import { generateCommentThreadData } from '../../utils';


const mapNodeDataToThread = dataNode => (
  <WrappedCommentThread key={dataNode.key} nodeData={dataNode}>
    {
      dataNode.children.map((childDataNode) => {
        console.log('count Reached: ', childDataNode.countReached);
        if (childDataNode.countReached < 500) {
          return mapNodeDataToThread(childDataNode);
        }
        return <WrappedCommentThread key={childDataNode.key} nodeData={childDataNode} />;
      })
    }
  </WrappedCommentThread>
);

/*
const mapNodeDataToThread = (dataNode) => {
  return (
    <WrappedCommentThread key={dataNode.key} nodeData={dataNode}>
      {
        dataNode.children.map((childDataNode) => {
          console.log('count Reached: ', childDataNode.countReached);
          if (childDataNode.countReached < 500) {
            return mapNodeDataToThread(childDataNode);
          }
          return <WrappedCommentThread key={childDataNode.key} nodeData={childDataNode} />;
        })
      }
    </WrappedCommentThread>
  );
};
*/

class CommentThread extends PureComponent { // eslint-disable-line react/no-multi-comp

  state = {
    localChildren: []
  };

  generateChildData = () => generateCommentThreadData(1, 2, 1, 2);

  addChild = child => state => ({
    ...state,
    localChildren: [...state.localChildren, child],
  });

  removeChild = state => ({
    ...state,
    localChildren: state.localChildren.slice(0, -1),
  });

  insertThread = () => {
    const child = this.generateChildData();
    this.setState(this.addChild(child));
  };

  removeThread = () => this.setState(this.removeChild);

  render() {
    const {
      areAllItemsExpanded,
      children,
      expandCollapseAll,
      collapserRef,
      collapserId,
      nodeData,
      style,
    } = this.props;
    const { localChildren } = this.state;
    const { comment, title } = nodeData;
    const idStr = collapserId.toString();
    const newTitle = ` Collapser ${idStr} -- ${title || 'row: 0 - node: 0'}`;
    return (
      <div
        className={`${styles.commentThread} ${styles.hover}`}
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
        { localChildren.map(child => mapNodeDataToThread(child)) }
      </div>
    );
  }
}

CommentThread.defaultProps = {
  children: [],
  areAllItemsExpanded: null,
  style: {},
};

CommentThread.propTypes = {
  children: ofChildrenType,
  collapserId: PropTypes.number.isRequired,
  areAllItemsExpanded: ofBoolTypeOrNothing,
  expandCollapseAll: PropTypes.func.isRequired,
  collapserRef: PropTypes.object.isRequired,
  nodeData: PropTypes.object.isRequired,
  style: PropTypes.object,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: 'CommentThreadPerf'
};

const WrappedCommentThread = collapserController(CommentThread);

function getWrappedCommentThread() {
  return WrappedCommentThread;
}

export default WrappedCommentThread;
