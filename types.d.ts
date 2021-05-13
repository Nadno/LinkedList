export type SortFunction<ListType> = (
  value: ListType,
  current: ListType
) => boolean;

export type IterationDirection = 'next' | 'prev';

export type UseDirection = ({}: {
  start: IListNode | null;
  next: IterationDirection;
  prev: IterationDirection;
}) => void;

export interface ForEachOptions {
  toNode?: number;
  reversed?: boolean;
  includeNodes?: boolean;
}

export interface ILinkedList<ListType = any> {
  start: IListNode<ListType> | null;
  end: IListNode<ListType> | null;
  length: number;

  [Symbol.iterator](): Iterator<IListNode<ListType>>;
  forEach(
    callback: (item: any, index: number) => void,
    options?: ForEachOptions
  ): void;
  forEachAt(
    callback: (node: IListNode<ListType>) => void,
    indexes: number[]
  ): void;
  at(index: number): IListNode<ListType> | undefined;
  nodesAt(...indexes: number[]): IListNode<ListType>[];
  valuesAt(...indexes: number[]): ListType[];
  /**
   * @param callback a callback that must return a condition with the its params.
   *
   * callback:
   *  @param swap must be checked if is less or greater than current param;
   *  @param current must be compared with swap;
   *  @return swap > current to crescent sort;
   *  @return swap < current decrescent sort;
   */
  reverse(): this;
  sort(cb: SortFunction<ListType>): this;
  insertSort(value: ListType, cb: SortFunction<ListType>): this;
  push(...values: ListType[]): this;
  pop(): IListNode<ListType> | undefined;
  unshift(...values: ListType[]): this;
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
  remove(): IListNode<NodeType>;
}
