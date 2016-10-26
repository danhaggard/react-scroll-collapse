import React, {PropTypes, Component} from 'react';
import styles from './SimpleCollapser.scss';

import SimpleComment from './../SimpleComment';
import CommentTitle from './../CommentTitle';
import {collapserController} from '../../../src';
import {genRandText} from './../../utils';


class SimpleCollapser extends Component {

  constructor(props) {
    super(props);
    const comments = Array.apply(null, Array(5)).map(() => genRandText());
    this.state = {
      comments,
    };
  }

  handleClick(comments) {
    this.setState({
      comments: [...comments, genRandText()]
    });
  }

  render() {
    const {expandCollapseAll, areAllItemsExpanded, collapserId} = this.props;
    const title = ` Collapser ${collapserId.toString()}`;
    return (
      <div className={styles.simpleCollapser}>
        <div onClick={expandCollapseAll}>
          <CommentTitle title={title} isOpened={areAllItemsExpanded} />
        </div>
        {this.state.comments.map((text, index) =>
          <SimpleComment
            key={index}
            text={text}
          />
        )}
        <button onClick={() => this.handleClick(this.state.comments)}>
          Add Comment
        </button>
      </div>
    );
  }
}

SimpleCollapser.propTypes = {
  areAllItemsExpanded: PropTypes.bool,
  collapserId: PropTypes.number,
  expandCollapseAll: PropTypes.func,
};

export default collapserController(SimpleCollapser);
