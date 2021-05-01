<script>




	// https://github.com/mattiash/svelte-tablesort





	import {TableSort} from 'svelte-tablesort'

	let items = []

	const dataPromise = fetch(`https://node-hnapi.herokuapp.com/news?page=1`)
		.then(r => r.json())
		.then(data => {
			items = data
		});
</script>

<TableSort items={items}>
	<tr slot="thead">
		<th data-sort="title">Title</th>
		<th data-sort="user">User</th>
	</tr>
	<tr slot="tbody" let:item={item}>
		<td><a href="{item.url}">{item.title}</a></td>
		<td>{item.user}</td>
	</tr>
</TableSort>
