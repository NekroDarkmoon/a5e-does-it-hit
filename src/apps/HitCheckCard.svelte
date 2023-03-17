<script>
	import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
	import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';

	import { moduleName, moduleTag } from '../modules/constants';
	import HitCheck from '../modules/HitCheck';

	export let message;

	let cardData = $message.flags?.[moduleName];

	const attacker = new TJSDocument(fromUuidSync(cardData.actorId));
	const targets = cardData.targets.map(t => new TJSDocument(fromUuidSync(t)));
</script>

<section class="section-container">
	{#each targets as target}
		<div class="hit-section">
			<!--  -->
			<img src="" alt="" />
			<span class="hit-section__name">
				{target.name}
			</span>
		</div>

		<div class="damage-section">
			<!--  -->
		</div>
	{/each}
</section>

<style lang="scss">
</style>
