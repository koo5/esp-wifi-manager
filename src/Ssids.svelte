<script>

	// https://github.com/mattiash/svelte-tablesort

	import {TableSort} from 'svelte-tablesort'
	import Ssid from './Ssid.svelte';


	export let items;

</script>


<TableSort items={items}>
	<tr slot="thead">
		<th></th>
		<th data-sort="ssid" data-sort-initial="descending">SSID</th>
		<th data-sort="signal">signal</th>
		<th data-sort="chan">chan</th>
		<th data-sort="wfm_last_seen_before">last seen (ms)</th>
		<th>raw (json)</th>
	</tr>
	<tr slot="tbody" let:item={item}>
		<Ssid ssid={item}/>
	</tr>
</TableSort>
