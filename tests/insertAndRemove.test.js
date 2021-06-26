import LinkedList from '../LinkedArray';

const exampleList = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

describe('Methods push and unshift', () => {
  const insertMethods = ['push', 'unshift'];

  for (const method of insertMethods) {
    describe(method, () => {
      it(`should be equal to javascript ${method}`, () => {
        const list = new LinkedList();
        list[method]('a', 'b', 'c');
        list[method]('d');
        list[method]('e', 'f', 'g', 'h');

        const expected = [];
        expected[method]('a', 'b', 'c');
        expected[method]('d');
        expected[method]('e', 'f', 'g', 'h');

        expect(list.toArray()).toEqual(expected);
        expect(list.length).toBe(expected.length);
      });

      it('should works when used after reverse method', () => {
        const list = new LinkedList(-2, -1, 0);
        const expected = [-2, -1, 0];

        list.reverse();
        expected.reverse();

        list[method](1);
        list[method](2, 3, 4, 5);

        expected[method](1);
        expected[method](2, 3, 4, 5);

        expect(list.toArray()).toEqual(expected);
        expect(list.length).toBe(expected.length);
      });
    });
  }
});

describe('Methods pop and shift', () => {
  const removeMethods = ['pop', 'shift'];

  for (const method of removeMethods) {
    describe(method, () => {
      const list = new LinkedList(...exampleList);

      it('expect a empty list', () => {
        const expected =
          method === 'pop'
            ? exampleList.slice(0, exampleList.length - 3)
            : exampleList.slice(3);

        list[method]();
        list[method]();
        list[method]();

        expect(list.toArray()).toEqual(expected);
        expect(list.length).toBe(expected.length);
      });

      it('should return undefined if already empty', () => {
        list.forEach(() => list[method](), { reversed: method === 'pop' });

        expect(list[method]()).toBeUndefined();
        expect(list.length).toBe(0);
      });

      it('should works when used after reverse method', () => {
        const expected = exampleList.slice();
        list.push(...exampleList);

        list.reverse();
        expected.reverse();

        list[method]();
        list[method]();
        list[method]();
        list[method]();

        expected[method]();
        expected[method]();
        expected[method]();
        expected[method]();

        expect(list.toArray()).toEqual(expected);
        expect(list.length).toBe(expected.length);
      });
    });
  }
});

describe('Method remove', () => {
  it('should remove the passed node', () => {
    const list = new LinkedList(...exampleList);
    const [h, whiteSpace, d] = list.nodesAt(0, 5, list.length - 1);

    list.remove(h);
    list.remove(whiteSpace);
    list.remove(d);

    expect(list.toArray().join('')).toBe('elloworl');
    expect(list.length).toBe(exampleList.length - 3);
  });
});
