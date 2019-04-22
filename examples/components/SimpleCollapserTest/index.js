import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleCollapser.scss';

import ButtonGroup from '../Button/ButtonGroup/ButtonGroupSmall';
import CommentBody from '../CommentBody';
import ExpandButton from '../ExpandButton';
import SimpleComment from '../SimpleComment';
import { collapserController } from '../../../src';
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
    const {
      areAllItemsExpanded,
      expandCollapseAll,
      collapserRef,
      collapserId,
      parentCollapserId,
      parentScrollerId,
      style
    } = this.props;
    const { comments } = this.state;
    const title = ` Collapser ${collapserId.toString()}`;
    return (
      <div className={styles.simpleCollapser} ref={collapserRef} style={style}>
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onClick={expandCollapseAll}
          title={title}
        />
        <CommentBody text="Collapser controls state for all nested collapserItem children." />
        {comments.map(comment => <SimpleComment {...comment} />)}
        <ButtonGroup
          leftClick={this.addComment}
          rightClick={this.removeComment}
          leftText="Add Comment"
          rightText="Remove Comment"
          small
        />
      </div>
    );
  }
}

SimpleCollapserFixed.defaultProps = {
  initialComments: 1,
  parentScrollerId: null,
  parentCollapserId: null,
  style: {},
};

SimpleCollapserFixed.propTypes = {
  collapserId: PropTypes.number.isRequired,
  initialComments: PropTypes.number,
  parentCollapserId: PropTypes.number,
  parentScrollerId: PropTypes.number,
  style: PropTypes.object,
};

export default collapserController(SimpleCollapserFixed);
