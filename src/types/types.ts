export enum ElementStates {
    Default = "default",
    Changing = "changing",
    Modified = "modified",
}
  
export type CircleElement = {
    value: string | number;
    state: ElementStates;
}

export type QueueCircleElement = CircleElement & {
    head: boolean;
    tail: boolean;
}

export enum Position {
    head = "head",
    tail = "tail",
}

export type ColumnElement = {
    value: number;
    state: ElementStates;
}

export enum Direction {
    Ascending = "ascending",
    Descending = "descending",
}

export enum SortingMethod {
    Selection = "Выбор",
    Bubble = "Пузырёк",
}