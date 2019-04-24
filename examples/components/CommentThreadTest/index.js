import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { ofNumberTypeOrNothing, ofBoolTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import { genRandText, getRandomInt } from '../../utils';


class GetNested extends PureComponent {

  getNextNodeCount = () => { // eslint-disable-line react/sort-comp
    const { childNodes, randomChildNodes } = this.props;
    const randomVal = getRandomInt(1, childNodes);
    return randomChildNodes ? randomVal : childNodes;
  }

  currentChildNodes = this.getNextNodeCount();

  nextChildNodes = this.getNextNodeCount();

  render() {
    const {
      depth,
      childNodes,
      randomChildNodes,
      rootDepth
    } = this.props;
    return (
      depth === 0 ? null
        : [...Array(childNodes).keys()].map(
          node => (
            <WrappedCommentThread
              key={`row: ${depth + 1} - node: ${node}`}
              childNodes={this.currentChildNodes}
              depth={depth - 1}
              rootDepth={rootDepth}
              title={`depth: ${rootDepth - depth + 1} - branch: ${node}`}
            >
              <GetNested
                depth={depth - 1}
                childNodes={this.currentChildNodes}
                randomChildNodes={randomChildNodes}
                rootDepth={rootDepth}
              />
            </WrappedCommentThread>
          )
        )
    );
  }
}

GetNested.defaultProps = {
  depth: 1,
  childNodes: 1,
  randomChildNodes: true,
  rootDepth: null,
};

GetNested.propTypes = {
  depth: PropTypes.number,
  childNodes: PropTypes.number,
  randomChildNodes: PropTypes.bool,
  rootDepth: ofNumberTypeOrNothing,

};


class CommentThread extends PureComponent { // eslint-disable-line react/no-multi-comp

  randText = genRandText();

  state = { depth: this.props.depth }

  addToThread = () => {
    const { depth } = this.state;
    this.setState({ depth: depth + 1 });
  }

  deleteThread = () => this.setState({ depth: 0 });

  render() {
    const {
      areAllItemsExpanded,
      expandCollapseAll,
      collapserRef,
      collapserId,
      childNodes,
      randomChildNodes,
      rootDepth,
      style,
      title,
    } = this.props;
    const { depth } = this.state;
    const idStr = collapserId.toString();
    const text = `${this.randText}`;
    const newTitle = ` Collapser ${idStr} -- ${title || 'row: 0 - node: 0'}`;
    return (
      <div ref={collapserRef} className={styles.commentThread} style={style}>
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onClick={expandCollapseAll}
          title={newTitle}
        />
        <CommentWithButtons
          addToThread={this.addToThread}
          childThreads={depth}
          deleteThread={this.deleteThread}
          text={text}
        />
        <GetNested
          depth={depth}
          childNodes={childNodes}
          randomChildNodes={true}
          rootDepth={rootDepth || depth}
        />
      </div>
    );
  }
}

CommentThread.defaultProps = {
  depth: 1,
  childNodes: 1,
  areAllItemsExpanded: null,
  randomChildNodes: false,
  rootDepth: null,
  style: {},
  title: ''
};

CommentThread.propTypes = {
  depth: PropTypes.number,
  childNodes: PropTypes.number,
  title: PropTypes.string,
  collapserId: PropTypes.number.isRequired,
  areAllItemsExpanded: ofBoolTypeOrNothing,
  expandCollapseAll: PropTypes.func.isRequired,
  collapserRef: PropTypes.object.isRequired,
  randomChildNodes: PropTypes.bool,
  rootDepth: ofNumberTypeOrNothing,
  style: PropTypes.object,
};

const WrappedCommentThread = collapserController(CommentThread);
export default WrappedCommentThread;
