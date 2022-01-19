// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { moduleName, moduleTag } from './scripts/constants.js';
import { constructCard } from './scripts/constructCard.js';
import { hitCheck } from './scripts/hitCheck.js';

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

	console.log(`${moduleTag} | Ready.`);

	libWrapper.register(
		moduleName,
		'CONFIG.Actor.documentClass.prototype.constructItemCard',
		dummyHook,
		'WRAPPER'
	);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                  Specific Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Hooks.on('renderChatMessage', async function (msg, $html) {
	if (game.user.isGM) return;
	if (msg.data.blind) $html.addClass('dih--hidden');
});

Hooks.on('renderChatLog', constructCard.registerListeners);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                   Dummy Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function dummyHook(wrapped, data) {
	const actor = this.data;
	const item = actor.items.get(data.id);
	if (data.attack?.roll) {
		const roll = data.attack.roll;
		Hooks.call('attackRoll', item, roll, actor, data);
	}

	return wrapped(data);
}
