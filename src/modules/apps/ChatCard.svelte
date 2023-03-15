<script>
	import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';
	export let messageDocument;

	const message = new TJSDocument(messageDocument);

	console.log(message);
</script>

Hello
