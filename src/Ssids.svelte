<script>

	import {Datatable, rows} from 'svelte-simple-datatables'
	import Ssid from './Ssid.svelte';

	export let ssids;
	const settings = {columnFilter: true}

</script>

<div>
	<Datatable settings={settings} data={ssids}>
		<thead>
		<th data-key="first_name">First Name</th>
		<th data-key="(row) => row.value.ssid">Last Name</th>
		<th data-key="email">Email</th>
		</thead>
		<tbody>
		{#each $rows as row}
			<Ssid ssid={row}/>
		{/each}
		</tbody>
	</Datatable>
</div>
