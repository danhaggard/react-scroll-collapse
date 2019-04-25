import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentThread.scss';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';

import { collapserController } from '../../../src';
import { ofNumberTypeOrNothing, ofBoolTypeOrNothing, ofChildrenType } from '../../../src/utils/propTypeHelpers';
import { genRandText, getRandomInt } from '../../utils';
import makeColorGradient from '../../../src/utils/color';

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

  animations = {
    0: 'animate-linear',
    1: 'animate-ease-in',
    2: 'animate-ease-out',
    3: 'animate-ease',
  }

  state = {
    className: styles.commentThread,
    depth: this.props.depth,
    direction: true,
    toggle: false,
    yMin: 165,
    yMax: 435,
    xMin: 100,
    xMax: 1829,
    xCurr: 0, // this.props.collapserId * 2
    animation: 0,
  }

  addToThread = () => {
    const { depth } = this.state;
    this.setState({ depth: depth + 1 });
  }

  colorGradient = makeColorGradient(0.0027, 0.0027, 0.0027, 0, 2, 4, 128, 127,
    this.state.xMax - this.state.xMin);

  deleteThread = () => this.setState({ depth: 0 });

  getSetInterval = () => setInterval(() => {
    //console.log('xcurr:', this.state.xCurr);
    this.setState(
      ({ xCurr }) => ({ xCurr: xCurr > 1810 ? 0 : xCurr + getRandomInt(0, 30) })
    );
  }, 16)

  getAnimationInterval = () => setInterval(() => {
    //console.log('xcurr:', this.state.xCurr);
    this.setState(
      ({ animation }) => ({ animation: animation === 3 ? 0 : animation + 1 })
    );
  }, 5000)

  getDepthInterval = () => setInterval(() => {
    //console.log('xcurr:', this.state.xCurr);
    this.setState(
      ({ depth, direction }) => ({
        depth: direction ? depth + 1 : depth - 1,
        direction: (depth < 5 && true) || (depth === 0 && false),
      })
    );
  }, )

  setTimer = () => (this.interval = this.getSetInterval());

  setDepthTimer = () => (this.depthInterval = this.getDepthInterval());

  setAnimationTimer = () => (this.animationInterval = this.getAnimationInterval());

  componentDidMount() {
    // setTimeout(this.setTimer(), getRandomInt(0, 2000));
    setTimeout(this.setDepthTimer(), 300);
    setTimeout(this.setAnimationTimer(), 300);
    setTimeout(() => clearInterval(this.depthInterval), 300);
  }

  componentWillUnmount() {
    //clearInterval(this.interval);
    clearInterval(this.depthInterval);
    clearInterval(this.animationInterval);

  }

/*
  componentDidMount() {
    setInterval(() => {
      this.setState(
        prev => {
          console.log('prev', prev);
          return {
            toggle: !prev.toggle,
            className: `${styles.commentThread} ${this.state.toggle && 'animate'}`
          }
        }
      );
    }, getRandomInt(1000, 3000));
  }
*/
  render() {
    const {
      areAllItemsExpanded,
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
    const { className, depth, xMin, xCurr } = this.state;
    const cleanX = xCurr;
    let rgbIndex = cleanX - xMin - (cleanX > xMin ? 1 : 0);
    rgbIndex = rgbIndex < xMin ? 0 : rgbIndex;
    const rgb = this.colorGradient[rgbIndex];

    const backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    const idStr = collapserId.toString();
    const text = `${this.randText}`;
    const newTitle = ` Collapser ${idStr} -- ${title || 'row: 0 - node: 0'}`;
    const newDepth = depth === 0 ? depth : depth >= 1 ? 1 : depth;
    return (
      <div ref={collapserRef} className={`${className} ${this.animations[this.state.animation]}`} style={{ ...style }}>
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
        { children }
        {
          /*
          <GetNested
            depth={depth}
            childNodes={childNodes}
            randomChildNodes={randomChildNodes}
            rootDepth={rootDepth || depth}
          />
          */
        }
        {
          collapserId < 85 && (
            <GetNested
              depth={newDepth}
              childNodes={childNodes}
              randomChildNodes={randomChildNodes}
              rootDepth=""
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
