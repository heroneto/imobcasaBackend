const { LeadStatus } = require('../../models')


class LeadStatusRepository {

  async getOne(fields){    
    return await LeadStatus.findOne({
      where: {
        id: fields.id
      }
    })
  }

  async getBacklogStatusID(){
    return await LeadStatus.findOne({
      where: {
        order: 1
      }
    })
  }

  async list(){
    return await LeadStatus.findAll()
  }

}

module.exports = LeadStatusRepository