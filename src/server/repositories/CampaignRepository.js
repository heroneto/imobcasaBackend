const Campaign = require('../models').Campaign


export class CampaignRepository {

  async create (fields) {
    const campaign = await Campaign.create(fields)
    return campaign
  }
  getOne = () => {

  }
  list = () => {

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