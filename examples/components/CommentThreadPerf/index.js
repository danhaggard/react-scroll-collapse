import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';
// import styles from './Simple.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType } from '../../../src/utils/propTypeHelpers';

import { generateCommentThreadData } from '../../utils';

class CommentThread extends PureComponent { // eslint-disable-line react/no-multi-comp

  state = (() => {
    const { children, comment, title } = this.props.nodeData;
    return {
      comment,
      title,
      localChildren: children,
    };
  })();

  generateChildData = () => generateCommentThreadData(1, 3, 1, 5);

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
      style,
    } = this.props;
    const { comment, localChildren, title } = this.state;
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
        {
          localChildren.map(childNodeData => (
            <WrappedCommentThread key={childNodeData.key} nodeData={childNodeData} />
          ))
        }
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

export default WrappedCommentThread;
