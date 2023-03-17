<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

	export let target;

	console.log($target);
</script>

<div class="hit-section">
	<img src={$target.texture.src} alt="" width="50rem" height="50rem" />
	<span class="hit-section__name">
		{$target.displayName ?? $target.name}
	</span>
</div>
