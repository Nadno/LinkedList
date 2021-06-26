import LinkedList from '.';
import { ILinkedStack, IListNode } from './types';
import arrayMethods from './utils/arrayMethods';

export default class LinkedStack<ListType>
	extends LinkedList
	implements ILinkedStack<ListType>
{
	public push: (this: LinkedList<ListType>, ...values: ListType[]) => this =
		arrayMethods.push;
	public pop: () => IListNode<ListType> | undefined = arrayMethods.pop;
}
