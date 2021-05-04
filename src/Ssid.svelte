<script>

	import {getContext, createEventDispatcher} from "svelte";

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
	$: signal_hue = hue_red + (hue_green - hue_red) / 100 * (100+ssid.esp_signal)


	const dispatch = createEventDispatcher();

	function connect()
	{
		ssid.wfm_connection_dialog_open = !ssid.wfm_connection_dialog_open;
		if (ssid.wfm_connection_dialog_open)
		{
			dispatch('close_other');

		}
	}

	function connect2()
	{
		const msg = {
			cmd: 'connect',
			args: {'ssid': ssid.esp_ssid, 'pass': password},
			'ts': new Date()
		};
		/*var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://" + ssid.host + "/command", true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(msg));
		 */
		ws_send(msg);
	}


	function td_click(e)
	{
		if (e.target.classList.contains('row_clickable'))
			connect();
	}

	function init(el){
		el.focus()
	}

	let password = ssid.wfm_password;
	$: ssid.wfm_password = password;

</script>

	<td>
		<button on:click={connect}>connect</button>
	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable">

		{#if ssid.wfm_connection_dialog_open}
			<div class="framed">
				{ssid.esp_ssid}
				<br>
			  <form action="#" on:submit|preventDefault="{connect2}">
				<div class="form-inputs">
					<label>password:<br>
						<input type="password" autocomplete="123-let-me-in" use:init bind:value={password}/>
					</label>
				</div>
				<input type="submit" value="Connect!"/>
			  </form>
			</div>
		{:else}
			{ssid.esp_ssid}
		{/if}

	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable" style="background-color: hsl({signal_hue},100%,60%);">
		{ssid.esp_signal}
	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable" >
		{ssid.esp_chan}
	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable" >
		{ssid.esp_enc_type}
	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable" >
		{ssid.esp_bssid}
	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable" style="background-color: rgb({seen_red},{seen_green},0);">
		{ssid.wfm_last_seen_before}
	</td>
	<td>
		<details>
			<summary>...</summary>
			<pre>{JSON.stringify(ssid, null, ' ')}</pre>
		</details>
	</td>


<style>
    .framed {
        border: 3px inset rgba(128, 110, 164, 0.48);
        /*border-radius: 0px 17px 12px 13px;
        border-collapse: separate;
        border-spacing: 1em 0;
        width: 100%;*/
    }
</style>
