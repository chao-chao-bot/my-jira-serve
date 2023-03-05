const mysql = require('mysql')
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'jira_db'
})

module.exports = db
