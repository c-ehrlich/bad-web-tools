export type ValidHTMLElement = keyof HTMLElementTagNameMap;

export type FiberDom = HTMLElement | Text | null; // TODO: is this right?
export type Fiber<TElement extends ValidHTMLElement> = {
  type: TElement;
  props: HTMLElementTagNameMap[TElement]; // TODO: this doesn't seem to have the HTML element's props on it
  dom: FiberDom;
} & //       nodeValue: string; //     props: { //     type: "TEXT_ELEMENT"; // | {
//       children: [];
//     };
//     dom: Text; // TODO: is this right?
//   }
// TODO: figure out why having the TEXT_ELEMENT type in here breaks it
{
  parent: Fiber<ValidHTMLElement>; // TODO: does the root have a parent?
  child?: Fiber<ValidHTMLElement>; // TODO: can a text element have children?
  sibling?: Fiber<ValidHTMLElement>;
  alternate?: Fiber<ValidHTMLElement>;
  effectTag?: "PLACEMENT" | "UPDATE" | "DELETION";
  hooks: Array<UseStateHook<any>>;
};
export type ValidFiber = Fiber<ValidHTMLElement>;
export type FiberProps = NonNullable<ValidFiber["props"]>;
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
