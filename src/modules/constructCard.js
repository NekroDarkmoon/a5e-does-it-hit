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
			const hp = token.actor.data.data.attributes.hp.value;
			const newHp = hp - baseDamage < 0 ? 0 : hp - baseDamage;
			const cNewHp = hp - calcDamage < 0 ? 0 : hp - calcDamage;
			return `
			<li class="dih__damage-display">
				
				<div class="dih__dmg-values"> 
					<p>${hp} - ${baseDamage}[${calcDamage}] -> ${newHp}[${cNewHp}] </p>
				</div>
				
				<select class="dih__mult-selector">
					<option value="${baseDamage}">Base</option>
					<option value="${calcDamage}">Calc</option>
					<option value="${baseDamage * 2}">2</option>
					<option value="${baseDamage * 0.5}">1/2</option>
					<option value="${baseDamage * 0.25}">1/4</option>
				</select>

				<button 
					class="dih__button dih__apply" 
					data-token-id="${token.id}"
				>
					<i class="fas fa-check"></i>
				</button> 

				<button 
					class="dih__button dih__reset" 
					data-token-id="${token.id}"
					data-applied="false"
					disabled
				>
					<i class="fas fa-undo"></i>
				</button> 
			</li>
			`;
		});

		return data;
	}

	/**
	 * @param {*} targets
	 * @param {*} healData
	 * @returns
	 */
	static healDisplay(targets, healData) {
		const data = targets.map(t => {
			const { value, max, temp } = t.actor.data.data.attributes.hp;
			const newHp = Math.clamped(value + healData.heal, value, max);
			const newTemp = temp
				? healData.tempHeal >= temp
					? healData.tempHeal
					: temp
				: healData.tempHeal;

			if (value === newHp && newTemp === temp) return '';

			return `
			<li class="dih__heal-display">
				<img 
					class="dih__img-display"
					src="${t.data.img}"
					title="${t.data.name}"
					width="30px"
					height=30px"
				/>
				<h3 class="dih__h3">${t.data.name}</h3>

				<div class="dih--tooltip-container">
				<button
					class="dih__button dih__heal-apply ${newHp === value ? 'dih--hidden' : ''}"
					title="${value}/${max} 🠖 ${newHp}/${max}"
					data-token-id="${t.id}"
					data-amt="${healData.heal}"
				>
					<i class="fas fa-heart"> Heal</i>
				</button>
				</div>

				<div class="dih--tooltip-container">
				<button
					class="dih__button dih__temp-apply ${temp === newTemp ? 'dih--hidden' : ''}"
					title="${temp ? temp : 0} 🠖 ${newTemp}"
					data-token-id="${t.id}"
					data-amt="${healData.tempHeal}"
				>
					<i class="fas fa-plus"> Temp</i>
				</button>
				</div>

			</li>
			`;
		});

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
			speaker: ChatMessage.getSpeaker({ actor }),
			type: CONST.CHAT_MESSAGE_TYPES.OTHER,
			user: game.user.data._id,
			// whisper: ChatMessage.getWhisperRecipients('GM'),
		};

		setTimeout(async _ => {
			return await ChatMessage.create(msgData);
		}, 0);
	}

	static registerListeners(_chatLog, $html) {
		// Damage listeners
		$html.on('click', '.dih__apply', constructCard._onApplyDamage);
		$html.on('click', '.dih__reset', constructCard._onResetDamage);

		// Heal Listeners
		$html.on('click', '.dih__heal-apply', constructCard._onApplyHeal);
		$html.on('click', '.dih__temp-apply', constructCard._onApplyTemp);
		$html.on('click', '.dih__heal-apply-all', constructCard._onApplyHealMulti);
		$html.on('click', '.dih__temp-apply-all', constructCard._onApplyTempMulti);
	}

	static async _onApplyDamage(e) {
		e.preventDefault();

		const target = e.currentTarget;
		const token = canvas.scene.tokens.get(target.dataset.tokenId);
		const damage = Math.floor(e.currentTarget.previousElementSibling.value);
		await token.actor.applyDamage(damage);

		console.info(
			`${moduleTag} | Applied ${damage} damage to ${token.data.name}`
		);

		target.nextElementSibling.dataset.damage = damage;
		target.nextElementSibling.disabled = false;
		target.disabled = true;
	}

	static async _onResetDamage(e) {
		e.preventDefault();

		const target = e.currentTarget;
		const token = canvas.scene.tokens.get(target.dataset.tokenId);
		const damage = Number(e.currentTarget.dataset.damage);

		if (!damage)
			return ui.notifications.error(
				`${moduleTag} | Unable to fetch applied damage.`
			);

		// Sanitize Hp
		const { value, max } = token.actor.data.data.attributes.hp;
		const hp = Math.clamped(value + damage, value, max);

		await token.actor.update({ 'data.attributes.hp.value': hp });
		console.info(
			`${moduleTag} | Removed ${damage} damage from ${token.data.name}`
		);

		// Update buttons
		target.previousElementSibling.disabled = false;
		target.disabled = true;
	}

	static async _onApplyHeal(e) {
		e.preventDefault();

		const $div = e.currentTarget;
		const token = canvas.scene.tokens.get($div.dataset.tokenId);
		const healing = Number($div.dataset.amt);

		// Apply Healing
		if (token && healing) {
			await token.actor.applyHealing(healing);
			console.log(
				`${moduleTag} | ${token.data.name} healed for ${healing} points.`
			);
		}

		// Disable
		$div.disabled = true;
	}

	static async _onApplyTemp(e) {
		e.preventDefault();

		const $div = e.currentTarget;
		const token = canvas.scene.tokens.get($div.dataset.tokenId);
		const healing = Number($div.dataset.amt);

		// Apply Healing
		if (token && healing) {
			await token.actor.applyHealing(healing, { temp: true });
			console.log(
				`${moduleTag} | Applied ${healing} temp hp to ${token.data.name}`
			);
		}
		$div.disabled = true;
	}

	static async _onApplyHealMulti(e) {
		e.preventDefault();

		const $div = e.currentTarget;
		const tokens = $div.dataset.tokens
			.split('-')
			.map(t => canvas.scene.tokens.get(t));

		const healing = Number($div.dataset.amt);

		// Apply healing
		tokens.forEach(async t => {
			if (t && healing) await t.actor.applyHealing(healing);
			console.log(
				`${moduleTag} | ${t.data.name} healed for ${healing} points.`
			);
		});

		// Disable
		$div.disabled = true;
		const $ul =
			$div.parentElement.previousElementSibling.querySelectorAll(
				'.dih__heal-apply'
			);

		$ul.forEach(btn => (btn.disabled = true));
	}

	static async _onApplyTempMulti(e) {
		e.preventDefault();

		const $div = e.currentTarget;
		const tokens = $div.dataset.tokens
			.split('-')
			.map(t => canvas.scene.tokens.get(t));

		const healing = Number($div.dataset.amt);

		// Apply healing
		tokens.forEach(async t => {
			if (t && healing) await t.actor.applyHealing(healing, { temp: true });
			console.log(
				`${moduleTag} | Applied ${healing} temp hp to ${t.data.name}`
			);
		});

		// Disable
		$div.disabled = true;
		const $ul =
			$div.parentElement.previousElementSibling.querySelectorAll(
				'.dih__temp-apply'
			);

		$ul.forEach(btn => (btn.disabled = true));
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                               Imports and Constants
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
