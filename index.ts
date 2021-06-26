import {
	ForEachOptions,
	ILinkedList,
	IListNode,
	SortFunction,
	UseDirection,
} from './types';

import ListNode from './ListNode';

export default class LinkedList<ListType = any>
	implements ILinkedList<ListType>
{
	protected _length = 0;

	protected _reversed = false;
	protected _start?: IListNode<ListType>;
	protected _end?: IListNode<ListType>;

	public *[Symbol.iterator](): Iterator<IListNode<ListType>> {
		const next = this._reversed ? 'prev' : 'next';
		let node = this.start;

		while (node != null) {
			yield node;
			node = node[next];
		}
	}

	public get start(): IListNode<ListType> | undefined {
		return this._reversed ? this._end : this._start;
	}

	public get end(): IListNode<ListType> | undefined {
		return this._reversed ? this._start : this._end;
	}

	public get length(): number {
		return this._length;
	}

	public static from<T>(array: Iterable<T>): LinkedList<T> {
		const list = new LinkedList<T>(...array);
		return list;
	}

	public sort(compareFn?: SortFunction<ListType>): this {
		let compare: SortFunction<ListType>;

		try {
			if (!compareFn || typeof compareFn != 'function') {
				compare = (swap, current) => swap > current;
			} else {
				compare = compareFn;
			}

			let node = this.start;
			const next = this._reversed ? 'prev' : 'next';

			while (node) {
				let swap = node,
					current: IListNode<ListType> | undefined = node;

				while (current) {
					if (compare(swap.value, current.value)) {
						swap = current;
					}

					if (compare(node.value, swap.value)) {
						const aux = node.value;
						node.value = swap.value;
						swap.value = aux;
					}

					current = current[next];
				}

				node = node[next];
			}
		} catch (err) {
			console.error(err);
		}

		return this;
	}

	/**
	 * @method reverse does not mutate the list, it just change the direction of
	 * the iteration, so the operations like pop, push, shift, forEach, for...of
	 * work as the list were reversed, but its only abstract.
	 */
	public reverse(): this {
		this._reversed = !this._reversed;
		return this;
	}

	private useDirection(cb: UseDirection, reverse: boolean = false) {
		if (this._reversed) {
			// if it must to reverse the iteration again
			if (reverse) return cb({ start: this.end, next: 'next', prev: 'prev' });

			return cb({
				start: this.start,
				next: 'prev',
				prev: 'next',
			});
		}

		if (reverse) return cb({ start: this.end, next: 'prev', prev: 'next' });
		return cb({ start: this.start, next: 'next', prev: 'prev' });
	}

	/**
	 * @param options receive two options: reversed and includeNodes;
	 * reversed iterate for each value starting by the end, and includeNodes pass the node as item
	 * to the iterate function;
	 */
	public forEach(
		cb: (value: ListType, node: IListNode<ListType>, index: number) => void,
		options: ForEachOptions = {}
	): void {
		const { reversed = false, toNode = this.length - 1 }: ForEachOptions =
			options;

		const iterateToNode: UseDirection = ({ start, next }) => {
			let index = reversed ? this.length - 1 : 0;
			let nodeCount = 0;
			let node = start;

			while (node && nodeCount <= toNode) {
				cb(node.value, node, index);

				if (reversed) {
					index--;
				} else {
					index++;
				}

				node = node[next];
				nodeCount++;
			}
		};

		this.useDirection(iterateToNode, reversed);
	}

	public forEachAt(
		fn: (node: IListNode<ListType>) => void,
		indexes: number[]
	): void {
		{
			// Remove indexes bigger than the list
			const maxIndex = this.length - 1;
			while (indexes[indexes.length - 1] > maxIndex) {
				indexes.pop();
			}

			if (!indexes.length) return;
		}

		let currentIndexToFind = 0,
			currentIndex = Math.abs(indexes[currentIndexToFind]);

		const node = this.at(indexes[currentIndexToFind]);
		if (!node) return;

		let current: IListNode<ListType> | undefined = node;
		const isNegativeInteger = indexes[currentIndexToFind] < 0;

		const getRestIndexes: UseDirection = ({ next }) => {
			const maxIndex = Math.abs(indexes[indexes.length - 1]);

			while (current && currentIndex <= maxIndex) {
				if (currentIndex === Math.abs(indexes[currentIndexToFind])) {
					fn(current);
					currentIndexToFind++;
				}

				current = current[next];
				currentIndex++;
			}
		};

		this.useDirection(getRestIndexes, isNegativeInteger);
	}

	public at(index: number): IListNode<ListType> | undefined {
		let result = undefined;
		const maxIndex = this.length - 1;

		const exceedMaxIndex = Math.abs(index) > maxIndex;
		if (exceedMaxIndex) return result;

		if (!Number.isInteger(index))
			throw new Error('The index number must be an integer value.');

		if (index === 0) {
			const isNegativeZero = Object.is(index, -0);

			if (isNegativeZero) return this.end || result;
			return this.start || result;
		}

		const options: ForEachOptions = {
			toNode: index,
		};

		const isNegativeInteger = index < 0;
		if (isNegativeInteger) {
			Object.assign(options, {
				reversed: true,
				toNode: Math.abs(index),
			});

			index = maxIndex + index;
		}

		const findIndex = (_: any, node: IListNode<ListType>, current: number) => {
			if (index === current) {
				result = node;
			}
		};

		this.forEach(findIndex, options);

		return result;
	}

	public nodesAt(...indexes: number[]): IListNode<ListType>[] {
		const result: IListNode<ListType>[] = [];
		try {
			const addNode = (node: IListNode<ListType>) => result.push(node);
			this.forEachAt(addNode, indexes);

			return result;
		} catch (err) {
			console.error(err);
			return result;
		}
	}

	public valuesAt(...indexes: number[]): ListType[] {
		const result: ListType[] = [];
		try {
			const addValue = (node: IListNode<ListType>) => result.push(node.value);
			this.forEachAt(addValue, indexes);

			return result;
		} catch (err) {
			console.error(err);
			return result;
		}
	}

	protected addFirstNode(value: ListType): IListNode<ListType> {
		const node = new ListNode(value);

		this._start = node;
		this._end = node;
		this._length++;

		return node;
	}

	public insert(
		where: 'start' | 'end',
		value: ListType
	): IListNode<ListType> | undefined {
		if (!this._end || !this._start) {
			return this.addFirstNode(value);
		} else {
			let result: IListNode<ListType> | undefined;

			if (where === 'start') {
				this._start = this._start.insertPrevious(value);
				result = this._start;
			} else if (where === 'end') {
				this._end = this._end.insertNext(value);
				result = this._end;
			}

			this._length++;
			return result;
		}
	}

	public insertNext(
		node: IListNode,
		value: ListType
	): IListNode<ListType> | undefined {
		if (node === this.end) return this.insert('end', value);

		let result;
		const insert: UseDirection = ({ next }) => {
			result = node.insertNext(value, node[next]);
			this._length++;
		};

		this.useDirection(insert);

		return result;
	}

	public insertPrev(
		node: IListNode,
		value: ListType
	): IListNode<ListType> | undefined {
		if (node === this.start) return this.insert('start', value);

		let result;
		const insert: UseDirection = ({ prev }) => {
			result = node.insertPrevious(value, node[prev]);
			this._length++;
		};

		this.useDirection(insert);

		return result;
	}

	public insertSort(
		value: ListType,
		sort: SortFunction<ListType> = (v1, v2) => v1 < v2
	): IListNode<ListType> | undefined {
		if (!this.start) return this.addFirstNode(value);

		if (this._reversed) sort = (v1, v2) => v1 > v2;
		let node;

		const insertionSort: UseDirection = ({ start, next }) => {
			node = start;

			while (node) {
				if (sort(value, node.value)) {
					const isFirstNode = node === this.start;

					if (isFirstNode) {
						node = this.insert('start', value);
						break;
					}

					const insert: 'insertNext' | 'insertPrev' = this._reversed
						? 'insertNext'
						: 'insertPrev';

					node = this[insert](node, value);
					break;
				}

				const isLastNode = !node[next];
				if (isLastNode) {
					node = this.insert('end', value);
					break;
				}

				node = node[next];
			}
		};

		this.useDirection(insertionSort);
		return node;
	}

	public removeNext(
		node: IListNode<ListType>
	): IListNode<ListType> | undefined {
		if (!node) return;
		return this.remove(node.next);
	}

	public moveNode({ at, to }: { at: number; to: number }): this {
		if (Object.is(at, to)) return this;

		const atNode = this.at(at);
		const toNode = this.at(to);
		if (!atNode || !toNode) return this;

		const { start, end } = this;
		const value = atNode.value;

		if (atNode === start) {
			this.remove('start');
			this._length++;
		} else if (atNode === end) {
			this.remove('end');
			this._length++;
		} else {
			atNode.remove();
		}

		const isToBeFirstNode = toNode === start;
		if (isToBeFirstNode) {
			this.insert('start', value);
			this._length--;
			return this;
		}

		const isToBeLastNode = toNode === end;
		if (isToBeLastNode) {
			this.insert('end', value);
			this._length--;
			return this;
		}

		let atIndex = at,
			toIndex = to;
		const length = this.length - 1;

		const isNegativeAt = at < 0 || Object.is(at, -0);
		if (isNegativeAt) {
			atIndex = length + at;
		}

		const isNegativeTo = to < 0 || Object.is(to, -0);
		if (isNegativeTo) {
			toIndex = length + to;
		}

		if (atIndex < toIndex) {
			toNode.insertNext(value, toNode.next);
		} else {
			toNode.insertPrevious(value, toNode.prev);
		}

		return this;
	}

	public remove(
		where?: 'start' | 'end' | IListNode<ListType>
	): IListNode<ListType> | undefined {
		if (!where) return;

		switch (where) {
			case this.start:
			case 'start': {
				if (!this._start) return undefined;
				this._length--;

				const removedNode = this._start.remove();
				this._start = removedNode.next;

				if (!this._length) this._end = undefined;
				return removedNode;
			}

			case this.end:
			case 'end': {
				if (!this._end) return undefined;
				this._length--;

				const removedNode = this._end.remove();
				this._end = removedNode.prev;

				if (!this._length) this._start = undefined;
				return removedNode;
			}

			default: {
				this._length--;
				return where.remove();
			}
		}
	}

	public toArray(reversed: boolean = false): ListType[] {
		let result: ListType[] = Array(this.length);

		const parseToArray = (value: any, _: any, index: number) => {
			const isSubList = value && value.toArray;
			if (isSubList) {
				result[index] = value.toArray();
			} else {
				result[index] = value;
			}
		};

		this.forEach(parseToArray, { reversed });

		return result;
	}
}
