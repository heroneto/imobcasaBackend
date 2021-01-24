const { Sequelize } = require('sequelize');
const env = (process.env.NODE_ENV || 'development').trim()
const config = require('../database/config').database[env]
const { database, username, password, ...restConfig } = config
const sequelize = new Sequelize(
  database,
  username, 
  password,
  restConfig
  )
const db = {
    Sequelize: Sequelize,
    sequelize,
    User: sequelize.import("./user"),
    Lead: sequelize.import("./lead"),
    Form: sequelize.import("./form"),
    UsersForms: sequelize.import("./usersforms"),
    LeadSource: sequelize.import("./leadsource"),
    LeadStatus: sequelize.import("./leadstatus"),
    Task: sequelize.import("./task"),
    TaskType: sequelize.import("./tasktype"),
    Token: sequelize.import('./tokens')
}

Object.keys(db).forEach(model => {
    if ("associate" in db[model]) {
        db[model].associate(db)
    }
})

module.exports = db