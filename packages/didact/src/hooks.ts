import { globals } from "./globals";

type InitialState<TState> = TState | (() => TState);
type SetStateAction<TState> = TState | ((prevState: TState) => TState);
type Dispatch<TValue> = (value: TValue) => void;
type UseStateReturn<TState> = [TState, Dispatch<SetStateAction<TState>>];

export function useState<T>(initial: InitialState<T>): UseStateReturn<T> {
  const oldHook = globals.wipFiber.alternate?.hooks?.[globals.hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook?.queue ?? [];
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
