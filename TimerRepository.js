const { Pool } = require('pg');

const TABLE_NAME = "notifications";

module.exports = class {
    

    constructor(){
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }


    async fetchLastNotification() {
        this.checkOrCreateTimerTable();

        let result = await this.pool.query(`SELECT id, created_at FROM ${TABLE_NAME} ORDER BY created_at DESC LIMIT 1`);

        console.log('Result fetched from last notification: ', result);

        return result[0];
    }


    async insertNewNotification() {
        this.checkOrCreateTimerTable();


        let result = await this.pool.query(`INSERT INTO ${TABLE_NAME} (created_at) VALUES (${new Date().toISOString()})`);
        console.log('Inserted into TABLE: ', result);


    }


    async checkOrCreateTimerTable() {
        await this.pool.query(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
            id SERIAL,
            created_at TIMESTAMP  
        )`);            
    }
}