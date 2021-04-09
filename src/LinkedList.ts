import { ILinkedList, IListNode, ForEachCallback } from 'LinkedList';
import ListNode from './ListNode';

export default class LinkedArray implements ILinkedList {
  public firstNode: IListNode = null;
  public lastNode: IListNode = null;
  private nodeCount: number = 0;

  constructor(firstNode?: IListNode, length: number = 0) {
    this.length = length;
    if (firstNode) this.push(firstNode);
  }

  public get length(): number {
    return this.nodeCount;
  }

  public set length(value: number) {
    const newLength = value - this.length;
    if (value > newLength) {
      let newIndexes = 0;

      this.forEach(node => {
        if (node.next == null && newIndexes < newLength) {
          node.insertNext(null);
          newIndexes++;
        }
      });
    } else if (value < newLength) {
    }

    this.nodeCount = value;
  }

  public forEach(callback: ForEachCallback): void {
    let node = this.firstNode;
    let index = 0;

    while (node != null) {
      callback(node, index);

      node = node.next;
      index++;
    }
  }

  public push(value: any): void {
    this.length++;

    if (this.firstNode == null) {
      const newNode = new ListNode(value);
      this.firstNode = newNode;
      this.lastNode = newNode;
      return;
    }

    this.lastNode = this.lastNode.insertNext(value);
  }

  public pop(): IListNode {
    if (this.length < 1) return;
    this.length--;

    const deletedNode = this.lastNode;
    this.lastNode = this.lastNode.remove();

    return deletedNode;
  }

  public unshift() {}

  public shift() {}

  public toString(): string {
    let result = '[';
    const length = this.length - 1;

    const getStringValue = ({ value }, index: number) => {
      result =
        length === index ? `${(result += value)}` : `${(result += value)}, `;
    };

    this.forEach(getStringValue);

    return (result += ']');
  }

  public toJSON(): Array<any> {
    let result = [];

    const getStringValue = ({ value }) => result.push(value);
    this.forEach(getStringValue);

    return result;
  }
}
