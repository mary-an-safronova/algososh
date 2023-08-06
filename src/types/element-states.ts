export enum ElementStates {
  Default = "default",
  Changing = "changing",
  Modified = "modified",
}

export type CircleElement = {
  value: string | number;
  state: ElementStates;
};
