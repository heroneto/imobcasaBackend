const server = require('./setup/server')
const startDatabase = require('./setup/database')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname,'.env')})

async function startApp(){
  await startDatabase(process.env.NODE_ENV || 'development')
  await server()
}


startApp()
