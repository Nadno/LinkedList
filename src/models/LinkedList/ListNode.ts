import { IListNode } from 'LinkedList';

export default class ListNode<NodeType = any> implements IListNode<NodeType> {
  constructor(
    public value: NodeType,
    public next: IListNode<NodeType> = null,
    public prev: IListNode<NodeType> = null
  ) {}

  public insertNext(
    value: NodeType,
    nextNewNode: IListNode<NodeType> = null
  ): IListNode<NodeType> {
    const newNode = new ListNode(value, nextNewNode, this);
    if (nextNewNode) {
      nextNewNode.prev = newNode;
    }

    this.next = newNode;
    return newNode;
  }

  public insertPrevious(
    value: NodeType,
    prevNewNode: IListNode<NodeType> = null
  ): IListNode<NodeType> {
    const newNode = new ListNode(value, this, prevNewNode);
    if (prevNewNode) {
      prevNewNode.next = newNode;
    }

    this.prev = newNode;
    return newNode;
  }

  public remove(): IListNode<NodeType> {
    const { next, prev } = this;

    prev.next = next;
    next.prev = prev;
    return this;
  }

  public removeNext(): IListNode<NodeType> {
    this.next.prev = null;
    return this.next;
  }

  public removePrevious(): IListNode<NodeType> {
    this.prev.next = null;
    return this.prev;
  }
}
