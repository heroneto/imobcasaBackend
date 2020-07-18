const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})

module.exports = {
  "development": {
    "username": "root",
    "password": "root",
    "database": "imobcasa_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": "0",
    "logging": true
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "imobcasa_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    // "storage": "memory",
    "operatorsAliases": "0",
    "logging": false
  },
  "production": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": "imobcasa",
    "host": process.env.DBHOST,
    "dialect": "mysql",
    "operatorsAliases": "0",
    "logging": false
  }
}
