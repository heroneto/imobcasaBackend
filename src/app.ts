const server = require('./setup/server')
const startDatabase = require('./setup/database')

async function startApp(){
  await startDatabase()
  await server()
}


startApp()
