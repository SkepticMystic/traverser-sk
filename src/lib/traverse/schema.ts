import { CYTOSCAPE } from '$lib/const/cytoscape';
import { z } from 'zod';
import { random } from './random';

export const schema = z.object({
	n: z.coerce
		.number({ invalid_type_error: 'n must be an integer' })
		.int('n must be an integer')
		.min(1, 'n must be a positive number')
		.max(250, 'n must be less than 250')
		.default(random.n()),

	steps: z
		.preprocess(
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
			z
				.array(z.number().int('steps must be a comma-separated list of integers'), {
					invalid_type_error: 'steps must be a comma-separated list of integers',
					required_error: 'steps must be a comma-separated list of integers'
				})
				.min(1, 'steps must have at least one step')
		)
		.default(random.steps()),

	delay_ms: z.coerce
		.number({
			invalid_type_error: 'delay_ms must be a number'
		})
		.min(0, 'delay_ms must be a positive number')
		.default(250),

	curve_style: z.enum(CYTOSCAPE.CURVE_STYLES).default('haystack')
});

export type TraverseInput = z.infer<typeof schema>;
