// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const moduleName = 'does-it-hit-a5e';
const moduleTag = 'Does it Hit?!';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                   Main Class
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
class DoesItHit {
	constructor() {
		Hooks.on('attackRoll', this._confirmHit.bind(this));
	}

	/**
	 *
	 * @param {*} item
	 * @param {*} roll
	 * @param {*} actor
	 * @param {*} options
	 * @returns
	 */
	_confirmHit(item, roll, actor, options) {
		if (roll.options?.rollMode === 'selfRoll') return;

		// Get targetted tokens
		const targets = [...(game.user.targets?.values() ?? [])].filter(
			t => !!t.actor
		);
		if (!targets.length) return;

		// Get hit data
		const hitData = targets.map(t => this._checkHit(t, roll));
		console.log(hitData);

		// Construct Display data
		const displayData = this._displayData(hitData);

		const html = `
			<ul class="a5e-chat-card dih-card">
			${this._displayData(hitData, roll)} 
			</ul>
		`;

		const msgData = {
			// whisper: ChatMessage.getWhisperRecipients('GM'),
			blind: true,
			user: game.user.data._id,
			type: CONST.CHAT_MESSAGE_TYPES.OTHER,
			speaker: ChatMessage.getSpeaker({ actor }),
			content: html,
		};

		setTimeout(_ => ChatMessage.create(msgData), 0);

		Hooks.call('attackRollHit', item, roll, actor);
	}

	/**
	 *
	 * @param {*} token
	 * @param {*} roll
	 * @returns {}
	 */
	_checkHit(token, roll) {
		// Get AC
		const ac = token.actor.data.data.attributes.ac;
		const rollTotal = roll.total;
		const d20 = roll.dice[0];

		// Check if critical hit or miss
		const isCritHit =
			d20.faces === 20 &&
			d20.values.length === 1 &&
			d20.total >= (d20.options.critical ?? 20);

		const isFumble =
			d20.faces === 20 && d20.values.length === 1 && d20.total === 1;

		const isHit = !isFumble && (isCritHit || rollTotal >= ac);

		return { ac, isCritHit, isFumble, isHit, rollTotal, token };
	}

	_displayData(hitData) {
		const data = hitData.map(
			({ ac, isCritHit, isFumble, isHit, rollTotal, token }) => {
				const label =
					isCritHit || isFumble
						? isCritHit
							? 'Critical'
							: 'Fumble'
						: isHit
						? 'Hits'
						: 'Misses';

				return `
				<li class="dih__target">
					<img 
						class="dih__img-display" 
						src="${token.data.img}"
						title="${token.data.name}"
						width="30px"
						height="30px"
					/>
					<h3 class="dih__h3">${token.data.name}</h3>
					<div class="dih__roll-display">${rollTotal}</div>
					<div class="dih__hit-label ${isHit ? 'dih--hit' : 'dih--miss'}">${label}</div>
          <div class="dih__ac-display">${ac}</div>
				</li>
			`;
			}
		);

		return data.join('');
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                    Imports
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Hooks.once('ready', async function () {
	console.log(`${moduleTag} | Initializing. `);

	// Dummy hook
	libWrapper.register(
		moduleName,
		'CONFIG.Actor.documentClass.prototype.constructItemCard',
		function (wrapped, data) {
			const actor = this.data;
			const item = actor.items.get(data.id);
			if (data.attack?.roll) {
				const roll = data.attack.roll;
				Hooks.call('attackRoll', item, roll, actor, {});
			}

			return wrapped(data);
		},
		'WRAPPER'
	);

	new DoesItHit();
});

Hooks.on('renderChatMessage', async function (msg, $html) {
	if (game.user.isGM) return;

	console.log(msg);
	if (msg.data.blind) $html.addClass('dih--hidden');
});
