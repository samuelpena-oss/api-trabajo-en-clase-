require("dotenv").config()
const mysql = require("mysql2")

const pool = mysql.createPool({
 host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'registros_db',
});

module.exports = pool;
