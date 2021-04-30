<script>
import events from 'events';
const {EventEmitter} = events;

	import { WsReconnect } from 'websocket-reconnect';

	const ws = new WsReconnect({ reconnectDelay: 5000 });

	var host = 'localhost'
	var port = '1234'

	var interval = setInterval(poke, 1000);

	function poke()
	{
		ws.send('ping');
	}

	ws.open(`ws://${host}:${port}`);

	ws.on('open', function open() {
		// this will only be called once, not on reconnect
	});

	ws.on('reconnect', function open() {
		// this will only be called on every reconnect attempt
	});

	ws.on('message', (data) => {
		const json = JSON.parse(data);
		console.log('======== received', json);
	});

	ws.on('close', () => {
		interval && clearInterval(interval);
	});
</script>
<ol>
	<li>
		1
	</li>

</ol>
