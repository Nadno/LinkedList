import LinkedList from '../LinkedArray';

describe('Method moveNove', () => {
  const exampleList = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

  const list = new LinkedList(...exampleList);
  const expectedLength = list.length;

  it('should move an element for each possible index', () => {
    let current = list.length - 1;
    const node = list.end;

    list.forEach((_, __, index) => {
      list.moveNode({ at: current, to: index });
      expect(list.at(index).value).toBe(node.value);

      current = index;
    });

    expect(list.length).toBe(expectedLength);
  });

  it('should move an element for each possible index, using a negative index', () => {
    let current = 0;
    const node = list.start;

    list.forEach((_, __, index) => {
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
