import LinkedList from '../LinkedArray';

describe('Linked list constructor', () => {
	const exampleList = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

	it('should be possible use constructor with many arguments as values to be assigned', () => {
		const list = new LinkedList(...exampleList);
		const expected = [...exampleList];

		expect(list.toArray()).toEqual(expected);
		expect(list.length).toBe(expected.length);
	});

	it('should be possible use for...of in LinkedList', () => {
		const list = new LinkedList(...exampleList);
		let result = '';

		for (let node of list) {
			result += node.value;
		}

		expect(result).toBe('hello world');
	});

	{
		const properties = ['length', 'start', 'end'];
		const list = new LinkedList();

		for (const property of properties) {
			it(`should throw an error when assigned a value to ${property} property`, () => {
				expect(() => {
					list[property] = {};
				}).toThrow();
			});
		}
	}
});
