import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { ofNumberTypeOrNothing, ofBoolTypeOrNothing, ofChildrenType } from '../../../src/utils/propTypeHelpers';


class CommentThread extends PureComponent { // eslint-disable-line react/no-multi-comp

  animations = {
    // 0: 'animate-linear',
    0: 'animate-ease',
    1: 'animate-ease-in',
    2: 'animate-ease-out',
    3: 'animate-ease-out',
  }

  state = {
    // animation: 2,
    // className: styles.commentThread,
    // threadData: this.props.threadData ? this.props.threadData : passThreadProps(this.props)(-1)
  }

  /*
  addToThread = (props) => {
    const stateUpdater = (state) => {
      const { threadData: { children, countReached } } = state;
      return {
        ...this.state.threadData,
        children: [...children, ...passThreadProps(props)(countReached).children]
      };
    };

    this.setState(stateUpdater);
  }
  */

  // deleteThread = () => this.setState({ depth: 0 });

  /*
  const getNodeObj = (count, depth, index) => ({
    comment: genRandText(),
    key: `comment-${count}`,
    title: `depth: ${depth} - branch: ${index}`,
  });
  */

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

    const { comment, title } = nodeData;

    const idStr = collapserId.toString();
    const newTitle = ` Collapser ${idStr} -- ${title || 'row: 0 - node: 0'}`;
    return (
      <div
        className={`${styles.commentThread} ${this.animations[2]} ${styles.hover}`}
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
          addToThread={this.addToThread}
          childThreads={children.length}
          deleteThread={this.deleteThread}
          text={comment}
        />
        { children }
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
