const Server = require('./Server')
const CampaignController = require('./controllers/campaign/CampaignController')
const UserController = require('./controllers/user/UserController')
const AuthenticationController = require('./controllers/authentication/AuthenticationController')

async function startServer(){ 
  try{
       
    const server = new Server([
      new CampaignController(),
      new UserController(),
      new AuthenticationController()
    ])
  
    await server.listen()
  }catch(error){
    console.error(error)
  }

}

module.exports = startServer