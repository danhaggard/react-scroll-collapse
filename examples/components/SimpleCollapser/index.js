import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleCollapser.scss';

import ExpanderButton from '../ExpandButton';
import SimpleComment from '../SimpleComment';
import { collapserController } from '../../../src';
import { genRandText } from '../../utils';

const createComment = key => ({
  key,
  text: genRandText()
});

class SimpleCollapser extends Component {

  state = {
    comments: [...Array(5).keys()].map(createComment),
    commentCount: 5,
  }

  addComment = () => {
    const { comments, commentCount } = this.state;
    this.setState({
      comments: [...comments, createComment(commentCount + 1)],
      commentCount: commentCount + 1,
    });
  }

  removeComment = () => {
    const { comments, commentCount } = this.state;
    this.setState({
      comments: comments.slice(0, comments.length - 1),
      commentCount: commentCount - 1,
    });
  }

  render() {
    const {
      expandCollapseAll,
      areAllItemsExpanded,
      collapserId,
      collapserRef,
    } = this.props;
    const { comments } = this.state;
    const title = ` Collapser ${collapserId.toString()}`;
    return (
      <div className={styles.simpleCollapser} ref={collapserRef}>
        <ExpanderButton
          isOpened={areAllItemsExpanded}
          onClick={expandCollapseAll}
          title={title}
        />
        {comments.map(comment => <SimpleComment {...comment} />)}
        <button onClick={this.addComment} type="button">
          Add Comment
        </button>
        <button onClick={this.removeComment} type="button">
          Remove Comment
        </button>
      </div>
    );
  }
}

SimpleCollapser.propTypes = {
  areAllItemsExpanded: PropTypes.bool.isRequired,
  collapserId: PropTypes.number.isRequired,
  expandCollapseAll: PropTypes.func.isRequired,
  collapserRef: PropTypes.object.isRequired,
};

export default collapserController(SimpleCollapser);
