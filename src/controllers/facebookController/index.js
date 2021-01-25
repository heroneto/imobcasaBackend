const { Router } = require('express')
const { FacebookService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')
const AxiosException = require('../../helpers/Exceptions/AxiosException')


class FacebookController {
  path = "/facebook/page/forms"
  routes = Router()


  constructor() {
    this.load()
  }

  load() {
    this.routes.get(this.path, this.listPageForms)
  }

  async listPageForms(request, response) {
    try {
      const facebookService = new FacebookService()
      const result = await facebookService.listPageForms(request.query)
      return response.status(200).json(result)
    } catch (err) {
      if(AxiosException(err)){
        const { status } = err.response
        const { message } = err.response.data.error
        return response.status(status).json(message)
      }
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }

}

module.exports = FacebookController