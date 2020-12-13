const Server = require('./Server')
const CampaignController = require('./controllers/campaign/CampaignController')
const UserController = require('./controllers/user/UserController')
const AuthenticationController = require('./controllers/authentication/AuthenticationController')
const UserCampaignController = require('./controllers/userCampaign/UserCampaignController')
const LeadController = require('./controllers/leads/LeadController')
const database = require('./database')


async function app(){ 
  try{
    await database()
    const server = new Server([
      new CampaignController(),
      new UserController(),
      new AuthenticationController(),
      new UserCampaignController(),
      new LeadController()
    ])
  
    await server.listen()
  }catch(error){
    console.error(error)
  }

}

app()