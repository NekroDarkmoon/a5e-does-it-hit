<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

	export let target;
	export let attackData;
	export let cardData;

	console.log($target.uuid);

	let targetFlag = cardData.targetData?.[$target.uuid];

	$: ac = targetFlag?.ac ?? $target.actor.system.attributes.ac;
</script>

<div class="hit-section">
	<img
		class="hit-section__img"
		src={$target.texture.src}
		alt={$target.displayName ?? $target.name}
	/>

	<span class="hit-section__name">
		{$target.name}
	</span>

	<div
		class="hit-section__roll"
		class:hit-section_roll-crit={attackData.isCrit}
		class:hit-section_roll-fumble={attackData.isFumble}
	>
		{attackData.rollTotal}
	</div>

	<div class="hit-section__ac">
		<svg
			class="ac-background"
			version="1.1"
			x="0px"
			y="0px"
			viewBox="0 0 90 100"
			xml:space="preserve"
		>
			<path
				d="M45,100C-2.6,79.3,0,12.6,0,12.6c0-2.2,1.8-4,4.4-4.6l39.1-7.9C44,0,44.5,0,45,0c0.5,0,1,0,1.4,0.1L85.5,8
            c2.6,0.5,4.4,2.4,4.4,4.6C90,12.6,92.6,79.3,45,100L45,100z"
			/>
		</svg>
		{ac}
	</div>
</div>

<style lang="scss">
	.hit-section {
		display: grid;
		grid-template-columns: 3rem 1fr 4ch 4ch;
		gap: 0.25rem;
		align-items: center;
	}

	.hit-section__name {
		margin: 0;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-size: 0.833rem;
	}

	.hit-section__img {
		border: none;
		width: 2.5rem;
		height: 2.5rem;
	}

	.hit-section__roll {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-weight: bold;

		background-image: url('/icons/svg/d20-grey.svg');
		background-repeat: no-repeat;
		background-position: center 60%;
		background-size: 2rem;
	}

	.hit-section__ac {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-weight: bold;
	}

	.ac-background {
		position: absolute;
		height: 2rem;
		bottom: 0.2rem;
		fill: rgba(0, 0, 0, 0.15);
		z-index: 0;
	}
</style>
