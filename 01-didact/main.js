console.log("hi");

const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}

const container = document.getElementById("root");

// element: React element
// node: DOM element

const node = document.createElement(element.type);
node["title"] = element.props.title;

// https://developer.mozilla.org/en-US/docs/Web/API/Node
// using textNode instead of setting innerText lets us treat all elements in the same way later
const text = document.createTextNode("");
text["nodeValue"] = element.props.children

node.appendChild(text);
container.appendChild(node);