<script>
	import {onMount} from "svelte";

	import _ from 'underscore';
	import WebSocketClient from "js-websocket-reconnect-client";

	export let url = "ws://localhost:8080/svelte/ws/";
	//$: console.log(url);

	$: ws = make_ws(url);
	let connection_attempts = 0;
	let ws_current_state = null;

	function update_ws_current_state()
	{
		ws_current_state = ws?.getCurrentState();
	}

	onMount(() =>
	{
		setInterval(() =>
		{
			maybe_reconnect();
			tick();
		}, 5000);
	});

	function maybe_reconnect()
	{
		push('...');
		update_ws_current_state();
		if (['OPEN', 'CONNECTING'].indexOf(ws_current_state) === -1)
		{
			push('try reconnect');
			connection_attempts++;
			url = url
		}
	}

	function make_ws(url)
	{
		ws?.close();
		push('connect to ' + url);
		const protocols = [];
		const options = {
			shouldReconnect: true,
			reconnectRetryTimeout: 2000, // seems to be limited by browser instead.
			parsedMessage: false,
			reconnectRetryMaxNumber: null,
			debug: false,
		}
		try
		{
			let ws = new WebSocketClient(url, protocols, options);
			ws.addOnMessageHandler((m) =>
				{
					try
					{
						var message = JSON.parse(m);
						var ok = true;
					} catch
						(e)
					{
						push({'type': 'msg_parsing_error', 'msg': e, 'original': m});
					}
					if (ok)
						push({'type': 'msg', 'event': message});
				}
			);
			ws.addOnOpenHandler(m => push({'type': 'opened', 'event': m}));
			ws.addOnCloseHandler(m => push({'type': 'closed', 'event': m}));
			ws.addOnErrorHandler(m => push({'type': 'error', 'event': m}));
			ws.connect();
			push('connection initiated..');
			return ws;
		} catch // doesnt seem to ever happen
			(e)
		{
			push(e);
		}
	}

	var messages = [];
	var last_msg_id = 0;

	function push(x)
	{
		update_ws_current_state();
		console.log(x);
		let obj = {
			ts: new Date(),
			msg: (x),
			id: last_msg_id++
		}
		let e = x['event']
		if (e)
		{
			obj['msg']['event_details'] = {
				'reason': e['reason'],
				'code': e['code'],
				'type': e['type']
			}
		}
		console.log(obj);
		messages.unshift(obj);
		messages = messages.slice(0, 333);

		if (obj.msg.type === 'msg_parsing_error')
		{
			ssids[obj.msg.original] = {
				ts: obj.ts,
				signal: 'good',
				last_seen_before: 0
			}
			ssids = ssids;
		}
	}

	let ssids = {};
	$: ssid_names = _.sortBy(Object.keys(ssids));

	function tick()
	{
		let now = new Date();
		Object.entries(ssids).forEach(x =>
		{
			const [name, item] = x;
			item.last_seen_before = now - item.ts;
		});
		ssids = ssids
	}

</script>

<h5>Connection</h5>
<table>
	<tr>
		<th>URL</th>
		<th>ws_current_state</th>
		<th>connection_attempts</th>
		<th>ws</th>
	</tr>
	<tr>
		<td>
			<input bind:value={url}>
		</td>
		<td>
			{JSON.stringify(ws_current_state)}
		</td>
		<td>
			{connection_attempts.toString()}
		</td>
		<td>
			<details>
				<summary>ws</summary>
				<pre>{JSON.stringify(ws, null, ' ')}</pre>
			</details>
		</td>
	</tr>
</table>

<h5>Scan</h5>
<table>
	<tr>
		<th>SSID</th>
		<th>signal</th>
		<th>old(ms)</th>
		<th>ts</th>
		<th>raw(json)</th>
	</tr>
	{#each ssid_names as name}
		<tr>
			<td>
				{name}
			</td>
			<td>
				{ssids[name].signal}
			</td>
			<td>
				{ssids[name].last_seen_before}
			</td>
			<td>
			<details>
				<summary>...</summary>
				{ssids[name].ts}
			</details>
			</td>
			<td>
			<details>
				<summary>...</summary>
				<pre>{JSON.stringify(ssids[name], null, ' ')}</pre>
			</details>
			</td>
		</tr>
	{/each}
</table>


<h5>Events</h5>
<table>
	<tr>
		<th>ID</th>
		<th>...</th>
	</tr>
	{#each messages as m}
		<tr>
			<td>
				{m.id}
			</td>
			<td>
				<small>{m.ts}</small>:
				<br>
				<b>
					{JSON.stringify(m.msg, null, '')}
				</b>
				<br>
			</td>
		</tr>
	{/each}
</table>


<style>
    table {
        margin: 0;
        border: 1px inset rgba(128, 110, 164, 0.48);
        border-radius: 0px 17px 12px 13px;
        border-collapse: separate;
        border-spacing: 1em 0;
    }
</style>
