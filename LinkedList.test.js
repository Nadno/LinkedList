import LinkedList from './LinkedList';

describe('LinkedList', () => {
  const exampleList = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

  describe('Constructor', () => {
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

  describe('Method forEach', () => {
    it('should iterate for each value into the list', () => {
      const list = new LinkedList(...exampleList);
      let result = '';

      list.forEach(letter => {
        result += letter;
      });

      expect(result).toBe('hello world');
    });

    it('should iterate for each node into the list', () => {
      const list = new LinkedList(...exampleList);
      let expectedNode = list.start;

      list.forEach(
        node => {
          expect(node === expectedNode).toBe(true);
          expectedNode = node.next;
        },
        { includeNodes: true }
      );
    });

    it('should iterate for each value into the list starting by the end and ending by the start', () => {
      const list = new LinkedList(...exampleList);
      let expectedNode = list.end;

      list.forEach(
        node => {
          expect(node === expectedNode).toBe(true);
          expectedNode = node.prev;
        },
        { includeNodes: true, reversed: true }
      );
    });
  });

  describe('Method at', () => {
    it('should get the node at passed index', () => {
      const list = new LinkedList(...exampleList);

      list.forEach(
        (node, index) => {
          expect(node === list.at(index)).toBe(true);
        },
        { includeNodes: true }
      );
    });
  });

  describe('Method forEachAt', () => {
    it('should return just a list with valid indexes', () => {
      const list = new LinkedList(...exampleList);
      const expected = [];

      list.forEachAt(
        node => {
          expected.push(node.value);
        },
        [0, 4, 11, 15]
      );

      const [first, second, third, fourth] = expected;

      expect(first).toBe(exampleList[0]);
      expect(second).toBe(exampleList[4]);
      expect(third).toBeUndefined();
      expect(fourth).toBeUndefined();
    });

    it('should iterate for each node at the passed indexes', () => {
      const list = new LinkedList(...exampleList);
      const indexes = [0, 2, 3, 6];

      list.forEachAt(node => {
        expect(node.value).toBe(exampleList[indexes.shift()]);
      }, indexes.slice());
    });

    it('should iterate for each node at the passed negative indexes', () => {
      const list = new LinkedList(...exampleList);
      const indexes = [-0, -2, -3, -6];

      list.forEachAt(node => {
        expect(node === list.at(indexes.shift())).toBe(true);
      }, indexes.slice());
    });

    it('should iterate for each node at the passed negative indexes when the list were reversed', () => {
      const list = new LinkedList(...exampleList);
      const indexes = [-0, -2, -3, -6];

      list.reverse();

      list.forEachAt(node => {
        expect(node === list.at(indexes.shift())).toBe(true);
      }, indexes.slice());
    });

    it('should works when the list were reversed', () => {
      const list = new LinkedList(...exampleList);
      const array = [...exampleList];
      const indexes = [0, 2, 3, 6];

      list.reverse();
      array.reverse();

      list.forEachAt(node => {
        expect(node.value).toBe(array[indexes.shift()]);
      }, indexes.slice());
    });
  });

  describe('Method nodesAt', () => {
    it('should return a array of nodes from passed indexes', () => {
      const list = new LinkedList(...exampleList);
      const [node1, node2] = list.nodesAt(1, 4);

      expect(exampleList[1]).toBe(node1.value);
      expect(exampleList[4]).toBe(node2.value);
    });

    it('should works exactly when used after the reverse method', () => {
      const list = new LinkedList(...exampleList);

      list.reverse().forEach((value, index) => {
        const [expected] = list.nodesAt(index);
        expect(value).toBe(expected.value);
      });
    });
  });

  describe('Method valuesAt', () => {
    it('should return a array of values from passed indexes', () => {
      const list = new LinkedList(...exampleList);
      const [expected1, expected2] = list.valuesAt(1, 4);

      expect(exampleList[1]).toBe(expected1);
      expect(exampleList[4]).toBe(expected2);
    });

    it('should works exactly when used after the reverse method', () => {
      const list = new LinkedList(...exampleList);

      list.reverse().forEach((value, index) => {
        const [expected] = list.valuesAt(index);
        expect(value).toBe(expected);
      });
    });
  });

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

  describe('Method reverse', () => {
    const list = new LinkedList(...exampleList);
    const reversedHelloWorld = exampleList.slice().reverse().join('');

    const { start, end } = list;
    list.reverse();

    it('should reverse the start and end node', () => {
      expect(end === list.start).toBe(true);
      expect(start === list.end).toBe(true);
    });

    it('should reverse the direction of for...of iteration', () => {
      let result = '';

      for (let letter of list) {
        result += letter;
      }

      expect(result).toBe(reversedHelloWorld);
    });

    it('should reverse the direction of forEach', () => {
      let result = '';

      list.forEach(letter => (result += letter));

      expect(result).toBe(reversedHelloWorld);
    });

    it('should works equal to reverse a normal array', () => {
      const list = new LinkedList(...exampleList);
      const array = [...exampleList];

      list.reverse();
      array.reverse();

      list.push(...exampleList);
      array.push(...exampleList);

      list.unshift(exampleList.slice().reverse());
      array.unshift(exampleList.slice().reverse());

      expect(list.toArray()).toEqual(array);
      expect(list.length).toEqual(array.length);

      list.reverse();
      array.reverse();

      expect(list.toArray()).toEqual(array);
      expect(list.length).toEqual(array.length);
    });
  });

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

  describe('Method moveNove', () => {
    const list = new LinkedList(...exampleList);
    const expectedLength = list.length;

    it('should move an element for each possible index', () => {
      let current = list.length - 1;
      const node = list.end;

      list.forEach((_, index) => {
        list.moveNode({ at: current, to: index });
        expect(list.at(index).value).toBe(node.value);

        current = index;
      });

      expect(list.length).toBe(expectedLength);
    });

    it('should move an element for each possible index, using a negative index', () => {
      let current = 0;
      const node = list.start;

      list.forEach((_, index) => {
        list.moveNode({ at: current, to: -index });
        expect(list.at(-index).value).toBe(node.value);

        current = -index;
      });

      expect(list.length).toBe(expectedLength);
    });

    it('should move nodes to exactly random indexes', () => {
      const maxIndex = list.length - 1;

      list.forEach(() => {
        const atIndex = Math.floor(Math.random() * maxIndex);
        const toIndex = Math.floor(Math.random() * maxIndex);

        const expected = list.at(atIndex).value;
        list.moveNode({ at: atIndex, to: toIndex });

        expect(list.at(toIndex).value).toBe(expected);
      });

      expect(list.length).toBe(expectedLength);
    });
  });
});
