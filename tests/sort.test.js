import LinkedList from '../';

describe('Method sort', () => {
  it('should sort the list', () => {
    const radomNumber = () => Math.round(Math.random() * 100);
    const list = new LinkedList();
    const expected = [];

    let count = 0;
    while (count < 100) {
      const random = radomNumber();
      list.push(random);
      expected.push(random);

      count++;
    }

    list.sort();
    expected.sort((a, b) => a - b);

    expect(list.toArray()).toEqual(expected);
  });
});

describe('Method insertSort', () => {
  it('should insert all values in crescent order', () => {
    const list = new LinkedList('b', 'c', 'd');
    const expected = ['a', 'b', 'b', 'c', 'd', 'e', 'f'];

    list.insertSort('b');
    list.insertSort('e');
    list.insertSort('a');
    list.insertSort('f');

    expect(list.toArray()).toEqual(expected);
    expect(list.length).toEqual(expected.length);
  });

  it('should insert all values in decrescent order when the list were reversed', () => {
    const list = new LinkedList();
    const expected = ['a', 'b', 'b', 'c', 'd', 'e', 'f'].reverse();

    list.reverse();

    list.insertSort('b');
    list.insertSort('c');
    list.insertSort('d');
    list.insertSort('b');
    list.insertSort('e');
    list.insertSort('a');
    list.insertSort('f');

    expect(list.toArray()).toEqual(expected);
    expect(list.length).toEqual(expected.length);
  });
});