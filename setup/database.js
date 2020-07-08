const Sequelize = require('sequelize')
const config = require('../config/database')
const models = require('../src/models')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const Umzug = require('umzug')
const env = process.env.NODE_ENV.trim()

const devUser = {
  username: "admin",
	fullName: "Administrador",
	password: "admin",
	admin: true
}

const startDatabase = async () => {
  try{
    const sequelize = new Sequelize(config[env])
    const umzug = new Umzug({
      migrations: {
        path: path.join(__dirname, '../database/migrations'),
        params: [
          sequelize.getQueryInterface(),
          Sequelize
        ]
      },
      storage: 'sequelize',
      storageOptions: {
        sequelize: sequelize
      }
    })
    await umzug.up()
    
    if(env === 'development'){
        const User = models.User
        await User.findOrCreate({
          where: {username: devUser.username},
          defaults: devUser
        })
    }

  }catch(err){
    console.log(err)
  }
}

module.exports = startDatabase