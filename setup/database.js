const {Sequelize} = require('sequelize')
const config = require('../config/database')
const models = require('../src/models')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const Umzug = require('umzug')
const env = process.env.NODE_ENV.trim()
const { migrationsConfig, seedConfig } = require('../config/databaseMigrations')

const devUser = {
  username: "admin",
	fullName: "Administrador",
	password: "admin",
	admin: true
}

const startDatabase = async () => {
  try{
    const sequelize = new Sequelize(config[env]) 
    const migrator = new Umzug(migrationsConfig(Sequelize, sequelize))
    const seeder = new Umzug(seedConfig(Sequelize, sequelize))
    
    await migrator.up()
    if(env !== 'test'){
      await seeder.up()
    }
        
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