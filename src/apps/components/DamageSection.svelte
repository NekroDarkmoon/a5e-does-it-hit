<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

	export let target;
	export let damageData;
	export let cardData;

	let targetFlag = cardData.targetData?.[$target.uuid];
	let damageOption = damageData.map(({ damage }) => damage);

	function updateDamageOptions(event) {
		const value = Number(event.value);
		damageOption = damageData.map(({ damage }) => damage * value);
	}

	$: totalDamage = damageOption.reduce((a, b) => a + b, 0);
	$: hp = targetFlag?.hp ?? $target.actor.system.attributes.hp.value;
</script>

<div class="damage-section">
	{#each damageData as { canCrit, damage, damageType }, idx}
		<div class="damage__container">
			<span class="damage-data">
				<!--  -->
				{damageOption[idx]}
				{damageType}
			</span>

			<select class="multiplier" bind:value={damageOption[idx]}>
				<option value={damage * 0}>None</option>
				<option value={damage}>Base</option>
				<option value={damage * 2}>2</option>
				<option value={damage * 0.5}>1/2</option>
				<option value={damage * 0.25}>1/4</option>
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

	<div class="damage__container">
		<span class="damage-data">
			{totalDamage}
		</span>

		<select
			class="multiplier"
			on:change={({ target }) => updateDamageOptions(target)}
		>
			<option value={0}>None</option>
			<option value={1} selected>Base</option>
			<option value={2}>2</option>
			<option value={0.5}>1/2</option>
			<option value={0.25}>1/4</option>
		</select>

		<button class="apply-button">
			<i class="fas fa-check" />
		</button>

		<button class="reset-button">
			<i class="fas fa-undo" />
		</button>
	</div>
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
		padding-inline: 0.25rem;
		padding-block: 0.125rem;

		&:not(:last-child) {
			// background-color: dodgerblue;
		}

		&:nth-child(odd):not(:last-child) {
			background-color: #ccc;
		}
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
		background: transparent;
		border: none;

		i {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 0.694rem;
		}
	}
</style>
