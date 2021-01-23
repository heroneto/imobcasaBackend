const Server = require('./Server')
const {
  FormController,
  LeadController,
  LoginController,
  TaskController,
  UserCampaignController,
  UserController,
  WebhookController,
  TokensController
} = require('./controllers')

const database = require('./database')


async function app() {
  try {
    await database()
    const server = new Server([
      new FormController(),
      new UserController(),
      new LoginController(),
      new UserCampaignController(),
      new LeadController(),
      new TaskController(),
      new WebhookController(),
      new TokensController()
    ])

    await server.listen()
  } catch (error) {
    console.error(error)
  }

}

app()