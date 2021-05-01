<script>


	// https://vincjo.fr/svelte-simple-datatables/


	import {Datatable, rows} from 'svelte-simple-datatables'
	import Ssid from './Ssid.svelte';

	export let ssids;
	const settings = {columnFilter: true}

</script>

<div class="wrapper">
    <div class="one"></div>
    <div class="two"></div>
    <div class="three">
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
    <div class="four"></div>
    <div class="five"></div>
    <div class="six"></div>
</div>








<style>
    .wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 10px;
        grid-auto-rows: minmax(100px, auto);
        background:rgba(255, 62, 0, 0.1);
        padding:8px
    }
    div{border-radius:8px;}
    .one     {background:rgba(255, 62, 0, 0.2);grid-column: 1 / 2;grid-row: 1;}
    .two     {background:rgba(255, 62, 0, 0.2);grid-column: 2 / 4;grid-row: 1 / 3;}
    .three   {background:#ffffff;padding:8px 0;grid-column: 1;grid-row: 2 / 5;}
    .four    {background:rgba(255, 62, 0, 0.2);grid-column: 3;grid-row: 3;}
    .five    {background:rgba(255, 62, 0, 0.2);grid-column: 2;grid-row: 4;}
    .six     {background:rgba(255, 62, 0, 0.2);grid-column: 3;grid-row: 4;}
    td{text-align:center;padding:4px;}
</style>
