import { moduleName, moduleTag } from './constants';

export default class HitCheck {
	constructor() {
		Hooks.on('a5e.itemActivate', this.#handler.bind(this));
	}

	#handler(item, data) {
		if (!data.action) return;
		const rolls = Object.values(data.rolls).filter(roll =>
			['attack', 'damage', 'healing'].includes(roll.type)
		);
		if (!rolls.length) return;

		// Get Targets
		const targets = [...(game.user.targets?.values() ?? [])].filter(
			t => !!t.actor
		);
		if (!targets.length) return;

		// Filter rolls into attack, damage, and healing rolls.
		const attackData = this.#prepareAttackRollData(
			rolls.filter(roll => roll.type === 'attack')[0]
		);
		const damageRolls = this.#prepareDamageData(
			rolls.filter(roll => roll.type === 'damage')
		);
		const healingRolls = this.#prepareHealingData(
			rolls.filter(roll => roll.type === 'healing')
		);

		console.log(data);

		const chatData = {
			user: game.user?.id,
			speaker: ChatMessage.getSpeaker({ actor: item.parent }),
			type: CONST.CHAT_MESSAGE_TYPES.OTHER,
			sound: CONFIG.sounds.dice,
			flags: {
				[moduleName]: {
					actorId: item.parent.uuid,
					cardType: 'hitCheck',
					rollData: data.rolls.map(({ roll, ...rollData }) => rollData),
				},
			},
			content: '<article></article>',
		};

		ChatMessage.create(chatData);
	}

	/**
	 *
	 * @param {Object} attackRoll
	 */
	#prepareAttackRollData(attackRoll) {
		if (!attackRoll) return {};

		const d20 = attackRoll?.roll?.dice?.[0];
		const isFumble = d20?.faces === 20 && d20?.total === 1;

		const data = {
			isCrit: attackRoll?.isCrit,
			isFumble,
			rollTotal: attackRoll?.roll?.total,
		};

		return data;
	}

	/**
	 *
	 * @param {Array<Object>} damageRolls
	 */
	#prepareDamageData(damageRolls) {
		if (!damageRolls.length) return;

		const data = damageRolls.map(roll => {
			return {
				canCrit: roll.canCrit,
				label: roll.label,
				damage: roll.total,
				damageType: roll.damageType,
			};
		});

		return data;
	}

	/**
	 *
	 * @param {Array<Object>} healingRolls
	 */
	#prepareHealingData(healingRolls) {
		if (!healingRolls.length) return;

		const data = healingRolls.map(roll => {
			return {
				label: roll.label,
				healing: roll.total,
				healingType: roll.healingType,
			};
		});

		return data;
	}
}
