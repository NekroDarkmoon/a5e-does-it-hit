<script>
	import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';

	import { moduleName, moduleTag } from '../constants';

	import HitCheckCard from './HitCheckCard.svelte';

	export let messageDocument;

	function getBodyComponent() {
		console.log($message.flags[moduleName].cardType);
		switch ($message?.flags[moduleName]?.cardType) {
			case 'hitCheck':
				return HitCheckCard;
		}
	}

	console.log(messageDocument);

	const message = new TJSDocument(messageDocument);
</script>

<svelte:component this={getBodyComponent()} {message} />
