// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { moduleName, moduleTag } from './constants.js';
import { constructCard } from './constructCard.js';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     Main Class
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export class hitCheck {
	constructor() {
		Hooks.on('attackRoll', this._hitHandler.bind(this));
	}

	_hitHandler(item, roll, actor, _data) {
		if (roll.options?.rollMode === 'selfRoll') return;

		// Get Targets
		const targets = [...(game.user.targets?.values() ?? [])].filter(
			t => !!t.actor
		);

		if (!targets.length) return;

		// Get Hit Data
		const hitData = targets.map(t => this._getHitData(actor, item, roll, t));
		// console.log(hitData);

		// Get Damage Data
		const dmgData = hitData.map(h => this._getDmgData(h, item, _data));
		// console.log(dmgData);

		// Get Display html for each section
		const hitDisplay = constructCard.hitCheck(hitData);
		const dmgDisplay = constructCard.dmgDisplay(dmgData);

		// Construct display Data
		const html = `
			<ul class="a5e-chat-card dih-card">
			${constructCard.mergeDisplayArrays(hitDisplay, dmgDisplay)}
			</ul>
		`;

		// Send data to message
		constructCard.toMessage(actor, html);
	}

	_getHitData(a, i, r, t) {
		// Construct Required Vars
		const ac = t.actor.data.data.attributes.ac;
		const rollTotal = r.total;
		const d20 = r.dice[0];
		const critThreshold = i.data.data.attack.critThreshold;

		const isCrit = d20.faces === 20 && d20.total >= (critThreshold ?? 20);
		const isFumble = d20.faces === 20 && d20.total === 1;

		const isHit = !isFumble && (isCrit || rollTotal >= ac);
		console.info(
			`${moduleTag} | ${a.name} ${isHit ? 'hits' : 'misses'} ${
				t.data.name
			} with a ${rollTotal}`
		);

		const data = { ac, isCrit, isFumble, isHit, rollTotal, token: t };

		// API Integration - Hook Calls
		if (isCrit) Hooks.call('dih-attackRollCrit', data);
		if (isFumble) Hooks.call('dih-attackRollFumble', data);
		if (isHit) Hooks.call('dih-attackRollHit', data);
		if (!isHit) Hooks.call('dih-attackRollMiss', data);

		return data;
	}

	_getDmgData(hitData, _data) {
		// Construct required vars
		const { isHit, token } = hitData;
		const dmgRolls = _data.damage;
		const dr = token.actor.data.data.traits.damageResistances;
		const di = token.actor.data.data.traits.damageImmunities;
		const dv = token.actor.data.data.traits.damageVulnerabilities;

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

		const data = {
			baseDamage,
			baseDamageArray,
			calcDamageArray,
			calcDamage,
			isHit,
			token,
		};

		return data;
	}
}
