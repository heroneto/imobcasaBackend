const { Router } = require('express')
const { FormService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')

class CampaignController {
  path = "/campaigns"
  routes = Router()
  constructor() {
    this.load()
  }

  load() {
    this.routes.get(this.path, this.list)
    this.routes.get(`${this.path}/:id`, this.getOne)
    this.routes.post(this.path, this.create)
    this.routes.put(`${this.path}/:id/inactivate`, this.inactivate)
    this.routes.put(`${this.path}/:id/activate`, this.activate)
  }

  async activate(request, response) {
    try {
      const formService = new FormService()
      const result = await formService.activate(request.params)
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

  async inactivate(request, response) {
    try {
      const formService = new FormService()
      const result = await formService.inactivate(request.params)
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

  async getOne(request, response) {
    try {
      const formService = new FormService()
      const campaign = await formService.getOne(request.params)
      return response.status(200).json(campaign)
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

  async list(request, response) {
    try {
      const formService = new FormService()
      const campaigns = await formService.list()
      return response.status(200).json(campaigns)
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

  async create(req, res) {
    try {
      const formService = new FormService()
      const campaign = await formService.create(req.body)
      return res.status(201).json(campaign)
    } catch (err) {
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return res.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }

}

module.exports = CampaignController