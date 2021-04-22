const { Router } = require('express')
const { LeadService } = require('../../services')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const {
  AuthenticationMiddleware,
  AuthorizationMiddleware
} = require('../../middlewares')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')


class LeadController {
  routes = Router()
  basePath = "/leads"
  getOnePath = `${this.basePath}/:id`
  getMyLeads = `${this.basePath}/`
  searchPath = `${this.basePath}/search/:value`
  listStatusPath = `/leads/status/list`

  constructor() {
    this.authenticationMid = new AuthenticationMiddleware()
    this.authorizationMid = new AuthorizationMiddleware()
    this._load()
  }

  async _load() {
    this.routes.route(this.basePath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.list)
      .post(this.create)
      .put(this.update)


    this.routes.route(this.getOnePath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.getOne)
      .delete(this.delete)

    this.routes.route(this.searchPath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.search)

    this.routes.route(this.listStatusPath)
      .all(this.authenticationMid.checkAuthentication)
      .get(this.listStatus)

  }

  async getOne(request, response) {
    try {
      const leadService = new LeadService()
      const lead = await leadService.getOne({
        ...request.params,
        ...request.locals
      })
      return response.status(200).json(lead)
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
      const leadService = new LeadService()
      const lead = await leadService.list({
        ...request.locals,
        ...request.query
      })
      return response.status(200).json(lead)
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

  async create(request, response) {
    try {
      const leadService = new LeadService()
      const lead = await leadService.create({
        ...request.body,
        ...request.locals
      })
      return response.status(200).json(lead)
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

  async update(request, response) {
    try {
      const leadService = new LeadService()
      const lead = await leadService.update({
        ...request.body,
        ...request.locals
      })
      return response.status(200).json(lead)
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

  async delete(request, response) {
    try {
      const leadService = new LeadService()
      const lead = await leadService.delete({
        ...request.params,
        ...request.locals
      })
      return response.status(200).json(lead)
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

  async search(request, response) {
    try {
      const leadService = new LeadService()
      const lead = await leadService.search({
        ...request.params,
        ...request.locals
      })
      return response.status(200).json(lead)
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

  async listStatus(request, response) {
    try {
      const leadService = new LeadService()
      const result = await leadService.listStatus()
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

module.exports = LeadController