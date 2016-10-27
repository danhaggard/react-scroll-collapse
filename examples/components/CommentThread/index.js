import React, {PropTypes, Component} from 'react';
import styles from './CommentThread.scss';

import Comment from './../Comment';
import CommentTitle from './../CommentTitle';

import {collapserController} from '../../../src';
import {genRandText} from './../../utils';


const getNested = (childThreads) => (
  childThreads === 0 ? null :
    Array.apply(null, Array(childThreads)).map(
      (key, index) => (
        <WrappedCommentThread
          key={index}
          childThreads={childThreads - 1}
        />
      )
    )
  );

const addToThread = (addToThreadFunc) =>
  <button onClick={addToThreadFunc}>
    Insert Thread
  </button>;

const deleteThread = (childThreads, deleteThreadFunc) => (
  childThreads === 0 ? null :
    <button onClick={deleteThreadFunc}>
      Delete Thread
    </button>
);


class CommentThread extends Component {

  constructor(props) {
    super(props);
    this.state = {
      childThreads: 0,
      randText: '',
    };
    this.deleteThread = this.deleteThread.bind(this);
    this.addToThread = this.addToThread.bind(this);
  }

  componentWillMount() {
    this.randText = genRandText();
    this.setState({
      childThreads: this.props.childThreads,
      randText: genRandText(),
    });
  }

  addToThread() {
    this.setState({childThreads: this.state.childThreads + 1});
  }

  deleteThread() {
    this.setState({childThreads: 0});
  }

  render() {
    const {areAllItemsExpanded, collapserId, expandCollapseAll} = this.props;
    const {childThreads, randText} = this.state;
    const idStr = collapserId.toString();
    const text = ` Comment Text ${idStr}: --- ${randText}`;
    const title = ` Comment Title ${idStr}`;
    return (
      <div className={styles.commentThread} >
        <div onClick={expandCollapseAll}>
          <CommentTitle title={title} isOpened={areAllItemsExpanded} />
        </div>
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
  expandCollapseAll: PropTypes.func, // provided by collapserController
  childThreads: PropTypes.number,
};

const WrappedCommentThread = collapserController(CommentThread);
export default WrappedCommentThread;
