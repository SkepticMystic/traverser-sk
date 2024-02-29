<script lang="ts">
	import type { Traversal } from '$lib/traverse';
	import { range } from '$lib/utils/array';
	import { sleep } from '$lib/utils/promise';
	import cytoscape from 'cytoscape';
	import { onMount } from 'svelte';

	export let traversal: Traversal;
	export let delay_ms = 0;

	let done = false;
	const { n, path } = traversal;

	onMount(async () => {
		const cy = cytoscape({
			container: document.getElementById('cy'), // container to render in

			elements: range(n).map((n) => ({
				data: {
					id: n.toString()
				}
			})),

			style: [
				// the stylesheet for the graph
				{
					selector: 'node',
					style: {
						'background-color': '#666',
						label: 'data(id)',
						width: 20,
						height: 20
					}
				},
				{
					selector: 'edge',
					style: {
						width: 3,
						'line-color': '#ccc',
						'target-arrow-color': '#ccc',
						'target-arrow-shape': 'triangle'
						// TODO: Customisable curve-style
					}
				}
			],
			layout: {
				name: 'circle'
			}
		});

		for (let i = 0; i < path.length - 1; i++) {
			const [source, target] = [path[i], path[i + 1]];

			cy.add({
				group: 'edges',
				data: { id: crypto.randomUUID(), source, target }
			});

			if (delay_ms) await sleep(delay_ms);
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

<div id="cy" style="max-width: 100%; height: 85vh; border: 1px solid #000;"></div>

{#if done}
	<p>Done</p>
{/if}
