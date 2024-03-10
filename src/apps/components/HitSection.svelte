<script>
	export let target;
	export let attackData;
	export let cardData;

	const hit = () =>
		attackData.isCrit || attackData.rollTotal >= ac ? true : false;

	let targetFlag = cardData.targetData?.[$target?.id];
	$: ac = targetFlag?.ac ?? $target?.actor.system.attributes.ac.value ?? 0;
</script>

<div class="dih-hit-section">
	{#if $target}
		<img
			class="dih-target-img"
			src={$target.texture.src}
			alt={$target.displayName ?? $target.name}
		/>

		<span class="dih-target-name">
			{$target.name}
		</span>

		{#if attackData.rollTotal}
			<div
				class="dih-hit-section__roll"
				class:dih-hit-section__roll--hit={hit()}
				class:dih-hit-section__roll--crit={attackData.isCrit}
			>
				{attackData.rollTotal ?? ''}
			</div>

			<div class="dih-hit-section__ac">
				{ac}
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.dih-hit-section {
		display: grid;
		grid-template-areas: 'img name hitRoll ac';
		grid-template-columns: 2.5rem 1fr 4ch 4ch;
		gap: 0.5rem;
		align-items: center;
		font-size: 1rem;

		&__roll {
			--die-background-color: rgba(168, 3, 0, 0.2);
			--accent-text-color: rgb(168, 3, 0);

			grid-area: hitRoll;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-weight: bold;

			&::before {
				content: '\f6cf';
				position: absolute;
				font-family: 'Font Awesome 6 Pro';
				color: var(--die-background-color);
				font-size: 2rem;
			}

			&::after {
				content: 'MISS';
				position: absolute;
				bottom: 0;
				font-size: 0.694rem;
				color: var(--accent-text-color);
			}

			&--hit {
				--die-background-color: rgba(24, 82, 11, 0.2);
				--accent-text-color: rgba(24, 82, 11);

				&::after {
					content: 'HIT';
				}
			}

			&--crit::after {
				content: 'CRIT';
			}
		}

		&__ac {
			grid-area: ac;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-weight: bold;

			&::before {
				content: '\f132';
				position: absolute;
				font-family: 'Font Awesome 6 Pro';
				color: rgba(0, 0, 0, 0.15);
				font-size: 2rem;
			}
		}
	}

	.dih-target-name {
		grid-area: name;
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.dih-target-img {
		grid-area: img;
		border: none;
		width: 2.5rem;
		height: 2.5rem;
	}
</style>
