<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

	export let target;
	export let attackData;
	export let cardData;

	let targetFlag = cardData.targetData?.[$target?.id];

	$: ac = targetFlag?.ac ?? $target?.actor.system.attributes.ac;
</script>

<div class="hit-section">
	{#if $target}
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
			<svg
				class="roll-background"
				x="0px"
				y="0px"
				viewBox="-16 0 512 512"
				xml:space="preserve"
			>
				<path
					d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43L82.7 193.08 6.06
                147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43
                11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81
                110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79
                176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41
                18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 
                438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 
                208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z"
				/>
			</svg>

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
	{/if}
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
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-weight: bold;
	}

	.hit-section__ac {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-weight: bold;
	}

	.roll-background {
		position: absolute;
		height: 1.8rem;
		bottom: 0.35rem;
		fill: rgba(0, 0, 0, 0.225);
		z-index: 0;
	}

	.ac-background {
		position: absolute;
		height: 2rem;
		bottom: 0.2rem;
		fill: rgba(0, 0, 0, 0.15);
		z-index: 0;
	}
</style>
