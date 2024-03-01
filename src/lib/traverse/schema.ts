import { z } from 'zod';

export const schema = {
	n: z.coerce
		.number()
		.int()
		.min(1, 'n must be a positive number')
		.max(250, 'n must be less than 250'),

	steps: z.preprocess(
		(s) => {
			if (typeof s === 'string') {
				return s
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
					.map(Number);
			} else {
				return s;
			}
		},
		z.array(z.number().int()).min(1, 'steps must have at least one step')
	),

	delay_ms: z.coerce.number().min(0, 'delay_ms must be a positive number')
};
