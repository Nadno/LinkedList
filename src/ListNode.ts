import { IListNode } from 'LinkedList';

export default class ListNode implements IListNode {
  constructor(
    public value: any,
    public next: IListNode = null,
    public prev: IListNode = null
  ) {}

  public insertNext(value: any): IListNode {
    const newNode = new ListNode(value, null, this);
    this.next = newNode;
    return newNode;
  }

  public remove(): IListNode {
    const { next, prev } = this;

    const isBetweenNodes = next && prev;
    if (isBetweenNodes) {
      prev.next = next;
      next.prev = prev;
      return this;
    }

    const isFirstNode = !!next;
    if (isFirstNode) {
      return this.removeFromLeft();
    }

    const isLastNode = !!prev;
    if (isLastNode) {
      return this.removeFromRight();
    }
  }

  public removeFromRight(): IListNode {
    this.prev.next = null;
    return this.prev;
  }

  public removeFromLeft(): IListNode {
    this.next.prev = null;
    return this.next;
  }
}
