<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

	export let target;
	export let damageData;
	export let cardData;

	console.log(cardData);

	let targetFlag = cardData.targetData?.[$target.uuid];

	$: hp = targetFlag?.hp ?? $target.actor.system.attributes.hp.value;
</script>

<div class="damage-section">
	{#each damageData as { canCrit, damage, damageType }}
		<div class="damage__container">
			<span class="damage-data">
				<!--  -->
				{damage}
				{damageType}
			</span>

			<select class="multiplier">
				<option value="${damage}">Base</option>
				<option value="${damage * 2}">2</option>
				<option value="${damage * 0.5}">1/2</option>
				<option value="${damage * 0.25}">1/4</option>
			</select>

			<button class="apply-button">
				<i class="fas fa-check" />
			</button>

			<button class="reset-button">
				<i class="fas fa-undo" />
			</button>
		</div>
	{/each}

	<hr class="a5e-rule u-pt-md" />

	<!-- Total -->
</div>

<style lang="scss">
	.damage-section {
		display: grid;
		font-size: 0.694rem;
	}

	.damage__container {
		display: flex;
		gap: 0.25rem;
		align-items: center;
	}

	.damage-data {
		flex-grow: 1;
	}

	.multiplier {
		font-size: 0.694rem;
		height: 1rem;
	}

	button {
		// display: flex;
		position: relative;
		height: 1rem;
		width: 1rem;
		align-items: center;
		justify-content: center;

		i {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 0.694rem;
		}
	}
</style>
