const amqp = require('amqplib/callback_api');

const daiWpp = process.env.DAI_WPP;
const queue = process.env.PROD_QUEUE || 'prod_wpp_queue';


module.exports = class {

    constructor() {
        this.channelMq = null;

        amqp.connect(process.env.RABBIT_PRODUCER, function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createConfirmChannel(function (error1, channel) {
                if (error1) {
                    console.log(`Error1?`);
                    throw error1;
                }

                channel.assertQueue(queue, {
                    durable: true
                });
        
        
                this.channelMq = channel;
            });
        
        });

    }


    async notify() {

        channelRabbit.sendToQueue(queue, Buffer.from(JSON.stringify({ chatId: daiWpp, message: `Holi, esta notificación es un recordatorio.` })), {
            persistent: true
        });
    }
}