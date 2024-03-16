<script>
	import { createEventDispatcher } from 'svelte';

	export let roll;
	export let label;
	export let multiplier;
	export let type;

	const dispatch = createEventDispatcher();
</script>

<li class="dih-roll-list__row">
	<div class="dih-roll-number">
		{Math.floor(roll * multiplier)}
	</div>

	{label}

	<select
		class="multiplier"
		bind:value={multiplier}
		on:change={({ target }) => dispatch('updateSelection', target.value)}
	>
		<option value={0}>None</option>
		<option value={1}>Base</option>

		{#if type === 'damage'}
			<option value={2}>2</option>
			<option value={0.5}>1/2</option>
			<option value={0.25}>1/4</option>
		{/if}
	</select>
</li>

<style lang="scss">
	.dih-roll-number {
		position: relative;
		min-width: 5.5ch;
		padding: 0.125rem 0.25rem;
		text-align: center;
		border-radius: 3px;
		border: 0.5px solid var(--dih-roll-color);
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: var(--dih-roll-color, #ccc);
			opacity: 0.3;
		}
	}

	.multiplier {
		font-size: inherit;
		height: 1.25rem;
		margin-left: auto;
		text-align: center;
	}
</style>
