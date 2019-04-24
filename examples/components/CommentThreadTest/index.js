import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
// import { CollapserExpandButton } from '../ExpandButtonWrapped';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';

import { genRandText } from '../../utils';


const getNested = (depth, childNodes) => (
  depth === 0 ? null
    : [...Array(childNodes).keys()].map(
      node => (
        <WrappedCommentThread
          key={`row: ${depth + 1} - node: ${node}`}
          depth={depth - 1}
          childNodes={childNodes}
          title={`row: ${depth + 1} - node: ${node}`}
        >
          {getNested(depth - 1, childNodes)}
        </WrappedCommentThread>
      )
    ));

const getNestedOld = depth => (
  depth === 0 ? null
    : [...Array(depth).keys()].map(
      node => (
        <WrappedCommentThread
          key={`row: ${depth + 1} - node: ${node}`}
          depth={depth - 1}
          title={`row: ${depth + 1} - node: ${node}`}
        />
      )
    ));

const getNestedOlder = noOfChildThreads => (
  noOfChildThreads === 0 ? null
    : [...Array(noOfChildThreads).keys()].map(
      key => (
        <WrappedCommentThread
          key={key}
          depth={noOfChildThreads - 1}
        />
      )
    ));

class CommentThread extends PureComponent {

  randText = genRandText();

  state = {
    depth: this.props.depth, // eslint-disable-line react/destructuring-assignment
  }

  addToThread = () => {
    const { depth } = this.state;
    this.setState({ depth: depth + 1 });
  }

  deleteThread = () => this.setState({ depth: 0 });

  render() {
    const {
      areAllItemsExpanded,
      expandCollapseAll,
      collapserRef,
      collapserId,
      childNodes,
      oldNesting,
      parentCollapserId,
      parentScrollerId,
      style,
      title,
    } = this.props;
    const { depth } = this.state;
    const idStr = collapserId.toString();
    const text = `${this.randText}`;
    const newTitle = ` Collapser ${idStr} -- ${title || 'row: 0 - node: 0'}`;
    return (
      <div ref={collapserRef} className={styles.commentThread} style={style}>
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onClick={expandCollapseAll}
          title={newTitle}
        />
        <CommentWithButtons
          addToThread={this.addToThread}
          childThreads={depth}
          deleteThread={this.deleteThread}
          text={text}
        />
        { oldNesting ? getNestedOlder(depth) : getNested(depth, childNodes)}
      </div>
    );
  }
}

CommentThread.defaultProps = {
  depth: 1,
  childNodes: 1,
  oldNesting: false,
  parentCollapserId: null,
  parentScrollerId: null,
  style: {},
  title: ''
};

CommentThread.propTypes = {
  depth: PropTypes.number,
  childNodes: PropTypes.number,
  oldNesting: PropTypes.bool,
  title: PropTypes.string,
  collapserId: PropTypes.number.isRequired,
  parentCollapserId: PropTypes.number,
  parentScrollerId: PropTypes.number,
  style: PropTypes.object,
};

const WrappedCommentThread = collapserController(CommentThread);
export default WrappedCommentThread;
