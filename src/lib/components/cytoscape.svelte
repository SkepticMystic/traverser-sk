<script lang="ts">
	import type { Traversal } from '$lib/traverse';
	import type { TraverseInput } from '$lib/traverse/schema';
	import { range } from '$lib/utils/array';
	import { sleep } from '$lib/utils/promise';
	import cytoscape from 'cytoscape';
	import { onMount } from 'svelte';

	export let traversal: Traversal;
	export let input: TraverseInput;

	let done = false;
	const { n, path } = traversal;

	onMount(async () => {
		const cy = cytoscape({
			container: document.getElementById('cy'),

			elements: range(n).map((n) => ({
				data: {
					id: n.toString()
				}
			})),

			style: [
				{
					selector: 'node',
					style: {
						'background-color': '#666',
						label: 'data(id)',
						'font-size': '16px',
						width: 15,
						height: 15
					}
				},
				{
					selector: 'edge',
					style: {
						width: 3,
						'line-color': '#ccc',
						'target-arrow-color': '#ccc',
						'target-arrow-shape': 'triangle',
						'curve-style': input.curve_style
					}
				}
			],
			layout: {
				name: 'circle',
				clockwise: true
			}
		});

		for (let i = 0; i < path.length - 1; i++) {
			const [source, target] = [path[i], path[i + 1]];

			cy.add({
				group: 'edges',
				data: { id: crypto.randomUUID(), source, target }
			});

			if (input.delay_ms) await sleep(input.delay_ms);
		}

		// Close the loop
		cy.add({
			group: 'edges',
			data: {
				id: crypto.randomUUID(),
				source: path.at(-1),
				target: path[0]
			}
		});

		done = true;
	});
</script>

<div
	id="cy"
	style="margin: 0 auto; max-width: 100%; border: 1px solid #ccc"
	class="h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
></div>

<p>{done ? 'Done' : 'Running...'}</p>
