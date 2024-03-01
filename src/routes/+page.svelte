<script lang="ts">
	import Cytoscape from '$lib/components/cytoscape.svelte';
	import { traverse } from '$lib/traverse';
	import { random } from '$lib/traverse/random.js';
	import { schema } from '$lib/traverse/schema.js';

	export let data;

	let restart = false;

	const on_change_skips = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const parsed = schema.skips.safeParse(e.currentTarget.value);

		if (!parsed.success) {
			alert(parsed.error.message);
		} else {
			data.skips = parsed.data;
		}
	};

	const randomise = () => {
		data.n = random.n();
		data.skips = random.skips(data.n);
	};

	const copy_link = () => {
		const url = new URL(window.location.href);

		url.searchParams.set('n', data.n.toString());
		url.searchParams.set('skips', data.skips.join(','));
		url.searchParams.set('delay_ms', data.delay_ms.toString());

		navigator.clipboard.writeText(url.toString());
	};

	$: if (restart) {
		restart = false;
	}
</script>

<div class="flex flex-col">
	<label>
		<span>Number of nodes</span>
		<input type="number" min={1} max={100} bind:value={data.n} />
	</label>

	<label>
		<span>Skips</span>
		<input type="text" value={data.skips.join(', ')} on:change={on_change_skips} />
	</label>

	<label>
		<span>Delay (ms)</span>
		<input type="number" min={0} max={10_000} bind:value={data.delay_ms} />
	</label>

	<button on:click={randomise}>Randomise</button>

	<button on:click={() => (restart = true)}>Restart</button>

	<button on:click={copy_link}>Copy Link</button>
</div>

{#key data || restart}
	<Cytoscape delay_ms={data.delay_ms} traversal={traverse(data)} />
{/key}
