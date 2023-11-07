function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      )
    }
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function render(element, container) {
  const dom = element.type === "TEXT_ELEMENT"
    ? document.createTextNode(element.props.nodeValue)
    : document.createElement(element.type);
  
  const { children, ...otherProps } = element.props;
  Object.assign(dom, otherProps);

  // TODO: make concurrent
  children.forEach(child => render(child, dom));

  container.appendChild(dom);
}

// TODO: does react also use a global for this?
let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(nextUnitOfWork) {
  // TODO: do work
}

const Didact = {
  createElement,
  render,
}

const element = Didact.createElement(
  "div",
  { id: "foo" },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("b")
)

const container = document.getElementById("root");
Didact.render(element, container);

// const node = document.createElement(element.type);
// node["title"] = element.props.title;

// const text = document.createTextNode("");
// text["nodeValue"] = element.props.children;

// node.appendChild(text);
// container.appendChild(node);

console.log("hi");
