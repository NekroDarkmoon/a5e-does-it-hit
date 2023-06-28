import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store"

export default class TJSTokenDocument extends TJSDocument {

	set(document, options = {}) {
		super.set(document, options);

		if (document instanceof globalThis.foundry.abstract.Document) {
			document.apps[this.uuidv4].closing = false;
			document.apps[this.uuidv4].preview = this.get();
			document.apps[this.uuidv4]._previewChanges = () => {};
		}
	}
}