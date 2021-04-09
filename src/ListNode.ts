import { IListNode } from "LinkedList";

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

  public remove(): any {
    const { next, prev } = this;

    const isBetweenNodes = next && prev;
    if (isBetweenNodes) {
      prev.next = next;
      next.prev = prev;
      return this;
    }

    const isFirstNode = !!next;
    if (isFirstNode) {
      next.prev = null;
      return next;
    }

    const isLastNode = !!prev;
    if (isLastNode) {
      prev.next = null;
      return prev;
    }
  }
}