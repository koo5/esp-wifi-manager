<script>


	// https://vincjo.fr/svelte-simple-datatables/



/*

appears to work, but:

Uncaught TypeError: i is undefined
    redraw svelte-simple-datatables.js:248
    redraw svelte-simple-datatables.js:246
    redraw svelte-simple-datatables.js:244
    setTimeout handler*redraw svelte-simple-datatables.js:240
    resize svelte-simple-datatables.js:316
    init svelte-simple-datatables.js:274
    init svelte-simple-datatables.js:273
    Wc svelte-simple-datatables.js:2203
    wl index-80b6ced9.js:10
    V index-80b6ced9.js:673
    Fl index-80b6ced9.js:383
    ne index-80b6ced9.js:747
    zo App.svelte.js:82
    <anonymous> index.js:3







 */





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
				<th data-key="email2">Email</th>
				<th data-key="email3">Email</th>
				<th data-key="email4">Email</th>
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
