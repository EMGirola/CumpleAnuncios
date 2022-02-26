const { Pool } = require('pg');

const TABLE_NAME = "notifications";
const TABLE_SCHEMA = "public";

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

        let result = await this.pool.query(`SELECT id, created_at FROM ${TABLE_SCHEMA}.${TABLE_NAME} ORDER BY created_at DESC LIMIT 1`);

        console.log('Result fetched from last notification: ', result);

        return result.rows[0];
    }


    async insertNewNotification() {
        this.checkOrCreateTimerTable();

        console.log('Trying to insert timestamp');
        let result = await this.pool.query(`INSERT INTO ${TABLE_NAME} (created_at) VALUES (${Date.now()})`);
        console.log('Inserted into TABLE: ', result);


    }


    async checkOrCreateTimerTable() {
        await this.pool.query(`DROP TABLE ${TABLE_SCHEMA}.${TABLE_NAME}`);
        await this.pool.query(`CREATE TABLE IF NOT EXISTS ${TABLE_SCHEMA}.${TABLE_NAME} (
            id SERIAL,
            created_at bigint
        )`);            
    }
}