import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { ofNumberTypeOrNothing, ofBoolTypeOrNothing, ofChildrenType } from '../../../src/utils/propTypeHelpers';
import { getRandomInt, getRandomTextWithDefaults } from '../../../src/utils/randomUtils';


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
      childNodes,
      depth,
      randomChildNodes,
      rootDepth
    } = this.props;
    return (
      depth === 0 ? null
        : [...Array(childNodes).keys()].map(
          node => (
            <WrappedCommentThread
              key={node}
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

  randText = getRandomTextWithDefaults();

  animations = {
    // 0: 'animate-linear',
    0: 'animate-ease',
    1: 'animate-ease-in',
    2: 'animate-ease-out',
    3: 'animate-ease-out',
  }

  state = {
    className: styles.commentThread,
    depth: this.props.depth,
    animation: 2,
  }

  addToThread = () => {
    const { depth } = this.state;
    this.setState({ depth: depth + 1 });
  }

  deleteThread = () => this.setState({ depth: 0 });

  componentDidMount() {
    //setTimeout(this.addToThread, 30);
  }

  render() {
    const {
      areAllItemsExpanded,
      isRootNode,
      children,
      expandCollapseAll,
      collapserRef,
      collapserId,
      childNodes,
      randomChildNodes,
      rootDepth,
      style,
      title,
    } = this.props;
    const {
      animation,
      className,
      depth,
    } = this.state;

    const idStr = collapserId.toString();
    const text = `${this.randText}`;
    const newTitle = ` Collapser ${idStr} -- ${title || 'row: 0 - node: 0'}`;
    return (
      <div ref={collapserRef} className={`${className} ${this.animations[animation]} ${!isRootNode && styles.hover}`} style={{ ...style }}>
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onClick={expandCollapseAll}
          title={newTitle}
        />
        <CommentWithButtons
          isOpenedInit={false}
          addToThread={this.addToThread}
          childThreads={depth}
          deleteThread={this.deleteThread}
          text={text}
        />
        { children }
        {
          collapserId <= 500 && (
            <GetNested
              depth={depth}
              childNodes={childNodes}
              randomChildNodes={randomChildNodes}
              rootDepth={rootDepth || depth}
            />
          )
        }
      </div>
    );
  }
}

CommentThread.defaultProps = {
  children: [],
  depth: 1,
  childNodes: 1,
  areAllItemsExpanded: null,
  randomChildNodes: false,
  rootDepth: null,
  style: {},
  title: ''
};

CommentThread.propTypes = {
  children: ofChildrenType,
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
