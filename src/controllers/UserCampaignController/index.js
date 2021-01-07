const { Router } = require('express')
const { UserCampaignService } = require('../../services/')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')

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
    this.routes.put(this.path, this.update)
    this.routes.put(`${this.path}/enable`, this.enable)
    this.routes.put(`${this.path}/disable`, this.disable)
  }

  async list(request, response){
    try {
      const userCampaignService = new UserCampaignService()
      const result = await userCampaignService.list(request.params)
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
      const userCampaignService = new UserCampaignService()
      const result = await userCampaignService.add(request.params)
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
      const userCampaignService = new UserCampaignService()
      const result = await userCampaignService.remove(request.params)
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

  async update(request,response){
    try {
      const userCampaignService = new UserCampaignService()
      const result = await userCampaignService.update({
        ...request.params,
        ...request.body
      })
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

  async enable(request, response){
    try {
      const userCampaignService = new UserCampaignService()
      const result = await userCampaignService.enable(request.params)
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

  async disable(request, response){
    try {
      const userCampaignService = new UserCampaignService()
      const result = await userCampaignService.disable(request.params)
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