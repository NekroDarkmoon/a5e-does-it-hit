<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { getContext } from 'svelte';

	import { moduleName } from '../../modules/constants';

	export let target;
	export let damageData;
	export let cardData;

	const message = getContext('message');
	const { A5E } = CONFIG;

	let targetFlag = cardData.targetData?.[$target?.id];
	let damageOption = damageData.map(({ damage }) => damage);

	function updateDamageOptions(event) {
		const value = Number(event.value);
		damageOption = damageData.map(({ damage }) => damage * value);
	}

	function applyDamage() {
		$target.actor.applyDamage(totalDamage);
		$message.update({
			[`flags.${moduleName}.targetData.${$target?.id}`]: {
				hp: $target.actor.system.attributes.hp.value,
				ac: $target.actor.system.attributes.ac,
				damage: totalDamage,
			},
		});
	}

	function resetDamage() {
		const undoDamage = cardData.targetData?.[$target.id]?.damage ?? 0;
		$target.actor.applyHealing(undoDamage);

		$message.update({
			[`flags.${moduleName}.targetData`]: {
				[`-=${$target.id}`]: null,
			},
		});
	}

	$: reactive = targetFlag?.hp ? false : true;
	$: totalDamage = damageOption.reduce((a, b) => a + b, 0);
	$: hp = targetFlag?.hp ?? $target?.actor.system.attributes.hp.value;
</script>

<div class="damage-section">
	{#if $target}
		{#each damageData as { canCrit, damage, damageType }, idx}
			<div class="damage__container">
				<span class="damage-data">
					{localize(A5E.damageTypes[damageType] ?? damageType)}
					({Math.floor(damageOption[idx])})
				</span>

				<select class="multiplier" bind:value={damageOption[idx]}>
					<option value={damage * 0}>None</option>
					<option value={damage}>Base</option>
					<option value={damage * 2}>2</option>
					<option value={damage * 0.5}>1/2</option>
					<option value={damage * 0.25}>1/4</option>
				</select>

				<!-- <button class="apply-button">
				<i class="fas fa-check" />
			</button>

			<button class="reset-button">
				<i class="fas fa-undo" />
			</button> -->
			</div>
		{/each}

		<hr class="a5e-rule u-pt-md" />

		<div class="damage__container">
			<span class="damage-data" style="font-size: 0.833rem;">
				Hp:
				<span style="color: #772020;">{hp - Math.floor(totalDamage)}</span>
				➡ [
				<span style="color: #425f65;">{hp}</span>
				- {Math.floor(totalDamage)}]
			</span>

			<select
				class="multiplier"
				style="font-size: 0.833rem; height: 1.25rem;"
				on:change={({ target }) => updateDamageOptions(target)}
			>
				<option value={0}>None</option>
				<option value={1} selected>Base</option>
				<option value={2}>2</option>
				<option value={0.5}>1/2</option>
				<option value={0.25}>1/4</option>
			</select>

			<button class="apply-button" on:click={applyDamage} disabled={!reactive}>
				<i class="fas fa-check" />
			</button>

			<button class="reset-button" on:click={resetDamage} disabled={reactive}>
				<i class="fas fa-undo" />
			</button>
		</div>
	{:else}
		Target has been deleted.
	{/if}
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
		padding-block: 0.25rem;

		&:nth-child(odd):not(:last-child) {
			background-color: #dedcd7;
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
		color: #999;
		transition: all 0.15s ease-in-out;

		&:hover,
		&:focus {
			box-shadow: none;
			transform: scale(1.2);
			color: #555;
		}

		&:disabled {
			cursor: not-allowed;

			&:hover {
				transform: none;
				color: #999;
			}
		}

		i {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 0.694rem;
		}
	}
</style>
