const {Campaign} = require('../../models')


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

  async inactivate(fields){
    return await Campaign.update({
      active: false
    }, {
      where: {
        id: fields.id
      }
    })    
  }
  async activate(fields){
    return await Campaign.update({
      active: true
    }, {
      where: {
        id: fields.id
      }
    })    
  }
  addUser = () => {

  }
  removeUser = () => {

  }

}

module.exports = CampaignRepository