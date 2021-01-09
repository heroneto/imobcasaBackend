const Server = require('./Server')
const {
  CampaignController,
  LeadController,
  LoginController,
  TaskController,
  UserCampaignController,
  UserController,
  LeadWebhookController
} = require('./controllers')

const database = require('./database')


async function app() {
  try {
    await database()
    const server = new Server([
      new CampaignController(),
      new UserController(),
      new LoginController(),
      new UserCampaignController(),
      new LeadController(),
      new TaskController(),
      new LeadWebhookController()
    ])

    await server.listen()
  } catch (error) {
    console.error(error)
  }

}

app()