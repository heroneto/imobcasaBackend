const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

module.exports = {
  "development": {
    "username": "root",
    "password": "root",
    "database": "imobcasa_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false,
    "logging": false
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "imobcasa_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false,
    "logging": false
  },
  "production": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": "imobcasa",
    "host": process.env.DBHOST,
    "dialect": "mysql",
    "operatorsAliases": false,
    "logging": false
  }
}
