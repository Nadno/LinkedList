import { ForEachOptions, ILinkedList, IListNode, SortFunction } from './types';

import ListNode from './ListNode';

export default class LinkedArray<ListType = any>
  implements ILinkedList<ListType> {
  protected _start: IListNode<ListType> | null = null;
  protected _end: IListNode<ListType> | null = null;
  protected _length: number = 0;
  protected _maxLength: number | null = null;
  protected _reversed: boolean = false;

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

  protected *[Symbol.iterator]() {
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

  public set start(value: IListNode<ListType> | null) {
    this._start = value;
  }

  public get end(): IListNode<ListType> | null {
    return this._reversed ? this._start : this._end;
  }

  public set end(value: IListNode<ListType> | null) {
    this._end = value;
  }

  public get length(): number {
    return this._length;
  }

  public set length(_: number) {
    throw new Error("You can't assign a value to length property");
  }

  public sort(cb?: SortFunction<ListType>): this {
    let sortCb: SortFunction<ListType>;

    try {
      if (!cb || typeof cb != 'function') {
        sortCb = (swap, current) => swap > current;
      } else {
        sortCb = cb;
      }

      const selectionSort = (node: IListNode<ListType>) => {
        let swap = node,
          current: null | IListNode<ListType> = node;

        while (current) {
          if (sortCb(swap.value, current.value)) {
            swap = current;
          }

          if (sortCb(node.value, swap.value)) {
            const aux = node.value;
            node.value = swap.value;
            swap.value = aux;
          }

          current = current.next;
        }
      };

      this.forEach(selectionSort, { includeNodes: true });
    } catch (err) {
      console.error(err);
    }

    return this;
  }

  public reverse(): this {
    this._reversed = !this._reversed;

    return this;
  }

  public forEach<result = IListNode<ListType>>(
    callback: (value: result, index: number) => void,
    options: ForEachOptions = {}
  ): void {
    const {
      reversed = false,
      includeNodes = false,
      toNode = this.length - 1,
    }: ForEachOptions = options;

    if (reversed) {
      this._reversed = !this._reversed;
    }

    const next = this._reversed ? 'prev' : 'next';
    const getResult = includeNodes
      ? (node: IListNode<ListType>) => node
      : (node: IListNode<ListType>) => node.value;

    let index = reversed ? this.length - 1 : 0;
    let node = this.start,
      nodeCount = 0;

    while (node && nodeCount <= toNode) {
      callback((getResult(node) as unknown) as result, index);

      if (reversed) {
        index--;
      } else {
        index++;
      }

      node = node[next];
      nodeCount++;
    }

    if (reversed) {
      this._reversed = !this._reversed;
    }
  }

  public at(index: number): IListNode<ListType> | null | undefined {
    const maxIndex = this.length - 1;
    const exceedMaxIndex = Math.abs(index) > maxIndex;

    if (exceedMaxIndex || !Number.isInteger(index))
      throw new Error(
        'The index number is bigger than list length or is not a integer value.'
      );

    const isNegativeZero = Object.is(index, -0);
    if (isNegativeZero) {
      return this.end;
    } else if (index === 0) {
      return this.start;
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

    let result = undefined;

    const findIndex = (node: IListNode<ListType>, current: number) => {
      if (index === current) {
        result = node;
      }
    };

    this.forEach(findIndex, options);

    return result;
  }

  public valueAt(index: number): ListType | null | undefined {
    try {
      const node = this.at(index);
      return node ? node.value : undefined;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  private addFirstNode(value: ListType): void {
    const node = new ListNode(value);
    this.start = node;
    this.end = node;
    this._length++;
  }

  /**
   * This method check if list is empty and for each value, call the insert function param
   * @param values a list of values to insert
   * @param insert a function to insert the values
   */
  private handleInsert(
    values: ListType[],
    insert: (value: ListType, values: ListType[]) => void
  ): void {
    let quantity = values.length,
      finalLength = this.length + quantity;
    let current = 0;

    const exceedMaxLength = !!this._maxLength && finalLength > this._maxLength;
    if (exceedMaxLength) {
      const cantInsert = finalLength - (this._maxLength as number);
      quantity = quantity - cantInsert;
    }

    if (!this.start) {
      this.addFirstNode(values[current]);
      current++;
    }

    for (; current < quantity; current++) {
      insert(values[current], values);
      this._length++;
    }
  }

  public insertSort(sort: SortFunction<ListType>, ...values: ListType[]): this {
    const insertionSort = (value: ListType) => {
      let node = this.start;

      while (node) {
        if (sort(value, node.value)) {
          const isFirstNode = !!this.start;

          if (isFirstNode) {
            this.unshift(value);
          } else {
            node.insertPrevious(value, node.prev as IListNode<ListType>);
          }

          break;
        }

        const isLastNode = !!node.next;
        if (isLastNode) {
          node.insertNext(value, node.next as IListNode<ListType>);
          break;
        }

        node = node.next;
      }
    };

    this.handleInsert(values, insertionSort);
    return this;
  }

  public insertFrom(from: number, ...values: ListType[]): this {
    let currentNode = this.at(from) as IListNode<ListType>;
    if (currentNode == null) return this;

    const addValue = (value: ListType) => {
      currentNode = currentNode.insertNext(value, currentNode.next);
    };

    this.handleInsert(values, addValue);

    return this;
  }

  public push(...values: ListType[]): this {
    const pushValue = (value: ListType) => {
      this.end = (this.end as IListNode<ListType>).insertNext(value);
    };

    this.handleInsert(values, pushValue);

    return this;
  }

  public pop(): IListNode<ListType> | undefined {
    if (!this.end) return undefined;
    this._length--;

    const deletedNode = this.end;
    this.end = this.end.removePrevious();

    return deletedNode;
  }

  public unshift(...values: ListType[]): this {
    const start = 0;
    let current = values.length - 1;

    try {
      const finalLength = this.length + values.length;

      const exceedMaxLength = this._maxLength && finalLength > this._maxLength;
      if (exceedMaxLength) {
        const cantInsert = finalLength - (this._maxLength as number);
        current = current - cantInsert;
      }

      if (!this.start) {
        this.addFirstNode(values[current]);
        current--;
      }

      while (current >= start) {
        this.start = (this.start as IListNode<ListType>).insertPrevious(
          values[current]
        );

        current--;
        this._length++;
      }
    } catch (err) {
      console.error(err);
    }

    return this;
  }

  public shift(): IListNode<ListType> | undefined {
    if (!this.start) return undefined;
    this._length--;

    const deletedNode = this.start;
    this.start = this.start.removeNext();

    return deletedNode;
  }

  public toArray(reversed: boolean = false): ListType[] {
    let result: ListType[] = [];

    const parseToArray = (value: any) => {
      const isSubList = value && value.toArray;
      if (isSubList) {
        result.push(value.toArray());
      } else {
        result.push(value);
      }
    };

    this.forEach(parseToArray, { reversed });

    return result;
  }
}
