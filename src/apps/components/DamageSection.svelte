<script>
	import { getContext } from 'svelte';
	import { localize } from '#runtime/svelte/helper';

	import { moduleName } from '../../modules/constants';

	import RollRow from './RollRow.svelte';

	export let target;
	export let damageData;
	export let cardData;

	const message = getContext('message');
	const { damageColors, damageTypes } = CONFIG.A5E;

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
		<ul class="dih-roll-list">
			{#each damageData as { damage, damageType, multiplier }}
				<RollRow
					label={localize(damageTypes[damageType] ?? damageType)}
					{multiplier}
					roll={damage}
					type="damage"
					--dih-roll-color={damageColors[damageType]}
				/>
			{/each}
		</ul>

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

			{#if reactive}
				<button on:click={applyDamage}>
					<i class="fas fa-check" />
				</button>
			{:else}
				<button on:click={resetDamage}>
					<i class="fas fa-undo" />
				</button>
			{/if}
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

	.damage-data {
		flex-grow: 1;
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
