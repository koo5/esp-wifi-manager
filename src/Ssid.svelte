<script>

	import {getContext} from "svelte";

	export let ssid;

	const ws_send = getContext('ws_send');

	function clamp_color(x)
	{
		if (x<0)return 0;
		if (x>255)return 255;
		return x;
	}

	$: seen_red = clamp_color((ssid.wfm_last_seen_before) * 0.01);
	$: seen_green = clamp_color((25000 - ssid.wfm_last_seen_before) * 0.02);

	const hue_red = 0;
	const hue_green = 140;
	$: signal_hue = hue_red + (hue_green - hue_red) / 100 * ssid.signal;


	function connect()
	{
		const msg = {
			cmd: 'connect',
			args: {'ssid': ssid.ssid}
		};

		/*var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://" + ssid.host + "/command", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(msg));
		 */

		ws_send(msg);
	}


</script>

	<td>
		<button on:click={connect}>connect</button>
	</td>
	<td>
		{ssid.ssid}
	</td>
	<td style="background-color: hsl({signal_hue},100%,60%);">
		{ssid.signal}
	</td>
	<td>
		{ssid.chan}
	</td>
	<td style="background-color: rgb({seen_red},{seen_green},0);">
		{ssid.wfm_last_seen_before}
	</td>
	<td>
		<details>
			<summary>...</summary>
			<pre>{JSON.stringify(ssid, null, ' ')}</pre>
		</details>
	</td>
