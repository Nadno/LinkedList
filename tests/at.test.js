import LinkedList from '../';

describe('At methods', () => {
  const exampleList = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

  describe('Method at', () => {
    it('should get the node at passed index', () => {
      const list = new LinkedList(...exampleList);

      list.forEach(
        (node, index) => {
          expect(node).toBe(list.at(index));
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
});
