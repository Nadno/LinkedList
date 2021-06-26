import LinkedList from '.';
import arrayMethods from './utils/arrayMethods';

import { ILinkedQueue, IListNode } from './types';

export default class LinkedQueue<ListType>
	extends LinkedList
	implements ILinkedQueue<ListType>
{
	constructor(private maxLength?: number) {
		super();
	}

	private getSlicedArrayToPush(values: ListType[], max: number): ListType[] {
		const exceededMaxIndex = this.length - 1 + (values.length - 1) - max;
		return values.slice(-exceededMaxIndex);
	}

	public push(...values: ListType[]): this {
		let treatedValues = values;

		if (this.maxLength && this.length + values.length > this.maxLength) {
			treatedValues = this.getSlicedArrayToPush(values, this.maxLength);
		}

		arrayMethods.push.apply(this, treatedValues);

		return this;
	}

	public shift: () => IListNode<ListType> | undefined = arrayMethods.shift;
}
