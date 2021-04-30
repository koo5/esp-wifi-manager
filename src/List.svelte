<script>

	import WebSocketClient from "js-websocket-reconnect-client";

	const url = "ws://localhost:8080/svelte/ws/";

	const protocols = [];
	const options = {
		shouldReconnect: true,
		reconnectRetryTimeout: 2000,
		parsedMessage: true,
		reconnectRetryMaxNumber: null,
		debug: false,
	}
	const ws = new WebSocketClient(url, protocols, options);

	var messages = [];

	function push(x)
	{
		console.log(x);
		messages.push(x);
		messages = messages;
	}

	ws.addOnMessageHandler(push);
	ws.addOnOpenHandler(push);
	ws.addOnCloseHandler(push);
	ws.addOnErrorHandler(push);

	ws.connect();

</script>
<ol>
	{#each messages as message}
		<li>
			{JSON.stringify(message,null,' ')}
		</li>
	{/each}
</ol>

<style>
    ol {
        list-style: none;
        counter-reset: my-awesome-counter;
    }

    ol li {
        counter-increment: my-awesome-counter;
    }

    ol li::before {
        content: counter(my-awesome-counter) ". ";
        color: red;
        font-weight: bold;
    }

</style>
