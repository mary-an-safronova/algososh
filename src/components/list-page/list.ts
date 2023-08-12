export class Node<T> {
  value: T;
  next: Node<T> | null;

    constructor(value: T, next: Node<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}

interface ILinkedList<T> {
  append: (element: T) => void;
  prepend: (element: T) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  addByIndex: (index: number, element: T) => void;
  deleteByIndex: (position: number) => void;
  getNodeByIndex: (position: number) => void;
  toArray: () => T[];
  getSize: () => number;
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private size: number;

  constructor(initialArray: T[]) {
    this.head = null;
    this.size = 0;
    if (initialArray.length) { initialArray.forEach((item) => { this.append(item) }) }
  }

  append(element: T) {
    const node = new Node(element);
    let current;

    if (this.head === null) {
        this.head = node;
    } else {
        current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = node;
    }
    this.size++;
  }

  prepend(element: T) {
    const node = new Node(element);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  deleteHead = () => {
    if (this.head) this.head = this.head?.next
    this.size--
  };

  deleteTail = () => {
    if (!this.head || !this.head.next) {
      return null;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = null;
    this.size--;
    return current ? current.value : null;
  };

  addByIndex(index: number, element: T) {
    if (index < 0 || index > this.size) {
      throw new Error('Incorrect value of index');
    }
    const node = new Node(element);
    let current = this.head
    if (index === 0) {
      node.next = current;
      this.head = node;
    } else {
      let prev = null;
      let currentIndex = 0;
      while (currentIndex < index) {
        prev = current;
        current = current ? current.next : null;
        currentIndex++;
      }
      if (prev) {
        prev.next = node;
      }
      node.next = current;
    }
    this.size++;
  }

  deleteByIndex(index: number) {
    if (index < 0 || index > this.size) {
      throw new Error('Incorrect value of index');
    }
    let current = this.head;
    if (index === 0 && current) {
      this.head = current.next;
    } else {
      let prev = null;
      let currentIndex = 0;
      while (currentIndex < index) {
        prev = current;
        current = current ? current.next : null;
        currentIndex++;
      }
      if (prev && current) {
        prev.next = current.next;
      }
    }
    this.size--;
    return current ? current.value : null;
  }

  getNodeByIndex(index: number) {
    if (index < 0 || index > this.size) {
      throw new Error('Incorrect value of index');
    }
    let current = this.head;
    let currentIndex = 0;
    while (currentIndex < index) {
      current = current ? current.next : null;
      currentIndex++;
    }
    return current ? current.value : null;
  }

  toArray = () => {
    const array = [];
    let current = this.head;
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    return array;
  };

  getSize = () => this.size;
}