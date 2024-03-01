<script lang="ts">
	export let label: string;
	export let filename: string;
	export let get_data: () => string | undefined;

	const download = () => {
		const data = get_data();
		if (data === undefined) return alert('No data to download');
		console.log('data', data);

		const element = document.createElement('a');

		element.setAttribute('href', data);
		element.setAttribute('download', filename);

		element.click();
	};
</script>

<button class="btn btn-sm btn-primary" on:click={download}>{label}</button>
