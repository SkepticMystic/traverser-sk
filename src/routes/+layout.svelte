<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { inject } from '@vercel/analytics';

	onMount(() => {
		inject();
	});
</script>

<div class="mx-auto max-w-4xl my-3 px-3">
	<slot />
</div>
