// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import './scss/main.scss';

import { moduleName, moduleTag } from './modules/constants';
import registerSettings from './modules/settings';

import ChatCard from './modules/apps/ChatCard.svelte';

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
	console.log(`${moduleTag} | Ready.`);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                   Chat Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Hooks.on('renderChatMessage', (message, html) => {
	if (game.user.isGM) return;
	if (msg.data.blind) $html.addClass('dih--hidden');

  if (message.getFlag(moduleName, 'cardType')) {
    message._svelteComponent = new ChatCard({
      target: $(html).find('.message-content article')[0],
      props: { messageDocument: message }
    });
  }
});

Hooks.on('preDeleteChatMessage', (message) => {
  const flagData = message?.flags[moduleName];

  if (typeof flagData === 'object' && typeof message?._svelteComponent?.$destroy === 'function') {
    message._svelteComponent.$destroy();
  }
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
