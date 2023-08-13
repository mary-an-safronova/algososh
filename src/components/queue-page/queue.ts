export interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  isEmpty: () => boolean;
  getHead: () => { index: number; value: T | null; } | null;
  getTail: () => { index: number; value: T | null; } | null;
  getSize: () => number;
  getElements: () => Array<T | null>;
  clear:  () => void;
}
  
export class Queue<T> implements IQueue<T> {
  container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }
  
  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    }
    this.container[this.tail % this.size] = item;
    this.tail++;
    this.length++;
  };
  
  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }

    this.container[this.head] = null;
    this.head++;
    this.length--;
  };

  peak = (): T | null => {
    if (this.getSize() > 0) {
      return this.container[this.getSize() - 1];
    } else {
      return null;
    }
  };

  isEmpty = () => this.length === 0;

  getHead() {
    if (!this.isEmpty()) {
      return {
        index: this.head,
        value: this.container[this.head],
      };
    }
    return null;
  }

  getTail() {
    if (!this.isEmpty()) {
      return {
        index: this.tail - 1,
        value: this.container[this.tail - 1],
      };
    }
    return null;
  }

  getSize = () => this.container.length;

  getElements = () => this.container;

  clear = () => {
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  };
}