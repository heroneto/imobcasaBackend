const { Router }  = require('express')
const CampaignService = require('../../services/CampaignService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const { internalError } = require('../config').protocols
const { serverError } = require('../config').errors

class CampaignController {
  path = "/campaigns"
  routes = Router()
  constructor(){
    this.load()
  }

  load(){
    this.routes.get(this.path, this.createCampaign)
    this.routes.post(this.path, this.createCampaign)
  }

  
  async getCampaign(request,response){
    return response.status(200).json("Hello World")
  }

  async createCampaign(req, res){
    try{
      const campaignService = new CampaignService()
      const campaign = await campaignService.create(req.body)
      return res.status(201).json(campaign)
    }catch(err){
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