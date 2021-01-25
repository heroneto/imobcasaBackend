const { LeadSource } = require('../../models')


class LeadSourceRepository {

  async getOne(fields){    
    return await LeadSource.findOne({
      where: {
        id: fields.id
      }
    })
  }

  async getFacebookSourceID(){
    return await LeadSource.findOne({
      where: {
        name: "Facebook"
      }
    })
  }

}

module.exports = LeadSourceRepository