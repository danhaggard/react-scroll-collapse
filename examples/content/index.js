import React from 'react';

import Scroller from '../../src';
import SimpleCollapser from '../components/SimpleCollapser';
import CommentThread from '../components/CommentThread';
import CommentThreadFlex from '../components/CommentThreadFlex';
import CommentThreadGrid from '../components/CommentThreadGrid';

import Example from '../components/Example';

import { generateCommentThreadData } from '../../src/utils/randomContentGenerators';

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
  }
};

const example0 = (
  <Example {...COPY[0]} key={0} style={{}}>
    <SimpleCollapser
      isOpenedInit
      initialComments={6}
      style={{ margin: 0, overflow: 'auto' }}
    />
  </Example>
);

const example1 = (
  <Example {...COPY[1]} key={0} style={{}}>
    <SimpleCollapser isOpenedInit initialComments={6} style={{ maxHeight: '20em', margin: '1em', overflow: 'auto' }} />
    <SimpleCollapser isOpenedInit initialComments={6} style={{ margin: 0, maxHeight: '20em', overflow: 'auto' }} />
  </Example>
);

const example2 = (
  <Example {...COPY[2]} key={0} style={{}}>
    <Scroller style={{ height: '100%' }}>
      <CommentThread
        depth={1}
        childThreads={1}
        isOpenedInit
        childIsOpenedInit
        style={{ margin: 0, overflow: 'auto' }}
      />
    </Scroller>
  </Example>
);

const example3 = (
  <Example {...COPY[3]} key={3}>
    <Scroller style={{ height: '100%' }}>
      <SimpleCollapser isOpenedInit childIsOpenedInit initialComments={10} />
    </Scroller>
  </Example>
);


const example4 = key => (
  <Example {...COPY[4]} style={{ marginBottom: '3em' }} key={key}>
    <Scroller style={{ height: '100%' }}>
      <CommentThread isOpenedInit childIsOpenedInit depth={0} childNodes={1} />
    </Scroller>
  </Example>
);


const generateThreadConfig = {
  minChildren: 3,
  minDepth: 3,
  maxChildren: 3,
  maxDepth: 3,
};

const generateThreadConfigChild = {
  minChildren: 1,
  minDepth: 1,
  maxChildren: 1,
  maxDepth: 1,
};

const someData = generateCommentThreadData(generateThreadConfig);

const style = { height: '100%' };
const example5 = (
  <Example showHeader={false} {...COPY[4]} style={{}} key={5}>
    <Scroller style={style}>
      <CommentThreadFlex
        key={someData.key}
        childInsertionIndex={0}
        isOpenedInit
        childIsOpenedInit
        nodeData={someData}
        setActiveChildLimit={1}
        {...generateThreadConfigChild}
        />
    </Scroller>
  </Example>
);

const example6 = (
  <Example showHeader={false} {...COPY[4]} style={{}} key={5}>
    <Scroller style={style}>
      <CommentThreadGrid
        key={someData.key}
        childInsertionIndex={0}
        isOpenedInit
        childIsOpenedInit
        nodeData={someData}
        setActiveChildLimit={1}
        {...generateThreadConfigChild}
        />
    </Scroller>
  </Example>
);

/*
const examples = {
  0: [example0],
  1: [example1],
  2: [example2],
  3: [example3],
  4: [example4(4), example4(5)],
  5: [example5],
};
*/


const examples = {
  // 0: [example0],
  // 1: [example1],
  0: [example5],
  // 3: [example3],
  // 4: [example4(4), example4(5)],
// 5: [example5],
};


export default examples;
