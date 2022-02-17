const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(process.env.WEBHOOK_WORDLE);

module.exports = class {

    constructor() {}


    async notify() {

        hook.setUsername("Wordle");
        hook.send("¡Atención @here!, Recordatorio de realizar el WORDLE de **HOY**.");

    }
}