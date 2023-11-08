import { globals } from "./globals.mjs"

export function useState(initial) {
  const oldHook =
    globals.wipFiber.alternate &&
    globals.wipFiber.alternate.hooks &&
    globals.wipFiber.alternate.hooks[globals.hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = action => {
    hook.queue.push(action)
    globals.wipRoot = {
      dom: globals.currentRoot.dom,
      props: globals.currentRoot.props,
      alternate: globals.currentRoot,
    }
    globals.nextUnitOfWork = globals.wipRoot;
    globals.deletions = [];
  }

  globals.wipFiber.hooks.push(hook);
  globals.hookIndex++;
  return [hook.state, setState];
}