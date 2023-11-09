let currentRoot = null; // the last fiber tree we committed to the DOM
let deletions = null;
let nextUnitOfWork = null;
let wipRoot = null; // used while building a new fiber tree

let hookIndex = null;
let wipFiber = null;

export const globals = {
  currentRoot,
  deletions,
  hookIndex,
  nextUnitOfWork,
  wipFiber,
  wipRoot,
};

export function resetGlobals() {
  globals.currentRoot = null;
  globals.deletions = null;
  globals.hookIndex = null;
  globals.nextUnitOfWork = null;
  globals.wipFiber = null;
  globals.wipRoot = null;
}
