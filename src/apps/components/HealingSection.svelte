<script>
	import { getContext } from 'svelte';
	import { localize } from '#runtime/svelte/helper';

	import { moduleName } from '../../modules/constants';

	export let target;
	export let healingData;
	export let cardData;

	const message = getContext('message');
	const { A5E } = CONFIG;

	let targetFlag = cardData.targetData?.healing?.[$target?.id];
	let healingOption = healingData.map(({ healing, healingType }) => ({
		healing,
		healingType,
	}));

	function updateHealingOptions(event) {
		const value = Number(event.value);
		healingOption = healingData.map(({ healing, healingType }) => ({
			healing: healing * value,
			healingType,
		}));
	}

	function applyHealing() {
		const temp = totalHealing.temp;
		const heal = totalHealing.heal;
		$target.actor.applyHealing(heal);
		$target.actor.applyHealing(temp, { temp: true });

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

		if (tempHp > 0) $target.actor.applyDamage(temp);
		$target.actor.applyDamage(heal);

		$message.update({
			[`flags.${moduleName}.targetData.healing`]: {
				[`-=${$target.id}`]: null,
			},
		});
	}

	$: reactive = targetFlag?.hp ? false : true;
	$: totalHealing = healingOption.reduce(
		(acc, b) => {
			if (b.healingType === 'temporaryHealing') {
				acc.temp = Math.floor(acc.temp + b.healing);
			} else acc.heal = Math.floor(acc.heal + b.healing);
			return acc;
		},
		{ heal: 0, temp: 0 }
	);
	$: hp = targetFlag?.hp ?? $target?.actor.system.attributes.hp.value;
	$: tempHp = $target?.actor.system.attributes.hp.temp;
</script>

<div class="healing-section">
	{#if $target}
		{#each healingData as { healingType, healing }, idx}
			<div class="healing__container">
				<span class="healing-data">
					{localize(A5E.healingTypes[healingType] ?? healingType)}
					({Math.floor(healingOption[idx]?.healing)})
				</span>

				<select class="multiplier" bind:value={healingOption[idx].healing}>
					<option value={healing * 0}>None</option>
					<option value={healing}>Base</option>
				</select>
			</div>
		{/each}

		<hr class="a5e-rule u-pt-md" />
	{/if}

	<div class="healing__container">
		<span class="healing-data" style="font-size: 0.833rem;">
			{#if totalHealing.heal}
				Hp:
				<span style="color: #425f65">{hp + totalHealing.heal}</span>
				➡ [
				<span style="color: #772020;">{hp}</span>
				+ {totalHealing.heal} ]
				<br />
			{/if}

			{#if totalHealing.temp}
				Temp Hp:
				<span style="color: #425f65">{tempHp + totalHealing.temp}</span>
				➡ [
				<span style="color: #772020;">{tempHp}</span>
				+ {totalHealing.temp} ]
			{/if}
		</span>

		<select
			class="multiplier"
			style="font-size: 0.833rem; height: 1.25rem;"
			on:change={({ target }) => updateHealingOptions(target)}
		>
			<option value={0}>None</option>
			<option value={1} selected>Base</option>
		</select>

		<button class="apply-button" on:click={applyHealing} disabled={!reactive}>
			<i class="fas fa-check" />
		</button>

		<button class="reset-button" on:click={resetHealing} disabled={reactive}>
			<i class="fas fa-undo" />
		</button>
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
		padding-inline: 0.25rem;
		padding-block: 0.25rem;

		&:nth-child(odd):not(:last-child) {
			background-color: #dedcd7;
		}
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
