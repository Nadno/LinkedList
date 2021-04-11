import { ILinkedList, IListNode, ForEachCallback } from 'LinkedList';
import ListNode from './ListNode';

export default class LinkedArray<ListType = any>
  implements ILinkedList<ListType> {
  public firstNode: IListNode<ListType> = null;
  public lastNode: IListNode<ListType> = null;
  private nodeCount: number = 0;

  constructor(firstValue?: ListType, length: number = 0) {
    this.length = length;
    if (firstValue) this.push(firstValue);
  }

  public get length(): number {
    return this.nodeCount;
  }

  public set length(value: number) {
    if (value < 0) return;

    if (value === 0) {
      this.firstNode = null;
      this.lastNode = null;
    }

    if (value < this.length) {
      const removeRightPartOfArray = (node: IListNode, index: number) => {
        if (index === value) {
          this.lastNode = node.removeFromLeft();
        }
      };

      this.forEach(removeRightPartOfArray, {
        to: value,
      });
    } else if (value > this.length) {
      const newLength = value - this.length;

      for (let newIndexes = 0; newIndexes < newLength; newIndexes++) {
        this.lastNode = this.lastNode.insertNext(null);
      }
    }

    this.nodeCount = value;
  }

  public forEach(
    callback: ForEachCallback<ListType>,
    { fromFirstNode = true, toNode = this.length - 1 }: any
  ): void {
    let node = fromFirstNode ? this.firstNode : this.lastNode;
    let index = fromFirstNode ? 0 : this.length - 1,
      nodeCount = 0;

    while (node != null && nodeCount <= toNode) {
      callback(node, index);

      if (fromFirstNode) {
        node = node.next;
        index++;
      } else {
        node = node.prev;
        index--;
      }

      nodeCount++;
    }
  }

  public at(index: number): IListNode<ListType> {
    const listLength = this.length - 1;
    if (Math.abs(index) > listLength) return undefined;

    const options: any = {
      toNode: index,
    };

    if (index < 0) {
      Object.assign(options, {
        fromFirstNode: false,
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

  public valueAt(index: number): ListType {
    try {
      return this.at(index).value;
    } catch (err) {
      console.error(err);
    }
  }

  private addFirstNode(value: ListType): void {
    const newNode = new ListNode(value);
    this.firstNode = newNode;
    this.lastNode = newNode;
    this.nodeCount++;
  }

  public push(value: ListType): void {
    if (this.firstNode == null) return this.addFirstNode(value);

    this.lastNode = this.lastNode.insertNext(value);
    this.nodeCount++;
  }

  public pop(): IListNode<ListType> {
    if (this.length < 1) return;
    this.nodeCount--;

    const deletedNode = this.lastNode;
    this.lastNode = this.lastNode.removeFromLeft();

    return deletedNode;
  }

  public unshift(value: ListType): void {
    if (this.firstNode == null) return this.addFirstNode(value);

    this.firstNode = this.firstNode.insertPrevious(value);
    this.nodeCount++;
  }

  public shift(): IListNode<ListType> {
    if (this.length < 1) return;
    this.nodeCount--;

    const deletedNode = this.firstNode;
    this.firstNode = this.firstNode.removeFromRight();

    return deletedNode;
  }

  public toArray(reversed: boolean = false): Array<ListType> {
    let result = [];

    const parseToArray = ({ value }: IListNode) => {
      if (value && value.toArray) {
        result.push(value.toArray());
      } else {
        result.push(value);
      }
    };

    this.forEach(parseToArray, { fromFirstNode: !reversed });

    return result;
  }
}
