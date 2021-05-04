import {
  ForEachOptions,
  ILinkedList,
  IListNode,
  SortFunction,
  UseDirection,
} from './types';
import ListNode from './ListNode';
export default class LinkedList<ListType = any>
  implements ILinkedList<ListType> {
  protected _length = 0;
  protected _maxLength: number | null = null;

  protected _reversed = false;
  protected _start: IListNode<ListType> | null = null;
  protected _end: IListNode<ListType> | null = null;

  /**
   * @param values can be a many values to be assigned to the list or
   * can be a single number to define a max length
   */
  constructor(...values: ListType[]);
  constructor(value?: number);
  constructor(value?: any, ...params: ListType[]) {
    if (!params.length && Number.isInteger(value)) {
      this._maxLength = value as number;
      return;
    }

    if (params.length) {
      this.push(value, ...params);
    }
  }

  public *[Symbol.iterator](): Iterator<ListType> {
    const next = this._reversed ? 'prev' : 'next';
    let node = this.start;

    while (node != null) {
      yield node.value;
      node = node[next];
    }
  }

  public get start(): IListNode<ListType> | null {
    return this._reversed ? this._end : this._start;
  }

  public get end(): IListNode<ListType> | null {
    return this._reversed ? this._start : this._end;
  }

  public get length(): number {
    return this._length;
  }

  public static from<T>(array: Iterable<T>): LinkedList<T> {
    const list = new LinkedList(...array);
    return list;
  }

  public sort(compareFn?: SortFunction<ListType>): this {
    let compare: SortFunction<ListType>;

    try {
      if (!compareFn || typeof compareFn != 'function') {
        compare = (swap, current) => swap > current;
      } else {
        compare = compareFn;
      }

      let node = this.start;
      const next = this._reversed ? 'prev' : 'next';

      while (node) {
        let swap = node,
          current: null | IListNode<ListType> = node;

        while (current) {
          if (compare(swap.value, current.value)) {
            swap = current;
          }

          if (compare(node.value, swap.value)) {
            const aux = node.value;
            node.value = swap.value;
            swap.value = aux;
          }

          current = current[next];
        }

        node = node[next];
      }
    } catch (err) {
      console.error(err);
    }

    return this;
  }

  /**
   * @method reverse does not mutate the list, it just change the direction of
   * the iteration, so the operations like pop, push, shift, forEach, for...of
   * work as the list were reversed, but its only abstract.
   */
  public reverse(): this {
    const { push, pop, unshift, shift } = this;

    this.pop = shift;
    this.shift = pop;

    this.push = unshift;
    this.unshift = push;

    this._reversed = !this._reversed;

    return this;
  }

  private useDirection(cb: UseDirection, reverse: boolean = false) {
    if (this._reversed) {
      // if it must to reverse the iteration again
      if (reverse) return cb({ start: this.end, next: 'next', prev: 'prev' });

      return cb({
        start: this.start,
        next: 'prev',
        prev: 'next',
      });
    }

    if (reverse) return cb({ start: this.end, next: 'prev', prev: 'next' });
    return cb({ start: this.start, next: 'next', prev: 'prev' });
  }

  /**
   * @param options receive two options: reversed and includeNodes;
   * reversed iterate for each value starting by the end, and includeNodes pass the node as item
   * to the iterate function;
   */
  public forEach(
    fn: (item: any, index: number) => void,
    options: ForEachOptions = {}
  ): void {
    const {
      reversed = false,
      includeNodes = false,
      toNode = this.length - 1,
    }: ForEachOptions = options;

    const iterateToNode: UseDirection = ({ start, next }) => {
      let index = reversed ? this.length - 1 : 0;
      let nodeCount = 0;
      let node = start;

      while (node && nodeCount <= toNode) {
        fn(includeNodes ? node : node.value, index);

        if (reversed) {
          index--;
        } else {
          index++;
        }

        node = node[next];
        nodeCount++;
      }
    };

    this.useDirection(iterateToNode, reversed);
  }

  public forEachAt(
    fn: (node: IListNode<ListType>) => void,
    indexes: number[]
  ): void {
    {
      // Remove indexes bigger than the list
      const maxIndex = this.length - 1;
      while (indexes[indexes.length - 1] > maxIndex) {
        indexes.pop();
      }

      if (!indexes.length) return;
    }

    let currentIndexToFind = 0,
      currentIndex = Math.abs(indexes[currentIndexToFind]);

    const node = this.at(indexes[currentIndexToFind]);
    if (!node) return;

    let current: IListNode<ListType> | null = node;
    const isNegativeInteger = indexes[currentIndexToFind] < 0;

    const getRestIndexes: UseDirection = ({ next }) => {
      const maxIndex = Math.abs(indexes[indexes.length - 1]);

      while (current && currentIndex <= maxIndex) {
        if (currentIndex === Math.abs(indexes[currentIndexToFind])) {
          fn(current);
          currentIndexToFind++;
        }

        current = current[next];
        currentIndex++;
      }
    };

    this.useDirection(getRestIndexes, isNegativeInteger);
  }

  public at(index: number): IListNode<ListType> | undefined {
    let result = undefined;
    const maxIndex = this.length - 1;

    const exceedMaxIndex = Math.abs(index) > maxIndex;
    if (exceedMaxIndex) return result;

    if (!Number.isInteger(index))
      throw new Error('The index number must be an integer value.');

    if (index === 0) {
      const isNegativeZero = Object.is(index, -0);
      
      if (isNegativeZero) return this.end || result;
      return this.start || result;
    }

    const options: ForEachOptions = {
      toNode: index,
      includeNodes: true,
    };

    const isNegativeInteger = index < 0;
    if (isNegativeInteger) {
      Object.assign(options, {
        reversed: true,
        toNode: Math.abs(index),
      });

      index = maxIndex + index;
    }

    const findIndex = (node: IListNode<ListType>, current: number) => {
      if (index === current) {
        result = node;
      }
    };

    this.forEach(findIndex, options);

    return result;
  }

  public nodesAt(...indexes: number[]): IListNode<ListType>[] {
    const result: IListNode<ListType>[] = [];
    try {
      const addNode = (node: IListNode<ListType>) => result.push(node);
      this.forEachAt(addNode, indexes);

      return result;
    } catch (err) {
      console.error(err);
      return result;
    }
  }

  public valuesAt(...indexes: number[]): ListType[] {
    const result: ListType[] = [];
    try {
      const addValue = (node: IListNode<ListType>) => result.push(node.value);
      this.forEachAt(addValue, indexes);

      return result;
    } catch (err) {
      console.error(err);
      return result;
    }
  }

  private addFirstNode(value: ListType): void {
    const node = new ListNode(value);
    this._start = node;
    this._end = node;
    this._length++;
  }

  public moveNode({ at, to }: { at: number; to: number }): this {
    if (!Number.isInteger(at) || !Number.isInteger(to) || Object.is(at, to))
      return this;

    const atNode = this.at(at);
    const toNode = this.at(to);
    if (!atNode || !toNode) return this;

    const { start, end } = this;
    const value = atNode.value;

    if (atNode === start) {
      this.shift();
      this._length++;
    } else if (atNode === end) {
      this.pop();
      this._length++;
    } else {
      atNode.remove();
    }
    const isToBeFirstNode = toNode === start;
    if (isToBeFirstNode) {
      this.unshift(value);
      this._length--;
      return this;
    }

    const isToBeLastNode = toNode === end;
    if (isToBeLastNode) {
      this.push(value);
      this._length--;
      return this;
    }

    let atIndex = at,
      toIndex = to;
    const length = this.length - 1;

    const isNegativeAt = at < 0 || Object.is(at, -0);
    if (isNegativeAt) {
      atIndex = length + at;
    }

    const isNegativeTo = to < 0 || Object.is(to, -0);
    if (isNegativeTo) {
      toIndex = length + to;
    }

    if (atIndex < toIndex) {
      toNode.insertNext(value, toNode.next);
    } else {
      toNode.insertPrevious(value, toNode.prev);
    }

    return this;
  }

  /**
   * This method check if list is empty and for each value, call the insert function param
   * @param values a list of values to insert
   * @param insert a function to insert the values
   * @param reversed receive true when the insert must be equal to the unshift insert
   */
  private useInsert(
    values: ListType[],
    insert: (value: ListType) => void,
    reversed: boolean = false
  ): void {
    let current = 0,
      valueAlreadyAdded = 0;

    let length = values.length;
    let finalLength = this.length + length;

    const exceedMaxLength = !!this._maxLength && finalLength > this._maxLength;
    if (exceedMaxLength) {
      const cantInsert = finalLength - (this._maxLength as number);
      length = length - cantInsert;
    }

    if (!this.start) {
      const value = reversed ? values[length - 1] : values[0];
      this.addFirstNode(value);

      valueAlreadyAdded++;
    }

    if (reversed) {
      const to = 0;
      current = length - 1 - valueAlreadyAdded;

      for (; current >= to; current--) {
        insert(values[current]);
        this._length++;
      }
    } else {
      current = current + valueAlreadyAdded;

      for (; current < length; current++) {
        insert(values[current]);
        this._length++;
      }
    }
  }

  public insertSort(
    value: ListType,
    sort: SortFunction<ListType> = (v1, v2) => v1 < v2
  ): this {
    if (!this.start) return this.push(value);
    let insert: 'insertNext' | 'insertPrevious';

    if (this._reversed) {
      insert = 'insertNext';
      sort = (v1, v2) => v1 > v2;
    } else {
      insert = 'insertPrevious';
    }

    const insertionSort: UseDirection = ({ start, next, prev }) => {
      let node = start;

      while (node) {
        if (sort(value, node.value)) {
          const isFirstNode = node === this.start;

          if (isFirstNode) {
            this.unshift(value);
          } else {
            node[insert](value, node[prev]);
            this._length++;
          }

          break;
        }

        const isLastNode = !node[next];
        if (isLastNode) {
          this.push(value);
          break;
        }

        node = node[next];
      }
    };

    this.useDirection(insertionSort);

    return this;
  }

  public push(...values: ListType[]): this {
    const IS_TO_UNSHIFT_VALUE = this._reversed;

    const insertValue = (value: ListType) => {
      this._end = (this._end as IListNode<ListType>).insertNext(value);
    };
    this.useInsert(values, insertValue, IS_TO_UNSHIFT_VALUE);

    return this;
  }

  public pop(): IListNode<ListType> | undefined {
    if (!this._end) return undefined;
    this._length--;

    const removedNode = this._end.remove();
    this._end = removedNode.prev;

    if (!this._length) this._start = null;
    return removedNode;
  }

  public unshift(...values: ListType[]): this {
    const IS_TO_PUSH_VALUE = !this._reversed;

    const insertValue = (value: ListType) => {
      this._start = (this._start as IListNode<ListType>).insertPrevious(value);
    };

    try {
      this.useInsert(values, insertValue, IS_TO_PUSH_VALUE);
    } catch (err) {
      console.error(err);
    }

    return this;
  }

  public shift(): IListNode<ListType> | undefined {
    if (!this._start) return undefined;
    this._length--;

    const removedNode = this._start.remove();
    this._start = removedNode.next;

    if (!this._length) this._end = null;
    return removedNode;
  }

  public remove(node: IListNode<ListType>): IListNode<ListType> | undefined {
    switch (node) {
      case this.start:
        return this.shift();
      case this.end:
        return this.pop();
      default:
        this._length--;
        return node.remove();
    }
  }

  public toArray(reversed: boolean = false): ListType[] {
    let result: ListType[] = Array(this.length);

    const parseToArray = (value: any, index: number) => {
      const isSubList = value && value.toArray;
      if (isSubList) {
        result[index] = value.toArray();
      } else {
        result[index] = value;
      }
    };

    this.forEach(parseToArray, { reversed });

    return result;
  }
}
