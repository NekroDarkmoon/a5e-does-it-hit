import { moduleName, moduleTag } from "./constants"; 

export default class HitCheck {
  constructor() {
    Hooks.on('a5e.itemActivate', this.#handler.bind(this));
  }

  #handler(item, data) {
		console.log("Hello");
    if (!data.action) return;
  	const rolls = Object.values(data.action.rolls)
			.filter((roll) => ['attack', 'damage', 'healing'].includes(roll.type));

		if (!rolls.length) return;

    const targets = [...game.user.targets?.values() ?? []].filter(
      t => !!t.actor
    );

    if (!targets.length) return;

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: item.parent }),
      type: data.rolls.length ? CONST.CHAT_MESSAGE_TYPES.ROLL : CONST.CHAT_MESSAGE_TYPES.OTHER,
      sound: CONFIG.sounds.dice,
      flags: {
        [moduleName]: {
          actorId: item.parent.uuid,
          cardType: 'hitCheck',
          rollData: data.rolls.map(({roll, ...rollData}) => rollData)
          
        }
      },
      content: '<article></article>'
    }

    ChatMessage.create(chatData);
  }
}