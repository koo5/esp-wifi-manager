<script>

	export let ssid;

	function clamp_color(x)
	{
		if (x<0)return 0;
		if (x>255)return 255;
		return x;
	}

	$: seen_red = clamp_color((ssid.last_seen_before) * 0.01);
	$: seen_green = clamp_color((25000 - ssid.last_seen_before) * 0.02);

	const hue_red = 0;
	const hue_green = 140;
	$: signal_hue = hue_red + (hue_green - hue_red) / 100 * ssid.value.signal;


	function connect()
	{
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://" + ssid.host + "/command", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify({
			cmd: 'connect',
			args: {'ssid': ssid.value.ssid}
		}));
	}


</script>

<tr>
	<td>
		<button on:click={connect()}>connect</button>
	</td>
	<td>
		{ssid.value.ssid}
	</td>
	<td style="border:2px solid hsl({signal_hue},100%,60%);">
		{ssid.value.signal}
	</td>
	<td style="border:2px solid rgb({seen_red},{seen_green},0);">
		{ssid.last_seen_before}
	</td>
	<td>
		{ssid.chan}
	</td>
	<td>
		<details>
			<summary>...</summary>
			<pre>{JSON.stringify(ssid, null, ' ')}</pre>
		</details>
	</td>
</tr>
