import LinkedList from '../';

describe('Linked list constructor', () => {
  const exampleList = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

  it('should be possible use constructor with many arguments as values to be assigned', () => {
    const list = new LinkedList(...exampleList);
    const expected = [...exampleList];

    expect(list.toArray()).toEqual(expected);
    expect(list.length).toBe(expected.length);
  });

  it('should set a max length when use constructor with one argument', () => {
    const expectedLength1 = Math.floor(exampleList.length / 2);
    const expectedLength2 = exampleList.length;

    const list = new LinkedList(expectedLength1),
      list2 = new LinkedList(expectedLength2),
      expected = [...exampleList];

    list.push(...exampleList);
    list.push(...exampleList);
    list.unshift(...exampleList);

    list2.push(...exampleList);
    list2.push(...exampleList);
    list2.unshift(...exampleList);

    expect(list.toArray()).toEqual(expected.slice(0, expectedLength1));
    expect(list2.toArray()).toEqual(expected);

    expect(list.length).toEqual(expectedLength1);
    expect(list2.length).toEqual(expectedLength2);
  });

  it('should be possible use for...of in LinkedList', () => {
    const list = new LinkedList(...exampleList);
    let result = '';

    for (let letter of list) {
      result += letter;
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