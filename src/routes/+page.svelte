<script lang="ts">
	import Cytoscape from '$lib/components/cytoscape.svelte';
	import { CYTOSCAPE } from '$lib/const/cytoscape';
	import { traverse } from '$lib/traverse';
	import { random } from '$lib/traverse/random.js';
	import { schema } from '$lib/traverse/schema.js';

	export let data;

	let restart = false;

	const on_change_steps = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		const parsed = schema.shape.steps.safeParse(e.currentTarget.value);

		if (!parsed.success) {
			alert(parsed.error.message);
		} else {
			data.steps = parsed.data;
		}
	};

	const randomise = () => {
		data.n = random.n();
		data.steps = random.steps(data.n);
	};

	const copy_link = () => {
		const url = new URL(window.location.href);

		url.searchParams.set('n', data.n.toString());
		url.searchParams.set('steps', data.steps.join(','));
		url.searchParams.set('curve_style', data.curve_style);
		url.searchParams.set('delay_ms', data.delay_ms.toString());

		navigator.clipboard.writeText(url.toString());
	};

	$: if (restart) {
		restart = false;
	}
</script>

<p class="text-lg">
	Given <code>n</code> nodes, and a list of <code>steps</code>, start at node
	<code>0</code>, take the first step, then the second, and so on. Stop once you reach node
	<code>0</code>
	again, <em>on the last step in the list</em>.
</p>

<div class="flex gap-4 items-center flex-wrap my-3">
	<label class="flex items-center gap-1">
		<span class="font-semibold">Nodes</span>
		<input class="input input-bordered input-sm w-20" type="number" min={1} bind:value={data.n} />
	</label>

	<label class="flex items-center gap-1">
		<span class="font-semibold">Steps</span>
		<input
			class="input input-bordered input-sm w-32"
			type="text"
			value={data.steps.map((s) => s % data.n).join(', ')}
			on:change={on_change_steps}
		/>
	</label>

	<label class="flex items-center gap-1">
		<span class="font-semibold">Delay (ms)</span>
		<input
			class="input input-bordered input-sm w-24"
			type="number"
			min={0}
			max={10_000}
			bind:value={data.delay_ms}
		/>
	</label>

	<label class="flex items-center gap-1">
		<span class="font-semibold">Curve Style</span>

		<select class="select select-sm select-bordered" bind:value={data.curve_style}>
			{#each CYTOSCAPE.CURVE_STYLES as style}
				<option value={style}>{style}</option>
			{/each}
		</select>
	</label>
</div>

<div class="flex gap-3 items-center flex-wrap my-3">
	<button class="btn btn-sm btn-primary" on:click={randomise}>Randomise</button>

	<button class="btn btn-sm btn-primary" on:click={() => (restart = true)}>Restart</button>

	<button class="btn btn-sm btn-primary" on:click={copy_link}>Copy Link</button>
</div>

{#key data || restart}
	<Cytoscape input={data} traversal={traverse(data)} />
{/key}
