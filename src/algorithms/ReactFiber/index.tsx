import { useState } from 'react';
import createUseStyles from './ReactFiber.style';

interface Node {
  name: string;
  render: () => Node[];
}

const Root: Node = { name: 'App', render: () => [] };
const A: Node = { name: ' Is', render: () => [] };
const B: Node = { name: ' Set', render: () => [] };
const C1: Node = { name: 'Rendering', render: () => [] };
const C2: Node = { name: ' Ready', render: () => [] };
const E: Node = { name: ' !', render: () => [] };
const G: Node = { name: ' Go', render: () => [] };

Root.render = () => [A, B];
A.render = () => [C1, C2];
C1.render = () => [E];
C2.render = () => [];
E.render = () => [];
B.render = () => [G];
G.render = () => [];

function sleep(n: number): void {
  const start = +new Date();
  while (true) if (+new Date() - start > n) break;
}

function App() {
  const classes = createUseStyles();
  const [nodes, setNodes] = useState<string[]>([]);
  const [clicked, setClicked] = useState<boolean>(false);

  /**
   * The stack way
   */
  let stack: string[] = [];
  function stackWork(o: Node): void {
    stack = stack.concat(o.name);
  }

  function stackReconcile(instance: Node): void {
    stackWork(instance);
    sleep(500);
    const children = instance.render();
    children.forEach(stackReconcile);
  }

  function clickStack(): void {
    setClicked(true);
    let tempStack: string[] = [];
    stack = tempStack;
    stackReconcile(Root);
    setNodes(stack); // Only set nodes once at the end
  }

  /**
   * The Fiber way
   */

  // Fiber node
  let node: ReactFiber;
  let root: ReactFiber;
  let done = false;

  class ReactFiber {
    instance: Node;
    child: ReactFiber | null;
    sibling: ReactFiber | null;
    return: ReactFiber | null;

    constructor(instance: Node) {
      this.instance = instance;
      this.child = null;
      this.sibling = null;
      this.return = null;
    }
  }

  // link Fiber graph
  function link(
    parent: ReactFiber,
    children: Node[] | null
  ): ReactFiber | null {
    if (children === null) {
      // eslint-disable-next-line no-param-reassign
      children = [];
    }

    parent.child = children.reduceRight(
      (previous: ReactFiber | null, current: Node) => {
        const node = new ReactFiber(current);
        node.return = parent;
        node.sibling = previous;
        return node;
      },
      null
    );

    return parent.child;
  }

  // build the Fiber
  function fiberWork(node: ReactFiber): ReactFiber | null {
    const newStack = [...stack, node.instance.name];
    setNodes(newStack); // Update nodes immediately for each step
    stack = newStack;
    const children = node.instance.render();
    return link(node, children);
  }

  function fiberWalk(): void {
    if (done) return;
    let child = fiberWork(node);

    if (child) {
      node = child;
      return;
    }

    if (node === root) {
      return;
    }

    while (!node.sibling) {
      if (!node.return || node.return === root) {
        done = true;
        return;
      }
      node = node.return;
    }

    node = node.sibling;
  }

  function fiberController(): void {
    const walk = () => {
      if (!done) {
        fiberWalk();
        setTimeout(walk, 500);
      }
    };
    walk();
  }

  function clickFiber(): void {
    setClicked(true);
    stack = [];
    done = false;
    const hostNode = new ReactFiber(Root);
    root = hostNode;
    node = root;
    fiberController();
  }

  function reset(): void {
    setNodes([]);
    setClicked(false);
    stack = [];
    done = false;
  }

  return (
    <div className={classes.app}>
      <div className={classes.playgroundContainer}>
        <div className={classes.controlPanel}>
          <h3 className={classes.h3}>Controls</h3>
          <button
            className={classes.button}
            onClick={clickStack}
            disabled={clicked}
          >
            Run Old Reconcilor (❌Laggy)
          </button>
          <button
            className={classes.button}
            onClick={clickFiber}
            disabled={clicked}
          >
            Run Fiber Reconcilor (✅Smooth)
          </button>
          <button
            className={classes.button}
            onClick={reset}
            disabled={!clicked}
          >
            Reset
          </button>
        </div>
        <div className={classes.previewPanel}>
          <h3 className={classes.h3}>Preview</h3>
          <div className={classes.nodesContainer}>
            {nodes.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
