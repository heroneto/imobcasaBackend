const Campaign = require('../models').Campaign


export class CampaignRepository {

  async create (fields) {
    return await Campaign.create(fields)
  }
  getOne = () => {

  }

  async list(){
    return await Campaign.findAll()
  }

  inactivate = () => {

  }
  activate = () => {

  }
  addUser = () => {

  }
  removeUser = () => {

  }

}

// module.exports = {CampaignRepository}