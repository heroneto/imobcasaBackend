import {Sequelize}  from 'sequelize'
import config from '../../config/database'
import models from '../../models'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({path: path.resolve(__dirname, '../.env')})
import Umzug from 'umzug'
import { migrationsConfig, seedConfig } from '../../config/databaseMigrations'
const env = process.env.NODE_ENV.trim()

const devUser = {
  username: "admin",
	fullName: "Administrador",
	password: "admin",
	admin: true
}

export default async function databaseSetup(){
  try{
    const sequelize = new Sequelize(config[env]) 
    const migrator = new Umzug(migrationsConfig(Sequelize, sequelize))
    const seeder = new Umzug(seedConfig(Sequelize, sequelize))
    
    await migrator.up()
    await seeder.up()
        
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