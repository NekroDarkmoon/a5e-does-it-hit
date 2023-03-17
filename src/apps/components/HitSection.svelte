<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

	export let target;
	export let attackData;

	let reactiveFlag = true;

	$: ac = reactiveFlag ? $target.actor.system.attributes.ac : 5;
</script>

<div class="hit-section">
	<img
		class="hit-section__img"
		src={$target.texture.src}
		alt={$target.displayName ?? $target.name}
	/>

	<span class="hit-section__name">
		{$target.displayName ?? $target.name}
	</span>

	<div
		class="hit-section__roll"
		class:hit-section_roll-crit={attackData.isCrit}
		class:hit-section_roll-fumble={attackData.isFumble}
	>
		{attackData.rollTotal}
	</div>

	<div class="hit-section__ac">
		{ac}
	</div>

	<input type="checkbox" bind:checked={reactiveFlag} />
</div>

<style lang="scss">
</style>
