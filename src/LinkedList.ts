import { ILinkedList, IListNode, ForEachCallback } from 'LinkedList';
import ListNode from './ListNode';

export default class LinkedArray <ListType = any> implements ILinkedList<ListType> {
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
    callback: ForEachCallback<ListType>,
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

  public toArray(): Array<ListType> {
    let result = [];

    const parseToArray = ({ value }: IListNode) => {
      if (value && value.toArray) {
        result.push(value.toArray());
      } else {
        result.push(value);
      }
    };
    
    this.forEach(parseToArray);

    return result;
  }
}
