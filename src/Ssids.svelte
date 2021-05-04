<script>

	// https://github.com/mattiash/svelte-tablesort

	import {TableSort} from 'svelte-tablesort'
	import Ssid from './Ssid.svelte';


	export let items;
	export let can_connect;


	function close_other(except)
	{
		items.forEach((x) =>
		{
			if (x !== except)
				x.wfm_connection_dialog_open = false
		})
		items = items;
	}

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
		<Ssid {can_connect} on:close_other={() => close_other(item)} ssid={item}/>
	</tr>
</TableSort>
