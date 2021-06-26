import LinkedList from '..';
import reversedForEach from './reversedForEach';

export default class ArrayMethods {
	/**
	 * @param values can be a many values to be assigned to the list or
	 * can be a single number to define a max length
	 */

	public static push(this: LinkedList<any>, ...values: any): any {
		const insertValue = (value: any) => this.insert('end', value);

		const isUnshift = this._reversed;
		if (isUnshift) {
			reversedForEach(values, insertValue);
			return this;
		}

		values.forEach(insertValue);

		return this;
	}

	public static unshift(this: LinkedList, ...values: any): any {
		const insertValue = (value: any) => this.insert('start', value);

		const isPush = !this._reversed;
		if (isPush) {
			reversedForEach(values, insertValue);
			return this;
		}

		values.forEach(insertValue);

		return this;
	}

	public static pop(this: LinkedList) {
		return this.remove('end');
	}

	public static shift(this: LinkedList) {
		return this.remove('start');
	}
}
