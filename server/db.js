const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({
    // user: process.env.USERNAME,
    // password: process.env.PASSWORD,
    // host: process.env.HOST,
    // port: process.env.DBPORT,
    // database: process.env.DATABASE,

    user: "postgres",
    password: "vogiahuy97",
    host: "localhost",
    port: 5432,
    database: "todoweb",
});

module.exports = pool;

