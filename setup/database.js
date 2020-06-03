const Sequelize = require('sequelize')
const config = require('../config/database')
const models = require('../src/models')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const env = process.env.NODE_ENV || 'development'


const devUser = {
  username: "Vagner",
	fullName: "Vagner Zanella",
	email: "vagner@email.com",
	password: "123Mudar",
	manager: true
}

const startDatabase = async (env) => {
  try{
    const sequelize = new Sequelize(config[env])
    await models.sequelize.sync({force: true})

    if(env === 'development'){
      const User = require('../src/models/').User
      const user = await User.findOrCreate({
        where: {username: devUser.username},
        defaults: devUser
      })
    }

  }catch(err){
    console.log(err)
  }
}

module.exports = startDatabase