<script>
	import { getContext, setContext } from 'svelte';
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
	import { DynMapReducer } from '#runtime/svelte/store/reducer';

	import { moduleName } from '../modules/constants';
	import TJSTokenDocument from '../modules/TJSTokenDocument';

	import DamageSection from './components/DamageSection.svelte';
	import HitSection from './components/HitSection.svelte';

	const message = getContext('message');

	let cardData = $message.flags?.[moduleName];

	const attackData = cardData.attackData;
	const damageData = cardData.damageData;
	const healingData = cardData.healingData;

	const attacker = new TJSDocument(fromUuidSync(cardData.actorId));
	const tokens = cardData.targets
		.map(t => [t, fromUuidSync(t)])
		.filter(([_, t]) => t);
	const targets = new Map(
		tokens.map(([id, token]) => [id, new TJSTokenDocument(token)])
	);

	const reducer = new DynMapReducer(targets);

	setContext('attacker', attacker);
</script>

<section class="section-container">
	{#each [...$reducer] as target}
		<HitSection {target} {attackData} {cardData} />

		<DamageSection {target} {damageData} {cardData} />
	{/each}
</section>

<style lang="scss">
	.section-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.25rem;
	}
</style>
