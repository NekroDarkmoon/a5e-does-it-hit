<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';
	import { DynMapReducer } from '@typhonjs-fvtt/runtime/svelte/store';

	import { moduleName, moduleTag } from '../modules/constants';
	import HitCheck from '../modules/HitCheck';

	import DamageSection from './components/DamageSection.svelte';
	import HitSection from './components/HitSection.svelte';

	export let message;

	let cardData = $message.flags?.[moduleName];

	const attackData = cardData.attackData;
	const damageData = cardData.damageData;
	const healingData = cardData.healingData;

	const attacker = new TJSDocument(fromUuidSync(cardData.actorId));
	const targets = new Map(
		cardData.targets.map(t => [t, new TJSDocument(fromUuidSync(t))])
	);

	const reducer = new DynMapReducer(targets);
	console.log(reducer.data);
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
	}
</style>
