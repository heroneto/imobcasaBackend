const { Router } = require('express')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')
const { WebhookService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const AxiosException = require('../../helpers/Exceptions/AxiosException')
const { XHubSignatureMiddleware } = require('../../middlewares')

class LeadWebhookController {
  routes = Router()
  basePath = "/leads/facebook"

  constructor() {
    this._xHubSignatureMiddleware = new XHubSignatureMiddleware()
    this._load()
  }

  async _load() {
    this.routes.get(`${this.basePath}/sub`, this.subscrive)
    this.routes.route(`${this.basePath}`)
      .all(this._xHubSignatureMiddleware.checkSignature)
      .post(this.addLead)

  }


  async subscrive(request, response) {
    try {
      const webhookService = new WebhookService()
      const result = await webhookService.subscrive(request.query)
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

  async addLead(request, response){
    try {
      const webhookService = new WebhookService()
      const result = await webhookService.addLead(request.body)
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

module.exports = LeadWebhookController