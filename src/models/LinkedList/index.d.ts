declare module 'LinkedList' {
  export type ForEachCallback<ListType> = (
    node: IListNode<ListType>,
    index: number
  ) => void;

  export type SortFunction<ListType> = (
    value: ListType,
    current: ListType
  ) => boolean;
  export interface ILinkedList<ListType = any> {
    firstNode: IListNode<ListType>;
    lastNode: IListNode<ListType>;
    length: number;

    forEach(callback: ForEachCallback<ListType>, options: any): void;
    at(index: number): IListNode<ListType> | undefined;
    valueAt(index: number): ListType | undefined;
    /**
     * @param callback a callback that must return a condition with the its params.
     *
     * callback:
     *  @param swap must be checked if is less or greater than current param;
     *  @param current must be compared with swap;
     *  @return swap > current to crescent sort;
     *  @return swap < current decrescent sort;
     */
    sort(cb: SortFunction<ListType>): void;
    insertSort(cb: SortFunction<ListType>): void;
    insertFrom(from: number, ...values: ListType[]): void;
    push(...values: ListType[]): void;
    pop(): IListNode<ListType>;
    unshift(...values: ListType[]): void;
    shift(): IListNode<ListType>;
    toArray(): Array<ListType>;
  }

  export interface IListNode<NodeType = any> {
    value: NodeType;
    next?: IListNode<NodeType>;
    prev?: IListNode<NodeType>;

    insertNext(
      value: NodeType,
      next?: IListNode<NodeType>
    ): IListNode<NodeType>;
    insertPrevious(
      value: NodeType,
      prev?: IListNode<NodeType>
    ): IListNode<NodeType>;
    remove(): IListNode<NodeType>;
    removeNext(): IListNode<NodeType>;
    removePrevious(): IListNode<NodeType>;
  }
}
