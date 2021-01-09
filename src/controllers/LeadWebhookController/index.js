const { Router } = require('express')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')
const { LeadWebhookService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')


class LeadWebhookController {
  routes = Router()
  basePath = "/leads/facebook"

  constructor() {
    this._load()
  }

  async _load() {
    this.routes.get(`${this.basePath}/sub`, this.subscrive)
  }


  async subscrive(request, response) {
    try {
      const leadWebhookService = new LeadWebhookService()
      const result = await leadWebhookService.subscrive(request.query)
      return response.status(200).json(result)
    } catch (err) {
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

module.exports = LeadWebhookController