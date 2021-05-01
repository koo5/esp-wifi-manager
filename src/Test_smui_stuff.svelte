<script>



/*
snowpack, hmr off:

 Uncaught TypeError: getElement() is undefined
    hasClass http://localhost:3003/_snowpack/pkg/@smui.linear-progress.v4.1.0.js:640
    init http://localhost:3003/_snowpack/pkg/@material/linear-progress.v11.0.0/common/component-54b2ba2b.js:170
    instance_1 http://localhost:3003/_snowpack/pkg/@smui.linear-progress.v4.1.0.js:630
    run http://localhost:3003/_snowpack/pkg/svelte.internal.v3.37.0.js:18
    mount_component http://localhost:3003/_snowpack/pkg/svelte.internal.v3.37.0.js:1321
    flush http://localhost:3003/_snowpack/pkg/svelte.internal.v3.37.0.js:698
    init http://localhost:3003/_snowpack/pkg/svelte.internal.v3.37.0.js:1395
    App http://localhost:3003/src/App.svelte.js:115
    <anonymous> http://localhost:3003/index.js:3
@smui.linear-progress.v4.1.0.js:640:5

*/






	import LinearProgress from '@smui/linear-progress';
	import IconButton from '@smui/icon-button';


let progress = 0.33;
let closed = false;


</script>


<div>
broken why?

<LinearProgress {progress} {closed} />

</div>

<style>
	 div {
	  height: 300px;
	  width: 80%;
	  background-color: powderblue;
	}
</style>
