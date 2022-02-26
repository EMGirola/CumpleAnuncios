const TimeRepository = require('./TimerRepository.js');


module.exports = class {
    

    constructor(){
        this.repo = new TimeRepository();
    }


    async isNotificationNeeded() {
        let lastNotif = await this.repo.fetchLastNotification();

        if (lastNotif && lastNotif.created_at) {
            console.log('Last notification time: ', lastNotif);
            let oldDate = new Date(lastNotif.created_at);

            oldDate.setHours(oldDate.getHours() + 24);

            let newDate = new Date();

            console.log(`Old time: ${oldDate} VS Now: ${newDate}`);

            if (oldDate  < newDate) {
                return true;
            }

            const diffTime = newDate - oldDate;


            console.log('Notification discarded, cooldown not refreshed, will be in: '+ diffTime + 'ms');

        }
        else {
            console.log('Notification cannot be calculated, returning true...');
            return true;
        }

        return false;
    }

    async insertNotification() {
        await this.repo.insertNewNotification();
    }
}