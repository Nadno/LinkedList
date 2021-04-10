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
    if (value < this.length) {
      const removeRightPartOfArray = (node: IListNode, index: number) => {
        if (index === value) {
          this.lastNode = node.removeFromRight();
        }
      };

      this.forEach(removeRightPartOfArray);
    } else if (value > this.length) {
      const newLength = value - this.length;

      for (let newIndexes = 0; newIndexes < newLength; newIndexes++) {
        this.lastNode = this.lastNode.insertNext(null);
      }
    }

    this.nodeCount = value;
  }

  public forEach(
    callback: ForEachCallback,
    startFromFirstNode: boolean = true
  ): void {
    let node = startFromFirstNode ? this.firstNode : this.lastNode;
    let index = startFromFirstNode ? 0 : this.length;

    while (node != null) {
      callback(node, index);

      if (startFromFirstNode) {
        node = node.next;
        index++;
      } else {
        node = node.prev;
        index--;
      }
    }
  }

  public push(value: any): void {
    if (this.firstNode == null) {
      const newNode = new ListNode(value);
      this.firstNode = newNode;
      this.lastNode = newNode;
      this.nodeCount++;

      return;
    }

    this.lastNode = this.lastNode.insertNext(value);
    this.nodeCount++;
  }

  public pop(): IListNode {
    if (this.length < 1) return;
    this.nodeCount--;

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

    const parseToArray = ({ value }) => result.push(value);
    this.forEach(parseToArray);

    return result;
  }
}
