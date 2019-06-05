import React from 'react';

import Scroller from '../../src';

import SimpleCollapser from '../components/SimpleCollapserTest';
import EvenSimplerCollapser from '../components/EvenSimplerCollapser';

import SimpleComment from '../components/SimpleComment';
import CommentThread from '../components/CommentThreadFun';
import CommentThreadPerf from '../components/CommentThreadPerf';
import CommentThreadOrig from '../components/CommentThread';
import CommentThreadFlex from '../components/CommentThreadFlex';

import Example from '../components/Example';

import { getRandomTextWithDefaults } from '../../src/utils/randomUtils';

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
  },
  5: {
    title: 'A single collapser item',
    text: '',
  },
  6: {
    title: '',
    text: '',
  }
};

const example0 = (
  <Example {...COPY[0]} key={0} style={{}}>
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example1 = (
  <Example {...COPY[1]} key={0} style={{}}>
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example2 = (
  <Example {...COPY[2]} key={0} style={{}}>
    <CommentThread depth={3} style={{ margin: 0, overflow: 'auto' }} />
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
      <CommentThread depth={0} childNodes={1} />
    </Scroller>
  </Example>
);

const example5 = (
  <Example {...COPY[5]} style={{ marginBottom: '3em' }} key={5}>
    <EvenSimplerCollapser>
      <SimpleComment text={getRandomTextWithDefaults()} />
    </EvenSimplerCollapser>
    <EvenSimplerCollapser>
      <SimpleComment text={getRandomTextWithDefaults()} />
      <SimpleComment text={getRandomTextWithDefaults()} />
    </EvenSimplerCollapser>
  </Example>
);

const example6 = (
  <Example {...COPY[5]} style={{ marginBottom: '3em' }} key={5}>
    <Scroller style={{ height: '100%' }}>
      <CommentThread depth={0} childNodes={1} randomChildNodes />

    </Scroller>
  </Example>
);

const example7 = (
  <Example {...COPY[5]} style={{ marginBottom: '3em' }} key={5}>
    <CommentThread depth={0} childNodes={2}>
      <EvenSimplerCollapser>
        <EvenSimplerCollapser />
      </EvenSimplerCollapser>
      <EvenSimplerCollapser />
    </CommentThread>
  </Example>
);

const example8 = (
  <Example {...COPY[6]} style={{ marginBottom: '3em' }} key={5}>
    <Scroller style={{ height: '100%' }}>
      <CommentThread depth={0} childNodes={5} />
    </Scroller>
  </Example>
);


/*
export const generateCommentThreadData = (
  minChildrenArg,
  minDepthArg,
  maxChildren,
  maxDepth,
  allowRandom = true
)
*/

const generateThreadConfig = {
  minChildren: 2,
  minDepth: 2,
  maxChildren: 2,
  maxDepth: 2,
};

const generateThreadConfigChild = {
  minChildren: 1,
  minDepth: 1,
  maxChildren: 1,
  maxDepth: 1,
};

const someData = generateCommentThreadData(generateThreadConfig);
console.log('someData', someData);

const example9 = (
  <Example {...COPY[6]} style={{}} key={5}>
    <Scroller style={{ height: '100%' }}>
      <CommentThreadPerf
        key={someData.key}
        isOpenedInit={false}
        childIsOpenedInit={false}
        nodeData={someData}
        activeChildLimit={1}
        {...generateThreadConfigChild}
        />
    </Scroller>
  </Example>
);

const example10 = (
  <Example {...COPY[6]} style={{ marginBottom: '3em' }} key={5}>
    <Scroller style={{ height: '100%' }}>
      <CommentThreadOrig childThreads={2} />
    </Scroller>
  </Example>
);

const style = { height: '100%' };
const example11 = (
  <Example showHeader={false} {...COPY[6]} style={{}} key={5}>

    <Scroller style={style}>
      <CommentThreadFlex
        key={someData.key}
        childInsertionIndex={0}
        isOpenedInit={true}
        childIsOpenedInit={true}
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
  4: [example4(4), example4(5)]
};
*/


const examples = {
  0: example11,
};

export default examples;
