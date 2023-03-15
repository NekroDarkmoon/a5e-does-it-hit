// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { moduleName, moduleTag } from './modules/constants.js';
import { constructCard } from './modules/constructCard.js';
import { hitCheck } from './modules/hitCheck.js';
import { healAutomation } from './modules/healAutomation.js';
import HitChatMessage from './modules/apps/HitChatMessage.svelte';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     Main Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Hooks.once('init', async function () {
	console.log(`${moduleTag} | Initializing.`);

	// Register Settings

	console.log(`${moduleTag} | Registered Settings`);
});

Hooks.once('setup', async function () {
	console.log(`${moduleTag} | Setup.`);
});

Hooks.once('ready', async function () {
	// Enable Hit Check and damage application
	new hitCheck();
	new healAutomation();

	console.log(`${moduleTag} | Ready.`);

	libWrapper.register(
		moduleName,
		'CONFIG.Actor.documentClass.prototype.constructItemCard',
		dummyHook,
		'WRAPPER'
	);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                   Chat Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Hooks.on('renderChatMessage', async function (msg, $html) {
	if (game.user.isGM) return;
	if (msg.data.blind) $html.addClass('dih--hidden');
});

// Hooks.on('renderChatLog', constructCard.registerListeners);

Hooks.on('renderChatMessage', (msg, html) => {
	const flagData = msg.getFlag(moduleName, 'data');
	if (typeof flagData === 'object')
		new HitChatMessage({ target: html[0], props: flagData });
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                   Dummy Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function dummyHook(wrapped, data) {
	const actor = this.data;
	const item = actor.items.get(data.id);
	if (data.actionOptions?.includes('attack')) {
		const roll = data.attack.roll;
		Hooks.call('dih-attackRoll', item, roll, actor, data);
	}

	// if (data.actionOptions?.includes('savingThrow')) {
	// 	const save = data.savingThrow;
	// 	Hooks.call('dih-saveItemRolled', item, save, actor, data);
	// }

	if (data.actionOptions?.includes('healing')) {
		const heal = data.healing;
		Hooks.call('dih-healingItemRolled', item, heal, actor, data);
	}

	return wrapped(data);
}