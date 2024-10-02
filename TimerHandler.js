const TimeRepository = require('./TimerRepository.js');


module.exports = class {


    constructor() {
        this.repo = new TimeRepository();
    }

    async isDaiNotificationNeeded() {
        let lastNotif = await this.repo.fetchLastNotification('DAI');

        if (lastNotif && lastNotif.created_at) {

            let oldDate = new Date(Number(lastNotif.created_at));

            oldDate.setHours(oldDate.getHours() + 24);

            let newDate = new Date();

            console.log(`DAI: Old time: ${oldDate} VS Now: ${newDate}`);

            if (oldDate < newDate) {
                return true;
            }

            const diffTime = oldDate - newDate;


            console.log('DAI: Notification discarded, cooldown not refreshed, will be in: ' + Math.round(((diffTime / 1000) / 60) / 60) + ' hours');

        }
        else {
            console.log('DAI: Notification cannot be calculated, returning true...');
            return true;
        }

        return false;
    }


    async isNotificationNeeded() {
        let lastNotif = await this.repo.fetchLastNotification('ALL');

        if (lastNotif && lastNotif.created_at) {

            let oldDate = new Date(Number(lastNotif.created_at));

            oldDate.setHours(oldDate.getHours() + 24);

            let newDate = new Date();

            console.log(`Old time: ${oldDate} VS Now: ${newDate}`);

            if (oldDate < newDate) {
                return true;
            }

            const diffTime = oldDate - newDate;


            console.log('Notification discarded, cooldown not refreshed, will be in: ' + Math.round(((diffTime / 1000) / 60) / 60) + ' hours');

        }
        else {
            console.log('Notification cannot be calculated, returning true...');
            return true;
        }

        return false;
    }

    async insertNotification(type, hours) {
        await this.repo.insertNewNotification(type, hours);
    }
}