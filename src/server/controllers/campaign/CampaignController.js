const { Router } = require('express')
const CampaignService = require('../../services/CampaignService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { internalError } = require('../config').protocols
const { serverError } = require('../config').errors

class CampaignController {
  path = "/campaigns"
  routes = Router()
  constructor() {
    this.load()
  }

  load() {
    this.routes.get(this.path, this.getCampaigns)
    this.routes.get(`${this.path}/:id`, this.getOne)
    this.routes.post(this.path, this.createCampaign)
  }

  async getOne(request, response) {
    try {
      const campaignService = new CampaignService()
      const campaign = await campaignService.getOne(request.params)
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

  async getCampaigns(request, response) {
    try {
      const campaignService = new CampaignService()
      const campaigns = await campaignService.list()
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

  async createCampaign(req, res) {
    try {
      const campaignService = new CampaignService()
      const campaign = await campaignService.create(req.body)
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