import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import Comment from '../Comment';

import { CollapserExpandButton } from '../ExpandButtonWrapped';
import { collapserIdentity } from '../../../src';

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

const DeleteThread = ({ childThreads, deleteThread }) => (
  childThreads === 0 ? <div /> : (
    <button onClick={deleteThread} type="button">
      Delete Thread
    </button>
  )
);

const AddToThread = ({ addToThread }) => (
  <button onClick={addToThread} type="button">
    Insert Thread
  </button>
);

const PureDeleteThread = React.memo(DeleteThread);
const PureAddToThread = React.memo(AddToThread);


const CommentWithButtons = ({
  addToThread,
  childThreads,
  deleteThread,
  text
}) => (
  <Comment
    addToThread={addToThread}
    childThreads={childThreads}
    deleteThread={deleteThread}
    text={text}
  >
    <PureDeleteThread childThreads={childThreads} deleteThread={deleteThread} />
    <PureAddToThread addToThread={addToThread} />
  </Comment>
);

const PureCommentWithButtons = React.memo(CommentWithButtons);

class CommentThread extends PureComponent {

  randText = genRandText();

  state = {
    childThreads: this.props.childThreads, // eslint-disable-line react/destructuring-assignment
  }

  addToThread = () => {
    const { childThreads } = this.state;
    this.setState({ childThreads: childThreads + 1 });
  }

  deleteThread = () => this.setState({ childThreads: 0 });

  render() {
    const { collapserId, parentCollapserId, parentScrollerId } = this.props;

    const { childThreads } = this.state;
    const idStr = collapserId.toString();
    const text = `${this.randText}`;
    const title = ` Collapser ${idStr}`;
    return (
      <div className={styles.commentThread}>
        <CollapserExpandButton
          collapserId={collapserId}
          parentCollapserId={parentCollapserId}
          parentScrollerId={parentScrollerId}
          title={title}
        />
        <PureCommentWithButtons
          addToThread={this.addToThread}
          childThreads={childThreads}
          deleteThread={this.deleteThread}
          text={text}
        />
        {getNested(childThreads)}
      </div>
    );
  }
}

CommentThread.defaultProps = {
  childThreads: 1,
  parentScrollerId: null,
  parentCollapserId: null,
};

CommentThread.propTypes = {
  collapserId: PropTypes.number.isRequired,
  parentScrollerId: PropTypes.number,
  parentCollapserId: PropTypes.number,
  childThreads: PropTypes.number
};

const WrappedCommentThread = collapserIdentity(CommentThread);
export default WrappedCommentThread;
