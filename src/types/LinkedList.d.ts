declare module 'LinkedList' {
  export type ForEachCallback <ListType> = (node: IListNode<ListType>, index: number) => void;
  export interface ILinkedList <ListType = any> {
    firstNode: IListNode<ListType>;
    lastNode: IListNode<ListType>;
    length: number;

    forEach(callback: ForEachCallback<ListType>, startFromFirstNode: boolean): void;
    push(value: ListType): void;
    pop(): IListNode<ListType>;
    unshift(value: ListType): void;
    shift(): IListNode<ListType>;
    toArray(): Array<ListType>;
  }

  export interface IListNode <NodeType = any> {
    value: NodeType;
    next?: IListNode<NodeType>;
    prev?: IListNode<NodeType>;

    insertNext(value: any): IListNode<NodeType>;
    insertPrevious(value: any): IListNode<NodeType>;
    remove(): IListNode<NodeType>;
    removeFromRight(): IListNode<NodeType>;
    removeFromLeft(): IListNode<NodeType>;
  }
}
