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

		// Get Display Data
		const displayData = targets.map(t => this._checkHit(t, roll));
		console.log(displayData);
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

		return { ac, isCritHit, isFumble, isHit, token };
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                    Imports
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                    Imports
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                    Imports
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                    Imports
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                                     Hooks
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Hooks.once('init', async function () {});

Hooks.once('ready', async function () {
	console.log(`${moduleTag} | Initializing. `);

	// Dummy hook
	libWrapper.register(
		moduleName,
		'CONFIG.Actor.documentClass.prototype.constructItemCard',
		function (wrapped, data) {
			console.log(data);
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
