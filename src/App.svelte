<script>

	import List from './List.svelte';

	let url = "ws://localhost:8080/svelte/ws/";
	$: console.log(url);

</script>

<div class="App">
	<input bind:value={url}>

	<List {url}/>
	<a class="App-link" href="https://svelte.dev" target="_blank" rel="noopener noreferrer">
		Learn Svelte
	</a>
	<a class="App-link" href="https://github.com/koo5/esp-wifi-manager" target="_blank" rel="noopener noreferrer">
		Code
	</a>

</div>

<style>
    body {
        font-family: Montserrat, sans-serif;
    }
</style>
