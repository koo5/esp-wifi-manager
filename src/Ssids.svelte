<script>

	// https://github.com/mattiash/svelte-tablesort

	import {TableSort} from 'svelte-tablesort'
	import Ssid from './Ssid.svelte';


	export let items;


</script>


<TableSort items={items}>
	<tr slot="thead">
		<th>command</th>
		<th data-sort="esp_ssid" data-sort-initial="descending">SSID</th>
		<th data-sort="esp_signal">signal (RSSI)</th>
		<th data-sort="esp_chan">channel</th>
		<th data-sort="esp_enc_type">enc_type</th>
		<th data-sort="esp_bssid">BSSID</th>
		<th data-sort="wfm_last_seen_before">last seen (ms)</th>
		<th>raw (json)</th>
	</tr>
	<tr slot="tbody" let:item={item}>
		<Ssid ssid={item}/>
	</tr>
</TableSort>
