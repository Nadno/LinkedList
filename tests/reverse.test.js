import LinkedList from '../';

describe('Method reverse', () => {
  const exampleList = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];

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
