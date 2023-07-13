<script>
	import { setContext } from 'svelte';
	import { TJSDocument } from '#runtime/svelte/store/fvtt/document';

	import { moduleName } from '../modules/constants';

	import HitCheckCard from './HitCheckCard.svelte';

	export let messageDocument;

	function getBodyComponent() {
		switch ($message?.flags[moduleName]?.cardType) {
			case 'hitCheck':
				return HitCheckCard;
		}
	}

	const message = new TJSDocument(messageDocument);
	setContext('message', message);
</script>

<svelte:component this={getBodyComponent()} />
