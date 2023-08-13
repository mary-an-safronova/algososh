import { CircleElement } from "../../types/types";

interface IStack<T> {
    push: (item: T) => void;
    pop: () => void;
    peak: () => T | null;
    getSize: () => number;
    getElements: () => T[];
    clear: () => T[];
  }
  
  export class Stack<T> implements IStack<T> {
    private container: T[] = [];
  
    push = (item: T): void => {
      this.container.push(item);
    };
  
    pop = (): void => {
      if (this.container.length > 0) {
        this.container.pop();
      }
    };

    getSize = () => this.container.length;
  
    peak = (): T | null => {
      if (this.getSize() > 0) {
        return this.container[this.getSize() - 1];
      } else {
        return null;
      }
    };

    getElements = () => this.container;

    clear = () => (this.container = []);
  }

  export const stack = new Stack<CircleElement>();