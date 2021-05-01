<script>


  //	https://sveltematerialui.com/demo/data-table/

/*
snowpack, in dev mode (even with hmr on):

@smui.ripple.v4.1.0.js:6 Uncaught Error: Function called outside component initialization
    at get_current_component (@smui.ripple.v4.1.0.js:6)
    at getContext (@smui.ripple.v4.1.0.js:9)
    at Ripple (@smui.ripple.v4.1.0.js:39)
    at useActions (useActions-7ce2ed3d.js:133)
    at Object.mount [as m] (@smui.common.Button.svelte.v4.1.0.js:45)
    at mount_component (@smui.icon-button.v4.1.0.js:254)
    at Object.mount [as m] (@smui.icon-button.v4.1.0.js:548)
    at mount_component (svelte.internal.v3.37.0.js:1318)
    at Object.mount [as m] (Test_smui_data_table.svelte.js:125)
    at Object.mount [as m] (@smui.data-table.v4.1.0.js:2638)


in build:
missing css?

 */
//

  import DataTable, { Head, Body, Row, Cell, Label } from '@smui/data-table';
  import IconButton from '@smui/icon-button';

  let items = [];
  let sort = 'id';
  let sortDirection = 'ascending';

  if (typeof fetch !== 'undefined') {
    fetch(
      'https://gist.githubusercontent.com/hperrin/e24a4ebd9afdf2a8c283338ae5160a62/raw/dcbf8e6382db49b0dcab70b22f56b1cc444f26d4/users.json'
    )
      .then((response) => response.json())
      .then((json) => (items = json));
  }

  function handleSort() {
    items.sort((a, b) => {
      const [aVal, bVal] = [a[sort], b[sort]][
        sortDirection === 'ascending' ? 'slice' : 'reverse'
      ]();
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return aVal - bVal;
    });
    items = items;
  }
</script>


missing css?
<DataTable
  sortable
  bind:sort
  bind:sortDirection
  on:MDCDataTable:sorted={handleSort}
  table$aria-label="User list"
  style="width: 100%;"
>
  <Head>
    <Row>
      <!--
        Note: whatever you supply to "columnId" is
        appended with "-status-label" and used as an ID
        for the hidden label that describes the sort
        status to screen readers.

        You can localize those labels with the
        "sortAscendingAriaLabel" and
        "sortDescendingAriaLabel" props on the DataTable.
      -->
      <Cell numeric columnId="id">
        <!-- For numeric columns, icon comes first. -->
        <IconButton class="material-icons">arrow_upward</IconButton>
        <Label>ID</Label>
      </Cell>
      <Cell columnId="name" style="width: 100%;">
        <Label>Name</Label>
        <!-- For non-numeric columns, icon comes second. -->
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="username">
        <Label>Username</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <Cell columnId="email" l>
        <Label>Email</Label>
        <IconButton class="material-icons">arrow_upward</IconButton>
      </Cell>
      <!-- You can turn off sorting for a column. -->
      <Cell sortable={false}>Website</Cell>
    </Row>
  </Head>
  <Body>
    {#each items as item (item.id)}
      <Row>
        <Cell numeric>{item.id}</Cell>
        <Cell>{item.name}</Cell>
        <Cell>{item.username}</Cell>
        <Cell>{item.email}</Cell>
        <Cell>{item.website}</Cell>
      </Row>
    {/each}
  </Body>
</DataTable>
