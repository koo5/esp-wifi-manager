<script>
	import {onMount} from "svelte";

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
			update_ws_current_state();
			if (!['OPEN','CONNECTING'].indexOf(ws_current_state))
			{
				connection_attempts++;
				url = url
			}
		}, 5000);
	});

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
					}
				catch
					(e)
					{
						push({'type': 'msg_parsing_error', 'event': e, 'original': m});
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

	function push(x)
	{
		update_ws_current_state();
		console.log(x);
		let obj = {
			ts: new Date(),
			msg: (x)
		}
		let e = x['event']
		if (e)
		{
			obj['reason'] = e['reason']
			obj['code'] = e['code']
			obj['type'] = e['type']
		}
		console.log(obj);
		messages.push(obj);
		messages = messages;
	}

	$: messages_reversed = [...messages].reverse();

</script>
<div>
	ws_current_state: {JSON.stringify(ws_current_state)}<br>
	connection_attempts:{connection_attempts.toString()}<br>

	<details>
		<summary>ws</summary>
		<pre>{JSON.stringify(ws, null, ' ')}</pre>
	</details>
	<ol reversed>
		{#each messages_reversed as message}
			<li>
				{JSON.stringify(message, null, ' ')}
			</li>
		{/each}
	</ol>
</div>

<style>
</style>
