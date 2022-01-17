// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { moduleName, moduleTag } from './constants.js';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                   AC Check Class
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export class hitCheck {
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
	_confirmHit(item, roll, actor, dataOptions) {
		if (roll.options?.rollMode === 'selfRoll') return;

		// Get targetted tokens
		const targets = [...(game.user.targets?.values() ?? [])].filter(
			t => !!t.actor
		);
		if (!targets.length) return;

		// Get hit data
		const critThreshold = item.data.data.attack.critThreshold;
		const hitData = targets.map(t => this._checkHit(critThreshold, roll, t));
		console.log(hitData);

		// Construct Display Data
		const html = `
			<ul class="a5e-chat-card dih-card">
			${this._displayData(hitData, roll)} 
			</ul>
		`;

		const msgData = {
			blind: true,
			content: html,
			flavor: game.i18n.localize(`${moduleName}.card-title`),
			speaker: ChatMessage.getSpeaker({ actor }),
			type: CONST.CHAT_MESSAGE_TYPES.OTHER,
			user: game.user.data._id,
			// whisper: ChatMessage.getWhisperRecipients('GM'),
		};

		setTimeout(_ => ChatMessage.create(msgData), 0);

		Hooks.call('attackRollHit', item, roll, actor);
	}

	/**
	 *
	 * @param {*} critThreshold
	 * @param {*} roll
	 * @param {*} token
	 * @returns {}
	 */
	_checkHit(critThreshold, roll, token) {
		// Get AC
		const ac = token.actor.data.data.attributes.ac;
		const rollTotal = roll.total;
		const d20 = roll.dice[0];

		// Check if critical hit or miss
		const isCritHit =
			d20.faces === 20 &&
			d20.values.length === 1 &&
			d20.total >= (critThreshold ?? 20);

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
							? game.i18n.localize(`${moduleName}.crit`)
							: game.i18n.localize(`${moduleName}.fumble`)
						: isHit
						? game.i18n.localize(`${moduleName}.hit`)
						: game.i18n.localize(`${moduleName}.miss`);

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
//                             Damage Application Class
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
