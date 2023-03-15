import { moduleName, modTag } from "./constants"; 

export default class HitCheck {
  constructor() {
    Hooks.on('itemActivate', this.#handler.bind(this));
  }

  #handler(item, data) {
    if (!data.action) return;
  	const rolls = Object.values(data.action.rolls)
			.filter((roll) => ['attack', 'damage', 'healing'].includes(roll.type));

		console.log(rolls);
  }
}