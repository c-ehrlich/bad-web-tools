import { globals } from "./globals";
import {
  InitialState,
  SetStateAction,
  UseStateHook,
  UseStateReturn,
} from "./types";

export function useState<TState>(
  initial: InitialState<TState>
): UseStateReturn<TState> {
  const oldHook = globals.wipFiber?.alternate?.hooks?.[globals.hookIndex];
  const hook: UseStateHook<TState> = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook?.queue ?? [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action: SetStateAction<TState>) => {
    hook.queue.push(action);
    globals.wipRoot = {
      ...globals.currentRoot!,
      alternate: globals.currentRoot!,
    };
    globals.nextUnitOfWork = globals.wipRoot;
    globals.deletions = [];
  };

  globals.wipFiber!.hooks.push(hook);
  globals.hookIndex++;
  return [hook.state, setState];
}

export function useEffect(
  fn: () => void | (() => void),
  deps: Array<any> // TODO: make this good
) {
  // run mount
  // if deps changed, run unmount, then run mount
  // run unmount on unmount
  // we need to somehow build a list of mount and unmount functions for each fiber
  // use globals.hooks? or fiber.hooks?
}
