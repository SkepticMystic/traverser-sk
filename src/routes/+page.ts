import { random } from '$lib/traverse/random';
import { schema } from '$lib/traverse/schema';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const input = z
		.object({
			n: schema.n.default(random.n()),
			delay_ms: schema.delay_ms.default(250),
			steps: schema.steps.default(random.steps())
		})
		.safeParse(Object.fromEntries(url.searchParams.entries()));

	if (!input.success) {
		error(400, input.error.issues[0].message);
	} else {
		return input.data;
	}
};
