const Server = require('./Server')
const CampaignController = require('./controllers/campaign/CampaignController')
const UserController = require('./controllers/user/UserController')
const AuthenticationController = require('./controllers/authentication/AuthenticationController')
const UserCampaignController = require('./controllers/userCampaign/UserCampaignController')

async function startServer(){ 
  try{
       
    const server = new Server([
      new CampaignController(),
      new UserController(),
      new AuthenticationController(),
      new UserCampaignController()
    ])
  
    await server.listen()
  }catch(error){
    console.error(error)
  }

}

module.exports = startServer