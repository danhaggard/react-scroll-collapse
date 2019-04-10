import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleCollapser.scss';

import ExpanderButton from '../ExpandButton';
import SimpleComment from '../SimpleComment';
import { collapserController } from '../../../src';
import { genRandText } from '../../utils';


class SimpleCollapser extends Component {

  state = {
    comments: [...Array(5).keys()].map(key => ({
      key,
      text: genRandText()
    }))
  }

  addComment(comments) {
    this.setState({
      comments: [...comments, genRandText()]
    });
  }

  removeComment(comments) {
    this.setState({
      comments: comments.slice(0, comments.length - 1)
    });
  }

  render() {
    const { expandCollapseAll, areAllItemsExpanded, collapserId } = this.props;
    const { comments } = this.state;
    const title = ` Collapser ${collapserId.toString()}`;
    return (
      <div className={styles.simpleCollapser}>
        <ExpanderButton
          isOpened={areAllItemsExpanded}
          onClick={expandCollapseAll}
          title={title}
        />
        {comments.map(comment => <SimpleComment {...comment} />)}
        <button onClick={() => this.addComment(comments)} type="button">
          Add Comment
        </button>
        <button onClick={() => this.removeComment(comments)} type="button">
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
};

export default collapserController(SimpleCollapser);
