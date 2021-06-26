import LinkedList from '../LinkedArray';

describe('Method forEach', () => {
  const exampleList = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

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

    list.forEach((_, node) => {
      expect(node === expectedNode).toBe(true);
      expectedNode = node.next;
    });
  });

  it('should iterate for each value into the list starting by the end and ending by the start', () => {
    const list = new LinkedList(...exampleList);
    let expectedNode = list.end;

    list.forEach(
      (_, node) => {
        expect(node === expectedNode).toBe(true);
        expectedNode = node.prev;
      },
      { reversed: true }
    );
  });
});
