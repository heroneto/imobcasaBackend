const Campaign = require('../models').Campaign


class CampaignRepository {

  async create (fields) {
    return await Campaign.create(fields)
  }
  async getOne(fields){
    return await Campaign.findOne({
      where: {
        id: fields.id
      }
    })
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

module.exports = CampaignRepository