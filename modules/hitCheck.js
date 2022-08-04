// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { moduleName, moduleTag } from './constants.js';
import { constructCard } from './constructCard.js';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                    Main Class
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export class hitCheck {
	constructor() {
		Hooks.on('dih-attackRoll', this._handler.bind(this));
	}

	_handler(item, roll, actor, _data) {
		if (roll.options?.rollMode === 'selfRoll') return;

		// Get Targets
		const targets = [...(game.user.targets?.values() ?? [])].filter(
			t => !!t.actor
		);

		if (!targets.length) return;

		// Get Hit and Damage data
		const hitData = targets.map(t => this._hitData(actor, item, roll, t));
		console.log(hitData);
		const dmgData = hitData.map(i => this._dmgData(i, _data));
		console.log(dmgData);
	}

	_hitData(actor, item, roll, target) {
		// Variables
		const ac = target.actor.system.attributes.ac;
		const rollTotal = roll.total;
		const d20 = roll.dice[0];
		const critThreshold = item.system.attack.critThreshold;

		const isCrit = d20.faces === 20 && d20.total >= (critThreshold ?? 20);
		const isFumble = d20.faces === 20 && d20.total === 1;

		const isHit = !isFumble && (isCrit || rollTotal >= ac);
		console.info(
			`${moduleTag} | ${actor.name} ${isHit ? 'hits' : 'misses'} ${
				target.name
			} with a ${rollTotal}`
		);

		return { ac, isCrit, isFumble, isHit, rollTotal, token: target };
	}

	_dmgData(hitData, _data) {
		// Variables
		const { isHit, token } = hitData;
		const dmgRolls = _data.damage;
		const dr = token.actor.system.traits.damageResistances;
		const di = token.actor.system.traits.damageImmunities;
		const dv = token.actor.system.traits.damageVulnerabilities;

		// Create base damage array
		const baseDamageArray = dmgRolls.map(d => ({
			total: d.roll.total,
			type: d.damageType,
		}));

		// Get base damage value
		const baseDamage = baseDamageArray.reduce((a, b) => a + b.total, 0);

		// Create calculated damage array
		const calcDamageArray = baseDamageArray.map(dmg => {
			let value = dmg.total;
			if (dr.includes(dmg.type)) value = Math.floor(value / 2);
			if (dv.includes(dmg.type)) value = Math.floor(value * 2);
			if (di.includes(dmg.type)) value = 0;

			return { type: dmg.type, value };
		});

		// Get Calculated damage value
		const calcDamage = calcDamageArray.reduce((a, b) => a + b.value, 0);

		return {
			baseDamage,
			baseDamageArray,
			calcDamageArray,
			calcDamage,
			isHit,
			token,
		};
	}
}
