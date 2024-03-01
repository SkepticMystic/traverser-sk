import { range } from '$lib/utils/array';

const int = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const random = {
	n: () => int(1, 25),
	skips: (n?: number) => range(int(1, 4)).map(() => int(0, n ?? 20))
};