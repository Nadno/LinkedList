export type ForEachCallback<ListType> = (
  node: IListNode<ListType>,
  index: number
) => void;

export type SortFunction<ListType> = (
  value: ListType,
  current: ListType
) => boolean;

export interface ILinkedList<ListType = any> {
  start: IListNode<ListType> | null;
  end: IListNode<ListType> | null;
  length: number;

  forEach(callback: ForEachCallback<ListType>, options: any): void;
  at(index: number): IListNode<ListType> | null | undefined;
  valueAt(index: number): ListType | null | undefined;
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
  pop(): IListNode<ListType> | undefined;
  unshift(...values: ListType[]): void;
  shift(): IListNode<ListType> | undefined;
  toArray(): Array<ListType>;
}

export interface IListNode<NodeType = any> {
  value: NodeType;
  next: IListNode<NodeType> | null;
  prev: IListNode<NodeType> | null;

  insertNext(
    value: NodeType,
    next?: IListNode<NodeType> | null
  ): IListNode<NodeType>;
  insertPrevious(
    value: NodeType,
    prev?: IListNode<NodeType> | null
  ): IListNode<NodeType>;
  remove(): IListNode<NodeType> | null;
  removeNext(): IListNode<NodeType> | null;
  removePrevious(): IListNode<NodeType> | null;
}
