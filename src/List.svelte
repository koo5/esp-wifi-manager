<script>

	import dayjs from 'dayjs/esm';
	import _ from 'underscore';
	import {onMount} from "svelte";
	import WebSocketClient from "js-websocket-reconnect-client";
	import Ssid from './Ssid.svelte';




	import Test_mattiash_svelte_tablesort from './Test_mattiash_svelte_tablesort.svelte';
	import Test_svelte_simple_datatables from './Test_svelte_simple_datatables.svelte';
	import Test_smeltejs_data_tables from './Test_smeltejs_data_tables.svelte';
	import Test_smui_data_table from './Test_smui_data_table.svelte';
	import Test_smui_stuff from './Test_smui_stuff.svelte';




	export let host = "localhost:8080";
	$: url = "ws://" + host + "/svelte/ws/";
	//$: console.log(url);

	$: ws = make_ws(url, connection_attempts);
	let connection_attempts = 0;
	let ws_current_state = null;
	let now;
	let last_message_ts;
	let last_connect_attempt_ts;
	$: last_message_ago = now - last_message_ts;

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
			maybe_reconnect();
		}, 5000);
	});

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
				['OPEN', 'CONNECTING'].indexOf(ws_current_state) === -1
			)
			&&
			((now - last_connect_attempt_ts) > 10000)
		)
		{
			console.log('XXXXXXXXXXXXXXXXXXXXX');
			push('try reconnect');
			connection_attempts++;
		}
	}

	function make_ws(url)
	{
		last_connect_attempt_ts = new Date();
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
			push(e);
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
			if (value.ssid)
			{
				ssids[value.ssid] = {
					host,
					value,
					ts: obj.ts,
					last_seen_before: 0
				}
				ssids = ssids;
			}
		}
	}

	let ssids = {};
	$: ssid_names = _.sortBy(Object.keys(ssids));

	function update_ssid_last_seens()
	{
		Object.entries(ssids).forEach(x =>
		{
			const [name, item] = x;
			item.last_seen_before = now - item.ts;
		});
		ssids = ssids
	}








</script>



note:1) i can also disable hmr (in snowpack), but it doesn't help.<br>
in build mode, all tables works, just, apparently, we're missing some css here and there,
except in Test_svelte_simple_datatables.<br>
details in individual files.<br>



<h5>Test_mattiash_svelte_tablesort</h5>
<div class="mydiv">
	<Test_mattiash_svelte_tablesort/>
</div>

<!--
<h5>Test_svelte_simple_datatables</h5>
<div class="mydiv">
	<Test_svelte_simple_datatables ssids={Object.values(ssids)}/>
</div>
-->

<!--
<h5>Test_smui_data_table</h5>
<div class="mydiv">
	<Test_smui_data_table/>
</div>
-->


<!--
<h5>Test_smui_stuff</h5>
<div class="mydiv">
	<Test_smui_stuff/>
</div>
-->


<!--
<h5>Test_smeltejs_data_tables</h5>
<div class="mydiv">
	<Test_smeltejs_data_tables/>
</div>
-->




<h5>Connection</h5>
<table>
	<tr>
		<th>host</th>
		<th>ws url</th>
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
<table>
	<tr>
		<th></th>
		<th>SSID</th>
		<th>signal</th>
		<th>last seen (ms)</th>
		<th>chan</th>
		<th>raw (json)</th>
	</tr>
	{#each ssid_names as name}
		<Ssid ssid={ssids[name]}/>
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
    table {
        margin: 0;
        border: 1px inset rgba(128, 110, 164, 0.48);
        border-radius: 0px 17px 12px 13px;
        border-collapse: separate;
        border-spacing: 1em 0;
    }
    .mydiv {
        margin: 0;
        border: 1px inset rgba(128, 110, 164, 0.48);
        border-radius: 0px 17px 12px 13px;
        border-collapse: separate;
        border-spacing: 1em 0;
    }
</style>
