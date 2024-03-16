<script>
	import { getContext } from 'svelte';
	import { localize } from '#runtime/svelte/helper';

	import { moduleName } from '../../modules/constants';

	import RollRow from './RollRow.svelte';

	export let target;
	export let healingData;
	export let cardData;

	const message = getContext('message');
	const { healingColors, healingTypes } = CONFIG.A5E;

	let targetFlag = cardData.targetData?.healing?.[$target?.id];

	function updateHealingMultipliers(newMultiplier) {
		healingData.forEach(healingSource => {
			healingSource.multiplier = Number(newMultiplier);
		});

		healingData = healingData;
	}

	function updateSingleHealingMultiplier(newMultiplier, index) {
		healingData[index].multiplier = Number(newMultiplier);
		healingData = healingData;
	}

	function applyHealing() {
		$target.actor.applyBulkHealing(
			healingData.map(({ healing, healingType, multiplier }) => [
				Math.floor(healing * multiplier),
				healingType,
			]),
		);

		$message.update({
			[`flags.${moduleName}.targetData.healing.${$target?.id}`]: {
				hp: $target.actor.system.attributes.hp.value,
				ac: $target.actor.system.attributes.ac.value,
				healing: totalHealing,
			},
		});
	}

	function resetHealing() {
		const temp = targetFlag?.healing?.temp ?? 0;
		const heal = targetFlag?.healing?.heal ?? 0;

		if (tempHp > 0) $target.actor.applyBulkDamage([[temp], [heal]]);
		else $target.actor.applyDamage(heal);

		$message.update({
			[`flags.${moduleName}.targetData.healing`]: {
				[`-=${$target.id}`]: null,
			},
		});
	}

	healingData = healingData.map(healingSource => ({
		...healingSource,
		multiplier: 1,
	}));

	$: hp = targetFlag?.hp ?? $target?.actor.system.attributes.hp.value;
	$: tempHp = $target?.actor.system.attributes.hp.temp;
	$: reactive = targetFlag?.hp ? false : true;

	$: totalHealing = healingData.reduce(
		(cumulativeHealing, { healing, healingType, multiplier }) => {
			const key = healingType === 'temporaryHealing' ? 'temp' : 'heal';
			cumulativeHealing[key] += Math.floor(healing * multiplier);

			return cumulativeHealing;
		},
		{ heal: 0, temp: 0 },
	);
</script>

<div class="healing-section">
	{#if $target}
		<ul class="dih-roll-list">
			{#each healingData as { healingType, healing, multiplier }, idx}
				<RollRow
					label={localize(healingTypes[healingType] ?? healingType)}
					{multiplier}
					roll={healing}
					type="healing"
					--dih-roll-color={healingColors[healingType]}
					on:updateSelection={event =>
						updateSingleHealingMultiplier(event.detail, idx)}
				/>
			{/each}
		</ul>
	{/if}

	<div class="healing__container">
		<span class="healing-data" style="font-size: 0.833rem;">
			{#if totalHealing.heal}
				Hp:
				<span style="color: #425f65">
					{Math.min(
						$target?.actor?.system?.attributes?.hp?.max,
						hp + totalHealing.heal,
					)}
				</span>

				<i class="fas fa-arrow-right-long" /> [
				<span style="color: #772020;">{hp}</span>
				+ {totalHealing.heal} ]
				<br />
			{/if}

			{#if totalHealing.temp}
				Temp Hp:
				<span style="color: #425f65">
					{tempHp + totalHealing.temp}
				</span>

				<i class="fas fa-arrow-right-long" /> [
				<span style="color: #772020;">{tempHp}</span>
				+ {totalHealing.temp} ]
			{/if}
		</span>

		<select
			class="multiplier"
			style="font-size: 0.833rem; height: 1.25rem;"
			on:change={({ target }) => updateHealingMultipliers(target.value)}
		>
			<option value={0}>None</option>
			<option value={1} selected>Base</option>
		</select>

		{#if reactive}
			<button on:click={applyHealing}>
				<i class="fas fa-check" />
			</button>
		{:else}
			<button on:click={resetHealing}>
				<i class="fas fa-undo" />
			</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.healing-section {
		display: grid;
		font-size: 0.694rem;
	}

	.healing__container {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		padding: 0.25rem;
		padding-bottom: 0;
	}

	.healing-data {
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
