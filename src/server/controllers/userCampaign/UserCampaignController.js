const { Router } = require('express')
const UserCamapignService = require('../../services/UserCampaingService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { internalError } = require('../config').protocols
const { serverError } = require('../config').errors

class UserCampaignController{
  path = "/campaign/:campaignid/user/:userid"
  listPath = "/campaign/:campaignid/users/"
  routes = Router()
  constructor() {
    this.load()
  }

  load() {
    this.routes.get(this.listPath, this.list)
    this.routes.post(this.path, this.add)
    this.routes.delete(this.path, this.remove)
  }

  async list(request, response){
    try {
      const userCamapignService = new UserCamapignService()
      const result = await userCamapignService.list(request.params)
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

  async add(request,response){
    try {
      const userCamapignService = new UserCamapignService()
      const result = await userCamapignService.add(request.params)
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

  async remove(request,response){
    try {
      const userCamapignService = new UserCamapignService()
      const result = await userCamapignService.remove(request.params)
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

module.exports = UserCampaignController