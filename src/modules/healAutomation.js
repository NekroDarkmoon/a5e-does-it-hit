// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { moduleName, moduleTag } from './constants.js';
import { constructCard } from './constructCard.js';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     Main Class
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export class healAutomation {
	constructor() {
		Hooks.on('dih-healingItemRolled', this._healHandler.bind(this));
	}

	_healHandler(item, heal, actor, _data) {
		// Get Targets
		const targets = [...(game.user.targets?.values() ?? [])].filter(
			t => !!t.actor
		);
		if (!targets.length) return;

		// Construct Heal data
		const healData = heal.reduce(
			(a, b) => {
				a.heal += b.healingType === 'healing' ? b.roll.total : 0;
				a.tempHeal += b.healingType === 'temporaryHealing' ? b.roll.total : 0;
				return a;
			},
			{ heal: 0, tempHeal: 0 }
		);

		// Construct display Data
		const displayData = constructCard.healDisplay(targets, healData);
		let html = `
			<ul class="a5e-chat-card dih-card">
				${displayData}
			</ul>
			<div class="dih__apply-all ${targets.length > 1 ? '' : 'dih--hidden'}">
				<button
					class="dih__button dih__heal-apply-all"
					data-tokens="${targets.map(t => t.id).join('-')}"
					data-amt="${healData.heal}"
				>
					<i class="fas fa-heart"> Heal All</i>
				</button>

				<button
					class="dih__button dih__temp-apply-all"
					data-tokens="${targets.map(t => t.id).join('-')}"
					data-amt="${healData.tempHeal}"
				>
					<i class="fas fa-plus"> Temp All</i>
				</button>
			</div>
		`;

		if (displayData === '') html = 'Everyone is topped up.';

		constructCard.toMessage(actor, html);
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     Main Class
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     Main Class
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
