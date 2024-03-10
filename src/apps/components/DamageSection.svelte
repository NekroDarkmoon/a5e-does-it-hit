<script>
	import { localize } from '#runtime/svelte/helper';
	import { getContext } from 'svelte';

	import { moduleName } from '../../modules/constants';

	export let target;
	export let damageData;
	export let cardData;

	const message = getContext('message');
	const { A5E } = CONFIG;

	let targetFlag = cardData.targetData?.damage?.[$target?.id];

	function updateDamageOptions(event) {
		if (event.value === 'auto') {
			damageData.forEach(damageSource => {
				damageSource.multiplier =
					getDefaultMultiplierForDamageType(damageSource);
			});
		} else {
			damageData.forEach(damageSource => {
				damageSource.multiplier = Number(event.value);
			});
		}

		damageData = damageData;
	}

	function applyDamage() {
		$target.actor.applyBulkDamage(
			damageData.map(({ damage, damageType, multiplier }) => [
				Math.floor(damage * multiplier),
				damageType,
			]),
		);

		$message.update({
			[`flags.${moduleName}.targetData.damage.${$target?.id}`]: {
				hp: $target.actor.system.attributes.hp.value,
				ac: $target.actor.system.attributes.ac.value,
				damage: totalDamage,
			},
		});
	}

	function getDefaultMultiplierForDamageType(damageSource) {
		const { damageImmunities, damageResistances, damageVulnerabilities } =
			$target.actor?.system.traits;

		let multiplier = 1;

		if (damageVulnerabilities?.includes(damageSource.damageType)) {
			multiplier = 2;
		} else if (damageResistances?.includes(damageSource.damageType)) {
			multiplier = 0.5;
		} else if (damageImmunities?.includes(damageSource.damageType)) {
			multiplier = 0;
		}

		return multiplier;
	}

	function resetDamage() {
		const undoDamage = targetFlag?.damage ?? 0;
		$target.actor.applyHealing(undoDamage);

		$message.update({
			[`flags.${moduleName}.targetData.damage`]: {
				[`-=${$target.id}`]: null,
			},
		});
	}

	damageData = damageData.map(damageSource => ({
		...damageSource,
		multiplier: getDefaultMultiplierForDamageType(damageSource),
	}));

	$: hp = targetFlag?.hp ?? $target?.actor.system.attributes.hp.value;
	$: reactive = targetFlag?.hp ? false : true;

	$: totalDamage = damageData.reduce(
		(cumulativeDamage, { damage, multiplier }) =>
			cumulativeDamage + Math.floor(damage * multiplier),
		0,
	);
</script>

<div class="damage-section">
	{#if $target}
		{#each damageData as { damage, damageType, multiplier }}
			<div class="dih-damage-row">
				<span class="dih-damage-row__data">
					{localize(A5E.damageTypes[damageType] ?? damageType)}
					({Math.floor(damage * multiplier)})
				</span>

				<select class="multiplier" bind:value={multiplier}>
					<option value={0}>None</option>
					<option value={1}>Base</option>
					<option value={2}>2</option>
					<option value={0.5}>1/2</option>
					<option value={0.25}>1/4</option>
				</select>
			</div>
		{/each}

		<hr class="a5e-rule u-pt-md" />

		<div class="damage__container">
			<span class="damage-data">
				Hp:
				<span style="color: #772020;">{hp - totalDamage}</span>
				<i class="fas fa-arrow-right-long" /> [
				<span style="color: #425f65;">{hp}</span>
				- {totalDamage} ]
			</span>

			<select
				class="multiplier"
				style="font-size: 0.833rem; height: 1.25rem;"
				on:change={({ target }) => updateDamageOptions(target)}
			>
				<option value={'auto'} selected>Auto</option>
				<option value={0}>None</option>
				<option value={1}>Base</option>
				<option value={2}>2</option>
				<option value={0.5}>1/2</option>
				<option value={0.25}>1/4</option>
			</select>

			<button
				class="apply-button"
				on:click={applyDamage}
				disabled={!reactive}
			>
				<i class="fas fa-check" />
			</button>

			<button
				class="reset-button"
				on:click={resetDamage}
				disabled={reactive}
			>
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
		padding: 0.25rem;
		padding-bottom: 0;
	}

	.dih-damage-row {
		display: flex;
		padding: 0.25rem 0.25rem;
		font-size: 0.833rem;

		&:nth-child(odd) {
			background-color: #dedcd7;
		}

		&__data {
			display: flex;
			align-items: center;
			gap: 0.5ch;
			flex-grow: 1;
			font-size: 0.833rem;
		}
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
