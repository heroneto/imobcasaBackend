const Sequelize = require('sequelize')
const config = require('../config/database')
const models = require('../src/models')

const startDatabase = async (env) => {
  try{
    const sequelize = new Sequelize(config[env])
    await models.sequelize.sync({force: true})
  }catch(err){
    console.log(err)
  }
}

module.exports = startDatabase