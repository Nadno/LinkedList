export type SortFunction<ListType> = (
	value: ListType,
	current: ListType
) => boolean;

export type IterationDirection = 'next' | 'prev';

export type UseDirection = ({}: {
	start?: IListNode;
	next: IterationDirection;
	prev: IterationDirection;
}) => void;

export interface ForEachOptions {
	toNode?: number;
	reversed?: boolean;
}

export interface ILinkedList<ListType = any> {
	start?: IListNode<ListType>;
	end?: IListNode<ListType>;
	length: number;
	[Symbol.iterator](): Iterator<IListNode<ListType>>;
	insert(
		where: 'start' | 'end',
		value: ListType
	): IListNode<ListType> | undefined;
	forEach(
		callback: (
			value: ListType,
			node: IListNode<ListType>,
			index: number
		) => void,
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
	insertSort(
		value: ListType,
		cb: SortFunction<ListType>
	): IListNode<ListType> | undefined;
	remove(node: IListNode<ListType>): IListNode<ListType> | undefined;
	toArray(): Array<ListType>;
}

export interface ILinkedStack<ListType = any> extends ILinkedList<ListType> {
	push(...values: ListType[]): this;
	pop(): IListNode<ListType> | undefined;
}

export interface ILinkedQueue<ListType = any> extends ILinkedList<ListType> {
	push(...values: ListType[]): this;
	shift(): IListNode<ListType> | undefined;
}

export interface ILinkedArray<ListType = any> extends ILinkedList<ListType> {
	push(...values: ListType[]): this;
	pop(): IListNode<ListType> | undefined;
	unshift(...values: ListType[]): this;
	shift(): IListNode<ListType> | undefined;
}

export interface IListNode<NodeType = any> {
	value: NodeType;
	next?: IListNode<NodeType>;
	prev?: IListNode<NodeType>;

	insertNext(value: NodeType, next?: IListNode<NodeType>): IListNode<NodeType>;
	insertPrevious(
		value: NodeType,
		prev?: IListNode<NodeType>
	): IListNode<NodeType>;
	remove(): IListNode<NodeType>;
}
