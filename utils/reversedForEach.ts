export default function reversedForEach<T extends any[]>(
	values: T,
	cb: (value: T[number], index: number, array: T) => any
) {
	let index = values.length - 1;
	const to = 0;

	for (; index >= to; index--) {
		cb(values[index], index, values);
	}
}
