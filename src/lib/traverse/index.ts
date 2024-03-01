import { MAX_ITERATIONS } from '../const/index';

export type TraverseInput = {
	n: number;
	steps: number[];
};

export const traverse = ({ n, steps }: TraverseInput) => {
	console.log('input:', { n, steps });

	if (n < 1) {
		throw new Error('n must be a positive integer');
	} else if (steps.length === 0) {
		throw new Error("steps can't be empty");
	}

	let iter = 0,
		step_i = 0,
		point = 0;

	const path: number[] = [];

	// Continue until getting back to the start, using the same step
	while (point !== 0 || step_i !== 0 || path.length === 0) {
		if (iter++ > MAX_ITERATIONS) {
			throw new Error('Infinite loop detected');
		}

		path.push(point);

		point = (point + steps[step_i]) % n;
		step_i = (step_i + 1) % steps.length;
	}

	return { n, steps, path };
};

export type Traversal = ReturnType<typeof traverse>;

// export const name_traversal = ({ n, steps }: TraverseInput) =>
// 	`${n}_${steps.map((s) => s % n).join('-')}`;
