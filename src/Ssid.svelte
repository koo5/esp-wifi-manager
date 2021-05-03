<script>

	import {getContext} from "svelte";
	import {get} from 'svelte/store';

	import {settings} from "./settings";

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
		ssid.wfm_connection_dialog_open = !ssid.wfm_connection_dialog_open;
	}

	function connect2()
	{
		const msg = {
			cmd: 'connect',
			args: {'ssid': ssid.ssid, 'pass': password},
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

	let password = get(settings).ssids?.[ssid.ssid]?.password || ssid.wfm_password;
	console.log('let password =' + password);
	$: console.log('password =' + password);
	//let password = ssid.wfm_password;
	$: updp($settings);
	function updp(s)
	{
		console.log('updp:' + JSON.stringify(s, null, ' '))
		password = s.ssids?.[ssid.ssid]?.password;
	}

	$: update_settings(password)
	function update_settings(password)
	{
		if (password === null) return;
		ssid.wfm_password = password;
		settings.update(x =>
		{
			console.log('update_settings x:' + JSON.stringify(x, null, ' '))
			let y = {...x};
			y.ssids = {...x.ssids||{}};
			y.ssids[ssid.ssid] = {...y.ssids[ssid.ssid]||{}}
			y.ssids[ssid.ssid].password = password
			console.log('update_settings y:' + JSON.stringify(y, null, ' '))
			return y
		});
	}

</script>

	<td>
		<button on:click={connect}>connect</button>
	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable">
		{ssid.ssid}
		<br>
		{#if ssid.wfm_connection_dialog_open}
		  <form action="#" on:submit|preventDefault="{connect2}">
			<div class="form-inputs">
				<label>password:<br>
					<input type="password" autocomplete="123-let-me-in" use:init bind:value={password}/>
				</label>
			</div>
			<input type="submit" value="Connect!"/>
		  </form>
		{/if}
	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable" style="background-color: hsl({signal_hue},100%,60%);">
		{ssid.signal}
	</td>
	<td on:click={(e)=>td_click(e)} class="row_clickable" >
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
