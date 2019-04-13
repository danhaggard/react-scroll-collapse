import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import Comment from '../Comment';
import ExpanderButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { genRandText } from '../../utils';


const getNested = noOfChildThreads => (
  noOfChildThreads === 0 ? null
    : [...Array(noOfChildThreads).keys()].map(
      key => (
        <WrappedCommentThread
          key={key}
          childThreads={noOfChildThreads - 1}
        />
      )
    ));


const addToThread = addToThreadFunc => (
  <button onClick={addToThreadFunc} type="button">
    Insert Thread
  </button>
);

const deleteThread = (childThreads, deleteThreadFunc) => (
  childThreads === 0 ? <div /> : (
    <button onClick={deleteThreadFunc} type="button">
      Delete Thread
    </button>
  )
);


class CommentThread extends Component {

  randText = genRandText();

  state = {
    childThreads: this.props.childThreads, // eslint-disable-line react/destructuring-assignment
    randText: genRandText(),
  }

  addToThread = () => {
    const { childThreads } = this.state;
    this.setState({ childThreads: childThreads + 1 });
  }

  deleteThread = () => this.setState({ childThreads: 0 });

  render() {
    const {
      areAllItemsExpanded,
      collapserId,
      collapserRef,
      expandCollapseAll
    } = this.props;
    const { childThreads, randText } = this.state;
    const idStr = collapserId.toString();
    const text = `${randText}`;
    const title = ` Collapser ${idStr}`;
    return (
      <div className={styles.commentThread} ref={collapserRef}>
        <ExpanderButton
          isOpened={areAllItemsExpanded}
          onClick={expandCollapseAll}
          title={title}
        />
        <Comment
          text={text}
          deleteThread={deleteThread(childThreads, this.deleteThread)}
          addToThread={addToThread(this.addToThread)}
        />
        {getNested(childThreads)}
      </div>
    );
  }
}

CommentThread.propTypes = {
  areAllItemsExpanded: PropTypes.bool.isRequired, // provided by collapserController
  collapserId: PropTypes.number.isRequired, // provided by collapserController
  collapserRef: PropTypes.object.isRequired, // provided by collapserController
  expandCollapseAll: PropTypes.func.isRequired, // provided by collapserController
  childThreads: PropTypes.number.isRequired,
};

const WrappedCommentThread = collapserController(CommentThread);
export default WrappedCommentThread;
