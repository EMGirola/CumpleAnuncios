const { Pool } = require('pg');

const TABLE_NAME = "notifications";
const TABLE_SCHEMA = "public";

module.exports = class {
    

    constructor(){
        this.pool = new Pool({
            user: process.env.USER_DATABASE,
            host: process.env.DATABASE_HOST,
            database: process.env.DATABASE_NAME,
            password: process.env.DATABASE_PASSWORD,
            port: process.env.DATABASE_PORT || 5432,
        });
    }


    async fetchLastNotification() {
        this.checkOrCreateTimerTable();

        let result = await this.pool.query(`SELECT id, created_at FROM ${TABLE_SCHEMA}.${TABLE_NAME} ORDER BY created_at DESC LIMIT 1`);

        return result.rows[0];
    }


    async insertNewNotification() {
        this.checkOrCreateTimerTable();

        let twoAmArgentina = new Date();
        
        twoAmArgentina.setHours(Number(process.env.MIN_HOURS));
        twoAmArgentina.setMinutes(1);
        twoAmArgentina.setSeconds(0);

        await this.pool.query(`INSERT INTO ${TABLE_NAME} (created_at) VALUES (${twoAmArgentina.getTime()})`);

    }


    async checkOrCreateTimerTable() {
        await this.pool.query(`CREATE TABLE IF NOT EXISTS ${TABLE_SCHEMA}.${TABLE_NAME} (
            id SERIAL,
            created_at bigint
        )`);            
    }
}