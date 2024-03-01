import { random } from '$lib/traverse/random';
import { schema } from '$lib/traverse/schema';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const input = z
		.object({
			delay_ms: schema.delay_ms.default(250),
			n: schema.n.default(random.n()),
			skips: schema.skips.default(random.skips())
		})
		.safeParse(Object.fromEntries(url.searchParams.entries()));

	if (!input.success) {
		error(400, input.error.issues[0].message);
	} else {
		return input.data;
	}
};
