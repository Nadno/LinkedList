import { IListNode } from './types';

export default class ListNode<NodeType = any> implements IListNode<NodeType> {
  constructor(
    public value: NodeType,
    public next: IListNode<NodeType> | null = null,
    public prev: IListNode<NodeType> | null = null
  ) {}

  public insertNext(
    value: NodeType,
    afterNewNode: IListNode<NodeType> | null = null
  ): IListNode<NodeType> {
    const node: IListNode<NodeType> = new ListNode(value, afterNewNode, this);
    if (afterNewNode) {
      afterNewNode.prev = node;
    }

    this.next = node;
    return node;
  }

  public insertPrevious(
    value: NodeType,
    beforeNewNode: IListNode<NodeType> | null = null
  ): IListNode<NodeType> {
    const node = new ListNode(value, this, beforeNewNode);
    if (beforeNewNode) {
      beforeNewNode.next = node;
    }

    this.prev = node;
    return node;
  }

  public remove(): IListNode<NodeType> {
    const { next, prev } = this;

    if (next && prev) {
      prev.next = next;
      next.prev = prev;
    }

    return this;
  }

  public removeNext(): IListNode<NodeType> | null {
    if (this.next) {
      this.next.prev = null;
    }
    return this.next;
  }

  public removePrevious(): IListNode<NodeType> | null {
    if (this.prev) {
      this.prev.next = null;
    }
    return this.prev;
  }
}
