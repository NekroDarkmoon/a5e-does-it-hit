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
		const hitData = targets.map(t => this._getHitData(item, roll, t));
		console.log(hitData);

		// Get Damage Data
		const dmgData = hitData.map(h => this._getDmgData(h, item, _data));
		console.log(dmgData);

		// TODO: Move to constructCard
		// Construct display Data
		const html = `
			<ul class="a5e-chat-card dih-card">
			${constructCard.hitCheck(hitData)} 
			</ul>
		`;

		// Send data to message
		constructCard.toMessage(actor, html);
	}

	_getHitData(i, r, t) {
		// Construct Required Vars
		const ac = t.actor.data.data.attributes.ac;
		const rollTotal = r.total;
		const d20 = r.dice[0];
		const critThreshold = i.data.data.attack.critThreshold;

		const isCrit = d20.faces === 20 && d20.total >= (critThreshold ?? 20);
		const isFumble = d20.faces === 20 && d20.total === 1;

		const isHit = !isFumble && (isCrit || rollTotal >= ac);

		const data = { ac, isCrit, isFumble, isHit, rollTotal, token: t };

		// API Integration - Hook Calls
		if (isCrit) Hooks.call('dih-attackRollCrit', data);
		if (isFumble) Hooks.call('dih-attackRollFumble', data);
		if (isHit) Hooks.call('dih-attackRollHit', data);
		if (!isHit) Hooks.call('dih-attackRollMiss', data);

		return data;
	}

	//
	_getDmgData(hitData, item, _data) {
		// Construct required vars
		const { isHit, token } = hitData;
		const dmgRolls = _data.damage;
		const resistances = token.actor.data.data.traits.damageResistances;
		const immunities = token.actor.data.data.traits.damageImmunities;
		const vulnerabilities = token.actor.data.data.traits.damageVulnerabilities;

		// Perform resistance and immunity checks
		const damageArray = dmgRolls.map(roll => {
			return { total: roll.roll.total, type: roll.damageType };
		});

		const appliedDamage = damageArray.map(dmg => {
			let value = dmg.total;
			if (resistances.includes(dmg.type)) value = Math.floor(value / 2);
			if (vulnerabilities.includes(dmg.type)) value = Math.floor(value * 2);
			if (immunities.includes(dmg.type)) value = 0;

			return { type: dmg.type, value };
		});

		const damage = appliedDamage.reduce((a, b) => a + b.value, 0);
		const data = { appliedDamage, damage, isHit, token };

		// API Integration - Hook Callls
		Hooks.call('dih-preDamageApply', data);

		return data;
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
