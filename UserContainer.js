const User = require('./User.js');
const webhook = require("webhook-discord");
const { Pool } = require('pg');




const Hook = new webhook.Webhook(process.env.WEBHOOK);

module.exports = class {
    

    constructor(){
        this.timer = undefined;


        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
    }

    async getUsers() {

        try {
            let rawData = await this.pool.query('SELECT * FROM users');
            return this.convertSqlToUsers(rawData.rows);
        } catch (err) {
            console.log('Error fetching all users: ', err);
            return 'Error fetching users';
        }
    }

    addUser(user) {
        console.log('New user was created, adding to list: ', user);
        this.saveUser(user);
    }

    async removeUser(user){
        console.log('Removed user: ', user);
        let sqlDelete = `DELETE FROM users WHERE username = ($1)`;
        try {
            this.pool.query(sqlDelete, [user.getName()]);
        } catch(err) {
            console.log('Error deleting user: ', err);
        }
    }

    async getUserByName(name) {
        let sqlSearchByName = 'Select user_id, username, datebirth, message from users WHERE username like ($1)';

        try {
            let response = await this.pool.query(sqlSearchByName, [name]);
            return this.convertSqlToUsers(response.rows);
        } catch (err) {
            console.log('Error fetching user: ', err);
            //TODO: Manage errors :)
            return [];
        }
    }


    async notify() {

        let cont = 0;

        let value = this.convertToToday();
        let sqlNotify = `SELECT user_id, username, datebirth, message from public.users where datebirth LIKE '${value}'`;

        console.log(sqlNotify);

        try {
            let rawData = await this.pool.query(sqlNotify);
            let users = this.convertSqlToUsers(rawData.rows);

            users.forEach(usr => {
                        
                let msg = usr.getName();
                msg += "\n" + usr.getMessage();

                const cHook = new webhook.MessageBuilder()
                    .setTitle(usr.getName())
                    .setName("Cumpleaños")
                    .setColor("#aabbcc")
                    .setDescription(usr.getMessage());
                Hook.send(cHook);

                cont++;
            });

        } catch(error) {
            console.log('Error trying to notify users: ', error);
        }

        return cont;
    }

    saveUser(user) {
        let sqlInsert = 'INSERT INTO public.users(username, dateBirth, message) values ($1, $2, $3)';
        let values = this.convertUserToSql(user);
        this.pool.query(sqlInsert, values)
            .catch(err => console.log('Error inserting new user: ', err));
    }

    convertUserToSql(user) {
        return [user.getName(), ''+ user.getBirth().m +'-'+ user.getBirth().d , user.getMessage()];
    }

    convertSqlToUsers(rows) {
        return rows.map(row => {
            try {   
                return new User(row.username, row.datebirth, row.message);
            } catch(error) {
                console.log('Cannot convert row: ', rows);
            }
        })
    }

    convertToToday() {
        let today = new Date();
        let month = (today.getMonth() + 1 < 10) ? '0' + String(today.getMonth() + 1) : String(today.getMonth() + 1);
        let day = (today.getDate() < 10 ) ? '0' + String(today.getDate()) : today.getDate();

        return month + '-' + day;
    }
}