<script lang="ts">
	import Cytoscape from '$lib/components/cytoscape.svelte';
	import { traverse, type TraverseInput } from '$lib/traverse';
	import { range } from '$lib/utils/array';
	import { random_int } from '$lib/utils/random';

	const input: TraverseInput = {
		n: 10,
		skips: [1, 3, 0]
	};

	let delay_ms = 500;

	const randomise = () => {
		input.n = random_int(1, 75);
		input.skips = range(random_int(1, 10)).map(() => random_int(0, input.n - 1));
	};

	let restart = false;

	$: if (restart) {
		restart = false;
	}
</script>

<div class="flex flex-col">
	<label>
		<span>Number of nodes</span>
		<input type="number" min={1} max={100} bind:value={input.n} />
	</label>

	<label>
		<span>Skips</span>

		<input
			type="text"
			value={input.skips.join(', ')}
			on:change={(e) => {
				const skips = e.currentTarget.value.split(',').map((s) => parseInt(s.trim()));
				if (skips.length === 0) {
					alert("Invalid input, skips can't be empty");
				} else if (skips.some((s) => Number.isNaN(s))) {
					alert('Invalid input, skips must be numbers');
				} else {
					input.skips = skips;
				}
			}}
		/>
	</label>

	<label>
		<span>Delay (ms)</span>
		<input type="number" min={0} max={10_000} bind:value={delay_ms} />
	</label>

	<button on:click={randomise}>Randomise</button>

	<button on:click={() => (restart = true)}>Restart</button>
</div>

{#key input || restart}
	<Cytoscape {delay_ms} traversal={traverse(input)} />
{/key}
