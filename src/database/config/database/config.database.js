const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})

module.exports = {
  "development": {
    "username": "root",
    "password": "root",
    "database": "imobcasa_development",
    "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": "database.sqlite",
    "operatorsAliases": "0",
    "logging": true
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "imobcasa_test",
    "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": "database.test.sqlite",
    "operatorsAliases": "0",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": "imobcasa",
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "operatorsAliases": "0",
    "logging": false,
    "dialectOptions": {
      "ssl": {
        "key": process.env.DB_SSL_KEY.replace(/\\n/gm, '\n'),
        "cert": process.env.DB_SSL_CERT.replace(/\\n/gm, '\n'),
        "ca": process.env.DB_SSL_CA.replace(/\\n/gm, '\n')
      }
    }    
  }
}
