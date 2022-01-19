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
	 * @param {Array<String>} a1
	 * @param {Array<String>} a2
	 * @returns {String} html
	 */
	// TODO: Abstract it to multiple arrays if needed
	static mergeDisplayArrays(a1, a2) {
		const displayData = [];
		for (let index = 0; index < a1.length; index++) {
			displayData.push(a1[index]);
			displayData.push(a2[index]);
		}

		return displayData.join('');
	}

	/**
	 *
	 * @param {*} hitData
	 * @returns {Array<HTML>}
	 */
	static hitCheck(hitData) {
		const data = hitData.map(
			({ ac, isCrit, isFumble, isHit, rollTotal, token }) => {
				const label =
					isCrit || isFumble
						? isCrit
							? 'crit'
							: 'fumble'
						: isHit
						? 'hit'
						: 'miss';

				return `
				<li class="dih__target-display">
					<img 
						class="dih__img-display" 
						src="${token.data.img}"
						title="${token.data.name}"
						width="30px"
						height="30px"
					/>
					<h3 class="dih__h3">${token.data.name}</h3>
					<div class="dih__roll-display dih__hit-label--${label}">${rollTotal}</div>
          <div class="dih__ac-display">${ac}</div>
				</li>
			`;
			}
		);

		return data;
	}

	/**
	 *
	 * @param {*} dmgData
	 * @returns {Array<HTML>}
	 */
	static dmgDisplay(dmgData) {
		const data = dmgData.map(({ baseDamage, calcDamage, token }) => {
			const hp = token.actor.data.data.attributes.hp.current;
			const newHp = hp - baseDamage < 0 ? 0 : hp - baseDamage;
			const cNewHp = hp - calcDamage < 0 ? 0 : hp - calcDamage;
			return `
			<li class="dih__damage-display">
				
				<div class="dih__dmg-values"> 
					<p>${hp} - ${baseDamage}[${calcDamage}] -> ${newHp}[${cNewHp}] </p>
				</div>
				
				<select class="dih__mult-selector">
					<option value="base">Base</option>
					<option value="calc">Calc</option>
					<option value="x0.5">1/2</option>
					<option value="x2">2</option>
				</select>

				<button type=button class="dih__button" id="dih--apply">
					<i class="fas fa-check"></i>
				</button> 
				<button type=button class="dih__button" id="dih--reset">
					<i class="fas fa-undo"></i>
				</button> 
			</li>
			`;
		});

		return data;
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

		setTimeout(async _ => {
			return await ChatMessage.create(msgData);
		}, 0);
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
