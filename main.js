import Didact from "./didact/index.mjs";

function App(props) {
  return Didact.createElement(
    "div",
    null,
    Didact.createElement("h1", null, `Hello ${props.name}`, "!!"),
    Didact.createElement(Counter, null)
  );
}
function Counter() {
  const [count, setCount] = Didact.useState(1);
  return Didact.createElement(
    "button",
    { onClick: () => setCount((c) => c + 1) },
    `Count: ${count ?? 69}`
  );
}

const element = Didact.createElement(App, { name: "foo" });

const container = document.getElementById("root");
Didact.render(element, container);
