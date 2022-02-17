const webhook = require("webhook-discord");

const Hook = new webhook.Webhook(process.env.WEBHOOK_WORDLE);

module.exports = class {

    constructor() {}


    async notify() {

        Hook.send("¡Atención @here!, Recordatorio de realizar el WORDLE de **HOY**.");

    }
}