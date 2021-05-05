<script>

	import dayjs from 'dayjs/esm';
	import _ from 'underscore';
	import {onMount,setContext} from "svelte";
	import WebSocketClient from "js-websocket-reconnect-client";
	import Ssids from './Ssids.svelte';


	const params = new URLSearchParams(window.location.search);

	export let host = params.get('ws') || "localhost:8080";

	function url_from_host(host)
	{
		return "ws://" + host + "/wifi/ws";
	}

	let url = url_from_host(host);
	$: url = url_from_host(host);
	$: console.log("url = "+url);

	let url_debounced = url;
	$: debounce_url(url)

	let url_debounce_timer;
	function debounce_url(url)
	{
		url_debounce_timer = setTimeout(() =>
		{
			url_debounced = url;
		},
		1000)
	}

	$: ws = make_ws(url_debounced, connection_attempts);


	let connection_attempts = 0;
	let now;
	let last_message_ts;
	let last_connect_attempt_ts;
	$: last_message_ago = now - last_message_ts;

	$: ws_current_state = ws?.getCurrentState();
	function update_ws_current_state()
	{
		ws_current_state = ws?.getCurrentState();
	}

	onMount(() =>
	{
		setInterval(() =>
		{
			now = new Date();
			update_ssid_last_seens();
			//maybe_reconnect();
		}, 5000);
	});

	$: can_connect = ['OPEN', 'CONNECTING'].indexOf(ws_current_state) !== -1;

	function maybe_reconnect()
	{
		push('...');
		update_ws_current_state();
		if (
			(
				last_message_ago > 10000
				||
				Number.isNaN(last_message_ago)
				||
				!can_connect
			)
			&&
			((now - last_connect_attempt_ts) > 10000)
		)
		{
			push('try reconnect');
			connection_attempts++;
		}
	}

	function make_ws(url)
	{
		last_connect_attempt_ts = new Date();
		ws?.close(false);
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
			/* todo , gut this library, and try avoiding creating more than one WebSocket object, and just calling close and open on it, possibly repeatedly? */
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
						push({'type': 'msg', 'value': message});
				}
			);
			ws.addOnOpenHandler(m => push({'type': 'opened', 'event': m}));
			ws.addOnCloseHandler(m => push({'type': 'closed', 'event': m}));
			ws.addOnErrorHandler(m => push({'type': 'error', 'event': m}));
			ws.connect();
			return ws;
		} catch
			(e)
		{
			push('error:'+JSON.stringify(e));
		}
	}

	var messages = [];
	var last_msg_id = 0;

	function push(x)
	{
		console.log(x);
		update_ws_current_state();
		let obj = {
			ts: new Date(),
			msg: x,
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
		//console.log(obj);
		messages.unshift(obj);
		messages = messages.slice(0, 333);

		if (obj.msg.type === 'msg')
		{
			let value = obj.msg.value;
			last_message_ts = new Date();
			let v = value['found-ap'];
			if (v)
			{
				const bssid = v['BSSID'];
				ssids[bssid] = {

					wfm_connection_dialog_open: ssids?.[bssid]?.wfm_connection_dialog_open,
					wfm_password: ssids?.[bssid]?.wfm_password,

					value: v,

					wfm_host: host,
					wfm_ts: obj.ts,
					wfm_last_seen_before: 0,

					esp_ssid: v['SSID'],
					esp_signal: v['RSSI'],
					esp_chan: v['channel'],
					esp_enc_type: v['encType'],
					esp_bssid: bssid,

				}
				ssids = ssids;
			}
		}
	}

	let ssids = {};
	$: ssid_values = Object.values(ssids);

	function update_ssid_last_seens()
	{
		Object.entries(ssids).forEach(x =>
		{
			const [name, item] = x;
			item.wfm_last_seen_before = now - item.wfm_ts;
		});
		ssids = ssids
	}

	function ws_send(json)
	{
		push(json);
		return ws?.send(json)
	}

	setContext('ws_send', ws_send);

	function scan()
	{
		return ws_send({'command':'do-wifiscan'})
	}

</script>

<h5>Connection</h5>
<table class="framed">
	<tr>
		<th>host</th>
		<th>ws url</th>
		<th>command</th>
		<th>ws_current_state</th>
		<th>last_message (ms)</th>
		<th>connection_attempts</th>
		<th>ws</th>
	</tr>
	<tr>
		<td>
			<input bind:value={host}>
		</td>
		<td>
			<input bind:value={url}>
		</td>
		<td>
			<button on:click={scan}>scan!</button>
		</td>
		<td>
			{JSON.stringify(ws_current_state)}
		</td>
		<td>
			{!Number.isNaN(last_message_ago) ? last_message_ago : '-'}
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
<div class="framed">
	<Ssids {can_connect} items={ssid_values}/>
</div>

<h5>Events</h5>
<table class="framed">
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
				<small>{dayjs(m.ts).format('HH:mm:ss.SSS')}</small>:
				<br>
				<b>
					{JSON.stringify(m.msg, null, '')}
				</b>
				<br>
			</td>
		</tr>
	{/each}
</table>

<br>

{now} |

<style>
    h5 {
    	margin-bottom: 0em;
    }
    .framed {
        border: 1px inset rgba(128, 110, 164, 0.48);
        border-radius: 0px 17px 12px 13px;
        border-collapse: separate;
        border-spacing: 1em 0;
        width: 100%;
    }
</style>
