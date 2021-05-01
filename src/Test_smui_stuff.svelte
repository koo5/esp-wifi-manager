<script>
	import LinearProgress from '@smui/linear-progress';
	import IconButton from '@smui/icon-button';


let progress = 0.33;
let closed = false;


</script>


<div>
sup?
<LinearProgress {progress} {closed} />

</div>

<style>
	 div {
	  height: 200px;
	  width: 50%;
	  background-color: powderblue;
	}
</style>
