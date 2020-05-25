const server = require('./setup/server')



async function startApp(){
  await server()
}


startApp()
