const webhook = require("webhook-discord");

const Hook = new webhook.Webhook(process.env.WEBHOOK_WORDLE);

module.exports = class {

    constructor() {}


    async notify() {


        const cHook = new webhook.MessageBuilder()
            .setTitle("Aviso de palabra diaria")
            .setName("Wordle")
            .setColor("#aabbcc")
            .setDescription("¡Atención @here!, Recordatorio de realizar el WORDLE de **HOY**.");
        Hook.send(cHook);

    }
}