import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import { CollapserExpandButton } from '../ExpandButtonWrapped';
import { collapserIdentity } from '../../../src';

import { getRandomTextWithDefaults } from '../../../src/utils/randomUtils';


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

class CommentThread extends PureComponent {

  randText = getRandomTextWithDefaults();

  state = {
    childThreads: this.props.childThreads, // eslint-disable-line react/destructuring-assignment
  }

  addToThread = () => {
    const { childThreads } = this.state;
    this.setState({ childThreads: childThreads + 1 });
  }

  deleteThread = () => this.setState({ childThreads: 0 });

  render() {
    const {
      collapserId,
      parentCollapserId,
      parentScrollerId,
      style
    } = this.props;
    const { childThreads } = this.state;
    const idStr = collapserId.toString();
    const text = `${this.randText}`;
    const title = ` Collapser ${idStr}`;
    return (
      <div className={styles.commentThread} style={style}>
        <CollapserExpandButton
          collapserId={collapserId}
          parentCollapserId={parentCollapserId}
          parentScrollerId={parentScrollerId}
          title={title}
        />
        <CommentWithButtons
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
  parentCollapserId: null,
  parentScrollerId: null,
  style: {},
};

CommentThread.propTypes = {
  childThreads: PropTypes.number,
  collapserId: PropTypes.number.isRequired,
  parentCollapserId: PropTypes.number,
  parentScrollerId: PropTypes.number,
  style: PropTypes.object,
};

const WrappedCommentThread = collapserIdentity(CommentThread);
export default WrappedCommentThread;
