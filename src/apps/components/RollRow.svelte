<script>
	export let roll;
	export let label;
	export let multiplier;
</script>

<li class="dih-roll-list__row">
	<div class="dih-roll-number">
		{Math.floor(roll * multiplier)}
	</div>

	{label}

	<select class="multiplier" bind:value={multiplier}>
		<option value={0}>None</option>
		<option value={1}>Base</option>
		<option value={2}>2</option>
		<option value={0.5}>1/2</option>
		<option value={0.25}>1/4</option>
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
