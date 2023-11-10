import { ValidFiber } from "./types";

class Globals {
  currentRoot: ValidFiber | null; // the last fiber tree we committed to the DOM
  deletions: Array<ValidFiber>;
  hookIndex = 0;
  nextUnitOfWork: ValidFiber | null;
  wipRoot: ValidFiber | null; // used while building a new fiber tree
  wipFiber: ValidFiber | null;

  constructor() {
    this.currentRoot = null;
    this.deletions = [];
    this.hookIndex = 0;
    this.nextUnitOfWork = null;
    this.wipFiber = null;
    this.wipRoot = null;
  }
}

export const globals = new Globals();
