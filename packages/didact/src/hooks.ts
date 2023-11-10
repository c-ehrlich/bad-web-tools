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
