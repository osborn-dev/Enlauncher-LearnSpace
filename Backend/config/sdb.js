const mysql = require('mysql2')
const dotenv = require('dotenv')
dotenv.config()

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'learnspace',
    password: process.env.SQL_PASSWORD
    
})

module.exports = pool.promise()