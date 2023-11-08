import { globals } from "./globals.mjs";

/**
 * Represents the initializer for state, which can be a value or a function that returns a value.
 * @template TState The type of the state.
 * @typedef {TState | (() => TState)} InitialState
 */

/**
 * Represents the action to set the state, which can be a value or a function that receives the previous state and returns the new state.
 * @template TState The type of the state.
 * @typedef {TState | ((prevState: TState) => TState)} SetStateAction
 */

/**
 * Represents the dispatch function to invoke state changes.
 * @template TValue The type of the value accepted by the dispatch function.
 * @typedef {(value: TValue) => void} Dispatch
 */

/**
 * Hook for managing state in functional components.
 * @template TState The state type.
 * @param {InitialState<TState>} initial The initial state value or function returning the initial state.
 * @returns {[TState, Dispatch<SetStateAction<TState>>]} Tuple containing the current state and a function to update it.
 */

/**
 * Hook for state management in functional components.
 * @template TState The type of the state.
 * @param {TState} initial The initial value of the state.
 * @returns {[TState, (arg: TState) => void]} A stateful value, and a function to update it.
 */
export function useState(initial) {
  const oldHook =
    globals.wipFiber.alternate &&
    globals.wipFiber.alternate.hooks &&
    globals.wipFiber.alternate.hooks[globals.hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    globals.wipRoot = {
      dom: globals.currentRoot.dom,
      props: globals.currentRoot.props,
      alternate: globals.currentRoot,
    };
    globals.nextUnitOfWork = globals.wipRoot;
    globals.deletions = [];
  };

  globals.wipFiber.hooks.push(hook);
  globals.hookIndex++;
  return [hook.state, setState];
}
