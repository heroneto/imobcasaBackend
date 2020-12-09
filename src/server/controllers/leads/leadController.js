const { Router } = require('express')
const LeadService = require('../../services/LeadService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const AuthenticationMiddleware = require('../../middlewares/authentication')
const AuthorizationMiddleware = require('../../middlewares/authorization')
const { internalError } = require('../config').protocols
const { serverError } = require('../config').errors


class LeadController {
  routes = Router()
  basePath = "/leads"
  getOnePath = `${this.basePath}/:id`
  searchPath = `${this.basePath}/search/:value`

  constructor() {
    this.authenticationMid = new AuthenticationMiddleware()
    this.authorizationMid = new AuthorizationMiddleware()
    this._load()
  }

  async _load() {
    this.routes.route(this.basePath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this.list)
      .post(this.create)
      .put(this.update)
      

    this.routes.route(this.getOnePath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this.getOne)
      .delete(this.delete)

    this.routes.route(this.searchPath)
      .all(this.authenticationMid.checkAuthentication)
      .all(this.authorizationMid.checkAdminPrivileges)
      .get(this.search)
  }

  async getOne(request, response) {
    try {
      const leadService = new LeadService()
      const lead = await leadService.getOne(request.params)
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
      const lead = await leadService.list(request.params)
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
      const lead = await leadService.create(request.body)
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
      const lead = await leadService.update(request.body)
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
      const lead = await leadService.delete(request.params)
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
      const lead = await leadService.search(request.params)
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
}

module.exports = LeadController