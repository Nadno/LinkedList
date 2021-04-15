import { ForEachCallback, ILinkedList, IListNode, SortFunction } from './types';

import ListNode, { BorderNode } from './ListNode';

export default class LinkedArray<ListType = any>
  implements ILinkedList<ListType> {
  public start: IListNode<ListType> | null = null;
  public end: IListNode<ListType> | null = null;

  protected _start: BorderNode<ListType> | null = null;
  protected _end: BorderNode<ListType> | null = null;
  protected _length: number = 0;
  protected _maxLength: number | null = null;

  public reversed: any = {
    _reverse: true,
  };

  constructor(...values: ListType[]);
  constructor(value?: number);
  constructor(value?: any, ...params: ListType[]) {
    this.getNode = this.getNode.bind(this);
    Object.assign(this.reversed, {
      [Symbol.iterator]: this[Symbol.iterator],
      getNode: this.getNode,
    });

    if (!params.length && Number.isInteger(value)) {
      this._maxLength = value as number;
      return;
    }

    if (params.length) {
      this.push(value, ...params);
    }
  }

  private getNode(name: 'start' | 'end'): IListNode<ListType> | null {
    return this[name];
  }

  protected *[Symbol.iterator](this: any) {
    let node: IListNode<ListType> | null;

    let next: 'next' | 'prev';
    if (this._reverse) {
      next = 'prev';
      node = this.getNode('end');
    } else {
      next = 'next';
      node = this.start;
    }

    while (node != null) {
      yield node.value;
      node = node[next];
    }
  }

  public get length(): number {
    return this._length;
  }

  public set length(_: number) {
    throw new Error("You can't assign a value to length property");
  }

  public sort(cb?: SortFunction<ListType>): void {
    let sortCb: SortFunction<ListType>;
    try {
      if (!cb || typeof cb != 'function') {
        sortCb = (swap, current) => swap > current;
      } else {
        sortCb = cb;
      }

      const selectionSort: ForEachCallback<ListType> = node => {
        let swap = node,
          current: IListNode<ListType> | null = node;

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

      this.forEach(selectionSort);
    } catch (err) {
      console.error(err);
    }
  }

  public forEach(callback: ForEachCallback<ListType>, options = {}): void {
    const { fromStart = true, toNode = this.length - 1 }: any = options;
    let node = fromStart ? this.start : this.end;
    let index = fromStart ? 0 : this.length - 1,
      nodeCount = 0;

    while (node != null && nodeCount <= toNode) {
      callback(node, index);

      if (fromStart) {
        node = node.next;
        index++;
      } else {
        node = node.prev;
        index--;
      }

      nodeCount++;
    }
  }

  public at(index: number): IListNode<ListType> | null | undefined {
    const listLength = this.length - 1;
    if (Math.abs(index) > listLength || !Number.isInteger(index))
      throw new Error(
        'The index number is bigger than list length or is not a integer value.'
      );

    const isNegativeZero = Object.is(index, -0);
    if (isNegativeZero) {
      return this.end;
    } else if (index === 0) {
      return this.start;
    }

    const options: any = {
      toNode: index,
    };

    if (index < 0) {
      Object.assign(options, {
        fromStart: false,
        toNode: Math.abs(index),
      });

      index = listLength + index;
    }

    let result = undefined;

    this.forEach((node, current) => {
      if (index === current) {
        result = node;
      }
    }, options);

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
    const newNode = new ListNode(value);
    this.start = newNode;
    this.end = newNode;
    this._length++;
  }

  private forEachInsert(
    cb: (value: ListType, values: ListType[]) => void,
    values: ListType[]
  ): void {
    let length = values.length;
    let index = 0;

    if (this._maxLength && this.length + length > this._maxLength) {
      const cantInsert = this.length + length - this._maxLength;
      length = length - cantInsert;
    }

    if (this.start == null) {
      this.addFirstNode(values[0]);
      index++;
    }

    for (; index < length; index++) {
      cb(values[index], values);
      this._length++;
    }
  }

  public insertSort(sort: SortFunction<ListType>, ...values: ListType[]): void {
    this.forEachInsert(value => {
      let node = this.start;
      while (node != null) {
        if (sort(value, node.value)) {
          if (node === this.start) {
            this.unshift(value);
          } else {
            node.insertPrevious(value, node.prev as IListNode<ListType>);
          }
          break;
        }

        const isLastNode = node.next == null;
        if (isLastNode) {
          node.insertNext(value, node.next as IListNode<ListType>);
          break;
        }

        node = node.next;
      }
    }, values);
  }

  public insertFrom(from: number, ...values: ListType[]): void {
    let currentNode = this.at(from) as IListNode<ListType>;
    if (currentNode == null) return;

    this.forEachInsert(value => {
      currentNode = currentNode.insertNext(value, currentNode.next);
    }, values);
  }

  public push(...values: ListType[]): void {
    const pushValue = (value: ListType) => {
      this.end = (this.end as IListNode<ListType>).insertNext(value);
    };

    this.forEachInsert(pushValue, values);
  }

  public pop(): IListNode<ListType> | undefined {
    if (this.length < 1) return undefined;
    this._length--;

    const deletedNode = this.end as IListNode<ListType>;
    this.end = (this.end as IListNode<ListType>).removePrevious();

    return deletedNode;
  }

  public unshift(...values: ListType[]): void {
    const to = 0;
    let index = values.length - 1;

    try {
      if (this.start == null) {
        this.addFirstNode(values[index]);
        index--;
      }

      while (index >= to) {
        this.start = (this.start as IListNode<ListType>).insertPrevious(
          values[index]
        );
        this._length++;
        index--;
      }
    } catch (err) {
      console.error(err);
    }
  }

  public shift(): IListNode<ListType> | undefined {
    if (this.length < 1) return undefined;
    this._length--;

    const deletedNode = this.start as IListNode<ListType>;
    this.start = (this.start as IListNode<ListType>).removeNext();

    return deletedNode;
  }

  public toArray(reversed: boolean = false): ListType[] {
    let result: ListType[] = [];

    const parseToArray = ({ value }: IListNode) => {
      if (value && value.toArray) {
        result.push(value.toArray());
      } else {
        result.push(value);
      }
    };

    this.forEach(parseToArray, { fromStart: !reversed });

    return result;
  }
}
