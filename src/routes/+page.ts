import { schema } from '$lib/traverse/schema';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const input = schema.safeParse(Object.fromEntries(url.searchParams.entries()));

	if (!input.success) {
		error(400, input.error.issues[0].message);
	} else {
		return input.data;
	}
};
