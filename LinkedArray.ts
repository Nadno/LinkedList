import LinkedList from '.';
import { ILinkedArray, IListNode } from './types';
import ArrayMethods from './utils/arrayMethods';

class LinkedArray<ListType>
	extends LinkedList<ListType>
	implements ILinkedArray<ListType>
{
	constructor(...values: ListType[]) {
		super();

		if (values.length) {
			(this as any).push(...values);
		}
	}
	public push: (this: LinkedList<ListType>, ...values: ListType[]) => this =
		ArrayMethods.push;
	public pop: (
		this: LinkedList<ListType>,
		...values: ListType[]
	) => IListNode<ListType> | undefined = ArrayMethods.pop;

	public unshift: (this: LinkedList<ListType>, ...values: ListType[]) => this =
		ArrayMethods.unshift;

	public shift: (
		this: LinkedList<ListType>
	) => IListNode<ListType> | undefined = ArrayMethods.shift;

	public reverse(): this {
		const { push, pop, unshift, shift } = this;

		this.push = unshift;
		this.pop = shift;

		this.unshift = push;
		this.shift = pop;

		return super.reverse();
	}
}

const teste = new LinkedArray();

export default LinkedArray;
