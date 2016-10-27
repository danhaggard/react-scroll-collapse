import React, {PropTypes, Component} from 'react';
import styles from './CommentThread.scss';

import Comment from './../Comment';
import CommentTitle from './../CommentTitle';

import {collapserController} from '../../../src';
import {genRandText} from './../../utils';


class CommentThread extends Component {

  constructor(props) {
    super(props);
    this.state = {
      childThreads: 2
    };
    this.unMountChildren = this.unMountChildren.bind(this);
    this.unMount = this.unMount.bind(this);
  }

  componentWillMount() {
    this.randText = genRandText();
  }

  handleClick(childThreads) {
    this.setState({childThreads: childThreads + 1});
  }

  unMountChildren() {
    this.setState({childThreads: 0});
  }

  unMount() {
    this.props.unMountChildren();
  }

  render() {
    const {areAllItemsExpanded, collapserId, expandCollapseAll, maxNest,
      unMountChildren} = this.props;
    const idStr = collapserId.toString();
    const text = ` Comment Text ${idStr}: --- ${this.randText}`;
    const title = ` Comment Title ${idStr}`;

    /* Some  recursion to generate nested threads. */
    const nested = collapserId > maxNest ? null :
      Array.apply(null, Array(this.state.childThreads)).map(
        (key, index) => (
          <WrappedCommentThread
            key={index}
            maxNest={this.state.childThreads}
            unMountChildren={this.unMountChildren}
          />
        )
      );

    // Add content dynamically to show that the scroller will track it.
    const addToThread = collapserId < this.state.childThreads || collapserId < maxNest ? (
      <button onClick={() => this.handleClick(this.state.childThreads)}>
        Insert Thread
      </button>
    ) : null;

    const deleteThread = collapserId === 0 ? null : (
      <button onClick={this.unMount}>
        Delete Thread
      </button>
    );

    return (
      <div className={styles.commentThread} >
        <div onClick={expandCollapseAll}>
          <CommentTitle title={title} isOpened={areAllItemsExpanded} />
        </div>
        <Comment text={text} />
        {deleteThread}
        {nested}
        {addToThread}

      </div>
    );
  }
}

CommentThread.propTypes = {
  areAllItemsExpanded: PropTypes.bool.isRequired, // provided by collapserController
  collapserId: PropTypes.number.isRequired, // provided by collapserController
  expandCollapseAll: PropTypes.func, // provided by collapserController
  maxNest: PropTypes.number,
  unMountChildren: PropTypes.func,
};

const WrappedCommentThread = collapserController(CommentThread);
export default WrappedCommentThread;
