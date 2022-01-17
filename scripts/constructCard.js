// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { moduleName, moduleTag } from './constants.js';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export class constructCard {
	/**
	 *
	 * @param {*} hitData
	 * @returns
	 */
	static hitCheck(hitData) {
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

	/**
	 * @param {*} actor
	 * @param {*} displayData
	 */
	static toMessage(actor, displayData) {
		const msgData = {
			blind: true,
			content: displayData,
			flavor: game.i18n.localize(`${moduleName}.card-title`),
			speaker: ChatMessage.getSpeaker({ actor }),
			type: CONST.CHAT_MESSAGE_TYPES.OTHER,
			user: game.user.data._id,
			// whisper: ChatMessage.getWhisperRecipients('GM'),
		};

		setTimeout(_ => ChatMessage.create(msgData), 0);
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
