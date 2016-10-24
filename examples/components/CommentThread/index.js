import React, {PropTypes, Component} from 'react';
import styles from './CommentThread.scss';

import Comment from './../Comment';
import {collapserController} from '../../../src';


class CommentThread extends Component {

  componentWillMount() {
    /*
      I miss python: range(a,b) - sigh.
      This trick comes from: http://stackoverflow.com/a/20066663/1914452
    */
    const noOfWords = Math.floor((Math.random() * 50) + 10);
    const arr = Array.apply(null, {length: noOfWords}).map(Number.call, Number);
    this.randText = '';
    arr.forEach(() => {
      this.randText += ` ${this.getRandString()}`;
    });
  }

  /*
    This comes from: http://stackoverflow.com/a/8084248/1914452
  */
  getRandString() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const N = Math.floor((Math.random() * 10) + 1);
    const selection = Array.apply(null, Array(N)).map(
      () => letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');
    return selection;
  }

  render() {
    const {collapserId, expandCollapseAll, maxNest} = this.props;
    /*
      Recursively nesting this component is just a dirty way to generate nested
      comments I'm using for the purpose of this demo.
      The maxNest value- prevents infinite recursion
    */
    const nested = collapserId > maxNest ? null : ([
      <WrappedCommentThread key={0} maxNest={maxNest} />,
      <WrappedCommentThread key={1} maxNest={maxNest} />,
      <WrappedCommentThread key={2} maxNest={maxNest} />
    ]);

    const id = {idStr: collapserId.toString(), randText: this.randText};
    const text = ` Comment Text ${id.idStr}: --- ${id.randText}`;
    const title = ` Comment Title ${id.idStr}`;
    return (
      <div className={styles.commentThread}>
        <Comment
          text={text}
          title={title}
          expandCollapseAll={expandCollapseAll}
        />
      {nested}
      </div>
    );
  }
}

CommentThread.propTypes = {
  areAllItemsExpanded: PropTypes.bool,
  collapserId: PropTypes.number,
  expandCollapseAll: PropTypes.func,
  maxNest: PropTypes.number.isRequired,
};

/*
  Normally would just do: export default collapserController(CommentThread);
  But this allows us to recursively nest WrappedCommentThread with all the redux
  bindings attached in each instance.
*/
const WrappedCommentThread = collapserController(CommentThread);
export default WrappedCommentThread;
