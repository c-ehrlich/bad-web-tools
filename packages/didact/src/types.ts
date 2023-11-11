export type ValidHTMLElement = keyof HTMLElementTagNameMap;
// TODO: is it more work to have this nullable or not nullable?
export type ElementProps<TElement extends ValidHTMLElement> = Partial<
  HTMLElementTagNameMap[TElement]
> | null;

export type FiberDom = HTMLElement | Text | null; // TODO: is this right?
export type Fiber<TElement extends ValidHTMLElement> =
  // TODO: figure out why having the TEXT_ELEMENT type in here breaks it
  (
    | {
        type: Function;
        props: Record<string, any>;
        dom: FiberDom;
      }
    | {
        type: TElement;
        props: ElementProps<TElement>;
        dom: FiberDom;
      }
  ) & {
    parent: Fiber<ValidHTMLElement>; // TODO: does the root have a parent?
    child?: Fiber<ValidHTMLElement>; // TODO: can a text element have children?
    sibling?: Fiber<ValidHTMLElement>;
    alternate?: Fiber<ValidHTMLElement>;
    effectTag?: "PLACEMENT" | "UPDATE" | "DELETION";
    hooks: Array<UseStateHook<any>>;
  };

export type ValidFiber = Fiber<ValidHTMLElement>;
export type FiberProps = ValidFiber["props"] | Record<string, any> | null;
export type NonNullableFiberProps = NonNullable<FiberProps>;
export type FiberPropsKey = keyof FiberProps;

export type TextElement = {
  type: "TEXT_ELEMENT";
  props: {
    nodeValue: string;
    children: [];
  };
};

export type InitialState<TState> = TState | (() => TState);
export type SetStateAction<TState> = TState | ((prevState: TState) => TState);
export type Dispatch<TValue> = (value: TValue) => void;
export type UseStateReturn<TState> = [TState, Dispatch<SetStateAction<TState>>];

export type UseStateHook<TState> = {
  state: TState;
  queue: Array<SetStateAction<TState>>;
};

// Define a utility type to filter keys that start with 'on' from a given type T
type EventHandlerKeys<T> = {
  [K in keyof T]: K extends `on${infer _}` ? K : never;
}[keyof T];

// Create a type with all the 'on' event keys from GlobalEventHandlers
export type GlobalOnEventHandlers = NonNullable<
  EventHandlerKeys<GlobalEventHandlers>
>;

// Now, create a map type that has all the event handlers with their respective event types
type OnEventHandlersMap = Pick<
  GlobalEventHandlers,
  NonNullable<GlobalOnEventHandlers>
>;
