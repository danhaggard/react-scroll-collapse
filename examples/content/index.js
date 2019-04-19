import React from 'react';

import Scroller from '../../src';

import SimpleCollapser from '../components/SimpleCollapser';
import CommentThread from '../components/CommentThreadTest';
import Example from '../components/Example';

const COPY = {
  0: {
    title: 'Single Collapser',
    text: `A single collapser.  react-scroll-collapse provides methods and state
    to keep track of the expanded stateus of the child components`
  },
  1: {
    title: 'Multiple Collapsers',
    text: `You can use as many collapsers on a page as you like.  react-scroll-collapse
    will keep track of the state of each independently.`
  },
  2: {
    title: 'Nested Collapsers',
    text: `You can nest collapsers as well for a great threaded effect.  Nesting
    is tracked so that children can be controlled at any level of the tree.`
  },
  3: {
    title: 'Auto Scroll',
    text: `Embedd your collapsers in the Scroller Component for auto scrolling
    power!`
  },
  4: {
    title: 'Multiple Scrolling Components',
    text: `You can use multiple scrollers as well!
    State is tracked separately for each`
  },
  5: {
    title: 'Animation Delay',
    text: `You can pass an animationDelay prop
    (ms) for this fun effect!`
  },
  6: {
    title: 'Collapse All Children If Some Are Expanded',
    text: `The default behaviour of the expandCollapseAll function is to
    open any remaining children that are closed.  Use the collapseIfSomeExpanded
    prop to reverse this behaviour.`
  }
};

const example0 = (
  <Example {...COPY[0]} key={0} style={{}}>
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example1 = (
  <Example {...COPY[1]} key={1} style={{}}>
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example2 = (
  <Example {...COPY[2]} key={2} style={{}}>
    <CommentThread childThreads={3} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example3 = (
  <Example {...COPY[3]} key={3}>
    <Scroller style={{ height: '100%' }}>
      <SimpleCollapser initialComments={10} />
      <SimpleCollapser initialComments={10} />
    </Scroller>
  </Example>
);


const example4 = key => (
  <Example {...COPY[4]} style={{ marginBottom: '3em' }} key={key}>
    <Scroller style={{ height: '100%' }}>
      <CommentThread childThreads={3} />
    </Scroller>
  </Example>
);

const example5 = (
  <Example {...COPY[5]} key={5} style={{}}>
    <SimpleCollapser animationDelay={50} initialComments={20} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example6 = (
  <Example {...COPY[6]} key={6} style={{}}>
    <SimpleCollapser collapseIfSomeExpanded initialComments={5} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const examples = {
  0: [example0],
  1: [example1],
  2: [example2],
  3: [example3],
  4: [example4(4), example4(4.1)],
  5: [example5],
  6: [example6]
};

export default examples;
