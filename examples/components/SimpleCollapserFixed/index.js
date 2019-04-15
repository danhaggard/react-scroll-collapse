import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleCollapser.scss';

import CommentBody from '../CommentBody';
import { CollapserExpandButton } from '../ExpandButtonWrapped';
import SimpleComment from '../SimpleComment';
import { collapserIdentity } from '../../../src';
import { genRandText } from '../../utils';

const createComment = key => ({
  key,
  text: genRandText()
});

class SimpleCollapserFixed extends Component {

  constructor(props) {
    super(props);
    const { initialComments } = props;
    this.state = {
      comments: [...Array(initialComments).keys()].map(createComment),
      commentCount: initialComments,
    };
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
    const { collapserId, parentCollapserId, parentScrollerId } = this.props;
    const { comments } = this.state;
    const title = ` Collapser ${collapserId.toString()}`;
    return (
      <div className={styles.simpleCollapser}>
        <CollapserExpandButton
          collapserId={collapserId}
          parentCollapserId={parentCollapserId}
          parentScrollerId={parentScrollerId}
          title={title}
        />
        <CommentBody text="Collapser controls state for all nested collapserItem children." />
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

SimpleCollapserFixed.defaultProps = {
  initialComments: 1,
  parentScrollerId: null,
  parentCollapserId: null,
};

SimpleCollapserFixed.propTypes = {
  collapserId: PropTypes.number.isRequired,
  parentScrollerId: PropTypes.number,
  parentCollapserId: PropTypes.number,
  initialComments: PropTypes.number
};

export default collapserIdentity(SimpleCollapserFixed);
