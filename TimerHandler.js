const TimeRepository = require('./TimerRepository.js');


module.exports = class {
    

    constructor(){
        this.repo = new TimeRepository();
    }


    async isNotificationNeeded() {
        let lastNotif = await this.repo.fetchLastNotification();

        if (lastNotif && lastNotif.created_at) {
            let oldDate = new Date(lastNotif.created_at);

            oldDate.setHours(oldDate.getHours() + 24);

            let newDate = new Date();

            if (oldDate  < newDate) {
                return true;
            }
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