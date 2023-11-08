import { createElement, render } from "./src/rendering.mjs";
import { useState } from "./src/hooks.mjs";

const Didact = {
  createElement,
  render,
  useState,
  greet: () => console.log("hello world"),
};

export default Didact;
