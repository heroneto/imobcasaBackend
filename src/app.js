const Server = require('./Server')
const {
  FormController,
  LeadController,
  LoginController,
  TaskController,
  UserFormController,
  UserController,
  WebhookController,
  TokensController,
  FacebookController
} = require('./controllers')

const database = require('./database')


async function app() {
  try {
    await database()
    const server = new Server([
      new FormController(),
      new UserController(),
      new LoginController(),
      new UserFormController(),
      new LeadController(),
      new TaskController(),
      new WebhookController(),
      new TokensController(),
      new FacebookController()
    ])

    await server.listen()
  } catch (error) {
    console.error(error)
  }

}

app()