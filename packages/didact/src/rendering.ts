import { globals } from "./globals";
import {
  FiberDom,
  FiberProps,
  FiberPropsKey,
  TextElement,
  ValidFiber,
  ValidHTMLElement,
} from "./types";

export function createElement<TElement extends ValidHTMLElement>(
  type: TElement,
  props: HTMLElementTagNameMap[TElement],
  ...children: Array<Element>
  // ...children: Array<Element<any, any>>
) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text: string): TextElement {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber: ValidFiber): HTMLElement | Text {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

function commitRoot() {
  globals.deletions.forEach(commitWork); // because the new tree doesn't have the nodes that need to be deleted
  commitWork(globals.wipRoot!.child); // calls itself recursively
  globals.currentRoot = globals.wipRoot;
  globals.wipRoot = null;
}

const isEvent = (key: string) => key.startsWith("on"); // lol
const isProperty = (key: string) => key !== "children" && !isEvent(key);
const isNew = (prev: FiberProps, next: FiberProps) => (key: FiberPropsKey) =>
  prev[key] !== next[key];
const isGone = (_prev: FiberProps, next: FiberProps) => (key: FiberPropsKey) =>
  !(key in next);

function updateDom(
  dom: NonNullable<FiberDom>,
  prevProps: FiberProps,
  nextProps: FiberProps
) {
  // remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });

  // remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  // set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
}

function commitWork(fiber: ValidFiber | undefined): void {
  if (!fiber) {
    return;
  }

  // go up until we find a parent with a dom node
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(
  fiber: ValidFiber | undefined,
  domParent: FiberDom
): void {
  if (!fiber) return; // TODO: would this ever happen?

  if (fiber?.dom) {
    domParent?.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

export function render(element: Element, container: HTMLElement): void {
  globals.wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: globals.currentRoot, // used to compare the old fiber tree to the new one
  };
  globals.deletions = [];
  globals.nextUnitOfWork = globals.wipRoot;
}

function workLoop(deadline: IdleDeadline): void {
  let shouldYield = false;
  while (globals.nextUnitOfWork && !shouldYield) {
    globals.nextUnitOfWork = performUnitOfWork(globals.nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1; // TODO: what is that function?
  }

  if (!globals.nextUnitOfWork && globals.wipRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);

function performUnitOfWork(fiber: ValidFiber): ValidFiber | null {
  const isFunctionComponent = fiber.type instanceof Function; // TODO: is this possible????
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // return next unit of work
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }

  return null;
}

function updateFunctionComponent(fiber: ValidFiber) {
  globals.wipFiber = fiber;
  globals.hookIndex = 0;
  globals.wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber<ValidHTMLElement>) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(wipFiber: Fiber<ValidHTMLElement>, elements): void {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling = null;

  while (index < elements.length || isNonNullish(oldFiber)) {
    const element = elements[index];
    let newFiber: Fiber<ValidHTMLElement> | null = null;

    const isSameType =
      isNonNullish(oldFiber) && element && element.type === oldFiber.type;
    oldFiber;
    // this is kinda naive and doesn't do key checking

    if (isSameType) {
      // update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber?.dom ?? null,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    if (element && !isSameType) {
      // add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !isSameType) {
      // delete the oldFiber's node
      oldFiber.effectTag = "DELETION";
      globals.deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // attach the new fibers
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function isNonNullish<T>(value: T): value is NonNullable<T> {
  return value != null;
}
