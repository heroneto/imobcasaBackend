const {Sequelize}  = require('sequelize')
const config = require('./config').database
const models = require('../server/models')
const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})
const Umzug = require('umzug')
const { migrationsConfig, seedConfig } = require('./config').migrations



const env = (process.env.NODE_ENV || 'development').trim()

const devUser = {
  username: "admin",
	fullName: "Administrador",
	password: "admin",
	admin: true
}

async function database(){
  try{
    const sequelize = new Sequelize(config[env]) 
    const migrator = new Umzug(migrationsConfig(Sequelize, sequelize))
    const seeder = new Umzug(seedConfig(Sequelize, sequelize))
    
    await migrator.up()
    await seeder.up()
    
        
    if(env === 'development'){
        const User = models.users
        await User.findOrCreate({
          where: {username: devUser.username},
          defaults: devUser
        })
    }

  }catch(err){
    console.log(err)
  }
}

module.exports = database