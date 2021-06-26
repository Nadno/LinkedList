import LinkedList from '../LinkedArray';

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
  const SORT_FN = (a, b) => a < b;
  it('should insert all values in crescent order', () => {
    const list = new LinkedList();
    let expected = [
      'Gabriel',
      'Gael',
      'Guevin',
      'Guilherme',
      'Guilherme',
      'Gustavo',
      'Gustavo',
    ];

    expected.forEach(name => list.insertSort(name, SORT_FN));

    expect(list.toArray()).toEqual(expected);
    expect(list.length).toEqual(expected.length);
  });

  it('should insert all values in decrescent order when the list were reversed', () => {
    const list = new LinkedList();
    let expected = [
      'Gabriel',
      'Gael',
      'Guevin',
      'Guilherme',
      'Guilherme',
      'Gustavo',
      'Gustavo',
    ];

    expected.forEach(name => list.insertSort(name, SORT_FN));
    list.reverse();

    expect(list.toArray()).toEqual(expected.reverse());
    expect(list.length).toEqual(expected.length);
  });
});
